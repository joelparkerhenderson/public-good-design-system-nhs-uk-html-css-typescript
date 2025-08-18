/**
 * Select Component
 * 
 * Creates dropdown select elements following NHS UK Design System patterns.
 * Use select to let users choose an option from a long list but only use it as a last resort.
 * Consider using radio buttons or other alternatives for shorter lists.
 * 
 * Features:
 * - Single option selection from a dropdown list
 * - Proper label and form structure for accessibility
 * - Optional hint text for additional guidance
 * - Error handling integration
 * - Data attribute initialization
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Select option configuration
 */
export interface SelectOption {
  value: string
  text: string
  selected?: boolean
  disabled?: boolean
  attributes?: Record<string, string>
}

/**
 * Select component configuration
 */
export interface SelectConfig {
  id?: string
  name: string
  label: string
  hint?: string
  errorMessage?: string
  options: SelectOption[]
  multiple?: boolean
  size?: number
  required?: boolean
  disabled?: boolean
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Select component result
 */
export interface SelectResult {
  element: HTMLElement
  select: HTMLSelectElement
  label: HTMLLabelElement
  config: SelectConfig
  getValue: () => string | string[] | null
  setValue: (value: string | string[]) => boolean
  getSelectedOption: () => SelectOption | SelectOption[] | null
  addOption: (option: SelectOption, index?: number) => HTMLOptionElement
  removeOption: (value: string) => boolean
  disable: () => void
  enable: () => void
  showError: (message: string) => void
  hideError: () => void
  destroy: () => void
}

/**
 * Creates a select component
 */
export function createSelect(config: SelectConfig): SelectResult {
  const id = config.id || generateUniqueId('select')
  
  // Set defaults
  if (!config.id) {
    config.id = id
  }
  if (config.multiple === undefined) {
    config.multiple = false
  }
  if (config.required === undefined) {
    config.required = false
  }
  if (config.disabled === undefined) {
    config.disabled = false
  }
  
  // Create form group container
  const formGroup = document.createElement('div')
  formGroup.className = 'public-good-form-group'
  
  // Create label
  const label = document.createElement('label')
  label.className = 'public-good-label'
  label.htmlFor = id
  label.textContent = config.label
  formGroup.appendChild(label)
  
  // Create hint text if provided
  let hintElement: HTMLElement | undefined
  if (config.hint) {
    hintElement = document.createElement('div')
    hintElement.className = 'public-good-hint'
    hintElement.id = `${id}-hint`
    hintElement.textContent = config.hint
    formGroup.appendChild(hintElement)
  }
  
  // Create error message container
  let errorElement: HTMLElement | undefined
  if (config.errorMessage) {
    errorElement = document.createElement('p')
    errorElement.className = 'public-good-error-message'
    errorElement.id = `${id}-error`
    errorElement.innerHTML = `<span class="public-good-visually-hidden">Error:</span> ${config.errorMessage}`
    formGroup.appendChild(errorElement)
    formGroup.classList.add('public-good-form-group--error')
  }
  
  // Create select element
  const select = document.createElement('select')
  select.className = 'public-good-select'
  select.id = id
  select.name = config.name
  
  if (config.multiple) {
    select.multiple = true
  }
  if (config.size && config.size > 1) {
    select.size = config.size
  }
  if (config.required) {
    select.required = true
  }
  if (config.disabled) {
    select.disabled = true
  }
  
  // Set ARIA attributes
  const describedBy: string[] = []
  if (hintElement) {
    describedBy.push(hintElement.id)
  }
  if (errorElement) {
    describedBy.push(errorElement.id)
  }
  if (describedBy.length > 0) {
    select.setAttribute('aria-describedby', describedBy.join(' '))
  }
  
  // Apply custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      select.setAttribute(key, value)
    })
  }
  
  formGroup.appendChild(select)
  
  // Function to create a single option
  function createOption(optionConfig: SelectOption): HTMLOptionElement {
    const option = document.createElement('option')
    option.value = optionConfig.value
    option.textContent = optionConfig.text
    
    if (optionConfig.selected) {
      option.selected = true
    }
    if (optionConfig.disabled) {
      option.disabled = true
    }
    
    // Apply custom attributes
    if (optionConfig.attributes) {
      Object.entries(optionConfig.attributes).forEach(([key, value]) => {
        option.setAttribute(key, value)
      })
    }
    
    return option
  }
  
  // Create all options
  config.options.forEach((optionConfig) => {
    const option = createOption(optionConfig)
    select.appendChild(option)
  })
  
  // Apply custom classes
  if (config.classes) {
    formGroup.classList.add(...config.classes.split(' '))
  }
  
  // Create result object
  const result: SelectResult = {
    element: formGroup,
    select,
    label,
    config,
    
    getValue(): string | string[] | null {
      if (config.multiple) {
        const selectedOptions = Array.from(select.selectedOptions)
        return selectedOptions.length > 0 ? selectedOptions.map(opt => opt.value) : null
      } else {
        return select.value || null
      }
    },
    
    setValue(value: string | string[]): boolean {
      try {
        if (config.multiple && Array.isArray(value)) {
          // Clear all selections first
          Array.from(select.options).forEach(option => {
            option.selected = false
          })
          
          // Set selected values
          let hasValidValue = false
          value.forEach(val => {
            const option = Array.from(select.options).find(opt => opt.value === val)
            if (option && !option.disabled) {
              option.selected = true
              hasValidValue = true
            }
          })
          
          if (hasValidValue) {
            // Trigger change event
            const changeEvent = new Event('change', { bubbles: true })
            select.dispatchEvent(changeEvent)
            return true
          }
        } else if (!config.multiple && typeof value === 'string') {
          const option = Array.from(select.options).find(opt => opt.value === value)
          if (option && !option.disabled) {
            select.value = value
            
            // Trigger change event
            const changeEvent = new Event('change', { bubbles: true })
            select.dispatchEvent(changeEvent)
            return true
          }
        }
        
        return false
      } catch (error) {
        console.warn('Error setting select value:', error)
        return false
      }
    },
    
    getSelectedOption(): SelectOption | SelectOption[] | null {
      if (config.multiple) {
        const selectedOptions = Array.from(select.selectedOptions)
        if (selectedOptions.length > 0) {
          return selectedOptions.map(option => {
            const index = Array.from(select.options).indexOf(option)
            return config.options[index]
          }).filter((option): option is SelectOption => Boolean(option))
        }
        return null
      } else {
        const selectedOption = select.selectedOptions[0]
        if (selectedOption) {
          const index = Array.from(select.options).indexOf(selectedOption)
          return config.options[index] || null
        }
        return null
      }
    },
    
    addOption(option: SelectOption, index?: number): HTMLOptionElement {
      const insertIndex = index !== undefined ? index : config.options.length
      config.options.splice(insertIndex, 0, option)
      
      const optionElement = createOption(option)
      
      if (insertIndex >= select.options.length) {
        select.appendChild(optionElement)
      } else {
        const referenceNode = select.options[insertIndex]
        if (referenceNode) {
          select.insertBefore(optionElement, referenceNode)
        } else {
          select.appendChild(optionElement)
        }
      }
      
      return optionElement
    },
    
    removeOption(value: string): boolean {
      const optionIndex = config.options.findIndex(opt => opt.value === value)
      if (optionIndex !== -1) {
        // Remove from config
        config.options.splice(optionIndex, 1)
        
        // Remove from DOM
        const optionToRemove = Array.from(select.options).find(opt => opt.value === value)
        if (optionToRemove) {
          optionToRemove.remove()
        }
        
        return true
      }
      return false
    },
    
    disable(): void {
      select.disabled = true
      config.disabled = true
      formGroup.classList.add('public-good-form-group--disabled')
    },
    
    enable(): void {
      select.disabled = false
      config.disabled = false
      formGroup.classList.remove('public-good-form-group--disabled')
    },
    
    showError(message: string): void {
      config.errorMessage = message
      
      // Create error element if it doesn't exist
      if (!errorElement) {
        errorElement = document.createElement('p')
        errorElement.className = 'public-good-error-message'
        errorElement.id = `${id}-error`
        
        // Insert error after hint (if exists) or after label
        const insertAfter = hintElement || label
        insertAfter.parentNode?.insertBefore(errorElement, insertAfter.nextSibling)
      }
      
      errorElement.innerHTML = `<span class="public-good-visually-hidden">Error:</span> ${message}`
      formGroup.classList.add('public-good-form-group--error')
      
      // Update aria-describedby
      const currentDescribedBy = select.getAttribute('aria-describedby') || ''
      const describedByParts = currentDescribedBy.split(' ').filter(id => id !== errorElement!.id)
      describedByParts.push(errorElement!.id)
      select.setAttribute('aria-describedby', describedByParts.join(' '))
    },
    
    hideError(): void {
      if (errorElement) {
        errorElement.remove()
        errorElement = undefined
      }
      formGroup.classList.remove('public-good-form-group--error')
      delete config.errorMessage
      
      // Remove error ID from aria-describedby
      const currentDescribedBy = select.getAttribute('aria-describedby') || ''
      const describedByParts = currentDescribedBy.split(' ').filter(part => part.trim() !== '' && part !== `${config.id}-error`)
      if (describedByParts.length > 0) {
        select.setAttribute('aria-describedby', describedByParts.join(' '))
      } else {
        select.removeAttribute('aria-describedby')
      }
    },
    
    destroy(): void {
      formGroup.remove()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:select:destroyed', {
        detail: { element: formGroup, config: config },
        bubbles: true
      })
      document.dispatchEvent(event)
    }
  }
  
  // Add event listeners for change events
  select.addEventListener('change', () => {
    // Dispatch custom event
    const event = new CustomEvent('public-good:select:changed', {
      detail: { 
        value: result.getValue(),
        selectedOption: result.getSelectedOption(),
        element: formGroup,
        config: config 
      },
      bubbles: true
    })
    formGroup.dispatchEvent(event)
  })
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:select:created', {
    detail: { element: formGroup, select, config: config },
    bubbles: true
  })
  formGroup.dispatchEvent(creationEvent)
  
  return result
}

/**
 * Creates a simple select with basic options
 */
export function createSimpleSelect(
  name: string,
  label: string,
  options: Array<{ value: string; text: string; selected?: boolean }>,
  config: Partial<SelectConfig> = {}
): SelectResult {
  return createSelect({
    name,
    label,
    options: options.map(opt => ({
      value: opt.value,
      text: opt.text,
      selected: opt.selected || false
    })),
    ...config
  })
}

/**
 * Creates a required select field
 */
export function createRequiredSelect(
  name: string,
  label: string,
  options: Array<{ value: string; text: string; selected?: boolean }>,
  config: Partial<SelectConfig> = {}
): SelectResult {
  return createSelect({
    name,
    label,
    options: options.map(opt => ({
      value: opt.value,
      text: opt.text,
      selected: opt.selected || false
    })),
    required: true,
    ...config
  })
}

/**
 * Creates a multiple selection select
 */
export function createMultiSelect(
  name: string,
  label: string,
  options: Array<{ value: string; text: string; selected?: boolean }>,
  config: Partial<SelectConfig> = {}
): SelectResult {
  return createSelect({
    name,
    label,
    options: options.map(opt => ({
      value: opt.value,
      text: opt.text,
      selected: opt.selected || false
    })),
    multiple: true,
    size: config.size || Math.min(options.length, 4), // Show up to 4 options by default
    ...config
  })
}

/**
 * Initialize all select components from data attributes in the DOM
 */
export function initializeSelects(): SelectResult[] {
  const elements = document.querySelectorAll('[data-public-good-select]')
  const components: SelectResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<SelectConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const name = element.getAttribute('data-name')
      if (name) config.name = name
      
      const label = element.getAttribute('data-label')
      if (label) config.label = label
      
      const hint = element.getAttribute('data-hint')
      if (hint) config.hint = hint
      
      const errorMessage = element.getAttribute('data-error')
      if (errorMessage) config.errorMessage = errorMessage
      
      const multiple = element.getAttribute('data-multiple')
      if (multiple) config.multiple = multiple === 'true'
      
      const size = element.getAttribute('data-size')
      if (size) config.size = parseInt(size, 10)
      
      const required = element.getAttribute('data-required')
      if (required) config.required = required === 'true'
      
      const disabled = element.getAttribute('data-disabled')
      if (disabled) config.disabled = disabled === 'true'
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      // Parse options from data attribute
      const optionsData = element.getAttribute('data-options')
      if (optionsData) {
        try {
          config.options = JSON.parse(optionsData)
        } catch (error) {
          console.warn('Invalid JSON in data-options attribute:', error)
          return
        }
      }
      
      // Parse custom attributes
      const customAttributes = element.getAttribute('data-attributes')
      if (customAttributes) {
        try {
          config.attributes = JSON.parse(customAttributes)
        } catch (error) {
          console.warn('Invalid JSON in data-attributes attribute:', error)
        }
      }
      
      // Ensure required fields are provided
      if (!config.name || !config.label || !config.options) {
        console.warn('Select component requires name, label, and options')
        return
      }
      
      // Create the select component
      const select = createSelect(config as SelectConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(select.element, element)
      components.push(select)
      
    } catch (error) {
      console.error('Error initializing select component:', error)
    }
  })
  
  return components
}

// Auto-initialize select components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSelects)
  } else {
    initializeSelects()
  }
}