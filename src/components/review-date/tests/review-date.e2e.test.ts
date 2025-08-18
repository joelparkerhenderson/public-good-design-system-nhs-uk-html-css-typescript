import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { 
  createReviewDate, 
  createSimpleReviewDate,
  createShortReviewDate,
  createCustomReviewDate,
  createLastReviewedOnly,
  calculateNextReview,
  isDueForReview,
  initializeReviewDates,
  type ReviewDateConfig 
} from '../review-date'

// Mock DOM utilities
vi.mock('../../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-e2e-test`)
}))

describe('Review Date Component E2E Tests', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    container = document.createElement('div')
    container.id = 'test-container'
    document.body.appendChild(container)
    
    // Clear any existing event listeners
    document.removeEventListener('DOMContentLoaded', initializeReviewDates)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('Real-world Usage Scenarios', () => {
    test('should display review date for NHS article page', () => {
      const config: ReviewDateConfig = {
        id: 'article-review-date',
        lastReviewed: '2023-03-15',
        nextReview: '2026-03-15',
        prefix: 'Page',
        dateFormat: 'long',
        locale: 'en-GB'
      }

      const reviewDate = createReviewDate(config)
      container.appendChild(reviewDate.element)

      // Check the full content matches NHS pattern
      const content = reviewDate.element.innerHTML
      expect(content).toContain('Page last reviewed: 15 March 2023')
      expect(content).toContain('Next review due: 15 March 2026')
      expect(content).toContain('<br>')

      // Check element structure
      expect(reviewDate.element.tagName).toBe('P')
      expect(reviewDate.element.className).toBe('public-good-review-date')
      expect(reviewDate.element.id).toBe('article-review-date')
    })

    test('should display simple footer review date', () => {
      const reviewDate = createSimpleReviewDate('2023-06-01', '2026-06-01')
      container.appendChild(reviewDate.element)

      // Should have NHS styling classes
      const classes = reviewDate.element.className
      expect(classes).toContain('public-good-body-s')
      expect(classes).toContain('public-good-u-secondary-text-color')
      expect(classes).toContain('public-good-u-margin-top-7')
      expect(classes).toContain('public-good-u-margin-bottom-0')

      // Content should be properly formatted
      expect(reviewDate.element.innerHTML).toContain('1 June 2023')
      expect(reviewDate.element.innerHTML).toContain('1 June 2026')
    })

    test('should handle guidance document with short dates', () => {
      const reviewDate = createShortReviewDate('2023-12-25', '2024-12-25', {
        prefix: 'Guidance',
        classes: 'guidance-review-date'
      })
      container.appendChild(reviewDate.element)

      expect(reviewDate.element.innerHTML).toContain('Guidance last reviewed: 25 Dec 2023')
      expect(reviewDate.element.innerHTML).toContain('Next review due: 25 Dec 2024')
      expect(reviewDate.element.classList.contains('guidance-review-date')).toBe(true)
    })

    test('should display policy document with last reviewed only', () => {
      const reviewDate = createLastReviewedOnly('2023-09-10', {
        classes: 'policy-review-date',
        attributes: { 'data-document-type': 'policy' }
      })
      container.appendChild(reviewDate.element)

      expect(reviewDate.element.innerHTML).toContain('Last updated: 10 September 2023')
      expect(reviewDate.element.innerHTML).not.toContain('Next review due')
      expect(reviewDate.element.getAttribute('data-document-type')).toBe('policy')
    })

    test('should handle international content with different locale', () => {
      const reviewDate = createCustomReviewDate(
        '2023-07-04',
        '2026-07-04',
        { year: 'numeric', month: 'long', day: 'numeric' },
        { locale: 'cy-GB', prefix: 'Tudalen' } // Welsh
      )
      container.appendChild(reviewDate.element)

      const content = reviewDate.element.innerHTML
      expect(content).toContain('Tudalen last reviewed:')
      // Content should use Welsh locale formatting
      expect(content).toContain('2023')
    })
  })

  describe('Dynamic Content Management', () => {
    test('should update review dates dynamically', () => {
      const reviewDate = createReviewDate({
        lastReviewed: '2023-01-01',
        nextReview: '2026-01-01'
      })
      container.appendChild(reviewDate.element)

      // Initial state
      expect(reviewDate.element.innerHTML).toContain('1 January 2023')
      expect(reviewDate.element.innerHTML).toContain('1 January 2026')

      // Update last reviewed
      reviewDate.updateLastReviewed('2023-06-15')
      expect(reviewDate.element.innerHTML).toContain('15 June 2023')
      expect(reviewDate.element.innerHTML).toContain('1 January 2026') // Should remain unchanged

      // Update next review
      reviewDate.updateNextReview('2026-06-15')
      expect(reviewDate.element.innerHTML).toContain('15 June 2023')
      expect(reviewDate.element.innerHTML).toContain('15 June 2026')
    })

    test('should change date format dynamically', () => {
      const reviewDate = createReviewDate({
        lastReviewed: '2023-08-20',
        dateFormat: 'long'
      })
      container.appendChild(reviewDate.element)

      // Initial long format
      expect(reviewDate.element.innerHTML).toContain('20 August 2023')

      // Change to short format
      reviewDate.setDateFormat('short')
      expect(reviewDate.element.innerHTML).toContain('20 Aug 2023')

      // Change to custom format
      reviewDate.setDateFormat('custom', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      })
      expect(reviewDate.element.innerHTML).toContain('20/08/2023')
    })

    test('should handle programmatic content updates', () => {
      const config: ReviewDateConfig = {
        lastReviewed: '2023-01-15'
      }

      const reviewDate = createReviewDate(config)
      container.appendChild(reviewDate.element)

      // Simulate content management system update
      const newLastReviewed = calculateNextReview('2023-01-15', 6) // 6 months later
      reviewDate.updateLastReviewed(newLastReviewed)

      // Calculate and set next review
      const newNextReview = calculateNextReview(newLastReviewed, 36)
      reviewDate.updateNextReview(newNextReview)

      // Verify updates
      expect(reviewDate.element.innerHTML).toContain('July 2023')
      expect(reviewDate.element.innerHTML).toContain('July 2026')
    })
  })

  describe('Event Integration', () => {
    test('should handle content management system events', () => {
      const reviewDate = createReviewDate({
        id: 'cms-review-date',
        lastReviewed: '2023-01-01'
      })
      container.appendChild(reviewDate.element)

      let lastReviewedEvents = 0
      let nextReviewEvents = 0
      let formatEvents = 0

      // Listen for all custom events
      reviewDate.element.addEventListener('public-good:review-date:last-reviewed-changed', () => {
        lastReviewedEvents++
      })

      reviewDate.element.addEventListener('public-good:review-date:next-review-changed', () => {
        nextReviewEvents++
      })

      reviewDate.element.addEventListener('public-good:review-date:format-changed', () => {
        formatEvents++
      })

      // Simulate CMS updates
      reviewDate.updateLastReviewed('2023-06-01')
      reviewDate.updateNextReview('2026-06-01')
      reviewDate.setDateFormat('short')

      expect(lastReviewedEvents).toBe(1)
      expect(nextReviewEvents).toBe(1)
      expect(formatEvents).toBe(1)
    })

    test('should integrate with form submission workflows', () => {
      // Create a mock form for content management
      const form = document.createElement('form')
      form.innerHTML = `
        <input type="hidden" name="document-id" value="NHS-001">
        <input type="date" name="last-reviewed" value="2023-01-15">
        <input type="date" name="next-review" value="2026-01-15">
        <select name="date-format">
          <option value="long" selected>Long format</option>
          <option value="short">Short format</option>
        </select>
      `

      const reviewDate = createReviewDate({
        lastReviewed: '2023-01-15',
        nextReview: '2026-01-15'
      })

      form.appendChild(reviewDate.element)
      container.appendChild(form)

      // Simulate form update
      const lastReviewedInput = form.querySelector('[name="last-reviewed"]') as HTMLInputElement
      lastReviewedInput.value = '2023-07-15'

      const nextReviewInput = form.querySelector('[name="next-review"]') as HTMLInputElement
      nextReviewInput.value = '2026-07-15'

      // Update component based on form
      reviewDate.updateLastReviewed(lastReviewedInput.value)
      reviewDate.updateNextReview(nextReviewInput.value)

      expect(reviewDate.element.innerHTML).toContain('15 July 2023')
      expect(reviewDate.element.innerHTML).toContain('15 July 2026')

      // Test form data extraction
      const formData = new FormData(form)
      expect(formData.get('document-id')).toBe('NHS-001')
      expect(formData.get('last-reviewed')).toBe('2023-07-15')
      expect(formData.get('next-review')).toBe('2026-07-15')
    })
  })

  describe('Content Review Workflows', () => {
    test('should support content review warning system', () => {
      const today = new Date()
      const oneMonthFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
      const sixMonthsAgo = new Date(today.getTime() - (180 * 24 * 60 * 60 * 1000))

      const config: ReviewDateConfig = {
        lastReviewed: sixMonthsAgo,
        nextReview: oneMonthFromNow,
        classes: 'review-warning'
      }

      const reviewDate = createReviewDate(config)
      container.appendChild(reviewDate.element)

      // Check if review is due soon (30 day warning)
      const isDue = isDueForReview(config.nextReview!, 45)
      expect(isDue).toBe(true)

      // Should have warning class
      expect(reviewDate.element.classList.contains('review-warning')).toBe(true)

      // Content should show proper dates
      expect(reviewDate.element.innerHTML).toContain(sixMonthsAgo.getFullYear().toString())
      expect(reviewDate.element.innerHTML).toContain(oneMonthFromNow.getFullYear().toString())
    })

    test('should handle overdue content detection', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

      const config: ReviewDateConfig = {
        lastReviewed: twoYearsAgo,
        nextReview: yesterday,
        classes: 'review-overdue',
        attributes: { 'data-status': 'overdue' }
      }

      const reviewDate = createReviewDate(config)
      container.appendChild(reviewDate.element)

      // Check if content is overdue
      const isOverdue = isDueForReview(config.nextReview!)
      expect(isOverdue).toBe(true)

      // Should have overdue indicators
      expect(reviewDate.element.classList.contains('review-overdue')).toBe(true)
      expect(reviewDate.element.getAttribute('data-status')).toBe('overdue')
    })

    test('should calculate review schedules automatically', () => {
      const lastReviewed = new Date('2023-01-15')
      
      // Test different review frequencies
      const annualReview = calculateNextReview(lastReviewed, 12)
      const biannualReview = calculateNextReview(lastReviewed, 6)
      const triannualReview = calculateNextReview(lastReviewed, 36)

      expect(annualReview.getFullYear()).toBe(2024)
      expect(biannualReview.getFullYear()).toBe(2023)
      expect(biannualReview.getMonth()).toBe(6) // July (0-based)
      expect(triannualReview.getFullYear()).toBe(2026)

      // Create review date with calculated schedule
      const reviewDate = createReviewDate({
        lastReviewed: lastReviewed,
        nextReview: triannualReview
      })
      container.appendChild(reviewDate.element)

      expect(reviewDate.element.innerHTML).toContain('15 January 2023')
      expect(reviewDate.element.innerHTML).toContain('15 January 2026')
    })
  })

  describe('Accessibility and Screen Reader Support', () => {
    test('should provide accessible content structure', () => {
      const reviewDate = createReviewDate({
        id: 'accessible-review-date',
        lastReviewed: '2023-05-10',
        nextReview: '2026-05-10',
        attributes: { 
          'role': 'status',
          'aria-label': 'Page review information' 
        }
      })
      container.appendChild(reviewDate.element)

      // Check semantic structure
      expect(reviewDate.element.tagName).toBe('P')
      expect(reviewDate.element.getAttribute('role')).toBe('status')
      expect(reviewDate.element.getAttribute('aria-label')).toBe('Page review information')

      // Content should be clearly structured for screen readers
      const content = reviewDate.element.innerHTML
      expect(content).toContain('Page last reviewed: 10 May 2023')
      expect(content).toContain('Next review due: 10 May 2026')
    })

    test('should support screen reader announcements on updates', () => {
      const reviewDate = createReviewDate({
        lastReviewed: '2023-01-01',
        attributes: { 'aria-live': 'polite' }
      })
      container.appendChild(reviewDate.element)

      expect(reviewDate.element.getAttribute('aria-live')).toBe('polite')

      // When content updates, screen readers should announce changes
      reviewDate.updateLastReviewed('2023-06-01')
      
      // The aria-live region should contain the updated content
      expect(reviewDate.element.innerHTML).toContain('1 June 2023')
    })

    test('should work with keyboard navigation', () => {
      const reviewDate = createReviewDate({
        lastReviewed: '2023-01-01',
        attributes: { 'tabindex': '0' }
      })
      container.appendChild(reviewDate.element)

      // Element should be focusable
      reviewDate.element.focus()
      expect(document.activeElement).toBe(reviewDate.element)

      // Should have appropriate focus indicators (handled by CSS)
      expect(reviewDate.element.getAttribute('tabindex')).toBe('0')
    })
  })

  describe('Page Integration Scenarios', () => {
    test('should work in article footer', () => {
      // Create a typical NHS article structure
      const article = document.createElement('article')
      article.innerHTML = `
        <header>
          <h1>NHS Article Title</h1>
        </header>
        <main>
          <p>Article content goes here...</p>
        </main>
        <footer>
        </footer>
      `

      const footer = article.querySelector('footer')!
      const reviewDate = createSimpleReviewDate('2023-04-20', '2026-04-20')
      footer.appendChild(reviewDate.element)
      
      container.appendChild(article)

      // Should be properly integrated in footer
      const footerReviewDate = footer.querySelector('.public-good-review-date')
      expect(footerReviewDate).toBeTruthy()
      expect(footerReviewDate?.innerHTML).toContain('20 April 2023')
    })

    test('should work in guidance document sidebar', () => {
      // Create guidance page structure
      const page = document.createElement('div')
      page.className = 'guidance-page'
      page.innerHTML = `
        <aside class="sidebar">
          <h2>Document information</h2>
        </aside>
        <main class="content">
          <h1>Guidance Document</h1>
        </main>
      `

      const sidebar = page.querySelector('.sidebar')!
      const reviewDate = createShortReviewDate('2023-11-01', '2024-11-01', {
        prefix: 'Document',
        classes: 'sidebar-review-date'
      })
      sidebar.appendChild(reviewDate.element)
      
      container.appendChild(page)

      // Should be properly integrated in sidebar
      const sidebarReviewDate = sidebar.querySelector('.public-good-review-date')
      expect(sidebarReviewDate).toBeTruthy()
      expect(sidebarReviewDate?.classList.contains('sidebar-review-date')).toBe(true)
      expect(sidebarReviewDate?.innerHTML).toContain('Document last reviewed: 1 Nov 2023')
    })

    test('should work with multiple review dates on same page', () => {
      // Create page with multiple documents
      const page = document.createElement('div')
      page.innerHTML = `
        <section data-document="policy">
          <h2>Policy Document</h2>
        </section>
        <section data-document="guidance">
          <h2>Guidance Document</h2>
        </section>
      `

      const policySection = page.querySelector('[data-document="policy"]')!
      const guidanceSection = page.querySelector('[data-document="guidance"]')!

      const policyReviewDate = createReviewDate({
        id: 'policy-review',
        lastReviewed: '2023-01-15',
        nextReview: '2024-01-15',
        prefix: 'Policy'
      })

      const guidanceReviewDate = createReviewDate({
        id: 'guidance-review',
        lastReviewed: '2023-06-01',
        nextReview: '2026-06-01',
        prefix: 'Guidance'
      })

      policySection.appendChild(policyReviewDate.element)
      guidanceSection.appendChild(guidanceReviewDate.element)
      container.appendChild(page)

      // Both should be independent and functional
      expect(document.getElementById('policy-review')).toBeTruthy()
      expect(document.getElementById('guidance-review')).toBeTruthy()

      expect(policyReviewDate.element.innerHTML).toContain('Policy last reviewed')
      expect(guidanceReviewDate.element.innerHTML).toContain('Guidance last reviewed')
    })
  })

  describe('Data Attribute Auto-initialization', () => {
    test('should auto-initialize from HTML in real page context', () => {
      // Simulate a real page with review date markup
      document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>NHS Test Page</title>
          </head>
          <body>
            <main>
              <article>
                <h1>Test Article</h1>
                <p>Content goes here...</p>
                <footer>
                  <div 
                    data-public-good-review-date
                    data-last-reviewed="2023-08-15"
                    data-next-review="2026-08-15"
                    data-date-format="long"
                    data-prefix="Page"
                    data-classes="public-good-body-s public-good-u-secondary-text-color public-good-u-margin-top-7"
                  ></div>
                </footer>
              </article>
            </main>
          </body>
        </html>
      `

      // Initialize components
      const components = initializeReviewDates()
      expect(components).toHaveLength(1)

      const reviewDate = components[0]
      expect(reviewDate.element.innerHTML).toContain('Page last reviewed: 15 August 2023')
      expect(reviewDate.element.innerHTML).toContain('Next review due: 15 August 2026')

      // Should have replaced the original element
      expect(document.querySelector('[data-public-good-review-date]')).toBeNull()
      expect(document.querySelector('.public-good-review-date')).toBeTruthy()
    })

    test('should handle multiple auto-initialized components on complex page', () => {
      document.body.innerHTML = `
        <div class="page-wrapper">
          <header>
            <nav>
              <div 
                data-public-good-review-date
                data-last-reviewed="2023-01-01"
                data-prefix="Navigation"
                data-date-format="short"
              ></div>
            </nav>
          </header>
          <main>
            <article>
              <footer>
                <div 
                  data-public-good-review-date
                  data-last-reviewed="2023-06-15"
                  data-next-review="2026-06-15"
                  data-prefix="Article"
                ></div>
              </footer>
            </article>
          </main>
          <aside>
            <div 
              data-public-good-review-date
              data-last-reviewed="2023-12-01"
              data-prefix="Sidebar content"
              data-classes="sidebar-review"
            ></div>
          </aside>
        </div>
      `

      const components = initializeReviewDates()
      expect(components).toHaveLength(3)

      // Check each component
      const navReview = components.find(c => c.config.prefix === 'Navigation')
      const articleReview = components.find(c => c.config.prefix === 'Article')
      const sidebarReview = components.find(c => c.config.prefix === 'Sidebar content')

      expect(navReview).toBeTruthy()
      expect(articleReview).toBeTruthy()
      expect(sidebarReview).toBeTruthy()

      expect(navReview!.element.innerHTML).toContain('Navigation last reviewed')
      expect(navReview!.element.innerHTML).toContain('1 Jan 2023')

      expect(articleReview!.element.innerHTML).toContain('Article last reviewed')
      expect(articleReview!.element.innerHTML).toContain('15 June 2023')

      expect(sidebarReview!.element.classList.contains('sidebar-review')).toBe(true)
    })
  })

  describe('Performance and Memory Management', () => {
    test('should handle component lifecycle properly', () => {
      const reviewDate = createReviewDate({
        lastReviewed: '2023-01-01'
      })
      container.appendChild(reviewDate.element)

      // Component should be in DOM
      expect(container.children).toHaveLength(1)

      // Destroy component
      reviewDate.destroy()

      // Should be removed from DOM
      expect(container.children).toHaveLength(0)

      // Should dispatch destruction event
      let destroyEventFired = false
      document.addEventListener('public-good:review-date:destroyed', () => {
        destroyEventFired = true
      })

      const newReviewDate = createReviewDate({ lastReviewed: '2023-01-01' })
      container.appendChild(newReviewDate.element)
      newReviewDate.destroy()

      expect(destroyEventFired).toBe(true)
    })

    test('should handle multiple rapid updates efficiently', () => {
      const reviewDate = createReviewDate({
        lastReviewed: '2023-01-01'
      })
      container.appendChild(reviewDate.element)

      const startTime = performance.now()

      // Perform multiple rapid updates
      for (let i = 0; i < 100; i++) {
        const date = new Date('2023-01-01')
        date.setDate(date.getDate() + i)
        reviewDate.updateLastReviewed(date)
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Updates should complete quickly (under 100ms for 100 updates)
      expect(duration).toBeLessThan(100)

      // Final content should be correct
      expect(reviewDate.element.innerHTML).toContain('April 2023')
    })
  })
})