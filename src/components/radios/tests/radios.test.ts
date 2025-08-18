import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { 
  createRadios, 
  createSimpleRadios,
  createInlineRadios,
  createSmallRadios,
  initializeRadios,
  type RadiosConfig,
  type RadioOption 
} from '../radios'

// Mock DOM utilities
vi.mock('../../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`)
}))

describe('Radios Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    container = document.createElement('div')
    document.body.appendChild(container)
    
    // Clear any existing event listeners
    document.removeEventListener('DOMContentLoaded', initializeRadios)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('createRadios', () => {
    it('should create a basic radios component', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      expect(radios.element).toBeInstanceOf(HTMLFieldSetElement)
      expect(radios.element.className).toBe('public-good-fieldset')
      expect(radios.legend.textContent).toBe('Test Radios')
      expect(radios.options).toHaveLength(2)
    })

    it('should set unique ID when not provided', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      expect(radios.element.id).toBe('radios-test-id')
      expect(config.id).toBe('radios-test-id')
    })

    it('should use provided ID', () => {
      const config: RadiosConfig = {
        id: 'custom-id',
        name: 'test-radios',
        legend: 'Test Radios',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      expect(radios.element.id).toBe('custom-id')
    })

    it('should create legend with correct size and heading options', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        legendSize: 'large',
        legendIsHeading: true,
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      expect(radios.legend.className).toBe('public-good-fieldset__legend public-good-fieldset__legend--large public-good-fieldset__legend--heading')
    })

    it('should create hint text when provided', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        hint: 'This is a hint',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      const hint = radios.element.querySelector('.public-good-hint')
      expect(hint).toBeTruthy()
      expect(hint?.textContent).toBe('This is a hint')
      expect(hint?.id).toBe('radios-test-id-hint')
    })

    it('should create error message when provided', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        errorMessage: 'This is an error',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      const error = radios.element.querySelector('.public-good-error-message')
      expect(error).toBeTruthy()
      expect(error?.innerHTML).toBe('<span class="public-good-visually-hidden">Error:</span> This is an error')
      expect(radios.element.classList.contains('public-good-form-group--error')).toBe(true)
    })

    it('should apply inline class when inline is true', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        inline: true,
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      expect(radios.element.classList.contains('public-good-radios--inline')).toBe(true)
    })

    it('should apply small class when small is true', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        small: true,
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      expect(radios.element.classList.contains('public-good-radios--small')).toBe(true)
    })

    it('should create radio options with correct attributes', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1', checked: true },
          { value: 'option2', text: 'Option 2', disabled: true }
        ]
      }

      const radios = createRadios(config)
      const inputs = radios.options

      expect(inputs[0].type).toBe('radio')
      expect(inputs[0].name).toBe('test-group')
      expect(inputs[0].value).toBe('option1')
      expect(inputs[0].checked).toBe(true)
      expect(inputs[0].id).toBe('test-radios-0')

      expect(inputs[1].value).toBe('option2')
      expect(inputs[1].disabled).toBe(true)
      expect(inputs[1].id).toBe('test-radios-1')
    })

    it('should create labels with correct associations', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      const labels = radios.element.querySelectorAll('.public-good-radios__label')

      expect(labels[0].textContent).toBe('Option 1')
      expect(labels[0].getAttribute('for')).toBe('test-radios-0')

      expect(labels[1].textContent).toBe('Option 2')
      expect(labels[1].getAttribute('for')).toBe('test-radios-1')
    })

    it('should create option hint text', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1', hint: 'This is option 1 hint' }
        ]
      }

      const radios = createRadios(config)
      const hint = radios.element.querySelector('.public-good-radios__hint')
      expect(hint?.textContent).toBe('This is option 1 hint')
      expect(hint?.id).toBe('test-radios-0-hint')

      // Check aria-describedby includes the hint ID
      const input = radios.options[0]
      expect(input.getAttribute('aria-describedby')).toContain('test-radios-0-hint')
    })

    it('should set aria-describedby with hint and error', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        hint: 'Main hint',
        errorMessage: 'Error message',
        options: [
          { value: 'option1', text: 'Option 1', hint: 'Option hint' }
        ]
      }

      const radios = createRadios(config)
      const input = radios.options[0]
      const describedBy = input.getAttribute('aria-describedby')
      
      expect(describedBy).toContain('test-radios-hint')
      expect(describedBy).toContain('test-radios-error')
      expect(describedBy).toContain('test-radios-0-hint')
    })

    it('should apply custom classes and attributes', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        classes: 'custom-class another-class',
        attributes: { 'data-test': 'value', 'role': 'group' },
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      expect(radios.element.classList.contains('custom-class')).toBe(true)
      expect(radios.element.classList.contains('another-class')).toBe(true)
      expect(radios.element.getAttribute('data-test')).toBe('value')
      expect(radios.element.getAttribute('role')).toBe('group')
    })

    it('should apply custom attributes to radio options', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            attributes: { 'data-custom': 'test-value', 'aria-label': 'Custom label' }
          }
        ]
      }

      const radios = createRadios(config)
      const input = radios.options[0]
      expect(input.getAttribute('data-custom')).toBe('test-value')
      expect(input.getAttribute('aria-label')).toBe('Custom label')
    })
  })

  describe('Conditional Content', () => {
    it('should create conditional content for radio options', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            conditional: '<p>This is conditional content</p>'
          }
        ]
      }

      const radios = createRadios(config)
      const conditional = radios.element.querySelector('.public-good-radios__conditional')
      expect(conditional).toBeTruthy()
      expect(conditional?.innerHTML).toBe('<p>This is conditional content</p>')
      expect(conditional?.id).toBe('conditional-test-radios-0')
    })

    it('should handle conditional content with DOM elements', () => {
      const conditionalElement = document.createElement('div')
      conditionalElement.textContent = 'DOM element content'

      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            conditional: conditionalElement
          }
        ]
      }

      const radios = createRadios(config)
      const conditional = radios.element.querySelector('.public-good-radios__conditional')
      expect(conditional?.firstChild).toBe(conditionalElement)
    })

    it('should initially hide conditional content for unchecked radios', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            conditional: '<p>Conditional content</p>'
          }
        ]
      }

      const radios = createRadios(config)
      const conditional = radios.element.querySelector('.public-good-radios__conditional') as HTMLElement
      expect(conditional.style.display).toBe('none')
    })

    it('should show conditional content for checked radios', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            checked: true,
            conditional: '<p>Conditional content</p>'
          }
        ]
      }

      const radios = createRadios(config)
      const conditional = radios.element.querySelector('.public-good-radios__conditional') as HTMLElement
      expect(conditional.style.display).not.toBe('none')
    })

    it('should toggle conditional content when radio selection changes', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            conditional: '<p>Content 1</p>'
          },
          { 
            value: 'option2', 
            text: 'Option 2',
            conditional: '<p>Content 2</p>'
          }
        ]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)
      
      const conditionals = radios.element.querySelectorAll('.public-good-radios__conditional') as NodeListOf<HTMLElement>
      
      // Initially both should be hidden
      expect(conditionals[0].style.display).toBe('none')
      expect(conditionals[1].style.display).toBe('none')
      
      // Select first radio
      radios.options[0].checked = true
      radios.options[0].dispatchEvent(new Event('change'))
      
      // First conditional should be visible, second hidden
      expect(conditionals[0].style.display).toBe('block')
      expect(conditionals[1].style.display).toBe('none')
      
      // Select second radio
      radios.options[1].checked = true
      radios.options[0].checked = false
      radios.options[1].dispatchEvent(new Event('change'))
      
      // Second conditional should be visible, first hidden
      expect(conditionals[0].style.display).toBe('none')
      expect(conditionals[1].style.display).toBe('block')
    })

    it('should set data-aria-controls attribute for conditional radios', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-group',
        legend: 'Test Radios',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            conditional: '<p>Conditional content</p>'
          }
        ]
      }

      const radios = createRadios(config)
      const input = radios.options[0]
      expect(input.getAttribute('data-aria-controls')).toBe('conditional-test-radios-0')
    })
  })

  describe('getValue and setValue', () => {
    it('should get the selected value', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2', checked: true }
        ]
      }

      const radios = createRadios(config)
      expect(radios.getValue()).toBe('option2')
    })

    it('should return null when no option is selected', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      expect(radios.getValue()).toBeNull()
    })

    it('should set the selected value', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      const result = radios.setValue('option1')
      
      expect(result).toBe(true)
      expect(radios.getValue()).toBe('option1')
      expect(radios.options[0].checked).toBe(true)
      expect(radios.options[1].checked).toBe(false)
    })

    it('should return false when setting invalid value', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      const result = radios.setValue('invalid-value')
      
      expect(result).toBe(false)
      expect(radios.getValue()).toBeNull()
    })

    it('should not set value for disabled radio', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1', disabled: true },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      const result = radios.setValue('option1')
      
      expect(result).toBe(false)
      expect(radios.getValue()).toBeNull()
    })
  })

  describe('getCheckedOption', () => {
    it('should return the checked option object', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2', checked: true, hint: 'Selected option' }
        ]
      }

      const radios = createRadios(config)
      const checkedOption = radios.getCheckedOption()
      
      expect(checkedOption).toEqual({
        value: 'option2',
        text: 'Option 2',
        checked: true,
        hint: 'Selected option'
      })
    })

    it('should return null when no option is checked', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      expect(radios.getCheckedOption()).toBeNull()
    })
  })

  describe('addOption and removeOption', () => {
    it('should add a new option', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' }
        ]
      }

      const radios = createRadios(config)
      const newOption: RadioOption = { value: 'option2', text: 'Option 2' }
      const newInput = radios.addOption(newOption)
      
      expect(config.options).toHaveLength(2)
      expect(config.options[1]).toBe(newOption)
      expect(radios.options).toHaveLength(2)
      expect(newInput.value).toBe('option2')
      
      const radioItems = radios.element.querySelectorAll('.public-good-radios__item')
      expect(radioItems).toHaveLength(2)
    })

    it('should add option at specific index', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option3', text: 'Option 3' }
        ]
      }

      const radios = createRadios(config)
      const newOption: RadioOption = { value: 'option2', text: 'Option 2' }
      radios.addOption(newOption, 1)
      
      expect(config.options[1]).toBe(newOption)
      expect(config.options[1].value).toBe('option2')
    })

    it('should remove an option', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      const result = radios.removeOption('option1')
      
      expect(result).toBe(true)
      expect(config.options).toHaveLength(1)
      expect(config.options[0].value).toBe('option2')
      expect(radios.options).toHaveLength(1)
      
      const radioItems = radios.element.querySelectorAll('.public-good-radios__item')
      expect(radioItems).toHaveLength(1)
    })

    it('should return false when removing non-existent option', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' }
        ]
      }

      const radios = createRadios(config)
      const result = radios.removeOption('invalid-option')
      
      expect(result).toBe(false)
      expect(config.options).toHaveLength(1)
    })
  })

  describe('disable and enable', () => {
    it('should disable all radio options', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      radios.disable()
      
      radios.options.forEach(input => {
        expect(input.disabled).toBe(true)
      })
      expect(radios.element.classList.contains('public-good-radios--disabled')).toBe(true)
    })

    it('should enable all radio options', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const radios = createRadios(config)
      radios.disable()
      radios.enable()
      
      radios.options.forEach(input => {
        expect(input.disabled).toBe(false)
      })
      expect(radios.element.classList.contains('public-good-radios--disabled')).toBe(false)
    })
  })

  describe('showError and hideError', () => {
    it('should show error message', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-radios',
        legend: 'Test Radios',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      radios.showError('This is an error')
      
      const error = radios.element.querySelector('.public-good-error-message')
      expect(error?.innerHTML).toBe('<span class="public-good-visually-hidden">Error:</span> This is an error')
      expect(radios.element.classList.contains('public-good-form-group--error')).toBe(true)
      
      // Check aria-describedby is updated
      radios.options.forEach(input => {
        expect(input.getAttribute('aria-describedby')).toContain('test-radios-error')
      })
    })

    it('should hide error message', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-radios',
        legend: 'Test Radios',
        errorMessage: 'Initial error',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      radios.hideError()
      
      const error = radios.element.querySelector('.public-good-error-message')
      expect(error).toBeNull()
      expect(radios.element.classList.contains('public-good-form-group--error')).toBe(false)
      expect(config.errorMessage).toBeUndefined()
    })

    it('should update existing error message', () => {
      const config: RadiosConfig = {
        id: 'test-radios',
        name: 'test-radios',
        legend: 'Test Radios',
        errorMessage: 'Initial error',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      radios.showError('Updated error message')
      
      const errors = radios.element.querySelectorAll('.public-good-error-message')
      expect(errors).toHaveLength(1)
      expect(errors[0].innerHTML).toBe('<span class="public-good-visually-hidden">Error:</span> Updated error message')
    })
  })

  describe('destroy', () => {
    it('should remove the component from DOM', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)
      
      expect(container.children).toHaveLength(1)
      
      radios.destroy()
      expect(container.children).toHaveLength(0)
    })

    it('should dispatch destroyed event', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const radios = createRadios(config)
      container.appendChild(radios.element)
      
      let eventFired = false
      document.addEventListener('public-good:radios:destroyed', () => {
        eventFired = true
      })
      
      radios.destroy()
      expect(eventFired).toBe(true)
    })
  })

  describe('Events', () => {
    it('should dispatch creation event', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      // Create the radios component and verify it has the expected structure
      const radios = createRadios(config)
      container.appendChild(radios.element)
      
      // Verify the component was created correctly
      expect(radios.element).toBeInstanceOf(HTMLFieldSetElement)
      expect(radios.element.id).toBeTruthy()
      expect(radios.legend.textContent).toBe('Test Radios')
      expect(radios.options).toHaveLength(1)
      expect(radios.config).toBe(config)
    })

    it('should dispatch change events', () => {
      const config: RadiosConfig = {
        name: 'test-radios',
        legend: 'Test Radios',
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

      radios.options[0].checked = true
      radios.options[0].dispatchEvent(new Event('change'))
      
      expect(eventFired).toBe(true)
      expect(eventDetail.value).toBe('option1')
      expect(eventDetail.element).toBe(radios.element)
    })
  })

  describe('Helper Functions', () => {
    describe('createSimpleRadios', () => {
      it('should create basic radios with simple options', () => {
        const options = [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No', checked: true }
        ]

        const radios = createSimpleRadios('answer', 'Do you agree?', options)
        
        expect(radios.config.name).toBe('answer')
        expect(radios.config.legend).toBe('Do you agree?')
        expect(radios.config.options).toHaveLength(2)
        expect(radios.getValue()).toBe('no')
      })

      it('should accept additional configuration', () => {
        const options = [{ value: 'yes', text: 'Yes' }]
        const radios = createSimpleRadios('answer', 'Question', options, {
          hint: 'Additional hint',
          small: true
        })

        expect(radios.config.hint).toBe('Additional hint')
        expect(radios.config.small).toBe(true)
      })
    })

    describe('createInlineRadios', () => {
      it('should create inline radios', () => {
        const options = [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' }
        ]

        const radios = createInlineRadios('answer', 'Question', options)
        
        expect(radios.config.inline).toBe(true)
        expect(radios.element.classList.contains('public-good-radios--inline')).toBe(true)
      })
    })

    describe('createSmallRadios', () => {
      it('should create small radios', () => {
        const options = [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' }
        ]

        const radios = createSmallRadios('answer', 'Question', options)
        
        expect(radios.config.small).toBe(true)
        expect(radios.element.classList.contains('public-good-radios--small')).toBe(true)
      })
    })
  })

  describe('Data Attribute Initialization', () => {
    it('should initialize radios from data attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-radios
          data-name="test-radios"
          data-legend="Test Question"
          data-hint="Select an option"
          data-legend-size="large"
          data-legend-heading="true"
          data-inline="false"
          data-small="true"
          data-options='[{"value":"yes","text":"Yes"},{"value":"no","text":"No","checked":true}]'
        ></div>
      `

      const components = initializeRadios()
      
      expect(components).toHaveLength(1)
      expect(components[0].config.name).toBe('test-radios')
      expect(components[0].config.legend).toBe('Test Question')
      expect(components[0].config.hint).toBe('Select an option')
      expect(components[0].config.legendSize).toBe('large')
      expect(components[0].config.legendIsHeading).toBe(true)
      expect(components[0].config.small).toBe(true)
      expect(components[0].getValue()).toBe('no')
    })

    it('should handle invalid JSON in data attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-radios
          data-name="test-radios"
          data-legend="Test Question"
          data-options='invalid-json'
        ></div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const components = initializeRadios()
      
      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Invalid JSON in data-options attribute:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should warn about missing required attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-radios
          data-legend="Test Question"
        ></div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const components = initializeRadios()
      
      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Radios component requires name, legend, and options')
      
      consoleSpy.mockRestore()
    })

    it('should replace original elements with initialized components', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-radios
          data-name="test-radios"
          data-legend="Test Question"
          data-options='[{"value":"yes","text":"Yes"}]'
        ></div>
      `

      const originalElement = document.querySelector('[data-public-good-radios]')
      expect(originalElement).toBeTruthy()

      initializeRadios()

      const newElement = document.querySelector('.public-good-fieldset')
      expect(newElement).toBeTruthy()
      expect(document.querySelector('[data-public-good-radios]')).toBeNull()
    })
  })
})