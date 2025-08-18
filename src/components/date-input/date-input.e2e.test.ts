/**
 * Date Input Component E2E Tests
 * End-to-end tests for the date input component
 */

import { test, expect } from '@playwright/test'

declare global {
  interface Window {
    dateInputEvents?: any[]
    testDateInputs?: any
  }
}

test.describe('Date Input Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with date inputs
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Date Input Component Test</title>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="test-container"></div>
        <script type="module">
          import { createDateInput, createSimpleDateInput, createDateInputWithError } from '/src/components/date-input/date-input.ts'
          
          const container = document.getElementById('test-container')
          
          // Basic date input
          const basicDateInput = createDateInput({
            namePrefix: 'basic-date',
            fieldset: {
              legend: {
                text: 'What is your date of birth?'
              }
            },
            hint: {
              text: 'For example, 27 3 2007'
            }
          })
          container.appendChild(basicDateInput.element)
          
          // Date input with initial values
          const prefilledDateInput = createDateInput({
            namePrefix: 'prefilled-date',
            fieldset: {
              legend: {
                text: 'Registration date'
              }
            },
            value: {
              day: '15',
              month: '03',
              year: '1984'
            }
          })
          container.appendChild(prefilledDateInput.element)
          
          // Date input with error state
          const errorDateInput = createDateInputWithError(
            'error-date',
            'When did this happen?',
            'Enter the date this happened'
          )
          container.appendChild(errorDateInput.element)
          
          // Simple date input
          const simpleDateInput = createSimpleDateInput(
            'simple-date',
            'Select a date'
          )
          container.appendChild(simpleDateInput.element)
          
          // Store for testing
          window.testDateInputs = {
            basic: basicDateInput,
            prefilled: prefilledDateInput,
            error: errorDateInput,
            simple: simpleDateInput
          }
          
          // Event tracking
          window.dateInputEvents = []
          document.addEventListener('public-good:date-input:change', (event) => {
            window.dateInputEvents.push(event.detail)
          })
        </script>
      </body>
      </html>
    `)
  })

  test('should render all date input groups correctly', async ({ page }) => {
    // Check basic date input
    const basicFieldset = page.locator('fieldset').first()
    await expect(basicFieldset.locator('legend')).toContainText('What is your date of birth?')
    await expect(basicFieldset.locator('.public-good-hint')).toContainText('For example, 27 3 2007')
    await expect(basicFieldset.locator('input[type="text"]')).toHaveCount(3)

    // Check that all inputs have correct attributes
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    await expect(dayInput).toHaveAttribute('inputmode', 'numeric')
    await expect(dayInput).toHaveAttribute('maxlength', '2')
    await expect(monthInput).toHaveAttribute('inputmode', 'numeric')
    await expect(monthInput).toHaveAttribute('maxlength', '2')
    await expect(yearInput).toHaveAttribute('inputmode', 'numeric')
    await expect(yearInput).toHaveAttribute('maxlength', '4')
  })

  test('should display prefilled values correctly', async ({ page }) => {
    const dayInput = page.locator('input[name="prefilled-date-day"]')
    const monthInput = page.locator('input[name="prefilled-date-month"]')
    const yearInput = page.locator('input[name="prefilled-date-year"]')

    await expect(dayInput).toHaveValue('15')
    await expect(monthInput).toHaveValue('03')
    await expect(yearInput).toHaveValue('1984')
  })

  test('should handle user input correctly', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    // Enter a complete date
    await dayInput.fill('27')
    await monthInput.fill('03')
    await yearInput.fill('2007')

    await expect(dayInput).toHaveValue('27')
    await expect(monthInput).toHaveValue('03')
    await expect(yearInput).toHaveValue('2007')
  })

  test('should auto-advance between fields on valid input', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    // Focus day input and enter valid day
    await dayInput.focus()
    await dayInput.type('15')

    // Month input should be focused
    await expect(monthInput).toBeFocused()

    // Enter valid month
    await monthInput.type('03')

    // Year input should be focused
    await expect(yearInput).toBeFocused()
  })

  test('should not auto-advance on invalid input', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')

    // Focus day input and enter invalid day
    await dayInput.focus()
    await dayInput.type('35') // Invalid day

    // Month input should NOT be focused
    await expect(dayInput).toBeFocused()
    await expect(monthInput).not.toBeFocused()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    // Focus first input
    await dayInput.focus()
    await expect(dayInput).toBeFocused()

    // Tab to next input
    await page.keyboard.press('Tab')
    await expect(monthInput).toBeFocused()

    // Tab to next input
    await page.keyboard.press('Tab')
    await expect(yearInput).toBeFocused()

    // Shift+Tab back
    await page.keyboard.press('Shift+Tab')
    await expect(monthInput).toBeFocused()
  })

  test('should display error state correctly', async ({ page }) => {
    const errorFormGroup = page.locator('.public-good-form-group--error').first()
    
    await expect(errorFormGroup).toBeVisible()
    await expect(errorFormGroup).toHaveClass(/public-good-form-group--error/)
    
    const errorMessage = errorFormGroup.locator('.public-good-error-message')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('Enter the date this happened')

    // All inputs should have error styling
    const errorInputs = errorFormGroup.locator('input.public-good-input--error')
    await expect(errorInputs).toHaveCount(3)
  })

  test('should handle paste events with formatted dates', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')

    // Focus the day input
    await dayInput.focus()

    // Simulate paste event (we'll test the result by checking if auto-fill worked)
    await page.evaluate(() => {
      const input = document.querySelector('input[name="basic-date-day"]') as HTMLInputElement
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer()
      })
      pasteEvent.clipboardData!.setData('text/plain', '15/03/1984')
      input.dispatchEvent(pasteEvent)
    })

    // Check that all fields were filled
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    await expect(dayInput).toHaveValue('15')
    await expect(monthInput).toHaveValue('03')
    await expect(yearInput).toHaveValue('1984')
  })

  test('should emit analytics events', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')

    // Enter values
    await dayInput.fill('15')
    await monthInput.fill('03')

    // Check events were emitted
    const events = await page.evaluate(() => window.dateInputEvents)
    expect(events).toBeTruthy()
    expect(events!).toHaveLength(2)

    expect(events![0]).toMatchObject({
      namePrefix: 'basic-date',
      field: 'day',
      value: '15'
    })

    expect(events![1]).toMatchObject({
      namePrefix: 'basic-date',
      field: 'month',
      value: '03'
    })
  })

  test('should work with screen readers', async ({ page }) => {
    // Check fieldset and legend structure
    const fieldset = page.locator('fieldset').first()
    const legend = fieldset.locator('legend')
    
    await expect(fieldset).toHaveAttribute('role', 'group')
    await expect(legend).toBeVisible()
    
    // Check label associations
    const dayLabel = page.locator('label[for="basic-date-day"]')
    
    await expect(dayLabel).toBeVisible()
    await expect(dayLabel).toContainText('Day')

    // Check aria-describedby
    const dateInputContainer = page.locator('.public-good-date-input').first()
    const describedBy = await dateInputContainer.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()

    const hintElement = page.locator('.public-good-hint').first()
    const hintId = await hintElement.getAttribute('id')
    expect(describedBy).toContain(hintId!)
  })

  test('should handle validation correctly', async ({ page }) => {
    // Test validation method
    const isValid = await page.evaluate(() => {
      return window.testDateInputs?.basic.validate()
    })
    
    expect(isValid).toBe(false) // Empty inputs should be invalid

    // Fill valid date
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    await dayInput.fill('15')
    await monthInput.fill('03')
    await yearInput.fill('1984')

    const isValidAfter = await page.evaluate(() => {
      return window.testDateInputs?.basic.validate()
    })

    expect(isValidAfter).toBe(true)
  })

  test('should handle invalid dates', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    // Fill invalid date (Feb 30)
    await dayInput.fill('30')
    await monthInput.fill('02')
    await yearInput.fill('2021')

    const isValid = await page.evaluate(() => {
      return window.testDateInputs?.basic.validate()
    })

    expect(isValid).toBe(false)
  })

  test('should handle leap year validation', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    // Valid leap year date (Feb 29, 2020)
    await dayInput.fill('29')
    await monthInput.fill('02')
    await yearInput.fill('2020')

    const isValidLeap = await page.evaluate(() => {
      return window.testDateInputs?.basic.validate()
    })

    expect(isValidLeap).toBe(true)

    // Invalid leap year date (Feb 29, 2021)
    await yearInput.fill('2021')

    const isValidNonLeap = await page.evaluate(() => {
      return window.testDateInputs?.basic.validate()
    })

    expect(isValidNonLeap).toBe(false)
  })

  test('should handle programmatic value changes', async ({ page }) => {
    // Set values programmatically
    await page.evaluate(() => {
      window.testDateInputs?.basic.setValues({
        day: '25',
        month: '12',
        year: '2023'
      })
    })

    // Check that UI reflects the changes
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    await expect(dayInput).toHaveValue('25')
    await expect(monthInput).toHaveValue('12')
    await expect(yearInput).toHaveValue('2023')

    // Clear values
    await page.evaluate(() => {
      window.testDateInputs?.basic.clear()
    })

    await expect(dayInput).toHaveValue('')
    await expect(monthInput).toHaveValue('')
    await expect(yearInput).toHaveValue('')
  })

  test('should handle Date object conversion', async ({ page }) => {
    // Set date from Date object
    await page.evaluate(() => {
      const testDate = new Date(1984, 2, 15) // March 15, 1984
      window.testDateInputs?.basic.setDate(testDate)
    })

    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    await expect(dayInput).toHaveValue('15')
    await expect(monthInput).toHaveValue('03')
    await expect(yearInput).toHaveValue('1984')

    // Get date back
    const retrievedDate = await page.evaluate(() => {
      const date = window.testDateInputs?.basic.getDate()
      return date ? {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      } : null
    })

    expect(retrievedDate).toEqual({
      day: 15,
      month: 2, // 0-indexed
      year: 1984
    })
  })

  test('should handle enable/disable state', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')
    const monthInput = page.locator('input[name="basic-date-month"]')
    const yearInput = page.locator('input[name="basic-date-year"]')

    // Disable inputs
    await page.evaluate(() => {
      window.testDateInputs?.basic.disable()
    })

    await expect(dayInput).toBeDisabled()
    await expect(monthInput).toBeDisabled()
    await expect(yearInput).toBeDisabled()

    // Enable inputs
    await page.evaluate(() => {
      window.testDateInputs?.basic.enable()
    })

    await expect(dayInput).toBeEnabled()
    await expect(monthInput).toBeEnabled()
    await expect(yearInput).toBeEnabled()
  })

  test('should render correctly on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // All fieldsets should be visible and stacked
    const fieldsets = page.locator('fieldset')
    const fieldsetCount = await fieldsets.count()

    for (let i = 0; i < fieldsetCount; i++) {
      await expect(fieldsets.nth(i)).toBeVisible()
    }

    // Check that inputs maintain proper touch target size
    const inputs = page.locator('input[type="text"]')
    const firstInput = inputs.first()
    const boundingBox = await firstInput.boundingBox()

    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
  })

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' })

    const inputs = page.locator('input[type="text"]')
    const inputCount = await inputs.count()

    // All inputs should remain visible and accessible
    for (let i = 0; i < inputCount; i++) {
      await expect(inputs.nth(i)).toBeVisible()
    }

    // Focus indicators should be visible
    const firstInput = inputs.first()
    await firstInput.focus()
    await expect(firstInput).toBeFocused()
  })

  test('should handle error state management', async ({ page }) => {
    // Set error programmatically
    await page.evaluate(() => {
      window.testDateInputs?.basic.setError('Please enter your date of birth')
    })

    const formGroup = page.locator('.public-good-form-group').first()
    await expect(formGroup).toHaveClass(/public-good-form-group--error/)

    const errorMessage = formGroup.locator('.public-good-error-message')
    await expect(errorMessage).toContainText('Please enter your date of birth')

    // Clear error
    await page.evaluate(() => {
      window.testDateInputs?.basic.clearError()
    })

    await expect(formGroup).not.toHaveClass(/public-good-form-group--error/)
    await expect(errorMessage).not.toBeVisible()
  })

  test('should handle focus management', async ({ page }) => {
    // Focus first input programmatically
    await page.evaluate(() => {
      window.testDateInputs?.basic.focus()
    })

    const dayInput = page.locator('input[name="basic-date-day"]')
    await expect(dayInput).toBeFocused()
  })

  test('should handle numeric input restrictions', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')

    // Try to type non-numeric characters
    await dayInput.focus()
    await dayInput.type('abc15def')

    // Should only contain numeric characters (browser behavior may vary)
    const value = await dayInput.inputValue()
    expect(value).toMatch(/^\d*$/)
  })

  test('should handle field validation on blur', async ({ page }) => {
    const dayInput = page.locator('input[name="basic-date-day"]')

    // Enter invalid day and blur
    await dayInput.focus()
    await dayInput.fill('35')
    await dayInput.blur()

    // Field should be validated (implementation specific behavior)
    const value = await dayInput.inputValue()
    expect(value).toBe('35') // Input still contains the value but validation may show error
  })
})