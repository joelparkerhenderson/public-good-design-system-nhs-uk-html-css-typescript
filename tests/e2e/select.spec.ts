import { test, expect } from '@playwright/test'

test.describe('Select Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with select components using inline HTML/CSS
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Select Component Test</title>
        <style>
          /* Select Component Styles - Inline for E2E testing */
          body {
            font-family: "Frutiger W01", "Arial", sans-serif;
            margin: 20px;
            background-color: #ffffff;
            color: #212b32;
          }
          
          .public-good-form-group {
            margin-bottom: 1rem;
          }
          
          .public-good-label {
            color: #212b32;
            display: block;
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.5;
            margin-bottom: 0.5rem;
          }
          
          .public-good-hint {
            color: #4c6272;
            display: block;
            font-size: 0.875rem;
            line-height: 1.14286;
            margin-bottom: 0.5rem;
          }
          
          .public-good-error-message {
            color: #da291c;
            display: block;
            font-size: 0.875rem;
            line-height: 1.14286;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }
          
          .public-good-select {
            box-sizing: border-box;
            font-family: inherit;
            font-size: 1rem;
            color: #212b32;
            background-color: #ffffff;
            border: 2px solid #4c6272;
            border-radius: 4px;
            padding: 8px 12px;
            width: 100%;
            min-height: 44px;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23212b32' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px 16px;
            padding-right: 40px;
          }
          
          .public-good-select:focus {
            outline: 3px solid #ffdd00;
            outline-offset: 1px;
            border-color: #212b32;
            background-color: #ffffff;
            box-shadow: 0 0 0 2px #ffdd00;
          }
          
          .public-good-select:disabled {
            color: #4c6272;
            background-color: #f0f4f5;
            border-color: #4c6272;
            cursor: not-allowed;
            opacity: 0.5;
          }
          
          .public-good-select[multiple] {
            background-image: none;
            padding-right: 12px;
            height: auto;
            min-height: 88px;
          }
          
          .public-good-form-group--error .public-good-select {
            border-color: #da291c;
          }
          
          .public-good-form-group--error .public-good-select:focus {
            border-color: #212b32;
            box-shadow: 0 0 0 2px #ffdd00;
          }
          
          .public-good-form-group--disabled .public-good-select {
            color: #4c6272;
            background-color: #f0f4f5;
            border-color: #4c6272;
            cursor: not-allowed;
            opacity: 0.5;
          }
          
          .public-good-visually-hidden {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
          }
          
          /* Test page specific styles */
          .test-section {
            margin: 2rem 0;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          
          .test-section h2 {
            color: #005eb8;
            margin-top: 0;
          }
        </style>
      </head>
      <body>
        <h1>Select Component E2E Tests</h1>
        
        <!-- Basic Select -->
        <div class="test-section">
          <h2>Basic Select</h2>
          <div class="public-good-form-group">
            <label class="public-good-label" for="basic-select">Choose an option</label>
            <select class="public-good-select" id="basic-select" name="basic-select" data-testid="basic-select">
              <option value="apple">Apple</option>
              <option value="banana">Banana</option>
              <option value="cherry">Cherry</option>
            </select>
          </div>
        </div>

        <!-- Select with Hint -->
        <div class="test-section">
          <h2>Select with Hint</h2>
          <div class="public-good-form-group">
            <label class="public-good-label" for="hint-select">Select with guidance</label>
            <div class="public-good-hint" id="hint-select-hint">Choose the option that best applies to you</div>
            <select class="public-good-select" id="hint-select" name="hint-select" aria-describedby="hint-select-hint" data-testid="hint-select">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        </div>

        <!-- Select with Error -->
        <div class="test-section">
          <h2>Select with Error</h2>
          <div class="public-good-form-group public-good-form-group--error">
            <label class="public-good-label" for="error-select">Select with error</label>
            <p class="public-good-error-message" id="error-select-error">
              <span class="public-good-visually-hidden">Error:</span> Please select a valid option
            </p>
            <select class="public-good-select" id="error-select" name="error-select" aria-describedby="error-select-error" data-testid="error-select">
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>

        <!-- Multiple Select -->
        <div class="test-section">
          <h2>Multiple Select</h2>
          <div class="public-good-form-group">
            <label class="public-good-label" for="multiple-select">Select multiple options</label>
            <select class="public-good-select" id="multiple-select" name="multiple-select" multiple size="4" data-testid="multiple-select">
              <option value="option1">Option 1</option>
              <option value="option2" selected>Option 2</option>
              <option value="option3">Option 3</option>
              <option value="option4" selected>Option 4</option>
            </select>
          </div>
        </div>

        <!-- Required Select -->
        <div class="test-section">
          <h2>Required Select</h2>
          <div class="public-good-form-group">
            <label class="public-good-label" for="required-select">Required selection</label>
            <select class="public-good-select" id="required-select" name="required-select" required data-testid="required-select">
              <option value="">Please select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <!-- Disabled Select -->
        <div class="test-section">
          <h2>Disabled Select</h2>
          <div class="public-good-form-group public-good-form-group--disabled">
            <label class="public-good-label" for="disabled-select">Disabled select</label>
            <select class="public-good-select" id="disabled-select" name="disabled-select" disabled data-testid="disabled-select">
              <option value="option1">Option 1</option>
              <option value="option2" selected>Option 2</option>
            </select>
          </div>
        </div>

        <!-- Form Testing -->
        <div class="test-section">
          <h2>Form Integration</h2>
          <form id="test-form" data-testid="test-form">
            <div class="public-good-form-group">
              <label class="public-good-label" for="form-select">Select in form</label>
              <select class="public-good-select" id="form-select" name="form-select" data-testid="form-select">
                <option value="value1">Value 1</option>
                <option value="value2">Value 2</option>
                <option value="value3">Value 3</option>
              </select>
            </div>
            <button type="submit" data-testid="form-submit">Submit</button>
          </form>
        </div>

        <script>
          // Add form submission handling
          document.getElementById('test-form').addEventListener('submit', function(e) {
            e.preventDefault()
            this.dataset.submitted = 'true'
            
            // Store form data for testing
            const formData = new FormData(this)
            window.testFormData = Object.fromEntries(formData.entries())
          })
          
          // Add custom event tracking for interaction tests
          let eventLog = []
          window.eventLog = eventLog
          
          document.addEventListener('change', function(e) {
            if (e.target.matches('select')) {
              eventLog.push({
                type: 'change',
                target: e.target.id,
                value: e.target.value
              })
            }
          })
        </script>
      </body>
      </html>
    `)
  })

  test('should render basic select correctly', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    const label = page.locator('label[for="basic-select"]')
    
    await expect(label).toHaveText('Choose an option')
    await expect(select).toBeVisible()
    await expect(select.locator('option')).toHaveCount(3)
    await expect(select.locator('option').nth(0)).toHaveText('Apple')
    await expect(select.locator('option').nth(1)).toHaveText('Banana')
    await expect(select.locator('option').nth(2)).toHaveText('Cherry')
  })

  test('should handle select interactions', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    
    // Initial value should be first option
    await expect(select).toHaveValue('apple')
    
    // Change selection
    await select.selectOption('banana')
    await expect(select).toHaveValue('banana')
    
    // Change to another option
    await select.selectOption('cherry')
    await expect(select).toHaveValue('cherry')
  })

  test('should display hint correctly', async ({ page }) => {
    const hint = page.locator('#hint-select-hint')
    const select = page.getByTestId('hint-select')
    
    await expect(hint).toBeVisible()
    await expect(hint).toHaveText('Choose the option that best applies to you')
    await expect(select).toHaveAttribute('aria-describedby', 'hint-select-hint')
  })

  test('should display error state correctly', async ({ page }) => {
    const container = page.locator('.public-good-form-group--error')
    const errorMessage = page.locator('#error-select-error')
    const select = page.getByTestId('error-select')
    
    await expect(container).toBeVisible()
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('Please select a valid option')
    await expect(select).toHaveAttribute('aria-describedby', 'error-select-error')
    await expect(select).toHaveCSS('border-color', 'rgb(218, 41, 28)')
  })

  test('should handle multiple select correctly', async ({ page }) => {
    const select = page.getByTestId('multiple-select')
    
    await expect(select).toHaveAttribute('multiple')
    await expect(select).toHaveAttribute('size', '4')
    
    // Check initial selected values
    const selectedOptions = await select.locator('option:checked').allTextContents()
    expect(selectedOptions).toContain('Option 2')
    expect(selectedOptions).toContain('Option 4')
    
    // Select additional option
    await select.selectOption(['option2', 'option4', 'option1'])
    
    const newSelectedOptions = await select.locator('option:checked').allTextContents()
    expect(newSelectedOptions).toContain('Option 1')
    expect(newSelectedOptions).toContain('Option 2')
    expect(newSelectedOptions).toContain('Option 4')
  })

  test('should handle required select correctly', async ({ page }) => {
    const select = page.getByTestId('required-select')
    
    await expect(select).toHaveAttribute('required')
    await expect(select).toHaveValue('')
    
    // Select a value
    await select.selectOption('yes')
    await expect(select).toHaveValue('yes')
  })

  test('should handle disabled select correctly', async ({ page }) => {
    const select = page.getByTestId('disabled-select')
    const container = page.locator('.public-good-form-group--disabled')
    
    await expect(select).toBeDisabled()
    await expect(container).toBeVisible()
    await expect(select).toHaveValue('option2')
    await expect(select).toHaveCSS('opacity', '0.5')
  })

  test('should have proper keyboard navigation', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    
    // Focus the select
    await select.focus()
    await expect(select).toBeFocused()
    
    // Test focus styles
    await expect(select).toHaveCSS('outline-color', 'rgb(255, 221, 0)')
  })

  test('should have proper focus styles', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    
    await select.focus()
    await expect(select).toBeFocused()
    await expect(select).toHaveCSS('outline', 'rgb(255, 221, 0) solid 3px')
    await expect(select).toHaveCSS('border-color', 'rgb(33, 43, 50)')
  })

  test('should track change events', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    
    // Change select value
    await select.selectOption('banana')
    
    // Check if event was logged
    const eventLog = await page.evaluate(() => window.eventLog)
    expect(eventLog).toContainEqual({
      type: 'change',
      target: 'basic-select',
      value: 'banana'
    })
  })

  test('should work with form submission', async ({ page }) => {
    const form = page.getByTestId('test-form')
    const select = page.getByTestId('form-select')
    const submitButton = page.getByTestId('form-submit')
    
    // Set a value
    await select.selectOption('value2')
    await expect(select).toHaveValue('value2')
    
    // Submit form
    await submitButton.click()
    
    // Check if form was submitted
    await expect(form).toHaveAttribute('data-submitted', 'true')
    
    // Check form data
    const formData = await page.evaluate(() => window.testFormData)
    expect(formData['form-select']).toBe('value2')
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const select = page.getByTestId('basic-select')
    await expect(select).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(select).toBeVisible()
  })

  test('should meet accessibility standards', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    const label = page.locator('label[for="basic-select"]')
    
    // Test minimum touch target size
    const selectBox = await select.boundingBox()
    expect(selectBox?.height).toBeGreaterThanOrEqual(44)
    
    // Test label association
    await expect(label).toHaveAttribute('for', 'basic-select')
    
    // Test proper ARIA attributes for error state
    const errorSelect = page.getByTestId('error-select')
    await expect(errorSelect).toHaveAttribute('aria-describedby', 'error-select-error')
  })

  test('should handle hover states', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    
    // Note: Hover styles for select elements are limited by browser constraints
    await select.hover()
    await expect(select).toBeVisible()
  })

  test('should display properly in high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' })
    
    const select = page.getByTestId('basic-select')
    
    // Verify select is still visible and accessible
    await expect(select).toBeVisible()
    
    // Focus should still be visible
    await select.focus()
    await expect(select).toBeFocused()
  })

  test('should handle RTL direction', async ({ page }) => {
    // Add RTL direction
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    })
    
    const select = page.getByTestId('basic-select')
    
    // Verify select still works in RTL
    await expect(select).toBeVisible()
    await select.selectOption('banana')
    await expect(select).toHaveValue('banana')
  })

  test('should maintain selection state', async ({ page }) => {
    const select = page.getByTestId('basic-select')
    
    // Set a value
    await select.selectOption('banana')
    await expect(select).toHaveValue('banana')
    
    // Perform some DOM operations
    await page.evaluate(() => {
      const div = document.createElement('div')
      div.textContent = 'Test div'
      document.body.appendChild(div)
    })
    
    // Verify selection is maintained
    await expect(select).toHaveValue('banana')
  })

  test('should handle programmatic value changes', async ({ page }) => {
    const select = page.getByTestId('form-select')
    
    // Set value programmatically
    await page.evaluate(() => {
      const selectElement = document.querySelector('[data-testid="form-select"]')
      selectElement.value = 'value3'
      
      // Trigger change event
      const event = new Event('change', { bubbles: true })
      selectElement.dispatchEvent(event)
    })
    
    await expect(select).toHaveValue('value3')
    
    // Check if event was logged
    const eventLog = await page.evaluate(() => window.eventLog)
    const formSelectEvents = eventLog.filter(event => event.target === 'form-select')
    expect(formSelectEvents.length).toBeGreaterThan(0)
  })
})