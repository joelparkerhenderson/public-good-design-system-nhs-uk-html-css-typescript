/**
 * Checkboxes Component E2E Tests
 * End-to-end tests for the checkboxes component
 */

import { test, expect } from '@playwright/test'

declare global {
  interface Window {
    checkboxesEvents?: any[]
    testCheckboxes?: any
  }
}

test.describe('Checkboxes Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with checkboxes
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Checkboxes Component Test</title>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="test-container"></div>
        <script type="module">
          import { createCheckboxes, createFieldsetCheckboxes, createSimpleCheckboxes } from '/src/components/checkboxes/checkboxes.ts'
          
          const container = document.getElementById('test-container')
          
          // Basic checkboxes
          const basicCheckboxes = createCheckboxes({
            name: 'nationality',
            fieldset: {
              legend: {
                text: 'What is your nationality?'
              }
            },
            hint: {
              text: 'Select all that apply'
            },
            items: [
              { value: 'british', text: 'British' },
              { value: 'irish', text: 'Irish' },
              { value: 'other', text: 'Citizen of another country' }
            ]
          })
          container.appendChild(basicCheckboxes.element)
          
          // Checkboxes with conditional content
          const conditionalCheckboxes = createCheckboxes({
            name: 'contact',
            fieldset: {
              legend: {
                text: 'How would you prefer to be contacted?'
              }
            },
            items: [
              {
                value: 'email',
                text: 'Email',
                conditional: {
                  html: '<label for="email-input">Email address</label><input id="email-input" type="email" placeholder="Enter your email">'
                }
              },
              {
                value: 'phone',
                text: 'Phone',
                conditional: {
                  html: '<label for="phone-input">Phone number</label><input id="phone-input" type="tel" placeholder="Enter your phone">'
                }
              },
              { value: 'post', text: 'Post' }
            ]
          })
          container.appendChild(conditionalCheckboxes.element)
          
          // Checkboxes with exclusive behavior
          const exclusiveCheckboxes = createCheckboxes({
            name: 'communication',
            fieldset: {
              legend: {
                text: 'How do you want to sign in?'
              }
            },
            items: [
              { value: 'gateway', text: 'Government Gateway' },
              { value: 'login', text: 'NHS.UK login' },
              { divider: 'or' },
              { value: 'none', text: 'None of the above', exclusive: true }
            ]
          })
          container.appendChild(exclusiveCheckboxes.element)
          
          // Checkboxes with hints
          const hintCheckboxes = createCheckboxes({
            name: 'waste',
            fieldset: {
              legend: {
                text: 'Which types of waste do you transport regularly?'
              }
            },
            items: [
              { 
                value: 'animal', 
                text: 'Waste from animal carcasses',
                hint: {
                  text: 'Including farm animals and pets'
                }
              },
              { 
                value: 'mines', 
                text: 'Waste from mines or quarries',
                hint: {
                  text: 'Including excavated materials'
                }
              },
              { value: 'farm', text: 'Farm or agricultural waste' }
            ]
          })
          container.appendChild(hintCheckboxes.element)
          
          // Checkboxes with error state
          const errorCheckboxes = createCheckboxes({
            name: 'required',
            fieldset: {
              legend: {
                text: 'Which services do you need?'
              }
            },
            errorMessage: {
              text: 'Select at least one service'
            },
            items: [
              { value: 'service1', text: 'Service 1' },
              { value: 'service2', text: 'Service 2' },
              { value: 'service3', text: 'Service 3' }
            ]
          })
          container.appendChild(errorCheckboxes.element)
          
          // Store for testing
          window.testCheckboxes = {
            basic: basicCheckboxes,
            conditional: conditionalCheckboxes,
            exclusive: exclusiveCheckboxes,
            hint: hintCheckboxes,
            error: errorCheckboxes
          }
          
          // Event tracking
          window.checkboxesEvents = []
          document.addEventListener('public-good:checkboxes:change', (event) => {
            window.checkboxesEvents.push(event.detail)
          })
        </script>
      </body>
      </html>
    `)
  })

  test('should render all checkbox groups correctly', async ({ page }) => {
    // Check basic checkboxes
    const basicFieldset = page.locator('fieldset').first()
    await expect(basicFieldset.locator('legend')).toContainText('What is your nationality?')
    await expect(basicFieldset.locator('.public-good-hint')).toContainText('Select all that apply')
    await expect(basicFieldset.locator('input[type="checkbox"]')).toHaveCount(3)

    // Check conditional checkboxes
    const conditionalFieldset = page.locator('fieldset').nth(1)
    await expect(conditionalFieldset.locator('legend')).toContainText('How would you prefer to be contacted?')
    await expect(conditionalFieldset.locator('input[type="checkbox"]')).toHaveCount(3)

    // Check exclusive checkboxes
    const exclusiveFieldset = page.locator('fieldset').nth(2)
    await expect(exclusiveFieldset.locator('legend')).toContainText('How do you want to sign in?')
    await expect(exclusiveFieldset.locator('.public-good-checkboxes__divider')).toContainText('or')

    // Check hint checkboxes
    const hintFieldset = page.locator('fieldset').nth(3)
    await expect(hintFieldset.locator('.public-good-checkboxes__hint')).toHaveCount(2)

    // Check error checkboxes
    const errorFormGroup = page.locator('.public-good-form-group--error')
    await expect(errorFormGroup).toBeVisible()
    await expect(errorFormGroup.locator('.public-good-error-message')).toContainText('Select at least one service')
  })

  test('should handle checkbox selection and deselection', async ({ page }) => {
    const basicCheckbox = page.locator('input[value="british"]')
    
    // Initially unchecked
    await expect(basicCheckbox).not.toBeChecked()
    
    // Check the checkbox
    await basicCheckbox.check()
    await expect(basicCheckbox).toBeChecked()
    
    // Uncheck the checkbox
    await basicCheckbox.uncheck()
    await expect(basicCheckbox).not.toBeChecked()
  })

  test('should handle multiple selections', async ({ page }) => {
    const british = page.locator('input[value="british"]')
    const irish = page.locator('input[value="irish"]')
    const other = page.locator('input[value="other"]')
    
    // Select multiple options
    await british.check()
    await irish.check()
    
    await expect(british).toBeChecked()
    await expect(irish).toBeChecked()
    await expect(other).not.toBeChecked()
    
    // Get values programmatically
    const values = await page.evaluate(() => window.testCheckboxes?.basic.getValues())
    expect(values).toEqual(['british', 'irish'])
  })

  test('should reveal and hide conditional content', async ({ page }) => {
    const emailCheckbox = page.locator('input[value="email"]')
    const phoneCheckbox = page.locator('input[value="phone"]')
    
    // Initially all conditional content should be hidden
    const emailConditional = page.locator('#conditional-email')
    const phoneConditional = page.locator('#conditional-phone')
    
    await expect(emailConditional).toHaveClass(/public-good-checkboxes__conditional--hidden/)
    await expect(phoneConditional).toHaveClass(/public-good-checkboxes__conditional--hidden/)
    
    // Check email - should reveal email conditional
    await emailCheckbox.check()
    await expect(emailConditional).not.toHaveClass(/public-good-checkboxes__conditional--hidden/)
    await expect(phoneConditional).toHaveClass(/public-good-checkboxes__conditional--hidden/)
    
    // Check phone - should reveal phone conditional
    await phoneCheckbox.check()
    await expect(emailConditional).not.toHaveClass(/public-good-checkboxes__conditional--hidden/)
    await expect(phoneConditional).not.toHaveClass(/public-good-checkboxes__conditional--hidden/)
    
    // Uncheck email - should hide email conditional
    await emailCheckbox.uncheck()
    await expect(emailConditional).toHaveClass(/public-good-checkboxes__conditional--hidden/)
    await expect(phoneConditional).not.toHaveClass(/public-good-checkboxes__conditional--hidden/)
  })

  test('should handle exclusive checkbox behavior', async ({ page }) => {
    const gateway = page.locator('input[value="gateway"]')
    const login = page.locator('input[value="login"]')
    const none = page.locator('input[value="none"]')
    
    // Select regular options
    await gateway.check()
    await login.check()
    
    await expect(gateway).toBeChecked()
    await expect(login).toBeChecked()
    await expect(none).not.toBeChecked()
    
    // Select exclusive option - should uncheck others
    await none.check()
    
    await expect(gateway).not.toBeChecked()
    await expect(login).not.toBeChecked()
    await expect(none).toBeChecked()
    
    // Select regular option again - should uncheck exclusive
    await gateway.check()
    
    await expect(gateway).toBeChecked()
    await expect(login).not.toBeChecked()
    await expect(none).not.toBeChecked()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    const firstCheckbox = page.locator('input[value="british"]')
    
    // Focus and activate with keyboard
    await firstCheckbox.focus()
    await expect(firstCheckbox).toBeFocused()
    
    // Press space to toggle
    await page.keyboard.press('Space')
    await expect(firstCheckbox).toBeChecked()
    
    // Press space again to untoggle
    await page.keyboard.press('Space')
    await expect(firstCheckbox).not.toBeChecked()
  })

  test('should handle hint text accessibility', async ({ page }) => {
    const animalCheckbox = page.locator('input[value="animal"]')
    const minesCheckbox = page.locator('input[value="mines"]')
    
    // Check aria-describedby attributes
    const animalDescribedBy = await animalCheckbox.getAttribute('aria-describedby')
    const minesDescribedBy = await minesCheckbox.getAttribute('aria-describedby')
    
    expect(animalDescribedBy).toBeTruthy()
    expect(minesDescribedBy).toBeTruthy()
    
    // Check that hint elements exist with correct IDs
    const animalHint = page.locator(`#${animalDescribedBy}`)
    const minesHint = page.locator(`#${minesDescribedBy}`)
    
    await expect(animalHint).toContainText('Including farm animals and pets')
    await expect(minesHint).toContainText('Including excavated materials')
  })

  test('should handle error state styling', async ({ page }) => {
    const errorFormGroup = page.locator('.public-good-form-group--error')
    
    await expect(errorFormGroup).toBeVisible()
    await expect(errorFormGroup).toHaveClass(/public-good-form-group--error/)
    
    const errorMessage = errorFormGroup.locator('.public-good-error-message')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('Select at least one service')
  })

  test('should emit analytics events', async ({ page }) => {
    const british = page.locator('input[value="british"]')
    const irish = page.locator('input[value="irish"]')
    
    // Check some boxes
    await british.check()
    await irish.check()
    
    // Check events were emitted
    const events = await page.evaluate(() => window.checkboxesEvents)
    expect(events).toBeTruthy()
    expect(events!).toHaveLength(2)
    
    expect(events![0]).toMatchObject({
      name: 'nationality',
      value: 'british',
      checked: true,
      values: ['british']
    })
    
    expect(events![1]).toMatchObject({
      name: 'nationality',
      value: 'irish',
      checked: true,
      values: ['british', 'irish']
    })
  })

  test('should work with screen readers', async ({ page }) => {
    // Check fieldset and legend structure
    const fieldset = page.locator('fieldset').first()
    const legend = fieldset.locator('legend')
    
    await expect(fieldset).toHaveAttribute('role', 'group')
    await expect(legend).toBeVisible()
    
    // Check label associations
    const britishCheckbox = page.locator('input[value="british"]')
    const britishLabel = page.locator('label[for="nationality"]')
    
    const checkboxId = await britishCheckbox.getAttribute('id')
    const labelFor = await britishLabel.getAttribute('for')
    
    expect(checkboxId).toBeTruthy()
    expect(labelFor).toBe(checkboxId)
  })

  test('should handle conditional content keyboard navigation', async ({ page }) => {
    const emailCheckbox = page.locator('input[value="email"]')
    
    // Check the email option to reveal conditional content
    await emailCheckbox.check()
    
    // The conditional input should be accessible
    const emailInput = page.locator('#email-input')
    await expect(emailInput).toBeVisible()
    
    // Should be able to focus and type in the conditional input
    await emailInput.focus()
    await expect(emailInput).toBeFocused()
    
    await emailInput.fill('test@example.com')
    await expect(emailInput).toHaveValue('test@example.com')
  })

  test('should handle programmatic value changes', async ({ page }) => {
    // Set values programmatically
    await page.evaluate(() => {
      window.testCheckboxes?.basic.setValues(['british', 'irish'])
    })
    
    // Check that UI reflects the changes
    const british = page.locator('input[value="british"]')
    const irish = page.locator('input[value="irish"]')
    const other = page.locator('input[value="other"]')
    
    await expect(british).toBeChecked()
    await expect(irish).toBeChecked()
    await expect(other).not.toBeChecked()
    
    // Clear all values
    await page.evaluate(() => {
      window.testCheckboxes?.basic.uncheckAll()
    })
    
    await expect(british).not.toBeChecked()
    await expect(irish).not.toBeChecked()
    await expect(other).not.toBeChecked()
    
    // Check all values
    await page.evaluate(() => {
      window.testCheckboxes?.basic.checkAll()
    })
    
    await expect(british).toBeChecked()
    await expect(irish).toBeChecked()
    await expect(other).toBeChecked()
  })

  test('should render correctly on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // All fieldsets should be visible and stacked
    const fieldsets = page.locator('fieldset')
    const fieldsetCount = await fieldsets.count()
    
    for (let i = 0; i < fieldsetCount; i++) {
      await expect(fieldsets.nth(i)).toBeVisible()
    }
    
    // Check that checkboxes maintain proper touch target size
    const checkboxes = page.locator('input[type="checkbox"]')
    const firstCheckbox = checkboxes.first()
    const boundingBox = await firstCheckbox.boundingBox()
    
    expect(boundingBox?.width).toBeGreaterThanOrEqual(44)
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
  })

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' })
    
    const checkboxes = page.locator('input[type="checkbox"]')
    const checkboxCount = await checkboxes.count()
    
    // All checkboxes should remain visible and accessible
    for (let i = 0; i < checkboxCount; i++) {
      await expect(checkboxes.nth(i)).toBeVisible()
    }
    
    // Focus indicators should be visible
    const firstCheckbox = checkboxes.first()
    await firstCheckbox.focus()
    await expect(firstCheckbox).toBeFocused()
  })

  test('should handle validation', async ({ page }) => {
    // Test validation method
    const isValid = await page.evaluate(() => {
      return window.testCheckboxes?.error.validate()
    })
    
    expect(isValid).toBe(false)
    
    // Select an option and validate again
    const service1 = page.locator('input[value="service1"]')
    await service1.check()
    
    const isValidAfter = await page.evaluate(() => {
      return window.testCheckboxes?.error.validate()
    })
    
    expect(isValidAfter).toBe(true)
  })

  test('should handle disabled checkboxes', async ({ page }) => {
    // Add a disabled checkbox programmatically for testing
    await page.evaluate(() => {
      const disabledCheckboxes = window.testCheckboxes?.basic.element.querySelectorAll('input[type="checkbox"]')
      if (disabledCheckboxes && disabledCheckboxes[2]) {
        disabledCheckboxes[2].disabled = true
      }
    })
    
    const disabledCheckbox = page.locator('input[value="other"]')
    
    await expect(disabledCheckbox).toBeDisabled()
    
    // Should not be able to check disabled checkbox
    await disabledCheckbox.click({ force: true })
    await expect(disabledCheckbox).not.toBeChecked()
  })
})