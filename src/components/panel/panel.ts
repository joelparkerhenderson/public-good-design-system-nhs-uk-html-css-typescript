/**
 * Panel Component
 * 
 * Creates prominent panel components for highlighting successful transactions following NHS UK Design System patterns.
 * Primarily used on confirmation pages to show completion of important actions.
 * 
 * Features:
 * - Customizable heading levels (h1-h6)
 * - Optional body content with HTML support
 * - Success-focused design for confirmation pages
 * - Accessibility-focused with proper semantic markup
 * - Data attribute initialization
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Panel component configuration
 */
export interface PanelConfig {
  id?: string
  title: string
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6
  body?: string
  html?: boolean
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Panel component result
 */
export interface PanelResult {
  element: HTMLElement
  titleElement: HTMLHeadingElement
  bodyElement?: HTMLElement
  config: PanelConfig
  setTitle: (title: string) => void
  setBody: (body: string, html?: boolean) => void
  destroy: () => void
}

/**
 * Creates a panel component
 */
export function createPanel(config: PanelConfig): PanelResult {
  const id = config.id || generateUniqueId('panel')
  
  // Set defaults in config
  if (!config.id) {
    config.id = id
  }
  if (!config.titleLevel) {
    config.titleLevel = 1
  }
  if (config.html === undefined) {
    config.html = false
  }
  
  // Create panel container
  const panel = document.createElement('div')
  panel.className = 'public-good-panel'
  panel.id = id
  
  // Create title element based on level
  const titleElement = document.createElement(`h${config.titleLevel}`) as HTMLHeadingElement
  titleElement.className = 'public-good-panel__title'
  if (config.html) {
    titleElement.innerHTML = config.title
  } else {
    titleElement.textContent = config.title
  }
  panel.appendChild(titleElement)
  
  // Create body element if body content is provided
  let bodyElement: HTMLElement | undefined
  if (config.body) {
    bodyElement = document.createElement('div')
    bodyElement.className = 'public-good-panel__body'
    
    if (config.html) {
      bodyElement.innerHTML = config.body
    } else {
      bodyElement.textContent = config.body
    }
    
    panel.appendChild(bodyElement)
  }
  
  // Apply custom classes
  if (config.classes) {
    panel.classList.add(...config.classes.split(' '))
  }
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      panel.setAttribute(key, value)
    })
  }
  
  // Create result object early so it can be referenced in methods
  const result: PanelResult = {
    element: panel,
    titleElement,
    bodyElement,
    config,
    setTitle: function(title: string): void {
      config.title = title
      if (config.html) {
        titleElement.innerHTML = title
      } else {
        titleElement.textContent = title
      }
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:panel:title-changed', {
        detail: { 
          title,
          element: panel,
          titleElement,
          config: config 
        },
        bubbles: true
      })
      panel.dispatchEvent(event)
    },
    setBody: function(body: string, html: boolean = config.html || false): void {
      config.body = body
      config.html = html
      
      // Create body element if it doesn't exist
      if (!bodyElement && body) {
        bodyElement = document.createElement('div')
        bodyElement.className = 'public-good-panel__body'
        panel.appendChild(bodyElement)
        
        // Update the reference in the returned object
        result.bodyElement = bodyElement
      }
      
      if (bodyElement) {
        if (html) {
          bodyElement.innerHTML = body
        } else {
          bodyElement.textContent = body
        }
        
        // If body is empty, remove the element
        if (!body) {
          bodyElement.remove()
          bodyElement = undefined
          result.bodyElement = undefined
        }
      }
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:panel:body-changed', {
        detail: { 
          body,
          html,
          element: panel,
          bodyElement,
          config: config 
        },
        bubbles: true
      })
      panel.dispatchEvent(event)
    },
    destroy: function(): void {
      panel.remove()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:panel:destroyed', {
        detail: { element: panel, config: config },
        bubbles: true
      })
      document.dispatchEvent(event)
    }
  }
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:panel:created', {
    detail: { element: panel, titleElement, bodyElement, config: config },
    bubbles: true
  })
  panel.dispatchEvent(creationEvent)
  
  return result
}

/**
 * Creates a success confirmation panel
 */
export function createSuccessPanel(
  title: string,
  body?: string,
  options: Partial<PanelConfig> = {}
): PanelResult {
  return createPanel({
    title,
    body,
    titleLevel: 1,
    ...options
  })
}

/**
 * Creates a confirmation panel with custom heading level
 */
export function createConfirmationPanel(
  title: string,
  body?: string,
  titleLevel: 1 | 2 | 3 | 4 | 5 | 6 = 1,
  options: Partial<PanelConfig> = {}
): PanelResult {
  return createPanel({
    title,
    body,
    titleLevel,
    ...options
  })
}

/**
 * Creates a panel with HTML content
 */
export function createHtmlPanel(
  title: string,
  bodyHtml?: string,
  options: Partial<PanelConfig> = {}
): PanelResult {
  return createPanel({
    title,
    body: bodyHtml,
    html: true,
    ...options
  })
}

/**
 * Initialize all panel components from data attributes in the DOM
 */
export function initializePanels(): PanelResult[] {
  const elements = document.querySelectorAll('[data-public-good-panel]')
  const components: PanelResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<PanelConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const title = element.getAttribute('data-title')
      if (title) config.title = title
      
      const titleLevel = element.getAttribute('data-title-level')
      if (titleLevel) {
        const level = parseInt(titleLevel, 10)
        if (level >= 1 && level <= 6) {
          config.titleLevel = level as 1 | 2 | 3 | 4 | 5 | 6
        }
      }
      
      const body = element.getAttribute('data-body')
      if (body) config.body = body
      
      const html = element.getAttribute('data-html')
      if (html) config.html = html === 'true'
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      // Parse custom attributes
      const customAttributes = element.getAttribute('data-attributes')
      if (customAttributes) {
        try {
          config.attributes = JSON.parse(customAttributes)
        } catch (error) {
          console.warn('Invalid JSON in data-attributes attribute:', error)
        }
      }
      
      // Ensure title is provided (required)
      if (!config.title) {
        console.warn('Panel component requires a title')
        return
      }
      
      // Create the panel component
      const panel = createPanel(config as PanelConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(panel.element, element)
      components.push(panel)
      
    } catch (error) {
      console.error('Error initializing panel component:', error)
    }
  })
  
  return components
}

// Auto-initialize panel components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePanels)
  } else {
    initializePanels()
  }
}