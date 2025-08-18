/**
 * Inset Text Component
 * 
 * Creates accessible inset text components to help users identify and understand
 * important content on a page. Used to make specific information stand out 
 * from the rest of the page while maintaining accessibility compliance.
 * 
 * Features:
 * - Screen reader support with visually hidden labels
 * - Flexible content support (text and HTML)
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Custom styling and attributes
 * - Event-driven architecture
 * - Data attribute initialization
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Inset text component configuration
 */
export interface InsetTextConfig {
  id?: string
  text?: string
  html?: string
  hiddenLabel?: string
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Inset text component result
 */
export interface InsetTextResult {
  element: HTMLElement
  config: InsetTextConfig
  updateContent: (content: string, isHtml?: boolean) => void
  updateHiddenLabel: (label: string) => void
  destroy: () => void
}

/**
 * Creates an inset text component
 */
export function createInsetText(config: InsetTextConfig = {}): InsetTextResult {
  const id = config.id || generateUniqueId('inset-text')
  
  // Set defaults in config
  if (!config.id) {
    config.id = id
  }
  if (!config.hiddenLabel) {
    config.hiddenLabel = 'Information: '
  }
  
  // Create the main inset text container
  const container = document.createElement('div')
  container.id = id
  container.className = 'public-good-inset-text' + (config.classes ? ` ${config.classes}` : '')
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      container.setAttribute(key, value)
    })
  }
  
  // Create the visually hidden label for screen readers
  const hiddenLabel = document.createElement('span')
  hiddenLabel.className = 'public-good-sr-only'
  hiddenLabel.textContent = config.hiddenLabel
  container.appendChild(hiddenLabel)
  
  // Create content container
  const contentContainer = document.createElement('div')
  contentContainer.className = 'public-good-inset-text__content'
  
  // Set initial content
  if (config.html) {
    contentContainer.innerHTML = config.html
  } else if (config.text) {
    contentContainer.textContent = config.text
  }
  
  container.appendChild(contentContainer)
  
  // Update content method
  function updateContent(content: string, isHtml: boolean = false): void {
    if (isHtml) {
      contentContainer.innerHTML = content
      config.html = content
      delete config.text
    } else {
      contentContainer.textContent = content
      config.text = content
      delete config.html
    }
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:inset-text:content-updated', {
      detail: { 
        content, 
        isHtml, 
        element: container,
        config: config 
      },
      bubbles: true
    })
    container.dispatchEvent(event)
  }
  
  // Update hidden label method
  function updateHiddenLabel(label: string): void {
    hiddenLabel.textContent = label
    config.hiddenLabel = label
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:inset-text:label-updated', {
      detail: { 
        label, 
        element: container,
        config: config 
      },
      bubbles: true
    })
    container.dispatchEvent(event)
  }
  
  // Cleanup function
  function destroy(): void {
    container.remove()
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:inset-text:destroyed', {
      detail: { element: container, config: config },
      bubbles: true
    })
    document.dispatchEvent(event)
  }
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:inset-text:created', {
    detail: { element: container, config: config },
    bubbles: true
  })
  container.dispatchEvent(creationEvent)
  
  return {
    element: container,
    config,
    updateContent,
    updateHiddenLabel,
    destroy
  }
}

/**
 * Creates an inset text component with text content
 */
export function createInsetTextWithText(
  text: string,
  hiddenLabel?: string,
  options: Partial<InsetTextConfig> = {}
): InsetTextResult {
  const config: InsetTextConfig = {
    text,
    ...options
  }
  
  if (hiddenLabel) {
    config.hiddenLabel = hiddenLabel
  }
  
  return createInsetText(config)
}

/**
 * Creates an inset text component with HTML content
 */
export function createInsetTextWithHtml(
  html: string,
  hiddenLabel?: string,
  options: Partial<InsetTextConfig> = {}
): InsetTextResult {
  const config: InsetTextConfig = {
    html,
    ...options
  }
  
  if (hiddenLabel) {
    config.hiddenLabel = hiddenLabel
  }
  
  return createInsetText(config)
}

/**
 * Creates an inset text component for health information
 */
export function createHealthInsetText(
  content: string,
  isHtml: boolean = false,
  options: Partial<InsetTextConfig> = {}
): InsetTextResult {
  const config: InsetTextConfig = {
    hiddenLabel: 'Important health information: ',
    ...options,
    classes: options.classes 
      ? `public-good-inset-text--health ${options.classes}` 
      : 'public-good-inset-text--health'
  }
  
  if (isHtml) {
    config.html = content
  } else {
    config.text = content
  }
  
  return createInsetText(config)
}

/**
 * Creates an inset text component for warnings
 */
export function createWarningInsetText(
  content: string,
  isHtml: boolean = false,
  options: Partial<InsetTextConfig> = {}
): InsetTextResult {
  const config: InsetTextConfig = {
    hiddenLabel: 'Warning: ',
    ...options,
    classes: options.classes 
      ? `public-good-inset-text--warning ${options.classes}` 
      : 'public-good-inset-text--warning'
  }
  
  if (isHtml) {
    config.html = content
  } else {
    config.text = content
  }
  
  return createInsetText(config)
}

/**
 * Initialize all inset text components from data attributes in the DOM
 */
export function initializeInsetTexts(): InsetTextResult[] {
  const elements = document.querySelectorAll('[data-public-good-inset-text]')
  const components: InsetTextResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<InsetTextConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const text = element.getAttribute('data-text')
      if (text) config.text = text
      
      const html = element.getAttribute('data-html')
      if (html) config.html = html
      
      const hiddenLabel = element.getAttribute('data-hidden-label')
      if (hiddenLabel) config.hiddenLabel = hiddenLabel
      
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
      
      // If no text or html is provided, use the element's content
      if (!config.text && !config.html) {
        config.html = element.innerHTML
      }
      
      // Create the inset text component
      const insetText = createInsetText(config as InsetTextConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(insetText.element, element)
      components.push(insetText)
      
    } catch (error) {
      console.error('Error initializing inset text component:', error)
    }
  })
  
  return components
}

// Auto-initialize inset text components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInsetTexts)
  } else {
    initializeInsetTexts()
  }
}