/**
 * Header Component
 * 
 * Provides a flexible header component supporting various NHS UK and GOV.UK patterns
 * including navigation, search, branding, and different service types.
 * 
 * Features:
 * - Multiple header variants (NHS Default, Transactional, Organisational)
 * - Primary and secondary navigation
 * - Search functionality with autocomplete
 * - Mobile-friendly responsive design
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Event-driven architecture
 * - Data attribute initialization
 * - Full TypeScript support
 */

import { generateUniqueId } from '../../core/functions/dom-utils'
import { t } from '../../core/functions/i18n'

/**
 * Helper function to create elements with attributes
 */
function createElementWithAttributes(tagName: string, attributes: Record<string, any> = {}): HTMLElement {
  const element = document.createElement(tagName)
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value
    } else if (key === 'textContent') {
      element.textContent = value
    } else if (key === 'innerHTML') {
      element.innerHTML = value
    } else {
      element.setAttribute(key, value)
    }
  })
  return element
}

/**
 * Individual navigation link configuration
 */
export interface HeaderNavigationLink {
  text: string
  href: string
  current?: boolean
  openInNewTab?: boolean
  attributes?: Record<string, string>
}

/**
 * Navigation section configuration
 */
export interface HeaderNavigationSection {
  links: HeaderNavigationLink[]
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Search configuration
 */
export interface HeaderSearchConfig {
  action?: string
  method?: 'GET' | 'POST'
  inputName?: string
  inputId?: string
  placeholder?: string
  buttonText?: string
  autocomplete?: boolean
  suggestions?: string[]
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Logo/branding configuration
 */
export interface HeaderLogoConfig {
  href?: string
  src?: string
  alt?: string
  text?: string
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Service name configuration
 */
export interface HeaderServiceConfig {
  name: string
  href?: string
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Header component configuration
 */
export interface HeaderConfig {
  id?: string
  variant?: 'nhs-default' | 'transactional' | 'organisational' | 'minimal'
  logo?: HeaderLogoConfig
  serviceName?: HeaderServiceConfig
  navigation?: HeaderNavigationSection
  secondaryNavigation?: HeaderNavigationSection
  search?: HeaderSearchConfig
  showMenuButton?: boolean
  container?: boolean
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Header component result
 */
export interface HeaderResult {
  element: HTMLElement
  config: HeaderConfig
  addNavigationLink: (link: HeaderNavigationLink, section?: 'primary' | 'secondary') => void
  removeNavigationLink: (href: string, section?: 'primary' | 'secondary') => void
  updateServiceName: (name: string, href?: string) => void
  toggleMobileMenu: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  getNavigationLinks: (section?: 'primary' | 'secondary') => HeaderNavigationLink[]
  updateCurrentPage: (href: string, section?: 'primary' | 'secondary') => void
  destroy: () => void
}

/**
 * Creates a navigation link element
 */
function createHeaderNavigationLink(link: HeaderNavigationLink): HTMLAnchorElement {
  const linkElement = createElementWithAttributes('a', {
    href: link.href,
    className: 'public-good-header__navigation-link' + (link.current ? ' public-good-header__navigation-link--current' : ''),
    textContent: link.text,
    ...(link.openInNewTab && {
      target: '_blank',
      rel: 'noopener noreferrer'
    }),
    ...(link.current && {
      'aria-current': 'page'
    }),
    ...link.attributes
  }) as HTMLAnchorElement

  if (link.openInNewTab) {
    linkElement.setAttribute('aria-label', `${link.text} ${t('header.opensInNewTab')}`)
  }

  return linkElement
}

/**
 * Creates the header logo/branding section
 */
function createHeaderLogo(config: HeaderLogoConfig, variant: string): HTMLElement {
  const logoContainer = createElementWithAttributes('div', {
    className: 'public-good-header__logo'
  })

  if (config.href) {
    const logoLink = createElementWithAttributes('a', {
      href: config.href,
      className: 'public-good-header__logo-link',
      ...config.attributes
    }) as HTMLAnchorElement

    if (config.src) {
      const logoImage = createElementWithAttributes('img', {
        src: config.src,
        alt: config.alt || t('header.logoAlt'),
        className: 'public-good-header__logo-image'
      })
      logoLink.appendChild(logoImage)
    }

    if (config.text || variant === 'nhs-default') {
      const logoText = createElementWithAttributes('span', {
        className: 'public-good-header__logo-text',
        textContent: config.text || (variant === 'nhs-default' ? 'NHS' : '')
      })
      logoLink.appendChild(logoText)
    }

    logoContainer.appendChild(logoLink)
  } else {
    if (config.src) {
      const logoImage = createElementWithAttributes('img', {
        src: config.src,
        alt: config.alt || t('header.logoAlt'),
        className: 'public-good-header__logo-image'
      })
      logoContainer.appendChild(logoImage)
    }

    if (config.text || variant === 'nhs-default') {
      const logoText = createElementWithAttributes('span', {
        className: 'public-good-header__logo-text',
        textContent: config.text || (variant === 'nhs-default' ? 'NHS' : '')
      })
      logoContainer.appendChild(logoText)
    }
  }

  return logoContainer
}

/**
 * Creates the service name section
 */
function createServiceName(config: HeaderServiceConfig): HTMLElement {
  const serviceContainer = createElementWithAttributes('div', {
    className: 'public-good-header__service-name' + (config.classes ? ' ' + config.classes : '')
  })

  if (config.href) {
    const serviceLink = createElementWithAttributes('a', {
      href: config.href,
      className: 'public-good-header__service-link',
      textContent: config.name,
      ...config.attributes
    })
    serviceContainer.appendChild(serviceLink)
  } else {
    const serviceText = createElementWithAttributes('span', {
      className: 'public-good-header__service-text',
      textContent: config.name,
      ...config.attributes
    })
    serviceContainer.appendChild(serviceText)
  }

  return serviceContainer
}

/**
 * Creates the search section
 */
function createHeaderSearch(config: HeaderSearchConfig): HTMLElement {
  const searchContainer = createElementWithAttributes('div', {
    className: 'public-good-header__search' + (config.classes ? ' ' + config.classes : '')
  })

  const searchForm = createElementWithAttributes('form', {
    className: 'public-good-header__search-form',
    action: config.action || '/search',
    method: config.method || 'GET',
    role: 'search',
    ...config.attributes
  }) as HTMLFormElement

  const searchInputGroup = createElementWithAttributes('div', {
    className: 'public-good-header__search-input-group'
  })

  const searchLabel = createElementWithAttributes('label', {
    className: 'public-good-sr-only',
    textContent: t('header.searchLabel'),
    htmlFor: config.inputId || generateUniqueId('search-input')
  })

  const searchInput = createElementWithAttributes('input', {
    type: 'search',
    id: config.inputId || generateUniqueId('search-input'),
    name: config.inputName || 'q',
    className: 'public-good-header__search-input',
    placeholder: config.placeholder || t('header.searchPlaceholder'),
    autocomplete: config.autocomplete ? 'on' : 'off'
  }) as HTMLInputElement

  const searchButton = createElementWithAttributes('button', {
    type: 'submit',
    className: 'public-good-header__search-button',
    textContent: config.buttonText || t('header.searchButton')
  }) as HTMLButtonElement

  // Add search icon to button
  const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  searchIcon.setAttribute('class', 'public-good-header__search-icon')
  searchIcon.setAttribute('viewBox', '0 0 24 24')
  searchIcon.setAttribute('fill', 'none')
  searchIcon.setAttribute('stroke', 'currentColor')
  searchIcon.setAttribute('stroke-width', '2')
  searchIcon.setAttribute('stroke-linecap', 'round')
  searchIcon.setAttribute('stroke-linejoin', 'round')

  const searchIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  searchIconPath.setAttribute('d', 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z')
  searchIcon.appendChild(searchIconPath)
  searchButton.appendChild(searchIcon)

  searchInputGroup.appendChild(searchLabel)
  searchInputGroup.appendChild(searchInput)
  searchInputGroup.appendChild(searchButton)

  searchForm.appendChild(searchInputGroup)

  // Add autocomplete functionality if enabled
  if (config.autocomplete && config.suggestions) {
    const suggestionsList = createElementWithAttributes('ul', {
      className: 'public-good-header__search-suggestions',
      role: 'listbox',
      'aria-label': t('header.searchSuggestions')
    }) as HTMLUListElement

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase()
      suggestionsList.innerHTML = ''

      if (query.length > 0) {
        const filteredSuggestions = config.suggestions!.filter(suggestion =>
          suggestion.toLowerCase().includes(query)
        ).slice(0, 5)

        if (filteredSuggestions.length > 0) {
          filteredSuggestions.forEach((suggestion) => {
            const suggestionItem = createElementWithAttributes('li', {
              className: 'public-good-header__search-suggestion',
              role: 'option',
              textContent: suggestion,
              tabIndex: -1
            })

            suggestionItem.addEventListener('click', () => {
              searchInput.value = suggestion
              suggestionsList.innerHTML = ''
              searchForm.submit()
            })

            suggestionsList.appendChild(suggestionItem)
          })

          suggestionsList.style.display = 'block'
        } else {
          suggestionsList.style.display = 'none'
        }
      } else {
        suggestionsList.style.display = 'none'
      }
    })

    searchContainer.appendChild(suggestionsList)
  }

  searchContainer.appendChild(searchForm)
  return searchContainer
}

/**
 * Creates the navigation section
 */
function createHeaderNavigation(config: HeaderNavigationSection, isPrimary: boolean = true): HTMLElement {
  const navClassName = isPrimary ? 'public-good-header__navigation' : 'public-good-header__secondary-navigation'
  const navContainer = createElementWithAttributes('nav', {
    className: navClassName + (config.classes ? ' ' + config.classes : ''),
    'aria-label': isPrimary ? t('header.primaryNavigation') : t('header.secondaryNavigation'),
    ...config.attributes
  }) as HTMLElement

  const navList = createElementWithAttributes('ul', {
    className: 'public-good-header__navigation-list'
  }) as HTMLUListElement

  config.links.forEach(link => {
    const listItem = createElementWithAttributes('li', {
      className: 'public-good-header__navigation-item'
    })

    const linkElement = createHeaderNavigationLink(link)
    listItem.appendChild(linkElement)
    navList.appendChild(listItem)
  })

  navContainer.appendChild(navList)
  return navContainer
}

/**
 * Creates the mobile menu toggle button
 */
function createMobileMenuButton(): HTMLButtonElement {
  const menuButton = createElementWithAttributes('button', {
    type: 'button',
    className: 'public-good-header__menu-button',
    'aria-expanded': 'false',
    'aria-controls': 'mobile-navigation',
    'aria-label': t('header.menuButton')
  }) as HTMLButtonElement

  const menuIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  menuIcon.setAttribute('class', 'public-good-header__menu-icon')
  menuIcon.setAttribute('viewBox', '0 0 24 24')
  menuIcon.setAttribute('fill', 'none')
  menuIcon.setAttribute('stroke', 'currentColor')
  menuIcon.setAttribute('stroke-width', '2')
  menuIcon.setAttribute('stroke-linecap', 'round')
  menuIcon.setAttribute('stroke-linejoin', 'round')

  const menuIconPaths = [
    'M3 12h18M3 6h18M3 18h18'
  ]

  menuIconPaths.forEach(pathData => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', pathData)
    menuIcon.appendChild(path)
  })

  menuButton.appendChild(menuIcon)

  const menuText = createElementWithAttributes('span', {
    className: 'public-good-header__menu-text',
    textContent: t('header.menu')
  })
  menuButton.appendChild(menuText)

  return menuButton
}

/**
 * Builds the header content based on configuration
 */
function buildHeaderContent(container: HTMLElement, config: HeaderConfig): void {
  const headerContent = createElementWithAttributes('div', {
    className: 'public-good-header__content'
  })

  // Create branding section (logo + service name)
  const brandingSection = createElementWithAttributes('div', {
    className: 'public-good-header__branding'
  })

  // Add logo if configured or if using NHS variant
  if (config.logo || config.variant === 'nhs-default') {
    const logoConfig = config.logo || { text: 'NHS' }
    const logo = createHeaderLogo(logoConfig, config.variant || 'nhs-default')
    brandingSection.appendChild(logo)
  }

  // Add service name if configured
  if (config.serviceName) {
    const serviceName = createServiceName(config.serviceName)
    brandingSection.appendChild(serviceName)
  }

  headerContent.appendChild(brandingSection)

  // Create actions section (search + navigation + menu button)
  const actionsSection = createElementWithAttributes('div', {
    className: 'public-good-header__actions'
  })

  // Add search if configured
  if (config.search) {
    const search = createHeaderSearch(config.search)
    actionsSection.appendChild(search)
  }

  // Add primary navigation if configured
  if (config.navigation && config.navigation.links.length > 0) {
    const navigation = createHeaderNavigation(config.navigation, true)
    actionsSection.appendChild(navigation)
  }

  // Add mobile menu button if configured
  if (config.showMenuButton !== false) {
    const menuButton = createMobileMenuButton()
    actionsSection.appendChild(menuButton)
  }

  headerContent.appendChild(actionsSection)

  // Add secondary navigation if configured (appears below main content)
  if (config.secondaryNavigation && config.secondaryNavigation.links.length > 0) {
    const secondaryNav = createHeaderNavigation(config.secondaryNavigation, false)
    headerContent.appendChild(secondaryNav)
  }

  container.appendChild(headerContent)
}

/**
 * Creates a header component
 */
export function createHeader(config: HeaderConfig = {}): HeaderResult {
  const id = config.id || generateUniqueId('header')
  const variant = config.variant || 'nhs-default'

  // Create the main header element
  const header = createElementWithAttributes('header', {
    id,
    className: `public-good-header public-good-header--${variant}` + (config.classes ? ` ${config.classes}` : ''),
    role: 'banner',
    ...config.attributes
  }) as HTMLElement

  // Create container structure
  let container: HTMLElement
  if (config.container !== false) {
    const containerDiv = createElementWithAttributes('div', {
      className: 'public-good-header-container'
    })

    const widthContainer = createElementWithAttributes('div', {
      className: 'public-good-width-container'
    })

    container = widthContainer
    containerDiv.appendChild(widthContainer)
    header.appendChild(containerDiv)
  } else {
    container = header
  }

  // Build header content
  buildHeaderContent(container, config)

  // Set up mobile menu functionality
  const menuButton = header.querySelector('.public-good-header__menu-button') as HTMLButtonElement
  let mobileMenuOpen = false

  function toggleMobileMenu(): void {
    mobileMenuOpen = !mobileMenuOpen
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', mobileMenuOpen.toString())
      header.classList.toggle('public-good-header--mobile-menu-open', mobileMenuOpen)
    }

    // Dispatch custom event
    const event = new CustomEvent('public-good:header:mobile-menu-toggled', {
      detail: { open: mobileMenuOpen, header: header },
      bubbles: true
    })
    header.dispatchEvent(event)
  }

  function openMobileMenu(): void {
    if (!mobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  function closeMobileMenu(): void {
    if (mobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  // Add event listeners
  if (menuButton) {
    menuButton.addEventListener('click', toggleMobileMenu)
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    if (mobileMenuOpen && !header.contains(event.target as Node)) {
      closeMobileMenu()
    }
  })

  // Close mobile menu on escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu()
      menuButton?.focus()
    }
  })

  // Add navigation link to specified section
  function addNavigationLink(link: HeaderNavigationLink, section: 'primary' | 'secondary' = 'primary'): void {
    const navSelector = section === 'primary' 
      ? '.public-good-header__navigation .public-good-header__navigation-list'
      : '.public-good-header__secondary-navigation .public-good-header__navigation-list'
    
    const navList = header.querySelector(navSelector) as HTMLUListElement
    if (!navList) return

    const listItem = createElementWithAttributes('li', {
      className: 'public-good-header__navigation-item'
    })

    const linkElement = createHeaderNavigationLink(link)
    listItem.appendChild(linkElement)
    navList.appendChild(listItem)

    // Update config
    const navConfig = section === 'primary' ? config.navigation : config.secondaryNavigation
    if (navConfig) {
      navConfig.links.push(link)
    }

    // Dispatch custom event
    const event = new CustomEvent('public-good:header:navigation-link-added', {
      detail: { link, section, header },
      bubbles: true
    })
    header.dispatchEvent(event)
  }

  // Remove navigation link from specified section
  function removeNavigationLink(href: string, section: 'primary' | 'secondary' = 'primary'): void {
    const navSelector = section === 'primary' 
      ? '.public-good-header__navigation .public-good-header__navigation-list'
      : '.public-good-header__secondary-navigation .public-good-header__navigation-list'
    
    const navList = header.querySelector(navSelector) as HTMLUListElement
    if (!navList) return

    const linkToRemove = navList.querySelector(`a[href="${href}"]`)
    if (linkToRemove) {
      const listItem = linkToRemove.closest('li')
      if (listItem) {
        listItem.remove()
      }
    }

    // Update config
    const navConfig = section === 'primary' ? config.navigation : config.secondaryNavigation
    if (navConfig) {
      navConfig.links = navConfig.links.filter(link => link.href !== href)
    }

    // Dispatch custom event
    const event = new CustomEvent('public-good:header:navigation-link-removed', {
      detail: { href, section, header },
      bubbles: true
    })
    header.dispatchEvent(event)
  }

  // Update service name
  function updateServiceName(name: string, href?: string): void {
    const serviceContainer = header.querySelector('.public-good-header__service-name')
    if (!serviceContainer) return

    serviceContainer.innerHTML = ''

    if (href) {
      const serviceLink = createElementWithAttributes('a', {
        href,
        className: 'public-good-header__service-link',
        textContent: name
      })
      serviceContainer.appendChild(serviceLink)
    } else {
      const serviceText = createElementWithAttributes('span', {
        className: 'public-good-header__service-text',
        textContent: name
      })
      serviceContainer.appendChild(serviceText)
    }

    // Update config
    if (config.serviceName) {
      config.serviceName.name = name
      if (href !== undefined) {
        config.serviceName.href = href
      }
    }

    // Dispatch custom event
    const event = new CustomEvent('public-good:header:service-name-updated', {
      detail: { name, href, header },
      bubbles: true
    })
    header.dispatchEvent(event)
  }

  // Get navigation links from specified section
  function getNavigationLinks(section: 'primary' | 'secondary' = 'primary'): HeaderNavigationLink[] {
    const navConfig = section === 'primary' ? config.navigation : config.secondaryNavigation
    return navConfig ? [...navConfig.links] : []
  }

  // Update current page indicator
  function updateCurrentPage(href: string, section: 'primary' | 'secondary' = 'primary'): void {
    const navSelector = section === 'primary' 
      ? '.public-good-header__navigation'
      : '.public-good-header__secondary-navigation'
    
    const nav = header.querySelector(navSelector) as HTMLElement
    if (!nav) return

    // Remove current indicators from all links
    const allLinks = nav.querySelectorAll('.public-good-header__navigation-link')
    allLinks.forEach(link => {
      link.classList.remove('public-good-header__navigation-link--current')
      link.removeAttribute('aria-current')
    })

    // Add current indicator to specified link
    const currentLink = nav.querySelector(`a[href="${href}"]`)
    if (currentLink) {
      currentLink.classList.add('public-good-header__navigation-link--current')
      currentLink.setAttribute('aria-current', 'page')
    }

    // Update config
    const navConfig = section === 'primary' ? config.navigation : config.secondaryNavigation
    if (navConfig) {
      navConfig.links.forEach(link => {
        link.current = link.href === href
      })
    }

    // Dispatch custom event
    const event = new CustomEvent('public-good:header:current-page-updated', {
      detail: { href, section, header },
      bubbles: true
    })
    header.dispatchEvent(event)
  }

  // Cleanup function
  function destroy(): void {
    if (menuButton) {
      menuButton.removeEventListener('click', toggleMobileMenu)
    }
    header.remove()
  }

  return {
    element: header,
    config,
    addNavigationLink,
    removeNavigationLink,
    updateServiceName,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    getNavigationLinks,
    updateCurrentPage,
    destroy
  }
}

/**
 * Creates an NHS-style header with standard NHS branding
 */
export function createNHSHeader(serviceName?: string, navigation?: HeaderNavigationLink[], options: Partial<HeaderConfig> = {}): HeaderResult {
  const config: HeaderConfig = {
    variant: 'nhs-default',
    logo: {
      text: 'NHS',
      href: options.logo?.href || '/'
    },
    ...options
  }

  if (serviceName) {
    config.serviceName = {
      name: serviceName
    }
    if (options.serviceName?.href) {
      config.serviceName.href = options.serviceName.href
    }
  }

  if (navigation && navigation.length > 0) {
    config.navigation = {
      links: navigation
    }
  }

  return createHeader(config)
}

/**
 * Creates a transactional service header (minimal styling)
 */
export function createTransactionalHeader(serviceName: string, backLink?: string, options: Partial<HeaderConfig> = {}): HeaderResult {
  const navigationLinks: HeaderNavigationLink[] = []
  
  if (backLink) {
    navigationLinks.push({
      text: t('header.back'),
      href: backLink
    })
  }

  return createHeader({
    variant: 'transactional',
    serviceName: {
      name: serviceName,
      href: options.serviceName?.href || '/'
    },
    ...(navigationLinks.length > 0 && {
      navigation: {
        links: navigationLinks
      }
    }),
    showMenuButton: false,
    ...options
  })
}

/**
 * Creates an organisational header with logo and full navigation
 */
export function createOrganisationalHeader(
  organisationName: string,
  logoConfig: HeaderLogoConfig,
  navigation?: HeaderNavigationLink[],
  options: Partial<HeaderConfig> = {}
): HeaderResult {
  return createHeader({
    variant: 'organisational',
    logo: logoConfig,
    serviceName: {
      name: organisationName,
      href: options.serviceName?.href || '/'
    },
    ...(navigation && navigation.length > 0 && {
      navigation: {
        links: navigation
      }
    }),
    ...options
  })
}

/**
 * Creates a minimal header with just branding
 */
export function createMinimalHeader(serviceName: string, options: Partial<HeaderConfig> = {}): HeaderResult {
  return createHeader({
    variant: 'minimal',
    serviceName: {
      name: serviceName,
      href: options.serviceName?.href || '/'
    },
    showMenuButton: false,
    ...options
  })
}

/**
 * Initialize all headers from data attributes in the DOM
 */
export function initializeHeaders(): HeaderResult[] {
  const elements = document.querySelectorAll('[data-public-good-header]')
  const components: HeaderResult[] = []

  elements.forEach((element) => {
    try {
      const config: HeaderConfig = {}

      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id

      const variant = element.getAttribute('data-variant') as HeaderConfig['variant']
      if (variant) config.variant = variant

      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes

      const container = element.getAttribute('data-container')
      if (container === 'false') config.container = false

      const showMenuButton = element.getAttribute('data-show-menu-button')
      if (showMenuButton === 'false') config.showMenuButton = false

      // Logo configuration
      const logoHref = element.getAttribute('data-logo-href')
      const logoSrc = element.getAttribute('data-logo-src')
      const logoAlt = element.getAttribute('data-logo-alt')
      const logoText = element.getAttribute('data-logo-text')
      if (logoHref || logoSrc || logoAlt || logoText) {
        config.logo = {}
        if (logoHref) config.logo.href = logoHref
        if (logoSrc) config.logo.src = logoSrc
        if (logoAlt) config.logo.alt = logoAlt
        if (logoText) config.logo.text = logoText
      }

      // Service name configuration
      const serviceName = element.getAttribute('data-service-name')
      const serviceHref = element.getAttribute('data-service-href')
      if (serviceName) {
        config.serviceName = {
          name: serviceName,
          ...(serviceHref && { href: serviceHref })
        }
      }

      // Navigation configuration
      const navigationData = element.getAttribute('data-navigation')
      if (navigationData) {
        try {
          const navigationLinks = JSON.parse(navigationData) as HeaderNavigationLink[]
          config.navigation = { links: navigationLinks }
        } catch (error) {
          console.warn('Invalid JSON in data-navigation attribute:', error)
        }
      }

      // Secondary navigation configuration
      const secondaryNavigationData = element.getAttribute('data-secondary-navigation')
      if (secondaryNavigationData) {
        try {
          const secondaryNavigationLinks = JSON.parse(secondaryNavigationData) as HeaderNavigationLink[]
          config.secondaryNavigation = { links: secondaryNavigationLinks }
        } catch (error) {
          console.warn('Invalid JSON in data-secondary-navigation attribute:', error)
        }
      }

      // Search configuration
      const searchAction = element.getAttribute('data-search-action')
      const searchMethod = element.getAttribute('data-search-method') as 'GET' | 'POST'
      const searchPlaceholder = element.getAttribute('data-search-placeholder')
      const searchInputName = element.getAttribute('data-search-input-name')
      const searchButtonText = element.getAttribute('data-search-button-text')
      const searchAutocomplete = element.getAttribute('data-search-autocomplete')
      const searchSuggestionsData = element.getAttribute('data-search-suggestions')

      if (searchAction || searchMethod || searchPlaceholder || searchInputName || searchButtonText || searchAutocomplete || searchSuggestionsData) {
        config.search = {}
        if (searchAction) config.search.action = searchAction
        if (searchMethod) config.search.method = searchMethod
        if (searchPlaceholder) config.search.placeholder = searchPlaceholder
        if (searchInputName) config.search.inputName = searchInputName
        if (searchButtonText) config.search.buttonText = searchButtonText
        if (searchAutocomplete === 'true') config.search.autocomplete = true
        if (searchSuggestionsData) {
          try {
            config.search.suggestions = JSON.parse(searchSuggestionsData) as string[]
          } catch (error) {
            console.warn('Invalid JSON in data-search-suggestions attribute:', error)
          }
        }
      }

      // Create the header component
      const header = createHeader(config)
      
      // Replace the original element
      element.parentNode?.replaceChild(header.element, element)
      components.push(header)

    } catch (error) {
      console.error('Error initializing header component:', error)
    }
  })

  return components
}

// Auto-initialize headers when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeaders)
  } else {
    initializeHeaders()
  }
}