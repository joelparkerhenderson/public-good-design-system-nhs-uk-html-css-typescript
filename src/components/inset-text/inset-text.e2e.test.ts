/**
 * Inset Text Component E2E Tests
 * 
 * End-to-end tests for inset text display, accessibility, user interactions,
 * and visual behavior of the Inset Text component.
 */

import { test, expect } from '@playwright/test'

test.describe('Inset Text Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the inset text component test page
    await page.goto('/src/components/inset-text/examples/basic.html')
  })

  test.describe('Basic Display and Structure', () => {
    test('should display inset text with correct styling', async ({ page }) => {
      const insetText = page.locator('.public-good-inset-text').first()

      await expect(insetText).toBeVisible()
      await expect(insetText).toHaveClass(/public-good-inset-text/)
    })

    test('should have proper semantic structure', async ({ page }) => {
      const insetText = page.locator('.public-good-inset-text').first()
      const hiddenLabel = insetText.locator('.public-good-sr-only')
      const content = insetText.locator('.public-good-inset-text__content')

      await expect(hiddenLabel).toBeVisible({ visible: false })
      await expect(content).toBeVisible()
    })

    test('should display text content correctly', async ({ page }) => {
      const textInsetText = page.locator('.public-good-inset-text').filter({ hasText: /text content/i }).first()
      
      if (await textInsetText.count() > 0) {
        await expect(textInsetText).toBeVisible()
        await expect(textInsetText.locator('.public-good-inset-text__content')).toHaveText(/\w+/)
      }
    })

    test('should display HTML content correctly', async ({ page }) => {
      const htmlInsetText = page.locator('.public-good-inset-text').filter({ has: page.locator('strong, em, a') }).first()
      
      if (await htmlInsetText.count() > 0) {
        await expect(htmlInsetText).toBeVisible()
        await expect(htmlInsetText.locator('.public-good-inset-text__content')).toBeVisible()
      }
    })
  })

  test.describe('Variants and Styling', () => {
    test('should display health variant with correct styling', async ({ page }) => {
      const healthInsetText = page.locator('.public-good-inset-text--health').first()
      
      if (await healthInsetText.count() > 0) {
        await expect(healthInsetText).toBeVisible()
        await expect(healthInsetText).toHaveClass(/public-good-inset-text--health/)
      }
    })

    test('should display warning variant with correct styling', async ({ page }) => {
      const warningInsetText = page.locator('.public-good-inset-text--warning').first()
      
      if (await warningInsetText.count() > 0) {
        await expect(warningInsetText).toBeVisible()
        await expect(warningInsetText).toHaveClass(/public-good-inset-text--warning/)
      }
    })

    test('should handle responsive design', async ({ page }) => {
      const insetText = page.locator('.public-good-inset-text').first()
      
      // Desktop view
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(insetText).toBeVisible()
      
      // Tablet view
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(insetText).toBeVisible()
      
      // Mobile view
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(insetText).toBeVisible()
    })

    test('should apply custom classes correctly', async ({ page }) => {
      const customInsetText = page.locator('.public-good-inset-text.custom-class').first()
      
      if (await customInsetText.count() > 0) {
        await expect(customInsetText).toHaveClass(/custom-class/)
      }
    })
  })

  test.describe('Accessibility', () => {
    test('should have hidden labels for screen readers', async ({ page }) => {
      const insetTexts = page.locator('.public-good-inset-text')
      const count = await insetTexts.count()

      for (let i = 0; i < count; i++) {
        const insetText = insetTexts.nth(i)
        const hiddenLabel = insetText.locator('.public-good-sr-only')
        
        await expect(hiddenLabel).toBeVisible({ visible: false })
        
        const labelText = await hiddenLabel.textContent()
        expect(labelText).toBeTruthy()
        expect(labelText?.length).toBeGreaterThan(0)
      }
    })

    test('should support keyboard navigation within content', async ({ page }) => {
      const insetTextWithLinks = page.locator('.public-good-inset-text').filter({ has: page.locator('a') }).first()
      
      if (await insetTextWithLinks.count() > 0) {
        const link = insetTextWithLinks.locator('a').first()
        
        await link.focus()
        await expect(link).toBeFocused()
        
        // Test Enter key activation
        await link.press('Enter')
        // Note: We're just testing the focus behavior, not actual navigation
      }
    })

    test('should have proper color contrast', async ({ page }) => {
      const insetTexts = page.locator('.public-good-inset-text')
      const count = await insetTexts.count()

      for (let i = 0; i < count; i++) {
        const insetText = insetTexts.nth(i)
        await expect(insetText).toBeVisible()
        
        // Check that text is visible and readable
        const content = insetText.locator('.public-good-inset-text__content')
        await expect(content).toBeVisible()
        
        const styles = await content.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          }
        })
        
        expect(styles.color).toBeTruthy()
      }
    })

    test('should work with screen readers', async ({ page }) => {
      const insetText = page.locator('.public-good-inset-text').first()
      
      // Check that content is accessible to screen readers
      const textContent = await insetText.textContent()
      expect(textContent).toBeTruthy()
      expect(textContent?.length).toBeGreaterThan(0)
      
      // Verify hidden label is present but not visible
      const hiddenLabel = insetText.locator('.public-good-sr-only')
      await expect(hiddenLabel).toBeAttached()
      
      // Check that the hidden label is not visible but readable by screen readers
      const isVisible = await hiddenLabel.isVisible()
      expect(isVisible).toBe(false)
    })

    test('should support high contrast mode', async ({ page }) => {
      // Simulate high contrast mode
      await page.emulateMedia({ forcedColors: 'active' })
      
      const insetText = page.locator('.public-good-inset-text').first()
      await expect(insetText).toBeVisible()
      
      // Reset to normal mode
      await page.emulateMedia({ forcedColors: 'none' })
      await expect(insetText).toBeVisible()
    })
  })

  test.describe('Content and Links', () => {
    test('should display and interact with links correctly', async ({ page }) => {
      const insetTextWithLinks = page.locator('.public-good-inset-text').filter({ has: page.locator('a') }).first()
      
      if (await insetTextWithLinks.count() > 0) {
        const links = insetTextWithLinks.locator('a')
        const linkCount = await links.count()
        
        for (let i = 0; i < linkCount; i++) {
          const link = links.nth(i)
          await expect(link).toBeVisible()
          
          // Check link has proper attributes
          const href = await link.getAttribute('href')
          expect(href).toBeTruthy()
          
          // Check link styling
          await link.hover()
          await expect(link).toBeVisible()
        }
      }
    })

    test('should display formatted text correctly', async ({ page }) => {
      const insetTextWithFormatting = page.locator('.public-good-inset-text').filter({ 
        has: page.locator('strong, em, b, i') 
      }).first()
      
      if (await insetTextWithFormatting.count() > 0) {
        await expect(insetTextWithFormatting).toBeVisible()
        
        // Check that formatting elements are present and visible
        const formattingElements = insetTextWithFormatting.locator('strong, em, b, i')
        const formattingCount = await formattingElements.count()
        
        for (let i = 0; i < formattingCount; i++) {
          const element = formattingElements.nth(i)
          await expect(element).toBeVisible()
        }
      }
    })

    test('should handle lists within inset text', async ({ page }) => {
      const insetTextWithLists = page.locator('.public-good-inset-text').filter({ 
        has: page.locator('ul, ol') 
      }).first()
      
      if (await insetTextWithLists.count() > 0) {
        await expect(insetTextWithLists).toBeVisible()
        
        const lists = insetTextWithLists.locator('ul, ol')
        const listCount = await lists.count()
        
        for (let i = 0; i < listCount; i++) {
          const list = lists.nth(i)
          await expect(list).toBeVisible()
          
          const listItems = list.locator('li')
          const itemCount = await listItems.count()
          expect(itemCount).toBeGreaterThan(0)
          
          for (let j = 0; j < itemCount; j++) {
            const item = listItems.nth(j)
            await expect(item).toBeVisible()
          }
        }
      }
    })
  })

  test.describe('Dynamic Behavior', () => {
    test('should update content dynamically', async ({ page }) => {
      // Add a test inset text and update button
      await page.evaluate(() => {
        const container = document.createElement('div')
        container.innerHTML = `
          <div class="public-good-inset-text" id="dynamic-inset">
            <span class="public-good-sr-only">Information: </span>
            <div class="public-good-inset-text__content">Original content</div>
          </div>
          <button id="update-content">Update Content</button>
        `
        document.body.appendChild(container)
        
        // Add update functionality
        const button = document.getElementById('update-content')
        const content = document.querySelector('#dynamic-inset .public-good-inset-text__content')
        
        button?.addEventListener('click', () => {
          if (content) {
            content.textContent = 'Updated content'
          }
        })
      })

      const updateButton = page.locator('#update-content')
      const dynamicInset = page.locator('#dynamic-inset')
      const content = dynamicInset.locator('.public-good-inset-text__content')
      
      // Check original content
      await expect(content).toHaveText('Original content')
      
      // Click update button
      await updateButton.click()
      
      // Check updated content
      await expect(content).toHaveText('Updated content')
    })

    test('should handle content with special characters', async ({ page }) => {
      // Add inset text with special characters
      await page.evaluate(() => {
        const container = document.createElement('div')
        container.innerHTML = `
          <div class="public-good-inset-text">
            <span class="public-good-sr-only">Information: </span>
            <div class="public-good-inset-text__content">Content with "quotes", 'apostrophes', & ampersands, <em>and</em> HTML entities: &lt;test&gt;</div>
          </div>
        `
        document.body.appendChild(container)
      })

      const specialInset = page.locator('.public-good-inset-text').last()
      await expect(specialInset).toBeVisible()
      
      const content = specialInset.locator('.public-good-inset-text__content')
      await expect(content).toBeVisible()
      
      const textContent = await content.textContent()
      expect(textContent).toContain('"quotes"')
      expect(textContent).toContain("'apostrophes'")
      expect(textContent).toContain('& ampersands')
      expect(textContent).toContain('<test>')
    })
  })

  test.describe('Visual Appearance', () => {
    test('should have consistent visual styling', async ({ page }) => {
      const insetTexts = page.locator('.public-good-inset-text')
      const count = await insetTexts.count()

      for (let i = 0; i < count; i++) {
        const insetText = insetTexts.nth(i)
        await expect(insetText).toBeVisible()
        
        // Check basic styling properties
        const styles = await insetText.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            display: computed.display,
            padding: computed.padding,
            marginTop: computed.marginTop,
            marginBottom: computed.marginBottom,
            borderLeft: computed.borderLeft
          }
        })
        
        expect(styles.display).toBeTruthy()
        expect(styles.padding).toBeTruthy()
        expect(styles.borderLeft).toBeTruthy()
      }
    })

    test('should handle overflow content gracefully', async ({ page }) => {
      // Add inset text with very long content
      await page.evaluate(() => {
        const longContent = 'This is a very long piece of content that should test how the inset text component handles overflow and wrapping. '.repeat(10)
        const container = document.createElement('div')
        container.innerHTML = `
          <div class="public-good-inset-text">
            <span class="public-good-sr-only">Information: </span>
            <div class="public-good-inset-text__content">${longContent}</div>
          </div>
        `
        document.body.appendChild(container)
      })

      const longInset = page.locator('.public-good-inset-text').last()
      await expect(longInset).toBeVisible()
      
      // Check that content is still readable and properly contained
      const content = longInset.locator('.public-good-inset-text__content')
      await expect(content).toBeVisible()
    })

    test('should maintain layout in different contexts', async ({ page }) => {
      // Test inset text within different parent containers
      await page.evaluate(() => {
        const contexts = [
          '<div style="width: 300px;">',
          '<div style="width: 800px;">',
          '<div style="max-width: 100%; overflow: hidden;">'
        ]
        
        contexts.forEach((context, index) => {
          const container = document.createElement('div')
          container.innerHTML = `
            ${context}
              <div class="public-good-inset-text context-test-${index}">
                <span class="public-good-sr-only">Information: </span>
                <div class="public-good-inset-text__content">Content in different layout context ${index + 1}</div>
              </div>
            </div>
          `
          document.body.appendChild(container)
        })
      })

      // Check all context tests
      for (let i = 0; i < 3; i++) {
        const contextInset = page.locator(`.context-test-${i}`)
        await expect(contextInset).toBeVisible()
      }
    })
  })

  test.describe('Performance and Load Times', () => {
    test('should load and render quickly', async ({ page }) => {
      const startTime = Date.now()
      
      // Wait for all inset text components to be visible
      await page.waitForSelector('.public-good-inset-text', { state: 'visible' })
      
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
      
      const insetTexts = page.locator('.public-good-inset-text')
      const count = await insetTexts.count()

      for (let i = 0; i < count; i++) {
        const insetText = insetTexts.nth(i)
        await expect(insetText).toBeVisible()
      }
      
      // Reset to screen media
      await page.emulateMedia({ media: 'screen' })
    })
  })
})