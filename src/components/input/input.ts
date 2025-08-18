/**
 * Input Component
 * 
 * Creates accessible text input components following NHS UK Design System patterns.
 * Supports single-line text entry with various configurations, labels, hints, and error states.
 * 
 * Features:
 * - Multiple input types (text, email, tel, number, search, url, password)
 * - Label and hint text support
 * - Error state handling with accessible messaging
 * - Fixed and fluid width configurations
 * - Prefix and suffix support
 * - Autocomplete and input mode attributes
 * - Character and numeric input types
 * - Data attribute initialization
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Input component configuration
 */
export interface InputConfig {
  id?: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'search' | 'url' | 'password'
  name?: string
  value?: string
  label?: string
  hint?: string
  placeholder?: string
  autocomplete?: string
  inputmode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url'
  pattern?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  minlength?: number
  width?: 'full' | 'three-quarters' | 'two-thirds' | 'one-half' | 'one-third' | 'one-quarter' | 
          '20' | '10' | '5' | '4' | '3' | '2'
  prefix?: string
  suffix?: string
  errorMessage?: string
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Input component result
 */
export interface InputResult {
  element: HTMLElement
  input: HTMLInputElement
  config: InputConfig
  getValue: () => string
  setValue: (value: string) => void
  setError: (message: string) => void
  clearError: () => void
  focus: () => void
  blur: () => void
  destroy: () => void
}

/**
 * Creates an input component
 */
export function createInput(config: InputConfig = {}): InputResult {
  const id = config.id || generateUniqueId('input')
  
  // Set defaults in config
  if (!config.id) {
    config.id = id
  }
  if (!config.type) {
    config.type = 'text'
  }
  if (!config.name) {
    config.name = id
  }
  
  // Create form group container
  const formGroup = document.createElement('div')
  formGroup.className = 'public-good-form-group' + (config.errorMessage ? ' public-good-form-group--error' : '')
  
  // Create label
  let labelElement: HTMLLabelElement | null = null
  if (config.label) {
    labelElement = document.createElement('label')
    labelElement.className = 'public-good-label'
    labelElement.setAttribute('for', id)
    labelElement.textContent = config.label
    formGroup.appendChild(labelElement)
  }
  
  // Create hint text
  let hintElement: HTMLElement | null = null
  if (config.hint) {
    hintElement = document.createElement('div')
    hintElement.className = 'public-good-hint'
    hintElement.id = `${id}-hint`
    hintElement.textContent = config.hint
    formGroup.appendChild(hintElement)
  }
  
  // Create error message
  let errorElement: HTMLElement | null = null
  if (config.errorMessage) {
    errorElement = document.createElement('span')
    errorElement.className = 'public-good-error-message'
    errorElement.id = `${id}-error`
    errorElement.innerHTML = `<span class="public-good-sr-only">Error:</span> ${config.errorMessage}`
    formGroup.appendChild(errorElement)
  }
  
  // Create input wrapper for prefix/suffix support
  const inputWrapper = document.createElement('div')
  inputWrapper.className = 'public-good-input-wrapper'
  
  // Create prefix
  if (config.prefix) {
    const prefix = document.createElement('div')
    prefix.className = 'public-good-input__prefix'
    prefix.setAttribute('aria-hidden', 'true')
    prefix.textContent = config.prefix
    inputWrapper.appendChild(prefix)
  }
  
  // Create input element
  const input = document.createElement('input')
  input.className = 'public-good-input'
  input.id = id
  input.type = config.type
  input.name = config.name
  
  // Set input attributes
  if (config.value) input.value = config.value
  if (config.placeholder) input.placeholder = config.placeholder
  if (config.autocomplete) input.autocomplete = config.autocomplete as AutoFill
  if (config.inputmode) input.inputMode = config.inputmode
  if (config.pattern) input.pattern = config.pattern
  if (config.required) input.required = config.required
  if (config.disabled) input.disabled = config.disabled
  if (config.readonly) input.readOnly = config.readonly
  if (config.maxlength) input.maxLength = config.maxlength
  if (config.minlength) input.minLength = config.minlength
  
  // Apply width classes
  if (config.width) {
    if (['20', '10', '5', '4', '3', '2'].includes(config.width)) {
      input.classList.add(`public-good-input--width-${config.width}`)
    } else {
      input.classList.add(`public-good-u-width-${config.width}`)
    }
  }
  
  // Apply custom classes
  if (config.classes) {
    input.classList.add(...config.classes.split(' '))
  }
  
  // Set error state
  if (config.errorMessage) {
    input.classList.add('public-good-input--error')
  }
  
  // Set aria-describedby
  const describedBy: string[] = []
  if (hintElement) describedBy.push(`${id}-hint`)
  if (errorElement) describedBy.push(`${id}-error`)
  if (describedBy.length > 0) {
    input.setAttribute('aria-describedby', describedBy.join(' '))
  }
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      input.setAttribute(key, value)
    })
  }
  
  inputWrapper.appendChild(input)
  
  // Create suffix
  if (config.suffix) {
    const suffix = document.createElement('div')
    suffix.className = 'public-good-input__suffix'
    suffix.setAttribute('aria-hidden', 'true')
    suffix.textContent = config.suffix
    inputWrapper.appendChild(suffix)
  }
  
  formGroup.appendChild(inputWrapper)
  
  // Get value method
  function getValue(): string {
    return input.value
  }
  
  // Set value method
  function setValue(value: string): void {
    input.value = value
    config.value = value
    
    // Dispatch input event
    const event = new Event('input', { bubbles: true })
    input.dispatchEvent(event)
    
    // Dispatch custom event
    const customEvent = new CustomEvent('public-good:input:value-changed', {
      detail: { 
        value, 
        element: formGroup,
        input: input,
        config: config 
      },
      bubbles: true
    })
    formGroup.dispatchEvent(customEvent)
  }
  
  // Set error method
  function setError(message: string): void {
    config.errorMessage = message
    
    // Add error classes
    formGroup.classList.add('public-good-form-group--error')
    input.classList.add('public-good-input--error')
    
    // Create or update error message
    if (!errorElement) {
      errorElement = document.createElement('span')
      errorElement.className = 'public-good-error-message'
      errorElement.id = `${id}-error`
      formGroup.insertBefore(errorElement, inputWrapper)
      
      // Update aria-describedby
      const currentDescribedBy = input.getAttribute('aria-describedby') || ''
      const describedBy = currentDescribedBy ? `${currentDescribedBy} ${id}-error` : `${id}-error`
      input.setAttribute('aria-describedby', describedBy)
    }
    
    errorElement.innerHTML = `<span class="public-good-sr-only">Error:</span> ${message}`
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:input:error-set', {
      detail: { 
        message, 
        element: formGroup,
        input: input,
        config: config 
      },
      bubbles: true
    })
    formGroup.dispatchEvent(event)
  }
  
  // Clear error method
  function clearError(): void {
    delete config.errorMessage
    
    // Remove error classes
    formGroup.classList.remove('public-good-form-group--error')
    input.classList.remove('public-good-input--error')
    
    // Remove error message
    if (errorElement) {
      errorElement.remove()
      errorElement = null
      
      // Update aria-describedby
      const currentDescribedBy = input.getAttribute('aria-describedby') || ''
      const describedBy = currentDescribedBy.replace(` ${id}-error`, '').replace(`${id}-error`, '')
      if (describedBy) {
        input.setAttribute('aria-describedby', describedBy)
      } else {
        input.removeAttribute('aria-describedby')
      }
    }
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:input:error-cleared', {
      detail: { 
        element: formGroup,
        input: input,
        config: config 
      },
      bubbles: true
    })
    formGroup.dispatchEvent(event)
  }
  
  // Focus method
  function focus(): void {
    input.focus()
  }
  
  // Blur method
  function blur(): void {
    input.blur()
  }
  
  // Cleanup function
  function destroy(): void {
    formGroup.remove()
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:input:destroyed', {
      detail: { element: formGroup, input: input, config: config },
      bubbles: true
    })
    document.dispatchEvent(event)
  }
  
  // Add input event listeners for validation and events
  input.addEventListener('input', () => {
    const customEvent = new CustomEvent('public-good:input:changed', {
      detail: { 
        value: input.value, 
        element: formGroup,
        input: input,
        config: config 
      },
      bubbles: true
    })
    formGroup.dispatchEvent(customEvent)
  })
  
  input.addEventListener('focus', () => {
    const event = new CustomEvent('public-good:input:focused', {
      detail: { 
        element: formGroup,
        input: input,
        config: config 
      },
      bubbles: true
    })
    formGroup.dispatchEvent(event)
  })
  
  input.addEventListener('blur', () => {
    const event = new CustomEvent('public-good:input:blurred', {
      detail: { 
        element: formGroup,
        input: input,
        config: config 
      },
      bubbles: true
    })
    formGroup.dispatchEvent(event)
  })
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:input:created', {
    detail: { element: formGroup, input: input, config: config },
    bubbles: true
  })
  formGroup.dispatchEvent(creationEvent)
  
  return {
    element: formGroup,
    input,
    config,
    getValue,
    setValue,
    setError,
    clearError,
    focus,
    blur,
    destroy
  }
}

/**
 * Creates an email input
 */
export function createEmailInput(
  label: string,
  options: Partial<InputConfig> = {}
): InputResult {
  return createInput({
    type: 'email',
    label,
    autocomplete: 'email',
    inputmode: 'email',
    ...options
  })
}

/**
 * Creates a telephone input
 */
export function createTelInput(
  label: string,
  options: Partial<InputConfig> = {}
): InputResult {
  return createInput({
    type: 'tel',
    label,
    autocomplete: 'tel',
    inputmode: 'tel',
    ...options
  })
}

/**
 * Creates a numeric input
 */
export function createNumericInput(
  label: string,
  options: Partial<InputConfig> = {}
): InputResult {
  return createInput({
    type: 'text',
    label,
    inputmode: 'numeric',
    pattern: '[0-9]*',
    ...options
  })
}

/**
 * Creates a search input
 */
export function createSearchInput(
  label: string,
  options: Partial<InputConfig> = {}
): InputResult {
  return createInput({
    type: 'search',
    label,
    inputmode: 'search',
    ...options
  })
}

/**
 * Creates a password input
 */
export function createPasswordInput(
  label: string,
  options: Partial<InputConfig> = {}
): InputResult {
  return createInput({
    type: 'password',
    label,
    autocomplete: 'current-password',
    ...options
  })
}

/**
 * Creates an NHS number input
 */
export function createNhsNumberInput(
  options: Partial<InputConfig> = {}
): InputResult {
  return createInput({
    type: 'text',
    label: 'NHS number',
    hint: 'Your NHS number is a 10 digit number that you find on any letter the NHS has sent you. For example, 485 777 3456.',
    width: '10',
    inputmode: 'numeric',
    pattern: '[0-9 ]*',
    autocomplete: 'off',
    ...options
  })
}

/**
 * Initialize all input components from data attributes in the DOM
 */
export function initializeInputs(): InputResult[] {
  const elements = document.querySelectorAll('[data-public-good-input]')
  const components: InputResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<InputConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const type = element.getAttribute('data-type') as InputConfig['type']
      if (type) config.type = type
      
      const name = element.getAttribute('data-name')
      if (name) config.name = name
      
      const value = element.getAttribute('data-value')
      if (value) config.value = value
      
      const label = element.getAttribute('data-label')
      if (label) config.label = label
      
      const hint = element.getAttribute('data-hint')
      if (hint) config.hint = hint
      
      const placeholder = element.getAttribute('data-placeholder')
      if (placeholder) config.placeholder = placeholder
      
      const autocomplete = element.getAttribute('data-autocomplete')
      if (autocomplete) config.autocomplete = autocomplete
      
      const inputmode = element.getAttribute('data-inputmode') as InputConfig['inputmode']
      if (inputmode) config.inputmode = inputmode
      
      const pattern = element.getAttribute('data-pattern')
      if (pattern) config.pattern = pattern
      
      const width = element.getAttribute('data-width') as InputConfig['width']
      if (width) config.width = width
      
      const prefix = element.getAttribute('data-prefix')
      if (prefix) config.prefix = prefix
      
      const suffix = element.getAttribute('data-suffix')
      if (suffix) config.suffix = suffix
      
      const errorMessage = element.getAttribute('data-error-message')
      if (errorMessage) config.errorMessage = errorMessage
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      // Boolean attributes
      if (element.hasAttribute('data-required')) config.required = true
      if (element.hasAttribute('data-disabled')) config.disabled = true
      if (element.hasAttribute('data-readonly')) config.readonly = true
      
      // Numeric attributes
      const maxlength = element.getAttribute('data-maxlength')
      if (maxlength) config.maxlength = parseInt(maxlength, 10)
      
      const minlength = element.getAttribute('data-minlength')
      if (minlength) config.minlength = parseInt(minlength, 10)
      
      // Parse custom attributes
      const customAttributes = element.getAttribute('data-attributes')
      if (customAttributes) {
        try {
          config.attributes = JSON.parse(customAttributes)
        } catch (error) {
          console.warn('Invalid JSON in data-attributes attribute:', error)
        }
      }
      
      // Create the input component
      const input = createInput(config as InputConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(input.element, element)
      components.push(input)
      
    } catch (error) {
      console.error('Error initializing input component:', error)
    }
  })
  
  return components
}

// Auto-initialize input components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInputs)
  } else {
    initializeInputs()
  }
}