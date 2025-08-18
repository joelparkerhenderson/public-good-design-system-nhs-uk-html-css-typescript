/**
 * Back Link Component TypeScript
 * Converted from NHS UK Design System back-link component
 */

import { createElement } from '@/core/functions/dom-utils'
import { t } from '@/core/functions/i18n'

/**
 * Back Link component configuration options
 */
export interface BackLinkConfig {
  text?: string
  html?: string
  href?: string
  element?: 'a' | 'button'
  classes?: string
  attributes?: Record<string, string>
  onClick?: (event: Event) => void
}

/**
 * Back Link component instance
 */
export interface BackLinkComponent {
  element: HTMLElement
  link: HTMLAnchorElement | HTMLButtonElement
  destroy: () => void
  disable?: () => void
  enable?: () => void
}

/**
 * Default configuration for back links
 */
const DEFAULT_CONFIG: Required<Omit<BackLinkConfig, 'onClick'>> & { onClick?: BackLinkConfig['onClick'] } = {
  text: t('nav.back'),
  html: '',
  href: '#',
  element: 'a',
  classes: '',
  attributes: {},
  onClick: undefined
}

/**
 * Create the chevron icon SVG element
 */
const createChevronIcon = (): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'public-good-icon public-good-icon--chevron-left')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('height', '24')
  svg.setAttribute('width', '24')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z')

  svg.appendChild(path)
  return svg
}

/**
 * Create a Back Link component
 */
export const createBackLink = (config: BackLinkConfig = {}): BackLinkComponent => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Create container
  const container = createElement('div', {
    class: `public-good-back-link${finalConfig.classes ? ` ${finalConfig.classes}` : ''}`
  })

  // Create link or button element
  const element = finalConfig.element
  const linkAttributes: Record<string, string> = {
    class: 'public-good-back-link__link'
  }

  if (element === 'a') {
    linkAttributes.href = finalConfig.href || '#'
  } else {
    linkAttributes.type = 'button'
  }

  // Add custom attributes
  if (finalConfig.attributes) {
    Object.assign(linkAttributes, finalConfig.attributes)
  }

  const link = createElement(element, linkAttributes) as HTMLAnchorElement | HTMLButtonElement

  // Create and append chevron icon
  const chevronIcon = createChevronIcon()
  link.appendChild(chevronIcon)

  // Add content (HTML takes precedence over text)
  const content = finalConfig.html || finalConfig.text
  if (finalConfig.html) {
    link.insertAdjacentHTML('beforeend', content)
  } else {
    const textNode = document.createTextNode(content)
    link.appendChild(textNode)
  }

  // Append link to container
  container.appendChild(link)

  // Event handlers
  const handleClick = (event: Event): void => {
    // Call custom onClick handler if provided
    if (finalConfig.onClick) {
      finalConfig.onClick(event)
    }

    // Analytics tracking
    const customEvent = new CustomEvent('public-good:back-link:click', {
      bubbles: true,
      detail: {
        text: finalConfig.text,
        element: finalConfig.element,
        href: finalConfig.element === 'a' ? finalConfig.href : undefined
      }
    })
    link.dispatchEvent(customEvent)
  }

  // Keyboard event handling for enhanced accessibility
  const handleKeydown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent
    // Space key should trigger click for buttons (Enter is handled by default)
    if (finalConfig.element === 'button' && keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault()
      ;(link as HTMLButtonElement).click()
    }
  }

  // Add event listeners
  link.addEventListener('click', handleClick)
  if (finalConfig.element === 'button') {
    link.addEventListener('keydown', handleKeydown)
  }

  // Disable/enable functions for buttons
  const disable = (): void => {
    if (finalConfig.element === 'button') {
      ;(link as HTMLButtonElement).disabled = true
      container.classList.add('public-good-back-link--disabled')
    }
  }

  const enable = (): void => {
    if (finalConfig.element === 'button') {
      ;(link as HTMLButtonElement).disabled = false
      container.classList.remove('public-good-back-link--disabled')
    }
  }

  // Return component instance
  const component: BackLinkComponent = {
    element: container,
    link: link,
    destroy: (): void => {
      link.removeEventListener('click', handleClick)
      if (finalConfig.element === 'button') {
        link.removeEventListener('keydown', handleKeydown)
      }
      container.remove()
    }
  }

  // Add disable/enable methods for buttons
  if (finalConfig.element === 'button') {
    component.disable = disable
    component.enable = enable
  }

  return component
}

/**
 * Initialize all back links on the page
 */
export const initializeBackLinks = (container: Document | Element = document): BackLinkComponent[] => {
  const backLinks: BackLinkComponent[] = []
  const elements = container.querySelectorAll('[data-public-good-back-link]')

  elements.forEach((element) => {
    try {
      // Extract configuration from data attributes
      const config: BackLinkConfig = {
        ...(element.getAttribute('data-text') && { text: element.getAttribute('data-text')! }),
        ...(element.getAttribute('data-html') && { html: element.getAttribute('data-html')! }),
        ...(element.getAttribute('data-href') && { href: element.getAttribute('data-href')! }),
        element: (element.getAttribute('data-element') as 'a' | 'button') || 'a',
        ...(element.getAttribute('data-classes') && { classes: element.getAttribute('data-classes')! }),
        attributes: {}
      }

      // Parse additional attributes
      const attributesData = element.getAttribute('data-attributes')
      if (attributesData) {
        try {
          config.attributes = JSON.parse(attributesData)
        } catch (error) {
          console.warn('Failed to parse back link attributes:', error)
        }
      }

      // Create component and replace element
      const backLink = createBackLink(config)
      element.parentNode?.replaceChild(backLink.element, element)
      backLinks.push(backLink)
    } catch (error) {
      console.error('Failed to initialize back link:', error)
    }
  })

  return backLinks
}

/**
 * Create a browser history back link
 */
export const createHistoryBackLink = (config: Omit<BackLinkConfig, 'element' | 'onClick'> = {}): BackLinkComponent => {
  return createBackLink({
    ...config,
    element: 'button',
    onClick: (event: Event): void => {
      event.preventDefault()
      
      // Check if there's history to go back to
      if (window.history.length > 1 && document.referrer) {
        window.history.back()
      } else {
        // Fallback to home page or specified URL
        const fallbackUrl = config.href || '/'
        window.location.href = fallbackUrl
      }
    }
  })
}

/**
 * Create a safe back link that handles edge cases
 */
export const createSafeBackLink = (
  config: BackLinkConfig & { 
    fallbackUrl?: string
    confirmMessage?: string 
  } = {}
): BackLinkComponent => {
  const { fallbackUrl = '/', confirmMessage, ...backLinkConfig } = config
  
  return createBackLink({
    ...backLinkConfig,
    element: 'button',
    onClick: (event: Event): void => {
      event.preventDefault()
      
      // Show confirmation if specified
      if (confirmMessage && !confirm(confirmMessage)) {
        return
      }
      
      // Custom onClick handler
      if (config.onClick) {
        config.onClick(event)
        return
      }
      
      // Safe navigation logic
      try {
        if (window.history.length > 1 && document.referrer) {
          // Check if referrer is from same origin for security
          const referrerUrl = new URL(document.referrer)
          const currentUrl = new URL(window.location.href)
          
          if (referrerUrl.origin === currentUrl.origin) {
            window.history.back()
          } else {
            window.location.href = fallbackUrl
          }
        } else {
          window.location.href = fallbackUrl
        }
      } catch (error) {
        console.warn('Back navigation failed, using fallback:', error)
        try {
          window.location.href = fallbackUrl
        } catch (fallbackError) {
          // In test environment, location.href assignment might not work
          console.warn('Fallback navigation also failed:', fallbackError)
        }
      }
    }
  })
}

/**
 * Utility function to check if browser history is available
 */
export const canGoBack = (): boolean => {
  return window.history.length > 1 && Boolean(document.referrer)
}

/**
 * Utility function to get previous page title from referrer
 */
export const getPreviousPageContext = (): string | null => {
  if (!document.referrer) {
    return null
  }
  
  try {
    const referrerUrl = new URL(document.referrer)
    const pathname = referrerUrl.pathname
    
    // Extract meaningful context from pathname
    if (pathname === '/') return t('nav.home')
    if (pathname.includes('search')) return 'search results'
    if (pathname.includes('about')) return 'about'
    
    // Get the last meaningful part of the path first, then check for broader categories
    const pathParts = pathname.split('/').filter(Boolean)
    const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1]! : null
    
    // Return the most specific part, unless it's a generic services page
    if (lastPart && lastPart !== 'services') {
      return lastPart
    }
    
    // Fallback to services if that's what it contains
    if (pathname.includes('services')) return 'services'
    
    return lastPart
  } catch {
    return null
  }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeBackLinks())
} else {
  initializeBackLinks()
}