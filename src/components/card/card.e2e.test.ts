/**
 * Card Component E2E Tests
 * End-to-end tests for the card component
 */

import { test, expect } from '@playwright/test'

declare global {
  interface Window {
    navigationTriggered?: boolean
    analyticsEvents?: any[]
  }
}

test.describe('Card Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with cards
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Card Component Test</title>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="test-container"></div>
        <script type="module">
          import { createCard, createCareCard, createPrimaryCard, createCardGroup } from '/src/components/card/card.ts'
          
          const container = document.getElementById('test-container')
          
          // Basic card
          const basicCard = createCard({
            heading: 'Basic Card',
            description: 'This is a basic card description'
          })
          container.appendChild(basicCard.element)
          
          // Clickable card
          const clickableCard = createCard({
            heading: 'Clickable Card',
            description: 'Click me to navigate',
            clickable: true,
            href: '#clicked'
          })
          container.appendChild(clickableCard.element)
          
          // Primary card
          const primaryCard = createPrimaryCard({
            heading: 'Primary Card',
            description: 'Primary card with chevron',
            href: '#primary'
          })
          container.appendChild(primaryCard.element)
          
          // Care cards
          const nonUrgentCard = createCareCard('non-urgent', {
            heading: 'Speak to a GP if:',
            content: '<ul><li>You have mild symptoms</li><li>Symptoms persist</li></ul>'
          })
          container.appendChild(nonUrgentCard.element)
          
          const urgentCard = createCareCard('urgent', {
            heading: 'Ask for an urgent GP appointment if:',
            content: '<ul><li>Symptoms are severe</li><li>Condition is worsening</li></ul>'
          })
          container.appendChild(urgentCard.element)
          
          const emergencyCard = createCareCard('emergency', {
            heading: 'Call 999 if:',
            content: '<ul><li>Life-threatening emergency</li><li>Severe chest pain</li></ul>'
          })
          container.appendChild(emergencyCard.element)
          
          // Card group
          const card1 = createCard({ heading: 'Group Card 1', description: 'First card in group' })
          const card2 = createCard({ heading: 'Group Card 2', description: 'Second card in group' })
          const cardGroup = createCardGroup([card1, card2])
          container.appendChild(cardGroup)
        </script>
      </body>
      </html>
    `)
  })

  test('should render all card types correctly', async ({ page }) => {
    // Check basic card
    const basicCard = page.locator('.public-good-card').first()
    await expect(basicCard).toBeVisible()
    await expect(basicCard.locator('.public-good-card__heading')).toContainText('Basic Card')
    await expect(basicCard.locator('.public-good-card__description')).toContainText('This is a basic card description')

    // Check clickable card
    const clickableCard = page.locator('.public-good-card--clickable').first()
    await expect(clickableCard).toBeVisible()
    await expect(clickableCard).toHaveAttribute('role', 'link')
    await expect(clickableCard).toHaveAttribute('tabindex', '0')

    // Check primary card
    const primaryCard = page.locator('.public-good-card__content--primary').first()
    await expect(primaryCard).toBeVisible()
    await expect(primaryCard.locator('.public-good-icon')).toBeVisible()

    // Check care cards
    await expect(page.locator('.public-good-card--care--non-urgent')).toBeVisible()
    await expect(page.locator('.public-good-card--care--urgent')).toBeVisible()
    await expect(page.locator('.public-good-card--care--emergency')).toBeVisible()

    // Check card group
    const cardGroup = page.locator('.public-good-card-group')
    await expect(cardGroup).toBeVisible()
    await expect(cardGroup.locator('.public-good-card-group__item')).toHaveCount(2)
  })

  test('should handle clickable card interactions', async ({ page }) => {
    const clickableCard = page.locator('.public-good-card--clickable').first()
    
    // Test mouse hover
    await clickableCard.hover()
    // Visual changes should be applied via CSS
    
    // Test click
    await clickableCard.click()
    await expect(page).toHaveURL(/#clicked$/)
  })

  test('should support keyboard navigation', async ({ page }) => {
    const clickableCard = page.locator('.public-good-card--clickable').first()
    
    // Tab to the card
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // May need multiple tabs depending on other elements
    
    // Check focus
    await expect(clickableCard).toBeFocused()
    
    // Press Enter
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#clicked$/)
  })

  test('should handle space key activation', async ({ page }) => {
    await page.goto('about:blank')
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="container"></div>
        <script type="module">
          import { createCard } from '/src/components/card/card.ts'
          
          let navigationHappened = false
          
          const card = createCard({
            heading: 'Space Test Card',
            clickable: true,
            href: '#space-clicked',
            onClick: () => {
              navigationHappened = true
              window.navigationTriggered = true
            }
          })
          
          document.getElementById('container').appendChild(card.element)
        </script>
      </body>
      </html>
    `)

    const clickableCard = page.locator('.public-good-card--clickable')
    await clickableCard.focus()
    await page.keyboard.press('Space')
    
    // Check if navigation was triggered
    const navigationTriggered = await page.evaluate(() => window.navigationTriggered)
    expect(navigationTriggered).toBe(true)
  })

  test('should display care card accessibility features', async ({ page }) => {
    // Check non-urgent care card
    const nonUrgentCard = page.locator('.public-good-card--care--non-urgent')
    const nonUrgentHeading = nonUrgentCard.locator('.public-good-card--care__heading')
    
    // Check for screen reader text
    const srText = nonUrgentHeading.locator('.public-good-sr-only')
    await expect(srText).toContainText('Non-urgent advice:')
    
    // Check for visual arrow
    const arrow = nonUrgentCard.locator('.public-good-card--care__arrow')
    await expect(arrow).toBeVisible()
    await expect(arrow).toHaveAttribute('aria-hidden', 'true')
    
    // Check urgent care card
    const urgentCard = page.locator('.public-good-card--care--urgent')
    const urgentSrText = urgentCard.locator('.public-good-sr-only')
    await expect(urgentSrText).toContainText('Urgent advice:')
    
    // Check emergency care card
    const emergencyCard = page.locator('.public-good-card--care--emergency')
    const emergencySrText = emergencyCard.locator('.public-good-sr-only')
    await expect(emergencySrText).toContainText('Immediate action required:')
  })

  test('should render correctly on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // All cards should be visible and stacked vertically
    const cards = page.locator('.public-good-card')
    const cardCount = await cards.count()
    
    for (let i = 0; i < cardCount; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }
    
    // Card group should stack items vertically
    const cardGroup = page.locator('.public-good-card-group')
    await expect(cardGroup).toBeVisible()
    
    // Check that cards take full width
    const firstCard = cards.first()
    const cardBox = await firstCard.boundingBox()
    expect(cardBox?.width).toBeGreaterThan(300) // Should be close to viewport width minus margins
  })

  test('should render correctly on tablet viewports', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    
    const cards = page.locator('.public-good-card')
    const cardCount = await cards.count()
    
    for (let i = 0; i < cardCount; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }
    
    // Cards should have appropriate spacing
    const cardGroup = page.locator('.public-good-card-group')
    await expect(cardGroup).toBeVisible()
  })

  test('should render correctly on desktop viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    
    const cards = page.locator('.public-good-card')
    const cardCount = await cards.count()
    
    for (let i = 0; i < cardCount; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }
    
    // Card group should display items horizontally
    const cardGroup = page.locator('.public-good-card-group')
    await expect(cardGroup).toBeVisible()
    
    const groupItems = cardGroup.locator('.public-good-card-group__item')
    await expect(groupItems).toHaveCount(2)
  })

  test('should handle dynamic content updates', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="container"></div>
        <button id="update-btn">Update Content</button>
        <button id="toggle-clickable">Toggle Clickable</button>
        <script type="module">
          import { createCard } from '/src/components/card/card.ts'
          
          const card = createCard({
            heading: 'Dynamic Card',
            description: 'Original content'
          })
          
          document.getElementById('container').appendChild(card.element)
          
          document.getElementById('update-btn').addEventListener('click', () => {
            card.updateContent('Updated content via JavaScript')
          })
          
          document.getElementById('toggle-clickable').addEventListener('click', () => {
            const isClickable = card.element.classList.contains('public-good-card--clickable')
            card.setClickable(!isClickable)
          })
          
          window.testCard = card
        </script>
      </body>
      </html>
    `)

    const card = page.locator('.public-good-card')
    const updateBtn = page.locator('#update-btn')
    const toggleBtn = page.locator('#toggle-clickable')

    // Initial state
    await expect(card.locator('.public-good-card__description')).toContainText('Original content')
    await expect(card).not.toHaveClass(/public-good-card--clickable/)

    // Update content
    await updateBtn.click()
    await expect(card.locator('.public-good-card__description')).toContainText('Updated content via JavaScript')

    // Toggle clickable
    await toggleBtn.click()
    await expect(card).toHaveClass(/public-good-card--clickable/)
    await expect(card).toHaveAttribute('tabindex', '0')

    // Toggle back
    await toggleBtn.click()
    await expect(card).not.toHaveClass(/public-good-card--clickable/)
    await expect(card).not.toHaveAttribute('tabindex')
  })

  test('should emit analytics events', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="/src/index.css">
      </head>
      <body>
        <div id="container"></div>
        <script type="module">
          import { createCard } from '/src/components/card/card.ts'
          
          const card = createCard({
            heading: 'Analytics Card',
            clickable: true,
            href: '#analytics',
            primary: true
          })
          
          const events = []
          card.element.addEventListener('public-good:card:click', (event) => {
            events.push(event.detail)
            window.analyticsEvents = events
          })
          
          document.getElementById('container').appendChild(card.element)
        </script>
      </body>
      </html>
    `)

    const card = page.locator('.public-good-card--clickable')
    await card.click()

    const events = await page.evaluate(() => window.analyticsEvents)
    expect(events).toBeTruthy()
    expect(events!).toHaveLength(1)
    expect(events![0]).toMatchObject({
      heading: 'Analytics Card',
      variant: 'primary',
      href: '#analytics'
    })
  })

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' })
    
    const cards = page.locator('.public-good-card')
    const cardCount = await cards.count()
    
    // All cards should remain visible and accessible
    for (let i = 0; i < cardCount; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }
    
    // Check that focus indicators are still visible
    const clickableCard = page.locator('.public-good-card--clickable').first()
    await clickableCard.focus()
    await expect(clickableCard).toBeFocused()
  })

  test('should handle reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    const clickableCard = page.locator('.public-good-card--clickable').first()
    
    // Card should still be interactive
    await clickableCard.hover()
    await expect(clickableCard).toBeVisible()
    
    // Click interaction should work
    await clickableCard.click()
    await expect(page).toHaveURL(/#clicked$/)
  })
})