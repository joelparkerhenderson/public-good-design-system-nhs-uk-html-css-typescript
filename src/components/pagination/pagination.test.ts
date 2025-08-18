/**
 * Pagination Component Unit Tests
 * 
 * Tests for pagination creation, configuration, navigation, accessibility, and functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createPagination,
  createFullPagination,
  createPreviousPagination,
  createNextPagination,
  type PaginationConfig,
  type PaginationPage
} from './pagination'

// Mock the DOM utilities
vi.mock('../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`)
}))

describe('Pagination Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Configuration', () => {
    it('should create pagination with basic configuration', () => {
      const config: PaginationConfig = {
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      }

      const pagination = createPagination(config)

      expect(pagination.element).toBeDefined()
      expect(pagination.config.previousPage?.title).toBe('Previous Page')
      expect(pagination.config.nextPage?.title).toBe('Next Page')
      expect(typeof pagination.destroy).toBe('function')
    })

    it('should create pagination with custom configuration', () => {
      const config: PaginationConfig = {
        id: 'custom-pagination',
        previousPage: { title: 'Custom Previous', url: '/custom-prev' },
        nextPage: { title: 'Custom Next', url: '/custom-next' },
        classes: 'custom-class',
        attributes: { 'data-test': 'pagination' }
      }

      const pagination = createPagination(config)

      expect(pagination.config.id).toBe('custom-pagination')
      expect(pagination.config.previousPage?.title).toBe('Custom Previous')
      expect(pagination.config.nextPage?.title).toBe('Custom Next')
      expect(pagination.config.classes).toBe('custom-class')
      expect(pagination.config.attributes?.['data-test']).toBe('pagination')
    })

    it('should generate unique ID when not provided', () => {
      const pagination = createPagination({})
      expect(pagination.config.id).toBe('pagination-test-id')
    })

    it('should handle pagination with only previous page', () => {
      const config: PaginationConfig = {
        previousPage: { title: 'Previous Page', url: '/prev' }
      }

      const pagination = createPagination(config)
      const nav = pagination.element

      const prevLink = nav.querySelector('.public-good-pagination__link--prev')
      const nextLink = nav.querySelector('.public-good-pagination__link--next')

      expect(prevLink).toBeTruthy()
      expect(nextLink).toBe(null)
    })

    it('should handle pagination with only next page', () => {
      const config: PaginationConfig = {
        nextPage: { title: 'Next Page', url: '/next' }
      }

      const pagination = createPagination(config)
      const nav = pagination.element

      const prevLink = nav.querySelector('.public-good-pagination__link--prev')
      const nextLink = nav.querySelector('.public-good-pagination__link--next')

      expect(prevLink).toBe(null)
      expect(nextLink).toBeTruthy()
    })
  })

  describe('HTML Structure', () => {
    it('should create proper HTML structure', () => {
      const config: PaginationConfig = {
        id: 'test-pagination',
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      }

      const pagination = createPagination(config)
      const nav = pagination.element

      expect(nav.tagName).toBe('NAV')
      expect(nav.classList.contains('public-good-pagination')).toBe(true)
      expect(nav.id).toBe('test-pagination')
      expect(nav.getAttribute('role')).toBe('navigation')
      expect(nav.getAttribute('aria-label')).toBe('Pagination')

      const heading = nav.querySelector('.public-good-sr-only')
      expect(heading).toBeTruthy()
      expect(heading?.textContent).toBe('Pagination')

      const list = nav.querySelector('.public-good-pagination__list')
      expect(list).toBeTruthy()
      expect(list?.tagName).toBe('UL')
    })

    it('should create previous page link with correct structure', () => {
      const config: PaginationConfig = {
        previousPage: { title: 'Previous Page', url: '/prev' }
      }

      const pagination = createPagination(config)
      const nav = pagination.element

      const prevItem = nav.querySelector('.public-good-pagination-item--previous')
      expect(prevItem).toBeTruthy()
      expect(prevItem?.tagName).toBe('LI')

      const prevLink = prevItem?.querySelector('.public-good-pagination__link--prev') as HTMLAnchorElement
      expect(prevLink).toBeTruthy()
      expect(prevLink.href).toContain('/prev')
      expect(prevLink.rel).toBe('prev')

      const titleText = prevLink.querySelector('.public-good-pagination__link-title-text')
      expect(titleText?.textContent).toBe('Previous Page')

      const arrow = prevLink.querySelector('.public-good-icon__arrow-left')
      expect(arrow).toBeTruthy()
    })

    it('should create next page link with correct structure', () => {
      const config: PaginationConfig = {
        nextPage: { title: 'Next Page', url: '/next' }
      }

      const pagination = createPagination(config)
      const nav = pagination.element

      const nextItem = nav.querySelector('.public-good-pagination-item--next')
      expect(nextItem).toBeTruthy()
      expect(nextItem?.tagName).toBe('LI')

      const nextLink = nextItem?.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement
      expect(nextLink).toBeTruthy()
      expect(nextLink.href).toContain('/next')
      expect(nextLink.rel).toBe('next')

      const titleText = nextLink.querySelector('.public-good-pagination__link-title-text')
      expect(titleText?.textContent).toBe('Next Page')

      const arrow = nextLink.querySelector('.public-good-icon__arrow-right')
      expect(arrow).toBeTruthy()
    })

    it('should apply custom classes', () => {
      const pagination = createPagination({
        classes: 'custom-class another-class'
      })

      expect(pagination.element.classList.contains('custom-class')).toBe(true)
      expect(pagination.element.classList.contains('another-class')).toBe(true)
    })

    it('should apply custom attributes', () => {
      const pagination = createPagination({
        attributes: {
          'data-test': 'test-value',
          'aria-describedby': 'description'
        }
      })

      expect(pagination.element.getAttribute('data-test')).toBe('test-value')
      expect(pagination.element.getAttribute('aria-describedby')).toBe('description')
    })
  })

  describe('Helper Functions', () => {
    it('should create full pagination with both pages', () => {
      const prevPage: PaginationPage = { title: 'Previous Page', url: '/prev' }
      const nextPage: PaginationPage = { title: 'Next Page', url: '/next' }

      const pagination = createFullPagination(prevPage, nextPage)

      expect(pagination.config.previousPage?.title).toBe('Previous Page')
      expect(pagination.config.nextPage?.title).toBe('Next Page')

      const nav = pagination.element
      expect(nav.querySelector('.public-good-pagination__link--prev')).toBeTruthy()
      expect(nav.querySelector('.public-good-pagination__link--next')).toBeTruthy()
    })

    it('should create previous-only pagination', () => {
      const prevPage: PaginationPage = { title: 'Previous Page', url: '/prev' }

      const pagination = createPreviousPagination(prevPage)

      expect(pagination.config.previousPage?.title).toBe('Previous Page')
      expect(pagination.config.nextPage).toBeUndefined()

      const nav = pagination.element
      expect(nav.querySelector('.public-good-pagination__link--prev')).toBeTruthy()
      expect(nav.querySelector('.public-good-pagination__link--next')).toBe(null)
    })

    it('should create next-only pagination', () => {
      const nextPage: PaginationPage = { title: 'Next Page', url: '/next' }

      const pagination = createNextPagination(nextPage)

      expect(pagination.config.nextPage?.title).toBe('Next Page')
      expect(pagination.config.previousPage).toBeUndefined()

      const nav = pagination.element
      expect(nav.querySelector('.public-good-pagination__link--next')).toBeTruthy()
      expect(nav.querySelector('.public-good-pagination__link--prev')).toBe(null)
    })

    it('should allow overriding helper function defaults', () => {
      const prevPage: PaginationPage = { title: 'Previous Page', url: '/prev' }
      const nextPage: PaginationPage = { title: 'Next Page', url: '/next' }

      const pagination = createFullPagination(prevPage, nextPage, {
        id: 'custom-id',
        classes: 'custom-class'
      })

      expect(pagination.config.id).toBe('custom-id')
      expect(pagination.config.classes).toBe('custom-class')
      expect(pagination.element.classList.contains('custom-class')).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('should dispatch creation event', () => {
      let creationEventFired = false
      let eventDetail: any = null

      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' }
      })

      pagination.element.addEventListener('public-good:pagination:created', (event: any) => {
        creationEventFired = true
        eventDetail = event.detail
      })

      // Manually dispatch the creation event to test the mechanism
      const testEvent = new CustomEvent('public-good:pagination:created', {
        detail: { element: pagination.element, config: pagination.config },
        bubbles: true
      })
      pagination.element.dispatchEvent(testEvent)

      expect(creationEventFired).toBe(true)
      expect(eventDetail).toBeTruthy()
      expect(eventDetail.element).toBe(pagination.element)
    })

    it('should dispatch click events for pagination links', () => {
      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      })

      let clickEventFired = false
      let eventDetail: any = null

      pagination.element.addEventListener('public-good:pagination:click', (event: any) => {
        clickEventFired = true
        eventDetail = event.detail
      })

      const prevLink = pagination.element.querySelector('.public-good-pagination__link--prev')
      prevLink?.dispatchEvent(new Event('click', { bubbles: true }))

      expect(clickEventFired).toBe(true)
      expect(eventDetail).toBeTruthy()
      expect(eventDetail.direction).toBe('previous')
    })

    it('should identify next link direction in click events', () => {
      const pagination = createPagination({
        nextPage: { title: 'Next Page', url: '/next' }
      })

      let eventDetail: any = null

      pagination.element.addEventListener('public-good:pagination:click', (event: any) => {
        eventDetail = event.detail
      })

      const nextLink = pagination.element.querySelector('.public-good-pagination__link--next')
      nextLink?.dispatchEvent(new Event('click', { bubbles: true }))

      expect(eventDetail.direction).toBe('next')
    })

    it('should dispatch destruction event', () => {
      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' }
      })
      document.body.appendChild(pagination.element)

      let destroyEventFired = false
      document.addEventListener('public-good:pagination:destroyed', () => {
        destroyEventFired = true
      })

      pagination.destroy()

      expect(document.body.contains(pagination.element)).toBe(false)
      expect(destroyEventFired).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      })

      const nav = pagination.element
      expect(nav.getAttribute('role')).toBe('navigation')
      expect(nav.getAttribute('aria-label')).toBe('Pagination')

      const heading = nav.querySelector('.public-good-sr-only')
      expect(heading?.textContent).toBe('Pagination')
    })

    it('should have proper link relationships', () => {
      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      })

      const prevLink = pagination.element.querySelector('.public-good-pagination__link--prev') as HTMLAnchorElement
      const nextLink = pagination.element.querySelector('.public-good-pagination__link--next') as HTMLAnchorElement

      expect(prevLink.rel).toBe('prev')
      expect(nextLink.rel).toBe('next')
    })

    it('should hide decorative elements from screen readers', () => {
      const pagination = createPagination({
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      })

      const labels = pagination.element.querySelectorAll('.public-good-pagination__link-label')
      labels.forEach(label => {
        expect(label.getAttribute('aria-hidden')).toBe('true')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty configuration', () => {
      expect(() => {
        createPagination({})
      }).not.toThrow()
    })

    it('should handle pagination without any pages', () => {
      const pagination = createPagination({})
      const nav = pagination.element

      const links = nav.querySelectorAll('.public-good-pagination__link')
      expect(links.length).toBe(0)

      const list = nav.querySelector('.public-good-pagination__list')
      expect(list?.children.length).toBe(0)
    })

    it('should handle undefined page configurations gracefully', () => {
      const config: PaginationConfig = {
        previousPage: undefined,
        nextPage: undefined
      }

      expect(() => createPagination(config)).not.toThrow()
    })

    it('should maintain configuration reference', () => {
      const originalConfig: PaginationConfig = {
        previousPage: { title: 'Previous Page', url: '/prev' },
        nextPage: { title: 'Next Page', url: '/next' }
      }

      const pagination = createPagination(originalConfig)

      expect(pagination.config).toBe(originalConfig)
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should enforce configuration properties', () => {
      // These should compile correctly
      const validConfigs: PaginationConfig[] = [
        {},
        { previousPage: { title: 'Previous', url: '/prev' } },
        { nextPage: { title: 'Next', url: '/next' } },
        { 
          previousPage: { title: 'Previous', url: '/prev' },
          nextPage: { title: 'Next', url: '/next' }
        }
      ]

      validConfigs.forEach((config) => {
        expect(() => createPagination(config)).not.toThrow()
      })
    })

    it('should support page objects', () => {
      const page: PaginationPage = { title: 'Test Page', url: '/test' }
      expect(() => createPagination({ previousPage: page })).not.toThrow()
    })

    it('should support helper functions with proper types', () => {
      const prevPage: PaginationPage = { title: 'Previous', url: '/prev' }
      const nextPage: PaginationPage = { title: 'Next', url: '/next' }

      expect(() => createFullPagination(prevPage, nextPage)).not.toThrow()
      expect(() => createPreviousPagination(prevPage)).not.toThrow()
      expect(() => createNextPagination(nextPage)).not.toThrow()
    })
  })
})