/**
 * Button Component TypeScript
 * Converted from NHS UK Design System button component
 */

import { createElement } from '@/core/functions/dom-utils'
import { t } from '@/core/functions/i18n'

/**
 * Button element types
 */
export type ButtonElement = 'button' | 'a' | 'input'

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'secondary-solid' | 'reverse' | 'warning' | 'success'

/**
 * Button types for button/input elements
 */
export type ButtonType = 'submit' | 'button' | 'reset'

/**
 * Button component configuration options
 */
export interface ButtonConfig {
  text?: string
  html?: string
  element?: ButtonElement
  variant?: ButtonVariant
  type?: ButtonType
  href?: string
  name?: string
  value?: string
  disabled?: boolean
  preventDoubleClick?: boolean
  classes?: string
  attributes?: Record<string, string>
  onClick?: (event: Event) => void
}

/**
 * Button component instance
 */
export interface ButtonComponent {
  element: HTMLButtonElement | HTMLAnchorElement | HTMLInputElement
  config: ButtonConfig
  destroy: () => void
  disable?: () => void
  enable?: () => void
  setLoading?: (loading: boolean) => void
}

/**
 * Default configuration for buttons
 */
const DEFAULT_CONFIG: Required<Omit<ButtonConfig, 'onClick' | 'href' | 'name' | 'value' | 'html'>> & { 
  onClick?: ButtonConfig['onClick']
  href?: string | undefined
  name?: string | undefined
  value?: string | undefined
  html?: string | undefined
} = {
  text: t('common.submit'),
  html: undefined,
  element: 'button',
  variant: 'primary',
  type: 'submit',
  href: undefined,
  name: undefined,
  value: undefined,
  disabled: false,
  preventDoubleClick: false,
  classes: '',
  attributes: {},
  onClick: undefined
}

/**
 * Double-click prevention timer
 */
let debounceTimer: number | null = null
const DEBOUNCE_TIMEOUT = 1000 // 1 second

/**
 * Create a Button component
 */
export const createButton = (config: ButtonConfig): ButtonComponent => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Determine element type automatically if not specified
  if (!config.element) {
    if (config.href) {
      finalConfig.element = 'a'
    } else {
      finalConfig.element = 'button'
    }
  }

  // Create base attributes
  const baseClasses = [
    'public-good-button',
    finalConfig.variant !== 'primary' ? `public-good-button--${finalConfig.variant}` : '',
    finalConfig.classes
  ].filter(Boolean).join(' ')

  const baseAttributes: Record<string, string> = {
    class: baseClasses,
    'data-module': 'public-good-button'
  }

  // Add prevent double click data attribute
  if (finalConfig.preventDoubleClick) {
    baseAttributes['data-prevent-double-click'] = 'true'
  }

  // Add custom attributes
  Object.assign(baseAttributes, finalConfig.attributes)

  let element: HTMLButtonElement | HTMLAnchorElement | HTMLInputElement

  // Create specific element types
  if (finalConfig.element === 'a') {
    element = createElement('a', {
      ...baseAttributes,
      href: finalConfig.href || '#',
      role: 'button',
      draggable: 'false'
    }) as HTMLAnchorElement

    // Add content
    if (finalConfig.html) {
      element.innerHTML = finalConfig.html
    } else {
      element.textContent = finalConfig.text
    }

  } else if (finalConfig.element === 'input') {
    element = createElement('input', {
      ...baseAttributes,
      type: finalConfig.type,
      value: finalConfig.text,
      ...(finalConfig.name && { name: finalConfig.name }),
      ...(finalConfig.disabled && { disabled: 'true', 'aria-disabled': 'true' })
    }) as HTMLInputElement

  } else {
    // button element
    element = createElement('button', {
      ...baseAttributes,
      type: finalConfig.type,
      ...(finalConfig.name && { name: finalConfig.name }),
      ...(finalConfig.value && { value: finalConfig.value }),
      ...(finalConfig.disabled && { disabled: 'true', 'aria-disabled': 'true' })
    }) as HTMLButtonElement

    // Add content
    if (finalConfig.html) {
      element.innerHTML = finalConfig.html
    } else {
      element.textContent = finalConfig.text
    }
  }

  // Event handlers
  const handleClick = (event: Event): void => {
    // Handle double-click prevention
    if (finalConfig.preventDoubleClick && element.dataset.preventDoubleClick === 'true') {
      if (debounceTimer) {
        event.preventDefault()
        return
      }

      debounceTimer = window.setTimeout(() => {
        debounceTimer = null
      }, DEBOUNCE_TIMEOUT)
    }

    // Call custom onClick handler if provided
    if (finalConfig.onClick) {
      finalConfig.onClick(event)
    }

    // Analytics tracking
    const customEvent = new CustomEvent('public-good:button:click', {
      bubbles: true,
      detail: {
        text: finalConfig.text,
        variant: finalConfig.variant,
        element: finalConfig.element,
        href: finalConfig.element === 'a' ? finalConfig.href : undefined
      }
    })
    element.dispatchEvent(customEvent)
  }

  // Keyboard event handling for enhanced accessibility
  const handleKeydown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent
    // Space key should trigger click for elements with role="button"
    if (keyboardEvent.key === ' ' && element.getAttribute('role') === 'button') {
      keyboardEvent.preventDefault()
      ;(element as HTMLElement).click()
    }
  }

  // Add event listeners
  element.addEventListener('click', handleClick)
  if (finalConfig.element === 'a') {
    element.addEventListener('keydown', handleKeydown)
  }

  // Disable/enable functions
  const disable = (): void => {
    if (finalConfig.element !== 'a') {
      ;(element as HTMLButtonElement | HTMLInputElement).disabled = true
      element.setAttribute('aria-disabled', 'true')
    }
    element.classList.add('public-good-button--disabled')
  }

  const enable = (): void => {
    if (finalConfig.element !== 'a') {
      ;(element as HTMLButtonElement | HTMLInputElement).disabled = false
      element.removeAttribute('aria-disabled')
    }
    element.classList.remove('public-good-button--disabled')
  }

  // Loading state function
  const setLoading = (loading: boolean): void => {
    if (loading) {
      element.classList.add('public-good-button--loading')
      element.setAttribute('aria-busy', 'true')
      
      // Store original text/html
      const originalContent = finalConfig.html || finalConfig.text
      element.dataset.originalContent = originalContent
      
      // Set loading text
      if (finalConfig.element !== 'input') {
        element.innerHTML = `<span class="public-good-button__spinner"></span> ${t('common.loading')}`
      }
      
      // Disable during loading
      disable()
    } else {
      element.classList.remove('public-good-button--loading')
      element.removeAttribute('aria-busy')
      
      // Restore original content
      const originalContent = element.dataset.originalContent
      if (originalContent && finalConfig.element !== 'input') {
        if (finalConfig.html) {
          element.innerHTML = originalContent
        } else {
          element.textContent = originalContent
        }
      }
      
      // Re-enable if not explicitly disabled
      if (!finalConfig.disabled) {
        enable()
      }
    }
  }

  // Return component instance
  const component: ButtonComponent = {
    element: element,
    config: finalConfig as ButtonConfig,
    destroy: (): void => {
      element.removeEventListener('click', handleClick)
      if (finalConfig.element === 'a') {
        element.removeEventListener('keydown', handleKeydown)
      }
      element.remove()
    },
    disable: disable,
    enable: enable,
    setLoading: setLoading
  }

  return component
}

/**
 * Initialize all buttons on the page
 */
export const initializeButtons = (container: Document | Element = document): ButtonComponent[] => {
  const buttons: ButtonComponent[] = []
  const elements = container.querySelectorAll('[data-public-good-button]')

  elements.forEach((element) => {
    try {
      // Extract configuration from data attributes
      const href = element.getAttribute('data-href')
      const dataElement = element.getAttribute('data-element') as ButtonElement
      
      const config: ButtonConfig = {
        ...(element.getAttribute('data-text') && { text: element.getAttribute('data-text')! }),
        ...(element.getAttribute('data-html') && { html: element.getAttribute('data-html')! }),
        element: dataElement || (href ? 'a' : 'button'), // Auto-detect element type
        variant: (element.getAttribute('data-variant') as ButtonVariant) || 'primary',
        type: (element.getAttribute('data-type') as ButtonType) || 'submit',
        ...(href && { href }),
        ...(element.getAttribute('data-name') && { name: element.getAttribute('data-name')! }),
        ...(element.getAttribute('data-value') && { value: element.getAttribute('data-value')! }),
        disabled: element.getAttribute('data-disabled') === 'true',
        preventDoubleClick: element.getAttribute('data-prevent-double-click') === 'true',
        ...(element.getAttribute('data-classes') && { classes: element.getAttribute('data-classes')! }),
        attributes: {}
      }

      // Parse additional attributes
      const attributesData = element.getAttribute('data-attributes')
      if (attributesData) {
        try {
          config.attributes = JSON.parse(attributesData)
        } catch (error) {
          console.warn('Failed to parse button attributes:', error)
        }
      }

      // Create component and replace element
      const button = createButton(config)
      element.parentNode?.replaceChild(button.element, element)
      buttons.push(button)
    } catch (error) {
      console.error('Failed to initialize button:', error)
    }
  })

  return buttons
}

/**
 * Create a submit button with loading state
 */
export const createSubmitButton = (config: Omit<ButtonConfig, 'type'> = {}): ButtonComponent => {
  return createButton({
    ...config,
    type: 'submit',
    text: config.text || t('common.submit')
  })
}

/**
 * Create a cancel/reset button
 */
export const createCancelButton = (config: Omit<ButtonConfig, 'type' | 'variant'> = {}): ButtonComponent => {
  return createButton({
    ...config,
    type: 'button',
    variant: 'secondary',
    text: config.text || t('common.cancel')
  })
}

/**
 * Create a link button
 */
export const createLinkButton = (href: string, config: Omit<ButtonConfig, 'href' | 'element'> = {}): ButtonComponent => {
  return createButton({
    ...config,
    element: 'a',
    href: href
  })
}

/**
 * Create a warning/destructive action button
 */
export const createWarningButton = (config: Omit<ButtonConfig, 'variant'> = {}): ButtonComponent => {
  return createButton({
    ...config,
    variant: 'warning',
    text: config.text || t('common.delete')
  })
}

/**
 * Utility function to create a button group
 */
export const createButtonGroup = (buttons: ButtonComponent[], classes = ''): HTMLElement => {
  const group = createElement('div', {
    class: `public-good-button-group${classes ? ` ${classes}` : ''}`
  })

  buttons.forEach(button => {
    group.appendChild(button.element)
  })

  return group
}

/**
 * Global keyboard handler for role="button" elements
 */
const handleGlobalKeydown = (event: KeyboardEvent): void => {
  const target = event.target as HTMLElement
  
  // Handle space bar only
  if (event.key !== ' ') {
    return
  }

  // Handle elements with [role="button"] only
  if (target && target.getAttribute('role') === 'button') {
    event.preventDefault()
    target.click()
  }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeButtons()
    document.addEventListener('keydown', handleGlobalKeydown)
  })
} else {
  initializeButtons()
  document.addEventListener('keydown', handleGlobalKeydown)
}