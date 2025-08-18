/**
 * Checkboxes Component Tests
 * Unit tests for the checkboxes component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createCheckboxes, 
  initializeCheckboxes,
  createSimpleCheckboxes,
  createFieldsetCheckboxes
} from './checkboxes'

describe('Checkboxes Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createCheckboxes', () => {
    it('should create a basic checkboxes group with default properties', () => {
      const checkboxes = createCheckboxes({
        name: 'test',
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      })

      expect(checkboxes.element).toBeDefined()
      expect(checkboxes.config).toBeDefined()
      expect(checkboxes.destroy).toBeInstanceOf(Function)
      expect(checkboxes.getValues).toBeInstanceOf(Function)
      expect(checkboxes.setValues).toBeInstanceOf(Function)

      // Check structure
      expect(checkboxes.element.classList.contains('public-good-form-group')).toBe(true)
      const container = checkboxes.element.querySelector('.public-good-checkboxes')
      expect(container).toBeTruthy()
      
      const inputs = container?.querySelectorAll('input[type="checkbox"]')
      expect(inputs).toHaveLength(2)
    })

    it('should create checkboxes with fieldset and legend', () => {
      const checkboxes = createCheckboxes({
        name: 'nationality',
        fieldset: {
          legend: {
            text: 'What is your nationality?'
          }
        },
        items: [
          { value: 'british', text: 'British' },
          { value: 'irish', text: 'Irish' }
        ]
      })

      const fieldset = checkboxes.element.querySelector('.public-good-fieldset')
      expect(fieldset).toBeTruthy()
      
      const legend = fieldset?.querySelector('.public-good-fieldset__legend')
      expect(legend?.textContent).toBe('What is your nationality?')
    })

    it('should create checkboxes with hint text', () => {
      const checkboxes = createCheckboxes({
        name: 'interests',
        hint: {
          text: 'Select all that apply'
        },
        items: [
          { value: 'music', text: 'Music' },
          { value: 'sports', text: 'Sports' }
        ]
      })

      const hint = checkboxes.element.querySelector('.public-good-hint')
      expect(hint?.textContent).toBe('Select all that apply')
    })

    it('should create checkboxes with error message', () => {
      const checkboxes = createCheckboxes({
        name: 'required',
        errorMessage: {
          text: 'Please select at least one option'
        },
        items: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' }
        ]
      })

      expect(checkboxes.element.classList.contains('public-good-form-group--error')).toBe(true)
      
      const error = checkboxes.element.querySelector('.public-good-error-message')
      expect(error).toBeTruthy()
      expect(error?.textContent).toContain('Please select at least one option')
    })

    it('should handle pre-checked values', () => {
      const checkboxes = createCheckboxes({
        name: 'preselected',
        values: ['option1', 'option3'],
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' }
        ]
      })

      const values = checkboxes.getValues()
      expect(values).toEqual(['option1', 'option3'])
      
      const inputs = checkboxes.element.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
      expect(inputs[0]?.checked).toBe(true)
      expect(inputs[1]?.checked).toBe(false)
      expect(inputs[2]?.checked).toBe(true)
    })

    it('should handle individual checked items', () => {
      const checkboxes = createCheckboxes({
        name: 'individual',
        items: [
          { value: 'option1', text: 'Option 1', checked: true },
          { value: 'option2', text: 'Option 2', checked: false },
          { value: 'option3', text: 'Option 3', checked: true }
        ]
      })

      const values = checkboxes.getValues()
      expect(values).toEqual(['option1', 'option3'])
    })

    it('should create checkboxes with hint text on items', () => {
      const checkboxes = createCheckboxes({
        name: 'with-hints',
        items: [
          { 
            value: 'gateway', 
            text: 'Government Gateway',
            hint: {
              text: "You'll have a user ID if you've registered before"
            }
          },
          { 
            value: 'login', 
            text: 'NHS.UK login',
            hint: {
              text: "You'll have an account if you've proved your identity"
            }
          }
        ]
      })

      const hints = checkboxes.element.querySelectorAll('.public-good-checkboxes__hint')
      expect(hints).toHaveLength(2)
      expect(hints[0]?.textContent).toContain('registered before')
      expect(hints[1]?.textContent).toContain('proved your identity')
    })

    it('should handle disabled items', () => {
      const checkboxes = createCheckboxes({
        name: 'disabled',
        items: [
          { value: 'enabled', text: 'Enabled option' },
          { value: 'disabled', text: 'Disabled option', disabled: true }
        ]
      })

      const inputs = checkboxes.element.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
      expect(inputs[0]?.disabled).toBe(false)
      expect(inputs[1]?.disabled).toBe(true)
    })

    it('should create dividers between items', () => {
      const checkboxes = createCheckboxes({
        name: 'with-divider',
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { divider: 'or' },
          { value: 'none', text: 'None of the above' }
        ]
      })

      const divider = checkboxes.element.querySelector('.public-good-checkboxes__divider')
      expect(divider?.textContent).toBe('or')
    })

    it('should handle conditional content reveal', () => {
      const checkboxes = createCheckboxes({
        name: 'conditional',
        items: [
          { 
            value: 'email', 
            text: 'Email',
            conditional: {
              html: '<input type="email" placeholder="Enter email">'
            }
          },
          { value: 'phone', text: 'Phone' }
        ]
      })

      const conditional = checkboxes.element.querySelector('.public-good-checkboxes__conditional')
      expect(conditional).toBeTruthy()
      expect(conditional?.classList.contains('public-good-checkboxes__conditional--hidden')).toBe(true)
      
      // Check when email is selected
      const emailInput = checkboxes.element.querySelector('input[value="email"]') as HTMLInputElement
      emailInput.checked = true
      emailInput.dispatchEvent(new Event('click', { bubbles: true }))
      
      expect(conditional?.classList.contains('public-good-checkboxes__conditional--hidden')).toBe(false)
    })

    it('should handle exclusive "none of the above" behavior', () => {
      const checkboxes = createCheckboxes({
        name: 'exclusive',
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { divider: 'or' },
          { value: 'none', text: 'None of the above', exclusive: true }
        ]
      })

      const inputs = checkboxes.element.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
      const option1 = inputs[0]!
      const option2 = inputs[1]!
      const noneOption = inputs[2]!

      // Check regular options first
      option1.checked = true
      option2.checked = true
      option1.dispatchEvent(new Event('click', { bubbles: true }))
      option2.dispatchEvent(new Event('click', { bubbles: true }))

      expect(checkboxes.getValues()).toEqual(['option1', 'option2'])

      // Check "none" option - should uncheck others
      noneOption.checked = true
      noneOption.dispatchEvent(new Event('click', { bubbles: true }))

      expect(option1.checked).toBe(false)
      expect(option2.checked).toBe(false)
      expect(noneOption.checked).toBe(true)
      expect(checkboxes.getValues()).toEqual(['none'])
    })

    it('should handle exclusive groups', () => {
      const checkboxes = createCheckboxes({
        name: 'exclusive-group',
        items: [
          { value: 'email', text: 'Email', exclusiveGroup: 'communication' },
          { value: 'phone', text: 'Phone', exclusiveGroup: 'communication' },
          { divider: 'or' },
          { value: 'none', text: 'None', exclusive: true, exclusiveGroup: 'communication' }
        ]
      })

      const inputs = checkboxes.element.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
      const emailInput = inputs[0]!
      const phoneInput = inputs[1]!
      const noneInput = inputs[2]!

      // Check email and phone
      emailInput.checked = true
      phoneInput.checked = true
      emailInput.dispatchEvent(new Event('click', { bubbles: true }))
      phoneInput.dispatchEvent(new Event('click', { bubbles: true }))

      expect(checkboxes.getValues()).toEqual(['email', 'phone'])

      // Check none - should uncheck others in same group
      noneInput.checked = true
      noneInput.dispatchEvent(new Event('click', { bubbles: true }))

      expect(emailInput.checked).toBe(false)
      expect(phoneInput.checked).toBe(false)
      expect(noneInput.checked).toBe(true)
    })

    it('should emit change events', () => {
      const checkboxes = createCheckboxes({
        name: 'events',
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      })

      const eventSpy = vi.fn()
      checkboxes.element.addEventListener('public-good:checkboxes:change', eventSpy)

      const input = checkboxes.element.querySelector('input[value="option1"]') as HTMLInputElement
      input.checked = true
      input.dispatchEvent(new Event('click', { bubbles: true }))

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.name).toBe('events')
      expect(eventDetail.value).toBe('option1')
      expect(eventDetail.checked).toBe(true)
      expect(eventDetail.values).toEqual(['option1'])
    })

    it('should validate required checkboxes', () => {
      const checkboxes = createCheckboxes({
        name: 'validation',
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      })

      // Should be invalid when no options selected
      expect(checkboxes.validate()).toBe(false)
      expect(checkboxes.element.classList.contains('public-good-form-group--error')).toBe(true)

      // Should be valid when option selected
      checkboxes.setValues(['option1'])
      expect(checkboxes.validate()).toBe(true)
    })

    it('should set and clear errors', () => {
      const checkboxes = createCheckboxes({
        name: 'error-test',
        items: [
          { value: 'option1', text: 'Option 1' }
        ]
      })

      checkboxes.setError('Custom error message')
      expect(checkboxes.element.classList.contains('public-good-form-group--error')).toBe(true)
      
      const error = checkboxes.element.querySelector('.public-good-error-message')
      expect(error?.textContent).toContain('Custom error message')

      checkboxes.clearError()
      expect(checkboxes.element.classList.contains('public-good-form-group--error')).toBe(false)
      expect(checkboxes.element.querySelector('.public-good-error-message')).toBeFalsy()
    })

    it('should handle value manipulation methods', () => {
      const checkboxes = createCheckboxes({
        name: 'manipulation',
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' }
        ]
      })

      // Test setValues
      checkboxes.setValues(['option1', 'option3'])
      expect(checkboxes.getValues()).toEqual(['option1', 'option3'])

      // Test checkAll
      checkboxes.checkAll()
      expect(checkboxes.getValues()).toEqual(['option1', 'option2', 'option3'])

      // Test uncheckAll
      checkboxes.uncheckAll()
      expect(checkboxes.getValues()).toEqual([])

      // Test toggle
      checkboxes.toggle('option2')
      expect(checkboxes.getValues()).toEqual(['option2'])
      
      checkboxes.toggle('option2')
      expect(checkboxes.getValues()).toEqual([])
    })

    it('should exclude disabled checkboxes from values', () => {
      const checkboxes = createCheckboxes({
        name: 'disabled-test',
        items: [
          { value: 'enabled', text: 'Enabled', checked: true },
          { value: 'disabled', text: 'Disabled', checked: true, disabled: true }
        ]
      })

      expect(checkboxes.getValues()).toEqual(['enabled'])
    })

    it('should clean up event listeners when destroyed', () => {
      const checkboxes = createCheckboxes({
        name: 'destroy-test',
        items: [
          { value: 'option1', text: 'Option 1' }
        ]
      })
      document.body.appendChild(checkboxes.element)

      // Verify element is in DOM
      expect(document.querySelector('.public-good-form-group')).toBeTruthy()

      // Destroy component
      checkboxes.destroy()

      // Verify element is removed from DOM
      expect(document.querySelector('.public-good-form-group')).toBeFalsy()
    })
  })

  describe('initializeCheckboxes', () => {
    it('should initialize checkboxes from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-checkboxes 
             data-name="test-checkboxes"
             data-items='[{"value":"option1","text":"Option 1"},{"value":"option2","text":"Option 2"}]'>
        </div>
      `

      const checkboxes = initializeCheckboxes()

      expect(checkboxes).toHaveLength(1)
      
      const formGroup = document.querySelector('.public-good-form-group')
      expect(formGroup).toBeTruthy()
      
      const inputs = formGroup?.querySelectorAll('input[type="checkbox"]')
      expect(inputs).toHaveLength(2)
    })

    it('should initialize from existing DOM checkboxes', () => {
      document.body.innerHTML = `
        <div data-public-good-checkboxes data-name="existing">
          <input type="checkbox" id="existing-1" value="option1">
          <label for="existing-1">Option 1</label>
          <input type="checkbox" id="existing-2" value="option2" checked>
          <label for="existing-2">Option 2</label>
        </div>
      `

      const checkboxes = initializeCheckboxes()

      expect(checkboxes).toHaveLength(1)
      expect(checkboxes[0]!.getValues()).toEqual(['option2'])
    })

    it('should handle invalid configuration gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-checkboxes>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const checkboxes = initializeCheckboxes()

      expect(checkboxes).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Checkboxes element missing required data-name attribute')
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create simple checkboxes with correct defaults', () => {
      const checkboxes = createSimpleCheckboxes('simple', [
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' }
      ])

      expect(checkboxes.config.name).toBe('simple')
      expect(checkboxes.config.items).toHaveLength(2)
      expect(checkboxes.config.items[0]?.value).toBe('yes')
      expect(checkboxes.config.items[0]?.text).toBe('Yes')
    })

    it('should create fieldset checkboxes with legend', () => {
      const checkboxes = createFieldsetCheckboxes(
        'preferences',
        'What are your preferences?',
        [
          { value: 'email', text: 'Email notifications' },
          { value: 'sms', text: 'SMS notifications' }
        ]
      )

      expect(checkboxes.config.fieldset?.legend?.text).toBe('What are your preferences?')
      
      const legend = checkboxes.element.querySelector('.public-good-fieldset__legend')
      expect(legend?.textContent).toBe('What are your preferences?')
    })
  })

  describe('accessibility', () => {
    it('should have proper form semantics', () => {
      const checkboxes = createCheckboxes({
        name: 'accessible',
        fieldset: {
          legend: {
            text: 'Select your preferences'
          }
        },
        items: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      })

      const fieldset = checkboxes.element.querySelector('fieldset')
      expect(fieldset).toBeTruthy()
      
      const legend = fieldset?.querySelector('legend')
      expect(legend?.textContent).toBe('Select your preferences')
    })

    it('should associate hints with checkboxes using aria-describedby', () => {
      const checkboxes = createCheckboxes({
        name: 'with-hints',
        items: [
          { 
            value: 'option1', 
            text: 'Option 1',
            hint: {
              text: 'This is a hint for option 1'
            }
          }
        ]
      })

      const input = checkboxes.element.querySelector('input[type="checkbox"]')
      const hintId = input?.getAttribute('aria-describedby')
      expect(hintId).toBeTruthy()
      
      const hint = checkboxes.element.querySelector(`#${hintId}`)
      expect(hint?.textContent).toBe('This is a hint for option 1')
    })

    it('should associate error messages with checkboxes', () => {
      const checkboxes = createCheckboxes({
        name: 'error-test',
        errorMessage: {
          text: 'Please select an option'
        },
        items: [
          { value: 'option1', text: 'Option 1' }
        ]
      })

      const container = checkboxes.element.querySelector('.public-good-checkboxes')
      const describedBy = container?.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      
      const errorMessage = checkboxes.element.querySelector(`#${describedBy}`)
      expect(errorMessage?.textContent).toContain('Please select an option')
    })

    it('should handle conditional content accessibility', () => {
      const checkboxes = createCheckboxes({
        name: 'conditional',
        items: [
          { 
            value: 'email', 
            text: 'Email',
            conditional: {
              html: '<input type="email" placeholder="Enter email">'
            }
          }
        ]
      })

      const input = checkboxes.element.querySelector('input[value="email"]') as HTMLInputElement
      const ariaControls = input.getAttribute('aria-controls')
      const ariaExpanded = input.getAttribute('aria-expanded')
      
      expect(ariaControls).toBeTruthy()
      expect(ariaExpanded).toBe('false')
      
      const conditional = checkboxes.element.querySelector(`#${ariaControls}`)
      expect(conditional).toBeTruthy()
    })

    it('should provide screen reader feedback for errors', () => {
      const checkboxes = createCheckboxes({
        name: 'sr-error',
        errorMessage: {
          text: 'Please select an option'
        },
        items: [
          { value: 'option1', text: 'Option 1' }
        ]
      })

      const srOnly = checkboxes.element.querySelector('.public-good-sr-only')
      expect(srOnly?.textContent).toContain('Error:')
    })
  })

  describe('page show event handling', () => {
    it('should sync conditional reveals on page show', () => {
      const checkboxes = createCheckboxes({
        name: 'pageshow',
        items: [
          { 
            value: 'email', 
            text: 'Email',
            checked: true,
            conditional: {
              html: '<input type="email" placeholder="Enter email">'
            }
          }
        ]
      })

      // Trigger page show event
      const pageShowEvent = new Event('pageshow')
      window.dispatchEvent(pageShowEvent)

      const conditional = checkboxes.element.querySelector('.public-good-checkboxes__conditional')
      expect(conditional?.classList.contains('public-good-checkboxes__conditional--hidden')).toBe(false)
    })
  })
})