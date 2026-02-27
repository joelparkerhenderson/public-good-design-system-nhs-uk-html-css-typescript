/**
 * Checkboxes Component TypeScript
 * Converted from NHS UK Design System checkboxes component
 */

import { createElement } from '@/core/functions/dom-utils'
import { t } from '@/core/functions/i18n'

/**
 * Checkbox item configuration
 */
export interface CheckboxItem {
  text?: string
  html?: string
  id?: string
  name?: string
  value: string
  checked?: boolean
  disabled?: boolean
  divider?: string
  hint?: {
    text?: string
    html?: string
    classes?: string
    attributes?: Record<string, string>
  }
  conditional?: {
    html: string
  }
  exclusive?: boolean
  exclusiveGroup?: string
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Fieldset configuration for checkboxes
 */
export interface CheckboxFieldset {
  legend?: {
    text?: string
    html?: string
    classes?: string
    isPageHeading?: boolean
  }
  classes?: string
  attributes?: Record<string, string>
  describedBy?: string
}

/**
 * Checkboxes component configuration options
 */
export interface CheckboxesConfig {
  name: string
  items: CheckboxItem[]
  fieldset?: CheckboxFieldset
  hint?: {
    text?: string
    html?: string
    classes?: string
    attributes?: Record<string, string>
  }
  errorMessage?: {
    text?: string
    html?: string
    classes?: string
    attributes?: Record<string, string>
  }
  describedBy?: string
  idPrefix?: string
  values?: string[]
  classes?: string
  attributes?: Record<string, string>
  formGroup?: {
    classes?: string
    attributes?: Record<string, string>
  }
}

/**
 * Checkboxes component instance
 */
export interface CheckboxesComponent {
  element: HTMLElement
  config: CheckboxesConfig
  destroy: () => void
  getValues: () => string[]
  setValues: (values: string[]) => void
  checkAll: () => void
  uncheckAll: () => void
  toggle: (value: string) => void
  validate: () => boolean
  setError: (message: string) => void
  clearError: () => void
}

/**
 * Default configuration for checkboxes
 */
const DEFAULT_CONFIG: Partial<CheckboxesConfig> = {
  idPrefix: '',
  values: [],
  classes: '',
  attributes: {},
  formGroup: { classes: '', attributes: {} }
}

/**
 * Create a Checkboxes component
 */
export const createCheckboxes = (config: CheckboxesConfig): CheckboxesComponent => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const idPrefix = finalConfig.idPrefix || finalConfig.name

  // Create form group wrapper
  const formGroupClasses = [
    'public-good-form-group',
    finalConfig.errorMessage ? 'public-good-form-group--error' : '',
    finalConfig.formGroup?.classes || ''
  ].filter(Boolean).join(' ')

  const formGroup = createElement('div', {
    class: formGroupClasses,
    ...finalConfig.formGroup?.attributes
  })

  // Track described by elements for accessibility
  let describedBy = finalConfig.describedBy || ''
  if (finalConfig.fieldset?.describedBy) {
    describedBy = finalConfig.fieldset.describedBy
  }

  let _innerContent = ''

  // Create fieldset if provided
  if (finalConfig.fieldset) {
    const fieldsetElement = createElement('fieldset', {
      class: `public-good-fieldset${finalConfig.fieldset.classes ? ` ${finalConfig.fieldset.classes}` : ''}`,
      ...(describedBy && { 'aria-describedby': describedBy }),
      ...finalConfig.fieldset.attributes
    })

    // Create legend if provided
    if (finalConfig.fieldset.legend) {
      const legendClasses = [
        'public-good-fieldset__legend',
        finalConfig.fieldset.legend.classes || ''
      ].filter(Boolean).join(' ')

      const legend = createElement(
        finalConfig.fieldset.legend.isPageHeading ? 'h1' : 'legend',
        { class: legendClasses }
      )

      if (finalConfig.fieldset.legend.html) {
        legend.innerHTML = finalConfig.fieldset.legend.html
      } else {
        legend.textContent = finalConfig.fieldset.legend.text || ''
      }

      fieldsetElement.appendChild(legend)
    }

    formGroup.appendChild(fieldsetElement)
    _innerContent = 'fieldset'
  }

  // Create hint if provided
  let hintElement: HTMLElement | null = null
  if (finalConfig.hint) {
    const hintId = `${idPrefix}-hint`
    describedBy = describedBy ? `${describedBy} ${hintId}` : hintId

    hintElement = createElement('div', {
      id: hintId,
      class: `public-good-hint${finalConfig.hint.classes ? ` ${finalConfig.hint.classes}` : ''}`,
      ...finalConfig.hint.attributes
    })

    if (finalConfig.hint.html) {
      hintElement.innerHTML = finalConfig.hint.html
    } else {
      hintElement.textContent = finalConfig.hint.text || ''
    }

    const target = finalConfig.fieldset ? formGroup.querySelector('.public-good-fieldset') : formGroup
    target?.appendChild(hintElement)
  }

  // Create error message if provided
  let errorElement: HTMLElement | null = null
  if (finalConfig.errorMessage) {
    const errorId = `${idPrefix}-error`
    describedBy = describedBy ? `${describedBy} ${errorId}` : errorId

    errorElement = createElement('div', {
      id: errorId,
      class: `public-good-error-message${finalConfig.errorMessage.classes ? ` ${finalConfig.errorMessage.classes}` : ''}`,
      ...finalConfig.errorMessage.attributes
    })

    const errorIcon = createElement('span', {
      class: 'public-good-sr-only'
    })
    errorIcon.textContent = t('form.error') + ': '

    errorElement.appendChild(errorIcon)

    const errorText = createElement('span')
    if (finalConfig.errorMessage.html) {
      errorText.innerHTML = finalConfig.errorMessage.html
    } else {
      errorText.textContent = finalConfig.errorMessage.text || ''
    }
    errorElement.appendChild(errorText)

    const target = finalConfig.fieldset ? formGroup.querySelector('.public-good-fieldset') : formGroup
    target?.appendChild(errorElement)
  }

  // Check if any items have conditional content
  const hasConditional = finalConfig.items.some(item => item.conditional)

  // Create checkboxes container
  const checkboxesClasses = [
    'public-good-checkboxes',
    hasConditional ? 'public-good-checkboxes--conditional' : '',
    finalConfig.classes
  ].filter(Boolean).join(' ')

  const checkboxesContainer = createElement('div', {
    class: checkboxesClasses,
    'data-module': 'public-good-checkboxes',
    ...finalConfig.attributes
  })

  // Create checkbox items
  const checkboxInputs: HTMLInputElement[] = []
  finalConfig.items.forEach((item, index) => {
    // Handle divider items
    if (item.divider) {
      const divider = createElement('div', {
        class: 'public-good-checkboxes__divider'
      })
      divider.textContent = item.divider
      checkboxesContainer.appendChild(divider)
      return
    }

    // Generate IDs
    const itemId = item.id || `${idPrefix}${index > 0 ? `-${index + 1}` : ''}`
    const itemName = item.name || finalConfig.name
    const conditionalId = `conditional-${itemId}`
    const hasHint = !!(item.hint?.text || item.hint?.html)
    const itemHintId = `${itemId}-item-hint`

    // Check if item should be checked
    const isChecked = item.checked !== undefined 
      ? item.checked 
      : finalConfig.values?.includes(item.value) || false

    // Create checkbox item container
    const itemContainer = createElement('div', {
      class: 'public-good-checkboxes__item'
    })

    // Create checkbox input
    const input = createElement('input', {
      class: 'public-good-checkboxes__input',
      id: itemId,
      name: itemName,
      type: 'checkbox',
      value: item.value,
      ...(isChecked && { checked: 'checked' }),
      ...(item.disabled && { disabled: 'disabled' }),
      ...(item.exclusive && { 'data-checkbox-exclusive': '' }),
      ...(item.exclusiveGroup && { 'data-checkbox-exclusive-group': item.exclusiveGroup }),
      ...(item.conditional && { 
        'aria-controls': conditionalId,
        'aria-expanded': isChecked ? 'true' : 'false'
      }),
      ...(hasHint && { 'aria-describedby': itemHintId }),
      ...item.attributes
    }) as HTMLInputElement

    checkboxInputs.push(input)
    itemContainer.appendChild(input)

    // Create label
    const label = createElement('label', {
      class: `public-good-checkboxes__label${item.classes ? ` ${item.classes}` : ''}`,
      for: itemId
    })

    if (item.html) {
      label.innerHTML = item.html
    } else {
      label.textContent = item.text || ''
    }

    itemContainer.appendChild(label)

    // Create hint if provided
    if (hasHint) {
      const hint = createElement('div', {
        id: itemHintId,
        class: `public-good-checkboxes__hint${item.hint?.classes ? ` ${item.hint.classes}` : ''}`,
        ...item.hint?.attributes
      })

      if (item.hint?.html) {
        hint.innerHTML = item.hint.html
      } else {
        hint.textContent = item.hint?.text || ''
      }

      itemContainer.appendChild(hint)
    }

    checkboxesContainer.appendChild(itemContainer)

    // Create conditional content if provided
    if (item.conditional) {
      const conditionalClasses = [
        'public-good-checkboxes__conditional',
        !isChecked ? 'public-good-checkboxes__conditional--hidden' : ''
      ].filter(Boolean).join(' ')

      const conditional = createElement('div', {
        id: conditionalId,
        class: conditionalClasses
      })

      conditional.innerHTML = item.conditional.html
      checkboxesContainer.appendChild(conditional)
    }
  })

  // Add checkboxes container to the appropriate parent
  const target = finalConfig.fieldset ? formGroup.querySelector('.public-good-fieldset') : formGroup
  target?.appendChild(checkboxesContainer)

  // Event handlers
  const handleClick = (event: Event): void => {
    const target = event.target as HTMLElement
    
    if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
      return
    }

    // Handle conditional reveals
    const hasAriaControls = target.getAttribute('aria-controls')
    if (hasAriaControls) {
      syncConditionalReveal(target)
    }

    // Handle exclusive behavior
    if (target.checked) {
      if (target.dataset.checkboxExclusive !== undefined) {
        // This is an exclusive checkbox (e.g., "None of these")
        uncheckAllInputsExcept(target)
      } else {
        // Regular checkbox - uncheck any exclusive checkboxes
        uncheckExclusiveInputs(target)
      }
    }

    // Emit change event
    const changeEvent = new CustomEvent('public-good:checkboxes:change', {
      bubbles: true,
      detail: {
        name: finalConfig.name,
        value: target.value,
        checked: target.checked,
        values: getValues()
      }
    })
    formGroup.dispatchEvent(changeEvent)
  }

  // Sync conditional reveal state
  const syncConditionalReveal = (input: HTMLInputElement): void => {
    const targetId = input.getAttribute('aria-controls')
    if (!targetId) return

    const conditional = document.getElementById(targetId)
    if (!conditional) return

    const isChecked = input.checked
    input.setAttribute('aria-expanded', isChecked ? 'true' : 'false')

    if (isChecked) {
      conditional.classList.remove('public-good-checkboxes__conditional--hidden')
    } else {
      conditional.classList.add('public-good-checkboxes__conditional--hidden')
    }
  }

  // Sync all conditional reveals
  const syncAllConditionalReveals = (): void => {
    checkboxInputs.forEach(input => {
      if (input.getAttribute('aria-controls')) {
        syncConditionalReveal(input)
      }
    })
  }

  // Uncheck all inputs except the specified one
  const uncheckAllInputsExcept = (exceptInput: HTMLInputElement): void => {
    const exclusiveGroup = exceptInput.dataset.checkboxExclusiveGroup

    checkboxInputs.forEach(input => {
      if (input !== exceptInput && input.form === exceptInput.form) {
        setInputState(input, false, exclusiveGroup)
      }
    })
  }

  // Uncheck exclusive inputs
  const uncheckExclusiveInputs = (input: HTMLInputElement): void => {
    const exclusiveGroup = input.dataset.checkboxExclusiveGroup

    checkboxInputs.forEach(exclusiveInput => {
      if (exclusiveInput.dataset.checkboxExclusive !== undefined && 
          exclusiveInput.form === input.form) {
        setInputState(exclusiveInput, false, exclusiveGroup)
      }
    })
  }

  // Set input state
  const setInputState = (input: HTMLInputElement, checked: boolean, exclusiveGroup?: string): void => {
    const inputExclusiveGroup = input.dataset.checkboxExclusiveGroup

    // Skip if exclusive groups don't match
    if (exclusiveGroup && inputExclusiveGroup && inputExclusiveGroup !== exclusiveGroup) {
      return
    }

    input.checked = checked
    syncConditionalReveal(input)
  }

  // Component methods
  const getValues = (): string[] => {
    return checkboxInputs
      .filter(input => input.checked && !input.disabled)
      .map(input => input.value)
  }

  const setValues = (values: string[]): void => {
    checkboxInputs.forEach(input => {
      input.checked = values.includes(input.value)
      syncConditionalReveal(input)
    })
  }

  const checkAll = (): void => {
    checkboxInputs.forEach(input => {
      if (!input.disabled && !input.dataset.checkboxExclusive) {
        input.checked = true
        syncConditionalReveal(input)
      }
    })
  }

  const uncheckAll = (): void => {
    checkboxInputs.forEach(input => {
      if (!input.disabled) {
        input.checked = false
        syncConditionalReveal(input)
      }
    })
  }

  const toggle = (value: string): void => {
    const input = checkboxInputs.find(input => input.value === value)
    if (input && !input.disabled) {
      input.checked = !input.checked
      syncConditionalReveal(input)
    }
  }

  const validate = (): boolean => {
    const values = getValues()
    const isValid = values.length > 0
    
    if (!isValid && !finalConfig.errorMessage) {
      setError(t('form.required'))
    } else if (isValid && errorElement) {
      clearError()
    }
    
    return isValid
  }

  const setError = (message: string): void => {
    formGroup.classList.add('public-good-form-group--error')
    
    if (!errorElement) {
      const errorId = `${idPrefix}-error`
      errorElement = createElement('div', {
        id: errorId,
        class: 'public-good-error-message'
      })

      const errorIcon = createElement('span', {
        class: 'public-good-sr-only'
      })
      errorIcon.textContent = t('form.error') + ': '
      errorElement.appendChild(errorIcon)

      const errorText = createElement('span')
      errorText.textContent = message
      errorElement.appendChild(errorText)

      const target = finalConfig.fieldset ? formGroup.querySelector('.public-good-fieldset') : formGroup
      const checkboxesContainer = target?.querySelector('.public-good-checkboxes')
      if (checkboxesContainer) {
        target?.insertBefore(errorElement, checkboxesContainer)
      }

      // Update aria-describedby
      const newDescribedBy = describedBy ? `${describedBy} ${errorId}` : errorId
      checkboxesContainer?.setAttribute('aria-describedby', newDescribedBy)
    }
  }

  const clearError = (): void => {
    formGroup.classList.remove('public-good-form-group--error')
    
    if (errorElement) {
      errorElement.remove()
      errorElement = null
    }
  }

  const destroy = (): void => {
    checkboxesContainer.removeEventListener('click', handleClick)
    window.removeEventListener('pageshow', syncAllConditionalReveals)
    formGroup.remove()
  }

  // Add event listeners
  checkboxesContainer.addEventListener('click', handleClick)
  window.addEventListener('pageshow', syncAllConditionalReveals)

  // Initial sync
  syncAllConditionalReveals()

  return {
    element: formGroup,
    config: finalConfig,
    destroy,
    getValues,
    setValues,
    checkAll,
    uncheckAll,
    toggle,
    validate,
    setError,
    clearError
  }
}

/**
 * Initialize all checkboxes on the page
 */
export const initializeCheckboxes = (container: Document | Element = document): CheckboxesComponent[] => {
  const checkboxes: CheckboxesComponent[] = []
  const elements = container.querySelectorAll('[data-public-good-checkboxes]')

  elements.forEach((element) => {
    try {
      // Extract basic configuration from data attributes
      const name = element.getAttribute('data-name')
      if (!name) {
        console.warn('Checkboxes element missing required data-name attribute')
        return
      }

      // Extract items from child elements or data attribute
      const items: CheckboxItem[] = []
      const itemsData = element.getAttribute('data-items')
      
      if (itemsData) {
        try {
          const parsedItems = JSON.parse(itemsData)
          items.push(...parsedItems)
        } catch (error) {
          console.warn('Failed to parse checkboxes items:', error)
        }
      } else {
        // Extract items from existing checkbox inputs in the DOM
        const inputs = element.querySelectorAll('input[type="checkbox"]')
        inputs.forEach(input => {
          const checkbox = input as HTMLInputElement
          const label = element.querySelector(`label[for="${checkbox.id}"]`)
          
          items.push({
            value: checkbox.value,
            text: label?.textContent || '',
            id: checkbox.id,
            checked: checkbox.checked,
            disabled: checkbox.disabled
          })
        })
      }

      if (items.length === 0) {
        console.warn('No checkbox items found for checkboxes component')
        return
      }

      const config: CheckboxesConfig = {
        name,
        items,
        ...(element.getAttribute('data-id-prefix') && { 
          idPrefix: element.getAttribute('data-id-prefix')! 
        }),
        ...(element.getAttribute('data-classes') && { 
          classes: element.getAttribute('data-classes')! 
        })
      }

      // Parse additional configuration
      const configData = element.getAttribute('data-config')
      if (configData) {
        try {
          const additionalConfig = JSON.parse(configData)
          Object.assign(config, additionalConfig)
        } catch (error) {
          console.warn('Failed to parse checkboxes config:', error)
        }
      }

      // Create component and replace element
      const checkboxesComponent = createCheckboxes(config)
      element.parentNode?.replaceChild(checkboxesComponent.element, element)
      checkboxes.push(checkboxesComponent)
    } catch (error) {
      console.error('Failed to initialize checkboxes:', error)
    }
  })

  return checkboxes
}

/**
 * Create a simple checkbox group
 */
export const createSimpleCheckboxes = (
  name: string, 
  items: Array<{ value: string; text: string; checked?: boolean }>,
  options: Partial<CheckboxesConfig> = {}
): CheckboxesComponent => {
  return createCheckboxes({
    name,
    items: items.map(item => ({
      value: item.value,
      text: item.text,
      checked: item.checked
    })),
    ...options
  })
}

/**
 * Create checkboxes with fieldset
 */
export const createFieldsetCheckboxes = (
  name: string,
  legend: string,
  items: Array<{ value: string; text: string; checked?: boolean }>,
  options: Partial<CheckboxesConfig> = {}
): CheckboxesComponent => {
  return createCheckboxes({
    name,
    items: items.map(item => ({
      value: item.value,
      text: item.text,
      checked: item.checked
    })),
    fieldset: {
      legend: {
        text: legend
      }
    },
    ...options
  })
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeCheckboxes()
  })
} else {
  initializeCheckboxes()
}