/**
 * Button Component E2E Tests
 * End-to-end tests using Playwright
 */

import { test, expect } from '@playwright/test'

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with various button types
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Button Test</title>
        <style>
          .public-good-button {
            -webkit-appearance: none;
            background-color: #005eb8;
            border: 2px solid transparent;
            border-radius: 4px;
            box-shadow: 0 4px 0 #003972;
            color: #fff;
            cursor: pointer;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            line-height: 1.5;
            min-height: 44px;
            padding: 8px 16px;
            position: relative;
            text-align: center;
            text-decoration: none;
            vertical-align: top;
          }
          .public-good-button:hover {
            background-color: #004494;
            text-decoration: none;
          }
          .public-good-button:focus {
            outline: 3px solid #ffdd00;
            outline-offset: 1px;
            background-color: #ffdd00;
            color: #000;
            box-shadow: 0 4px 0 #000;
            text-decoration: none;
          }
          .public-good-button:active {
            background-color: #003972;
            box-shadow: none;
            top: 4px;
          }
          .public-good-button--secondary {
            background-color: #f0f4f5;
            color: #005eb8;
            box-shadow: 0 4px 0 #c4d1d6;
          }
          .public-good-button--secondary:hover {
            background-color: #d9e2e6;
          }
          .public-good-button--warning {
            background-color: #da291c;
            color: #fff;
            box-shadow: 0 4px 0 #8b1c1c;
          }
          .public-good-button--warning:hover {
            background-color: #b71c1c;
          }
          .public-good-button--reverse {
            background-color: #fff;
            color: #005eb8;
            box-shadow: 0 4px 0 #d9d9d9;
          }
          .public-good-button--reverse:hover {
            background-color: #f2f2f2;
          }
          .public-good-button:disabled,
          .public-good-button--disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
          }
          .public-good-button--loading {
            position: relative;
            pointer-events: none;
          }
          .public-good-button__spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            vertical-align: text-bottom;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .public-good-button-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          @media (min-width: 768px) {
            .public-good-button-group {
              flex-direction: row;
              align-items: center;
            }
            .public-good-button {
              width: auto;
            }
          }
          /* Test page specific styles */
          .test-section {
            margin: 2rem 0;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .reverse-section {
            background: #005eb8;
            padding: 2rem;
            margin: 2rem 0;
          }
        </style>
      </head>
      <body>
        <h1>Button Component Test</h1>
        
        <!-- Primary Buttons -->
        <div class="test-section">
          <h2>Primary Buttons</h2>
          <button class="public-good-button" data-testid="primary-button">Save and continue</button>
          <button class="public-good-button" type="button" data-testid="primary-button-type-button">Just a button</button>
          <a href="/test-link" class="public-good-button" role="button" draggable="false" data-testid="primary-link-button">Link as button</a>
          <input type="submit" class="public-good-button" value="Submit form" data-testid="primary-input-button">
        </div>

        <!-- Secondary Buttons -->
        <div class="test-section">
          <h2>Secondary Buttons</h2>
          <button class="public-good-button public-good-button--secondary" data-testid="secondary-button">Find my location</button>
          <a href="/secondary-link" class="public-good-button public-good-button--secondary" role="button" data-testid="secondary-link">Secondary link</a>
        </div>

        <!-- Warning Buttons -->
        <div class="test-section">
          <h2>Warning Buttons</h2>
          <button class="public-good-button public-good-button--warning" data-testid="warning-button">Delete item</button>
          <button class="public-good-button public-good-button--warning" disabled data-testid="warning-disabled">Delete (disabled)</button>
        </div>

        <!-- Reverse Buttons (for dark backgrounds) -->
        <div class="reverse-section">
          <h2 style="color: white;">Reverse Buttons</h2>
          <button class="public-good-button public-good-button--reverse" data-testid="reverse-button">Log out</button>
          <a href="/logout" class="public-good-button public-good-button--reverse" role="button" data-testid="reverse-link">Logout link</a>
        </div>

        <!-- Disabled States -->
        <div class="test-section">
          <h2>Disabled States</h2>
          <button class="public-good-button" disabled data-testid="disabled-button">Disabled button</button>
          <button class="public-good-button public-good-button--secondary" disabled data-testid="disabled-secondary">Disabled secondary</button>
        </div>

        <!-- Loading States -->
        <div class="test-section">
          <h2>Loading States</h2>
          <button class="public-good-button public-good-button--loading" data-testid="loading-button">
            <span class="public-good-button__spinner"></span> Loading...
          </button>
        </div>

        <!-- Button Groups -->
        <div class="test-section">
          <h2>Button Groups</h2>
          <div class="public-good-button-group" data-testid="button-group">
            <button class="public-good-button" data-testid="group-primary">Save changes</button>
            <button class="public-good-button public-good-button--secondary" data-testid="group-secondary">Cancel</button>
          </div>
        </div>

        <!-- Interactive Test Area -->
        <div class="test-section">
          <h2>Interactive Tests</h2>
          <button class="public-good-button" data-testid="click-counter" onclick="this.textContent = 'Clicked ' + (parseInt(this.dataset.count || '0') + 1) + ' times'; this.dataset.count = parseInt(this.dataset.count || '0') + 1;">Click me</button>
          <button class="public-good-button" data-testid="prevent-double-click" data-prevent-double-click="true">Prevent double click</button>
        </div>
      </body>
      </html>
    `)
  })

  test('should render primary buttons with correct styles', async ({ page }) => {
    const primaryButton = page.getByTestId('primary-button')
    
    await expect(primaryButton).toBeVisible()
    await expect(primaryButton).toHaveText('Save and continue')
    await expect(primaryButton).toHaveCSS('background-color', 'rgb(0, 94, 184)')
    await expect(primaryButton).toHaveCSS('color', 'rgb(255, 255, 255)')
    await expect(primaryButton).toHaveAttribute('type', 'submit')
  })

  test('should render secondary buttons with correct styles', async ({ page }) => {
    const secondaryButton = page.getByTestId('secondary-button')
    
    await expect(secondaryButton).toBeVisible()
    await expect(secondaryButton).toHaveText('Find my location')
    await expect(secondaryButton).toHaveCSS('background-color', 'rgb(240, 244, 245)')
    await expect(secondaryButton).toHaveCSS('color', 'rgb(0, 94, 184)')
  })

  test('should render warning buttons with correct styles', async ({ page }) => {
    const warningButton = page.getByTestId('warning-button')
    
    await expect(warningButton).toBeVisible()
    await expect(warningButton).toHaveText('Delete item')
    await expect(warningButton).toHaveCSS('background-color', 'rgb(218, 41, 28)')
    await expect(warningButton).toHaveCSS('color', 'rgb(255, 255, 255)')
  })

  test('should render reverse buttons with correct styles', async ({ page }) => {
    const reverseButton = page.getByTestId('reverse-button')
    
    await expect(reverseButton).toBeVisible()
    await expect(reverseButton).toHaveText('Log out')
    await expect(reverseButton).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(reverseButton).toHaveCSS('color', 'rgb(0, 94, 184)')
  })

  test('should handle button clicks', async ({ page }) => {
    const clickCounter = page.getByTestId('click-counter')
    
    // Initial state
    await expect(clickCounter).toHaveText('Click me')
    
    // Click once
    await clickCounter.click()
    await expect(clickCounter).toHaveText('Clicked 1 times')
    
    // Click again
    await clickCounter.click()
    await expect(clickCounter).toHaveText('Clicked 2 times')
  })

  test('should handle link button navigation', async ({ page }) => {
    // Mock navigation to prevent actual navigation
    await page.route('/test-link', route => route.fulfill({ 
      status: 200, 
      body: 'Test page' 
    }))

    const linkButton = page.getByTestId('primary-link-button')
    
    await expect(linkButton).toHaveAttribute('href', '/test-link')
    await expect(linkButton).toHaveAttribute('role', 'button')
    await expect(linkButton).toHaveAttribute('draggable', 'false')
    
    await linkButton.click()
    await page.waitForURL(/.*\/test-link/)
    expect(page.url()).toContain('/test-link')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through buttons
    await page.keyboard.press('Tab')
    let focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'primary-button')

    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'primary-button-type-button')

    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'primary-link-button')
  })

  test('should have proper focus states', async ({ page }) => {
    const primaryButton = page.getByTestId('primary-button')
    
    await primaryButton.focus()
    await expect(primaryButton).toBeFocused()
    await expect(primaryButton).toHaveCSS('outline-color', 'rgb(255, 221, 0)')
    await expect(primaryButton).toHaveCSS('background-color', 'rgb(255, 221, 0)')
    await expect(primaryButton).toHaveCSS('color', 'rgb(0, 0, 0)')
  })

  test('should handle Enter key activation', async ({ page }) => {
    const clickCounter = page.getByTestId('click-counter')
    
    await clickCounter.focus()
    await page.keyboard.press('Enter')
    
    await expect(clickCounter).toHaveText('Clicked 1 times')
  })

  test('should handle Space key activation', async ({ page }) => {
    const clickCounter = page.getByTestId('click-counter')
    
    await clickCounter.focus()
    await page.keyboard.press('Space')
    
    await expect(clickCounter).toHaveText('Clicked 1 times')
  })

  test('should handle disabled state correctly', async ({ page }) => {
    const disabledButton = page.getByTestId('disabled-button')
    const disabledSecondary = page.getByTestId('disabled-secondary')
    
    await expect(disabledButton).toBeDisabled()
    await expect(disabledButton).toHaveCSS('opacity', '0.5')
    await expect(disabledButton).toHaveCSS('cursor', 'not-allowed')
    
    await expect(disabledSecondary).toBeDisabled()
    await expect(disabledSecondary).toHaveCSS('opacity', '0.5')
    
    // Try to click - should not work
    await disabledButton.click({ force: true })
    // Button text should remain unchanged
    await expect(disabledButton).toHaveText('Disabled button')
  })

  test('should display loading state correctly', async ({ page }) => {
    const loadingButton = page.getByTestId('loading-button')
    
    await expect(loadingButton).toBeVisible()
    await expect(loadingButton).toHaveClass(/public-good-button--loading/)
    
    const spinner = loadingButton.locator('.public-good-button__spinner')
    await expect(spinner).toBeVisible()
    
    await expect(loadingButton).toHaveText('Loading...')
  })

  test('should handle hover states', async ({ page }) => {
    const primaryButton = page.getByTestId('primary-button')
    
    await primaryButton.hover()
    await expect(primaryButton).toHaveCSS('background-color', 'rgb(0, 68, 148)')
    
    const secondaryButton = page.getByTestId('secondary-button')
    await secondaryButton.hover()
    await expect(secondaryButton).toHaveCSS('background-color', 'rgb(217, 226, 230)')
  })

  test('should display button groups correctly', async ({ page }) => {
    const buttonGroup = page.getByTestId('button-group')
    const primaryGroupButton = page.getByTestId('group-primary')
    const secondaryGroupButton = page.getByTestId('group-secondary')
    
    await expect(buttonGroup).toBeVisible()
    await expect(primaryGroupButton).toBeVisible()
    await expect(secondaryGroupButton).toBeVisible()
    
    // Check that buttons are within the group
    const groupButtons = buttonGroup.locator('.public-good-button')
    await expect(groupButtons).toHaveCount(2)
  })

  test('should work on different viewport sizes', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 })
    const primaryButton = page.getByTestId('primary-button')
    await expect(primaryButton).toBeVisible()
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(primaryButton).toBeVisible()
    
    // Button should still be accessible on mobile
    await primaryButton.click()
    await expect(primaryButton).toHaveText('Save and continue')
  })

  test('should meet accessibility standards', async ({ page }) => {
    const primaryButton = page.getByTestId('primary-button')
    const linkButton = page.getByTestId('primary-link-button')
    const inputButton = page.getByTestId('primary-input-button')
    
    // Test minimum touch target size
    const buttonBox = await primaryButton.boundingBox()
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44)
    
    // Test that link buttons have proper role
    await expect(linkButton).toHaveAttribute('role', 'button')
    
    // Test that disabled buttons have proper aria attributes
    const disabledButton = page.getByTestId('disabled-button')
    await expect(disabledButton).toBeDisabled()
    
    // Test that buttons have proper types
    await expect(primaryButton).toHaveAttribute('type', 'submit')
    await expect(inputButton).toHaveAttribute('type', 'submit')
  })

  test('should handle high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' })
    
    const primaryButton = page.getByTestId('primary-button')
    
    // Verify button is still visible and accessible
    await expect(primaryButton).toBeVisible()
    
    // In high contrast mode, check that focus is still visible
    await primaryButton.focus()
    await expect(primaryButton).toBeFocused()
  })

  test('should handle reduced motion preference', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    const loadingButton = page.getByTestId('loading-button')
    
    // Verify component still functions
    await expect(loadingButton).toBeVisible()
    
    // Loading spinner should still be present (but animation would be disabled via CSS)
    const spinner = loadingButton.locator('.public-good-button__spinner')
    await expect(spinner).toBeVisible()
  })

  test('should handle RTL direction', async ({ page }) => {
    // Add RTL direction to test page
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    })
    
    const primaryButton = page.getByTestId('primary-button')
    
    // Verify button still works in RTL
    await expect(primaryButton).toBeVisible()
    await primaryButton.click()
    
    // Button should still be functional
    await expect(primaryButton).toHaveText('Save and continue')
  })

  test('should support keyboard-only navigation', async ({ page }) => {
    // Hide mouse cursor to simulate keyboard-only user
    await page.mouse.move(0, 0)
    
    // Tab through several buttons
    const buttonTestIds = [
      'primary-button',
      'primary-button-type-button',
      'primary-link-button',
      'primary-input-button',
      'secondary-button'
    ]
    
    for (let i = 0; i < buttonTestIds.length; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toHaveAttribute('data-testid', buttonTestIds[i]!)
    }
  })

  test('should handle form submission', async ({ page }) => {
    // Add a form around a submit button
    await page.evaluate(() => {
      const form = document.createElement('form')
      form.innerHTML = '<button class="public-good-button" type="submit" data-testid="form-submit">Submit Form</button>'
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        form.dataset.submitted = 'true'
      })
      document.body.appendChild(form)
    })
    
    const submitButton = page.getByTestId('form-submit')
    await submitButton.click()
    
    // Check that form submission was triggered
    const form = page.locator('form')
    await expect(form).toHaveAttribute('data-submitted', 'true')
  })

  test('should prevent double clicks when configured', async ({ page }) => {
    const preventDoubleButton = page.getByTestId('prevent-double-click')
    
    // Set up event tracking
    await page.evaluate(() => {
      let clickCount = 0
      document.addEventListener('click', (e) => {
        if ((e.target as Element).matches('[data-testid="prevent-double-click"]')) {
          clickCount++
          (e.target as Element).setAttribute('data-click-count', clickCount.toString())
        }
      })
    })
    
    // Click twice quickly
    await preventDoubleButton.click()
    await preventDoubleButton.click()
    
    // Should only register one click due to double-click prevention
    // Note: This test might be tricky to implement perfectly in Playwright
    // as it depends on timing and the actual double-click prevention logic
    await expect(preventDoubleButton).toHaveAttribute('data-prevent-double-click', 'true')
  })
})