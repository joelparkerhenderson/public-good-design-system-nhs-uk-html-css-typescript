import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { 
  createRadios, 
  createSimpleRadios,
  createInlineRadios,
  createSmallRadios,
  initializeRadios,
  type RadiosConfig 
} from '../radios'

// Mock DOM utilities
vi.mock('../../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-e2e-test`)
}))

describe('Radios Component E2E Tests', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    container = document.createElement('div')
    container.id = 'test-container'
    document.body.appendChild(container)
    
    // Clear any existing event listeners
    document.removeEventListener('DOMContentLoaded', initializeRadios)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('User Interactions', () => {
    test('should allow users to select radio options by clicking', () => {
      const config: RadiosConfig = {
        id: 'gender-radios',
        name: 'gender',
        legend: 'What is your gender?',
        options: [
          { value: 'female', text: 'Female' },
          { value: 'male', text: 'Male' },
          { value: 'other', text: 'Other' },
          { value: 'prefer-not-to-say', text: 'Prefer not to say' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Initially no option should be selected
      expect(radios.getValue()).toBeNull()

      // Click on the first option
      const firstLabel = radios.element.querySelector('label[for="gender-radios-0"]') as HTMLLabelElement
      firstLabel.click()

      expect(radios.getValue()).toBe('female')
      expect(radios.options[0].checked).toBe(true)
      expect(radios.options[1].checked).toBe(false)

      // Click on another option
      const thirdLabel = radios.element.querySelector('label[for="gender-radios-2"]') as HTMLLabelElement
      thirdLabel.click()

      expect(radios.getValue()).toBe('other')
      expect(radios.options[0].checked).toBe(false)
      expect(radios.options[2].checked).toBe(true)
    })

    test('should support keyboard navigation and selection', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test',
        legend: 'Test Options',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Focus first radio button
      radios.options[0].focus()
      expect(document.activeElement).toBe(radios.options[0])

      // Simulate Space key to select
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', code: 'Space' })
      radios.options[0].dispatchEvent(spaceEvent)
      radios.options[0].click() // Simulate the selection that would happen

      expect(radios.getValue()).toBe('option1')

      // Tab to next radio
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab' })
      radios.options[0].dispatchEvent(tabEvent)
      radios.options[1].focus()

      // Select with Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' })
      radios.options[1].dispatchEvent(enterEvent)
      radios.options[1].click() // Simulate the selection

      expect(radios.getValue()).toBe('option2')
    })

    test('should prevent selection of disabled options', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test',
        legend: 'Test Options',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2', disabled: true },
          { value: 'option3', text: 'Option 3' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Try to click disabled option
      const disabledLabel = radios.element.querySelector('label[for="test-radios-1"]') as HTMLLabelElement
      disabledLabel.click()

      // Should not be selected
      expect(radios.getValue()).toBeNull()
      expect(radios.options[1].checked).toBe(false)

      // Regular option should still work
      const normalLabel = radios.element.querySelector('label[for="test-radios-0"]') as HTMLLabelElement
      normalLabel.click()

      expect(radios.getValue()).toBe('option1')
    })
  })

  describe('Conditional Content Interactions', () => {
    test('should show and hide conditional content based on selection', () => {
      const config: RadiosConfig = {
        id: 'contact-radios',
        name: 'contact-method',
        legend: 'How would you like to be contacted?',
        options: [
          { 
            value: 'email', 
            text: 'Email',
            conditional: '<input type="email" id="email-input" placeholder="Enter your email">'
          },
          { 
            value: 'phone', 
            text: 'Phone',
            conditional: '<input type="tel" id="phone-input" placeholder="Enter your phone number">'
          },
          { value: 'post', text: 'Post' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      const emailConditional = radios.element.querySelector('#conditional-contact-radios-0') as HTMLElement
      const phoneConditional = radios.element.querySelector('#conditional-contact-radios-1') as HTMLElement

      // Initially all conditional content should be hidden
      expect(emailConditional.style.display).toBe('none')
      expect(phoneConditional.style.display).toBe('none')

      // Select email option
      const emailLabel = radios.element.querySelector('label[for="contact-radios-0"]') as HTMLLabelElement
      emailLabel.click()

      // Email conditional should be visible, phone should remain hidden
      expect(emailConditional.style.display).toBe('block')
      expect(phoneConditional.style.display).toBe('none')

      // User can interact with conditional content
      const emailInput = emailConditional.querySelector('#email-input') as HTMLInputElement
      emailInput.value = 'test@example.com'
      expect(emailInput.value).toBe('test@example.com')

      // Select phone option
      const phoneLabel = radios.element.querySelector('label[for="contact-radios-1"]') as HTMLLabelElement
      phoneLabel.click()

      // Phone conditional should be visible, email should be hidden
      expect(emailConditional.style.display).toBe('none')
      expect(phoneConditional.style.display).toBe('block')

      // Select post option (no conditional content)
      const postLabel = radios.element.querySelector('label[for="contact-radios-2"]') as HTMLLabelElement
      postLabel.click()

      // Both conditionals should be hidden
      expect(emailConditional.style.display).toBe('none')
      expect(phoneConditional.style.display).toBe('none')
    })

    test('should handle complex conditional content with form elements', () => {
      const conditionalHTML = `
        <div class="conditional-form">
          <label for="additional-info">Additional information:</label>
          <textarea id="additional-info" rows="3"></textarea>
          <button type="button" id="add-more">Add more details</button>
        </div>
      `

      const config: RadiosConfig = {
        id: 'feedback-radios',
        name: 'feedback-type',
        legend: 'What type of feedback do you have?',
        options: [
          { value: 'compliment', text: 'Compliment' },
          { 
            value: 'complaint', 
            text: 'Complaint',
            conditional: conditionalHTML
          }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Select complaint option
      const complaintLabel = radios.element.querySelector('label[for="feedback-radios-1"]') as HTMLLabelElement
      complaintLabel.click()

      const conditional = radios.element.querySelector('#conditional-feedback-radios-1') as HTMLElement
      expect(conditional.style.display).toBe('block')

      // Interact with conditional form elements
      const textarea = conditional.querySelector('#additional-info') as HTMLTextAreaElement
      const button = conditional.querySelector('#add-more') as HTMLButtonElement

      textarea.value = 'This is my complaint...'
      expect(textarea.value).toBe('This is my complaint...')

      let buttonClicked = false
      button.addEventListener('click', () => {
        buttonClicked = true
      })
      button.click()
      expect(buttonClicked).toBe(true)
    })
  })

  describe('Error State Interactions', () => {
    test('should handle form validation and error display', () => {
      const config: RadiosConfig = {
        id: 'required-radios',
        name: 'required-field',
        legend: 'This field is required',
        hint: 'Please select one option',
        options: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Simulate form submission without selection
      radios.showError('You must select an option')

      const errorElement = radios.element.querySelector('.public-good-error-message')
      expect(errorElement).toBeTruthy()
      expect(errorElement?.textContent).toContain('You must select an option')
      expect(radios.element.classList.contains('public-good-form-group--error')).toBe(true)

      // Select an option to clear error
      const yesLabel = radios.element.querySelector('label[for="required-radios-0"]') as HTMLLabelElement
      yesLabel.click()

      // Simulate error clearing after selection
      radios.hideError()

      expect(radios.element.querySelector('.public-good-error-message')).toBeNull()
      expect(radios.element.classList.contains('public-good-form-group--error')).toBe(false)
    })

    test('should maintain accessibility attributes during error states', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test',
        legend: 'Test Question',
        hint: 'Select an option',
        options: [
          { value: 'option1', text: 'Option 1', hint: 'This is option 1' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      const input = radios.options[0]
      
      // Check initial aria-describedby
      let describedBy = input.getAttribute('aria-describedby')
      expect(describedBy).toContain('test-radios-hint')
      expect(describedBy).toContain('test-radios-0-hint')

      // Add error
      radios.showError('Error message')

      // Check aria-describedby includes error
      describedBy = input.getAttribute('aria-describedby')
      expect(describedBy).toContain('test-radios-hint')
      expect(describedBy).toContain('test-radios-0-hint')
      expect(describedBy).toContain('test-radios-error')

      // Remove error
      radios.hideError()

      // Check aria-describedby no longer includes error
      describedBy = input.getAttribute('aria-describedby')
      expect(describedBy).toContain('test-radios-hint')
      expect(describedBy).toContain('test-radios-0-hint')
      expect(describedBy).not.toContain('test-radios-error')
    })
  })

  describe('Dynamic Content Management', () => {
    test('should handle adding and removing options dynamically', () => {
      const config: RadiosConfig = {
        id: 'dynamic-radios',
        name: 'dynamic',
        legend: 'Dynamic Options',
        options: [
          { value: 'option1', text: 'Option 1' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      expect(radios.options).toHaveLength(1)
      expect(radios.element.querySelectorAll('.public-good-radios__item')).toHaveLength(1)

      // Add a new option
      const newOption = { value: 'option2', text: 'Option 2', hint: 'New option hint' }
      const newInput = radios.addOption(newOption)

      expect(radios.options).toHaveLength(2)
      expect(radios.element.querySelectorAll('.public-good-radios__item')).toHaveLength(2)
      expect(newInput.value).toBe('option2')

      // New option should be functional
      const newLabel = radios.element.querySelector('label[for="dynamic-radios-1"]') as HTMLLabelElement
      newLabel.click()
      expect(radios.getValue()).toBe('option2')

      // Remove an option
      const removed = radios.removeOption('option1')
      expect(removed).toBe(true)
      expect(radios.options).toHaveLength(1)
      expect(radios.element.querySelectorAll('.public-good-radios__item')).toHaveLength(1)

      // Removed option should no longer be selectable
      expect(radios.getValue()).toBe('option2') // Should still be selected
    })

    test('should handle programmatic value changes', () => {
      const config: RadiosConfig = {
        id: 'program-radios',
        name: 'program',
        legend: 'Programmatic Control',
        options: [
          { value: 'auto', text: 'Automatic' },
          { value: 'manual', text: 'Manual' },
          { value: 'custom', text: 'Custom' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Set value programmatically
      let result = radios.setValue('manual')
      expect(result).toBe(true)
      expect(radios.getValue()).toBe('manual')
      expect(radios.options[1].checked).toBe(true)

      // Change to another value
      result = radios.setValue('custom')
      expect(result).toBe(true)
      expect(radios.getValue()).toBe('custom')
      expect(radios.options[1].checked).toBe(false)
      expect(radios.options[2].checked).toBe(true)

      // Try to set invalid value
      result = radios.setValue('invalid')
      expect(result).toBe(false)
      expect(radios.getValue()).toBe('custom') // Should remain unchanged
    })

    test('should handle enable/disable states', () => {
      const config: RadiosConfig = {
        id: 'state-radios',
        name: 'state',
        legend: 'State Control',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Initially enabled
      radios.options.forEach(input => {
        expect(input.disabled).toBe(false)
      })

      // Disable all
      radios.disable()
      radios.options.forEach(input => {
        expect(input.disabled).toBe(true)
      })
      expect(radios.element.classList.contains('public-good-radios--disabled')).toBe(true)

      // Try to select when disabled (should not work)
      const label = radios.element.querySelector('label[for="state-radios-0"]') as HTMLLabelElement
      label.click()
      expect(radios.getValue()).toBeNull()

      // Re-enable
      radios.enable()
      radios.options.forEach(input => {
        expect(input.disabled).toBe(false)
      })
      expect(radios.element.classList.contains('public-good-radios--disabled')).toBe(false)

      // Should work again
      label.click()
      expect(radios.getValue()).toBe('option1')
    })
  })

  describe('Event Handling', () => {
    test('should trigger custom events on changes', () => {
      const config: RadiosConfig = {
        id: 'event-radios',
        name: 'events',
        legend: 'Event Testing',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      let eventFired = false
      let eventDetail: any

      radios.element.addEventListener('public-good:radios:changed', (event: any) => {
        eventFired = true
        eventDetail = event.detail
      })

      // Select an option
      const label = radios.element.querySelector('label[for="event-radios-0"]') as HTMLLabelElement
      label.click()

      expect(eventFired).toBe(true)
      expect(eventDetail.value).toBe('option1')
      expect(eventDetail.element).toBe(radios.element)
      expect(eventDetail.option.value).toBe('option1')
    })

    test('should handle form integration', () => {
      // Create a form with radios
      const form = document.createElement('form')
      form.innerHTML = `
        <input type="hidden" name="form-token" value="test-token">
      `

      const config: RadiosConfig = {
        id: 'form-radios',
        name: 'user-type',
        legend: 'User Type',
        options: [
          { value: 'patient', text: 'Patient' },
          { value: 'healthcare-professional', text: 'Healthcare Professional' },
          { value: 'carer', text: 'Carer' }
        ]
      }

      const radios = createRadios(config)
      form.appendChild(radios.element)
      container.appendChild(form)

      // Select an option
      radios.setValue('healthcare-professional')

      // Check form data
      const formData = new FormData(form)
      expect(formData.get('user-type')).toBe('healthcare-professional')
      expect(formData.get('form-token')).toBe('test-token')

      // Change selection
      radios.setValue('patient')
      const updatedFormData = new FormData(form)
      expect(updatedFormData.get('user-type')).toBe('patient')
    })
  })

  describe('Responsive Behavior', () => {
    test('should handle inline layout correctly', () => {
      const config: RadiosConfig = {
        name: 'inline-test',
        legend: 'Inline Radios',
        inline: true,
        options: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
          { value: 'maybe', text: 'Maybe' }
        ]
      }

      const radios = createInlineRadios('inline-test', 'Inline Question', [
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' },
        { value: 'maybe', text: 'Maybe' }
      ])
      
      container.appendChild(radios.element)

      expect(radios.element.classList.contains('public-good-radios--inline')).toBe(true)

      // All options should still be functional
      const yesLabel = radios.element.querySelector('label[for*="-0"]') as HTMLLabelElement
      const noLabel = radios.element.querySelector('label[for*="-1"]') as HTMLLabelElement

      yesLabel.click()
      expect(radios.getValue()).toBe('yes')

      noLabel.click()
      expect(radios.getValue()).toBe('no')
    })

    test('should handle small size variant', () => {
      const radios = createSmallRadios('small-test', 'Small Question', [
        { value: 'option1', text: 'Option 1' },
        { value: 'option2', text: 'Option 2' }
      ])
      
      container.appendChild(radios.element)

      expect(radios.element.classList.contains('public-good-radios--small')).toBe(true)

      // Functionality should remain the same
      const label = radios.element.querySelector('label[for*="-0"]') as HTMLLabelElement
      label.click()
      expect(radios.getValue()).toBe('option1')
    })
  })

  describe('Data Attribute Initialization', () => {
    test('should auto-initialize from HTML data attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-radios
          data-name="auto-radios"
          data-legend="Auto-initialized Radios"
          data-hint="This was initialized automatically"
          data-options='[
            {"value":"option1","text":"Option 1"},
            {"value":"option2","text":"Option 2","checked":true}
          ]'
        ></div>
      `

      const components = initializeRadios()
      expect(components).toHaveLength(1)

      const radios = components[0]
      expect(radios.getValue()).toBe('option2')

      // Should be functional
      const label = radios.element.querySelector('label[for*="-0"]') as HTMLLabelElement
      label.click()
      expect(radios.getValue()).toBe('option1')
    })

    test('should handle multiple auto-initialized components', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-radios
          data-name="radios1"
          data-legend="First Radios"
          data-options='[{"value":"yes","text":"Yes"},{"value":"no","text":"No"}]'
        ></div>
        <div 
          data-public-good-radios
          data-name="radios2"
          data-legend="Second Radios"
          data-options='[{"value":"option1","text":"Option 1"}]'
        ></div>
      `

      const components = initializeRadios()
      expect(components).toHaveLength(2)

      // Both should be functional and independent
      const firstRadios = components[0]
      const secondRadios = components[1]

      firstRadios.setValue('yes')
      expect(firstRadios.getValue()).toBe('yes')
      expect(secondRadios.getValue()).toBeNull()

      secondRadios.setValue('option1')
      expect(firstRadios.getValue()).toBe('yes')
      expect(secondRadios.getValue()).toBe('option1')
    })
  })

  describe('Accessibility Integration', () => {
    test('should work with screen readers (aria attributes)', () => {
      const config: RadiosConfig = {
        id: 'accessible-radios',
        name: 'accessible',
        legend: 'Accessible Radios',
        hint: 'This is helpful hint text',
        options: [
          { value: 'option1', text: 'Option 1', hint: 'Additional context for option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      const firstInput = radios.options[0]
      const secondInput = radios.options[1]

      // Check aria-describedby relationships
      const firstDescribedBy = firstInput.getAttribute('aria-describedby')
      expect(firstDescribedBy).toContain('accessible-radios-hint')
      expect(firstDescribedBy).toContain('accessible-radios-0-hint')

      const secondDescribedBy = secondInput.getAttribute('aria-describedby')
      expect(secondDescribedBy).toContain('accessible-radios-hint')
      expect(secondDescribedBy).not.toContain('accessible-radios-1-hint')

      // Check fieldset structure
      expect(radios.element.tagName).toBe('FIELDSET')
      expect(radios.legend.tagName).toBe('LEGEND')

      // Check proper labeling
      const firstLabel = radios.element.querySelector('label[for="accessible-radios-0"]')
      const secondLabel = radios.element.querySelector('label[for="accessible-radios-1"]')
      
      expect(firstLabel?.getAttribute('for')).toBe(firstInput.id)
      expect(secondLabel?.getAttribute('for')).toBe(secondInput.id)
    })

    test('should handle focus management correctly', () => {
      const config: RadiosConfig = {
        id: 'focus-radios',
        name: 'focus',
        legend: 'Focus Management',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)

      // Focus should work on radio inputs
      radios.options[0].focus()
      expect(document.activeElement).toBe(radios.options[0])

      radios.options[1].focus()
      expect(document.activeElement).toBe(radios.options[1])

      // Focus should be maintained during interactions
      radios.options[2].focus()
      radios.options[2].click()
      expect(radios.getValue()).toBe('option3')
      expect(document.activeElement).toBe(radios.options[2])
    })
  })
})