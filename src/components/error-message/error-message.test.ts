/**
 * Error Message Component Tests
 * Unit tests for the error message component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createErrorMessage, 
  initializeErrorMessages,
  createSimpleErrorMessage,
  createFieldErrorMessage,
  createFormErrorMessages,
  showErrorMessages,
  hideErrorMessages,
  clearErrorMessages,
  addErrorStateToElement,
  removeErrorStateFromElement,
  initAllErrorMessages
} from './error-message'

describe('Error Message Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createErrorMessage', () => {
    it('should create a basic error message with default properties', () => {
      const errorMessage = createErrorMessage({
        message: 'This is an error message'
      })

      expect(errorMessage.element).toBeDefined()
      expect(errorMessage.config).toBeDefined()
      expect(errorMessage.destroy).toBeInstanceOf(Function)
      expect(errorMessage.setMessage).toBeInstanceOf(Function)
      expect(errorMessage.getMessage).toBeInstanceOf(Function)

      // Check structure
      expect(errorMessage.element.tagName).toBe('SPAN')
      expect(errorMessage.element.classList.contains('public-good-error-message')).toBe(true)
      expect(errorMessage.element.getAttribute('role')).toBe('alert')
      expect(errorMessage.element.getAttribute('aria-live')).toBe('polite')
      
      const visuallyHidden = errorMessage.element.querySelector('.public-good-u-visually-hidden')
      expect(visuallyHidden).toBeTruthy()
      expect(visuallyHidden?.textContent).toBe('Error:')
      
      const messageText = errorMessage.element.querySelector('.public-good-error-message__text')
      expect(messageText).toBeTruthy()
      expect(messageText?.textContent).toBe('This is an error message')
    })

    it('should create error message with custom visually hidden text', () => {
      const errorMessage = createErrorMessage({
        message: 'Custom error',
        visuallyHiddenText: 'Problem:'
      })

      const visuallyHidden = errorMessage.element.querySelector('.public-good-u-visually-hidden')
      expect(visuallyHidden?.textContent).toBe('Problem:')
    })

    it('should create error message with custom classes', () => {
      const errorMessage = createErrorMessage({
        message: 'Error with classes',
        classes: 'custom-error'
      })

      expect(errorMessage.element.classList.contains('custom-error')).toBe(true)
    })

    it('should create error message with custom attributes', () => {
      const errorMessage = createErrorMessage({
        message: 'Error with attributes',
        attributes: {
          'data-test': 'error-value',
          'aria-label': 'Custom error message'
        }
      })

      expect(errorMessage.element.getAttribute('data-test')).toBe('error-value')
      expect(errorMessage.element.getAttribute('aria-label')).toBe('Custom error message')
    })

    it('should associate error message with target element', () => {
      document.body.innerHTML = '<input id="test-input" />'
      
      const errorMessage = createErrorMessage({
        message: 'Input error',
        targetElementId: 'test-input'
      })

      const targetElement = document.getElementById('test-input')
      expect(targetElement?.getAttribute('aria-describedby')).toBe(errorMessage.element.id)
      expect(targetElement?.classList.contains('public-good-error')).toBe(true)
    })

    it('should update aria-describedby for elements with existing values', () => {
      document.body.innerHTML = '<input id="test-input" aria-describedby="existing-id" />'
      
      const errorMessage = createErrorMessage({
        message: 'Input error',
        targetElementId: 'test-input'
      })

      const targetElement = document.getElementById('test-input')
      expect(targetElement?.getAttribute('aria-describedby')).toBe(`existing-id ${errorMessage.element.id}`)
    })

    it('should emit events when message changes', () => {
      const errorMessage = createErrorMessage({
        message: 'Initial message'
      })

      const eventSpy = vi.fn()
      errorMessage.element.addEventListener('public-good:error-message:changed', eventSpy)

      errorMessage.setMessage('Updated message')

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.message).toBe('Updated message')
      expect(eventDetail.isVisible).toBe(true)
    })

    it('should handle show and hide functionality', () => {
      const errorMessage = createErrorMessage({
        message: 'Test message'
      })

      const showEventSpy = vi.fn()
      const hideEventSpy = vi.fn()
      errorMessage.element.addEventListener('public-good:error-message:shown', showEventSpy)
      errorMessage.element.addEventListener('public-good:error-message:hidden', hideEventSpy)

      // Initially visible
      expect(errorMessage.isVisible()).toBe(true)

      // Hide
      errorMessage.hide()
      expect(errorMessage.isVisible()).toBe(false)
      expect(errorMessage.element.style.display).toBe('none')
      expect(errorMessage.element.getAttribute('aria-hidden')).toBe('true')
      expect(hideEventSpy).toHaveBeenCalled()

      // Show
      errorMessage.show()
      expect(errorMessage.isVisible()).toBe(true)
      expect(errorMessage.element.style.display).toBe('')
      expect(errorMessage.element.getAttribute('aria-hidden')).toBe('false')
      expect(showEventSpy).toHaveBeenCalled()
    })

    it('should not emit duplicate show/hide events', () => {
      const errorMessage = createErrorMessage({
        message: 'Test message'
      })

      const showEventSpy = vi.fn()
      const hideEventSpy = vi.fn()
      errorMessage.element.addEventListener('public-good:error-message:shown', showEventSpy)
      errorMessage.element.addEventListener('public-good:error-message:hidden', hideEventSpy)

      // Multiple show calls
      errorMessage.show()
      errorMessage.show()
      expect(showEventSpy).toHaveBeenCalledTimes(0) // Already visible

      // Multiple hide calls
      errorMessage.hide()
      errorMessage.hide()
      expect(hideEventSpy).toHaveBeenCalledTimes(1) // Only first hide triggers event
    })

    it('should handle element association changes', () => {
      document.body.innerHTML = `
        <input id="input1" />
        <input id="input2" />
      `
      
      const errorMessage = createErrorMessage({
        message: 'Error message',
        targetElementId: 'input1'
      })

      const associateEventSpy = vi.fn()
      errorMessage.element.addEventListener('public-good:error-message:associated', associateEventSpy)

      const input1 = document.getElementById('input1')
      const input2 = document.getElementById('input2')

      // Initially associated with input1
      expect(input1?.getAttribute('aria-describedby')).toBe(errorMessage.element.id)
      expect(input1?.classList.contains('public-good-error')).toBe(true)

      // Associate with input2
      errorMessage.associateWithElement('input2')

      expect(input1?.getAttribute('aria-describedby')).toBeFalsy()
      expect(input1?.classList.contains('public-good-error')).toBe(false)
      expect(input2?.getAttribute('aria-describedby')).toBe(errorMessage.element.id)
      expect(input2?.classList.contains('public-good-error')).toBe(true)
      expect(associateEventSpy).toHaveBeenCalled()
    })

    it('should clean up associations when destroyed', () => {
      document.body.innerHTML = '<input id="test-input" />'
      
      const errorMessage = createErrorMessage({
        message: 'Error message',
        targetElementId: 'test-input'
      })
      document.body.appendChild(errorMessage.element)

      const targetElement = document.getElementById('test-input')
      expect(targetElement?.getAttribute('aria-describedby')).toBe(errorMessage.element.id)
      expect(targetElement?.classList.contains('public-good-error')).toBe(true)
      expect(document.querySelector('.public-good-error-message')).toBeTruthy()

      errorMessage.destroy()

      expect(targetElement?.getAttribute('aria-describedby')).toBeFalsy()
      expect(targetElement?.classList.contains('public-good-error')).toBe(false)
      expect(document.querySelector('.public-good-error-message')).toBeFalsy()
    })

    it('should update message content and config', () => {
      const errorMessage = createErrorMessage({
        message: 'Original message'
      })

      expect(errorMessage.getMessage()).toBe('Original message')

      errorMessage.setMessage('Updated message')

      expect(errorMessage.getMessage()).toBe('Updated message')
      expect(errorMessage.config.message).toBe('Updated message')
      
      const messageText = errorMessage.element.querySelector('.public-good-error-message__text')
      expect(messageText?.textContent).toBe('Updated message')
    })
  })

  describe('initializeErrorMessages', () => {
    it('should initialize error messages from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-error-message 
             data-message="Please enter a valid email address">
        </div>
      `

      const components = initializeErrorMessages()

      expect(components).toHaveLength(1)
      
      const errorElement = document.querySelector('.public-good-error-message')
      expect(errorElement).toBeTruthy()
      
      const messageText = errorElement?.querySelector('.public-good-error-message__text')
      expect(messageText?.textContent).toBe('Please enter a valid email address')
    })

    it('should initialize error messages with all configuration options', () => {
      document.body.innerHTML = `
        <div data-public-good-error-message 
             data-id="test-error"
             data-message="Invalid input"
             data-visually-hidden-text="Problem:"
             data-classes="custom-error"
             data-target-element-id="test-input">
        </div>
        <input id="test-input" />
      `

      const components = initializeErrorMessages()

      expect(components).toHaveLength(1)
      
      const component = components[0]!
      expect(component.config.message).toBe('Invalid input')
      expect(component.config.visuallyHiddenText).toBe('Problem:')
      expect(component.config.classes).toBe('custom-error')
      expect(component.config.targetElementId).toBe('test-input')
      expect(component.element.id).toBe('test-error')
      expect(component.element.classList.contains('custom-error')).toBe(true)

      const targetElement = document.getElementById('test-input')
      expect(targetElement?.getAttribute('aria-describedby')).toBe('test-error')
    })

    it('should handle missing message attribute gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-error-message>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const components = initializeErrorMessages()

      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error message element missing required data-message attribute')
      
      consoleSpy.mockRestore()
    })

    it('should handle initialization errors gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-error-message 
             data-message="Test message">
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Remove the element during processing to cause error
      const elements = document.querySelectorAll('[data-public-good-error-message]')
      elements.forEach(element => {
        element.remove()
      })

      const components = initializeErrorMessages()

      expect(components).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create simple error message', () => {
      const errorMessage = createSimpleErrorMessage('Simple error message')

      expect(errorMessage.getMessage()).toBe('Simple error message')
      expect(errorMessage.element.classList.contains('public-good-error-message')).toBe(true)
    })

    it('should create field error message', () => {
      document.body.innerHTML = '<input id="test-field" />'
      
      const errorMessage = createFieldErrorMessage('Field error', 'test-field')

      expect(errorMessage.getMessage()).toBe('Field error')
      expect(errorMessage.config.targetElementId).toBe('test-field')
      
      const targetElement = document.getElementById('test-field')
      expect(targetElement?.getAttribute('aria-describedby')).toBe(errorMessage.element.id)
    })

    it('should create multiple form error messages', () => {
      document.body.innerHTML = `
        <input id="email-field" />
        <input id="password-field" />
      `
      
      const errors = [
        { elementId: 'email-field', message: 'Invalid email' },
        { elementId: 'password-field', message: 'Password too short' }
      ]
      
      const errorMessages = createFormErrorMessages(errors)

      expect(errorMessages).toHaveLength(2)
      expect(errorMessages[0]!.getMessage()).toBe('Invalid email')
      expect(errorMessages[1]!.getMessage()).toBe('Password too short')
      
      const emailField = document.getElementById('email-field')
      const passwordField = document.getElementById('password-field')
      expect(emailField?.getAttribute('aria-describedby')).toBe(errorMessages[0]!.element.id)
      expect(passwordField?.getAttribute('aria-describedby')).toBe(errorMessages[1]!.element.id)
    })

    it('should show multiple error messages', () => {
      const errorMessages = [
        createSimpleErrorMessage('Error 1'),
        createSimpleErrorMessage('Error 2')
      ]

      // Hide them first
      errorMessages.forEach(msg => msg.hide())
      expect(errorMessages.every(msg => !msg.isVisible())).toBe(true)

      showErrorMessages(errorMessages)
      expect(errorMessages.every(msg => msg.isVisible())).toBe(true)
    })

    it('should hide multiple error messages', () => {
      const errorMessages = [
        createSimpleErrorMessage('Error 1'),
        createSimpleErrorMessage('Error 2')
      ]

      expect(errorMessages.every(msg => msg.isVisible())).toBe(true)

      hideErrorMessages(errorMessages)
      expect(errorMessages.every(msg => !msg.isVisible())).toBe(true)
    })

    it('should clear all error messages', () => {
      document.body.innerHTML = `
        <input id="field1" />
        <input id="field2" />
      `
      
      const errorMessages = [
        createFieldErrorMessage('Error 1', 'field1'),
        createFieldErrorMessage('Error 2', 'field2')
      ]

      document.body.appendChild(errorMessages[0]!.element)
      document.body.appendChild(errorMessages[1]!.element)

      expect(document.querySelectorAll('.public-good-error-message')).toHaveLength(2)

      clearErrorMessages(errorMessages)

      expect(document.querySelectorAll('.public-good-error-message')).toHaveLength(0)
    })
  })

  describe('utility functions', () => {
    it('should add error state to element', () => {
      document.body.innerHTML = `
        <div class="public-good-form-group">
          <input id="test-input" />
        </div>
      `

      addErrorStateToElement('test-input')

      const element = document.getElementById('test-input')
      const formGroup = element?.closest('.public-good-form-group')
      
      expect(element?.classList.contains('public-good-error')).toBe(true)
      expect(formGroup?.classList.contains('public-good-form-group--error')).toBe(true)
    })

    it('should remove error state from element', () => {
      document.body.innerHTML = `
        <div class="public-good-form-group public-good-form-group--error">
          <input id="test-input" class="public-good-error" />
        </div>
      `

      removeErrorStateFromElement('test-input')

      const element = document.getElementById('test-input')
      const formGroup = element?.closest('.public-good-form-group')
      
      expect(element?.classList.contains('public-good-error')).toBe(false)
      expect(formGroup?.classList.contains('public-good-form-group--error')).toBe(false)
    })

    it('should not remove form group error state if other errors exist', () => {
      document.body.innerHTML = `
        <div class="public-good-form-group public-good-form-group--error">
          <input id="test-input" class="public-good-error" />
          <span class="public-good-error-message">Other error</span>
        </div>
      `

      removeErrorStateFromElement('test-input')

      const element = document.getElementById('test-input')
      const formGroup = element?.closest('.public-good-form-group')
      
      expect(element?.classList.contains('public-good-error')).toBe(false)
      expect(formGroup?.classList.contains('public-good-form-group--error')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const errorMessage = createErrorMessage({
        message: 'Accessible error message'
      })

      expect(errorMessage.element.getAttribute('role')).toBe('alert')
      expect(errorMessage.element.getAttribute('aria-live')).toBe('polite')
    })

    it('should have visually hidden prefix for screen readers', () => {
      const errorMessage = createErrorMessage({
        message: 'Error for screen readers'
      })

      const visuallyHidden = errorMessage.element.querySelector('.public-good-u-visually-hidden')
      expect(visuallyHidden).toBeTruthy()
      expect(visuallyHidden?.textContent).toBe('Error:')
    })

    it('should associate with form fields using aria-describedby', () => {
      document.body.innerHTML = '<input id="accessible-field" />'
      
      const errorMessage = createErrorMessage({
        message: 'Accessibility error',
        targetElementId: 'accessible-field'
      })

      const field = document.getElementById('accessible-field')
      expect(field?.getAttribute('aria-describedby')).toBe(errorMessage.element.id)
    })
  })

  describe('initAllErrorMessages', () => {
    it('should initialize all error messages on the page', () => {
      document.body.innerHTML = `
        <div data-public-good-error-message data-message="Error 1"></div>
        <div data-public-good-error-message data-message="Error 2"></div>
      `

      const components = initAllErrorMessages()

      expect(components).toHaveLength(2)
      expect(document.querySelectorAll('.public-good-error-message')).toHaveLength(2)
    })
  })
})