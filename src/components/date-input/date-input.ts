/**
 * Public Good Design System - Date Input Component
 * TypeScript implementation of accessible date input with day, month, year fields
 * Based on NHS UK Design System date input patterns
 */

import { generateUniqueId } from '../../core/functions/dom-utils'
import { t } from '../../core/functions/i18n'

/**
 * Date input item configuration
 */
export interface DateInputItem {
  name: 'day' | 'month' | 'year'
  label?: string
  value?: string
  id?: string
  autocomplete?: string
  pattern?: string
  inputmode?: 'numeric' | 'text'
  maxlength?: number
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Fieldset configuration for date input
 */
export interface DateInputFieldset {
  legend: {
    text: string
    classes?: string
    isPageHeading?: boolean
  }
  classes?: string
  role?: string
  attributes?: Record<string, string>
}

/**
 * Hint configuration
 */
export interface DateInputHint {
  text: string
  id?: string
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Error message configuration
 */
export interface DateInputErrorMessage {
  text: string
  id?: string
  classes?: string
  visuallyHiddenText?: string
  attributes?: Record<string, string>
}

/**
 * Date input configuration
 */
export interface DateInputConfig {
  id?: string
  namePrefix: string
  fieldset?: DateInputFieldset
  hint?: DateInputHint
  errorMessage?: DateInputErrorMessage
  items?: DateInputItem[]
  classes?: string
  attributes?: Record<string, string>
  formGroupClasses?: string
  value?: {
    day?: string
    month?: string
    year?: string
  }
}

/**
 * Date input result interface
 */
export interface DateInputResult {
  element: HTMLElement
  config: DateInputConfig
  destroy: () => void
  getValues: () => { day: string; month: string; year: string }
  setValues: (values: { day?: string; month?: string; year?: string }) => void
  getDate: () => Date | null
  setDate: (date: Date | null) => void
  validate: () => boolean
  setError: (message: string) => void
  clearError: () => void
  disable: () => void
  enable: () => void
  focus: () => void
  clear: () => void
}

/**
 * Default date input items configuration
 */
const DEFAULT_ITEMS: DateInputItem[] = [
  {
    name: 'day',
    label: t('dateInput.day'),
    classes: 'public-good-input--width-2',
    autocomplete: 'bday-day',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxlength: 2
  },
  {
    name: 'month',
    label: t('dateInput.month'),
    classes: 'public-good-input--width-2',
    autocomplete: 'bday-month',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxlength: 2
  },
  {
    name: 'year',
    label: t('dateInput.year'),
    classes: 'public-good-input--width-4',
    autocomplete: 'bday-year',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    maxlength: 4
  }
]

/**
 * Creates a date input component
 */
export const createDateInput = (config: DateInputConfig): DateInputResult => {
  const id = config.id || generateUniqueId('date-input')
  const namePrefix = config.namePrefix
  const items = config.items || DEFAULT_ITEMS
  
  // Create form group container
  const formGroup = document.createElement('div')
  formGroup.className = `public-good-form-group${config.errorMessage ? ' public-good-form-group--error' : ''}`
  if (config.formGroupClasses) {
    formGroup.className += ` ${config.formGroupClasses}`
  }
  
  // Create fieldset if specified
  let container: HTMLElement = formGroup
  let legend: HTMLElement | null = null
  
  if (config.fieldset) {
    const fieldset = document.createElement('fieldset')
    fieldset.className = `public-good-fieldset${config.fieldset.classes ? ` ${config.fieldset.classes}` : ''}`
    fieldset.setAttribute('role', config.fieldset.role || 'group')
    
    if (config.fieldset.attributes) {
      Object.entries(config.fieldset.attributes).forEach(([key, value]) => {
        fieldset.setAttribute(key, value)
      })
    }
    
    // Create legend
    legend = document.createElement('legend')
    legend.className = `public-good-fieldset__legend${config.fieldset.legend.classes ? ` ${config.fieldset.legend.classes}` : ''}`
    legend.textContent = config.fieldset.legend.text
    
    if (config.fieldset.legend.isPageHeading) {
      const h1 = document.createElement('h1')
      h1.className = 'public-good-fieldset__heading'
      h1.textContent = config.fieldset.legend.text
      legend.textContent = ''
      legend.appendChild(h1)
    }
    
    fieldset.appendChild(legend)
    formGroup.appendChild(fieldset)
    container = fieldset
  }
  
  // Create hint if specified
  let hint: HTMLElement | null = null
  if (config.hint) {
    hint = document.createElement('div')
    hint.id = config.hint.id || `${id}-hint`
    hint.className = `public-good-hint${config.hint.classes ? ` ${config.hint.classes}` : ''}`
    hint.textContent = config.hint.text
    
    if (config.hint.attributes) {
      Object.entries(config.hint.attributes).forEach(([key, value]) => {
        hint!.setAttribute(key, value)
      })
    }
    
    container.appendChild(hint)
  }
  
  // Create error message if specified
  let errorMessage: HTMLElement | null = null
  if (config.errorMessage) {
    errorMessage = document.createElement('p')
    errorMessage.id = config.errorMessage.id || `${id}-error`
    errorMessage.className = `public-good-error-message${config.errorMessage.classes ? ` ${config.errorMessage.classes}` : ''}`
    
    if (config.errorMessage.visuallyHiddenText) {
      const srOnly = document.createElement('span')
      srOnly.className = 'public-good-sr-only'
      srOnly.textContent = config.errorMessage.visuallyHiddenText
      errorMessage.appendChild(srOnly)
    }
    
    errorMessage.appendChild(document.createTextNode(config.errorMessage.text))
    
    if (config.errorMessage.attributes) {
      Object.entries(config.errorMessage.attributes).forEach(([key, value]) => {
        errorMessage!.setAttribute(key, value)
      })
    }
    
    container.appendChild(errorMessage)
  }
  
  // Create date input wrapper
  const dateInputWrapper = document.createElement('div')
  dateInputWrapper.id = id
  dateInputWrapper.className = `public-good-date-input${config.classes ? ` ${config.classes}` : ''}`
  
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      dateInputWrapper.setAttribute(key, value)
    })
  }
  
  // Build aria-describedby
  const describedBy: string[] = []
  if (hint) describedBy.push(hint.id)
  if (errorMessage) describedBy.push(errorMessage.id)
  
  if (describedBy.length > 0) {
    dateInputWrapper.setAttribute('aria-describedby', describedBy.join(' '))
  }
  
  // Create input fields
  const inputs: HTMLInputElement[] = []
  
  items.forEach((item) => {
    const itemWrapper = document.createElement('div')
    itemWrapper.className = 'public-good-date-input__item'
    
    // Create label
    const label = document.createElement('label')
    const inputId = item.id || `${namePrefix}-${item.name}`
    label.htmlFor = inputId
    label.className = 'public-good-label public-good-date-input__label'
    label.textContent = item.label || t(`dateInput.${item.name}`)
    
    // Create input
    const input = document.createElement('input')
    input.type = 'text'
    input.id = inputId
    input.name = `${namePrefix}-${item.name}`
    input.className = `public-good-input public-good-date-input__input${item.classes ? ` ${item.classes}` : ''}${config.errorMessage ? ' public-good-input--error' : ''}`
    
    // Set input attributes
    if (item.autocomplete) input.setAttribute('autocomplete', item.autocomplete)
    if (item.pattern) input.setAttribute('pattern', item.pattern)
    if (item.inputmode) input.setAttribute('inputmode', item.inputmode)
    if (item.maxlength) input.setAttribute('maxlength', item.maxlength.toString())
    
    // Set initial value
    const initialValue = config.value?.[item.name] || item.value || ''
    if (initialValue) {
      input.value = initialValue
    }
    
    if (item.attributes) {
      Object.entries(item.attributes).forEach(([key, value]) => {
        input.setAttribute(key, value)
      })
    }
    
    inputs.push(input)
    
    itemWrapper.appendChild(label)
    itemWrapper.appendChild(input)
    dateInputWrapper.appendChild(itemWrapper)
  })
  
  container.appendChild(dateInputWrapper)
  
  // Event listeners for validation and navigation
  const setupEventListeners = () => {
    inputs.forEach((input, index) => {
      // Auto-advance on valid input
      input.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement
        const value = target.value
        
        // Emit change event
        const changeEvent = new CustomEvent('public-good:date-input:change', {
          detail: {
            namePrefix,
            field: target.name.split('-').pop(),
            value,
            values: getValues()
          },
          bubbles: true
        })
        formGroup.dispatchEvent(changeEvent)
        
        // Auto-advance logic
        const fieldName = target.name.split('-').pop()
        if (fieldName === 'day' && value.length === 2 && parseInt(value) <= 31) {
          const nextInput = inputs[index + 1]
          if (nextInput) nextInput.focus()
        } else if (fieldName === 'month' && value.length === 2 && parseInt(value) <= 12) {
          const nextInput = inputs[index + 1]
          if (nextInput) nextInput.focus()
        }
      })
      
      // Handle paste events
      input.addEventListener('paste', (event) => {
        const pastedData = event.clipboardData?.getData('text/plain')
        if (pastedData && pastedData.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
          event.preventDefault()
          const [day, month, year] = pastedData.split('/')
          if (day && month && year) {
            setValues({ day, month, year })
          }
        }
      })
      
      // Validation on blur
      input.addEventListener('blur', () => {
        validateField(input)
      })
    })
  }
  
  setupEventListeners()
  
  // Validation functions
  const validateField = (input: HTMLInputElement): boolean => {
    const fieldName = input.name.split('-').pop()
    const value = parseInt(input.value)
    
    if (!input.value) return true // Empty is valid, required validation handled elsewhere
    
    switch (fieldName) {
      case 'day':
        return value >= 1 && value <= 31
      case 'month':
        return value >= 1 && value <= 12
      case 'year':
        return value >= 1900 && value <= new Date().getFullYear() + 100
      default:
        return true
    }
  }
  
  const validateDate = (): boolean => {
    const values = getValues()
    if (!values.day || !values.month || !values.year) {
      return false // Incomplete date
    }
    
    const date = new Date(parseInt(values.year), parseInt(values.month) - 1, parseInt(values.day))
    return date.getDate() === parseInt(values.day) &&
           date.getMonth() === parseInt(values.month) - 1 &&
           date.getFullYear() === parseInt(values.year)
  }
  
  // Get current values
  const getValues = (): { day: string; month: string; year: string } => {
    const dayInput = formGroup.querySelector(`input[name="${namePrefix}-day"]`) as HTMLInputElement
    const monthInput = formGroup.querySelector(`input[name="${namePrefix}-month"]`) as HTMLInputElement
    const yearInput = formGroup.querySelector(`input[name="${namePrefix}-year"]`) as HTMLInputElement
    
    return {
      day: dayInput?.value || '',
      month: monthInput?.value || '',
      year: yearInput?.value || ''
    }
  }
  
  // Set values
  const setValues = (values: { day?: string; month?: string; year?: string }): void => {
    if (values.day !== undefined) {
      const dayInput = formGroup.querySelector(`input[name="${namePrefix}-day"]`) as HTMLInputElement
      if (dayInput) dayInput.value = values.day
    }
    if (values.month !== undefined) {
      const monthInput = formGroup.querySelector(`input[name="${namePrefix}-month"]`) as HTMLInputElement
      if (monthInput) monthInput.value = values.month
    }
    if (values.year !== undefined) {
      const yearInput = formGroup.querySelector(`input[name="${namePrefix}-year"]`) as HTMLInputElement
      if (yearInput) yearInput.value = values.year
    }
  }
  
  // Get date object
  const getDate = (): Date | null => {
    const values = getValues()
    if (!values.day || !values.month || !values.year) {
      return null
    }
    
    const date = new Date(parseInt(values.year), parseInt(values.month) - 1, parseInt(values.day))
    return validateDate() ? date : null
  }
  
  // Set date from Date object
  const setDate = (date: Date | null): void => {
    if (!date) {
      setValues({ day: '', month: '', year: '' })
      return
    }
    
    setValues({
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear().toString()
    })
  }
  
  // Validation
  const validate = (): boolean => {
    const isComplete = inputs.every(input => input.value.trim() !== '')
    const isValidDate = validateDate()
    
    if (!isComplete || !isValidDate) {
      const message = !isComplete ? 
        t('dateInput.incomplete') : 
        t('dateInput.invalid')
      setError(message)
      return false
    }
    
    clearError()
    return true
  }
  
  // Set error state
  const setError = (message: string): void => {
    // Add error classes
    formGroup.classList.add('public-good-form-group--error')
    inputs.forEach(input => {
      input.classList.add('public-good-input--error')
    })
    
    // Create or update error message
    let errorEl = formGroup.querySelector('.public-good-error-message')
    if (!errorEl) {
      errorEl = document.createElement('p')
      errorEl.className = 'public-good-error-message'
      
      const srOnly = document.createElement('span')
      srOnly.className = 'public-good-sr-only'
      srOnly.textContent = t('common.error') + ': '
      errorEl.appendChild(srOnly)
      
      // Insert before date input wrapper
      const dateInput = formGroup.querySelector('.public-good-date-input')
      if (dateInput) {
        formGroup.insertBefore(errorEl, dateInput)
      }
    }
    
    // Update error message
    const textNode = Array.from(errorEl.childNodes).find(node => node.nodeType === Node.TEXT_NODE)
    if (textNode) {
      textNode.textContent = message
    } else {
      errorEl.appendChild(document.createTextNode(message))
    }
    
    // Update aria-describedby
    const errorId = `${id}-error-${Date.now()}`
    errorEl.id = errorId
    
    const currentDescribedBy = dateInputWrapper.getAttribute('aria-describedby') || ''
    const describedByArray = currentDescribedBy.split(' ').filter(id => id && !id.includes('error'))
    describedByArray.push(errorId)
    dateInputWrapper.setAttribute('aria-describedby', describedByArray.join(' '))
  }
  
  // Clear error state
  const clearError = (): void => {
    formGroup.classList.remove('public-good-form-group--error')
    inputs.forEach(input => {
      input.classList.remove('public-good-input--error')
    })
    
    const errorEl = formGroup.querySelector('.public-good-error-message')
    if (errorEl) {
      errorEl.remove()
    }
    
    // Update aria-describedby
    const currentDescribedBy = dateInputWrapper.getAttribute('aria-describedby') || ''
    const describedByArray = currentDescribedBy.split(' ').filter(id => id && !id.includes('error'))
    if (describedByArray.length > 0) {
      dateInputWrapper.setAttribute('aria-describedby', describedByArray.join(' '))
    } else {
      dateInputWrapper.removeAttribute('aria-describedby')
    }
  }
  
  // Disable inputs
  const disable = (): void => {
    inputs.forEach(input => {
      input.disabled = true
    })
  }
  
  // Enable inputs
  const enable = (): void => {
    inputs.forEach(input => {
      input.disabled = false
    })
  }
  
  // Focus first input
  const focus = (): void => {
    const firstInput = inputs[0]
    if (firstInput) firstInput.focus()
  }
  
  // Clear all values
  const clear = (): void => {
    setValues({ day: '', month: '', year: '' })
    clearError()
  }
  
  // Cleanup function
  const destroy = (): void => {
    if (formGroup.parentNode) {
      formGroup.parentNode.removeChild(formGroup)
    }
  }
  
  return {
    element: formGroup,
    config,
    destroy,
    getValues,
    setValues,
    getDate,
    setDate,
    validate,
    setError,
    clearError,
    disable,
    enable,
    focus,
    clear
  }
}

/**
 * Initialize date inputs from data attributes
 */
export const initializeDateInputs = (): DateInputResult[] => {
  const elements = document.querySelectorAll('[data-public-good-date-input]')
  const dateInputs: DateInputResult[] = []
  
  elements.forEach((element) => {
    try {
      const namePrefix = element.getAttribute('data-name-prefix')
      if (!namePrefix) {
        console.warn('Date input element missing required data-name-prefix attribute')
        return
      }
      
      const config: DateInputConfig = { namePrefix }
      
      // Parse configuration from data attributes
      const fieldsetLegend = element.getAttribute('data-fieldset-legend')
      if (fieldsetLegend) {
        config.fieldset = {
          legend: { text: fieldsetLegend }
        }
      }
      
      const hint = element.getAttribute('data-hint')
      if (hint) {
        config.hint = { text: hint }
      }
      
      const errorMessage = element.getAttribute('data-error-message')
      if (errorMessage) {
        config.errorMessage = { text: errorMessage }
      }
      
      const dateInput = createDateInput(config)
      element.parentNode?.replaceChild(dateInput.element, element)
      dateInputs.push(dateInput)
    } catch (error) {
      console.error('Error initializing date input:', error)
    }
  })
  
  return dateInputs
}

/**
 * Helper function to create a simple date input
 */
export const createSimpleDateInput = (
  namePrefix: string,
  legend: string,
  options?: Partial<DateInputConfig>
): DateInputResult => {
  return createDateInput({
    namePrefix,
    fieldset: {
      legend: { text: legend }
    },
    hint: {
      text: t('dateInput.hint')
    },
    ...options
  })
}

/**
 * Helper function to create a date input with error
 */
export const createDateInputWithError = (
  namePrefix: string,
  legend: string,
  errorMessage: string,
  options?: Partial<DateInputConfig>
): DateInputResult => {
  return createDateInput({
    namePrefix,
    fieldset: {
      legend: { text: legend }
    },
    hint: {
      text: t('dateInput.hint')
    },
    errorMessage: {
      text: errorMessage,
      visuallyHiddenText: t('common.error')
    },
    ...options
  })
}