/**
 * Details Component E2E Tests
 * End-to-end tests for the details component
 */

import { test, expect } from '@playwright/test'

declare global {
  interface Window {
    detailsEvents?: any[]
    testDetails?: any
    containerClicked?: boolean
  }
}

test.describe('Details Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with details components
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Details Component Test</title>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="test-container"></div>
        <script type="module">
          import { createDetails, createSimpleDetails, createDetailsWithHTML } from '/src/components/details/details.ts'
          
          const container = document.getElementById('test-container')
          
          // Basic details component
          const basicDetails = createDetails({
            summaryText: 'Click to reveal more information',
            content: 'This is the hidden content that can be revealed by clicking the summary.'
          })
          container.appendChild(basicDetails.element)
          
          // Details with HTML content
          const htmlDetails = createDetailsWithHTML(
            'Technical specifications',
            '<ul><li>Weight: 2.5kg</li><li>Dimensions: 30cm x 20cm x 10cm</li><li>Material: Aluminum</li></ul>'
          )
          container.appendChild(htmlDetails.element)
          
          // Pre-opened details
          const openDetails = createDetails({
            summaryText: 'Already expanded information',
            content: 'This content is visible by default because the details is pre-opened.',
            open: true
          })
          container.appendChild(openDetails.element)
          
          // Details with custom styling
          const styledDetails = createDetails({
            summaryText: 'Custom styled details',
            content: 'This details component has custom styling applied.',
            classes: 'custom-details',
            summaryClasses: 'custom-summary'
          })
          container.appendChild(styledDetails.element)
          
          // Complex content details
          const complexDetails = createDetails({
            summaryText: 'Complex content example',
            content: \`
              <div>
                <h3>Additional Information</h3>
                <p>This section contains more detailed information about the topic.</p>
                <div style="background: #f0f4f5; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
                  <h4>Important Note</h4>
                  <p>Please read this carefully before proceeding.</p>
                </div>
                <p>You can include <strong>formatted text</strong>, <em>emphasis</em>, and <a href="#" onclick="alert('Link clicked'); return false;">interactive elements</a>.</p>
              </div>
            \`
          })
          container.appendChild(complexDetails.element)
          
          // Store for testing
          window.testDetails = {
            basic: basicDetails,
            html: htmlDetails,
            open: openDetails,
            styled: styledDetails,
            complex: complexDetails
          }
          
          // Event tracking
          window.detailsEvents = []
          document.addEventListener('public-good:details:toggle', (event) => {
            window.detailsEvents.push(event.detail)
          })
        </script>
      </body>
      </html>
    `)
  })

  test('should render all details components correctly', async ({ page }) => {
    // Check that all details elements are present
    const detailsElements = page.locator('.public-good-details')
    await expect(detailsElements).toHaveCount(5)

    // Check basic details structure
    const basicDetails = detailsElements.first()
    await expect(basicDetails.locator('.public-good-details__summary')).toBeVisible()
    await expect(basicDetails.locator('.public-good-details__summary-text')).toContainText('Click to reveal more information')
    await expect(basicDetails.locator('.public-good-details__text')).toBeAttached()

    // Check pre-opened details
    const openDetails = detailsElements.nth(2)
    await expect(openDetails).toHaveAttribute('open')
    await expect(openDetails.locator('.public-good-details__text')).toBeVisible()
  })

  test('should toggle content visibility when summary is clicked', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')
    const content = basicDetails.locator('.public-good-details__text')

    // Initially closed
    await expect(basicDetails).not.toHaveAttribute('open')
    await expect(content).toBeHidden()

    // Click to open
    await summary.click()
    await expect(basicDetails).toHaveAttribute('open')
    await expect(content).toBeVisible()
    await expect(content).toContainText('This is the hidden content')

    // Click to close
    await summary.click()
    await expect(basicDetails).not.toHaveAttribute('open')
    await expect(content).toBeHidden()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')
    const content = basicDetails.locator('.public-good-details__text')

    // Focus the summary
    await summary.focus()
    await expect(summary).toBeFocused()

    // Press Enter to toggle
    await page.keyboard.press('Enter')
    await expect(basicDetails).toHaveAttribute('open')
    await expect(content).toBeVisible()

    // Press Space to toggle
    await page.keyboard.press(' ')
    await expect(basicDetails).not.toHaveAttribute('open')
    await expect(content).toBeHidden()
  })

  test('should display HTML content correctly', async ({ page }) => {
    const htmlDetails = page.locator('.public-good-details').nth(1)
    const summary = htmlDetails.locator('.public-good-details__summary')
    const content = htmlDetails.locator('.public-good-details__text')

    // Open the details
    await summary.click()
    await expect(content).toBeVisible()

    // Check HTML content is rendered
    await expect(content.locator('ul')).toBeVisible()
    await expect(content.locator('li')).toHaveCount(3)
    await expect(content.locator('li').first()).toContainText('Weight: 2.5kg')
    await expect(content.locator('li').nth(1)).toContainText('Dimensions: 30cm x 20cm x 10cm')
    await expect(content.locator('li').last()).toContainText('Material: Aluminum')
  })

  test('should maintain proper accessibility attributes', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')
    const content = basicDetails.locator('.public-good-details__text')

    // Check semantic HTML
    await expect(basicDetails).toHaveRole('group')
    await expect(summary).toHaveRole('button')

    // Check aria-expanded on content
    await expect(content).toHaveAttribute('aria-expanded', 'false')

    // Open and check aria-expanded changes
    await summary.click()
    await expect(content).toHaveAttribute('aria-expanded', 'true')

    // Close and check aria-expanded changes
    await summary.click()
    await expect(content).toHaveAttribute('aria-expanded', 'false')
  })

  test('should emit analytics events', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')

    // Toggle details and check events
    await summary.click()
    await summary.click()

    const events = await page.evaluate(() => window.detailsEvents)
    expect(events).toBeTruthy()
    expect(events!).toHaveLength(2)

    expect(events![0]).toMatchObject({
      isOpen: true,
      summaryText: 'Click to reveal more information'
    })

    expect(events![1]).toMatchObject({
      isOpen: false,
      summaryText: 'Click to reveal more information'
    })
  })

  test('should handle complex interactive content', async ({ page }) => {
    const complexDetails = page.locator('.public-good-details').last()
    const summary = complexDetails.locator('.public-good-details__summary')
    const content = complexDetails.locator('.public-good-details__text')

    // Open the complex details
    await summary.click()
    await expect(content).toBeVisible()

    // Check complex content structure
    await expect(content.locator('h3')).toContainText('Additional Information')
    await expect(content.locator('h4')).toContainText('Important Note')
    await expect(content.locator('strong')).toContainText('formatted text')
    await expect(content.locator('em')).toContainText('emphasis')

    // Test interactive element within content
    const link = content.locator('a')
    await expect(link).toContainText('interactive elements')
    
    // Set up alert handler
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Link clicked')
      await dialog.accept()
    })
    
    await link.click()
  })

  test('should work with screen readers', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')

    // Check that summary is properly labeled
    await expect(summary).toHaveRole('button')
    await expect(summary.locator('.public-good-details__summary-text')).toContainText('Click to reveal more information')

    // Check focus behavior
    await summary.focus()
    await expect(summary).toBeFocused()

    // Check that the details element has proper structure
    await expect(basicDetails).toHaveRole('group')
  })

  test('should handle programmatic API calls', async ({ page }) => {
    // Test programmatic toggle
    await page.evaluate(() => {
      window.testDetails?.basic.toggle()
    })

    const basicDetails = page.locator('.public-good-details').first()
    await expect(basicDetails).toHaveAttribute('open')

    // Test programmatic close
    await page.evaluate(() => {
      window.testDetails?.basic.close()
    })

    await expect(basicDetails).not.toHaveAttribute('open')

    // Test programmatic open
    await page.evaluate(() => {
      window.testDetails?.basic.open()
    })

    await expect(basicDetails).toHaveAttribute('open')

    // Test isOpen method
    const isOpen = await page.evaluate(() => {
      return window.testDetails?.basic.isOpen()
    })

    expect(isOpen).toBe(true)
  })

  test('should update content dynamically', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary-text')
    const content = basicDetails.locator('.public-good-details__text')

    // Update summary text
    await page.evaluate(() => {
      window.testDetails?.basic.setSummaryText('Updated summary text')
    })

    await expect(summary).toContainText('Updated summary text')

    // Update content
    await page.evaluate(() => {
      window.testDetails?.basic.setContent('<p>Updated content with <strong>HTML</strong></p>')
    })

    // Open to see updated content
    await basicDetails.locator('.public-good-details__summary').click()
    await expect(content).toContainText('Updated content with HTML')
    await expect(content.locator('strong')).toContainText('HTML')
  })

  test('should render correctly on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const detailsElements = page.locator('.public-good-details')
    const summaries = page.locator('.public-good-details__summary')

    // All details should be visible and properly sized
    await expect(detailsElements).toHaveCount(5)

    // Check touch target sizes for mobile
    const firstSummary = summaries.first()
    const boundingBox = await firstSummary.boundingBox()

    expect(boundingBox?.height).toBeGreaterThanOrEqual(44) // WCAG AA minimum
  })

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' })

    const detailsElements = page.locator('.public-good-details')
    const summaries = page.locator('.public-good-details__summary')

    // All elements should remain visible and accessible
    await expect(detailsElements).toHaveCount(5)

    for (let i = 0; i < 5; i++) {
      await expect(summaries.nth(i)).toBeVisible()
    }

    // Test interaction still works
    const firstSummary = summaries.first()
    const firstDetails = detailsElements.first()

    await firstSummary.click()
    await expect(firstDetails).toHaveAttribute('open')
  })

  test('should handle focus management correctly', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')

    // Tab to the summary
    await page.keyboard.press('Tab')
    await expect(summary).toBeFocused()

    // Tab away and back
    await page.keyboard.press('Tab')
    await page.keyboard.press('Shift+Tab')
    await expect(summary).toBeFocused()

    // Enter should still work after focus changes
    await page.keyboard.press('Enter')
    await expect(basicDetails).toHaveAttribute('open')
  })

  test('should prevent event bubbling appropriately', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')

    // Add a click listener to the container to test event bubbling
    await page.evaluate(() => {
      const container = document.getElementById('test-container')
      if (container) {
        container.addEventListener('click', () => {
          window.containerClicked = true
        })
      }
    })

    // Click the summary
    await summary.click()

    // Check that the container click event was not prevented
    const containerClicked = await page.evaluate(() => window.containerClicked)
    expect(containerClicked).toBe(true)
  })

  test('should handle rapid clicking correctly', async ({ page }) => {
    const basicDetails = page.locator('.public-good-details').first()
    const summary = basicDetails.locator('.public-good-details__summary')

    // Rapidly click the summary multiple times
    for (let i = 0; i < 5; i++) {
      await summary.click()
    }

    // Should be closed after odd number of clicks
    await expect(basicDetails).not.toHaveAttribute('open')

    // Events should have been fired for each click
    const events = await page.evaluate(() => window.detailsEvents?.length)
    expect(events).toBe(5)
  })

  test('should work correctly when nested in forms', async ({ page }) => {
    // Add a form wrapper
    await page.evaluate(() => {
      const form = document.createElement('form')
      form.innerHTML = `
        <fieldset>
          <legend>Form with details</legend>
          <div id="form-details-container"></div>
          <button type="submit">Submit</button>
        </fieldset>
      `
      
      const details = window.testDetails?.basic.element.cloneNode(true)
      const container = form.querySelector('#form-details-container')
      if (container && details) {
        container.appendChild(details)
      }
      
      document.body.appendChild(form)
    })

    const formDetails = page.locator('form .public-good-details')
    const formSummary = formDetails.locator('.public-good-details__summary')

    // Clicking summary should not submit the form
    await formSummary.click()
    await expect(formDetails).toHaveAttribute('open')

    // Form should still be present (not submitted)
    await expect(page.locator('form')).toBeVisible()
  })
})