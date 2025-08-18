/**
 * Public Good Design System - Footer Component
 * TypeScript implementation of accessible footer for NHS services
 * Based on NHS UK Design System footer patterns
 */

import { generateUniqueId } from '../../core/functions/dom-utils'
import { t } from '../../core/functions/i18n'

/**
 * Footer link interface
 */
export interface FooterLink {
  text: string
  href: string
  attributes?: Record<string, string>
  openInNewTab?: boolean
}

/**
 * Footer navigation section interface
 */
export interface FooterNavigationSection {
  title: string
  links: FooterLink[]
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Footer configuration interface
 */
export interface FooterConfig {
  id?: string
  classes?: string
  attributes?: Record<string, string>
  links?: FooterLink[]
  navigationSections?: FooterNavigationSection[]
  showCopyright?: boolean
  copyrightText?: string
  copyrightHolder?: string
  copyrightUrl?: string
  container?: boolean
  visuallyHiddenTitle?: string
}

/**
 * Footer result interface
 */
export interface FooterResult {
  element: HTMLElement
  config: FooterConfig
  destroy: () => void
  addLink: (link: FooterLink) => void
  removeLink: (href: string) => void
  addNavigationSection: (section: FooterNavigationSection) => void
  removeNavigationSection: (title: string) => void
  updateCopyright: (text: string, holder?: string, url?: string) => void
  getLinks: () => FooterLink[]
  getNavigationSections: () => FooterNavigationSection[]
}

/**
 * Creates a footer component
 */
export const createFooter = (config: FooterConfig = {}): FooterResult => {
  const id = config.id || generateUniqueId('footer')
  
  // Create footer element
  const footer = document.createElement('footer')
  footer.id = id
  footer.className = `public-good-footer${config.classes ? ` ${config.classes}` : ''}`
  footer.setAttribute('role', 'contentinfo')
  
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      footer.setAttribute(key, value)
    })
  }
  
  // Create container structure
  let container: HTMLElement
  if (config.container !== false) {
    const containerDiv = document.createElement('div')
    containerDiv.className = 'public-good-footer-container'
    
    const widthContainer = document.createElement('div')
    widthContainer.className = 'public-good-width-container'
    
    container = document.createElement('div')
    container.className = 'public-good-footer__content'
    
    containerDiv.appendChild(widthContainer)
    widthContainer.appendChild(container)
    footer.appendChild(containerDiv)
  } else {
    container = footer
  }
  
  // Add visually hidden title
  const visuallyHiddenTitle = document.createElement('h2')
  visuallyHiddenTitle.className = 'public-good-sr-only'
  visuallyHiddenTitle.textContent = config.visuallyHiddenTitle || t('footer.supportLinks')
  container.appendChild(visuallyHiddenTitle)
  
  // Build footer content
  buildFooterContent(container, config)
  
  // Component API methods
  const addLink = (link: FooterLink): void => {
    if (!config.links) {
      config.links = []
    }
    config.links.push(link)
    rebuildFooterContent()
    
    // Emit event
    const addEvent = new CustomEvent('public-good:footer:link-added', {
      detail: {
        id,
        link
      },
      bubbles: true
    })
    footer.dispatchEvent(addEvent)
  }
  
  const removeLink = (href: string): void => {
    if (config.links) {
      const initialLength = config.links.length
      config.links = config.links.filter(link => link.href !== href)
      
      if (config.links.length !== initialLength) {
        rebuildFooterContent()
        
        // Emit event
        const removeEvent = new CustomEvent('public-good:footer:link-removed', {
          detail: {
            id,
            href
          },
          bubbles: true
        })
        footer.dispatchEvent(removeEvent)
      }
    }
  }
  
  const addNavigationSection = (section: FooterNavigationSection): void => {
    if (!config.navigationSections) {
      config.navigationSections = []
    }
    config.navigationSections.push(section)
    rebuildFooterContent()
    
    // Emit event
    const addEvent = new CustomEvent('public-good:footer:navigation-section-added', {
      detail: {
        id,
        section
      },
      bubbles: true
    })
    footer.dispatchEvent(addEvent)
  }
  
  const removeNavigationSection = (title: string): void => {
    if (config.navigationSections) {
      const initialLength = config.navigationSections.length
      config.navigationSections = config.navigationSections.filter(section => section.title !== title)
      
      if (config.navigationSections.length !== initialLength) {
        rebuildFooterContent()
        
        // Emit event
        const removeEvent = new CustomEvent('public-good:footer:navigation-section-removed', {
          detail: {
            id,
            title
          },
          bubbles: true
        })
        footer.dispatchEvent(removeEvent)
      }
    }
  }
  
  const updateCopyright = (text: string, holder?: string, url?: string): void => {
    config.copyrightText = text
    if (holder !== undefined) config.copyrightHolder = holder
    if (url !== undefined) config.copyrightUrl = url
    
    rebuildFooterContent()
    
    // Emit event
    const updateEvent = new CustomEvent('public-good:footer:copyright-updated', {
      detail: {
        id,
        copyrightText: text,
        copyrightHolder: holder,
        copyrightUrl: url
      },
      bubbles: true
    })
    footer.dispatchEvent(updateEvent)
  }
  
  const getLinks = (): FooterLink[] => {
    return config.links ? [...config.links] : []
  }
  
  const getNavigationSections = (): FooterNavigationSection[] => {
    return config.navigationSections ? [...config.navigationSections] : []
  }
  
  const rebuildFooterContent = (): void => {
    // Clear existing content (except visually hidden title)
    const title = container.querySelector('.public-good-sr-only')
    container.innerHTML = ''
    if (title) {
      container.appendChild(title)
    }
    
    // Rebuild content
    buildFooterContent(container, config)
  }
  
  const destroy = (): void => {
    if (footer.parentNode) {
      footer.parentNode.removeChild(footer)
    }
  }
  
  return {
    element: footer,
    config,
    destroy,
    addLink,
    removeLink,
    addNavigationSection,
    removeNavigationSection,
    updateCopyright,
    getLinks,
    getNavigationSections
  }
}

/**
 * Builds footer content based on configuration
 */
function buildFooterContent(container: HTMLElement, config: FooterConfig): void {
  // Create navigation sections if any
  if (config.navigationSections && config.navigationSections.length > 0) {
    const navigation = document.createElement('nav')
    navigation.className = 'public-good-footer__navigation'
    navigation.setAttribute('aria-labelledby', 'footer-navigation')
    
    const navTitle = document.createElement('h3')
    navTitle.id = 'footer-navigation'
    navTitle.className = 'public-good-sr-only'
    navTitle.textContent = t('footer.navigation')
    navigation.appendChild(navTitle)
    
    const navList = document.createElement('div')
    navList.className = 'public-good-footer__navigation-list'
    
    config.navigationSections.forEach((section) => {
      const sectionContainer = document.createElement('div')
      sectionContainer.className = `public-good-footer__navigation-section${section.classes ? ` ${section.classes}` : ''}`
      
      if (section.attributes) {
        Object.entries(section.attributes).forEach(([key, value]) => {
          sectionContainer.setAttribute(key, value)
        })
      }
      
      const sectionTitle = document.createElement('h4')
      sectionTitle.className = 'public-good-footer__navigation-title'
      sectionTitle.textContent = section.title
      sectionContainer.appendChild(sectionTitle)
      
      const sectionList = document.createElement('ul')
      sectionList.className = 'public-good-footer__navigation-items'
      
      section.links.forEach((link) => {
        const listItem = document.createElement('li')
        listItem.className = 'public-good-footer__navigation-item'
        
        const linkElement = createFooterLink(link)
        listItem.appendChild(linkElement)
        sectionList.appendChild(listItem)
      })
      
      sectionContainer.appendChild(sectionList)
      navList.appendChild(sectionContainer)
    })
    
    navigation.appendChild(navList)
    container.appendChild(navigation)
  }
  
  // Create meta links section
  if (config.links && config.links.length > 0) {
    const metaSection = document.createElement('div')
    metaSection.className = 'public-good-footer__meta'
    
    const metaList = document.createElement('ul')
    metaList.className = 'public-good-footer__meta-list'
    
    config.links.forEach((link) => {
      const listItem = document.createElement('li')
      listItem.className = 'public-good-footer__meta-item'
      
      const linkElement = createFooterLink(link)
      listItem.appendChild(linkElement)
      metaList.appendChild(listItem)
    })
    
    metaSection.appendChild(metaList)
    container.appendChild(metaSection)
  }
  
  // Create copyright section
  if (config.showCopyright !== false) {
    const copyrightSection = document.createElement('div')
    copyrightSection.className = 'public-good-footer__copyright'
    
    const copyrightText = config.copyrightText || t('footer.copyright')
    const copyrightHolder = config.copyrightHolder || t('footer.copyrightHolder')
    
    if (config.copyrightUrl) {
      const copyrightLink = document.createElement('a')
      copyrightLink.href = config.copyrightUrl
      copyrightLink.className = 'public-good-footer__copyright-link'
      copyrightLink.textContent = `${copyrightText} ${copyrightHolder}`
      copyrightSection.appendChild(copyrightLink)
    } else {
      const copyrightParagraph = document.createElement('p')
      copyrightParagraph.className = 'public-good-footer__copyright-text'
      copyrightParagraph.textContent = `${copyrightText} ${copyrightHolder}`
      copyrightSection.appendChild(copyrightParagraph)
    }
    
    container.appendChild(copyrightSection)
  }
}

/**
 * Creates a footer link element
 */
function createFooterLink(link: FooterLink): HTMLAnchorElement {
  const linkElement = document.createElement('a')
  linkElement.href = link.href
  linkElement.className = 'public-good-footer__link'
  linkElement.textContent = link.text
  
  if (link.openInNewTab) {
    linkElement.target = '_blank'
    linkElement.rel = 'noopener noreferrer'
    linkElement.setAttribute('aria-label', `${link.text} ${t('footer.opensInNewTab')}`)
  }
  
  if (link.attributes) {
    Object.entries(link.attributes).forEach(([key, value]) => {
      linkElement.setAttribute(key, value)
    })
  }
  
  return linkElement
}

/**
 * Initialize footer components from data attributes
 */
export const initializeFooters = (): FooterResult[] => {
  const elements = document.querySelectorAll('[data-public-good-footer]')
  const components: FooterResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: FooterConfig = {}
      
      // Parse basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      const showCopyright = element.getAttribute('data-show-copyright')
      if (showCopyright === 'false') config.showCopyright = false
      
      const copyrightText = element.getAttribute('data-copyright-text')
      if (copyrightText) config.copyrightText = copyrightText
      
      const copyrightHolder = element.getAttribute('data-copyright-holder')
      if (copyrightHolder) config.copyrightHolder = copyrightHolder
      
      const copyrightUrl = element.getAttribute('data-copyright-url')
      if (copyrightUrl) config.copyrightUrl = copyrightUrl
      
      const container = element.getAttribute('data-container')
      if (container === 'false') config.container = false
      
      const visuallyHiddenTitle = element.getAttribute('data-visually-hidden-title')
      if (visuallyHiddenTitle) config.visuallyHiddenTitle = visuallyHiddenTitle
      
      // Parse links from data attributes or existing DOM structure
      const linksData = element.getAttribute('data-links')
      if (linksData) {
        try {
          config.links = JSON.parse(linksData)
        } catch (error) {
          console.warn('Invalid JSON in data-links attribute:', error)
        }
      } else {
        // Parse from existing link elements
        const existingLinks = element.querySelectorAll('a[href]')
        if (existingLinks.length > 0) {
          config.links = Array.from(existingLinks).map((link) => ({
            text: link.textContent?.trim() || '',
            href: (link as HTMLAnchorElement).href,
            openInNewTab: (link as HTMLAnchorElement).target === '_blank'
          }))
        }
      }
      
      // Parse navigation sections
      const navigationData = element.getAttribute('data-navigation-sections')
      if (navigationData) {
        try {
          config.navigationSections = JSON.parse(navigationData)
        } catch (error) {
          console.warn('Invalid JSON in data-navigation-sections attribute:', error)
        }
      }
      
      const footer = createFooter(config)
      element.parentNode?.replaceChild(footer.element, element)
      components.push(footer)
    } catch (error) {
      console.error('Error initializing footer component:', error)
    }
  })
  
  return components
}

/**
 * Helper function to create a simple footer with meta links
 */
export const createSimpleFooter = (
  links: FooterLink[],
  options?: Partial<FooterConfig>
): FooterResult => {
  return createFooter({
    links,
    ...options
  })
}

/**
 * Helper function to create a footer with navigation sections
 */
export const createNavigationFooter = (
  navigationSections: FooterNavigationSection[],
  metaLinks?: FooterLink[],
  options?: Partial<FooterConfig>
): FooterResult => {
  return createFooter({
    navigationSections,
    links: metaLinks,
    ...options
  })
}

/**
 * Helper function to create a minimal footer with just copyright
 */
export const createMinimalFooter = (
  copyrightText?: string,
  copyrightHolder?: string,
  options?: Partial<FooterConfig>
): FooterResult => {
  return createFooter({
    copyrightText,
    copyrightHolder,
    showCopyright: true,
    ...options
  })
}

/**
 * Helper function to create a standard NHS footer
 */
export const createNHSFooter = (
  additionalLinks?: FooterLink[],
  options?: Partial<FooterConfig>
): FooterResult => {
  const standardLinks: FooterLink[] = [
    { text: t('footer.accessibility'), href: '/accessibility-statement' },
    { text: t('footer.contact'), href: '/contact' },
    { text: t('footer.cookies'), href: '/cookies' },
    { text: t('footer.privacy'), href: '/privacy-policy' },
    { text: t('footer.terms'), href: '/terms-and-conditions' }
  ]
  
  const allLinks = additionalLinks ? [...standardLinks, ...additionalLinks] : standardLinks
  
  return createFooter({
    links: allLinks,
    copyrightHolder: t('footer.nhsCopyrightHolder'),
    ...options
  })
}

/**
 * Initialize all footer components on the page
 */
export const initAllFooters = (): FooterResult[] => {
  return initializeFooters()
}