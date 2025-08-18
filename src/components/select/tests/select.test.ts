import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { 
  createSelect, 
  createSimpleSelect,
  createRequiredSelect,
  createMultiSelect,
  initializeSelects,
  type SelectConfig,
  type SelectOption 
} from '../select'

// Mock DOM utilities
vi.mock('../../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`)
}))

describe('Select Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    container = document.createElement('div')
    document.body.appendChild(container)
    
    // Clear any existing event listeners
    document.removeEventListener('DOMContentLoaded', initializeSelects)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('createSelect', () => {
    it('should create a basic select component', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      expect(select.element).toBeInstanceOf(HTMLDivElement)
      expect(select.element.className).toBe('public-good-form-group')
      expect(select.select).toBeInstanceOf(HTMLSelectElement)
      expect(select.label.textContent).toBe('Test Select')
      expect(select.select.options).toHaveLength(2)
    })

    it('should set unique ID when not provided', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      expect(select.select.id).toBe('select-test-id')
      expect(config.id).toBe('select-test-id')
    })

    it('should use provided ID', () => {
      const config: SelectConfig = {
        id: 'custom-id',
        name: 'test-select',
        label: 'Test Select',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      expect(select.select.id).toBe('custom-id')
    })

    it('should create label with correct association', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-select',
        label: 'Test Select',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      expect(select.label.htmlFor).toBe('test-select')
      expect(select.label.textContent).toBe('Test Select')
    })

    it('should create hint text when provided', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        hint: 'This is a hint',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      const hint = select.element.querySelector('.public-good-hint')
      expect(hint).toBeTruthy()
      expect(hint?.textContent).toBe('This is a hint')
      expect(hint?.id).toBe('select-test-id-hint')
    })

    it('should create error message when provided', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        errorMessage: 'This is an error',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      const error = select.element.querySelector('.public-good-error-message')
      expect(error).toBeTruthy()
      expect(error?.innerHTML).toBe('<span class="public-good-visually-hidden">Error:</span> This is an error')
      expect(select.element.classList.contains('public-good-form-group--error')).toBe(true)
    })

    it('should set select attributes correctly', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-group',
        label: 'Test Select',
        required: true,
        disabled: true,
        options: [
          { value: 'option1', text: 'Option 1', selected: true },
          { value: 'option2', text: 'Option 2', disabled: true }
        ]
      }

      const select = createSelect(config)
      expect(select.select.name).toBe('test-group')
      expect(select.select.required).toBe(true)
      expect(select.select.disabled).toBe(true)
      expect(select.select.id).toBe('test-select')
    })

    it('should create options with correct attributes', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-group',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1', selected: true },
          { value: 'option2', text: 'Option 2', disabled: true }
        ]
      }

      const select = createSelect(config)
      const options = Array.from(select.select.options)

      expect(options[0].value).toBe('option1')
      expect(options[0].textContent).toBe('Option 1')
      expect(options[0].selected).toBe(true)

      expect(options[1].value).toBe('option2')
      expect(options[1].textContent).toBe('Option 2')
      expect(options[1].disabled).toBe(true)
    })

    it('should set aria-describedby with hint and error', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-group',
        label: 'Test Select',
        hint: 'Main hint',
        errorMessage: 'Error message',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      const describedBy = select.select.getAttribute('aria-describedby')
      
      expect(describedBy).toContain('test-select-hint')
      expect(describedBy).toContain('test-select-error')
    })

    it('should apply custom classes and attributes', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        classes: 'custom-class another-class',
        attributes: { 'data-test': 'value', 'aria-label': 'Custom label' },
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      expect(select.element.classList.contains('custom-class')).toBe(true)
      expect(select.element.classList.contains('another-class')).toBe(true)
      expect(select.select.getAttribute('data-test')).toBe('value')
      expect(select.select.getAttribute('aria-label')).toBe('Custom label')
    })

    it('should apply custom attributes to options', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { 
            value: 'option1', 
            text: 'Option 1',
            attributes: { 'data-custom': 'test-value', 'title': 'Custom title' }
          }
        ]
      }

      const select = createSelect(config)
      const option = select.select.options[0]
      expect(option.getAttribute('data-custom')).toBe('test-value')
      expect(option.getAttribute('title')).toBe('Custom title')
    })
  })

  describe('Multiple Select', () => {
    it('should create multiple select when configured', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        multiple: true,
        size: 3,
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' }
        ]
      }

      const select = createSelect(config)
      expect(select.select.multiple).toBe(true)
      expect(select.select.size).toBe(3)
    })
  })

  describe('getValue and setValue', () => {
    it('should get the selected value for single select', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2', selected: true }
        ]
      }

      const select = createSelect(config)
      expect(select.getValue()).toBe('option2')
    })

    it('should return first option value when no option is explicitly selected', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      expect(select.getValue()).toBe('option1') // HTML select auto-selects first option
    })

    it('should set the selected value for single select', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      const result = select.setValue('option1')
      
      expect(result).toBe(true)
      expect(select.getValue()).toBe('option1')
      expect(select.select.value).toBe('option1')
    })

    it('should return false when setting invalid value', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      const result = select.setValue('invalid-value')
      
      expect(result).toBe(false)
      expect(select.getValue()).toBe('option1') // Should remain at first option
    })

    it('should not set value for disabled option', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1', disabled: true },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      const result = select.setValue('option1')
      
      expect(result).toBe(false)
      expect(select.getValue()).toBe('option2') // Should remain at second option (first enabled)
    })

    it('should handle multiple select values', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        multiple: true,
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' }
        ]
      }

      const select = createSelect(config)
      const result = select.setValue(['option1', 'option3'])
      
      expect(result).toBe(true)
      const values = select.getValue() as string[]
      expect(values).toContain('option1')
      expect(values).toContain('option3')
      expect(values).not.toContain('option2')
    })
  })

  describe('getSelectedOption', () => {
    it('should return the selected option object for single select', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2', selected: true }
        ]
      }

      const select = createSelect(config)
      const selectedOption = select.getSelectedOption()
      
      expect(selectedOption).toEqual({
        value: 'option2',
        text: 'Option 2',
        selected: true
      })
    })

    it('should return first option when no option is explicitly selected', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      const selectedOption = select.getSelectedOption()
      expect(selectedOption).toEqual({
        value: 'option1',
        text: 'Option 1'
      })
    })

    it('should return selected options array for multiple select', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        multiple: true,
        options: [
          { value: 'option1', text: 'Option 1', selected: true },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3', selected: true }
        ]
      }

      const select = createSelect(config)
      const selectedOptions = select.getSelectedOption() as SelectOption[]
      
      expect(selectedOptions).toHaveLength(2)
      expect(selectedOptions[0].value).toBe('option1')
      expect(selectedOptions[1].value).toBe('option3')
    })
  })

  describe('addOption and removeOption', () => {
    it('should add a new option', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' }
        ]
      }

      const select = createSelect(config)
      const newOption: SelectOption = { value: 'option2', text: 'Option 2' }
      const newOptionElement = select.addOption(newOption)
      
      expect(config.options).toHaveLength(2)
      expect(config.options[1]).toBe(newOption)
      expect(select.select.options).toHaveLength(2)
      expect(newOptionElement.value).toBe('option2')
    })

    it('should add option at specific index', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option3', text: 'Option 3' }
        ]
      }

      const select = createSelect(config)
      const newOption: SelectOption = { value: 'option2', text: 'Option 2' }
      select.addOption(newOption, 1)
      
      expect(config.options[1]).toBe(newOption)
      expect(config.options[1].value).toBe('option2')
    })

    it('should remove an option', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      const result = select.removeOption('option1')
      
      expect(result).toBe(true)
      expect(config.options).toHaveLength(1)
      expect(config.options[0].value).toBe('option2')
      expect(select.select.options).toHaveLength(1)
    })

    it('should return false when removing non-existent option', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' }
        ]
      }

      const select = createSelect(config)
      const result = select.removeOption('invalid-option')
      
      expect(result).toBe(false)
      expect(config.options).toHaveLength(1)
    })
  })

  describe('disable and enable', () => {
    it('should disable select', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      select.disable()
      
      expect(select.select.disabled).toBe(true)
      expect(config.disabled).toBe(true)
      expect(select.element.classList.contains('public-good-form-group--disabled')).toBe(true)
    })

    it('should enable select', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        disabled: true,
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      select.enable()
      
      expect(select.select.disabled).toBe(false)
      expect(config.disabled).toBe(false)
      expect(select.element.classList.contains('public-good-form-group--disabled')).toBe(false)
    })
  })

  describe('showError and hideError', () => {
    it('should show error message', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-select',
        label: 'Test Select',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      select.showError('This is an error')
      
      const error = select.element.querySelector('.public-good-error-message')
      expect(error?.innerHTML).toBe('<span class="public-good-visually-hidden">Error:</span> This is an error')
      expect(select.element.classList.contains('public-good-form-group--error')).toBe(true)
      
      // Check aria-describedby is updated
      expect(select.select.getAttribute('aria-describedby')).toContain('test-select-error')
    })

    it('should hide error message', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-select',
        label: 'Test Select',
        errorMessage: 'Initial error',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      select.hideError()
      
      const error = select.element.querySelector('.public-good-error-message')
      expect(error).toBeNull()
      expect(select.element.classList.contains('public-good-form-group--error')).toBe(false)
      expect(config.errorMessage).toBeUndefined()
    })

    it('should update existing error message', () => {
      const config: SelectConfig = {
        id: 'test-select',
        name: 'test-select',
        label: 'Test Select',
        errorMessage: 'Initial error',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      select.showError('Updated error message')
      
      const errors = select.element.querySelectorAll('.public-good-error-message')
      expect(errors).toHaveLength(1)
      expect(errors[0].innerHTML).toBe('<span class="public-good-visually-hidden">Error:</span> Updated error message')
    })
  })

  describe('destroy', () => {
    it('should remove the component from DOM', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      container.appendChild(select.element)
      
      expect(container.children).toHaveLength(1)
      
      select.destroy()
      expect(container.children).toHaveLength(0)
    })

    it('should dispatch destroyed event', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [{ value: 'option1', text: 'Option 1' }]
      }

      const select = createSelect(config)
      container.appendChild(select.element)
      
      let eventFired = false
      document.addEventListener('public-good:select:destroyed', () => {
        eventFired = true
      })
      
      select.destroy()
      expect(eventFired).toBe(true)
    })
  })

  describe('Events', () => {
    it('should dispatch change events', () => {
      const config: SelectConfig = {
        name: 'test-select',
        label: 'Test Select',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' }
        ]
      }

      const select = createSelect(config)
      container.appendChild(select.element)
      
      let eventFired = false
      let eventDetail: any

      select.element.addEventListener('public-good:select:changed', (event: any) => {
        eventFired = true
        eventDetail = event.detail
      })

      select.setValue('option1')
      
      expect(eventFired).toBe(true)
      expect(eventDetail.value).toBe('option1')
      expect(eventDetail.element).toBe(select.element)
    })
  })

  describe('Helper Functions', () => {
    describe('createSimpleSelect', () => {
      it('should create basic select with simple options', () => {
        const options = [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No', selected: true }
        ]

        const select = createSimpleSelect('answer', 'Do you agree?', options)
        
        expect(select.config.name).toBe('answer')
        expect(select.config.label).toBe('Do you agree?')
        expect(select.config.options).toHaveLength(2)
        expect(select.getValue()).toBe('no')
      })

      it('should accept additional configuration', () => {
        const options = [{ value: 'yes', text: 'Yes' }]
        const select = createSimpleSelect('answer', 'Question', options, {
          hint: 'Additional hint',
          required: true
        })

        expect(select.config.hint).toBe('Additional hint')
        expect(select.config.required).toBe(true)
      })
    })

    describe('createRequiredSelect', () => {
      it('should create required select', () => {
        const options = [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' }
        ]

        const select = createRequiredSelect('answer', 'Question', options)
        
        expect(select.config.required).toBe(true)
        expect(select.select.required).toBe(true)
      })
    })

    describe('createMultiSelect', () => {
      it('should create multiple select', () => {
        const options = [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
          { value: 'option3', text: 'Option 3' }
        ]

        const select = createMultiSelect('choices', 'Multiple Choices', options)
        
        expect(select.config.multiple).toBe(true)
        expect(select.select.multiple).toBe(true)
        expect(select.select.size).toBe(3)
      })
    })
  })

  describe('Data Attribute Initialization', () => {
    it('should initialize selects from data attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-select
          data-name="test-select"
          data-label="Test Question"
          data-hint="Select an option"
          data-required="true"
          data-options='[{"value":"yes","text":"Yes"},{"value":"no","text":"No","selected":true}]'
        ></div>
      `

      const components = initializeSelects()
      
      expect(components).toHaveLength(1)
      expect(components[0].config.name).toBe('test-select')
      expect(components[0].config.label).toBe('Test Question')
      expect(components[0].config.hint).toBe('Select an option')
      expect(components[0].config.required).toBe(true)
      expect(components[0].getValue()).toBe('no')
    })

    it('should handle invalid JSON in data attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-select
          data-name="test-select"
          data-label="Test Question"
          data-options='invalid-json'
        ></div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const components = initializeSelects()
      
      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Invalid JSON in data-options attribute:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should warn about missing required attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-select
          data-label="Test Question"
        ></div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const components = initializeSelects()
      
      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Select component requires name, label, and options')
      
      consoleSpy.mockRestore()
    })

    it('should replace original elements with initialized components', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-select
          data-name="test-select"
          data-label="Test Question"
          data-options='[{"value":"yes","text":"Yes"}]'
        ></div>
      `

      const originalElement = document.querySelector('[data-public-good-select]')
      expect(originalElement).toBeTruthy()

      initializeSelects()

      const newElement = document.querySelector('.public-good-form-group')
      expect(newElement).toBeTruthy()
      expect(document.querySelector('[data-public-good-select]')).toBeNull()
    })
  })
})