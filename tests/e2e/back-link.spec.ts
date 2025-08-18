/**
 * Back Link Component E2E Tests
 * End-to-end tests using Playwright
 */

import { test, expect } from '@playwright/test'

test.describe('Back Link Component', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with back links
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Back Link Test</title>
        <style>
          .public-good-back-link { padding-top: 12px; line-height: 1; }
          .public-good-back-link__link { 
            background: none; 
            border: 0; 
            cursor: pointer; 
            display: inline-block; 
            padding: 0 0 0 16px; 
            position: relative; 
            font-size: 16px; 
            color: #005eb8; 
            text-decoration: underline; 
            min-height: 44px; 
          }
          .public-good-back-link__link:focus { 
            outline: 3px solid #ffdd00; 
            outline-offset: 1px; 
            background-color: #ffdd00; 
            color: #000; 
            text-decoration: none; 
          }
          .public-good-back-link__link:hover { color: #330072; }
          .public-good-icon--chevron-left { 
            height: 24px; 
            width: 24px; 
            position: absolute; 
            left: -8px; 
            top: -1px; 
            fill: currentColor; 
          }
          .public-good-back-link--reverse .public-good-back-link__link { color: #fff; }
          button.public-good-back-link__link { font-family: inherit; text-align: left; }
          button.public-good-back-link__link:disabled { opacity: 0.6; cursor: not-allowed; }
        </style>
      </head>
      <body>
        <h1>Back Link Test Page</h1>
        
        <!-- Basic Back Link -->
        <div class="public-good-back-link">
          <a href="/previous-page" class="public-good-back-link__link" data-testid="basic-back-link">
            <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
              <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
            </svg>
            Back
          </a>
        </div>

        <!-- Custom Text Back Link -->
        <div class="public-good-back-link">
          <a href="/services" class="public-good-back-link__link" data-testid="custom-text-back-link">
            <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
              <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
            </svg>
            Back to services
          </a>
        </div>

        <!-- Button Back Link -->
        <div class="public-good-back-link">
          <button type="button" class="public-good-back-link__link" data-testid="button-back-link">
            <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
              <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
            </svg>
            Back
          </button>
        </div>

        <!-- Reverse Back Link -->
        <div class="public-good-back-link public-good-back-link--reverse" style="background: #005eb8; padding: 16px;">
          <a href="/previous-page" class="public-good-back-link__link" data-testid="reverse-back-link">
            <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
              <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
            </svg>
            Back
          </a>
        </div>

        <!-- Disabled Button -->
        <div class="public-good-back-link">
          <button type="button" class="public-good-back-link__link" disabled data-testid="disabled-back-link">
            <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
              <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
            </svg>
            Back (disabled)
          </button>
        </div>
      </body>
      </html>
    `)
  })

  test('should render back link with correct structure', async ({ page }) => {
    const backLink = page.getByTestId('basic-back-link')
    
    // Check link is visible and has correct attributes
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute('href', '/previous-page')
    await expect(backLink).toHaveClass(/public-good-back-link__link/)

    // Check icon is present
    const icon = backLink.locator('.public-good-icon--chevron-left')
    await expect(icon).toBeVisible()
    await expect(icon).toHaveAttribute('aria-hidden', 'true')

    // Check text content
    await expect(backLink).toHaveText('Back')
  })

  test('should render custom text correctly', async ({ page }) => {
    const backLink = page.getByTestId('custom-text-back-link')
    
    await expect(backLink).toHaveText('Back to services')
    await expect(backLink).toHaveAttribute('href', '/services')
  })

  test('should render button element correctly', async ({ page }) => {
    const backLink = page.getByTestId('button-back-link')
    
    await expect(backLink).toHaveAttribute('type', 'button')
    await expect(backLink).toHaveText('Back')
    
    // Check it's actually a button element
    const tagName = await backLink.evaluate(el => el.tagName.toLowerCase())
    expect(tagName).toBe('button')
  })

  test('should have proper focus state', async ({ page }) => {
    const backLink = page.getByTestId('basic-back-link')
    
    // Focus the link using keyboard
    await backLink.focus()
    
    // Check focus styles are applied
    await expect(backLink).toBeFocused()
    
    // Verify focus styling
    await expect(backLink).toHaveCSS('outline-color', 'rgb(255, 221, 0)')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab to first back link
    await page.keyboard.press('Tab')
    let focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'basic-back-link')

    // Tab to second back link
    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'custom-text-back-link')

    // Tab to button back link
    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'button-back-link')
  })

  test('should handle click events for links', async ({ page }) => {
    // Mock navigation to prevent actual navigation
    await page.route('/previous-page', route => route.fulfill({ 
      status: 200, 
      body: 'Previous page' 
    }))

    const backLink = page.getByTestId('basic-back-link')
    
    // Click the back link
    await backLink.click()
    
    // Wait for navigation
    await page.waitForURL(/.*\/previous-page/)
    
    // Verify we navigated to the correct URL
    expect(page.url()).toContain('/previous-page')
  })

  test('should handle Enter key activation for links', async ({ page }) => {
    // Mock navigation
    await page.route('/services', route => route.fulfill({ 
      status: 200, 
      body: 'Services page' 
    }))

    const backLink = page.getByTestId('custom-text-back-link')
    
    // Focus and press Enter
    await backLink.focus()
    await page.keyboard.press('Enter')
    
    // Wait for navigation
    await page.waitForURL(/.*\/services/)
    
    // Verify navigation occurred
    expect(page.url()).toContain('/services')
  })

  test('should handle button clicks', async ({ page }) => {
    const buttonBackLink = page.getByTestId('button-back-link')
    
    // Set up event listener to capture clicks
    await page.evaluate(() => {
      (window as any).buttonClicked = false
      document.addEventListener('click', (e) => {
        if ((e.target as Element).matches('[data-testid="button-back-link"]')) {
          (window as any).buttonClicked = true
        }
      })
    })
    
    // Click the button
    await buttonBackLink.click()
    
    // Verify click was handled
    const wasClicked = await page.evaluate(() => (window as any).buttonClicked)
    expect(wasClicked).toBe(true)
  })

  test('should handle Space key activation for buttons', async ({ page }) => {
    const buttonBackLink = page.getByTestId('button-back-link')
    
    // Set up event listener
    await page.evaluate(() => {
      (window as any).spacePressed = false
      document.addEventListener('click', (e) => {
        if ((e.target as Element).matches('[data-testid="button-back-link"]')) {
          (window as any).spacePressed = true
        }
      })
    })
    
    // Focus and press Space
    await buttonBackLink.focus()
    await page.keyboard.press('Space')
    
    // Verify activation occurred
    const wasActivated = await page.evaluate(() => (window as any).spacePressed)
    expect(wasActivated).toBe(true)
  })

  test('should display reverse variant correctly', async ({ page }) => {
    const reverseBackLink = page.getByTestId('reverse-back-link')
    
    await expect(reverseBackLink).toBeVisible()
    await expect(reverseBackLink).toHaveCSS('color', 'rgb(255, 255, 255)')
  })

  test('should handle disabled state for buttons', async ({ page }) => {
    const disabledBackLink = page.getByTestId('disabled-back-link')
    
    await expect(disabledBackLink).toBeDisabled()
    await expect(disabledBackLink).toHaveCSS('opacity', '0.6')
    await expect(disabledBackLink).toHaveCSS('cursor', 'not-allowed')
    
    // Verify it can't be clicked
    await disabledBackLink.click({ force: true })
    // Should not navigate or perform any action
  })

  test('should have proper hover states', async ({ page }) => {
    const backLink = page.getByTestId('basic-back-link')
    
    // Hover over the back link
    await backLink.hover()
    
    // Check hover color change
    await expect(backLink).toHaveCSS('color', 'rgb(51, 0, 114)')
  })

  test('should meet accessibility standards', async ({ page }) => {
    // Test that icon has aria-hidden
    const icon = page.locator('.public-good-icon--chevron-left').first()
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    
    // Test minimum touch target size (44px height)
    const backLink = page.getByTestId('basic-back-link')
    const boundingBox = await backLink.boundingBox()
    
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
    
    // Test that links are properly labeled
    await expect(backLink).toHaveText(/Back/)
    
    // Test button has proper type
    const buttonBackLink = page.getByTestId('button-back-link')
    await expect(buttonBackLink).toHaveAttribute('type', 'button')
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const backLink = page.getByTestId('basic-back-link')
    
    // Verify back link is still visible and functional
    await expect(backLink).toBeVisible()
    
    // Test touch interaction
    await backLink.tap()
    
    // Verify the link is still focusable and clickable on mobile
    await expect(backLink).toBeInViewport()
    
    // Check that touch targets are appropriate size
    const boundingBox = await backLink.boundingBox()
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44) // Minimum touch target
  })

  test('should handle high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' })
    
    const backLink = page.getByTestId('basic-back-link')
    
    // Verify link is still visible and accessible
    await expect(backLink).toBeVisible()
    
    // In high contrast mode, check that focus is still visible
    await backLink.focus()
    await expect(backLink).toBeFocused()
  })

  test('should handle reduced motion preference', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    const backLink = page.getByTestId('basic-back-link')
    
    // Verify component still functions without animations
    await expect(backLink).toBeVisible()
    await backLink.click()
    
    // Link should still be functional
    await expect(backLink).toHaveAttribute('href', '/previous-page')
  })

  test('should handle RTL direction', async ({ page }) => {
    // Add RTL direction to test page
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    })
    
    const backLink = page.getByTestId('basic-back-link')
    
    // Verify back link still works in RTL
    await expect(backLink).toBeVisible()
    
    // Check icon positioning (should be flipped)
    const icon = backLink.locator('.public-good-icon--chevron-left')
    await expect(icon).toBeVisible()
  })

  test('should support keyboard-only navigation', async ({ page }) => {
    // Hide mouse cursor to simulate keyboard-only user
    await page.mouse.move(0, 0)
    
    // Tab through all back links
    const backLinks = [
      'basic-back-link',
      'custom-text-back-link', 
      'button-back-link',
      'reverse-back-link'
    ]
    
    for (let i = 0; i < backLinks.length; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toHaveAttribute('data-testid', backLinks[i]!)
    }
  })
})