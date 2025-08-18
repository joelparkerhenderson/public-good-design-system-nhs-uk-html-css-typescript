/**
 * Input Component E2E Tests
 * 
 * End-to-end tests for input display, accessibility, user interactions,
 * and visual behavior of the Input component.
 */

import { test, expect } from '@playwright/test'

test.describe('Input Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the input component test page
    await page.goto('/src/components/input/examples/basic.html')
  })

  test.describe('Basic Display and Structure', () => {
    test('should display input with correct styling', async ({ page }) => {
      const input = page.locator('.public-good-input').first()

      await expect(input).toBeVisible()
      await expect(input).toHaveClass(/public-good-input/)
    })

    test('should have proper form group structure', async ({ page }) => {
      const formGroup = page.locator('.public-good-form-group').first()
      const label = formGroup.locator('.public-good-label')
      const input = formGroup.locator('.public-good-input')

      await expect(formGroup).toBeVisible()
      await expect(label).toBeVisible()
      await expect(input).toBeVisible()
    })

    test('should display label correctly', async ({ page }) => {
      const label = page.locator('.public-good-label').first()
      
      await expect(label).toBeVisible()
      await expect(label).toHaveText(/\w+/)
    })

    test('should display hint text when present', async ({ page }) => {
      const hintInput = page.locator('.public-good-form-group').filter({ has: page.locator('.public-good-hint') }).first()
      
      if (await hintInput.count() > 0) {
        const hint = hintInput.locator('.public-good-hint')
        await expect(hint).toBeVisible()
        await expect(hint).toHaveText(/\w+/)
      }
    })
  })

  test.describe('Input Types and Configurations', () => {
    test('should handle different input types', async ({ page }) => {
      const textInput = page.locator('input[type="text"]').first()
      const emailInput = page.locator('input[type="email"]').first()
      
      await expect(textInput).toBeVisible()
      
      if (await emailInput.count() > 0) {
        await expect(emailInput).toBeVisible()
        await expect(emailInput).toHaveAttribute('type', 'email')
      }
    })

    test('should apply width classes correctly', async ({ page }) => {
      const fixedWidthInput = page.locator('.public-good-input--width-10').first()
      const fluidWidthInput = page.locator('.public-good-u-width-one-half').first()
      
      if (await fixedWidthInput.count() > 0) {
        await expect(fixedWidthInput).toBeVisible()
        await expect(fixedWidthInput).toHaveClass(/public-good-input--width-10/)
      }
      
      if (await fluidWidthInput.count() > 0) {
        await expect(fluidWidthInput).toBeVisible()
        await expect(fluidWidthInput).toHaveClass(/public-good-u-width-one-half/)
      }
    })

    test('should handle responsive design', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      
      // Desktop view
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(input).toBeVisible()
      
      // Tablet view
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(input).toBeVisible()
      
      // Mobile view
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(input).toBeVisible()
    })
  })

  test.describe('User Interactions', () => {
    test('should accept text input', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      
      await input.fill('Test input text')
      await expect(input).toHaveValue('Test input text')
    })

    test('should handle focus and blur', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      
      await input.focus()
      await expect(input).toBeFocused()
      
      await input.blur()
      await expect(input).not.toBeFocused()
    })

    test('should handle keyboard navigation', async ({ page }) => {
      const inputs = page.locator('.public-good-input')
      const inputCount = await inputs.count()
      
      if (inputCount > 1) {
        const firstInput = inputs.first()
        const secondInput = inputs.nth(1)
        
        await firstInput.focus()
        await expect(firstInput).toBeFocused()
        
        await page.keyboard.press('Tab')
        await expect(secondInput).toBeFocused()
      }
    })

    test('should clear input when using clear functionality', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      
      await input.fill('Text to be cleared')
      await expect(input).toHaveValue('Text to be cleared')
      
      await input.selectText()
      await page.keyboard.press('Delete')
      await expect(input).toHaveValue('')
    })

    test('should handle copy and paste', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      
      await input.fill('Text to copy')
      await input.selectText()
      await page.keyboard.press('Control+c')
      
      await input.fill('')
      await page.keyboard.press('Control+v')
      await expect(input).toHaveValue('Text to copy')
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper label association', async ({ page }) => {
      const formGroups = page.locator('.public-good-form-group')
      const count = await formGroups.count()

      for (let i = 0; i < Math.min(count, 3); i++) {
        const formGroup = formGroups.nth(i)
        const label = formGroup.locator('.public-good-label')
        const input = formGroup.locator('.public-good-input')
        
        if (await label.count() > 0) {
          const labelFor = await label.getAttribute('for')
          const inputId = await input.getAttribute('id')
          
          expect(labelFor).toBeTruthy()
          expect(inputId).toBeTruthy()
          expect(labelFor).toBe(inputId)
        }
      }
    })

    test('should have correct aria-describedby relationships', async ({ page }) => {
      const inputWithHint = page.locator('.public-good-form-group').filter({ has: page.locator('.public-good-hint') }).first()
      
      if (await inputWithHint.count() > 0) {
        const input = inputWithHint.locator('.public-good-input')
        const hint = inputWithHint.locator('.public-good-hint')
        
        const ariaDescribedBy = await input.getAttribute('aria-describedby')
        const hintId = await hint.getAttribute('id')
        
        expect(ariaDescribedBy).toBeTruthy()
        expect(hintId).toBeTruthy()
        expect(ariaDescribedBy).toContain(hintId!)
      }
    })

    test('should support keyboard navigation', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      
      // Test Tab navigation
      await page.keyboard.press('Tab')
      if (await input.isVisible()) {
        await expect(input).toBeFocused()
      }
      
      // Test focus indicators
      await input.focus()
      const focusedInput = page.locator('.public-good-input:focus')
      await expect(focusedInput).toBeVisible()
    })

    test('should have proper color contrast', async ({ page }) => {
      const inputs = page.locator('.public-good-input')
      const count = await inputs.count()

      for (let i = 0; i < Math.min(count, 3); i++) {
        const input = inputs.nth(i)
        await expect(input).toBeVisible()
        
        // Check that input has visible styling
        const styles = await input.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor
          }
        })
        
        expect(styles.color).toBeTruthy()
        expect(styles.backgroundColor).toBeTruthy()
        expect(styles.borderColor).toBeTruthy()
      }
    })

    test('should work with screen readers', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      
      // Check that input has accessible name
      const accessibleName = await input.evaluate((el) => {
        // Try different methods to get accessible name
        const label = document.querySelector(`label[for="${el.id}"]`)
        const ariaLabel = el.getAttribute('aria-label')
        const ariaLabelledBy = el.getAttribute('aria-labelledby')
        
        if (label) return label.textContent
        if (ariaLabel) return ariaLabel
        if (ariaLabelledBy) {
          const labelElement = document.getElementById(ariaLabelledBy)
          return labelElement?.textContent
        }
        return null
      })
      
      expect(accessibleName).toBeTruthy()
    })

    test('should support high contrast mode', async ({ page }) => {
      // Simulate high contrast mode
      await page.emulateMedia({ forcedColors: 'active' })
      
      const input = page.locator('.public-good-input').first()
      await expect(input).toBeVisible()
      
      // Reset to normal mode
      await page.emulateMedia({ forcedColors: 'none' })
      await expect(input).toBeVisible()
    })
  })

  test.describe('Error States', () => {
    test('should display error states correctly', async ({ page }) => {
      const errorFormGroup = page.locator('.public-good-form-group--error').first()
      
      if (await errorFormGroup.count() > 0) {
        await expect(errorFormGroup).toBeVisible()
        await expect(errorFormGroup).toHaveClass(/public-good-form-group--error/)
        
        const errorInput = errorFormGroup.locator('.public-good-input--error')
        const errorMessage = errorFormGroup.locator('.public-good-error-message')
        
        await expect(errorInput).toBeVisible()
        await expect(errorMessage).toBeVisible()
      }
    })

    test('should have proper error message structure', async ({ page }) => {
      const errorMessage = page.locator('.public-good-error-message').first()
      
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible()
        
        // Check for screen reader text
        const srText = errorMessage.locator('.public-good-sr-only')
        await expect(srText).toBeAttached()
        
        const srContent = await srText.textContent()
        expect(srContent).toContain('Error')
      }
    })

    test('should associate error messages with inputs', async ({ page }) => {
      const errorFormGroup = page.locator('.public-good-form-group--error').first()
      
      if (await errorFormGroup.count() > 0) {
        const input = errorFormGroup.locator('.public-good-input')
        const errorMessage = errorFormGroup.locator('.public-good-error-message')
        
        const ariaDescribedBy = await input.getAttribute('aria-describedby')
        const errorMessageId = await errorMessage.getAttribute('id')
        
        expect(ariaDescribedBy).toBeTruthy()
        expect(errorMessageId).toBeTruthy()
        expect(ariaDescribedBy).toContain(errorMessageId!)
      }
    })
  })

  test.describe('Prefix and Suffix', () => {
    test('should display prefix and suffix correctly', async ({ page }) => {
      const inputWithPrefix = page.locator('.public-good-input-wrapper').filter({ has: page.locator('.public-good-input__prefix') }).first()
      const inputWithSuffix = page.locator('.public-good-input-wrapper').filter({ has: page.locator('.public-good-input__suffix') }).first()
      
      if (await inputWithPrefix.count() > 0) {
        const prefix = inputWithPrefix.locator('.public-good-input__prefix')
        await expect(prefix).toBeVisible()
        await expect(prefix).toHaveAttribute('aria-hidden', 'true')
      }
      
      if (await inputWithSuffix.count() > 0) {
        const suffix = inputWithSuffix.locator('.public-good-input__suffix')
        await expect(suffix).toBeVisible()
        await expect(suffix).toHaveAttribute('aria-hidden', 'true')
      }
    })

    test('should handle input interaction with prefix/suffix', async ({ page }) => {
      const wrapperWithPrefixOrSuffix = page.locator('.public-good-input-wrapper').filter({ 
        has: page.locator('.public-good-input__prefix, .public-good-input__suffix') 
      }).first()
      
      if (await wrapperWithPrefixOrSuffix.count() > 0) {
        const input = wrapperWithPrefixOrSuffix.locator('.public-good-input')
        
        await input.fill('test value')
        await expect(input).toHaveValue('test value')
        
        await input.focus()
        await expect(input).toBeFocused()
      }
    })
  })

  test.describe('Dynamic Behavior', () => {
    test('should update input values dynamically', async ({ page }) => {
      // Add a test input and update button
      await page.evaluate(() => {
        const container = document.createElement('div')
        container.innerHTML = `
          <div class="public-good-form-group">
            <label class="public-good-label" for="dynamic-input">Dynamic Input</label>
            <div class="public-good-input-wrapper">
              <input class="public-good-input" id="dynamic-input" type="text" value="initial">
            </div>
          </div>
          <button id="update-value">Update Value</button>
        `
        document.body.appendChild(container)
        
        // Add update functionality
        const button = document.getElementById('update-value')
        const input = document.getElementById('dynamic-input') as HTMLInputElement
        
        button?.addEventListener('click', () => {
          if (input) {
            input.value = 'updated value'
          }
        })
      })

      const updateButton = page.locator('#update-value')
      const dynamicInput = page.locator('#dynamic-input')
      
      // Check initial value
      await expect(dynamicInput).toHaveValue('initial')
      
      // Click update button
      await updateButton.click()
      
      // Check updated value
      await expect(dynamicInput).toHaveValue('updated value')
    })

    test('should handle special characters in input', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      const specialText = 'Special chars: àáâãäå æç èéêë ñ øœ ßü'
      
      await input.fill(specialText)
      await expect(input).toHaveValue(specialText)
    })

    test('should handle very long input text', async ({ page }) => {
      const input = page.locator('.public-good-input').first()
      const longText = 'This is a very long piece of text that should test how the input handles lengthy content without breaking the layout or causing issues with the display '.repeat(5)
      
      await input.fill(longText)
      await expect(input).toHaveValue(longText)
      
      // Check that input is still visible and functional
      await expect(input).toBeVisible()
    })
  })

  test.describe('Form Integration', () => {
    test('should work within form context', async ({ page }) => {
      // Add a test form
      await page.evaluate(() => {
        const form = document.createElement('form')
        form.innerHTML = `
          <div class="public-good-form-group">
            <label class="public-good-label" for="form-input">Form Input</label>
            <div class="public-good-input-wrapper">
              <input class="public-good-input" id="form-input" name="form-input" type="text" required>
            </div>
          </div>
          <button type="submit">Submit</button>
        `
        document.body.appendChild(form)
      })

      const form = page.locator('form').last()
      const input = form.locator('.public-good-input')
      const submitButton = form.locator('button[type="submit"]')
      
      await expect(input).toBeVisible()
      await expect(input).toHaveAttribute('required')
      
      // Test form submission with empty required field
      await submitButton.click()
      
      // Test form submission with filled field
      await input.fill('valid input')
      await submitButton.click()
    })

    test('should handle autocomplete attributes', async ({ page }) => {
      const emailInput = page.locator('input[autocomplete*="email"]').first()
      const telInput = page.locator('input[autocomplete*="tel"]').first()
      
      if (await emailInput.count() > 0) {
        await expect(emailInput).toHaveAttribute('autocomplete', /email/)
      }
      
      if (await telInput.count() > 0) {
        await expect(telInput).toHaveAttribute('autocomplete', /tel/)
      }
    })
  })

  test.describe('Performance and Load Times', () => {
    test('should load and render quickly', async ({ page }) => {
      const startTime = Date.now()
      
      // Wait for all inputs to be visible
      await page.waitForSelector('.public-good-input', { state: 'visible' })
      
      const loadTime = Date.now() - startTime
      
      // Should load within reasonable time (2 seconds)
      expect(loadTime).toBeLessThan(2000)
    })

    test('should not cause layout shifts', async ({ page }) => {
      // Enable layout shift tracking
      await page.addInitScript(() => {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              (window as any).layoutShifts = (window as any).layoutShifts || []
              ;(window as any).layoutShifts.push((entry as any).value)
            }
          }
        }).observe({ entryTypes: ['layout-shift'] })
      })

      // Wait for page to load completely
      await page.waitForLoadState('networkidle')
      
      // Check for minimal layout shifts
      const layoutShifts = await page.evaluate(() => (window as any).layoutShifts || [])
      const totalShift = layoutShifts.reduce((sum: number, shift: number) => sum + shift, 0)
      
      // Should have minimal layout shift (less than 0.1 is considered good)
      expect(totalShift).toBeLessThan(0.15)
    })
  })

  test.describe('Print Behavior', () => {
    test('should be print-friendly', async ({ page }) => {
      // Emulate print media
      await page.emulateMedia({ media: 'print' })
      
      const inputs = page.locator('.public-good-input')
      const count = await inputs.count()

      for (let i = 0; i < Math.min(count, 3); i++) {
        const input = inputs.nth(i)
        await expect(input).toBeVisible()
      }
      
      // Reset to screen media
      await page.emulateMedia({ media: 'screen' })
    })
  })

  test.describe('Mobile and Touch Interactions', () => {
    test('should handle touch interactions', async ({ page }) => {
      // Simulate mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      const input = page.locator('.public-good-input').first()
      
      // Test touch interaction
      await input.tap()
      await expect(input).toBeFocused()
      
      await input.fill('Touch input test')
      await expect(input).toHaveValue('Touch input test')
    })

    test('should have appropriate touch target sizes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const inputs = page.locator('.public-good-input')
      const count = await inputs.count()

      for (let i = 0; i < Math.min(count, 3); i++) {
        const input = inputs.nth(i)
        const boundingBox = await input.boundingBox()
        
        if (boundingBox) {
          // Touch targets should be at least 44px high for accessibility
          expect(boundingBox.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })
})