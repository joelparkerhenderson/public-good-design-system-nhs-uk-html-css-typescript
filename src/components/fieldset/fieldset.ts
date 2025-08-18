/**
 * Public Good Design System - Fieldset Component
 * TypeScript implementation of accessible fieldset grouping for forms
 * Based on NHS UK Design System fieldset patterns
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Legend configuration interface
 */
export interface LegendConfig {
  text?: string
  html?: string
  isPageHeading?: boolean
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Fieldset configuration interface
 */
export interface FieldsetConfig {
  id?: string
  legend: LegendConfig
  content?: string
  classes?: string
  attributes?: Record<string, string>
  role?: string
}

/**
 * Fieldset result interface
 */
export interface FieldsetResult {
  element: HTMLFieldSetElement
  legend: HTMLLegendElement
  config: FieldsetConfig
  destroy: () => void
  setLegend: (legendConfig: LegendConfig) => void
  setContent: (content: string) => void
  addContent: (content: string | HTMLElement) => void
  clearContent: () => void
  getFormElements: () => HTMLElement[]
  setDisabled: (disabled: boolean) => void
  isDisabled: () => boolean
}

/**
 * Creates a fieldset component
 */
export const createFieldset = (config: FieldsetConfig): FieldsetResult => {
  const id = config.id || generateUniqueId('fieldset')
  
  // Create fieldset element
  const fieldset = document.createElement('fieldset')
  fieldset.id = id
  fieldset.className = `public-good-fieldset${config.classes ? ` ${config.classes}` : ''}`
  
  if (config.role) {
    fieldset.setAttribute('role', config.role)
  }
  
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      fieldset.setAttribute(key, value)
    })
  }
  
  // Create legend element
  const legend = createLegendElement(config.legend)
  fieldset.appendChild(legend)
  
  // Add content if provided
  if (config.content) {
    const contentDiv = document.createElement('div')
    contentDiv.className = 'public-good-fieldset__content'
    contentDiv.innerHTML = config.content
    fieldset.appendChild(contentDiv)
  }
  
  // Component API methods
  const setLegend = (legendConfig: LegendConfig): void => {
    config.legend = legendConfig
    const newLegend = createLegendElement(legendConfig)
    fieldset.replaceChild(newLegend, legend)
    Object.assign(legend, newLegend)
    
    // Emit event
    const changeEvent = new CustomEvent('public-good:fieldset:legend-changed', {
      detail: {
        id,
        legend: legendConfig
      },
      bubbles: true
    })
    fieldset.dispatchEvent(changeEvent)
  }
  
  const setContent = (content: string): void => {
    config.content = content
    
    // Find or create content container
    let contentDiv = fieldset.querySelector('.public-good-fieldset__content') as HTMLDivElement
    if (!contentDiv) {
      contentDiv = document.createElement('div')
      contentDiv.className = 'public-good-fieldset__content'
      fieldset.appendChild(contentDiv)
    }
    
    contentDiv.innerHTML = content
    
    // Emit event
    const changeEvent = new CustomEvent('public-good:fieldset:content-changed', {
      detail: {
        id,
        content
      },
      bubbles: true
    })
    fieldset.dispatchEvent(changeEvent)
  }
  
  const addContent = (content: string | HTMLElement): void => {
    // Find or create content container
    let contentDiv = fieldset.querySelector('.public-good-fieldset__content') as HTMLDivElement
    if (!contentDiv) {
      contentDiv = document.createElement('div')
      contentDiv.className = 'public-good-fieldset__content'
      fieldset.appendChild(contentDiv)
    }
    
    if (typeof content === 'string') {
      contentDiv.insertAdjacentHTML('beforeend', content)
    } else {
      contentDiv.appendChild(content)
    }
    
    // Emit event
    const addEvent = new CustomEvent('public-good:fieldset:content-added', {
      detail: {
        id,
        content: typeof content === 'string' ? content : content.outerHTML
      },
      bubbles: true
    })
    fieldset.dispatchEvent(addEvent)
  }
  
  const clearContent = (): void => {
    const contentDiv = fieldset.querySelector('.public-good-fieldset__content')
    if (contentDiv) {
      contentDiv.innerHTML = ''
    }
    
    // Emit event
    const clearEvent = new CustomEvent('public-good:fieldset:content-cleared', {
      detail: {
        id
      },
      bubbles: true
    })
    fieldset.dispatchEvent(clearEvent)
  }
  
  const getFormElements = (): HTMLElement[] => {
    const formElements = fieldset.querySelectorAll('input, textarea, select, button')
    return Array.from(formElements) as HTMLElement[]
  }
  
  const setDisabled = (disabled: boolean): void => {
    fieldset.disabled = disabled
    
    // Emit event
    const disabledEvent = new CustomEvent('public-good:fieldset:disabled-changed', {
      detail: {
        id,
        disabled
      },
      bubbles: true
    })
    fieldset.dispatchEvent(disabledEvent)
  }
  
  const isDisabled = (): boolean => {
    return fieldset.disabled
  }
  
  const destroy = (): void => {
    if (fieldset.parentNode) {
      fieldset.parentNode.removeChild(fieldset)
    }
  }
  
  return {
    element: fieldset,
    legend,
    config,
    destroy,
    setLegend,
    setContent,
    addContent,
    clearContent,
    getFormElements,
    setDisabled,
    isDisabled
  }
}

/**
 * Creates a legend element based on configuration
 */
function createLegendElement(legendConfig: LegendConfig): HTMLLegendElement {
  const legend = document.createElement('legend')
  legend.className = `public-good-fieldset__legend${legendConfig.classes ? ` ${legendConfig.classes}` : ''}`
  
  if (legendConfig.attributes) {
    Object.entries(legendConfig.attributes).forEach(([key, value]) => {
      legend.setAttribute(key, value)
    })
  }
  
  if (legendConfig.isPageHeading) {
    // Create heading element inside legend
    const headingLevel = legendConfig.headingLevel || 1
    const heading = document.createElement(`h${headingLevel}`) as HTMLHeadingElement
    heading.className = 'public-good-fieldset__heading'
    
    if (legendConfig.html) {
      heading.innerHTML = legendConfig.html
    } else if (legendConfig.text) {
      heading.textContent = legendConfig.text
    }
    
    legend.appendChild(heading)
    legend.classList.add('public-good-fieldset__legend--page-heading')
  } else {
    // Add content directly to legend
    if (legendConfig.html) {
      legend.innerHTML = legendConfig.html
    } else if (legendConfig.text) {
      legend.textContent = legendConfig.text
    }
  }
  
  return legend
}

/**
 * Initialize fieldset components from data attributes
 */
export const initializeFieldsets = (): FieldsetResult[] => {
  const elements = document.querySelectorAll('[data-public-good-fieldset]')
  const components: FieldsetResult[] = []
  
  elements.forEach((element) => {
    try {
      const legendText = element.getAttribute('data-legend-text')
      const legendHtml = element.getAttribute('data-legend-html')
      
      if (!legendText && !legendHtml) {
        console.warn('Fieldset element missing required data-legend-text or data-legend-html attribute')
        return
      }
      
      const config: FieldsetConfig = {
        legend: {}
      }
      
      // Parse legend configuration
      if (legendText) config.legend.text = legendText
      if (legendHtml) config.legend.html = legendHtml
      
      const isPageHeading = element.getAttribute('data-legend-is-page-heading')
      if (isPageHeading === 'true') config.legend.isPageHeading = true
      
      const headingLevel = element.getAttribute('data-legend-heading-level')
      if (headingLevel) config.legend.headingLevel = parseInt(headingLevel) as 1 | 2 | 3 | 4 | 5 | 6
      
      const legendClasses = element.getAttribute('data-legend-classes')
      if (legendClasses) config.legend.classes = legendClasses
      
      // Parse fieldset configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      const role = element.getAttribute('data-role')
      if (role) config.role = role
      
      const content = element.innerHTML.trim()
      if (content) config.content = content
      
      const fieldset = createFieldset(config)
      element.parentNode?.replaceChild(fieldset.element, element)
      components.push(fieldset)
    } catch (error) {
      console.error('Error initializing fieldset component:', error)
    }
  })
  
  return components
}

/**
 * Helper function to create a simple fieldset
 */
export const createSimpleFieldset = (
  legendText: string,
  content?: string,
  options?: Partial<FieldsetConfig>
): FieldsetResult => {
  const config: FieldsetConfig = {
    legend: { text: legendText },
    ...options
  }
  if (content !== undefined) {
    config.content = content
  }
  return createFieldset(config)
}

/**
 * Helper function to create a fieldset with page heading
 */
export const createPageHeadingFieldset = (
  headingText: string,
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 1,
  content?: string,
  options?: Partial<FieldsetConfig>
): FieldsetResult => {
  const config: FieldsetConfig = {
    legend: {
      text: headingText,
      isPageHeading: true,
      headingLevel
    },
    ...options
  }
  if (content !== undefined) {
    config.content = content
  }
  return createFieldset(config)
}

/**
 * Helper function to create a fieldset with HTML legend
 */
export const createFieldsetWithHTMLLegend = (
  legendHtml: string,
  content?: string,
  options?: Partial<FieldsetConfig>
): FieldsetResult => {
  const config: FieldsetConfig = {
    legend: { html: legendHtml },
    ...options
  }
  if (content !== undefined) {
    config.content = content
  }
  return createFieldset(config)
}

/**
 * Helper function to create an address fieldset
 */
export const createAddressFieldset = (
  legendText: string = 'Address',
  options?: Partial<FieldsetConfig>
): FieldsetResult => {
  const addressFields = `
    <div class="public-good-form-group">
      <label for="address-line-1" class="public-good-label">Address line 1</label>
      <input type="text" id="address-line-1" class="public-good-input" />
    </div>
    
    <div class="public-good-form-group">
      <label for="address-line-2" class="public-good-label">Address line 2 (optional)</label>
      <input type="text" id="address-line-2" class="public-good-input" />
    </div>
    
    <div class="public-good-form-group">
      <label for="address-town" class="public-good-label">Town or city</label>
      <input type="text" id="address-town" class="public-good-input" />
    </div>
    
    <div class="public-good-form-group">
      <label for="address-county" class="public-good-label">County (optional)</label>
      <input type="text" id="address-county" class="public-good-input" />
    </div>
    
    <div class="public-good-form-group">
      <label for="address-postcode" class="public-good-label">Postcode</label>
      <input type="text" id="address-postcode" class="public-good-input" />
    </div>
  `
  
  return createFieldset({
    legend: { text: legendText },
    content: addressFields,
    ...options
  })
}

/**
 * Helper function to create a date fieldset
 */
export const createDateFieldset = (
  legendText: string = 'Date',
  options?: Partial<FieldsetConfig>
): FieldsetResult => {
  const dateFields = `
    <div class="public-good-date-input">
      <div class="public-good-date-input__item">
        <div class="public-good-form-group">
          <label for="date-day" class="public-good-label public-good-date-input__label">Day</label>
          <input type="text" id="date-day" class="public-good-input public-good-date-input__input" inputmode="numeric" maxlength="2" />
        </div>
      </div>
      
      <div class="public-good-date-input__item">
        <div class="public-good-form-group">
          <label for="date-month" class="public-good-label public-good-date-input__label">Month</label>
          <input type="text" id="date-month" class="public-good-input public-good-date-input__input" inputmode="numeric" maxlength="2" />
        </div>
      </div>
      
      <div class="public-good-date-input__item">
        <div class="public-good-form-group">
          <label for="date-year" class="public-good-label public-good-date-input__label">Year</label>
          <input type="text" id="date-year" class="public-good-input public-good-date-input__input" inputmode="numeric" maxlength="4" />
        </div>
      </div>
    </div>
  `
  
  return createFieldset({
    legend: { text: legendText },
    content: dateFields,
    ...options
  })
}

/**
 * Helper function to group form elements with a fieldset
 */
export const groupFormElements = (
  legendText: string,
  elements: HTMLElement[],
  options?: Partial<FieldsetConfig>
): FieldsetResult => {
  const fieldset = createSimpleFieldset(legendText, undefined, options)
  
  elements.forEach(element => {
    fieldset.addContent(element)
  })
  
  return fieldset
}

/**
 * Initialize all fieldset components on the page
 */
export const initAllFieldsets = (): FieldsetResult[] => {
  return initializeFieldsets()
}