/**
 * Action Link Component TypeScript
 * Converted from NHS UK Design System action-link component
 */

import { createElement, setAttributes } from '@/core/functions/dom-utils'

/**
 * Action Link component configuration options
 */
export interface ActionLinkConfig {
  text: string
  href: string
  openInNewWindow?: boolean
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Action Link component instance
 */
export interface ActionLinkComponent {
  element: HTMLElement
  link: HTMLAnchorElement
  destroy: () => void
}

/**
 * Default configuration for action links
 */
const DEFAULT_CONFIG: Partial<ActionLinkConfig> = {
  openInNewWindow: false,
  classes: '',
  attributes: {}
}

/**
 * Create the arrow icon SVG element
 */
const createArrowIcon = (): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'public-good-icon public-good-icon--arrow-right-circle')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('width', '36')
  svg.setAttribute('height', '36')

  // Create paths
  const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  bgPath.setAttribute('d', 'M0 0h24v24H0z')
  bgPath.setAttribute('fill', 'none')

  const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  arrowPath.setAttribute('d', 'M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z')

  svg.appendChild(bgPath)
  svg.appendChild(arrowPath)

  return svg
}

/**
 * Create an Action Link component
 */
export const createActionLink = (config: ActionLinkConfig): ActionLinkComponent => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Validate required fields
  if (!finalConfig.text || !finalConfig.href) {
    throw new Error('Action Link requires both text and href properties')
  }

  // Create container
  const container = createElement('div', {
    class: 'public-good-action-link'
  })

  // Create link element
  const link = createElement('a', {
    class: `public-good-action-link__link${finalConfig.classes ? ` ${finalConfig.classes}` : ''}`,
    href: finalConfig.href
  }) as HTMLAnchorElement

  // Add target and rel attributes for external links
  if (finalConfig.openInNewWindow) {
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
  }

  // Add custom attributes
  if (finalConfig.attributes) {
    setAttributes(link, finalConfig.attributes)
  }

  // Create and append arrow icon
  const arrowIcon = createArrowIcon()
  link.appendChild(arrowIcon)

  // Create and append text span
  const textSpan = createElement('span', {
    class: 'public-good-action-link__text'
  }, finalConfig.text)
  link.appendChild(textSpan)

  // Append link to container
  container.appendChild(link)

  // Analytics tracking (optional)
  const trackClick = (event: Event): void => {
    // Custom analytics tracking can be added here
    const target = event.currentTarget as HTMLAnchorElement
    const customEvent = new CustomEvent('public-good:action-link:click', {
      bubbles: true,
      detail: {
        text: finalConfig.text,
        href: finalConfig.href,
        openInNewWindow: finalConfig.openInNewWindow
      }
    })
    target.dispatchEvent(customEvent)
  }

  // Add click event listener for analytics
  link.addEventListener('click', trackClick)

  // Keyboard event handling for enhanced accessibility
  const handleKeydown = (event: KeyboardEvent): void => {
    // Space key should trigger click (in addition to Enter which is default)
    if (event.key === ' ') {
      event.preventDefault()
      link.click()
    }
  }

  link.addEventListener('keydown', handleKeydown)

  // Return component instance
  return {
    element: container,
    link: link,
    destroy: (): void => {
      link.removeEventListener('click', trackClick)
      link.removeEventListener('keydown', handleKeydown)
      container.remove()
    }
  }
}

/**
 * Initialize all action links on the page
 */
export const initializeActionLinks = (container: Document | Element = document): ActionLinkComponent[] => {
  const actionLinks: ActionLinkComponent[] = []
  const elements = container.querySelectorAll('[data-public-good-action-link]')

  elements.forEach((element) => {
    try {
      // Extract configuration from data attributes
      const config: ActionLinkConfig = {
        text: element.getAttribute('data-text') || '',
        href: element.getAttribute('data-href') || '#',
        openInNewWindow: element.hasAttribute('data-open-in-new-window'),
        classes: element.getAttribute('data-classes') || '',
        attributes: {}
      }

      // Parse additional attributes
      const attributesData = element.getAttribute('data-attributes')
      if (attributesData) {
        try {
          config.attributes = JSON.parse(attributesData)
        } catch (error) {
          console.warn('Failed to parse action link attributes:', error)
        }
      }

      // Create component and replace element
      const actionLink = createActionLink(config)
      element.parentNode?.replaceChild(actionLink.element, element)
      actionLinks.push(actionLink)
    } catch (error) {
      console.error('Failed to initialize action link:', error)
    }
  })

  return actionLinks
}

/**
 * Utility function to validate URLs
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    // Check for relative URLs
    return /^\/[^\/]|^#/.test(url)
  }
}

/**
 * Utility function to check if URL is external
 */
export const isExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin)
    return urlObj.origin !== window.location.origin
  } catch {
    return false
  }
}

/**
 * Create action link with automatic external link detection
 */
export const createSmartActionLink = (config: Omit<ActionLinkConfig, 'openInNewWindow'> & { openInNewWindow?: boolean }): ActionLinkComponent => {
  // Auto-detect external links if not explicitly set
  const finalConfig = {
    ...config,
    openInNewWindow: config.openInNewWindow ?? isExternalUrl(config.href)
  }

  return createActionLink(finalConfig)
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeActionLinks())
} else {
  initializeActionLinks()
}