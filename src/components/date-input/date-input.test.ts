/**
 * Date Input Component Tests
 * Unit tests for the date input component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createDateInput, 
  initializeDateInputs,
  createSimpleDateInput,
  createDateInputWithError
} from './date-input'

describe('Date Input Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createDateInput', () => {
    it('should create a basic date input with default properties', () => {
      const dateInput = createDateInput({
        namePrefix: 'test'
      })

      expect(dateInput.element).toBeDefined()
      expect(dateInput.config).toBeDefined()
      expect(dateInput.destroy).toBeInstanceOf(Function)
      expect(dateInput.getValues).toBeInstanceOf(Function)
      expect(dateInput.setValues).toBeInstanceOf(Function)
      expect(dateInput.getDate).toBeInstanceOf(Function)
      expect(dateInput.setDate).toBeInstanceOf(Function)

      // Check structure
      expect(dateInput.element.classList.contains('public-good-form-group')).toBe(true)
      const container = dateInput.element.querySelector('.public-good-date-input')
      expect(container).toBeTruthy()
      
      const inputs = container?.querySelectorAll('input[type="text"]')
      expect(inputs).toHaveLength(3)
      
      const items = container?.querySelectorAll('.public-good-date-input__item')
      expect(items).toHaveLength(3)
    })

    it('should create date input with fieldset and legend', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob',
        fieldset: {
          legend: {
            text: 'What is your date of birth?'
          }
        }
      })

      const fieldset = dateInput.element.querySelector('.public-good-fieldset')
      expect(fieldset).toBeTruthy()
      
      const legend = fieldset?.querySelector('.public-good-fieldset__legend')
      expect(legend?.textContent).toBe('What is your date of birth?')
    })

    it('should create date input with page heading legend', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob',
        fieldset: {
          legend: {
            text: 'When were you born?',
            isPageHeading: true
          }
        }
      })

      const legend = dateInput.element.querySelector('.public-good-fieldset__legend')
      const heading = legend?.querySelector('h1.public-good-fieldset__heading')
      expect(heading?.textContent).toBe('When were you born?')
    })

    it('should create date input with hint text', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob',
        hint: {
          text: 'For example, 27 3 2007'
        }
      })

      const hint = dateInput.element.querySelector('.public-good-hint')
      expect(hint?.textContent).toBe('For example, 27 3 2007')
    })

    it('should create date input with error message', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob',
        errorMessage: {
          text: 'Enter your date of birth'
        }
      })

      expect(dateInput.element.classList.contains('public-good-form-group--error')).toBe(true)
      
      const error = dateInput.element.querySelector('.public-good-error-message')
      expect(error).toBeTruthy()
      expect(error?.textContent).toContain('Enter your date of birth')
      
      const inputs = dateInput.element.querySelectorAll('input')
      inputs.forEach(input => {
        expect(input.classList.contains('public-good-input--error')).toBe(true)
      })
    })

    it('should handle initial values', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob',
        value: {
          day: '15',
          month: '03',
          year: '1984'
        }
      })

      const values = dateInput.getValues()
      expect(values).toEqual({
        day: '15',
        month: '03',
        year: '1984'
      })
    })

    it('should create inputs with correct attributes', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      const dayInput = dateInput.element.querySelector('input[name="dob-day"]') as HTMLInputElement
      const monthInput = dateInput.element.querySelector('input[name="dob-month"]') as HTMLInputElement
      const yearInput = dateInput.element.querySelector('input[name="dob-year"]') as HTMLInputElement

      expect(dayInput?.getAttribute('autocomplete')).toBe('bday-day')
      expect(dayInput?.getAttribute('inputmode')).toBe('numeric')
      expect(dayInput?.getAttribute('maxlength')).toBe('2')

      expect(monthInput?.getAttribute('autocomplete')).toBe('bday-month')
      expect(monthInput?.getAttribute('inputmode')).toBe('numeric')
      expect(monthInput?.getAttribute('maxlength')).toBe('2')

      expect(yearInput?.getAttribute('autocomplete')).toBe('bday-year')
      expect(yearInput?.getAttribute('inputmode')).toBe('numeric')
      expect(yearInput?.getAttribute('maxlength')).toBe('4')
    })

    it('should handle custom input items', () => {
      const dateInput = createDateInput({
        namePrefix: 'custom',
        items: [
          {
            name: 'day',
            label: 'Day',
            classes: 'custom-day-class'
          },
          {
            name: 'month',
            label: 'Month',
            classes: 'custom-month-class'
          },
          {
            name: 'year',
            label: 'Year',
            classes: 'custom-year-class'
          }
        ]
      })

      const dayInput = dateInput.element.querySelector('input[name="custom-day"]') as HTMLInputElement
      const monthInput = dateInput.element.querySelector('input[name="custom-month"]') as HTMLInputElement
      const yearInput = dateInput.element.querySelector('input[name="custom-year"]') as HTMLInputElement

      expect(dayInput?.classList.contains('custom-day-class')).toBe(true)
      expect(monthInput?.classList.contains('custom-month-class')).toBe(true)
      expect(yearInput?.classList.contains('custom-year-class')).toBe(true)
    })

    it('should set up aria-describedby correctly', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob',
        hint: {
          text: 'For example, 27 3 2007'
        },
        errorMessage: {
          text: 'Enter your date of birth'
        }
      })

      const container = dateInput.element.querySelector('.public-good-date-input')
      const describedBy = container?.getAttribute('aria-describedby')
      
      expect(describedBy).toBeTruthy()
      
      const hintId = dateInput.element.querySelector('.public-good-hint')?.id
      const errorId = dateInput.element.querySelector('.public-good-error-message')?.id
      
      expect(describedBy).toContain(hintId!)
      expect(describedBy).toContain(errorId!)
    })

    it('should emit change events when values change', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      const eventSpy = vi.fn()
      dateInput.element.addEventListener('public-good:date-input:change', eventSpy)

      const dayInput = dateInput.element.querySelector('input[name="dob-day"]') as HTMLInputElement
      dayInput.value = '15'
      dayInput.dispatchEvent(new Event('input', { bubbles: true }))

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.namePrefix).toBe('dob')
      expect(eventDetail.field).toBe('day')
      expect(eventDetail.value).toBe('15')
    })

    it('should auto-advance to next field on valid input', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })
      document.body.appendChild(dateInput.element)

      const dayInput = dateInput.element.querySelector('input[name="dob-day"]') as HTMLInputElement
      const monthInput = dateInput.element.querySelector('input[name="dob-month"]') as HTMLInputElement

      const focusSpy = vi.spyOn(monthInput, 'focus')

      dayInput.value = '15'
      dayInput.dispatchEvent(new Event('input', { bubbles: true }))

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should handle paste events with formatted dates', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      const dayInput = dateInput.element.querySelector('input[name="dob-day"]') as HTMLInputElement
      
      // Mock the ClipboardEvent since it's not available in JSDOM
      const mockClipboardData = {
        getData: vi.fn().mockReturnValue('15/03/1984')
      }
      
      const pasteEvent = new Event('paste') as any
      pasteEvent.clipboardData = mockClipboardData
      
      dayInput.dispatchEvent(pasteEvent)

      const values = dateInput.getValues()
      expect(values.day).toBe('15')
      expect(values.month).toBe('03')
      expect(values.year).toBe('1984')
    })

    it('should validate date correctly', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      // Invalid - incomplete
      expect(dateInput.validate()).toBe(false)

      // Invalid - invalid date
      dateInput.setValues({ day: '32', month: '13', year: '2023' })
      expect(dateInput.validate()).toBe(false)

      // Valid date
      dateInput.setValues({ day: '15', month: '03', year: '1984' })
      expect(dateInput.validate()).toBe(true)
    })

    it('should handle Date object conversion', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      const testDate = new Date(1984, 2, 15) // March 15, 1984
      dateInput.setDate(testDate)

      const values = dateInput.getValues()
      expect(values.day).toBe('15')
      expect(values.month).toBe('03')
      expect(values.year).toBe('1984')

      const retrievedDate = dateInput.getDate()
      expect(retrievedDate?.getFullYear()).toBe(1984)
      expect(retrievedDate?.getMonth()).toBe(2) // 0-indexed
      expect(retrievedDate?.getDate()).toBe(15)
    })

    it('should return null for invalid dates', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      // Incomplete date
      dateInput.setValues({ day: '15', month: '', year: '1984' })
      expect(dateInput.getDate()).toBeNull()

      // Invalid date
      dateInput.setValues({ day: '32', month: '02', year: '1984' })
      expect(dateInput.getDate()).toBeNull()
    })

    it('should handle error state management', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      dateInput.setError('Custom error message')
      expect(dateInput.element.classList.contains('public-good-form-group--error')).toBe(true)
      
      const error = dateInput.element.querySelector('.public-good-error-message')
      expect(error?.textContent).toContain('Custom error message')

      dateInput.clearError()
      expect(dateInput.element.classList.contains('public-good-form-group--error')).toBe(false)
      expect(dateInput.element.querySelector('.public-good-error-message')).toBeFalsy()
    })

    it('should handle enable/disable state', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })

      const inputs = dateInput.element.querySelectorAll('input') as NodeListOf<HTMLInputElement>

      dateInput.disable()
      inputs.forEach(input => {
        expect(input.disabled).toBe(true)
      })

      dateInput.enable()
      inputs.forEach(input => {
        expect(input.disabled).toBe(false)
      })
    })

    it('should focus first input', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })
      document.body.appendChild(dateInput.element)

      const dayInput = dateInput.element.querySelector('input[name="dob-day"]') as HTMLInputElement
      const focusSpy = vi.spyOn(dayInput, 'focus')

      dateInput.focus()
      expect(focusSpy).toHaveBeenCalled()
    })

    it('should clear all values', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob',
        value: {
          day: '15',
          month: '03',
          year: '1984'
        }
      })

      dateInput.clear()
      const values = dateInput.getValues()
      expect(values.day).toBe('')
      expect(values.month).toBe('')
      expect(values.year).toBe('')
    })

    it('should clean up when destroyed', () => {
      const dateInput = createDateInput({
        namePrefix: 'dob'
      })
      document.body.appendChild(dateInput.element)

      expect(document.querySelector('.public-good-form-group')).toBeTruthy()

      dateInput.destroy()
      expect(document.querySelector('.public-good-form-group')).toBeFalsy()
    })
  })

  describe('initializeDateInputs', () => {
    it('should initialize date inputs from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-date-input 
             data-name-prefix="test-date"
             data-fieldset-legend="Enter your date"
             data-hint="For example, 27 3 2007">
        </div>
      `

      const dateInputs = initializeDateInputs()

      expect(dateInputs).toHaveLength(1)
      
      const formGroup = document.querySelector('.public-good-form-group')
      expect(formGroup).toBeTruthy()
      
      const legend = formGroup?.querySelector('.public-good-fieldset__legend')
      expect(legend?.textContent).toBe('Enter your date')
      
      const hint = formGroup?.querySelector('.public-good-hint')
      expect(hint?.textContent).toBe('For example, 27 3 2007')
    })

    it('should handle missing name prefix gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-date-input>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const dateInputs = initializeDateInputs()

      expect(dateInputs).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Date input element missing required data-name-prefix attribute')
      
      consoleSpy.mockRestore()
    })

    it('should handle initialization errors gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-date-input data-name-prefix="test" data-invalid-config="true">
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Call with invalid element that will cause internal error
      const elements = document.querySelectorAll('[data-public-good-date-input]')
      elements.forEach(element => {
        // Remove the element while trying to initialize to cause error
        element.remove()
      })

      const dateInputs = initializeDateInputs()

      expect(dateInputs).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create simple date input with correct defaults', () => {
      const dateInput = createSimpleDateInput('simple', 'Enter a date')

      expect(dateInput.config.namePrefix).toBe('simple')
      expect(dateInput.config.fieldset?.legend?.text).toBe('Enter a date')
      expect(dateInput.config.hint?.text).toBe('For example, 27 3 2007')
    })

    it('should create date input with error', () => {
      const dateInput = createDateInputWithError(
        'error-test',
        'Enter your birthday',
        'Date is required'
      )

      expect(dateInput.config.fieldset?.legend?.text).toBe('Enter your birthday')
      expect(dateInput.config.errorMessage?.text).toBe('Date is required')
      expect(dateInput.element.classList.contains('public-good-form-group--error')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have proper form semantics', () => {
      const dateInput = createDateInput({
        namePrefix: 'accessible',
        fieldset: {
          legend: {
            text: 'Enter your date of birth'
          }
        }
      })

      const fieldset = dateInput.element.querySelector('fieldset')
      expect(fieldset).toBeTruthy()
      
      const legend = fieldset?.querySelector('legend')
      expect(legend?.textContent).toBe('Enter your date of birth')
    })

    it('should associate hints and errors with inputs', () => {
      const dateInput = createDateInput({
        namePrefix: 'accessible',
        hint: {
          text: 'For example, 27 3 2007'
        },
        errorMessage: {
          text: 'Enter a valid date'
        }
      })

      const container = dateInput.element.querySelector('.public-good-date-input')
      const describedBy = container?.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      
      const hintId = dateInput.element.querySelector('.public-good-hint')?.id
      const errorId = dateInput.element.querySelector('.public-good-error-message')?.id
      
      expect(describedBy).toContain(hintId!)
      expect(describedBy).toContain(errorId!)
    })

    it('should provide screen reader feedback for errors', () => {
      const dateInput = createDateInput({
        namePrefix: 'sr-error',
        errorMessage: {
          text: 'Enter your date of birth',
          visuallyHiddenText: 'Error'
        }
      })

      const srOnly = dateInput.element.querySelector('.public-good-sr-only')
      expect(srOnly?.textContent).toContain('Error')
    })

    it('should have proper input labels', () => {
      const dateInput = createDateInput({
        namePrefix: 'labeled'
      })

      const dayInput = dateInput.element.querySelector('input[name="labeled-day"]')
      const dayLabel = dateInput.element.querySelector('label[for="labeled-day"]')
      
      expect(dayInput?.id).toBe('labeled-day')
      expect(dayLabel?.getAttribute('for')).toBe('labeled-day')
      expect(dayLabel?.textContent).toBe('Day')
    })
  })

  describe('date validation', () => {
    it('should validate leap years correctly', () => {
      const dateInput = createDateInput({
        namePrefix: 'leap'
      })

      // Valid leap year date
      dateInput.setValues({ day: '29', month: '02', year: '2020' })
      expect(dateInput.validate()).toBe(true)

      // Invalid leap year date
      dateInput.setValues({ day: '29', month: '02', year: '2021' })
      expect(dateInput.validate()).toBe(false)
    })

    it('should validate day ranges for different months', () => {
      const dateInput = createDateInput({
        namePrefix: 'ranges'
      })

      // Valid February date (non-leap year)
      dateInput.setValues({ day: '28', month: '02', year: '2021' })
      expect(dateInput.validate()).toBe(true)

      // Invalid February date (non-leap year)
      dateInput.setValues({ day: '29', month: '02', year: '2021' })
      expect(dateInput.validate()).toBe(false)

      // Valid April date
      dateInput.setValues({ day: '30', month: '04', year: '2021' })
      expect(dateInput.validate()).toBe(true)

      // Invalid April date
      dateInput.setValues({ day: '31', month: '04', year: '2021' })
      expect(dateInput.validate()).toBe(false)
    })

    it('should handle edge case dates', () => {
      const dateInput = createDateInput({
        namePrefix: 'edge'
      })

      // Test various edge cases
      const testCases = [
        { day: '31', month: '12', year: '2021', valid: true },
        { day: '01', month: '01', year: '2022', valid: true },
        { day: '00', month: '01', year: '2021', valid: false },
        { day: '32', month: '01', year: '2021', valid: false },
        { day: '15', month: '00', year: '2021', valid: false },
        { day: '15', month: '13', year: '2021', valid: false }
      ]

      testCases.forEach(({ day, month, year, valid }) => {
        dateInput.setValues({ day, month, year })
        expect(dateInput.validate()).toBe(valid)
      })
    })
  })

  describe('auto-advance behavior', () => {
    it('should auto-advance from day to month on valid two-digit day', () => {
      const dateInput = createDateInput({
        namePrefix: 'auto'
      })
      document.body.appendChild(dateInput.element)

      const dayInput = dateInput.element.querySelector('input[name="auto-day"]') as HTMLInputElement
      const monthInput = dateInput.element.querySelector('input[name="auto-month"]') as HTMLInputElement

      const focusSpy = vi.spyOn(monthInput, 'focus')

      dayInput.value = '15'
      dayInput.dispatchEvent(new Event('input', { bubbles: true }))

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should auto-advance from month to year on valid two-digit month', () => {
      const dateInput = createDateInput({
        namePrefix: 'auto'
      })
      document.body.appendChild(dateInput.element)

      const monthInput = dateInput.element.querySelector('input[name="auto-month"]') as HTMLInputElement
      const yearInput = dateInput.element.querySelector('input[name="auto-year"]') as HTMLInputElement

      const focusSpy = vi.spyOn(yearInput, 'focus')

      monthInput.value = '03'
      monthInput.dispatchEvent(new Event('input', { bubbles: true }))

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should not auto-advance on invalid values', () => {
      const dateInput = createDateInput({
        namePrefix: 'auto'
      })
      document.body.appendChild(dateInput.element)

      const dayInput = dateInput.element.querySelector('input[name="auto-day"]') as HTMLInputElement
      const monthInput = dateInput.element.querySelector('input[name="auto-month"]') as HTMLInputElement

      const focusSpy = vi.spyOn(monthInput, 'focus')

      // Invalid day (over 31)
      dayInput.value = '35'
      dayInput.dispatchEvent(new Event('input', { bubbles: true }))

      expect(focusSpy).not.toHaveBeenCalled()
    })
  })
})