/**
 * Action Link Component E2E Tests
 * End-to-end tests using Playwright
 */

import { test, expect } from '@playwright/test'

test.describe('Action Link Component', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with action links
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Action Link Test</title>
        <style>
          ${await page.locator('style').innerHTML().catch(() => '')}
          .public-good-action-link { margin-bottom: 32px; }
          .public-good-action-link__link { 
            display: inline-block; 
            position: relative; 
            padding-left: 38px; 
            font-size: 20px; 
            font-weight: bold; 
            color: #005eb8; 
            text-decoration: none; 
            min-height: 44px; 
          }
          .public-good-action-link__link:focus { 
            outline: 3px solid #ffdd00; 
            outline-offset: 1px; 
            background-color: #ffdd00; 
            color: #000; 
          }
          .public-good-action-link__link:hover:not(:focus) .public-good-action-link__text { 
            text-decoration: underline; 
          }
          .public-good-icon--arrow-right-circle { 
            position: absolute; 
            left: -3px; 
            top: -3px; 
            width: 36px; 
            height: 36px; 
            fill: #00703c; 
          }
          .public-good-action-link__text { color: inherit; }
        </style>
      </head>
      <body>
        <h1>Action Link Test Page</h1>
        
        <!-- Basic Action Link -->
        <div class="public-good-action-link">
          <a href="/services" class="public-good-action-link__link" data-testid="basic-action-link">
            <svg class="public-good-icon public-good-icon--arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
            </svg>
            <span class="public-good-action-link__text">Find services near you</span>
          </a>
        </div>

        <!-- External Action Link -->
        <div class="public-good-action-link">
          <a href="https://example.com" class="public-good-action-link__link" target="_blank" rel="noopener noreferrer" data-testid="external-action-link">
            <svg class="public-good-icon public-good-icon--arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
            </svg>
            <span class="public-good-action-link__text">Visit external service</span>
          </a>
        </div>

        <!-- Urgent Action Link -->
        <div class="public-good-action-link public-good-action-link--urgent">
          <a href="/urgent-care" class="public-good-action-link__link" data-testid="urgent-action-link">
            <svg class="public-good-icon public-good-icon--arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
            </svg>
            <span class="public-good-action-link__text">Get urgent care</span>
          </a>
        </div>
      </body>
      </html>
    `)
  })

  test('should render action link with correct structure', async ({ page }) => {
    const actionLink = page.getByTestId('basic-action-link')
    
    // Check link is visible and has correct attributes
    await expect(actionLink).toBeVisible()
    await expect(actionLink).toHaveAttribute('href', '/services')
    await expect(actionLink).toHaveClass(/public-good-action-link__link/)

    // Check icon is present
    const icon = actionLink.locator('.public-good-icon--arrow-right-circle')
    await expect(icon).toBeVisible()
    await expect(icon).toHaveAttribute('aria-hidden', 'true')

    // Check text content
    const text = actionLink.locator('.public-good-action-link__text')
    await expect(text).toBeVisible()
    await expect(text).toHaveText('Find services near you')
  })

  test('should have proper focus state', async ({ page }) => {
    const actionLink = page.getByTestId('basic-action-link')
    
    // Focus the link using keyboard
    await actionLink.focus()
    
    // Check focus styles are applied
    await expect(actionLink).toBeFocused()
    
    // Verify focus styling (this would depend on your actual CSS)
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveCSS('outline-color', 'rgb(255, 221, 0)')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab to first action link
    await page.keyboard.press('Tab')
    let focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'basic-action-link')

    // Tab to second action link
    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'external-action-link')

    // Tab to third action link
    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'urgent-action-link')
  })

  test('should handle click events', async ({ page }) => {
    // Mock navigation to prevent actual navigation
    await page.route('/services', route => route.fulfill({ 
      status: 200, 
      body: 'Services page' 
    }))

    const actionLink = page.getByTestId('basic-action-link')
    
    // Click the action link
    await actionLink.click()
    
    // Wait for navigation
    await page.waitForURL(/.*\/services/)
    
    // Verify we navigated to the correct URL
    expect(page.url()).toContain('/services')
  })

  test('should handle Enter key activation', async ({ page }) => {
    // Mock navigation
    await page.route('/services', route => route.fulfill({ 
      status: 200, 
      body: 'Services page' 
    }))

    const actionLink = page.getByTestId('basic-action-link')
    
    // Focus and press Enter
    await actionLink.focus()
    await page.keyboard.press('Enter')
    
    // Wait for navigation
    await page.waitForURL(/.*\/services/)
    
    // Verify navigation occurred
    expect(page.url()).toContain('/services')
  })

  test('should handle Space key activation', async ({ page }) => {
    // Mock navigation
    await page.route('/services', route => route.fulfill({ 
      status: 200, 
      body: 'Services page' 
    }))

    const actionLink = page.getByTestId('basic-action-link')
    
    // Focus and press Space
    await actionLink.focus()
    await page.keyboard.press('Space')
    
    // Wait for navigation
    await page.waitForURL(/.*\/services/)
    
    // Verify navigation occurred
    expect(page.url()).toContain('/services')
  })

  test('should open external links in new tab', async ({ page, context }) => {
    const externalLink = page.getByTestId('external-action-link')
    
    // Check link attributes
    await expect(externalLink).toHaveAttribute('target', '_blank')
    await expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    // Listen for new page/tab creation
    const pagePromise = context.waitForEvent('page')
    
    // Click the external link
    await externalLink.click()
    
    // Wait for new page to open
    const newPage = await pagePromise
    
    // Verify new page URL
    expect(newPage.url()).toBe('https://example.com/')
    
    // Close the new page
    await newPage.close()
  })

  test('should have proper hover states', async ({ page }) => {
    const actionLink = page.getByTestId('basic-action-link')
    const textSpan = actionLink.locator('.public-good-action-link__text')
    
    // Hover over the action link
    await actionLink.hover()
    
    // Check that text decoration is applied on hover (this depends on your CSS)
    await expect(textSpan).toHaveCSS('text-decoration-line', 'underline')
  })

  test('should meet accessibility standards', async ({ page }) => {
    // Test that icon has aria-hidden
    const icon = page.locator('.public-good-icon--arrow-right-circle').first()
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    
    // Test minimum touch target size (44px x 44px)
    const actionLink = page.getByTestId('basic-action-link')
    const boundingBox = await actionLink.boundingBox()
    
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
    
    // Test color contrast (this would need actual color value checking)
    // In a real test, you might use tools like axe-playwright
    
    // Test that links are properly labeled
    await expect(actionLink).toHaveText(/Find services near you/)
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const actionLink = page.getByTestId('basic-action-link')
    
    // Verify action link is still visible and functional
    await expect(actionLink).toBeVisible()
    
    // Test touch interaction
    await actionLink.tap()
    
    // Verify the link is still focusable and clickable on mobile
    await expect(actionLink).toBeInViewport()
  })

  test('should handle high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' })
    
    const actionLink = page.getByTestId('basic-action-link')
    
    // Verify link is still visible and accessible
    await expect(actionLink).toBeVisible()
    
    // In high contrast mode, check that focus is still visible
    await actionLink.focus()
    await expect(actionLink).toBeFocused()
  })

  test('should handle reduced motion preference', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    const actionLink = page.getByTestId('basic-action-link')
    
    // Verify component still functions without animations
    await expect(actionLink).toBeVisible()
    await actionLink.click()
    
    // Link should still be functional
    await expect(actionLink).toHaveAttribute('href', '/services')
  })
})