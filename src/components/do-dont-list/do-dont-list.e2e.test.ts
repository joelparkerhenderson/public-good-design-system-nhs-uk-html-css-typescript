/**
 * Do and Don't List Component E2E Tests
 * End-to-end tests for the do and don't list component
 */

import { test, expect } from '@playwright/test'

declare global {
  interface Window {
    doDontListEvents?: any[]
    testDoDontList?: any
  }
}

test.describe('Do and Don\'t List Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with do and don't list components
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Do and Don't List Component Test</title>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="test-container"></div>
        <script type="module">
          import { createDoDontList, createSimpleDoDontList, createDoList, createDontList } from '/src/components/do-dont-list/do-dont-list.ts'
          
          const container = document.getElementById('test-container')
          
          // Basic do and don't list
          const basicList = createDoDontList({
            title: 'Transportation Guidelines',
            doItems: [
              { text: 'Wear your seatbelt at all times' },
              { text: 'Check your mirrors before changing lanes' },
              { text: 'Follow the speed limit' }
            ],
            dontItems: [
              { text: 'Use your phone while driving' },
              { text: 'Drive when tired or impaired' }
            ]
          })
          container.appendChild(basicList.element)
          
          // HTML content list
          const htmlList = createDoDontList({
            title: 'Accessibility Best Practices',
            doItems: [
              { 
                text: 'Use semantic HTML',
                html: '<p>Use <strong>semantic HTML</strong> elements like <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, and <code>&lt;aside&gt;</code></p>'
              }
            ],
            dontItems: [
              { 
                text: 'Use divs for everything',
                html: '<p>Don\\'t use <code>&lt;div&gt;</code> elements for <em>everything</em> - they have no semantic meaning</p>'
              }
            ]
          })
          container.appendChild(htmlList.element)
          
          // Do-only list
          const doOnlyList = createDoList([
            'Save your work frequently',
            'Use version control',
            'Write clear commit messages'
          ], { title: 'Development Best Practices' })
          container.appendChild(doOnlyList.element)
          
          // Don't-only list
          const dontOnlyList = createDontList([
            'Commit sensitive information',
            'Work directly on the main branch',
            'Skip code reviews'
          ], { title: 'Development Mistakes to Avoid' })
          container.appendChild(dontOnlyList.element)
          
          // List without icons
          const noIconsList = createDoDontList({
            title: 'Simple Guidelines',
            showIcons: false,
            doItems: [{ text: 'Follow this practice' }],
            dontItems: [{ text: 'Avoid this practice' }]
          })
          container.appendChild(noIconsList.element)
          
          // Store for testing
          window.testDoDontList = {
            basic: basicList,
            html: htmlList,
            doOnly: doOnlyList,
            dontOnly: dontOnlyList,
            noIcons: noIconsList
          }
          
          // Event tracking
          window.doDontListEvents = []
          document.addEventListener('public-good:do-dont-list:item-added', (event) => {
            window.doDontListEvents.push({ type: 'added', detail: event.detail })
          })
          document.addEventListener('public-good:do-dont-list:item-removed', (event) => {
            window.doDontListEvents.push({ type: 'removed', detail: event.detail })
          })
        </script>
      </body>
      </html>
    `)
  })

  test('should render all do and don\'t list components correctly', async ({ page }) => {
    // Check that all lists are present
    const listElements = page.locator('.public-good-do-dont-list')
    await expect(listElements).toHaveCount(5)

    // Check basic list structure
    const basicList = listElements.first()
    await expect(basicList.locator('.public-good-do-dont-list__title')).toContainText('Transportation Guidelines')
    await expect(basicList.locator('.public-good-do-dont-list__do-heading')).toContainText('Do')
    await expect(basicList.locator('.public-good-do-dont-list__dont-heading')).toContainText('Don\'t')

    // Check do items
    const doItems = basicList.locator('.public-good-do-dont-list__do-item')
    await expect(doItems).toHaveCount(3)
    await expect(doItems.first().locator('.public-good-do-dont-list__do-content')).toContainText('Wear your seatbelt')

    // Check don't items
    const dontItems = basicList.locator('.public-good-do-dont-list__dont-item')
    await expect(dontItems).toHaveCount(2)
    await expect(dontItems.first().locator('.public-good-do-dont-list__dont-content')).toContainText('Use your phone while driving')
  })

  test('should display SVG icons correctly', async ({ page }) => {
    const basicList = page.locator('.public-good-do-dont-list').first()

    // Check tick icons in do section
    const tickIcons = basicList.locator('.public-good-icon--tick')
    await expect(tickIcons).toHaveCount(3)
    
    for (let i = 0; i < 3; i++) {
      const icon = tickIcons.nth(i)
      await expect(icon).toHaveAttribute('width', '34')
      await expect(icon).toHaveAttribute('height', '34')
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('focusable', 'false')
    }

    // Check cross icons in don't section
    const crossIcons = basicList.locator('.public-good-icon--cross')
    await expect(crossIcons).toHaveCount(2)
    
    for (let i = 0; i < 2; i++) {
      const icon = crossIcons.nth(i)
      await expect(icon).toHaveAttribute('width', '34')
      await expect(icon).toHaveAttribute('height', '34')
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('focusable', 'false')
    }
  })

  test('should handle HTML content correctly', async ({ page }) => {
    const htmlList = page.locator('.public-good-do-dont-list').nth(1)

    // Check HTML content in do section
    const doContent = htmlList.locator('.public-good-do-dont-list__do-content')
    await expect(doContent.locator('strong')).toContainText('semantic HTML')
    await expect(doContent.locator('code').first()).toContainText('<nav>')

    // Check HTML content in don't section
    const dontContent = htmlList.locator('.public-good-do-dont-list__dont-content')
    await expect(dontContent.locator('code')).toContainText('<div>')
    await expect(dontContent.locator('em')).toContainText('everything')
  })

  test('should handle do-only lists correctly', async ({ page }) => {
    const doOnlyList = page.locator('.public-good-do-dont-list').nth(2)

    await expect(doOnlyList.locator('.public-good-do-dont-list__title')).toContainText('Development Best Practices')
    await expect(doOnlyList.locator('.public-good-do-dont-list__do-heading')).toBeVisible()
    await expect(doOnlyList.locator('.public-good-do-dont-list__dont')).toBeHidden()

    const doItems = doOnlyList.locator('.public-good-do-dont-list__do-item')
    await expect(doItems).toHaveCount(3)
    await expect(doItems.first().locator('.public-good-do-dont-list__do-content')).toContainText('Save your work frequently')
  })

  test('should handle don\'t-only lists correctly', async ({ page }) => {
    const dontOnlyList = page.locator('.public-good-do-dont-list').nth(3)

    await expect(dontOnlyList.locator('.public-good-do-dont-list__title')).toContainText('Development Mistakes to Avoid')
    await expect(dontOnlyList.locator('.public-good-do-dont-list__do')).toBeHidden()
    await expect(dontOnlyList.locator('.public-good-do-dont-list__dont-heading')).toBeVisible()

    const dontItems = dontOnlyList.locator('.public-good-do-dont-list__dont-item')
    await expect(dontItems).toHaveCount(3)
    await expect(dontItems.first().locator('.public-good-do-dont-list__dont-content')).toContainText('Commit sensitive information')
  })

  test('should handle lists without icons', async ({ page }) => {
    const noIconsList = page.locator('.public-good-do-dont-list').nth(4)

    await expect(noIconsList.locator('.public-good-do-dont-list__title')).toContainText('Simple Guidelines')
    
    // Should not have any icons
    await expect(noIconsList.locator('.public-good-icon--tick')).toHaveCount(0)
    await expect(noIconsList.locator('.public-good-icon--cross')).toHaveCount(0)

    // Content should still be present
    await expect(noIconsList.locator('.public-good-do-dont-list__do-content')).toContainText('Follow this practice')
    await expect(noIconsList.locator('.public-good-do-dont-list__dont-content')).toContainText('Avoid this practice')
  })

  test('should maintain proper accessibility attributes', async ({ page }) => {
    const basicList = page.locator('.public-good-do-dont-list').first()

    // Check semantic HTML structure
    const title = basicList.locator('.public-good-do-dont-list__title')
    await expect(title).toHaveRole('heading')

    const doHeading = basicList.locator('.public-good-do-dont-list__do-heading')
    await expect(doHeading).toHaveRole('heading')

    const dontHeading = basicList.locator('.public-good-do-dont-list__dont-heading')
    await expect(dontHeading).toHaveRole('heading')

    // Check list structure
    const doList = basicList.locator('.public-good-do-dont-list__do-list')
    await expect(doList).toHaveAttribute('role', 'list')

    const dontList = basicList.locator('.public-good-do-dont-list__dont-list')
    await expect(dontList).toHaveAttribute('role', 'list')

    // Check icons are hidden from screen readers
    const icons = basicList.locator('.public-good-icon')
    const iconCount = await icons.count()
    
    for (let i = 0; i < iconCount; i++) {
      await expect(icons.nth(i)).toHaveAttribute('aria-hidden', 'true')
      await expect(icons.nth(i)).toHaveAttribute('focusable', 'false')
    }
  })

  test('should handle programmatic item addition', async ({ page }) => {
    // Add items dynamically
    await page.evaluate(() => {
      window.testDoDontList?.basic.addDoItem({ text: 'New safety guideline' })
      window.testDoDontList?.basic.addDontItem({ text: 'New thing to avoid' })
    })

    const basicList = page.locator('.public-good-do-dont-list').first()

    // Check updated counts
    const doItems = basicList.locator('.public-good-do-dont-list__do-item')
    await expect(doItems).toHaveCount(4) // Was 3, now 4

    const dontItems = basicList.locator('.public-good-do-dont-list__dont-item')
    await expect(dontItems).toHaveCount(3) // Was 2, now 3

    // Check new content is visible
    await expect(doItems.last().locator('.public-good-do-dont-list__do-content')).toContainText('New safety guideline')
    await expect(dontItems.last().locator('.public-good-do-dont-list__dont-content')).toContainText('New thing to avoid')
  })

  test('should handle programmatic item removal', async ({ page }) => {
    const basicList = page.locator('.public-good-do-dont-list').first()

    // Remove items
    await page.evaluate(() => {
      window.testDoDontList?.basic.removeDoItem(0) // Remove first do item
      window.testDoDontList?.basic.removeDontItem(0) // Remove first don't item
    })

    // Check updated counts
    const doItems = basicList.locator('.public-good-do-dont-list__do-item')
    await expect(doItems).toHaveCount(2) // Was 3, now 2

    const dontItems = basicList.locator('.public-good-do-dont-list__dont-item')
    await expect(dontItems).toHaveCount(1) // Was 2, now 1

    // Check that the right items were removed (first ones)
    await expect(doItems.first().locator('.public-good-do-dont-list__do-content')).toContainText('Check your mirrors')
  })

  test('should emit analytics events for item changes', async ({ page }) => {
    // Add and remove items to trigger events
    await page.evaluate(() => {
      window.testDoDontList?.basic.addDoItem({ text: 'Event test item' })
      window.testDoDontList?.basic.removeDoItem(0)
    })

    const events = await page.evaluate(() => window.doDontListEvents)
    expect(events).toBeTruthy()
    expect(events!).toHaveLength(2)

    expect(events![0]).toMatchObject({
      type: 'added',
      detail: {
        type: 'do',
        item: { text: 'Event test item' }
      }
    })

    expect(events![1]).toMatchObject({
      type: 'removed',
      detail: {
        type: 'do',
        index: 0
      }
    })
  })

  test('should handle title updates dynamically', async ({ page }) => {
    const basicList = page.locator('.public-good-do-dont-list').first()

    // Update title
    await page.evaluate(() => {
      window.testDoDontList?.basic.setTitle('Updated Transportation Guidelines')
    })

    await expect(basicList.locator('.public-good-do-dont-list__title')).toContainText('Updated Transportation Guidelines')
  })

  test('should render correctly on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const listElements = page.locator('.public-good-do-dont-list')
    await expect(listElements).toHaveCount(5)

    // Check that content is still readable and properly formatted
    const basicList = listElements.first()
    
    // Check that icons are still visible and properly sized
    const tickIcons = basicList.locator('.public-good-icon--tick')
    await expect(tickIcons).toHaveCount(3)
    
    // Check responsive typography
    const title = basicList.locator('.public-good-do-dont-list__title')
    await expect(title).toBeVisible()
  })

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' })

    const listElements = page.locator('.public-good-do-dont-list')
    await expect(listElements).toHaveCount(5)

    // All content should remain visible and accessible
    const basicList = listElements.first()
    await expect(basicList.locator('.public-good-do-dont-list__title')).toBeVisible()
    await expect(basicList.locator('.public-good-do-dont-list__do-heading')).toBeVisible()
    await expect(basicList.locator('.public-good-do-dont-list__dont-heading')).toBeVisible()

    const doItems = basicList.locator('.public-good-do-dont-list__do-item')
    const dontItems = basicList.locator('.public-good-do-dont-list__dont-item')
    
    for (let i = 0; i < 3; i++) {
      await expect(doItems.nth(i)).toBeVisible()
    }
    
    for (let i = 0; i < 2; i++) {
      await expect(dontItems.nth(i)).toBeVisible()
    }
  })

  test('should handle focus management correctly', async ({ page }) => {
    // Focus should be manageable for screen reader users
    const basicList = page.locator('.public-good-do-dont-list').first()

    // Title should be focusable programmatically
    await page.evaluate(() => {
      const title = document.querySelector('.public-good-do-dont-list__title')
      if (title instanceof HTMLElement) {
        title.tabIndex = 0
        title.focus()
      }
    })

    const title = basicList.locator('.public-good-do-dont-list__title')
    await expect(title).toBeFocused()
  })

  test('should maintain content integrity with complex HTML', async ({ page }) => {
    const htmlList = page.locator('.public-good-do-dont-list').nth(1)

    // Check that HTML elements are properly rendered
    const doContent = htmlList.locator('.public-good-do-dont-list__do-content')
    await expect(doContent.locator('p')).toBeVisible()
    await expect(doContent.locator('strong')).toBeVisible()
    await expect(doContent.locator('code')).toHaveCount(3)

    // Check that content is accessible
    await expect(doContent.locator('strong')).toContainText('semantic HTML')
    
    const dontContent = htmlList.locator('.public-good-do-dont-list__dont-content')
    await expect(dontContent.locator('em')).toContainText('everything')
  })

  test('should handle empty states correctly', async ({ page }) => {
    // Create an empty list
    await page.evaluate(() => {
      const { createDoDontList } = window.testDoDontList?.basic.constructor || {}
      const emptyList = createDoDontList({
        title: 'Empty List',
        doItems: [],
        dontItems: []
      })
      document.getElementById('test-container')?.appendChild(emptyList.element)
    })

    const listElements = page.locator('.public-good-do-dont-list')
    const emptyList = listElements.last()

    await expect(emptyList.locator('.public-good-do-dont-list__title')).toContainText('Empty List')
    await expect(emptyList.locator('.public-good-do-dont-list__do')).toBeHidden()
    await expect(emptyList.locator('.public-good-do-dont-list__dont')).toBeHidden()
  })

  test('should handle rapid programmatic changes', async ({ page }) => {
    // Rapidly add and remove items
    await page.evaluate(() => {
      const list = window.testDoDontList?.basic
      for (let i = 0; i < 5; i++) {
        list.addDoItem({ text: `Rapid item ${i}` })
      }
      for (let i = 0; i < 3; i++) {
        list.removeDoItem(0)
      }
    })

    const basicList = page.locator('.public-good-do-dont-list').first()
    const doItems = basicList.locator('.public-good-do-dont-list__do-item')

    // Should have original 3 + 5 - 3 = 5 items
    await expect(doItems).toHaveCount(5)
  })
})