/**
 * Breadcrumb Component Tests
 * Unit tests for the breadcrumb component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createBreadcrumb, 
  initializeBreadcrumbs,
  createBreadcrumbFromUrl,
  getBreadcrumbStructuredData,
  type BreadcrumbConfig,
  type BreadcrumbItem
} from './breadcrumb'

// Mock window.location
const mockLocation = {
  pathname: '/services/find-a-gp',
  href: 'https://public-good.gov.uk/services/find-a-gp'
}

describe('Breadcrumb Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('createBreadcrumb', () => {
    it('should create a basic breadcrumb with default properties', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Services', href: '/services' },
          { text: 'Find a GP' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.element).toBeDefined()
      expect(breadcrumb.nav).toBeDefined()
      expect(breadcrumb.list).toBeDefined()
      expect(breadcrumb.destroy).toBeInstanceOf(Function)

      // Check nav structure
      expect(breadcrumb.nav.classList.contains('public-good-breadcrumb')).toBe(true)
      expect(breadcrumb.nav.tagName.toLowerCase()).toBe('nav')
      expect(breadcrumb.nav.getAttribute('aria-label')).toBe('Breadcrumb')

      // Check list structure
      expect(breadcrumb.list.classList.contains('public-good-breadcrumb__list')).toBe(true)
      expect(breadcrumb.list.tagName.toLowerCase()).toBe('ol')

      // Check items count
      const items = breadcrumb.list.querySelectorAll('.public-good-breadcrumb__item')
      expect(items).toHaveLength(3)

      // Check links
      const links = breadcrumb.list.querySelectorAll('.public-good-breadcrumb__link')
      expect(links).toHaveLength(2) // Only first two items have hrefs

      // Check text content
      expect(links[0]?.textContent).toBe('Home')
      expect(links[1]?.textContent).toBe('Services')
      
      // Check last item without href
      const lastItem = items[2]
      const textSpan = lastItem?.querySelector('.public-good-breadcrumb__text')
      expect(textSpan?.textContent).toBe('Find a GP')
    })

    it('should throw error when no items provided', () => {
      expect(() => {
        createBreadcrumb({ items: [] })
      }).toThrow('Breadcrumb requires at least one item')
    })

    it('should create breadcrumb with custom label text', () => {
      const config: BreadcrumbConfig = {
        items: [{ text: 'Home', href: '/' }],
        labelText: 'Custom Navigation'
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.nav.getAttribute('aria-label')).toBe('Custom Navigation')
    })

    it('should apply additional classes', () => {
      const config: BreadcrumbConfig = {
        items: [{ text: 'Home', href: '/' }],
        classes: 'public-good-breadcrumb--reverse custom-class'
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.nav.classList.contains('public-good-breadcrumb')).toBe(true)
      expect(breadcrumb.nav.classList.contains('public-good-breadcrumb--reverse')).toBe(true)
      expect(breadcrumb.nav.classList.contains('custom-class')).toBe(true)
    })

    it('should apply custom attributes', () => {
      const config: BreadcrumbConfig = {
        items: [{ text: 'Home', href: '/' }],
        attributes: {
          'data-test': 'breadcrumb',
          'id': 'main-breadcrumb'
        }
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.nav.getAttribute('data-test')).toBe('breadcrumb')
      expect(breadcrumb.nav.getAttribute('id')).toBe('main-breadcrumb')
    })

    it('should apply custom attributes to breadcrumb items', () => {
      const config: BreadcrumbConfig = {
        items: [
          { 
            text: 'Home', 
            href: '/', 
            attributes: { 'data-analytics': 'home-link', 'lang': 'en' }
          },
          { 
            text: 'About', 
            attributes: { 'data-section': 'about' }
          }
        ]
      }

      const breadcrumb = createBreadcrumb(config)

      const homeLink = breadcrumb.list.querySelector('.public-good-breadcrumb__link')
      expect(homeLink?.getAttribute('data-analytics')).toBe('home-link')
      expect(homeLink?.getAttribute('lang')).toBe('en')

      const aboutSpan = breadcrumb.list.querySelector('.public-good-breadcrumb__text')
      expect(aboutSpan?.getAttribute('data-section')).toBe('about')
    })

    it('should create chevron separators between items', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Services', href: '/services' },
          { text: 'Current' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)

      const chevrons = breadcrumb.list.querySelectorAll('.public-good-icon--chevron-right')
      expect(chevrons).toHaveLength(2) // One separator between each item pair
    })

    it('should create mobile back link when last item has href', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Services', href: '/services' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.backLink).toBeDefined()
      expect(breadcrumb.backLink?.classList.contains('public-good-breadcrumb__backlink')).toBe(true)
      expect(breadcrumb.backLink?.getAttribute('href')).toBe('/services')

      // Check visually hidden text
      const hiddenText = breadcrumb.backLink?.querySelector('.public-good-u-visually-hidden')
      expect(hiddenText?.textContent?.trim()).toBe('Back to')

      // Check back arrow icon
      const backArrow = breadcrumb.backLink?.querySelector('.public-good-icon--chevron-left')
      expect(backArrow).toBeTruthy()
    })

    it('should not create mobile back link when last item has no href', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Current Page' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.backLink).toBeUndefined()
      const backSection = breadcrumb.nav.querySelector('.public-good-breadcrumb__back')
      expect(backSection).toBeFalsy()
    })

    it('should handle click events with analytics', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Services', href: '/services' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)
      document.body.appendChild(breadcrumb.element)

      const eventSpy = vi.fn()
      breadcrumb.nav.addEventListener('public-good:breadcrumb:click', eventSpy)

      // Click on breadcrumb link
      const homeLink = breadcrumb.list.querySelector('.public-good-breadcrumb__link') as HTMLAnchorElement
      homeLink?.click()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.text).toBe('Home')
      expect(eventDetail.href).toContain('/')
      expect(eventDetail.type).toBe('breadcrumb')
    })

    it('should handle mobile back link clicks with analytics', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Services', href: '/services' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)
      document.body.appendChild(breadcrumb.element)

      const eventSpy = vi.fn()
      breadcrumb.nav.addEventListener('public-good:breadcrumb:click', eventSpy)

      // Click on mobile back link
      breadcrumb.backLink?.click()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.text?.trim()).toBe('Back to Services')
      expect(eventDetail.href).toContain('/services')
      expect(eventDetail.type).toBe('mobile-back')
    })

    it('should clean up event listeners when destroyed', () => {
      const config: BreadcrumbConfig = {
        items: [{ text: 'Home', href: '/' }]
      }

      const breadcrumb = createBreadcrumb(config)
      document.body.appendChild(breadcrumb.element)

      // Verify element is in DOM
      expect(document.querySelector('.public-good-breadcrumb')).toBeTruthy()

      // Destroy component
      breadcrumb.destroy()

      // Verify element is removed from DOM
      expect(document.querySelector('.public-good-breadcrumb')).toBeFalsy()
    })
  })

  describe('initializeBreadcrumbs', () => {
    it('should initialize breadcrumbs from data attributes', () => {
      const itemsData = JSON.stringify([
        { text: 'Home', href: '/' },
        { text: 'Services', href: '/services' },
        { text: 'Current' }
      ])

      document.body.innerHTML = `
        <div data-public-good-breadcrumb 
             data-items='${itemsData}' 
             data-label-text="Custom Breadcrumb"
             data-classes="custom-class">
        </div>
      `

      const breadcrumbs = initializeBreadcrumbs()

      expect(breadcrumbs).toHaveLength(1)
      
      const breadcrumbNav = document.querySelector('.public-good-breadcrumb')
      expect(breadcrumbNav?.getAttribute('aria-label')).toBe('Custom Breadcrumb')
      expect(breadcrumbNav?.classList.contains('custom-class')).toBe(true)

      const items = document.querySelectorAll('.public-good-breadcrumb__item')
      expect(items).toHaveLength(3)
    })

    it('should handle missing data-items attribute gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-breadcrumb data-label-text="Missing Items"></div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const breadcrumbs = initializeBreadcrumbs()

      expect(breadcrumbs).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Breadcrumb element missing data-items attribute')
      
      consoleSpy.mockRestore()
    })

    it('should handle invalid JSON in data-items gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-breadcrumb data-items='{invalid: json}'></div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const breadcrumbs = initializeBreadcrumbs()

      expect(breadcrumbs).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse breadcrumb items:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should handle invalid JSON in data-attributes gracefully', () => {
      const itemsData = JSON.stringify([{ text: 'Home', href: '/' }])

      document.body.innerHTML = `
        <div data-public-good-breadcrumb 
             data-items='${itemsData}' 
             data-attributes='{invalid: json}'>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const breadcrumbs = initializeBreadcrumbs()

      expect(breadcrumbs).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse breadcrumb attributes:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('createBreadcrumbFromUrl', () => {
    it('should create breadcrumb from current URL', () => {
      const breadcrumb = createBreadcrumbFromUrl()

      const items = breadcrumb.list.querySelectorAll('.public-good-breadcrumb__item')
      expect(items).toHaveLength(3) // Home, services, find-a-gp

      const links = breadcrumb.list.querySelectorAll('.public-good-breadcrumb__link')
      expect(links).toHaveLength(2) // Home and services have links

      expect(links[0]?.textContent).toBe('Home')
      expect(links[0]?.getAttribute('href')).toBe('/')
      expect(links[1]?.textContent).toBe('Services')
      expect(links[1]?.getAttribute('href')).toBe('/services')

      const lastItem = items[2]?.querySelector('.public-good-breadcrumb__text')
      expect(lastItem?.textContent).toBe('Find a gp')
    })

    it('should use custom URL mappings', () => {
      const urlMappings = {
        'services': 'Our Services',
        'find-a-gp': 'Find a General Practitioner'
      }

      const breadcrumb = createBreadcrumbFromUrl('/', urlMappings)

      const links = breadcrumb.list.querySelectorAll('.public-good-breadcrumb__link')
      const lastItem = breadcrumb.list.querySelector('.public-good-breadcrumb__text')

      expect(links[1]?.textContent).toBe('Our Services')
      expect(lastItem?.textContent).toBe('Find a General Practitioner')
    })

    it('should use custom base URL', () => {
      const breadcrumb = createBreadcrumbFromUrl('/app')

      const homeLink = breadcrumb.list.querySelector('.public-good-breadcrumb__link')
      expect(homeLink?.getAttribute('href')).toBe('/app')
    })

    it('should handle root path correctly', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true
      })

      const breadcrumb = createBreadcrumbFromUrl()

      const items = breadcrumb.list.querySelectorAll('.public-good-breadcrumb__item')
      expect(items).toHaveLength(1) // Only home

      const link = breadcrumb.list.querySelector('.public-good-breadcrumb__link')
      expect(link?.textContent).toBe('Home')
    })
  })

  describe('getBreadcrumbStructuredData', () => {
    it('should generate correct structured data', () => {
      const items: BreadcrumbItem[] = [
        { text: 'Home', href: '/' },
        { text: 'Services', href: '/services' },
        { text: 'Find a GP' }
      ]

      const structuredData = getBreadcrumbStructuredData(items)

      expect(structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: '/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: '/services'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Find a GP'
          }
        ]
      })
    })

    it('should handle items without href correctly', () => {
      const items: BreadcrumbItem[] = [
        { text: 'Home', href: '/' },
        { text: 'Current Page' }
      ]

      const structuredData = getBreadcrumbStructuredData(items)
      const listItems = (structuredData as any).itemListElement

      expect(listItems[0]).toHaveProperty('item', '/')
      expect(listItems[1]).not.toHaveProperty('item')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA landmarks', () => {
      const config: BreadcrumbConfig = {
        items: [{ text: 'Home', href: '/' }]
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.nav.tagName.toLowerCase()).toBe('nav')
      expect(breadcrumb.nav.getAttribute('aria-label')).toBe('Breadcrumb')
    })

    it('should use ordered list for semantic structure', () => {
      const config: BreadcrumbConfig = {
        items: [{ text: 'Home', href: '/' }]
      }

      const breadcrumb = createBreadcrumb(config)

      expect(breadcrumb.list.tagName.toLowerCase()).toBe('ol')
    })

    it('should hide chevron icons from screen readers', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Services' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)

      const chevron = breadcrumb.list.querySelector('.public-good-icon--chevron-right')
      expect(chevron?.getAttribute('aria-hidden')).toBe('true')
    })

    it('should provide visually hidden context for mobile back link', () => {
      const config: BreadcrumbConfig = {
        items: [
          { text: 'Home', href: '/' },
          { text: 'Services', href: '/services' }
        ]
      }

      const breadcrumb = createBreadcrumb(config)

      const hiddenText = breadcrumb.backLink?.querySelector('.public-good-u-visually-hidden')
      expect(hiddenText?.textContent?.trim()).toBe('Back to')
    })
  })
})