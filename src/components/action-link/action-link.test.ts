/**
 * Action Link Component Tests
 * Unit tests for the action-link component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createActionLink, 
  initializeActionLinks, 
  isValidUrl, 
  isExternalUrl, 
  createSmartActionLink,
  type ActionLinkConfig 
} from './action-link'

describe('Action Link Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('createActionLink', () => {
    it('should create a basic action link with required properties', () => {
      const config: ActionLinkConfig = {
        text: 'Find services',
        href: '/services'
      }

      const actionLink = createActionLink(config)

      expect(actionLink.element).toBeDefined()
      expect(actionLink.link).toBeDefined()
      expect(actionLink.destroy).toBeInstanceOf(Function)

      // Check container structure
      expect(actionLink.element.classList.contains('public-good-action-link')).toBe(true)

      // Check link structure
      expect(actionLink.link.classList.contains('public-good-action-link__link')).toBe(true)
      expect(actionLink.link.getAttribute('href')).toBe('/services')

      // Check icon presence
      const icon = actionLink.link.querySelector('.public-good-icon--arrow-right-circle')
      expect(icon).toBeTruthy()

      // Check text content
      const textSpan = actionLink.link.querySelector('.public-good-action-link__text')
      expect(textSpan?.textContent).toBe('Find services')
    })

    it('should handle external links with openInNewWindow option', () => {
      const config: ActionLinkConfig = {
        text: 'External link',
        href: 'https://example.com',
        openInNewWindow: true
      }

      const actionLink = createActionLink(config)

      expect(actionLink.link.getAttribute('target')).toBe('_blank')
      expect(actionLink.link.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('should apply additional classes', () => {
      const config: ActionLinkConfig = {
        text: 'Custom link',
        href: '/custom',
        classes: 'custom-class another-class'
      }

      const actionLink = createActionLink(config)

      expect(actionLink.link.classList.contains('public-good-action-link__link')).toBe(true)
      expect(actionLink.link.classList.contains('custom-class')).toBe(true)
      expect(actionLink.link.classList.contains('another-class')).toBe(true)
    })

    it('should apply custom attributes', () => {
      const config: ActionLinkConfig = {
        text: 'Attributed link',
        href: '/attributed',
        attributes: {
          'data-test': 'value',
          'aria-describedby': 'description'
        }
      }

      const actionLink = createActionLink(config)

      expect(actionLink.link.getAttribute('data-test')).toBe('value')
      expect(actionLink.link.getAttribute('aria-describedby')).toBe('description')
    })

    it('should throw error for missing required properties', () => {
      expect(() => {
        createActionLink({ text: '', href: '/test' })
      }).toThrow('Action Link requires both text and href properties')

      expect(() => {
        createActionLink({ text: 'Test', href: '' })
      }).toThrow('Action Link requires both text and href properties')
    })

    it('should handle click events with analytics', () => {
      const config: ActionLinkConfig = {
        text: 'Analytics link',
        href: '/analytics'
      }

      const actionLink = createActionLink(config)
      document.body.appendChild(actionLink.element)

      const eventSpy = vi.fn()
      actionLink.link.addEventListener('public-good:action-link:click', eventSpy)

      // Simulate click
      actionLink.link.click()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.text).toBe('Analytics link')
      expect(eventDetail.href).toBe('/analytics')
      expect(eventDetail.openInNewWindow).toBe(false)
    })

    it('should handle keyboard events', () => {
      const config: ActionLinkConfig = {
        text: 'Keyboard link',
        href: '/keyboard'
      }

      const actionLink = createActionLink(config)
      document.body.appendChild(actionLink.element)

      const clickSpy = vi.spyOn(actionLink.link, 'click')

      // Simulate space key press
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      actionLink.link.dispatchEvent(spaceEvent)

      expect(clickSpy).toHaveBeenCalled()

      // Enter key should work by default browser behavior
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      actionLink.link.dispatchEvent(enterEvent)
    })

    it('should clean up event listeners when destroyed', () => {
      const config: ActionLinkConfig = {
        text: 'Destroyable link',
        href: '/destroy'
      }

      const actionLink = createActionLink(config)
      document.body.appendChild(actionLink.element)

      // Verify element is in DOM
      expect(document.querySelector('.public-good-action-link')).toBeTruthy()

      // Destroy component
      actionLink.destroy()

      // Verify element is removed from DOM
      expect(document.querySelector('.public-good-action-link')).toBeFalsy()
    })
  })

  describe('initializeActionLinks', () => {
    it('should initialize action links from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-action-link data-text="Auto link" data-href="/auto"></div>
        <div data-public-good-action-link data-text="External auto" data-href="https://example.com" data-open-in-new-window></div>
      `

      const actionLinks = initializeActionLinks()

      expect(actionLinks).toHaveLength(2)
      
      // Check first link
      const firstLink = document.querySelector('.public-good-action-link__link') as HTMLAnchorElement
      expect(firstLink?.getAttribute('href')).toBe('/auto')
      expect(firstLink?.textContent?.trim()).toContain('Auto link')

      // Check second link
      const links = document.querySelectorAll('.public-good-action-link__link') as NodeListOf<HTMLAnchorElement>
      expect(links[1]?.getAttribute('target')).toBe('_blank')
    })

    it('should handle invalid JSON in data attributes gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-action-link 
             data-text="Invalid JSON" 
             data-href="/test" 
             data-attributes='{"invalid": json}'>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const actionLinks = initializeActionLinks()

      expect(actionLinks).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse action link attributes:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should handle initialization errors gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-action-link data-text="" data-href=""></div>
      `

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const actionLinks = initializeActionLinks()

      expect(actionLinks).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize action link:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('URL validation utilities', () => {
    describe('isValidUrl', () => {
      it('should validate absolute URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true)
        expect(isValidUrl('http://example.com')).toBe(true)
        expect(isValidUrl('ftp://example.com')).toBe(true)
      })

      it('should validate relative URLs', () => {
        expect(isValidUrl('/path')).toBe(true)
        expect(isValidUrl('/path/to/page')).toBe(true)
        expect(isValidUrl('#anchor')).toBe(true)
      })

      it('should reject invalid URLs', () => {
        expect(isValidUrl('not-a-url')).toBe(false)
        expect(isValidUrl('')).toBe(false)
        expect(isValidUrl('//invalid')).toBe(false)
      })
    })

    describe('isExternalUrl', () => {
      beforeEach(() => {
        // Mock window.location
        Object.defineProperty(window, 'location', {
          value: {
            origin: 'https://public-good.gov.uk'
          },
          writable: true
        })
      })

      it('should identify external URLs', () => {
        expect(isExternalUrl('https://external.com')).toBe(true)
        expect(isExternalUrl('http://different-site.com')).toBe(true)
      })

      it('should identify internal URLs', () => {
        expect(isExternalUrl('https://public-good.gov.uk/page')).toBe(false)
        expect(isExternalUrl('/internal-path')).toBe(false)
        expect(isExternalUrl('#anchor')).toBe(false)
      })

      it('should handle malformed URLs', () => {
        expect(isExternalUrl('not-a-url')).toBe(false)
        expect(isExternalUrl('')).toBe(false)
      })
    })
  })

  describe('createSmartActionLink', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://public-good.gov.uk'
        },
        writable: true
      })
    })

    it('should auto-detect external links and open in new window', () => {
      const actionLink = createSmartActionLink({
        text: 'External smart link',
        href: 'https://external.com'
      })

      expect(actionLink.link.getAttribute('target')).toBe('_blank')
      expect(actionLink.link.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('should not open internal links in new window', () => {
      const actionLink = createSmartActionLink({
        text: 'Internal smart link',
        href: '/internal'
      })

      expect(actionLink.link.getAttribute('target')).toBeFalsy()
      expect(actionLink.link.getAttribute('rel')).toBeFalsy()
    })

    it('should respect explicit openInNewWindow setting', () => {
      const actionLink = createSmartActionLink({
        text: 'Forced internal new window',
        href: '/internal',
        openInNewWindow: true
      })

      expect(actionLink.link.getAttribute('target')).toBe('_blank')
      expect(actionLink.link.getAttribute('rel')).toBe('noopener noreferrer')
    })
  })
})