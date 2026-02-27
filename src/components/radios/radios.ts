/**
 * Radios Component
 * 
 * Creates radio button groups following NHS UK Design System patterns.
 * Radio buttons allow users to select a single option from a list of mutually exclusive choices.
 * 
 * Features:
 * - Single selection within a group
 * - Proper fieldset and legend structure for accessibility
 * - Optional hint text for additional guidance
 * - Conditional content reveal (divider pattern)
 * - Error handling integration
 * - Data attribute initialization
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Radio option configuration
 */
export interface RadioOption {
  value: string
  text: string
  hint?: string
  checked?: boolean
  disabled?: boolean
  conditional?: string | HTMLElement
  attributes?: Record<string, string>
}

/**
 * Radios component configuration
 */
export interface RadiosConfig {
  id?: string
  name: string
  legend: string
  legendSize?: 'small' | 'medium' | 'large'
  legendIsHeading?: boolean
  hint?: string
  errorMessage?: string
  options: RadioOption[]
  inline?: boolean
  small?: boolean
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Radios component result
 */
export interface RadiosResult {
  element: HTMLElement
  fieldset: HTMLFieldSetElement
  legend: HTMLLegendElement
  options: HTMLInputElement[]
  config: RadiosConfig
  getValue: () => string | null
  setValue: (value: string) => boolean
  getCheckedOption: () => RadioOption | null
  addOption: (option: RadioOption, index?: number) => HTMLInputElement
  removeOption: (value: string) => boolean
  disable: () => void
  enable: () => void
  showError: (message: string) => void
  hideError: () => void
  destroy: () => void
}

/**
 * Creates a radios component
 */
export function createRadios(config: RadiosConfig): RadiosResult {
  const id = config.id || generateUniqueId('radios')
  
  // Set defaults
  if (!config.id) {
    config.id = id
  }
  if (!config.legendSize) {
    config.legendSize = 'medium'
  }
  if (config.legendIsHeading === undefined) {
    config.legendIsHeading = false
  }
  if (config.inline === undefined) {
    config.inline = false
  }
  if (config.small === undefined) {
    config.small = false
  }
  
  // Create fieldset container
  const fieldset = document.createElement('fieldset')
  fieldset.className = 'public-good-fieldset'
  fieldset.id = id
  
  // Apply conditional classes
  if (config.inline) {
    fieldset.classList.add('public-good-radios--inline')
  }
  if (config.small) {
    fieldset.classList.add('public-good-radios--small')
  }
  
  // Create legend
  const legend = document.createElement('legend')
  legend.className = `public-good-fieldset__legend public-good-fieldset__legend--${config.legendSize}`
  if (config.legendIsHeading) {
    legend.classList.add('public-good-fieldset__legend--heading')
  }
  legend.textContent = config.legend
  fieldset.appendChild(legend)
  
  // Create hint text if provided
  let hintElement: HTMLElement | undefined
  if (config.hint) {
    hintElement = document.createElement('div')
    hintElement.className = 'public-good-hint'
    hintElement.id = `${id}-hint`
    hintElement.textContent = config.hint
    fieldset.appendChild(hintElement)
  }
  
  // Create error message container
  let errorElement: HTMLElement | undefined
  if (config.errorMessage) {
    errorElement = document.createElement('p')
    errorElement.className = 'public-good-error-message'
    errorElement.id = `${id}-error`
    errorElement.innerHTML = `<span class="public-good-visually-hidden">Error:</span> ${config.errorMessage}`
    fieldset.appendChild(errorElement)
    fieldset.classList.add('public-good-form-group--error')
  }
  
  // Create radios container
  const radiosContainer = document.createElement('div')
  radiosContainer.className = 'public-good-radios'
  fieldset.appendChild(radiosContainer)
  
  // Store radio inputs for easy access
  const radioInputs: HTMLInputElement[] = []
  
  // Function to create a single radio option
  function createRadioOption(option: RadioOption, index: number): HTMLElement {
    const radioItem = document.createElement('div')
    radioItem.className = 'public-good-radios__item'
    
    // Create radio input
    const radioInput = document.createElement('input')
    radioInput.className = 'public-good-radios__input'
    radioInput.type = 'radio'
    radioInput.id = `${id}-${index}`
    radioInput.name = config.name
    radioInput.value = option.value
    
    if (option.checked) {
      radioInput.checked = true
    }
    if (option.disabled) {
      radioInput.disabled = true
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
      radioInput.setAttribute('aria-describedby', describedBy.join(' '))
    }
    
    // Apply custom attributes
    if (option.attributes) {
      Object.entries(option.attributes).forEach(([key, value]) => {
        radioInput.setAttribute(key, value)
      })
    }
    
    radioItem.appendChild(radioInput)
    radioInputs.push(radioInput)
    
    // Create label
    const label = document.createElement('label')
    label.className = 'public-good-label public-good-radios__label'
    label.htmlFor = radioInput.id
    label.textContent = option.text
    radioItem.appendChild(label)
    
    // Create hint text if provided
    if (option.hint) {
      const hintText = document.createElement('div')
      hintText.className = 'public-good-hint public-good-radios__hint'
      hintText.id = `${radioInput.id}-hint`
      hintText.textContent = option.hint
      radioItem.appendChild(hintText)
      
      // Update aria-describedby
      const currentDescribedBy = radioInput.getAttribute('aria-describedby') || ''
      radioInput.setAttribute('aria-describedby', `${currentDescribedBy} ${hintText.id}`.trim())
    }
    
    // Handle conditional content
    if (option.conditional) {
      const conditionalContainer = document.createElement('div')
      conditionalContainer.className = 'public-good-radios__conditional'
      conditionalContainer.id = `conditional-${radioInput.id}`
      
      if (typeof option.conditional === 'string') {
        conditionalContainer.innerHTML = option.conditional
      } else {
        conditionalContainer.appendChild(option.conditional)
      }
      
      // Initially hide conditional content
      if (!radioInput.checked) {
        conditionalContainer.style.display = 'none'
      }
      
      radioItem.appendChild(conditionalContainer)
      
      // Set up conditional reveal
      radioInput.setAttribute('data-aria-controls', conditionalContainer.id)
      
      // Add event listener for conditional reveal
      radioInput.addEventListener('change', () => {
        // Hide all conditional content in this group first
        const allRadios = fieldset.querySelectorAll(`input[name="${config.name}"]`)
        allRadios.forEach((radio) => {
          const controls = radio.getAttribute('data-aria-controls')
          if (controls) {
            const conditional = document.getElementById(controls)
            if (conditional) {
              conditional.style.display = 'none'
            }
          }
        })
        
        // Show conditional content for checked radio
        if (radioInput.checked) {
          conditionalContainer.style.display = 'block'
        }
      })
      
      // Also listen for changes from other radios in the group
      document.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement
        if (target.type === 'radio' && target.name === config.name && target !== radioInput) {
          // Another radio in this group was selected, hide this conditional
          conditionalContainer.style.display = 'none'
        }
      })
    }
    
    return radioItem
  }
  
  // Create all radio options
  config.options.forEach((option, index) => {
    const radioElement = createRadioOption(option, index)
    radiosContainer.appendChild(radioElement)
  })
  
  // Apply custom classes
  if (config.classes) {
    fieldset.classList.add(...config.classes.split(' '))
  }
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      fieldset.setAttribute(key, value)
    })
  }
  
  // Create result object
  const result: RadiosResult = {
    element: fieldset,
    fieldset,
    legend,
    options: radioInputs,
    config,
    
    getValue(): string | null {
      const checkedRadio = radioInputs.find(radio => radio.checked)
      return checkedRadio ? checkedRadio.value : null
    },
    
    setValue(value: string): boolean {
      const targetRadio = radioInputs.find(radio => radio.value === value)
      if (targetRadio && !targetRadio.disabled) {
        // Uncheck all radios first
        radioInputs.forEach(radio => {
          radio.checked = false
        })
        
        // Check the target radio
        targetRadio.checked = true
        
        // Trigger change event to handle conditional content
        const changeEvent = new Event('change', { bubbles: true })
        targetRadio.dispatchEvent(changeEvent)
        
        return true
      }
      return false
    },
    
    getCheckedOption(): RadioOption | null {
      const checkedRadio = radioInputs.find(radio => radio.checked)
      if (checkedRadio) {
        const index = radioInputs.indexOf(checkedRadio)
        return config.options[index] || null
      }
      return null
    },
    
    addOption(option: RadioOption, index?: number): HTMLInputElement {
      const insertIndex = index !== undefined ? index : config.options.length
      config.options.splice(insertIndex, 0, option)
      
      const radioElement = createRadioOption(option, insertIndex)
      
      if (insertIndex >= radiosContainer.children.length) {
        radiosContainer.appendChild(radioElement)
      } else {
        radiosContainer.insertBefore(radioElement, radiosContainer.children[insertIndex] ?? null)
      }
      
      // Return the newly created input for reference
      return radioInputs[radioInputs.length - 1]!
    },
    
    removeOption(value: string): boolean {
      const optionIndex = config.options.findIndex(opt => opt.value === value)
      if (optionIndex !== -1) {
        // Remove from config
        config.options.splice(optionIndex, 1)
        
        // Remove from DOM
        const radioToRemove = radioInputs.find(radio => radio.value === value)
        if (radioToRemove) {
          const radioItem = radioToRemove.closest('.public-good-radios__item')
          if (radioItem) {
            radioItem.remove()
          }
          
          // Remove from radioInputs array
          const inputIndex = radioInputs.indexOf(radioToRemove)
          if (inputIndex !== -1) {
            radioInputs.splice(inputIndex, 1)
          }
        }
        
        return true
      }
      return false
    },
    
    disable(): void {
      radioInputs.forEach(radio => {
        radio.disabled = true
      })
      fieldset.classList.add('public-good-radios--disabled')
    },
    
    enable(): void {
      radioInputs.forEach(radio => {
        radio.disabled = false
      })
      fieldset.classList.remove('public-good-radios--disabled')
    },
    
    showError(message: string): void {
      config.errorMessage = message
      
      // Create error element if it doesn't exist
      if (!errorElement) {
        errorElement = document.createElement('p')
        errorElement.className = 'public-good-error-message'
        errorElement.id = `${id}-error`
        
        // Insert error after hint (if exists) or after legend
        const insertAfter = hintElement || legend
        insertAfter.parentNode?.insertBefore(errorElement, insertAfter.nextSibling)
      }
      
      errorElement.innerHTML = `<span class="public-good-visually-hidden">Error:</span> ${message}`
      fieldset.classList.add('public-good-form-group--error')
      
      // Update aria-describedby for all radio inputs
      radioInputs.forEach(radio => {
        const currentDescribedBy = radio.getAttribute('aria-describedby') || ''
        const describedByParts = currentDescribedBy.split(' ').filter(id => id !== errorElement!.id)
        describedByParts.push(errorElement!.id)
        radio.setAttribute('aria-describedby', describedByParts.join(' '))
      })
    },
    
    hideError(): void {
      if (errorElement) {
        errorElement.remove()
        errorElement = undefined
      }
      fieldset.classList.remove('public-good-form-group--error')
      config.errorMessage = undefined
      
      // Remove error ID from aria-describedby
      radioInputs.forEach(radio => {
        const currentDescribedBy = radio.getAttribute('aria-describedby') || ''
        const describedByParts = currentDescribedBy.split(' ').filter(part => part.trim() !== '' && part !== `${config.id}-error`)
        if (describedByParts.length > 0) {
          radio.setAttribute('aria-describedby', describedByParts.join(' '))
        } else {
          radio.removeAttribute('aria-describedby')
        }
      })
    },
    
    destroy(): void {
      fieldset.remove()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:radios:destroyed', {
        detail: { element: fieldset, config: config },
        bubbles: true
      })
      document.dispatchEvent(event)
    }
  }
  
  // Add event listeners for change events
  radioInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      // Dispatch custom event
      const event = new CustomEvent('public-good:radios:changed', {
        detail: { 
          value: result.getValue(),
          option: result.getCheckedOption(),
          element: fieldset,
          config: config 
        },
        bubbles: true
      })
      fieldset.dispatchEvent(event)
    })
  })
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:radios:created', {
    detail: { element: fieldset, options: radioInputs, config: config },
    bubbles: true
  })
  fieldset.dispatchEvent(creationEvent)
  
  return result
}

/**
 * Creates a simple radio group with basic options
 */
export function createSimpleRadios(
  name: string,
  legend: string,
  options: Array<{ value: string; text: string; checked?: boolean }>,
  config: Partial<RadiosConfig> = {}
): RadiosResult {
  return createRadios({
    name,
    legend,
    options: options.map(opt => ({
      value: opt.value,
      text: opt.text,
      checked: opt.checked || false
    })),
    ...config
  })
}

/**
 * Creates an inline radio group
 */
export function createInlineRadios(
  name: string,
  legend: string,
  options: Array<{ value: string; text: string; checked?: boolean }>,
  config: Partial<RadiosConfig> = {}
): RadiosResult {
  return createRadios({
    name,
    legend,
    options: options.map(opt => ({
      value: opt.value,
      text: opt.text,
      checked: opt.checked || false
    })),
    inline: true,
    ...config
  })
}

/**
 * Creates a small radio group
 */
export function createSmallRadios(
  name: string,
  legend: string,
  options: Array<{ value: string; text: string; checked?: boolean }>,
  config: Partial<RadiosConfig> = {}
): RadiosResult {
  return createRadios({
    name,
    legend,
    options: options.map(opt => ({
      value: opt.value,
      text: opt.text,
      checked: opt.checked || false
    })),
    small: true,
    ...config
  })
}

/**
 * Initialize all radios components from data attributes in the DOM
 */
export function initializeRadios(): RadiosResult[] {
  const elements = document.querySelectorAll('[data-public-good-radios]')
  const components: RadiosResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<RadiosConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const name = element.getAttribute('data-name')
      if (name) config.name = name
      
      const legend = element.getAttribute('data-legend')
      if (legend) config.legend = legend
      
      const legendSize = element.getAttribute('data-legend-size')
      if (legendSize && ['small', 'medium', 'large'].includes(legendSize)) {
        config.legendSize = legendSize as 'small' | 'medium' | 'large'
      }
      
      const legendIsHeading = element.getAttribute('data-legend-heading')
      if (legendIsHeading) config.legendIsHeading = legendIsHeading === 'true'
      
      const hint = element.getAttribute('data-hint')
      if (hint) config.hint = hint
      
      const errorMessage = element.getAttribute('data-error')
      if (errorMessage) config.errorMessage = errorMessage
      
      const inline = element.getAttribute('data-inline')
      if (inline) config.inline = inline === 'true'
      
      const small = element.getAttribute('data-small')
      if (small) config.small = small === 'true'
      
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
      if (!config.name || !config.legend || !config.options) {
        console.warn('Radios component requires name, legend, and options')
        return
      }
      
      // Create the radios component
      const radios = createRadios(config as RadiosConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(radios.element, element)
      components.push(radios)
      
    } catch (error) {
      console.error('Error initializing radios component:', error)
    }
  })
  
  return components
}

// Auto-initialize radios components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRadios)
  } else {
    initializeRadios()
  }
}