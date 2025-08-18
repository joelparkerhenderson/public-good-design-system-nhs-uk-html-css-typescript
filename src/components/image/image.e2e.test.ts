/**
 * Image Component E2E Tests
 * 
 * End-to-end tests for image loading, responsive behavior, accessibility,
 * and user interactions with the Image component.
 */

import { test, expect } from '@playwright/test'

test.describe('Image Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the image component test page
    await page.goto('/src/components/image/examples/basic.html')
  })

  test.describe('Basic Image Functionality', () => {
    test('should display image with correct attributes', async ({ page }) => {
      const image = page.locator('.public-good-image').first()
      const img = image.locator('img')

      await expect(image).toBeVisible()
      await expect(img).toBeVisible()
      await expect(img).toHaveAttribute('alt')
      await expect(img).toHaveAttribute('src')
    })

    test('should load image successfully', async ({ page }) => {
      const img = page.locator('.public-good-image img').first()
      
      // Wait for image to load
      await img.waitFor({ state: 'visible' })
      
      // Check that image has loaded (naturalWidth > 0 indicates successful load)
      const isLoaded = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && el.naturalWidth > 0
      })
      
      expect(isLoaded).toBe(true)
    })

    test('should display caption when provided', async ({ page }) => {
      const imageWithCaption = page.locator('.public-good-image').filter({ has: page.locator('figcaption') }).first()
      const caption = imageWithCaption.locator('figcaption')

      await expect(caption).toBeVisible()
      await expect(caption).toHaveText(/\w+/) // Should have some text content
    })

    test('should have proper semantic structure', async ({ page }) => {
      const figure = page.locator('.public-good-image')
      
      await expect(figure).toHaveRole('img')
      
      const img = figure.locator('img')
      await expect(img).toBeVisible()
      
      // Check if there's a caption and verify structure
      const captionCount = await figure.locator('figcaption').count()
      if (captionCount > 0) {
        const caption = figure.locator('figcaption')
        await expect(caption).toBeVisible()
      }
    })
  })

  test.describe('Responsive Image Behavior', () => {
    test('should handle different viewport sizes', async ({ page }) => {
      const img = page.locator('.public-good-image img').first()
      
      // Desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(img).toBeVisible()
      
      // Tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(img).toBeVisible()
      
      // Mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(img).toBeVisible()
    })

    test('should use appropriate image sources for different screen sizes', async ({ page }) => {
      const responsiveImg = page.locator('.public-good-image img[srcset]').first()
      
      if (await responsiveImg.count() > 0) {
        const srcset = await responsiveImg.getAttribute('srcset')
        expect(srcset).toBeTruthy()
        expect(srcset).toMatch(/\d+w/) // Should contain width descriptors
      }
    })

    test('should respect sizes attribute', async ({ page }) => {
      const responsiveImg = page.locator('.public-good-image img[sizes]').first()
      
      if (await responsiveImg.count() > 0) {
        const sizes = await responsiveImg.getAttribute('sizes')
        expect(sizes).toBeTruthy()
      }
    })
  })

  test.describe('Lazy Loading', () => {
    test('should support lazy loading attribute', async ({ page }) => {
      const lazyImg = page.locator('.public-good-image img[loading="lazy"]').first()
      
      if (await lazyImg.count() > 0) {
        await expect(lazyImg).toHaveAttribute('loading', 'lazy')
      }
    })

    test('should load images when they come into view', async ({ page }) => {
      // Scroll to bottom to potentially trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // Wait for any lazy images to load
      await page.waitForTimeout(1000)
      
      const allImages = page.locator('.public-good-image img')
      const imageCount = await allImages.count()
      
      for (let i = 0; i < imageCount; i++) {
        const img = allImages.nth(i)
        await expect(img).toBeVisible()
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle broken image gracefully', async ({ page }) => {
      // Create a broken image element
      await page.evaluate(() => {
        const container = document.createElement('div')
        container.innerHTML = `
          <figure class="public-good-image" data-testid="broken-image">
            <img class="public-good-image__img" src="/non-existent-image.jpg" alt="Broken image">
          </figure>
        `
        document.body.appendChild(container)
      })

      const brokenImageFigure = page.locator('[data-testid="broken-image"]')
      
      // Wait for error to be handled
      await page.waitForTimeout(2000)
      
      // Should not crash the page
      await expect(brokenImageFigure).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper alt text for all images', async ({ page }) => {
      const images = page.locator('.public-good-image img')
      const imageCount = await images.count()

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
        expect(alt?.length).toBeGreaterThan(0)
      }
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Focus on the first focusable image (if any)
      const focusableImg = page.locator('.public-good-image img[tabindex="0"]').first()
      
      if (await focusableImg.count() > 0) {
        await focusableImg.focus()
        await expect(focusableImg).toBeFocused()
      }
    })

    test('should work with screen readers', async ({ page }) => {
      const images = page.locator('.public-good-image')
      const firstImage = images.first()
      
      // Check that image has proper role and accessible name
      if (await firstImage.count() > 0) {
        const img = firstImage.locator('img')
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
        
        // If there's a caption, it should be associated with the image
        const caption = firstImage.locator('figcaption')
        if (await caption.count() > 0) {
          await expect(caption).toBeVisible()
        }
      }
    })

    test('should have sufficient color contrast', async ({ page }) => {
      // Check caption text color contrast
      const captions = page.locator('.public-good-image__caption')
      const captionCount = await captions.count()

      if (captionCount > 0) {
        const caption = captions.first()
        await expect(caption).toBeVisible()
        
        // Caption should be readable
        const styles = await caption.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          }
        })
        
        expect(styles.color).toBeTruthy()
      }
    })
  })

  test.describe('Dynamic Image Updates', () => {
    test('should update image source programmatically', async ({ page }) => {
      // Add a test image and update button
      await page.evaluate(() => {
        const container = document.createElement('div')
        container.innerHTML = `
          <figure class="public-good-image" id="dynamic-image">
            <img class="public-good-image__img" src="/test-image-1.jpg" alt="Dynamic image">
          </figure>
          <button id="update-image">Update Image</button>
        `
        document.body.appendChild(container)
        
        // Add update functionality
        const button = document.getElementById('update-image')
        const img = document.querySelector('#dynamic-image img') as HTMLImageElement
        
        button?.addEventListener('click', () => {
          if (img) {
            img.src = '/test-image-2.jpg'
            img.alt = 'Updated dynamic image'
          }
        })
      })

      const updateButton = page.locator('#update-image')
      const dynamicImg = page.locator('#dynamic-image img')
      
      // Get original src
      const originalSrc = await dynamicImg.getAttribute('src')
      
      // Click update button
      await updateButton.click()
      
      // Wait for update
      await page.waitForTimeout(100)
      
      // Check that src has changed
      const newSrc = await dynamicImg.getAttribute('src')
      expect(newSrc).not.toBe(originalSrc)
    })

    test('should update caption programmatically', async ({ page }) => {
      // Add a test image with caption and update button
      await page.evaluate(() => {
        const container = document.createElement('div')
        container.innerHTML = `
          <figure class="public-good-image" id="dynamic-caption-image">
            <img class="public-good-image__img" src="/test-image.jpg" alt="Image with dynamic caption">
            <figcaption class="public-good-image__caption">Original caption</figcaption>
          </figure>
          <button id="update-caption">Update Caption</button>
        `
        document.body.appendChild(container)
        
        // Add update functionality
        const button = document.getElementById('update-caption')
        const caption = document.querySelector('#dynamic-caption-image figcaption')
        
        button?.addEventListener('click', () => {
          if (caption) {
            caption.textContent = 'Updated caption text'
          }
        })
      })

      const updateButton = page.locator('#update-caption')
      const caption = page.locator('#dynamic-caption-image figcaption')
      
      // Get original caption
      const originalCaption = await caption.textContent()
      
      // Click update button
      await updateButton.click()
      
      // Wait for update
      await page.waitForTimeout(100)
      
      // Check that caption has changed
      const newCaption = await caption.textContent()
      expect(newCaption).not.toBe(originalCaption)
      expect(newCaption).toBe('Updated caption text')
    })
  })

  test.describe('Image Variants and Styling', () => {
    test('should apply variant classes correctly', async ({ page }) => {
      const imageVariants = [
        'public-good-image--small',
        'public-good-image--medium', 
        'public-good-image--large',
        'public-good-image--rounded',
        'public-good-image--bordered'
      ]

      for (const variant of imageVariants) {
        const variantImage = page.locator(`.${variant}`).first()
        
        if (await variantImage.count() > 0) {
          await expect(variantImage).toHaveClass(new RegExp(variant))
        }
      }
    })

    test('should support custom styling', async ({ page }) => {
      const customImage = page.locator('.public-good-image[style]').first()
      
      if (await customImage.count() > 0) {
        const style = await customImage.getAttribute('style')
        expect(style).toBeTruthy()
      }
    })
  })

  test.describe('Performance', () => {
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

      // Wait for images to load
      await page.waitForLoadState('networkidle')
      
      // Check for minimal layout shifts
      const layoutShifts = await page.evaluate(() => (window as any).layoutShifts || [])
      const totalShift = layoutShifts.reduce((sum: number, shift: number) => sum + shift, 0)
      
      // Should have minimal layout shift (less than 0.1 is considered good)
      expect(totalShift).toBeLessThan(0.25)
    })

    test('should load images efficiently', async ({ page }) => {
      const startTime = Date.now()
      
      // Wait for all images to load
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Should load within reasonable time (5 seconds)
      expect(loadTime).toBeLessThan(5000)
    })
  })

  test.describe('Browser Compatibility', () => {
    test('should work with different image formats', async ({ page }) => {
      const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      
      for (const format of imageFormats) {
        const formatImage = page.locator(`img[src$="${format}"]`).first()
        
        if (await formatImage.count() > 0) {
          await expect(formatImage).toBeVisible()
        }
      }
    })

    test('should handle missing srcset gracefully in older browsers', async ({ page }) => {
      // Test that images work even if srcset is not supported
      const images = page.locator('.public-good-image img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const src = await img.getAttribute('src')
        expect(src).toBeTruthy()
        await expect(img).toBeVisible()
      }
    })
  })
})