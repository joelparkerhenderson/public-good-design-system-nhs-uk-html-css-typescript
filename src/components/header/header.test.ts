/**
 * Header Component Unit Tests
 * 
 * Tests for header configuration and basic functionality
 */

import { describe, it, expect, vi } from 'vitest'
import { 
  createHeader,
  createNHSHeader,
  createTransactionalHeader,
  createOrganisationalHeader,
  createMinimalHeader,
  type HeaderConfig,
  type HeaderNavigationLink
} from './header'

// Mock the DOM utilities to focus on configuration testing
vi.mock('../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`),
  createElementWithAttributes: vi.fn(() => ({
    appendChild: vi.fn(),
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => []),
    setAttribute: vi.fn(),
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() }
  }))
}))

// Mock the i18n function
vi.mock('../../core/functions/i18n', () => ({
  t: vi.fn((key: string) => key)
}))

// Mock global document
Object.defineProperty(global, 'document', {
  value: {
    createElement: vi.fn(() => ({
      appendChild: vi.fn(),
      querySelector: vi.fn(() => null),
      addEventListener: vi.fn()
    })),
    addEventListener: vi.fn(),
    querySelectorAll: vi.fn(() => [])
  }
})

describe('Header Component', () => {
  describe('Configuration', () => {
    it('should create header with default configuration', () => {
      const header = createHeader()

      expect(header.element).toBeDefined()
      expect(header.config).toBeDefined()
      expect(typeof header.addNavigationLink).toBe('function')
      expect(typeof header.removeNavigationLink).toBe('function')
      expect(typeof header.updateServiceName).toBe('function')
      expect(typeof header.toggleMobileMenu).toBe('function')
      expect(typeof header.getNavigationLinks).toBe('function')
      expect(typeof header.destroy).toBe('function')
    })

    it('should create header with custom configuration', () => {
      const config: HeaderConfig = {
        id: 'custom-header',
        variant: 'nhs-default',
        serviceName: {
          name: 'Test Service',
          href: '/service'
        },
        classes: 'custom-class'
      }

      const header = createHeader(config)

      expect(header.config.id).toBe('custom-header')
      expect(header.config.variant).toBe('nhs-default')
      expect(header.config.serviceName?.name).toBe('Test Service')
      expect(header.config.serviceName?.href).toBe('/service')
      expect(header.config.classes).toBe('custom-class')
    })

    it('should create header with navigation links', () => {
      const navigationLinks: HeaderNavigationLink[] = [
        { text: 'Home', href: '/' },
        { text: 'Services', href: '/services', current: true },
        { text: 'Contact', href: '/contact' }
      ]

      const config: HeaderConfig = {
        navigation: {
          links: navigationLinks
        }
      }

      const header = createHeader(config)

      expect(header.config.navigation?.links).toEqual(navigationLinks)
      expect(header.getNavigationLinks()).toEqual(navigationLinks)
    })

    it('should create header with search functionality', () => {
      const config: HeaderConfig = {
        search: {
          action: '/search',
          method: 'GET',
          placeholder: 'Search our site',
          autocomplete: true,
          suggestions: ['NHS services', 'Health advice', 'Find a service']
        }
      }

      const header = createHeader(config)

      expect(header.config.search?.action).toBe('/search')
      expect(header.config.search?.method).toBe('GET')
      expect(header.config.search?.placeholder).toBe('Search our site')
      expect(header.config.search?.autocomplete).toBe(true)
      expect(header.config.search?.suggestions).toEqual(['NHS services', 'Health advice', 'Find a service'])
    })

    it('should create header with logo configuration', () => {
      const config: HeaderConfig = {
        logo: {
          href: '/',
          src: '/logo.png',
          alt: 'Organisation logo',
          text: 'My Organisation'
        }
      }

      const header = createHeader(config)

      expect(header.config.logo?.href).toBe('/')
      expect(header.config.logo?.src).toBe('/logo.png')
      expect(header.config.logo?.alt).toBe('Organisation logo')
      expect(header.config.logo?.text).toBe('My Organisation')
    })

    it('should handle disabled container option', () => {
      const config: HeaderConfig = {
        container: false
      }

      const header = createHeader(config)

      expect(header.config.container).toBe(false)
    })
  })

  describe('Header Variants', () => {
    it('should create NHS header with correct configuration', () => {
      const header = createNHSHeader('NHS Test Service')

      expect(header.config.variant).toBe('nhs-default')
      expect(header.config.serviceName?.name).toBe('NHS Test Service')
      expect(header.config.logo?.text).toBe('NHS')
    })

    it('should create NHS header with navigation', () => {
      const navigation: HeaderNavigationLink[] = [
        { text: 'Health A-Z', href: '/health-az' },
        { text: 'Services', href: '/services' }
      ]

      const header = createNHSHeader('NHS Service', navigation)

      expect(header.config.navigation?.links).toEqual(navigation)
    })

    it('should create transactional header', () => {
      const header = createTransactionalHeader('Apply for service', '/back')

      expect(header.config.variant).toBe('transactional')
      expect(header.config.serviceName?.name).toBe('Apply for service')
      expect(header.config.showMenuButton).toBe(false)
      expect(header.config.navigation?.links).toContainEqual(
        expect.objectContaining({ href: '/back' })
      )
    })

    it('should create organisational header', () => {
      const logoConfig = {
        src: '/org-logo.png',
        alt: 'Organisation logo'
      }

      const navigation: HeaderNavigationLink[] = [
        { text: 'About', href: '/about' },
        { text: 'Services', href: '/services' }
      ]

      const header = createOrganisationalHeader('My Organisation', logoConfig, navigation)

      expect(header.config.variant).toBe('organisational')
      expect(header.config.serviceName?.name).toBe('My Organisation')
      expect(header.config.logo).toEqual(logoConfig)
      expect(header.config.navigation?.links).toEqual(navigation)
    })

    it('should create minimal header', () => {
      const header = createMinimalHeader('Simple Service')

      expect(header.config.variant).toBe('minimal')
      expect(header.config.serviceName?.name).toBe('Simple Service')
      expect(header.config.showMenuButton).toBe(false)
    })
  })

  describe('Navigation Management', () => {
    it('should add navigation link to configuration', () => {
      const header = createHeader({
        navigation: {
          links: [
            { text: 'Home', href: '/' }
          ]
        }
      })

      const newLink: HeaderNavigationLink = {
        text: 'About',
        href: '/about'
      }

      header.addNavigationLink(newLink)

      expect(header.config.navigation?.links).toContainEqual(newLink)
    })

    it('should remove navigation link from configuration', () => {
      const header = createHeader({
        navigation: {
          links: [
            { text: 'Home', href: '/' },
            { text: 'Services', href: '/services' }
          ]
        }
      })

      header.removeNavigationLink('/services')

      expect(header.config.navigation?.links).not.toContainEqual(
        expect.objectContaining({ href: '/services' })
      )
    })

    it('should get navigation links', () => {
      const links = [
        { text: 'Home', href: '/' },
        { text: 'Services', href: '/services' }
      ]

      const header = createHeader({
        navigation: { links }
      })

      expect(header.getNavigationLinks()).toEqual(links)
    })

    it('should update current page in configuration', () => {
      const header = createHeader({
        navigation: {
          links: [
            { text: 'Home', href: '/', current: true },
            { text: 'Services', href: '/services' }
          ]
        }
      })

      header.updateCurrentPage('/services')

      const updatedLinks = header.getNavigationLinks()
      const servicesLink = updatedLinks.find(link => link.href === '/services')
      const homeLink = updatedLinks.find(link => link.href === '/')

      expect(servicesLink?.current).toBe(true)
      expect(homeLink?.current).toBe(false)
    })

    it('should handle secondary navigation', () => {
      const header = createHeader({})

      const secondaryLink: HeaderNavigationLink = {
        text: 'Settings',
        href: '/settings'
      }

      header.addNavigationLink(secondaryLink, 'secondary')

      expect(header.config.secondaryNavigation?.links).toContainEqual(secondaryLink)
    })
  })

  describe('Service Name Management', () => {
    it('should update service name in configuration', () => {
      const header = createHeader({
        serviceName: {
          name: 'Original Service',
          href: '/original'
        }
      })

      header.updateServiceName('Updated Service', '/updated')

      expect(header.config.serviceName?.name).toBe('Updated Service')
      expect(header.config.serviceName?.href).toBe('/updated')
    })

    it('should update service name without href', () => {
      const header = createHeader({
        serviceName: {
          name: 'Original Service'
        }
      })

      header.updateServiceName('Text Only Service')

      expect(header.config.serviceName?.name).toBe('Text Only Service')
    })
  })

  describe('Mobile Menu Functionality', () => {
    it('should provide mobile menu methods', () => {
      const header = createHeader({
        navigation: {
          links: [{ text: 'Home', href: '/' }]
        }
      })

      expect(typeof header.toggleMobileMenu).toBe('function')
      expect(typeof header.openMobileMenu).toBe('function')
      expect(typeof header.closeMobileMenu).toBe('function')

      // These should not throw
      expect(() => header.toggleMobileMenu()).not.toThrow()
      expect(() => header.openMobileMenu()).not.toThrow()
      expect(() => header.closeMobileMenu()).not.toThrow()
    })
  })

  describe('Search Functionality', () => {
    it('should create search with autocomplete configuration', () => {
      const config: HeaderConfig = {
        search: {
          autocomplete: true,
          suggestions: ['NHS services', 'Health advice']
        }
      }

      const header = createHeader(config)

      expect(header.config.search?.autocomplete).toBe(true)
      expect(header.config.search?.suggestions).toEqual(['NHS services', 'Health advice'])
    })

    it('should create search without autocomplete', () => {
      const config: HeaderConfig = {
        search: {
          action: '/search',
          placeholder: 'Search'
        }
      }

      const header = createHeader(config)

      expect(header.config.search?.autocomplete).toBeUndefined()
      expect(header.config.search?.action).toBe('/search')
      expect(header.config.search?.placeholder).toBe('Search')
    })
  })

  describe('Complex Configuration', () => {
    it('should handle full configuration with all options', () => {
      const config: HeaderConfig = {
        id: 'complex-header',
        variant: 'organisational',
        logo: {
          href: '/',
          src: '/logo.png',
          alt: 'Logo',
          text: 'Organisation'
        },
        serviceName: {
          name: 'Complex Service',
          href: '/service'
        },
        navigation: {
          links: [
            { text: 'Home', href: '/', current: true },
            { text: 'Services', href: '/services' }
          ]
        },
        secondaryNavigation: {
          links: [
            { text: 'Help', href: '/help' },
            { text: 'Contact', href: '/contact' }
          ]
        },
        search: {
          action: '/search',
          method: 'GET',
          placeholder: 'Search everything',
          autocomplete: true,
          suggestions: ['Service 1', 'Service 2']
        },
        showMenuButton: true,
        container: true,
        classes: 'custom-header-class'
      }

      const header = createHeader(config)

      expect(header.config).toEqual(config)
    })

    it('should handle minimal configuration', () => {
      const config: HeaderConfig = {}

      const header = createHeader(config)

      expect(header.config).toEqual(config)
      expect(header.element).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty navigation arrays', () => {
      const config: HeaderConfig = {
        navigation: { links: [] },
        secondaryNavigation: { links: [] }
      }

      const header = createHeader(config)

      expect(header.getNavigationLinks()).toEqual([])
      expect(header.getNavigationLinks('secondary')).toEqual([])
    })

    it('should handle removal of non-existent links', () => {
      const header = createHeader({})

      expect(() => {
        header.removeNavigationLink('/non-existent')
      }).not.toThrow()
    })

    it('should handle updating current page for non-existent links', () => {
      const header = createHeader({})

      expect(() => {
        header.updateCurrentPage('/non-existent')
      }).not.toThrow()
    })

    it('should handle navigation operations without initial navigation', () => {
      const header = createHeader({})

      const newLink: HeaderNavigationLink = {
        text: 'New Link',
        href: '/new'
      }

      header.addNavigationLink(newLink)

      // Should create navigation config if it doesn't exist
      expect(header.config.navigation?.links).toContainEqual(newLink)
    })
  })

  describe('Helper Functions', () => {
    it('should create NHS header with custom options', () => {
      const navigation: HeaderNavigationLink[] = [
        { text: 'Services', href: '/services' },
        { text: 'Health A-Z', href: '/health-a-z' }
      ]

      const options = {
        search: {
          action: '/nhs-search'
        }
      }

      const header = createNHSHeader('NHS Service', navigation, options)

      expect(header.config.variant).toBe('nhs-default')
      expect(header.config.navigation?.links).toEqual(navigation)
      expect(header.config.search?.action).toBe('/nhs-search')
      expect(header.config.serviceName?.name).toBe('NHS Service')
    })

    it('should create transactional header without back link', () => {
      const header = createTransactionalHeader('Transaction Service')

      expect(header.config.variant).toBe('transactional')
      expect(header.config.serviceName?.name).toBe('Transaction Service')
      expect(header.config.navigation?.links || []).toHaveLength(0)
    })

    it('should create organisational header without navigation', () => {
      const logoConfig = {
        src: '/org-logo.png',
        alt: 'Organisation'
      }

      const header = createOrganisationalHeader('Organisation', logoConfig)

      expect(header.config.variant).toBe('organisational')
      expect(header.config.logo).toEqual(logoConfig)
      expect(header.config.navigation?.links || []).toHaveLength(0)
    })
  })
})