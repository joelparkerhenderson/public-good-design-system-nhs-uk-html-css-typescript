/**
 * Public Good Design System - Error Message Component
 * TypeScript implementation of accessible error messaging for forms
 * Based on NHS UK Design System error message patterns
 */

import { generateUniqueId } from '../../core/functions/dom-utils'
import { t } from '../../core/functions/i18n'

/**
 * Error message configuration interface
 */
export interface ErrorMessageConfig {
  id?: string
  message: string
  visuallyHiddenText?: string
  classes?: string
  attributes?: Record<string, string>
  targetElementId?: string
}

/**
 * Error message result interface
 */
export interface ErrorMessageResult {
  element: HTMLSpanElement
  config: ErrorMessageConfig
  destroy: () => void
  setMessage: (message: string) => void
  getMessage: () => string
  show: () => void
  hide: () => void
  isVisible: () => boolean
  associateWithElement: (elementId: string) => void
}

/**
 * Creates an error message component
 */
export const createErrorMessage = (config: ErrorMessageConfig): ErrorMessageResult => {
  const id = config.id || generateUniqueId('error-message')
  
  // Create main error message element
  const errorSpan = document.createElement('span')
  errorSpan.id = id
  errorSpan.className = `public-good-error-message${config.classes ? ` ${config.classes}` : ''}`
  errorSpan.setAttribute('role', 'alert')
  errorSpan.setAttribute('aria-live', 'polite')
  
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      errorSpan.setAttribute(key, value)
    })
  }
  
  // Create visually hidden prefix for screen readers
  const visuallyHiddenSpan = document.createElement('span')
  visuallyHiddenSpan.className = 'public-good-u-visually-hidden'
  visuallyHiddenSpan.textContent = config.visuallyHiddenText || t('errorMessage.prefix')
  
  // Create message content span
  const messageSpan = document.createElement('span')
  messageSpan.className = 'public-good-error-message__text'
  messageSpan.textContent = config.message
  
  // Assemble the component
  errorSpan.appendChild(visuallyHiddenSpan)
  errorSpan.appendChild(messageSpan)
  
  // Track visibility state
  let isHidden = false
  
  // Associate with target element if provided
  if (config.targetElementId) {
    const targetElement = document.getElementById(config.targetElementId)
    if (targetElement) {
      const currentDescribedBy = targetElement.getAttribute('aria-describedby')
      const newDescribedBy = currentDescribedBy ? `${currentDescribedBy} ${id}` : id
      targetElement.setAttribute('aria-describedby', newDescribedBy)
      
      // Add error class to target element
      targetElement.classList.add('public-good-error')
    }
  }
  
  // Component API methods
  const setMessage = (message: string): void => {
    config.message = message
    messageSpan.textContent = message
    
    // Trigger screen reader announcement
    const tempLive = errorSpan.getAttribute('aria-live')
    errorSpan.setAttribute('aria-live', 'off')
    setTimeout(() => {
      errorSpan.setAttribute('aria-live', tempLive || 'polite')
    }, 100)
    
    // Emit event
    const changeEvent = new CustomEvent('public-good:error-message:changed', {
      detail: {
        id,
        message,
        isVisible: !isHidden
      },
      bubbles: true
    })
    errorSpan.dispatchEvent(changeEvent)
  }
  
  const getMessage = (): string => {
    return config.message
  }
  
  const show = (): void => {
    if (isHidden) {
      errorSpan.style.display = ''
      errorSpan.setAttribute('aria-hidden', 'false')
      isHidden = false
      
      // Emit event
      const showEvent = new CustomEvent('public-good:error-message:shown', {
        detail: {
          id,
          message: config.message
        },
        bubbles: true
      })
      errorSpan.dispatchEvent(showEvent)
    }
  }
  
  const hide = (): void => {
    if (!isHidden) {
      errorSpan.style.display = 'none'
      errorSpan.setAttribute('aria-hidden', 'true')
      isHidden = true
      
      // Emit event
      const hideEvent = new CustomEvent('public-good:error-message:hidden', {
        detail: {
          id,
          message: config.message
        },
        bubbles: true
      })
      errorSpan.dispatchEvent(hideEvent)
    }
  }
  
  const isVisible = (): boolean => {
    return !isHidden
  }
  
  const associateWithElement = (elementId: string): void => {
    // Remove association from previous element if any
    if (config.targetElementId) {
      const prevElement = document.getElementById(config.targetElementId)
      if (prevElement) {
        const describedBy = prevElement.getAttribute('aria-describedby')
        if (describedBy) {
          const newDescribedBy = describedBy
            .split(' ')
            .filter(id => id !== errorSpan.id)
            .join(' ')
          
          if (newDescribedBy) {
            prevElement.setAttribute('aria-describedby', newDescribedBy)
          } else {
            prevElement.removeAttribute('aria-describedby')
          }
        }
        prevElement.classList.remove('public-good-error')
      }
    }
    
    // Associate with new element
    config.targetElementId = elementId
    const targetElement = document.getElementById(elementId)
    if (targetElement) {
      const currentDescribedBy = targetElement.getAttribute('aria-describedby')
      const newDescribedBy = currentDescribedBy ? `${currentDescribedBy} ${id}` : id
      targetElement.setAttribute('aria-describedby', newDescribedBy)
      targetElement.classList.add('public-good-error')
    }
    
    // Emit event
    const associateEvent = new CustomEvent('public-good:error-message:associated', {
      detail: {
        id,
        targetElementId: elementId,
        message: config.message
      },
      bubbles: true
    })
    errorSpan.dispatchEvent(associateEvent)
  }
  
  const destroy = (): void => {
    // Remove association from target element
    if (config.targetElementId) {
      const targetElement = document.getElementById(config.targetElementId)
      if (targetElement) {
        const describedBy = targetElement.getAttribute('aria-describedby')
        if (describedBy) {
          const newDescribedBy = describedBy
            .split(' ')
            .filter(id => id !== errorSpan.id)
            .join(' ')
          
          if (newDescribedBy) {
            targetElement.setAttribute('aria-describedby', newDescribedBy)
          } else {
            targetElement.removeAttribute('aria-describedby')
          }
        }
        targetElement.classList.remove('public-good-error')
      }
    }
    
    // Remove from DOM
    if (errorSpan.parentNode) {
      errorSpan.parentNode.removeChild(errorSpan)
    }
  }
  
  return {
    element: errorSpan,
    config,
    destroy,
    setMessage,
    getMessage,
    show,
    hide,
    isVisible,
    associateWithElement
  }
}

/**
 * Initialize error message components from data attributes
 */
export const initializeErrorMessages = (): ErrorMessageResult[] => {
  const elements = document.querySelectorAll('[data-public-good-error-message]')
  const components: ErrorMessageResult[] = []
  
  elements.forEach((element) => {
    try {
      const message = element.getAttribute('data-message')
      
      if (!message) {
        console.warn('Error message element missing required data-message attribute')
        return
      }
      
      const config: ErrorMessageConfig = {
        message
      }
      
      // Parse configuration from data attributes
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const visuallyHiddenText = element.getAttribute('data-visually-hidden-text')
      if (visuallyHiddenText) config.visuallyHiddenText = visuallyHiddenText
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      const targetElementId = element.getAttribute('data-target-element-id')
      if (targetElementId) config.targetElementId = targetElementId
      
      const errorMessage = createErrorMessage(config)
      element.parentNode?.replaceChild(errorMessage.element, element)
      components.push(errorMessage)
    } catch (error) {
      console.error('Error initializing error message component:', error)
    }
  })
  
  return components
}

/**
 * Helper function to create a simple error message
 */
export const createSimpleErrorMessage = (
  message: string,
  options?: Partial<ErrorMessageConfig>
): ErrorMessageResult => {
  return createErrorMessage({
    message,
    ...options
  })
}

/**
 * Helper function to create an error message associated with a form field
 */
export const createFieldErrorMessage = (
  message: string,
  targetElementId: string,
  options?: Partial<ErrorMessageConfig>
): ErrorMessageResult => {
  return createErrorMessage({
    message,
    targetElementId,
    ...options
  })
}

/**
 * Helper function to create multiple error messages for form validation
 */
export const createFormErrorMessages = (
  errors: Array<{ elementId: string; message: string; options?: Partial<ErrorMessageConfig> }>
): ErrorMessageResult[] => {
  return errors.map(({ elementId, message, options }) =>
    createFieldErrorMessage(message, elementId, options)
  )
}

/**
 * Helper function to show error messages
 */
export const showErrorMessages = (errorMessages: ErrorMessageResult[]): void => {
  errorMessages.forEach(errorMessage => errorMessage.show())
}

/**
 * Helper function to hide error messages
 */
export const hideErrorMessages = (errorMessages: ErrorMessageResult[]): void => {
  errorMessages.forEach(errorMessage => errorMessage.hide())
}

/**
 * Helper function to clear all error messages and remove error styling
 */
export const clearErrorMessages = (errorMessages: ErrorMessageResult[]): void => {
  errorMessages.forEach(errorMessage => errorMessage.destroy())
}

/**
 * Utility function to add error state to a form element
 */
export const addErrorStateToElement = (elementId: string, errorClass = 'public-good-error'): void => {
  const element = document.getElementById(elementId)
  if (element) {
    element.classList.add(errorClass)
    
    // Add error state to parent form group if exists
    const formGroup = element.closest('.public-good-form-group')
    if (formGroup) {
      formGroup.classList.add('public-good-form-group--error')
    }
  }
}

/**
 * Utility function to remove error state from a form element
 */
export const removeErrorStateFromElement = (elementId: string, errorClass = 'public-good-error'): void => {
  const element = document.getElementById(elementId)
  if (element) {
    element.classList.remove(errorClass)
    
    // Remove error state from parent form group if no other errors
    const formGroup = element.closest('.public-good-form-group')
    if (formGroup && !formGroup.querySelector('.public-good-error-message')) {
      formGroup.classList.remove('public-good-form-group--error')
    }
  }
}

/**
 * Initialize all error message components on the page
 */
export const initAllErrorMessages = (): ErrorMessageResult[] => {
  return initializeErrorMessages()
}