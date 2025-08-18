/**
 * Footer Component Tests
 * Unit tests for the footer component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createFooter, 
  initializeFooters,
  createSimpleFooter,
  createNavigationFooter,
  createMinimalFooter,
  createNHSFooter,
  initAllFooters,
  type FooterLink,
  type FooterNavigationSection
} from './footer'

describe('Footer Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createFooter', () => {
    it('should create a basic footer with default properties', () => {
      const footer = createFooter()

      expect(footer.element).toBeDefined()
      expect(footer.config).toBeDefined()
      expect(footer.destroy).toBeInstanceOf(Function)
      expect(footer.addLink).toBeInstanceOf(Function)
      expect(footer.removeLink).toBeInstanceOf(Function)
      expect(footer.updateCopyright).toBeInstanceOf(Function)

      // Check structure
      expect(footer.element.tagName).toBe('FOOTER')
      expect(footer.element.classList.contains('public-good-footer')).toBe(true)
      expect(footer.element.getAttribute('role')).toBe('contentinfo')
      
      const visuallyHiddenTitle = footer.element.querySelector('.public-good-sr-only')
      expect(visuallyHiddenTitle).toBeTruthy()
      expect(visuallyHiddenTitle?.textContent).toBe('Support links')
    })

    it('should create footer with custom configuration', () => {
      const config = {
        id: 'custom-footer',
        classes: 'custom-class',
        attributes: {
          'data-test': 'footer-value'
        },
        visuallyHiddenTitle: 'Custom Support Links'
      }

      const footer = createFooter(config)

      expect(footer.element.id).toBe('custom-footer')
      expect(footer.element.classList.contains('custom-class')).toBe(true)
      expect(footer.element.getAttribute('data-test')).toBe('footer-value')
      
      const title = footer.element.querySelector('.public-good-sr-only')
      expect(title?.textContent).toBe('Custom Support Links')
    })

    it('should create footer with meta links', () => {
      const links: FooterLink[] = [
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Contact Us', href: '/contact', openInNewTab: true }
      ]

      const footer = createFooter({ links })

      const metaSection = footer.element.querySelector('.public-good-footer__meta')
      expect(metaSection).toBeTruthy()
      
      const metaLinks = footer.element.querySelectorAll('.public-good-footer__meta-item .public-good-footer__link')
      expect(metaLinks).toHaveLength(3)
      
      expect(metaLinks[0]?.textContent).toBe('Privacy Policy')
      expect((metaLinks[0] as HTMLAnchorElement).href).toContain('/privacy')
      
      expect(metaLinks[2]?.getAttribute('target')).toBe('_blank')
      expect(metaLinks[2]?.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('should create footer with navigation sections', () => {
      const navigationSections: FooterNavigationSection[] = [
        {
          title: 'Services',
          links: [
            { text: 'Service 1', href: '/service1' },
            { text: 'Service 2', href: '/service2' }
          ]
        },
        {
          title: 'Support',
          links: [
            { text: 'Help', href: '/help' },
            { text: 'FAQ', href: '/faq' }
          ]
        }
      ]

      const footer = createFooter({ navigationSections })

      const navigation = footer.element.querySelector('.public-good-footer__navigation')
      expect(navigation).toBeTruthy()
      
      const sections = footer.element.querySelectorAll('.public-good-footer__navigation-section')
      expect(sections).toHaveLength(2)
      
      const firstSectionTitle = sections[0]?.querySelector('.public-good-footer__navigation-title')
      expect(firstSectionTitle?.textContent).toBe('Services')
      
      const firstSectionLinks = sections[0]?.querySelectorAll('.public-good-footer__navigation-item .public-good-footer__link')
      expect(firstSectionLinks).toHaveLength(2)
    })

    it('should create footer with copyright information', () => {
      const footer = createFooter({
        copyrightText: '©',
        copyrightHolder: 'Test Organization',
        copyrightUrl: '/copyright'
      })

      const copyrightSection = footer.element.querySelector('.public-good-footer__copyright')
      expect(copyrightSection).toBeTruthy()
      
      const copyrightLink = copyrightSection?.querySelector('.public-good-footer__copyright-link')
      expect(copyrightLink).toBeTruthy()
      expect(copyrightLink?.textContent).toBe('© Test Organization')
      expect((copyrightLink as HTMLAnchorElement).href).toContain('/copyright')
    })

    it('should create footer with copyright text only', () => {
      const footer = createFooter({
        copyrightText: '©',
        copyrightHolder: 'Test Organization'
      })

      const copyrightSection = footer.element.querySelector('.public-good-footer__copyright')
      expect(copyrightSection).toBeTruthy()
      
      const copyrightText = copyrightSection?.querySelector('.public-good-footer__copyright-text')
      expect(copyrightText).toBeTruthy()
      expect(copyrightText?.textContent).toBe('© Test Organization')
    })

    it('should disable copyright when configured', () => {
      const footer = createFooter({ showCopyright: false })

      const copyrightSection = footer.element.querySelector('.public-good-footer__copyright')
      expect(copyrightSection).toBeFalsy()
    })

    it('should create footer without container when disabled', () => {
      const footer = createFooter({ container: false })

      const containerDiv = footer.element.querySelector('.public-good-footer-container')
      expect(containerDiv).toBeFalsy()
      
      // Content should be directly in footer
      const title = footer.element.querySelector('.public-good-sr-only')
      expect(title).toBeTruthy()
    })

    it('should handle link attributes correctly', () => {
      const links: FooterLink[] = [
        {
          text: 'Custom Link',
          href: '/custom',
          attributes: {
            'data-analytics': 'footer-click',
            'aria-label': 'Custom link description'
          }
        }
      ]

      const footer = createFooter({ links })

      const link = footer.element.querySelector('.public-good-footer__link')
      expect(link?.getAttribute('data-analytics')).toBe('footer-click')
      expect(link?.getAttribute('aria-label')).toBe('Custom link description')
    })

    it('should handle navigation section attributes', () => {
      const navigationSections: FooterNavigationSection[] = [
        {
          title: 'Test Section',
          links: [{ text: 'Test Link', href: '/test' }],
          classes: 'custom-section',
          attributes: {
            'data-section': 'test'
          }
        }
      ]

      const footer = createFooter({ navigationSections })

      const section = footer.element.querySelector('.public-good-footer__navigation-section')
      expect(section?.classList.contains('custom-section')).toBe(true)
      expect(section?.getAttribute('data-section')).toBe('test')
    })

    it('should add links dynamically', () => {
      const footer = createFooter()

      const newLink: FooterLink = {
        text: 'New Link',
        href: '/new-link'
      }

      const eventSpy = vi.fn()
      footer.element.addEventListener('public-good:footer:link-added', eventSpy)

      footer.addLink(newLink)

      expect(footer.getLinks()).toHaveLength(1)
      expect(footer.getLinks()[0]?.text).toBe('New Link')
      expect(eventSpy).toHaveBeenCalled()
      
      const link = footer.element.querySelector('.public-good-footer__link')
      expect(link?.textContent).toBe('New Link')
    })

    it('should remove links dynamically', () => {
      const initialLinks: FooterLink[] = [
        { text: 'Link 1', href: '/link1' },
        { text: 'Link 2', href: '/link2' }
      ]

      const footer = createFooter({ links: initialLinks })

      const eventSpy = vi.fn()
      footer.element.addEventListener('public-good:footer:link-removed', eventSpy)

      footer.removeLink('/link1')

      expect(footer.getLinks()).toHaveLength(1)
      expect(footer.getLinks()[0]?.text).toBe('Link 2')
      expect(eventSpy).toHaveBeenCalled()
      
      const links = footer.element.querySelectorAll('.public-good-footer__link')
      expect(links).toHaveLength(1)
      expect(links[0]?.textContent).toBe('Link 2')
    })

    it('should add navigation sections dynamically', () => {
      const footer = createFooter()

      const newSection: FooterNavigationSection = {
        title: 'New Section',
        links: [{ text: 'New Link', href: '/new' }]
      }

      const eventSpy = vi.fn()
      footer.element.addEventListener('public-good:footer:navigation-section-added', eventSpy)

      footer.addNavigationSection(newSection)

      expect(footer.getNavigationSections()).toHaveLength(1)
      expect(footer.getNavigationSections()[0]?.title).toBe('New Section')
      expect(eventSpy).toHaveBeenCalled()
      
      const section = footer.element.querySelector('.public-good-footer__navigation-section')
      expect(section).toBeTruthy()
    })

    it('should remove navigation sections dynamically', () => {
      const initialSections: FooterNavigationSection[] = [
        {
          title: 'Section 1',
          links: [{ text: 'Link 1', href: '/link1' }]
        },
        {
          title: 'Section 2',
          links: [{ text: 'Link 2', href: '/link2' }]
        }
      ]

      const footer = createFooter({ navigationSections: initialSections })

      const eventSpy = vi.fn()
      footer.element.addEventListener('public-good:footer:navigation-section-removed', eventSpy)

      footer.removeNavigationSection('Section 1')

      expect(footer.getNavigationSections()).toHaveLength(1)
      expect(footer.getNavigationSections()[0]?.title).toBe('Section 2')
      expect(eventSpy).toHaveBeenCalled()
      
      const sections = footer.element.querySelectorAll('.public-good-footer__navigation-section')
      expect(sections).toHaveLength(1)
    })

    it('should update copyright dynamically', () => {
      const footer = createFooter()

      const eventSpy = vi.fn()
      footer.element.addEventListener('public-good:footer:copyright-updated', eventSpy)

      footer.updateCopyright('©', 'New Organization', '/new-copyright')

      expect(eventSpy).toHaveBeenCalled()
      
      const copyrightLink = footer.element.querySelector('.public-good-footer__copyright-link')
      expect(copyrightLink?.textContent).toBe('© New Organization')
      expect((copyrightLink as HTMLAnchorElement).href).toContain('/new-copyright')
    })

    it('should clean up when destroyed', () => {
      const footer = createFooter()
      document.body.appendChild(footer.element)

      expect(document.querySelector('.public-good-footer')).toBeTruthy()

      footer.destroy()
      expect(document.querySelector('.public-good-footer')).toBeFalsy()
    })
  })

  describe('initializeFooters', () => {
    it('should initialize footers from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-footer 
             data-id="data-footer"
             data-copyright-holder="Data Organization">
        </div>
      `

      const components = initializeFooters()

      expect(components).toHaveLength(1)
      
      const footerElement = document.querySelector('.public-good-footer')
      expect(footerElement).toBeTruthy()
      expect(footerElement?.id).toBe('data-footer')
      
      const copyrightText = footerElement?.querySelector('.public-good-footer__copyright-text')
      expect(copyrightText?.textContent).toContain('Data Organization')
    })

    it('should initialize footers with JSON links data', () => {
      const linksData = JSON.stringify([
        { text: 'Privacy', href: '/privacy' },
        { text: 'Terms', href: '/terms' }
      ])

      document.body.innerHTML = `
        <div data-public-good-footer 
             data-links='${linksData}'>
        </div>
      `

      const components = initializeFooters()

      expect(components).toHaveLength(1)
      
      const links = document.querySelectorAll('.public-good-footer__link')
      expect(links).toHaveLength(2)
      expect(links[0]?.textContent).toBe('Privacy')
      expect(links[1]?.textContent).toBe('Terms')
    })

    it('should initialize footers with navigation sections data', () => {
      const navigationData = JSON.stringify([
        {
          title: 'Services',
          links: [{ text: 'Service 1', href: '/service1' }]
        }
      ])

      document.body.innerHTML = `
        <div data-public-good-footer 
             data-navigation-sections='${navigationData}'>
        </div>
      `

      const components = initializeFooters()

      expect(components).toHaveLength(1)
      
      const section = document.querySelector('.public-good-footer__navigation-section')
      expect(section).toBeTruthy()
      
      const title = section?.querySelector('.public-good-footer__navigation-title')
      expect(title?.textContent).toBe('Services')
    })

    it('should initialize from existing link elements', () => {
      document.body.innerHTML = `
        <div data-public-good-footer>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms" target="_blank">Terms</a>
        </div>
      `

      const components = initializeFooters()

      expect(components).toHaveLength(1)
      expect(components[0]?.getLinks()).toHaveLength(2)
      expect(components[0]?.getLinks()[0]?.text).toBe('Privacy Policy')
      expect(components[0]?.getLinks()[1]?.openInNewTab).toBe(true)
    })

    it('should handle invalid JSON gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-footer 
             data-links='{invalid-json}'>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const components = initializeFooters()

      expect(components).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith('Invalid JSON in data-links attribute:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should handle initialization errors gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-footer>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Remove the element during processing to cause error
      const elements = document.querySelectorAll('[data-public-good-footer]')
      elements.forEach(element => {
        element.remove()
      })

      const components = initializeFooters()

      expect(components).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })

    it('should parse all configuration attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-footer 
             data-id="full-config"
             data-classes="custom-footer"
             data-show-copyright="false"
             data-copyright-text="Copyright"
             data-copyright-holder="Full Org"
             data-copyright-url="/copyright"
             data-container="false"
             data-visually-hidden-title="Custom Title">
        </div>
      `

      const components = initializeFooters()

      expect(components).toHaveLength(1)
      
      const component = components[0]!
      expect(component.element.id).toBe('full-config')
      expect(component.element.classList.contains('custom-footer')).toBe(true)
      expect(component.config.showCopyright).toBe(false)
      expect(component.config.copyrightText).toBe('Copyright')
      expect(component.config.copyrightHolder).toBe('Full Org')
      expect(component.config.copyrightUrl).toBe('/copyright')
      expect(component.config.container).toBe(false)
      expect(component.config.visuallyHiddenTitle).toBe('Custom Title')
    })
  })

  describe('helper functions', () => {
    it('should create simple footer', () => {
      const links: FooterLink[] = [
        { text: 'Simple Link', href: '/simple' }
      ]
      const footer = createSimpleFooter(links)

      expect(footer.config.links).toEqual(links)
      
      const link = footer.element.querySelector('.public-good-footer__link')
      expect(link?.textContent).toBe('Simple Link')
    })

    it('should create navigation footer', () => {
      const navigationSections: FooterNavigationSection[] = [
        {
          title: 'Nav Section',
          links: [{ text: 'Nav Link', href: '/nav' }]
        }
      ]
      const metaLinks: FooterLink[] = [
        { text: 'Meta Link', href: '/meta' }
      ]

      const footer = createNavigationFooter(navigationSections, metaLinks)

      expect(footer.config.navigationSections).toEqual(navigationSections)
      expect(footer.config.links).toEqual(metaLinks)
      
      const navTitle = footer.element.querySelector('.public-good-footer__navigation-title')
      expect(navTitle?.textContent).toBe('Nav Section')
      
      const metaLink = footer.element.querySelector('.public-good-footer__meta .public-good-footer__link')
      expect(metaLink?.textContent).toBe('Meta Link')
    })

    it('should create minimal footer', () => {
      const footer = createMinimalFooter('©', 'Minimal Org')

      expect(footer.config.copyrightText).toBe('©')
      expect(footer.config.copyrightHolder).toBe('Minimal Org')
      expect(footer.config.showCopyright).toBe(true)
      
      const copyrightText = footer.element.querySelector('.public-good-footer__copyright-text')
      expect(copyrightText?.textContent).toBe('© Minimal Org')
    })

    it('should create NHS footer with standard links', () => {
      const footer = createNHSFooter()

      const links = footer.getLinks()
      expect(links.length).toBeGreaterThan(0)
      
      const linkTexts = links.map(link => link.text)
      expect(linkTexts).toContain('Accessibility statement')
      expect(linkTexts).toContain('Contact us')
      expect(linkTexts).toContain('Cookies')
      expect(linkTexts).toContain('Privacy policy')
      expect(linkTexts).toContain('Terms and conditions')
      
      expect(footer.config.copyrightHolder).toBe('NHS England')
    })

    it('should create NHS footer with additional links', () => {
      const additionalLinks: FooterLink[] = [
        { text: 'Custom NHS Link', href: '/custom' }
      ]

      const footer = createNHSFooter(additionalLinks)

      const links = footer.getLinks()
      const linkTexts = links.map(link => link.text)
      expect(linkTexts).toContain('Custom NHS Link')
      expect(linkTexts).toContain('Privacy policy') // Standard link should still be there
    })

    it('should accept additional options in helper functions', () => {
      const footer = createSimpleFooter(
        [{ text: 'Test', href: '/test' }],
        {
          classes: 'helper-class',
          visuallyHiddenTitle: 'Helper Title'
        }
      )

      expect(footer.element.classList.contains('helper-class')).toBe(true)
      expect(footer.config.visuallyHiddenTitle).toBe('Helper Title')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA structure', () => {
      const footer = createFooter()

      expect(footer.element.getAttribute('role')).toBe('contentinfo')
      
      const title = footer.element.querySelector('.public-good-sr-only')
      expect(title?.tagName).toBe('H2')
      expect(title?.textContent).toBe('Support links')
    })

    it('should have proper navigation structure', () => {
      const navigationSections: FooterNavigationSection[] = [
        {
          title: 'Test Section',
          links: [{ text: 'Test Link', href: '/test' }]
        }
      ]

      const footer = createFooter({ navigationSections })

      const nav = footer.element.querySelector('.public-good-footer__navigation')
      expect(nav?.tagName).toBe('NAV')
      expect(nav?.getAttribute('aria-labelledby')).toBe('footer-navigation')
      
      const navTitle = footer.element.querySelector('#footer-navigation')
      expect(navTitle?.tagName).toBe('H3')
      expect(navTitle?.classList.contains('public-good-sr-only')).toBe(true)
    })

    it('should handle external links with proper attributes', () => {
      const links: FooterLink[] = [
        { text: 'External Link', href: 'https://example.com', openInNewTab: true }
      ]

      const footer = createFooter({ links })

      const link = footer.element.querySelector('.public-good-footer__link')
      expect(link?.getAttribute('target')).toBe('_blank')
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
      expect(link?.getAttribute('aria-label')).toContain('(opens in new tab)')
    })

    it('should maintain proper heading hierarchy', () => {
      const navigationSections: FooterNavigationSection[] = [
        {
          title: 'Section 1',
          links: [{ text: 'Link 1', href: '/link1' }]
        }
      ]

      const footer = createFooter({ navigationSections })

      const h2 = footer.element.querySelector('h2')
      expect(h2?.classList.contains('public-good-sr-only')).toBe(true)
      
      const h3 = footer.element.querySelector('h3')
      expect(h3?.classList.contains('public-good-sr-only')).toBe(true)
      
      const h4 = footer.element.querySelector('h4')
      expect(h4?.classList.contains('public-good-footer__navigation-title')).toBe(true)
    })
  })

  describe('dynamic content management', () => {
    it('should rebuild content when links are modified', () => {
      const footer = createFooter()

      // Initially no meta section
      expect(footer.element.querySelector('.public-good-footer__meta')).toBeFalsy()

      // Add link - should create meta section
      footer.addLink({ text: 'New Link', href: '/new' })
      expect(footer.element.querySelector('.public-good-footer__meta')).toBeTruthy()

      // Remove link - should remove meta section
      footer.removeLink('/new')
      expect(footer.element.querySelector('.public-good-footer__meta')).toBeFalsy()
    })

    it('should rebuild content when navigation sections are modified', () => {
      const footer = createFooter()

      // Initially no navigation
      expect(footer.element.querySelector('.public-good-footer__navigation')).toBeFalsy()

      // Add section - should create navigation
      footer.addNavigationSection({
        title: 'New Section',
        links: [{ text: 'New Link', href: '/new' }]
      })
      expect(footer.element.querySelector('.public-good-footer__navigation')).toBeTruthy()

      // Remove section - should remove navigation
      footer.removeNavigationSection('New Section')
      expect(footer.element.querySelector('.public-good-footer__navigation')).toBeFalsy()
    })

    it('should preserve visually hidden title during rebuilds', () => {
      const footer = createFooter({ visuallyHiddenTitle: 'Custom Title' })

      const originalTitle = footer.element.querySelector('.public-good-sr-only')
      expect(originalTitle?.textContent).toBe('Custom Title')

      // Trigger rebuild
      footer.addLink({ text: 'Test', href: '/test' })

      const preservedTitle = footer.element.querySelector('.public-good-sr-only')
      expect(preservedTitle?.textContent).toBe('Custom Title')
    })
  })

  describe('initAllFooters', () => {
    it('should initialize all footers on the page', () => {
      document.body.innerHTML = `
        <div data-public-good-footer data-copyright-holder="First"></div>
        <div data-public-good-footer data-copyright-holder="Second"></div>
      `

      const components = initAllFooters()

      expect(components).toHaveLength(2)
      expect(document.querySelectorAll('.public-good-footer')).toHaveLength(2)
    })
  })
})