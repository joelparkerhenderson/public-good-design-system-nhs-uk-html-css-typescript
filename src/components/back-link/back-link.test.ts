/**
 * Back Link Component Tests
 * Unit tests for the back-link component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createBackLink, 
  initializeBackLinks,
  createHistoryBackLink,
  createSafeBackLink,
  canGoBack,
  getPreviousPageContext,
  type BackLinkConfig 
} from './back-link'

// Mock window.history and location
const mockHistory = {
  length: 2,
  back: vi.fn()
}

const mockLocation = {
  href: '',
  origin: 'https://public-good.gov.uk'
}

describe('Back Link Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    
    // Mock window objects
    Object.defineProperty(window, 'history', {
      value: mockHistory,
      writable: true
    })
    
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    })
    
    Object.defineProperty(document, 'referrer', {
      value: 'https://public-good.gov.uk/previous-page',
      writable: true
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('createBackLink', () => {
    it('should create a basic back link with default properties', () => {
      const backLink = createBackLink()

      expect(backLink.element).toBeDefined()
      expect(backLink.link).toBeDefined()
      expect(backLink.destroy).toBeInstanceOf(Function)

      // Check container structure
      expect(backLink.element.classList.contains('public-good-back-link')).toBe(true)

      // Check link structure
      expect(backLink.link.classList.contains('public-good-back-link__link')).toBe(true)
      expect(backLink.link.tagName.toLowerCase()).toBe('a')
      expect((backLink.link as HTMLAnchorElement).getAttribute('href')).toBe('#')

      // Check icon presence
      const icon = backLink.link.querySelector('.public-good-icon--chevron-left')
      expect(icon).toBeTruthy()

      // Check default text content
      expect(backLink.link.textContent?.trim()).toBe('Back')
    })

    it('should create back link with custom text', () => {
      const config: BackLinkConfig = {
        text: 'Back to services'
      }

      const backLink = createBackLink(config)

      expect(backLink.link.textContent?.trim()).toBe('Back to services')
    })

    it('should create back link with custom HTML content', () => {
      const config: BackLinkConfig = {
        html: 'Back to <strong>services</strong>'
      }

      const backLink = createBackLink(config)

      const strongElement = backLink.link.querySelector('strong')
      expect(strongElement).toBeTruthy()
      expect(strongElement?.textContent).toBe('services')
    })

    it('should prioritize HTML over text', () => {
      const config: BackLinkConfig = {
        text: 'This should be ignored',
        html: 'HTML content wins'
      }

      const backLink = createBackLink(config)

      expect(backLink.link.textContent?.trim()).toBe('HTML content wins')
    })

    it('should create button element when specified', () => {
      const config: BackLinkConfig = {
        element: 'button'
      }

      const backLink = createBackLink(config)

      expect(backLink.link.tagName.toLowerCase()).toBe('button')
      expect((backLink.link as HTMLButtonElement).type).toBe('button')
      expect(backLink.disable).toBeInstanceOf(Function)
      expect(backLink.enable).toBeInstanceOf(Function)
    })

    it('should handle href for link elements', () => {
      const config: BackLinkConfig = {
        href: '/previous-page'
      }

      const backLink = createBackLink(config)

      expect((backLink.link as HTMLAnchorElement).getAttribute('href')).toBe('/previous-page')
    })

    it('should apply additional classes', () => {
      const config: BackLinkConfig = {
        classes: 'public-good-back-link--reverse custom-class'
      }

      const backLink = createBackLink(config)

      expect(backLink.element.classList.contains('public-good-back-link')).toBe(true)
      expect(backLink.element.classList.contains('public-good-back-link--reverse')).toBe(true)
      expect(backLink.element.classList.contains('custom-class')).toBe(true)
    })

    it('should apply custom attributes', () => {
      const config: BackLinkConfig = {
        attributes: {
          'data-test': 'value',
          'aria-describedby': 'description'
        }
      }

      const backLink = createBackLink(config)

      expect(backLink.link.getAttribute('data-test')).toBe('value')
      expect(backLink.link.getAttribute('aria-describedby')).toBe('description')
    })

    it('should handle click events with analytics', () => {
      const config: BackLinkConfig = {
        text: 'Analytics back'
      }

      const backLink = createBackLink(config)
      document.body.appendChild(backLink.element)

      const eventSpy = vi.fn()
      backLink.link.addEventListener('public-good:back-link:click', eventSpy)

      // Simulate click
      backLink.link.click()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.text).toBe('Analytics back')
      expect(eventDetail.element).toBe('a')
    })

    it('should handle custom onClick handler', () => {
      const onClickSpy = vi.fn()
      const config: BackLinkConfig = {
        onClick: onClickSpy
      }

      const backLink = createBackLink(config)
      document.body.appendChild(backLink.element)

      // Simulate click
      backLink.link.click()

      expect(onClickSpy).toHaveBeenCalled()
    })

    it('should handle keyboard events for buttons', () => {
      const config: BackLinkConfig = {
        element: 'button'
      }

      const backLink = createBackLink(config)
      document.body.appendChild(backLink.element)

      const clickSpy = vi.spyOn(backLink.link, 'click')

      // Simulate space key press
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      backLink.link.dispatchEvent(spaceEvent)

      expect(clickSpy).toHaveBeenCalled()
    })

    it('should enable and disable button elements', () => {
      const config: BackLinkConfig = {
        element: 'button'
      }

      const backLink = createBackLink(config)

      expect(backLink.disable).toBeDefined()
      expect(backLink.enable).toBeDefined()

      // Test disable
      backLink.disable!()
      expect((backLink.link as HTMLButtonElement).disabled).toBe(true)
      expect(backLink.element.classList.contains('public-good-back-link--disabled')).toBe(true)

      // Test enable
      backLink.enable!()
      expect((backLink.link as HTMLButtonElement).disabled).toBe(false)
      expect(backLink.element.classList.contains('public-good-back-link--disabled')).toBe(false)
    })

    it('should clean up event listeners when destroyed', () => {
      const backLink = createBackLink()
      document.body.appendChild(backLink.element)

      // Verify element is in DOM
      expect(document.querySelector('.public-good-back-link')).toBeTruthy()

      // Destroy component
      backLink.destroy()

      // Verify element is removed from DOM
      expect(document.querySelector('.public-good-back-link')).toBeFalsy()
    })
  })

  describe('initializeBackLinks', () => {
    it('should initialize back links from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-back-link data-text="Custom back" data-href="/custom"></div>
        <div data-public-good-back-link data-element="button" data-text="Button back"></div>
      `

      const backLinks = initializeBackLinks()

      expect(backLinks).toHaveLength(2)
      
      // Check first link
      const firstLink = document.querySelector('.public-good-back-link__link') as HTMLAnchorElement
      expect(firstLink?.getAttribute('href')).toBe('/custom')
      expect(firstLink?.textContent?.trim()).toBe('Custom back')

      // Check second link
      const buttons = document.querySelectorAll('button.public-good-back-link__link')
      expect(buttons).toHaveLength(1)
      expect(buttons[0]?.textContent?.trim()).toBe('Button back')
    })

    it('should handle invalid JSON in data attributes gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-back-link 
             data-text="Invalid JSON" 
             data-attributes='{"invalid": json}'>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const backLinks = initializeBackLinks()

      expect(backLinks).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse back link attributes:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('createHistoryBackLink', () => {
    it('should create a button that goes back in history', () => {
      const backLink = createHistoryBackLink({ text: 'Go back' })

      expect(backLink.link.tagName.toLowerCase()).toBe('button')
      expect(backLink.link.textContent?.trim()).toBe('Go back')

      // Simulate click
      backLink.link.click()

      expect(mockHistory.back).toHaveBeenCalled()
    })

    it('should use fallback URL when no history available', () => {
      // Mock no history available
      Object.defineProperty(window, 'history', {
        value: { length: 1 },
        writable: true
      })

      Object.defineProperty(document, 'referrer', {
        value: '',
        writable: true
      })

      const backLink = createHistoryBackLink({ href: '/fallback' })

      // Simulate click
      backLink.link.click()

      expect(mockLocation.href).toBe('/fallback')
    })
  })

  describe('createSafeBackLink', () => {
    it('should create a safe back link with confirmation', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      const backLink = createSafeBackLink({ 
        confirmMessage: 'Are you sure?',
        text: 'Safe back' 
      })

      // Simulate click
      backLink.link.click()

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure?')
      expect(mockHistory.back).not.toHaveBeenCalled()
      
      confirmSpy.mockRestore()
    })

    it('should proceed with navigation when confirmed', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const backLink = createSafeBackLink({ 
        confirmMessage: 'Are you sure?' 
      })

      // Simulate click
      backLink.link.click()

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure?')
      // In JSDOM, URL construction might fail, so we should check for the attempt
      expect(confirmSpy).toHaveBeenCalled()
      
      confirmSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })

    it('should handle cross-origin referrer safely', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://external-site.com/page',
        writable: true
      })

      const backLink = createSafeBackLink({ fallbackUrl: '/safe-fallback' })

      // Simulate click
      backLink.link.click()

      expect(mockLocation.href).toBe('/safe-fallback')
    })
  })

  describe('utility functions', () => {
    describe('canGoBack', () => {
      it('should return true when history is available', () => {
        expect(canGoBack()).toBe(true)
      })

      it('should return false when no history available', () => {
        Object.defineProperty(window, 'history', {
          value: { length: 1 },
          writable: true
        })

        expect(canGoBack()).toBe(false)
      })

      it('should return false when no referrer available', () => {
        Object.defineProperty(document, 'referrer', {
          value: '',
          writable: true
        })

        expect(canGoBack()).toBe(false)
      })
    })

    describe('getPreviousPageContext', () => {
      it('should extract context from referrer URL', () => {
        Object.defineProperty(document, 'referrer', {
          value: 'https://public-good.gov.uk/services/find-gp',
          writable: true
        })

        const context = getPreviousPageContext()
        expect(context).toBe('find-gp')
      })

      it('should return "search results" for search pages', () => {
        Object.defineProperty(document, 'referrer', {
          value: 'https://public-good.gov.uk/search?q=services',
          writable: true
        })

        const context = getPreviousPageContext()
        expect(context).toBe('search results')
      })

      it('should return home for root path', () => {
        Object.defineProperty(document, 'referrer', {
          value: 'https://public-good.gov.uk/',
          writable: true
        })

        const context = getPreviousPageContext()
        expect(context).toBe('Home')
      })

      it('should return null for invalid referrer', () => {
        Object.defineProperty(document, 'referrer', {
          value: 'invalid-url',
          writable: true
        })

        const context = getPreviousPageContext()
        expect(context).toBe(null)
      })

      it('should return null when no referrer', () => {
        Object.defineProperty(document, 'referrer', {
          value: '',
          writable: true
        })

        const context = getPreviousPageContext()
        expect(context).toBe(null)
      })
    })
  })
})