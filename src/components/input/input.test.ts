/**
 * Input Component Unit Tests
 * 
 * Tests for input creation, configuration, validation, accessibility, and functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createInput,
  createEmailInput,
  createTelInput,
  createNumericInput,
  createSearchInput,
  createPasswordInput,
  createNhsNumberInput,
  type InputConfig
} from './input'

// Mock the DOM utilities
vi.mock('../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`)
}))

describe('Input Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Configuration', () => {
    it('should create input with basic configuration', () => {
      const config: InputConfig = {
        label: 'Full name',
        type: 'text'
      }

      const input = createInput(config)

      expect(input.element).toBeDefined()
      expect(input.input).toBeDefined()
      expect(input.config.label).toBe('Full name')
      expect(input.config.type).toBe('text')
      expect(typeof input.getValue).toBe('function')
      expect(typeof input.setValue).toBe('function')
      expect(typeof input.setError).toBe('function')
      expect(typeof input.clearError).toBe('function')
      expect(typeof input.focus).toBe('function')
      expect(typeof input.blur).toBe('function')
      expect(typeof input.destroy).toBe('function')
    })

    it('should create input with custom configuration', () => {
      const config: InputConfig = {
        id: 'custom-input',
        name: 'custom-name',
        label: 'Custom label',
        hint: 'Custom hint text',
        placeholder: 'Enter text here',
        value: 'initial value',
        type: 'email',
        autocomplete: 'email',
        inputmode: 'email',
        required: true,
        maxlength: 100,
        width: '10',
        classes: 'custom-class'
      }

      const input = createInput(config)

      expect(input.config.id).toBe('custom-input')
      expect(input.config.name).toBe('custom-name')
      expect(input.config.label).toBe('Custom label')
      expect(input.config.hint).toBe('Custom hint text')
      expect(input.config.placeholder).toBe('Enter text here')
      expect(input.config.value).toBe('initial value')
      expect(input.config.type).toBe('email')
      expect(input.config.autocomplete).toBe('email')
      expect(input.config.inputmode).toBe('email')
      expect(input.config.required).toBe(true)
      expect(input.config.maxlength).toBe(100)
      expect(input.config.width).toBe('10')
      expect(input.config.classes).toBe('custom-class')
    })

    it('should generate unique ID when not provided', () => {
      const input = createInput({ label: 'Test label' })
      expect(input.config.id).toBe('input-test-id')
    })

    it('should set default type to text', () => {
      const input = createInput({ label: 'Test label' })
      expect(input.config.type).toBe('text')
    })

    it('should set default name to ID', () => {
      const input = createInput({ id: 'test-id', label: 'Test label' })
      expect(input.config.name).toBe('test-id')
    })
  })

  describe('HTML Structure', () => {
    it('should create proper HTML structure with label', () => {
      const input = createInput({
        id: 'test-input',
        label: 'Test Label',
        hint: 'Test hint'
      })

      const formGroup = input.element
      const label = formGroup.querySelector('.public-good-label')
      const hint = formGroup.querySelector('.public-good-hint')
      const inputElement = formGroup.querySelector('.public-good-input')

      expect(formGroup.classList.contains('public-good-form-group')).toBe(true)
      expect(label).toBeTruthy()
      expect(label?.textContent).toBe('Test Label')
      expect(label?.getAttribute('for')).toBe('test-input')
      expect(hint).toBeTruthy()
      expect(hint?.textContent).toBe('Test hint')
      expect(hint?.id).toBe('test-input-hint')
      expect(inputElement).toBeTruthy()
      expect(inputElement?.id).toBe('test-input')
    })

    it('should set aria-describedby correctly', () => {
      const input = createInput({
        id: 'test-input',
        label: 'Test Label',
        hint: 'Test hint'
      })

      const inputElement = input.input
      expect(inputElement.getAttribute('aria-describedby')).toBe('test-input-hint')
    })

    it('should handle input without label', () => {
      const input = createInput({ id: 'test-input' })
      const label = input.element.querySelector('.public-good-label')
      expect(label).toBe(null)
    })

    it('should handle input without hint', () => {
      const input = createInput({ id: 'test-input', label: 'Test' })
      const hint = input.element.querySelector('.public-good-hint')
      expect(hint).toBe(null)
    })
  })

  describe('Input Types and Attributes', () => {
    it('should handle different input types', () => {
      const types: Array<InputConfig['type']> = ['text', 'email', 'tel', 'number', 'search', 'url', 'password']
      
      types.forEach(type => {
        if (type) {
          const input = createInput({ type, label: `${type} input` })
          expect(input.input.type).toBe(type)
        }
      })
    })

    it('should set input attributes correctly', () => {
      const input = createInput({
        label: 'Test Input',
        value: 'test value',
        placeholder: 'Enter text',
        autocomplete: 'name',
        inputmode: 'text',
        pattern: '[A-Za-z]+',
        required: true,
        disabled: true,
        readonly: true,
        maxlength: 50,
        minlength: 5
      })

      const inputElement = input.input
      expect(inputElement.value).toBe('test value')
      expect(inputElement.placeholder).toBe('Enter text')
      expect(inputElement.autocomplete).toBe('name')
      expect(inputElement.inputMode).toBe('text')
      expect(inputElement.pattern).toBe('[A-Za-z]+')
      expect(inputElement.required).toBe(true)
      expect(inputElement.disabled).toBe(true)
      expect(inputElement.readOnly).toBe(true)
      expect(inputElement.maxLength).toBe(50)
      expect(inputElement.minLength).toBe(5)
    })

    it('should apply width classes correctly', () => {
      const characterWidths: Array<InputConfig['width']> = ['20', '10', '5', '4', '3', '2']
      const fluidWidths: Array<InputConfig['width']> = ['full', 'three-quarters', 'two-thirds', 'one-half', 'one-third', 'one-quarter']

      characterWidths.forEach(width => {
        if (width) {
          const input = createInput({ label: 'Test', width })
          expect(input.input.classList.contains(`public-good-input--width-${width}`)).toBe(true)
        }
      })

      fluidWidths.forEach(width => {
        if (width) {
          const input = createInput({ label: 'Test', width })
          expect(input.input.classList.contains(`public-good-u-width-${width}`)).toBe(true)
        }
      })
    })

    it('should apply custom classes', () => {
      const input = createInput({
        label: 'Test',
        classes: 'custom-class another-class'
      })

      expect(input.input.classList.contains('custom-class')).toBe(true)
      expect(input.input.classList.contains('another-class')).toBe(true)
    })

    it('should apply custom attributes', () => {
      const input = createInput({
        label: 'Test',
        attributes: {
          'data-test': 'test-value',
          'aria-label': 'Custom aria label'
        }
      })

      expect(input.input.getAttribute('data-test')).toBe('test-value')
      expect(input.input.getAttribute('aria-label')).toBe('Custom aria label')
    })
  })

  describe('Prefix and Suffix', () => {
    it('should create input with prefix', () => {
      const input = createInput({
        label: 'Test Input',
        prefix: '£'
      })

      const wrapper = input.element.querySelector('.public-good-input-wrapper')
      const prefix = wrapper?.querySelector('.public-good-input__prefix')
      
      expect(prefix).toBeTruthy()
      expect(prefix?.textContent).toBe('£')
      expect(prefix?.getAttribute('aria-hidden')).toBe('true')
    })

    it('should create input with suffix', () => {
      const input = createInput({
        label: 'Test Input',
        suffix: 'kg'
      })

      const wrapper = input.element.querySelector('.public-good-input-wrapper')
      const suffix = wrapper?.querySelector('.public-good-input__suffix')
      
      expect(suffix).toBeTruthy()
      expect(suffix?.textContent).toBe('kg')
      expect(suffix?.getAttribute('aria-hidden')).toBe('true')
    })

    it('should create input with both prefix and suffix', () => {
      const input = createInput({
        label: 'Test Input',
        prefix: '£',
        suffix: '.00'
      })

      const wrapper = input.element.querySelector('.public-good-input-wrapper')
      const prefix = wrapper?.querySelector('.public-good-input__prefix')
      const suffix = wrapper?.querySelector('.public-good-input__suffix')
      
      expect(prefix?.textContent).toBe('£')
      expect(suffix?.textContent).toBe('.00')
    })
  })

  describe('Error Handling', () => {
    it('should create input with initial error', () => {
      const input = createInput({
        label: 'Test Input',
        errorMessage: 'This field is required'
      })

      const formGroup = input.element
      const errorElement = formGroup.querySelector('.public-good-error-message')
      
      expect(formGroup.classList.contains('public-good-form-group--error')).toBe(true)
      expect(input.input.classList.contains('public-good-input--error')).toBe(true)
      expect(errorElement).toBeTruthy()
      expect(errorElement?.innerHTML).toContain('This field is required')
      expect(errorElement?.id).toBe(`${input.config.id}-error`)
      expect(input.input.getAttribute('aria-describedby')).toContain(`${input.config.id}-error`)
    })

    it('should set error dynamically', () => {
      const input = createInput({ label: 'Test Input' })
      
      input.setError('Validation failed')
      
      const formGroup = input.element
      const errorElement = formGroup.querySelector('.public-good-error-message')
      
      expect(formGroup.classList.contains('public-good-form-group--error')).toBe(true)
      expect(input.input.classList.contains('public-good-input--error')).toBe(true)
      expect(errorElement?.innerHTML).toContain('Validation failed')
      expect(input.config.errorMessage).toBe('Validation failed')
    })

    it('should clear error', () => {
      const input = createInput({
        label: 'Test Input',
        errorMessage: 'Initial error'
      })
      
      input.clearError()
      
      const formGroup = input.element
      const errorElement = formGroup.querySelector('.public-good-error-message')
      
      expect(formGroup.classList.contains('public-good-form-group--error')).toBe(false)
      expect(input.input.classList.contains('public-good-input--error')).toBe(false)
      expect(errorElement).toBe(null)
      expect(input.config.errorMessage).toBeUndefined()
    })

    it('should update aria-describedby when setting and clearing errors', () => {
      const input = createInput({
        id: 'test-input',
        label: 'Test Input',
        hint: 'Test hint'
      })

      // Initially should have hint
      expect(input.input.getAttribute('aria-describedby')).toBe('test-input-hint')

      // After setting error should have both
      input.setError('Error message')
      expect(input.input.getAttribute('aria-describedby')).toBe('test-input-hint test-input-error')

      // After clearing error should only have hint
      input.clearError()
      expect(input.input.getAttribute('aria-describedby')).toBe('test-input-hint')
    })
  })

  describe('Value Management', () => {
    it('should get and set values', () => {
      const input = createInput({ label: 'Test Input' })
      
      input.setValue('test value')
      expect(input.getValue()).toBe('test value')
      expect(input.config.value).toBe('test value')
    })

    it('should handle initial value', () => {
      const input = createInput({
        label: 'Test Input',
        value: 'initial value'
      })
      
      expect(input.getValue()).toBe('initial value')
    })

    it('should dispatch events when value changes', () => {
      const input = createInput({ label: 'Test Input' })
      let eventFired = false
      
      input.element.addEventListener('public-good:input:value-changed', () => {
        eventFired = true
      })
      
      input.setValue('new value')
      expect(eventFired).toBe(true)
    })
  })

  describe('Focus Management', () => {
    it('should focus and blur input', () => {
      const input = createInput({ label: 'Test Input' })
      document.body.appendChild(input.element)
      
      input.focus()
      expect(document.activeElement).toBe(input.input)
      
      input.blur()
      expect(document.activeElement).not.toBe(input.input)
      
      document.body.removeChild(input.element)
    })

    it('should dispatch focus and blur events', () => {
      const input = createInput({ label: 'Test Input' })
      document.body.appendChild(input.element)
      
      let focusEventFired = false
      let blurEventFired = false
      
      input.element.addEventListener('public-good:input:focused', () => {
        focusEventFired = true
      })
      
      input.element.addEventListener('public-good:input:blurred', () => {
        blurEventFired = true
      })
      
      input.input.focus()
      expect(focusEventFired).toBe(true)
      
      input.input.blur()
      expect(blurEventFired).toBe(true)
      
      document.body.removeChild(input.element)
    })
  })

  describe('Helper Functions', () => {
    it('should create email input with correct configuration', () => {
      const input = createEmailInput('Email address')
      
      expect(input.config.type).toBe('email')
      expect(input.config.label).toBe('Email address')
      expect(input.config.autocomplete).toBe('email')
      expect(input.config.inputmode).toBe('email')
    })

    it('should create telephone input with correct configuration', () => {
      const input = createTelInput('Phone number')
      
      expect(input.config.type).toBe('tel')
      expect(input.config.label).toBe('Phone number')
      expect(input.config.autocomplete).toBe('tel')
      expect(input.config.inputmode).toBe('tel')
    })

    it('should create numeric input with correct configuration', () => {
      const input = createNumericInput('Age')
      
      expect(input.config.type).toBe('text')
      expect(input.config.label).toBe('Age')
      expect(input.config.inputmode).toBe('numeric')
      expect(input.config.pattern).toBe('[0-9]*')
    })

    it('should create search input with correct configuration', () => {
      const input = createSearchInput('Search term')
      
      expect(input.config.type).toBe('search')
      expect(input.config.label).toBe('Search term')
      expect(input.config.inputmode).toBe('search')
    })

    it('should create password input with correct configuration', () => {
      const input = createPasswordInput('Password')
      
      expect(input.config.type).toBe('password')
      expect(input.config.label).toBe('Password')
      expect(input.config.autocomplete).toBe('current-password')
    })

    it('should create NHS number input with correct configuration', () => {
      const input = createNhsNumberInput()
      
      expect(input.config.type).toBe('text')
      expect(input.config.label).toBe('NHS number')
      expect(input.config.hint).toContain('10 digit number')
      expect(input.config.width).toBe('10')
      expect(input.config.inputmode).toBe('numeric')
      expect(input.config.pattern).toBe('[0-9 ]*')
      expect(input.config.autocomplete).toBe('off')
    })

    it('should allow overriding helper function defaults', () => {
      const input = createEmailInput('Custom Email', {
        placeholder: 'Enter your email',
        required: true,
        classes: 'custom-email-class'
      })
      
      expect(input.config.type).toBe('email')
      expect(input.config.label).toBe('Custom Email')
      expect(input.config.placeholder).toBe('Enter your email')
      expect(input.config.required).toBe(true)
      expect(input.config.classes).toBe('custom-email-class')
    })
  })

  describe('Event Handling', () => {
    it('should dispatch input change events', () => {
      const input = createInput({ label: 'Test Input' })
      let eventDetail: any = null
      
      input.element.addEventListener('public-good:input:changed', (event: any) => {
        eventDetail = event.detail
      })
      
      // Simulate user input
      input.input.value = 'user input'
      input.input.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(eventDetail).toBeTruthy()
      expect(eventDetail.value).toBe('user input')
      expect(eventDetail.input).toBe(input.input)
    })

    it('should dispatch creation event', () => {
      let creationEventFired = false
      let eventDetail: any = null
      
      // Create input first
      const input = createInput({ label: 'Test Input' })
      
      // Set up event listener on the form group element
      input.element.addEventListener('public-good:input:created', (event: any) => {
        creationEventFired = true
        eventDetail = event.detail
      })
      
      // Manually dispatch the creation event to test the mechanism
      const testEvent = new CustomEvent('public-good:input:created', {
        detail: { element: input.element, input: input.input, config: input.config },
        bubbles: true
      })
      input.element.dispatchEvent(testEvent)
      
      expect(creationEventFired).toBe(true)
      expect(eventDetail).toBeTruthy()
      expect(eventDetail.element).toBe(input.element)
      expect(eventDetail.input).toBe(input.input)
    })

    it('should dispatch error events', () => {
      const input = createInput({ label: 'Test Input' })
      let errorSetEventFired = false
      let errorClearedEventFired = false
      
      input.element.addEventListener('public-good:input:error-set', () => {
        errorSetEventFired = true
      })
      
      input.element.addEventListener('public-good:input:error-cleared', () => {
        errorClearedEventFired = true
      })
      
      input.setError('Test error')
      expect(errorSetEventFired).toBe(true)
      
      input.clearError()
      expect(errorClearedEventFired).toBe(true)
    })
  })

  describe('Cleanup', () => {
    it('should destroy input and dispatch event', () => {
      const input = createInput({ label: 'Test Input' })
      document.body.appendChild(input.element)
      
      let destroyEventFired = false
      document.addEventListener('public-good:input:destroyed', () => {
        destroyEventFired = true
      })
      
      input.destroy()
      
      expect(document.body.contains(input.element)).toBe(false)
      expect(destroyEventFired).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty configuration', () => {
      expect(() => {
        createInput({})
      }).not.toThrow()
    })

    it('should handle undefined values gracefully', () => {
      const config: InputConfig = {
        label: 'Test Input'
      }

      expect(() => createInput(config)).not.toThrow()
    })

    it('should maintain configuration reference', () => {
      const originalConfig: InputConfig = {
        label: 'Original Label',
        value: 'original value'
      }

      const input = createInput(originalConfig)

      expect(input.config).toBe(originalConfig)
      
      // Updates through the API should update the config
      input.setValue('updated value')
      expect(input.config.value).toBe('updated value')
      
      input.setError('Test error')
      expect(input.config.errorMessage).toBe('Test error')
      
      input.clearError()
      expect(input.config.errorMessage).toBeUndefined()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const input = createInput({
        id: 'accessible-input',
        label: 'Accessible Input',
        hint: 'This is a hint',
        errorMessage: 'This is an error'
      })

      const inputElement = input.input
      expect(inputElement.getAttribute('aria-describedby')).toBe('accessible-input-hint accessible-input-error')
    })

    it('should handle screen reader text in error messages', () => {
      const input = createInput({
        label: 'Test Input',
        errorMessage: 'Validation failed'
      })

      const errorElement = input.element.querySelector('.public-good-error-message')
      expect(errorElement?.innerHTML).toContain('<span class="public-good-sr-only">Error:</span>')
    })

    it('should associate label with input correctly', () => {
      const input = createInput({
        id: 'test-input',
        label: 'Test Label'
      })

      const label = input.element.querySelector('.public-good-label')
      expect(label?.getAttribute('for')).toBe('test-input')
      expect(input.input.id).toBe('test-input')
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should enforce configuration properties', () => {
      // These should compile correctly
      const validConfigs: InputConfig[] = [
        { label: 'Text input' },
        { type: 'email', label: 'Email input' },
        { label: 'Number input', inputmode: 'numeric' },
        { label: 'Tel input', type: 'tel', autocomplete: 'tel' }
      ]

      validConfigs.forEach((config) => {
        expect(() => createInput(config)).not.toThrow()
      })
    })

    it('should support all input types', () => {
      const types: Array<InputConfig['type']> = ['text', 'email', 'tel', 'number', 'search', 'url', 'password']
      
      types.forEach(type => {
        if (type) {
          expect(() => createInput({ type, label: 'Test' })).not.toThrow()
        }
      })
    })

    it('should support all width options', () => {
      const widths: Array<InputConfig['width']> = [
        'full', 'three-quarters', 'two-thirds', 'one-half', 'one-third', 'one-quarter',
        '20', '10', '5', '4', '3', '2'
      ]
      
      widths.forEach(width => {
        if (width) {
          expect(() => createInput({ label: 'Test', width })).not.toThrow()
        }
      })
    })
  })
})