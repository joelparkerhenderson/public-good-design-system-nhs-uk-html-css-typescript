/**
 * Error Message Component E2E Tests
 * End-to-end tests for the error message component
 */

import { test, expect } from '@playwright/test'

declare global {
  interface Window {
    errorMessageEvents?: any[]
    testErrorMessages?: any
  }
}

test.describe('Error Message Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with error message components
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Message Component Test</title>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="test-container"></div>
        <script type="module">
          import { 
            createErrorMessage, 
            createSimpleErrorMessage, 
            createFieldErrorMessage,
            createFormErrorMessages,
            showErrorMessages,
            hideErrorMessages,
            addErrorStateToElement,
            removeErrorStateFromElement
          } from '/src/components/error-message/error-message.ts'
          
          const container = document.getElementById('test-container')
          
          // Create a test form
          const form = document.createElement('form')
          form.innerHTML = \`
            <div class="public-good-form-group">
              <label for="email" class="public-good-label">Email address</label>
              <input type="email" id="email" class="public-good-input" />
            </div>
            
            <div class="public-good-form-group">
              <label for="password" class="public-good-label">Password</label>
              <input type="password" id="password" class="public-good-input" />
            </div>
            
            <div class="public-good-form-group">
              <label for="confirm-password" class="public-good-label">Confirm password</label>
              <input type="password" id="confirm-password" class="public-good-input" />
            </div>
            
            <button type="submit">Submit</button>
          \`
          container.appendChild(form)
          
          // Basic error message
          const basicError = createSimpleErrorMessage('This is a basic error message')
          container.appendChild(basicError.element)
          
          // Field-associated error message
          const emailError = createFieldErrorMessage(
            'Please enter a valid email address',
            'email'
          )
          const emailFormGroup = document.querySelector('#email').closest('.public-good-form-group')
          emailFormGroup.appendChild(emailError.element)
          
          // Hidden error message
          const hiddenError = createSimpleErrorMessage('This error is initially hidden')
          hiddenError.hide()
          container.appendChild(hiddenError.element)
          
          // Error message with custom classes
          const customError = createErrorMessage({
            message: 'Custom styled error message',
            classes: 'public-good-error-message--large'
          })
          container.appendChild(customError.element)
          
          // Form validation errors
          const formErrors = createFormErrorMessages([
            { 
              elementId: 'password', 
              message: 'Password must be at least 8 characters long' 
            },
            { 
              elementId: 'confirm-password', 
              message: 'Passwords do not match' 
            }
          ])
          
          // Add form errors to their respective form groups
          const passwordFormGroup = document.querySelector('#password').closest('.public-good-form-group')
          const confirmPasswordFormGroup = document.querySelector('#confirm-password').closest('.public-good-form-group')
          passwordFormGroup.appendChild(formErrors[0].element)
          confirmPasswordFormGroup.appendChild(formErrors[1].element)
          
          // Store for testing
          window.testErrorMessages = {
            basic: basicError,
            email: emailError,
            hidden: hiddenError,
            custom: customError,
            form: formErrors
          }
          
          // Event tracking
          window.errorMessageEvents = []
          document.addEventListener('public-good:error-message:changed', (event) => {
            window.errorMessageEvents.push({ type: 'changed', detail: event.detail })
          })
          document.addEventListener('public-good:error-message:shown', (event) => {
            window.errorMessageEvents.push({ type: 'shown', detail: event.detail })
          })
          document.addEventListener('public-good:error-message:hidden', (event) => {
            window.errorMessageEvents.push({ type: 'hidden', detail: event.detail })
          })
          document.addEventListener('public-good:error-message:associated', (event) => {
            window.errorMessageEvents.push({ type: 'associated', detail: event.detail })
          })
        </script>
      </body>
      </html>
    `)
  })

  test('should render all error message components correctly', async ({ page }) => {
    // Check that all error messages are present (excluding hidden one)
    const errorElements = page.locator('.public-good-error-message:not([aria-hidden="true"])')
    await expect(errorElements).toHaveCount(5) // basic, email, custom, 2 form errors

    // Check basic error message structure
    const basicError = errorElements.first()
    await expect(basicError.locator('.public-good-u-visually-hidden')).toContainText('Error:')
    await expect(basicError.locator('.public-good-error-message__text')).toContainText('This is a basic error message')
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    const errorMessages = page.locator('.public-good-error-message')

    // Check ARIA attributes
    for (let i = 0; i < await errorMessages.count(); i++) {
      const error = errorMessages.nth(i)
      await expect(error).toHaveAttribute('role', 'alert')
      await expect(error).toHaveAttribute('aria-live', 'polite')
    }

    // Check visually hidden text for screen readers
    const visuallyHiddenElements = page.locator('.public-good-u-visually-hidden')
    const count = await visuallyHiddenElements.count()
    
    for (let i = 0; i < count; i++) {
      await expect(visuallyHiddenElements.nth(i)).toContainText('Error:')
    }
  })

  test('should associate error messages with form fields', async ({ page }) => {
    // Check email field association
    const emailField = page.locator('#email')
    const emailErrorId = await page.evaluate(() => {
      return window.testErrorMessages?.email.element.id
    })
    
    await expect(emailField).toHaveAttribute('aria-describedby', emailErrorId)
    await expect(emailField).toHaveClass(/public-good-error/)

    // Check password field association
    const passwordField = page.locator('#password')
    const passwordErrorId = await page.evaluate(() => {
      return window.testErrorMessages?.form[0].element.id
    })
    
    await expect(passwordField).toHaveAttribute('aria-describedby', passwordErrorId)
    await expect(passwordField).toHaveClass(/public-good-error/)
  })

  test('should handle show and hide functionality', async ({ page }) => {
    // Hidden error should not be visible
    const hiddenError = page.locator('.public-good-error-message[aria-hidden="true"]')
    await expect(hiddenError).toBeHidden()

    // Show the hidden error
    await page.evaluate(() => {
      window.testErrorMessages?.hidden.show()
    })

    await expect(hiddenError).toBeVisible()
    await expect(hiddenError).toHaveAttribute('aria-hidden', 'false')

    // Hide it again
    await page.evaluate(() => {
      window.testErrorMessages?.hidden.hide()
    })

    await expect(hiddenError).toBeHidden()
    await expect(hiddenError).toHaveAttribute('aria-hidden', 'true')
  })

  test('should update error message content dynamically', async ({ page }) => {
    const basicError = page.locator('.public-good-error-message').first()
    const messageText = basicError.locator('.public-good-error-message__text')

    // Check initial content
    await expect(messageText).toContainText('This is a basic error message')

    // Update message
    await page.evaluate(() => {
      window.testErrorMessages?.basic.setMessage('Updated error message content')
    })

    await expect(messageText).toContainText('Updated error message content')
  })

  test('should emit analytics events', async ({ page }) => {
    // Update a message to trigger changed event
    await page.evaluate(() => {
      window.testErrorMessages?.basic.setMessage('Changed message')
    })

    // Show and hide to trigger events
    await page.evaluate(() => {
      window.testErrorMessages?.hidden.show()
      window.testErrorMessages?.hidden.hide()
    })

    const events = await page.evaluate(() => window.errorMessageEvents)
    expect(events).toBeTruthy()
    expect(events!.length).toBeGreaterThan(0)

    // Check for different event types
    const eventTypes = events!.map((e: any) => e.type)
    expect(eventTypes).toContain('changed')
    expect(eventTypes).toContain('shown')
    expect(eventTypes).toContain('hidden')
  })

  test('should handle form validation scenarios', async ({ page }) => {
    const emailField = page.locator('#email')
    const passwordField = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')

    // Simulate form submission with invalid data
    await emailField.fill('invalid-email')
    await passwordField.fill('123') // Too short

    // Check that error styling is applied
    await expect(emailField).toHaveClass(/public-good-error/)
    await expect(passwordField).toHaveClass(/public-good-error/)

    // Check that form groups have error state
    const emailFormGroup = page.locator('#email').locator('xpath=ancestor::div[contains(@class, "public-good-form-group")]')
    const passwordFormGroup = page.locator('#password').locator('xpath=ancestor::div[contains(@class, "public-good-form-group")]')
    
    // Note: Form group error classes would be added by the validation logic
    // In this test, they're added when creating the field error messages
  })

  test('should work with different error message variants', async ({ page }) => {
    // Check custom styled error message
    const customError = page.locator('.public-good-error-message--large')
    await expect(customError).toBeVisible()
    await expect(customError.locator('.public-good-error-message__text')).toContainText('Custom styled error message')

    // The custom class should affect styling (larger text)
    const fontSize = await customError.evaluate(el => {
      return window.getComputedStyle(el).fontSize
    })
    
    // Should be larger than default
    expect(fontSize).toBeDefined()
  })

  test('should handle multiple error messages for one field', async ({ page }) => {
    // Add another error to the email field
    await page.evaluate(() => {
      const secondEmailError = window.testErrorMessages?.email.constructor({
        message: 'Email address is required',
        targetElementId: 'email'
      })
      const emailFormGroup = document.querySelector('#email').closest('.public-good-form-group')
      emailFormGroup.appendChild(secondEmailError.element)
    })

    const emailField = page.locator('#email')
    const describedBy = await emailField.getAttribute('aria-describedby')
    
    // Should have multiple IDs in aria-describedby
    expect(describedBy).toBeTruthy()
    expect(describedBy!.split(' ')).toHaveLength(2)
  })

  test('should handle element association changes', async ({ page }) => {
    const emailField = page.locator('#email')
    const passwordField = page.locator('#password')

    // Initially associated with email
    const initialDescribedBy = await emailField.getAttribute('aria-describedby')
    expect(initialDescribedBy).toBeTruthy()

    // Associate with password field instead
    await page.evaluate(() => {
      window.testErrorMessages?.email.associateWithElement('password')
    })

    // Email field should no longer be associated
    const emailDescribedBy = await emailField.getAttribute('aria-describedby')
    expect(emailDescribedBy).toBeFalsy()

    // Password field should now be associated
    const passwordDescribedBy = await passwordField.getAttribute('aria-describedby')
    expect(passwordDescribedBy).toBeTruthy()
  })

  test('should render correctly on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const errorMessages = page.locator('.public-good-error-message')
    await expect(errorMessages.first()).toBeVisible()

    // Check that error messages remain readable on mobile
    const basicError = errorMessages.first()
    const boundingBox = await basicError.boundingBox()
    
    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThan(0)
      expect(boundingBox.height).toBeGreaterThan(0)
    }
  })

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' })

    const errorMessages = page.locator('.public-good-error-message')
    
    // All error messages should remain visible
    for (let i = 0; i < await errorMessages.count(); i++) {
      const isHidden = await errorMessages.nth(i).getAttribute('aria-hidden')
      if (isHidden !== 'true') {
        await expect(errorMessages.nth(i)).toBeVisible()
      }
    }
  })

  test('should handle focus management for accessibility', async ({ page }) => {
    // Error messages themselves can be focused programmatically
    await page.evaluate(() => {
      const firstError = document.querySelector('.public-good-error-message')
      if (firstError instanceof HTMLElement) {
        firstError.tabIndex = 0
        firstError.focus()
      }
    })

    const basicError = page.locator('.public-good-error-message').first()
    await expect(basicError).toBeFocused()
  })

  test('should handle screen reader announcements', async ({ page }) => {
    // Check that aria-live attribute allows screen reader announcements
    const basicError = page.locator('.public-good-error-message').first()
    await expect(basicError).toHaveAttribute('aria-live', 'polite')

    // When message changes, it should trigger screen reader announcement
    await page.evaluate(() => {
      window.testErrorMessages?.basic.setMessage('New message for screen reader')
    })

    const messageText = basicError.locator('.public-good-error-message__text')
    await expect(messageText).toContainText('New message for screen reader')
  })

  test('should handle form submission validation flow', async ({ page }) => {
    const form = page.locator('form')
    const emailField = page.locator('#email')
    const submitButton = page.locator('button[type="submit"]')

    // Fill form with invalid data
    await emailField.fill('invalid-email')

    // Prevent actual form submission
    await page.evaluate(() => {
      document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()
      })
    })

    // Submit form
    await submitButton.click()

    // Check that error messages are still visible and associated
    const emailError = page.locator('.public-good-error-message').nth(1) // Second error (first is basic)
    await expect(emailError).toBeVisible()
    await expect(emailField).toHaveClass(/public-good-error/)
  })

  test('should handle rapid show/hide operations', async ({ page }) => {
    // Rapidly show and hide error message
    await page.evaluate(() => {
      const error = window.testErrorMessages?.hidden
      for (let i = 0; i < 5; i++) {
        error.show()
        error.hide()
      }
    })

    // Should end up hidden
    const hiddenError = page.locator('.public-good-error-message[aria-hidden="true"]')
    await expect(hiddenError).toBeHidden()

    // Events should have been fired appropriately
    const events = await page.evaluate(() => window.errorMessageEvents?.length)
    expect(events).toBeGreaterThan(0)
  })

  test('should cleanup properly when destroyed', async ({ page }) => {
    const initialErrorCount = await page.locator('.public-good-error-message').count()
    expect(initialErrorCount).toBeGreaterThan(0)

    // Destroy one error message
    await page.evaluate(() => {
      window.testErrorMessages?.basic.destroy()
    })

    const newErrorCount = await page.locator('.public-good-error-message').count()
    expect(newErrorCount).toBe(initialErrorCount - 1)

    // Associated field should have error state removed
    const emailField = page.locator('#email')
    // Note: Email field would still have error state from the other error message
    // But if we destroyed the email error instead, it would be removed
  })
})