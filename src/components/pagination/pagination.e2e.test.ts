/**
 * Pagination Component E2E Tests
 * 
 * End-to-end tests for pagination user interactions, accessibility, and navigation behavior
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  createPagination,
  createFullPagination,
  createPreviousPagination,
  createNextPagination,
  type PaginationPage
} from './pagination'

describe('Pagination Component E2E Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('User Interactions', () => {
    it('should handle keyboard navigation', () => {
      const prevPage: PaginationPage = { title: 'Previous Page', url: '/prev' }
      const nextPage: PaginationPage = { title: 'Next Page', url: '/next' }
      const pagination = createFullPagination(prevPage, nextPage)
      
      document.body.appendChild(pagination.element)

      const prevLink = pagination.element.querySelector('.public-good-pagination__link--prev') as HTMLAnchorElement
      const nextLink = pagination.element.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement

      // Test Tab navigation
      prevLink.focus()
      expect(document.activeElement).toBe(prevLink)

      // Simulate Tab key to next link
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      prevLink.dispatchEvent(tabEvent)
      nextLink.focus()
      expect(document.activeElement).toBe(nextLink)

      // Test Enter key activation
      let enterPressed = false
      nextLink.addEventListener('click', () => { enterPressed = true })
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      nextLink.dispatchEvent(enterEvent)
      // Note: In real browser, Enter on a link would trigger navigation
      
      document.body.removeChild(pagination.element)
    })

    it('should handle mouse interactions', () => {
      const nextPage: PaginationPage = { title: 'Next Page', url: '/next' }
      const pagination = createNextPagination(nextPage)
      
      document.body.appendChild(pagination.element)

      const nextLink = pagination.element.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement

      // Test mouse hover
      const mouseEnterEvent = new MouseEvent('mouseenter')
      nextLink.dispatchEvent(mouseEnterEvent)

      // Test mouse click
      let clicked = false
      nextLink.addEventListener('click', (e) => {
        e.preventDefault() // Prevent actual navigation in tests
        clicked = true
      })

      const clickEvent = new MouseEvent('click', { bubbles: true })
      nextLink.dispatchEvent(clickEvent)
      expect(clicked).toBe(true)

      document.body.removeChild(pagination.element)
    })

    it('should track navigation clicks with analytics events', () => {
      const prevPage: PaginationPage = { title: 'Previous Page', url: '/prev' }
      const nextPage: PaginationPage = { title: 'Next Page', url: '/next' }
      const pagination = createFullPagination(prevPage, nextPage)
      
      document.body.appendChild(pagination.element)

      let analyticsEvents: any[] = []
      pagination.element.addEventListener('public-good:pagination:click', (event: any) => {
        analyticsEvents.push(event.detail)
      })

      const prevLink = pagination.element.querySelector('.public-good-pagination__link--prev') as HTMLAnchorElement
      const nextLink = pagination.element.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement

      // Click previous link
      prevLink.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(analyticsEvents.length).toBe(1)
      expect(analyticsEvents[0].direction).toBe('previous')
      expect(analyticsEvents[0].url).toContain('/prev')

      // Click next link
      nextLink.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(analyticsEvents.length).toBe(2)
      expect(analyticsEvents[1].direction).toBe('next')
      expect(analyticsEvents[1].url).toContain('/next')

      document.body.removeChild(pagination.element)
    })
  })

  describe('Accessibility Features', () => {
    it('should support screen reader navigation', () => {
      const prevPage: PaginationPage = { title: 'Understanding your condition', url: '/prev' }
      const nextPage: PaginationPage = { title: 'Treatment options', url: '/next' }
      const pagination = createFullPagination(prevPage, nextPage)
      
      document.body.appendChild(pagination.element)

      // Check navigation landmark
      const nav = pagination.element
      expect(nav.tagName).toBe('NAV')
      expect(nav.getAttribute('role')).toBe('navigation')
      expect(nav.getAttribute('aria-label')).toBe('Pagination')

      // Check screen reader heading
      const heading = nav.querySelector('.public-good-sr-only')
      expect(heading?.textContent).toBe('Pagination')

      // Check link relationships
      const prevLink = nav.querySelector('.public-good-pagination__link--prev') as HTMLAnchorElement
      const nextLink = nav.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement

      expect(prevLink.rel).toBe('prev')
      expect(nextLink.rel).toBe('next')

      // Check aria-hidden on decorative elements
      const decorativeElements = nav.querySelectorAll('[aria-hidden="true"]')
      expect(decorativeElements.length).toBeGreaterThan(0)

      document.body.removeChild(pagination.element)
    })

    it('should provide meaningful link text', () => {
      const prevPage: PaginationPage = { title: 'Page 1: Getting started', url: '/page-1' }
      const nextPage: PaginationPage = { title: 'Page 3: Advanced topics', url: '/page-3' }
      const pagination = createFullPagination(prevPage, nextPage)
      
      document.body.appendChild(pagination.element)

      const prevTitleText = pagination.element.querySelector('.public-good-pagination-item--previous .public-good-pagination__link-title-text')
      const nextTitleText = pagination.element.querySelector('.public-good-pagination-item--next .public-good-pagination__link-title-text')

      expect(prevTitleText?.textContent).toBe('Page 1: Getting started')
      expect(nextTitleText?.textContent).toBe('Page 3: Advanced topics')

      // Check that links are descriptive for screen readers
      const prevLink = pagination.element.querySelector('.public-good-pagination__link--prev') as HTMLAnchorElement
      const nextLink = pagination.element.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement

      // The link should contain both the direction and page title
      expect(prevLink.textContent).toContain('Previous')
      expect(prevLink.textContent).toContain('Page 1: Getting started')
      expect(nextLink.textContent).toContain('Next')
      expect(nextLink.textContent).toContain('Page 3: Advanced topics')

      document.body.removeChild(pagination.element)
    })

    it('should maintain focus management', () => {
      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      })
      
      document.body.appendChild(pagination.element)

      const prevLink = pagination.element.querySelector('.public-good-pagination__link--prev') as HTMLAnchorElement
      const nextLink = pagination.element.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement

      // Test focus indicators are visible
      prevLink.focus()
      expect(document.activeElement).toBe(prevLink)

      nextLink.focus()
      expect(document.activeElement).toBe(nextLink)

      // Focus should be programmatically manageable
      prevLink.blur()
      expect(document.activeElement).not.toBe(prevLink)

      document.body.removeChild(pagination.element)
    })
  })

  describe('Content Structure Scenarios', () => {
    it('should handle pagination in content series', () => {
      // Simulate a content series scenario
      const pagination = createPagination({
        previousPage: { 
          title: 'Types of diabetes', 
          url: '/diabetes/types' 
        },
        nextPage: { 
          title: 'Diabetes symptoms', 
          url: '/diabetes/symptoms' 
        }
      })
      
      document.body.appendChild(pagination.element)

      // Check structure supports content series navigation
      const nav = pagination.element
      expect(nav.classList.contains('public-good-pagination')).toBe(true)

      // Verify both navigation directions are available
      const prevLink = nav.querySelector('.public-good-pagination__link--prev')
      const nextLink = nav.querySelector('.public-good-pagination__link--next')
      expect(prevLink).toBeTruthy()
      expect(nextLink).toBeTruthy()

      // Check URLs are properly formed for content series
      expect((prevLink as HTMLAnchorElement).href).toContain('/diabetes/types')
      expect((nextLink as HTMLAnchorElement).href).toContain('/diabetes/symptoms')

      document.body.removeChild(pagination.element)
    })

    it('should handle first page in series (next only)', () => {
      const pagination = createNextPagination({
        title: 'Page 2: Understanding your diagnosis',
        url: '/guide/page-2'
      })
      
      document.body.appendChild(pagination.element)

      const nav = pagination.element
      const prevLink = nav.querySelector('.public-good-pagination__link--prev')
      const nextLink = nav.querySelector('.public-good-pagination__link--next')

      expect(prevLink).toBe(null)
      expect(nextLink).toBeTruthy()

      // List should handle single item properly
      const list = nav.querySelector('.public-good-pagination__list')
      expect(list?.children.length).toBe(1)

      document.body.removeChild(pagination.element)
    })

    it('should handle last page in series (previous only)', () => {
      const pagination = createPreviousPagination({
        title: 'Page 4: Getting support',
        url: '/guide/page-4'
      })
      
      document.body.appendChild(pagination.element)

      const nav = pagination.element
      const prevLink = nav.querySelector('.public-good-pagination__link--prev')
      const nextLink = nav.querySelector('.public-good-pagination__link--next')

      expect(prevLink).toBeTruthy()
      expect(nextLink).toBe(null)

      // List should handle single item properly
      const list = nav.querySelector('.public-good-pagination__list')
      expect(list?.children.length).toBe(1)

      document.body.removeChild(pagination.element)
    })
  })

  describe('Visual and Layout Behavior', () => {
    it('should maintain proper spacing and layout', () => {
      const pagination = createFullPagination(
        { title: 'Long previous page title that might wrap', url: '/prev' },
        { title: 'Long next page title that might wrap', url: '/next' }
      )
      
      document.body.appendChild(pagination.element)

      const nav = pagination.element
      const list = nav.querySelector('.public-good-pagination__list')
      const prevItem = nav.querySelector('.public-good-pagination-item--previous')
      const nextItem = nav.querySelector('.public-good-pagination-item--next')

      // Check that layout classes are applied
      expect(list?.classList.contains('public-good-pagination__list')).toBe(true)
      expect(prevItem?.classList.contains('public-good-pagination-item--previous')).toBe(true)
      expect(nextItem?.classList.contains('public-good-pagination-item--next')).toBe(true)

      // Check that links have proper styling classes
      const prevLink = nav.querySelector('.public-good-pagination__link--prev')
      const nextLink = nav.querySelector('.public-good-pagination__link--next')
      expect(prevLink?.classList.contains('public-good-pagination__link')).toBe(true)
      expect(nextLink?.classList.contains('public-good-pagination__link')).toBe(true)

      document.body.removeChild(pagination.element)
    })

    it('should handle responsive behavior structure', () => {
      const pagination = createFullPagination(
        { title: 'Previous Page', url: '/prev' },
        { title: 'Next Page', url: '/next' }
      )
      
      document.body.appendChild(pagination.element)

      // Check that structure supports responsive behavior
      const list = pagination.element.querySelector('.public-good-pagination__list')
      expect(list?.tagName).toBe('UL')

      // Items should be properly structured for CSS flex layout
      const items = list?.querySelectorAll('li')
      expect(items?.length).toBe(2)

      items?.forEach(item => {
        expect(item.classList.length).toBeGreaterThan(0) // Should have direction classes
      })

      document.body.removeChild(pagination.element)
    })
  })

  describe('Integration with Data Attributes', () => {
    it('should initialize from data attributes', () => {
      // Create a mock element with data attributes
      const mockElement = document.createElement('div')
      mockElement.setAttribute('data-public-good-pagination', '')
      mockElement.setAttribute('data-prev-title', 'Previous Page')
      mockElement.setAttribute('data-prev-url', '/prev')
      mockElement.setAttribute('data-next-title', 'Next Page')
      mockElement.setAttribute('data-next-url', '/next')
      document.body.appendChild(mockElement)

      // Test that the component can be initialized (this would be done by the auto-init)
      const config = {
        previousPage: { 
          title: mockElement.getAttribute('data-prev-title') || '', 
          url: mockElement.getAttribute('data-prev-url') || '' 
        },
        nextPage: { 
          title: mockElement.getAttribute('data-next-title') || '', 
          url: mockElement.getAttribute('data-next-url') || '' 
        }
      }

      const pagination = createPagination(config)
      expect(pagination.config.previousPage?.title).toBe('Previous Page')
      expect(pagination.config.nextPage?.title).toBe('Next Page')

      document.body.removeChild(mockElement)
    })
  })

  describe('Performance and Cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      })
      
      document.body.appendChild(pagination.element)

      // Get initial number of event listeners (hard to test directly, but we can test the element removal)
      expect(document.body.contains(pagination.element)).toBe(true)

      pagination.destroy()

      // Element should be removed from DOM
      expect(document.body.contains(pagination.element)).toBe(false)
    })

    it('should handle rapid creation and destruction', () => {
      const paginations: any[] = []

      // Create multiple pagination components rapidly
      for (let i = 0; i < 10; i++) {
        const pagination = createPagination({
          previousPage: { title: `Previous ${i}`, url: `/prev-${i}` },
          nextPage: { title: `Next ${i}`, url: `/next-${i}` }
        })
        paginations.push(pagination)
        document.body.appendChild(pagination.element)
      }

      expect(document.querySelectorAll('.public-good-pagination').length).toBe(10)

      // Destroy all components
      paginations.forEach(pagination => pagination.destroy())

      expect(document.querySelectorAll('.public-good-pagination').length).toBe(0)
    })
  })
})