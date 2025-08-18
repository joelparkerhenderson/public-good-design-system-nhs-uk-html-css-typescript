/**
 * Breadcrumb Component E2E Tests
 * End-to-end tests using Playwright
 */

import { test, expect } from '@playwright/test'

test.describe('Breadcrumb Component', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with breadcrumbs
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Breadcrumb Test</title>
        <style>
          .public-good-breadcrumb { 
            padding-top: 12px; 
          }
          .public-good-breadcrumb__list { 
            list-style: none; 
            margin: 0; 
            padding: 0; 
            font-size: 16px;
          }
          .public-good-breadcrumb__item { 
            display: inline-block; 
            margin-bottom: 0; 
            font-size: 16px; 
          }
          .public-good-breadcrumb__item:not(:last-child) { 
            margin-right: 8px; 
          }
          .public-good-breadcrumb__link { 
            color: #005eb8; 
            text-decoration: underline; 
          }
          .public-good-breadcrumb__link:hover { 
            color: #330072; 
          }
          .public-good-breadcrumb__link:focus { 
            outline: 3px solid #ffdd00; 
            outline-offset: 1px; 
            background-color: #ffdd00; 
            color: #000; 
            text-decoration: none; 
          }
          .public-good-breadcrumb__text { 
            color: #212b32; 
          }
          .public-good-icon--chevron-right { 
            height: 18px; 
            width: 18px; 
            fill: #768692; 
            margin-left: 8px; 
            margin-right: 4px; 
            vertical-align: middle; 
            display: inline-block; 
          }
          .public-good-breadcrumb__back { 
            margin: 0; 
            line-height: 1; 
          }
          .public-good-breadcrumb__backlink { 
            background: none; 
            border: 0; 
            cursor: pointer; 
            display: inline-flex; 
            padding: 0 0 0 16px; 
            position: relative; 
            color: #005eb8; 
            text-decoration: underline; 
            font-size: 16px; 
            min-height: 44px; 
            align-items: center; 
          }
          .public-good-breadcrumb__backlink .public-good-icon--chevron-left { 
            height: 24px; 
            width: 24px; 
            fill: #005eb8; 
            position: absolute; 
            left: -8px; 
            top: 50%; 
            transform: translateY(-50%); 
          }
          .public-good-breadcrumb__backlink:hover { 
            color: #330072; 
          }
          .public-good-breadcrumb__backlink:focus { 
            outline: 3px solid #ffdd00; 
            outline-offset: 1px; 
            background-color: #ffdd00; 
            color: #000; 
            text-decoration: none; 
          }
          .public-good-u-visually-hidden { 
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
          
          /* Responsive behavior */
          @media (max-width: 767px) {
            .public-good-breadcrumb__list { display: none; }
            .public-good-breadcrumb__back { display: block; }
          }
          
          @media (min-width: 768px) {
            .public-good-breadcrumb__list { display: block; }
            .public-good-breadcrumb__back { display: none; }
          }
          
          /* Reverse variant */
          .public-good-breadcrumb--reverse { background: #005eb8; padding: 16px; }
          .public-good-breadcrumb--reverse .public-good-breadcrumb__link { color: #fff; }
          .public-good-breadcrumb--reverse .public-good-breadcrumb__text { color: #fff; }
          .public-good-breadcrumb--reverse .public-good-icon--chevron-right { fill: #aeb7bd; }
          .public-good-breadcrumb--reverse .public-good-breadcrumb__backlink { color: #fff; }
        </style>
      </head>
      <body>
        <h1>Breadcrumb Test Page</h1>
        
        <!-- Basic Breadcrumb -->
        <nav class="public-good-breadcrumb" aria-label="Breadcrumb" data-testid="basic-breadcrumb">
          <ol class="public-good-breadcrumb__list">
            <li class="public-good-breadcrumb__item">
              <a class="public-good-breadcrumb__link" href="/" data-testid="home-link">Home</a>
              <svg class="public-good-icon public-good-icon--chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="18" width="18">
                <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"></path>
              </svg>
            </li>
            <li class="public-good-breadcrumb__item">
              <a class="public-good-breadcrumb__link" href="/services" data-testid="services-link">Services</a>
              <svg class="public-good-icon public-good-icon--chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="18" width="18">
                <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"></path>
              </svg>
            </li>
            <li class="public-good-breadcrumb__item">
              <span class="public-good-breadcrumb__text">Find a GP</span>
            </li>
          </ol>
          <p class="public-good-breadcrumb__back">
            <a class="public-good-breadcrumb__backlink" href="/services" data-testid="mobile-back-link">
              <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
                <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
              </svg>
              <span class="public-good-u-visually-hidden">Back to </span>
              Services
            </a>
          </p>
        </nav>

        <!-- Simple Two-Level Breadcrumb -->
        <nav class="public-good-breadcrumb" aria-label="Breadcrumb" data-testid="simple-breadcrumb">
          <ol class="public-good-breadcrumb__list">
            <li class="public-good-breadcrumb__item">
              <a class="public-good-breadcrumb__link" href="/" data-testid="simple-home-link">Home</a>
              <svg class="public-good-icon public-good-icon--chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="18" width="18">
                <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"></path>
              </svg>
            </li>
            <li class="public-good-breadcrumb__item">
              <span class="public-good-breadcrumb__text">About</span>
            </li>
          </ol>
          <p class="public-good-breadcrumb__back">
            <a class="public-good-breadcrumb__backlink" href="/" data-testid="simple-back-link">
              <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
                <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
              </svg>
              <span class="public-good-u-visually-hidden">Back to </span>
              Home
            </a>
          </p>
        </nav>

        <!-- Reverse Breadcrumb -->
        <nav class="public-good-breadcrumb public-good-breadcrumb--reverse" aria-label="Breadcrumb" data-testid="reverse-breadcrumb">
          <ol class="public-good-breadcrumb__list">
            <li class="public-good-breadcrumb__item">
              <a class="public-good-breadcrumb__link" href="/" data-testid="reverse-home-link">Home</a>
              <svg class="public-good-icon public-good-icon--chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="18" width="18">
                <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"></path>
              </svg>
            </li>
            <li class="public-good-breadcrumb__item">
              <span class="public-good-breadcrumb__text">Emergency</span>
            </li>
          </ol>
          <p class="public-good-breadcrumb__back">
            <a class="public-good-breadcrumb__backlink" href="/" data-testid="reverse-back-link">
              <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
                <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
              </svg>
              <span class="public-good-u-visually-hidden">Back to </span>
              Home
            </a>
          </p>
        </nav>
      </body>
      </html>
    `)
  })

  test('should render breadcrumb with correct structure', async ({ page }) => {
    const breadcrumb = page.getByTestId('basic-breadcrumb')
    
    // Check nav is visible and has correct attributes
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb).toHaveAttribute('aria-label', 'Breadcrumb')
    
    // Check ordered list is present
    const list = breadcrumb.locator('.public-good-breadcrumb__list')
    await expect(list).toBeVisible()
    
    // Check items count
    const items = breadcrumb.locator('.public-good-breadcrumb__item')
    await expect(items).toHaveCount(3)
    
    // Check links
    const links = breadcrumb.locator('.public-good-breadcrumb__link')
    await expect(links).toHaveCount(2)
    
    // Check text content
    await expect(links.nth(0)).toHaveText('Home')
    await expect(links.nth(1)).toHaveText('Services')
    
    // Check last item (current page) is text only
    const currentPage = items.nth(2).locator('.public-good-breadcrumb__text')
    await expect(currentPage).toHaveText('Find a GP')
  })

  test('should render chevron separators correctly', async ({ page }) => {
    const breadcrumb = page.getByTestId('basic-breadcrumb')
    
    // Check chevron icons are present
    const chevrons = breadcrumb.locator('.public-good-icon--chevron-right')
    await expect(chevrons).toHaveCount(2) // Between 3 items = 2 separators
    
    // Check chevrons are hidden from screen readers
    await expect(chevrons.first()).toHaveAttribute('aria-hidden', 'true')
  })

  test('should handle link clicks and navigation', async ({ page }) => {
    // Mock navigation to prevent actual navigation
    await page.route('/', route => route.fulfill({ 
      status: 200, 
      body: 'Home page' 
    }))
    await page.route('/services', route => route.fulfill({ 
      status: 200, 
      body: 'Services page' 
    }))

    const homeLink = page.getByTestId('home-link')
    
    // Click the home link
    await homeLink.click()
    
    // Wait for navigation
    await page.waitForURL(/.*\/$/)
    
    // Verify we navigated to the correct URL
    expect(page.url()).toContain('/')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab to first link
    await page.keyboard.press('Tab')
    let focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'home-link')

    // Tab to second link
    await page.keyboard.press('Tab')
    focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'services-link')
  })

  test('should have proper focus states', async ({ page }) => {
    const homeLink = page.getByTestId('home-link')
    
    // Focus the link using keyboard
    await homeLink.focus()
    
    // Check focus styles are applied
    await expect(homeLink).toBeFocused()
    
    // Verify focus styling
    await expect(homeLink).toHaveCSS('outline-color', 'rgb(255, 221, 0)')
    await expect(homeLink).toHaveCSS('background-color', 'rgb(255, 221, 0)')
  })

  test('should handle Enter key activation for links', async ({ page }) => {
    // Mock navigation
    await page.route('/services', route => route.fulfill({ 
      status: 200, 
      body: 'Services page' 
    }))

    const servicesLink = page.getByTestId('services-link')
    
    // Focus and press Enter
    await servicesLink.focus()
    await page.keyboard.press('Enter')
    
    // Wait for navigation
    await page.waitForURL(/.*\/services/)
    
    // Verify navigation occurred
    expect(page.url()).toContain('/services')
  })

  test('should display mobile back link correctly', async ({ page }) => {
    const mobileBackLink = page.getByTestId('mobile-back-link')
    
    await expect(mobileBackLink).toBeVisible()
    await expect(mobileBackLink).toHaveAttribute('href', '/services')
    
    // Check back arrow icon is present
    const backArrow = mobileBackLink.locator('.public-good-icon--chevron-left')
    await expect(backArrow).toBeVisible()
    
    // Check visually hidden text
    const hiddenText = mobileBackLink.locator('.public-good-u-visually-hidden')
    await expect(hiddenText).toHaveText('Back to ')
    
    // Check visible text
    await expect(mobileBackLink).toContainText('Services')
  })

  test('should handle mobile back link clicks', async ({ page }) => {
    // Mock navigation
    await page.route('/services', route => route.fulfill({ 
      status: 200, 
      body: 'Services page' 
    }))

    const mobileBackLink = page.getByTestId('mobile-back-link')
    
    // Click the mobile back link
    await mobileBackLink.click()
    
    // Wait for navigation
    await page.waitForURL(/.*\/services/)
    
    // Verify navigation occurred
    expect(page.url()).toContain('/services')
  })

  test('should display reverse variant correctly', async ({ page }) => {
    const reverseBreadcrumb = page.getByTestId('reverse-breadcrumb')
    
    await expect(reverseBreadcrumb).toBeVisible()
    await expect(reverseBreadcrumb).toHaveClass(/public-good-breadcrumb--reverse/)
    
    // Check reverse styling (white text on blue background)
    const reverseLink = page.getByTestId('reverse-home-link')
    await expect(reverseLink).toHaveCSS('color', 'rgb(255, 255, 255)')
  })

  test('should work on different viewport sizes', async ({ page }) => {
    // Test desktop viewport (breadcrumb list visible, back link hidden)
    await page.setViewportSize({ width: 1024, height: 768 })
    
    const breadcrumb = page.getByTestId('basic-breadcrumb')
    const list = breadcrumb.locator('.public-good-breadcrumb__list')
    const backLink = breadcrumb.locator('.public-good-breadcrumb__back')
    
    await expect(list).toBeVisible()
    await expect(backLink).toBeHidden()
    
    // Test mobile viewport (breadcrumb list hidden, back link visible)
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(list).toBeHidden()
    await expect(backLink).toBeVisible()
  })

  test('should support simple two-level breadcrumb', async ({ page }) => {
    const simpleBreadcrumb = page.getByTestId('simple-breadcrumb')
    
    const items = simpleBreadcrumb.locator('.public-good-breadcrumb__item')
    await expect(items).toHaveCount(2)
    
    const links = simpleBreadcrumb.locator('.public-good-breadcrumb__link')
    await expect(links).toHaveCount(1) // Only home has a link
    
    await expect(links.first()).toHaveText('Home')
    
    const currentPage = items.nth(1).locator('.public-good-breadcrumb__text')
    await expect(currentPage).toHaveText('About')
  })

  test('should have proper hover states', async ({ page }) => {
    const homeLink = page.getByTestId('home-link')
    
    // Hover over the link
    await homeLink.hover()
    
    // Check hover color change
    await expect(homeLink).toHaveCSS('color', 'rgb(51, 0, 114)')
  })

  test('should meet accessibility standards', async ({ page }) => {
    const breadcrumb = page.getByTestId('basic-breadcrumb')
    
    // Test that nav has proper aria-label
    await expect(breadcrumb).toHaveAttribute('aria-label', 'Breadcrumb')
    
    // Test that chevrons are hidden from screen readers
    const chevrons = breadcrumb.locator('.public-good-icon--chevron-right')
    await expect(chevrons.first()).toHaveAttribute('aria-hidden', 'true')
    
    // Test minimum touch target size for mobile back link
    const mobileBackLink = page.getByTestId('mobile-back-link')
    const boundingBox = await mobileBackLink.boundingBox()
    
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
    
    // Test that links are properly labeled
    const homeLink = page.getByTestId('home-link')
    await expect(homeLink).toHaveText(/Home/)
  })

  test('should handle high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' })
    
    const breadcrumb = page.getByTestId('basic-breadcrumb')
    
    // Verify breadcrumb is still visible and accessible
    await expect(breadcrumb).toBeVisible()
    
    // In high contrast mode, check that focus is still visible
    const homeLink = page.getByTestId('home-link')
    await homeLink.focus()
    await expect(homeLink).toBeFocused()
  })

  test('should handle reduced motion preference', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    const breadcrumb = page.getByTestId('basic-breadcrumb')
    
    // Verify component still functions without animations
    await expect(breadcrumb).toBeVisible()
    
    const homeLink = page.getByTestId('home-link')
    await homeLink.click()
    
    // Links should still be functional
    await expect(homeLink).toHaveAttribute('href', '/')
  })

  test('should handle RTL direction', async ({ page }) => {
    // Add RTL direction to test page
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    })
    
    const breadcrumb = page.getByTestId('basic-breadcrumb')
    
    // Verify breadcrumb still works in RTL
    await expect(breadcrumb).toBeVisible()
    
    // Check that chevrons and back arrows are present (they should be flipped via CSS)
    const chevrons = breadcrumb.locator('.public-good-icon--chevron-right')
    await expect(chevrons.first()).toBeVisible()
    
    const backArrow = breadcrumb.locator('.public-good-icon--chevron-left')
    await expect(backArrow).toBeVisible()
  })

  test('should support keyboard-only navigation', async ({ page }) => {
    // Hide mouse cursor to simulate keyboard-only user
    await page.mouse.move(0, 0)
    
    // Tab through all breadcrumb links
    const breadcrumbLinks = [
      'home-link',
      'services-link'
    ]
    
    for (let i = 0; i < breadcrumbLinks.length; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toHaveAttribute('data-testid', breadcrumbLinks[i]!)
    }
  })

  test('should work with different numbers of breadcrumb levels', async ({ page }) => {
    // Test simple breadcrumb (2 levels)
    const simpleBreadcrumb = page.getByTestId('simple-breadcrumb')
    const simpleItems = simpleBreadcrumb.locator('.public-good-breadcrumb__item')
    await expect(simpleItems).toHaveCount(2)
    
    // Test complex breadcrumb (3 levels)
    const basicBreadcrumb = page.getByTestId('basic-breadcrumb')
    const basicItems = basicBreadcrumb.locator('.public-good-breadcrumb__item')
    await expect(basicItems).toHaveCount(3)
  })
})