/**
 * Public Good Design System - Details Component
 * TypeScript implementation of accessible collapsible disclosure pattern
 * Based on NHS UK Design System details patterns
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Details configuration interface
 */
export interface DetailsConfig {
  id?: string
  summaryText: string
  content: string
  open?: boolean
  classes?: string
  summaryClasses?: string
  contentClasses?: string
  attributes?: Record<string, string>
  summaryAttributes?: Record<string, string>
  contentAttributes?: Record<string, string>
  polyfill?: boolean
}

/**
 * Details result interface
 */
export interface DetailsResult {
  element: HTMLDetailsElement
  config: DetailsConfig
  destroy: () => void
  toggle: () => void
  open: () => void
  close: () => void
  isOpen: () => boolean
  setSummaryText: (text: string) => void
  setContent: (content: string) => void
}

/**
 * Creates a details component
 */
export const createDetails = (config: DetailsConfig): DetailsResult => {
  const id = config.id || generateUniqueId('details')
  
  // Create details element
  const details = document.createElement('details')
  details.id = id
  details.className = `public-good-details${config.classes ? ` ${config.classes}` : ''}`
  
  if (config.open) {
    details.open = true
  }
  
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      details.setAttribute(key, value)
    })
  }
  
  // Create summary element
  const summary = document.createElement('summary')
  summary.className = `public-good-details__summary${config.summaryClasses ? ` ${config.summaryClasses}` : ''}`
  
  if (config.summaryAttributes) {
    Object.entries(config.summaryAttributes).forEach(([key, value]) => {
      summary.setAttribute(key, value)
    })
  }
  
  // Create summary text span
  const summaryText = document.createElement('span')
  summaryText.className = 'public-good-details__summary-text'
  summaryText.textContent = config.summaryText
  summary.appendChild(summaryText)
  
  // Create content container
  const content = document.createElement('div')
  content.className = `public-good-details__text${config.contentClasses ? ` ${config.contentClasses}` : ''}`
  content.innerHTML = config.content
  
  if (config.contentAttributes) {
    Object.entries(config.contentAttributes).forEach(([key, value]) => {
      content.setAttribute(key, value)
    })
  }
  
  // Assemble the component
  details.appendChild(summary)
  details.appendChild(content)
  
  // Set up event listeners
  const setupEventListeners = () => {
    // Track toggle events for analytics
    details.addEventListener('toggle', () => {
      const toggleEvent = new CustomEvent('public-good:details:toggle', {
        detail: {
          id,
          isOpen: details.open,
          summaryText: config.summaryText
        },
        bubbles: true
      })
      details.dispatchEvent(toggleEvent)
    })
    
    // Enhanced keyboard accessibility
    summary.addEventListener('keydown', (event) => {
      // Enter and Space should toggle the details
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        details.open = !details.open
        
        // Dispatch toggle event
        const toggleEvent = new Event('toggle')
        details.dispatchEvent(toggleEvent)
      }
    })
    
    // Focus management
    details.addEventListener('toggle', () => {
      if (details.open) {
        // When opening, ensure content is accessible to screen readers
        content.setAttribute('aria-expanded', 'true')
      } else {
        content.setAttribute('aria-expanded', 'false')
      }
    })
  }
  
  setupEventListeners()
  
  // Set initial aria-expanded state
  content.setAttribute('aria-expanded', config.open ? 'true' : 'false')
  
  // Component API methods
  const toggle = (): void => {
    details.open = !details.open
    const toggleEvent = new Event('toggle')
    details.dispatchEvent(toggleEvent)
  }
  
  const open = (): void => {
    if (!details.open) {
      details.open = true
      const toggleEvent = new Event('toggle')
      details.dispatchEvent(toggleEvent)
    }
  }
  
  const close = (): void => {
    if (details.open) {
      details.open = false
      const toggleEvent = new Event('toggle')
      details.dispatchEvent(toggleEvent)
    }
  }
  
  const isOpen = (): boolean => {
    return details.open
  }
  
  const setSummaryText = (text: string): void => {
    summaryText.textContent = text
    config.summaryText = text
  }
  
  const setContent = (newContent: string): void => {
    content.innerHTML = newContent
    config.content = newContent
  }
  
  const destroy = (): void => {
    if (details.parentNode) {
      details.parentNode.removeChild(details)
    }
  }
  
  return {
    element: details,
    config,
    destroy,
    toggle,
    open,
    close,
    isOpen,
    setSummaryText,
    setContent
  }
}

/**
 * Initialize details components from data attributes
 */
export const initializeDetails = (): DetailsResult[] => {
  const elements = document.querySelectorAll('[data-public-good-details]')
  const detailsComponents: DetailsResult[] = []
  
  elements.forEach((element) => {
    try {
      const summaryText = element.getAttribute('data-summary-text')
      const content = element.getAttribute('data-content') || element.innerHTML
      
      if (!summaryText) {
        console.warn('Details element missing required data-summary-text attribute')
        return
      }
      
      const config: DetailsConfig = {
        summaryText,
        content
      }
      
      // Parse configuration from data attributes
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const open = element.getAttribute('data-open')
      if (open === 'true') config.open = true
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      const summaryClasses = element.getAttribute('data-summary-classes')
      if (summaryClasses) config.summaryClasses = summaryClasses
      
      const contentClasses = element.getAttribute('data-content-classes')
      if (contentClasses) config.contentClasses = contentClasses
      
      const polyfill = element.getAttribute('data-polyfill')
      if (polyfill === 'true') config.polyfill = true
      
      const details = createDetails(config)
      element.parentNode?.replaceChild(details.element, element)
      detailsComponents.push(details)
    } catch (error) {
      console.error('Error initializing details component:', error)
    }
  })
  
  return detailsComponents
}

/**
 * Helper function to create a simple details component
 */
export const createSimpleDetails = (
  summaryText: string,
  content: string,
  options?: Partial<DetailsConfig>
): DetailsResult => {
  return createDetails({
    summaryText,
    content,
    ...options
  })
}

/**
 * Helper function to create details with HTML content
 */
export const createDetailsWithHTML = (
  summaryText: string,
  htmlContent: string,
  options?: Partial<DetailsConfig>
): DetailsResult => {
  return createDetails({
    summaryText,
    content: htmlContent,
    ...options
  })
}

/**
 * Legacy details polyfill for older browsers
 * Only loads if native details support is not available
 */
export const loadDetailsPolyfill = (): Promise<void> => {
  return new Promise((resolve) => {
    // Check if details is supported
    const testDetails = document.createElement('details')
    const isSupported = 'open' in testDetails
    
    if (isSupported) {
      resolve()
      return
    }
    
    console.log('Loading details polyfill for legacy browser support')
    
    // Basic polyfill implementation
    const style = document.createElement('style')
    style.textContent = `
      details:not([open]) > *:not(summary) {
        display: none !important;
      }
      
      details > summary {
        cursor: pointer;
        list-style: none;
      }
      
      details > summary::-webkit-details-marker {
        display: none;
      }
      
      details > summary::before {
        content: "▶";
        display: inline-block;
        margin-right: 0.5em;
        transition: transform 0.2s ease;
      }
      
      details[open] > summary::before {
        transform: rotate(90deg);
      }
    `
    document.head.appendChild(style)
    
    // Add click handlers to all summary elements
    const summaries = document.querySelectorAll('details > summary')
    summaries.forEach((summary) => {
      summary.addEventListener('click', (event) => {
        const details = summary.parentElement as HTMLDetailsElement
        if (details.tagName.toLowerCase() === 'details') {
          event.preventDefault()
          const isOpen = details.hasAttribute('open')
          
          if (isOpen) {
            details.removeAttribute('open')
          } else {
            details.setAttribute('open', '')
          }
          
          // Dispatch custom toggle event
          const toggleEvent = new CustomEvent('toggle', { bubbles: true })
          details.dispatchEvent(toggleEvent)
        }
      })
    })
    
    resolve()
  })
}

/**
 * Initialize all details components on the page
 */
export const initAllDetails = async (options?: { polyfill?: boolean }): Promise<DetailsResult[]> => {
  if (options?.polyfill) {
    await loadDetailsPolyfill()
  }
  
  return initializeDetails()
}