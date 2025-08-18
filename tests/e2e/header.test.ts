/**
 * Header Component E2E Tests
 * Tests for header functionality across browsers
 */

import { test, expect } from '@playwright/test'

// Helper function to get header component code
async function getHeaderCode() {
  return `
    // Simplified DOM utilities for E2E tests
    function generateUniqueId(prefix) {
      return prefix + '-' + Math.random().toString(36).substr(2, 9)
    }

    function createElementWithAttributes(tagName, attributes = {}) {
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

    // I18n utilities for E2E tests
    const translations = {
      'header.logoAlt': 'Organisation logo',
      'header.opensInNewTab': '(opens in new tab)',
      'header.searchLabel': 'Search',
      'header.searchPlaceholder': 'Search',
      'header.searchButton': 'Search',
      'header.searchSuggestions': 'Search suggestions',
      'header.primaryNavigation': 'Primary navigation',
      'header.secondaryNavigation': 'Secondary navigation',
      'header.menuButton': 'Toggle navigation menu',
      'header.menu': 'Menu',
      'header.back': 'Back'
    }
    
    function t(key) {
      return translations[key] || key
    }

    // Simplified header component code for E2E testing
    function createHeaderNavigationLink(link) {
      const linkElement = createElementWithAttributes('a', {
        href: link.href,
        className: 'public-good-header__navigation-link' + (link.current ? ' public-good-header__navigation-link--current' : ''),
        textContent: link.text
      })
      
      if (link.openInNewTab) {
        linkElement.target = '_blank'
        linkElement.rel = 'noopener noreferrer'
        linkElement.setAttribute('aria-label', link.text + ' ' + t('header.opensInNewTab'))
      }
      
      if (link.current) {
        linkElement.setAttribute('aria-current', 'page')
      }
      
      return linkElement
    }

    function createHeaderLogo(config, variant) {
      const logoContainer = createElementWithAttributes('div', {
        className: 'public-good-header__logo'
      })

      if (config.href) {
        const logoLink = createElementWithAttributes('a', {
          href: config.href,
          className: 'public-good-header__logo-link'
        })

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

    function createServiceName(config) {
      const serviceContainer = createElementWithAttributes('div', {
        className: 'public-good-header__service-name'
      })

      if (config.href) {
        const serviceLink = createElementWithAttributes('a', {
          href: config.href,
          className: 'public-good-header__service-link',
          textContent: config.name
        })
        serviceContainer.appendChild(serviceLink)
      } else {
        const serviceText = createElementWithAttributes('span', {
          className: 'public-good-header__service-text',
          textContent: config.name
        })
        serviceContainer.appendChild(serviceText)
      }

      return serviceContainer
    }

    function createHeaderSearch(config) {
      const searchContainer = createElementWithAttributes('div', {
        className: 'public-good-header__search'
      })

      const searchForm = createElementWithAttributes('form', {
        className: 'public-good-header__search-form',
        action: config.action || '/search',
        method: config.method || 'GET'
      })

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
        placeholder: config.placeholder || t('header.searchPlaceholder')
      })

      const searchButton = createElementWithAttributes('button', {
        type: 'submit',
        className: 'public-good-header__search-button',
        textContent: config.buttonText || t('header.searchButton')
      })

      searchInputGroup.appendChild(searchLabel)
      searchInputGroup.appendChild(searchInput)
      searchInputGroup.appendChild(searchButton)
      searchForm.appendChild(searchInputGroup)
      searchContainer.appendChild(searchForm)

      return searchContainer
    }

    function createHeaderNavigation(config, isPrimary = true) {
      const navClassName = isPrimary ? 'public-good-header__navigation' : 'public-good-header__secondary-navigation'
      const navContainer = createElementWithAttributes('nav', {
        className: navClassName,
        'aria-label': isPrimary ? t('header.primaryNavigation') : t('header.secondaryNavigation')
      })

      const navList = createElementWithAttributes('ul', {
        className: 'public-good-header__navigation-list'
      })

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

    function createMobileMenuButton() {
      const menuButton = createElementWithAttributes('button', {
        type: 'button',
        className: 'public-good-header__menu-button',
        'aria-expanded': 'false',
        'aria-label': t('header.menuButton')
      })

      const menuText = createElementWithAttributes('span', {
        className: 'public-good-header__menu-text',
        textContent: t('header.menu')
      })
      menuButton.appendChild(menuText)

      return menuButton
    }

    function buildHeaderContent(container, config) {
      const headerContent = createElementWithAttributes('div', {
        className: 'public-good-header__content'
      })

      const brandingSection = createElementWithAttributes('div', {
        className: 'public-good-header__branding'
      })

      if (config.logo || config.variant === 'nhs-default') {
        const logoConfig = config.logo || { text: 'NHS' }
        const logo = createHeaderLogo(logoConfig, config.variant || 'nhs-default')
        brandingSection.appendChild(logo)
      }

      if (config.serviceName) {
        const serviceName = createServiceName(config.serviceName)
        brandingSection.appendChild(serviceName)
      }

      headerContent.appendChild(brandingSection)

      const actionsSection = createElementWithAttributes('div', {
        className: 'public-good-header__actions'
      })

      if (config.search) {
        const search = createHeaderSearch(config.search)
        actionsSection.appendChild(search)
      }

      if (config.navigation && config.navigation.links.length > 0) {
        const navigation = createHeaderNavigation(config.navigation, true)
        actionsSection.appendChild(navigation)
      }

      if (config.showMenuButton !== false) {
        const menuButton = createMobileMenuButton()
        actionsSection.appendChild(menuButton)
      }

      headerContent.appendChild(actionsSection)

      if (config.secondaryNavigation && config.secondaryNavigation.links.length > 0) {
        const secondaryNav = createHeaderNavigation(config.secondaryNavigation, false)
        headerContent.appendChild(secondaryNav)
      }

      container.appendChild(headerContent)
    }

    function createHeader(config = {}) {
      const id = config.id || generateUniqueId('header')
      const variant = config.variant || 'nhs-default'

      const header = createElementWithAttributes('header', {
        id: id,
        className: 'public-good-header public-good-header--' + variant + (config.classes ? ' ' + config.classes : ''),
        role: 'banner'
      })

      let container
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

      buildHeaderContent(container, config)

      return {
        element: header,
        config: config
      }
    }

    function createNHSHeader(serviceName, navigation = [], options = {}) {
      return createHeader({
        variant: 'nhs-default',
        logo: {
          text: 'NHS',
          href: options.logo?.href || '/'
        },
        ...(serviceName && {
          serviceName: {
            name: serviceName,
            href: options.serviceName?.href
          }
        }),
        ...(navigation && navigation.length > 0 && {
          navigation: {
            links: navigation
          }
        }),
        ...options
      })
    }

    function createTransactionalHeader(serviceName, backLink, options = {}) {
      const navigationLinks = []
      
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

    function initializeHeaders() {
      const elements = document.querySelectorAll('[data-public-good-header]')
      const components = []
      
      elements.forEach((element) => {
        try {
          const config = {}
          
          const variant = element.getAttribute('data-variant')
          if (variant) config.variant = variant
          
          const serviceName = element.getAttribute('data-service-name')
          const serviceHref = element.getAttribute('data-service-href')
          if (serviceName) {
            config.serviceName = {
              name: serviceName,
              ...(serviceHref && { href: serviceHref })
            }
          }
          
          const navigationData = element.getAttribute('data-navigation')
          if (navigationData) {
            try {
              config.navigation = { links: JSON.parse(navigationData) }
            } catch (error) {
              console.warn('Invalid JSON in data-navigation attribute:', error)
            }
          }
          
          const searchAction = element.getAttribute('data-search-action')
          if (searchAction) {
            config.search = { action: searchAction }
          }
          
          const header = createHeader(config)
          element.parentNode?.replaceChild(header.element, element)
          components.push(header)
        } catch (error) {
          console.error('Error initializing header component:', error)
        }
      })
      
      return components
    }

    // Make functions available globally
    window.createHeader = createHeader
    window.createNHSHeader = createNHSHeader
    window.createTransactionalHeader = createTransactionalHeader
    window.initializeHeaders = initializeHeaders
  `
}

test.describe('Header Component', () => {
  test('should render basic NHS header', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header-container {
              width: 100%;
            }
            .public-good-width-container {
              max-width: 1020px;
              margin: 0 auto;
              padding: 0 20px;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__branding {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .public-good-header__logo {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .public-good-header__logo-text {
              font-weight: bold;
              font-size: 24px;
            }
            .public-good-header__service-name {
              min-width: 0;
              flex: 1;
            }
            .public-good-header__service-text {
              font-size: 20px;
              font-weight: 500;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div data-public-good-header 
               data-variant="nhs-default"
               data-service-name="NHS Test Service">
          </div>
          <script>
            ${await getHeaderCode()}
            initializeHeaders()
          </script>
        </body>
      </html>
    `)

    const header = page.locator('.public-good-header')
    const logoText = page.locator('.public-good-header__logo-text')
    const serviceText = page.locator('.public-good-header__service-text')

    await expect(header).toBeVisible()
    await expect(header).toHaveAttribute('role', 'banner')
    await expect(logoText).toHaveText('NHS')
    await expect(serviceText).toHaveText('NHS Test Service')
  })

  test('should render header with navigation', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__branding,
            .public-good-header__actions {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .public-good-header__navigation-list {
              display: flex;
              gap: 12px;
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .public-good-header__navigation-link {
              color: inherit;
              text-decoration: none;
              padding: 8px 12px;
              border-radius: 4px;
            }
            .public-good-header__navigation-link--current {
              background-color: rgba(255, 255, 255, 0.15);
              font-weight: bold;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div data-public-good-header 
               data-variant="nhs-default"
               data-service-name="NHS Service"
               data-navigation='[
                 {"text": "Home", "href": "/", "current": true},
                 {"text": "Services", "href": "/services"},
                 {"text": "About", "href": "/about"}
               ]'>
          </div>
          <script>
            ${await getHeaderCode()}
            initializeHeaders()
          </script>
        </body>
      </html>
    `)

    const header = page.locator('.public-good-header')
    const navigation = page.locator('.public-good-header__navigation')
    const navLinks = page.locator('.public-good-header__navigation-link')
    const currentLink = page.locator('.public-good-header__navigation-link--current')

    await expect(header).toBeVisible()
    await expect(navigation).toHaveAttribute('aria-label', 'header.primaryNavigation')
    await expect(navLinks).toHaveCount(3)
    await expect(navLinks.nth(0)).toHaveText('Home')
    await expect(navLinks.nth(1)).toHaveText('Services')
    await expect(navLinks.nth(2)).toHaveText('About')
    await expect(currentLink).toHaveText('Home')
    await expect(currentLink).toHaveAttribute('aria-current', 'page')
  })

  test('should render header with search functionality', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__branding,
            .public-good-header__actions {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .public-good-header__search-form {
              display: flex;
              align-items: center;
            }
            .public-good-header__search-input-group {
              display: flex;
              align-items: center;
              background-color: white;
              border-radius: 4px;
              overflow: hidden;
              min-width: 250px;
            }
            .public-good-header__search-input {
              flex: 1;
              border: none;
              padding: 8px 12px;
              color: #333;
            }
            .public-good-header__search-button {
              background-color: #007f3b;
              color: white;
              border: none;
              padding: 8px 12px;
              cursor: pointer;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div data-public-good-header 
               data-variant="nhs-default"
               data-service-name="NHS Service"
               data-search-action="/search">
          </div>
          <script>
            ${await getHeaderCode()}
            initializeHeaders()
          </script>
        </body>
      </html>
    `)

    const header = page.locator('.public-good-header')
    const searchForm = page.locator('.public-good-header__search-form')
    const searchInput = page.locator('.public-good-header__search-input')
    const searchButton = page.locator('.public-good-header__search-button')

    await expect(header).toBeVisible()
    await expect(searchForm).toBeVisible()
    await expect(searchForm).toHaveAttribute('action', '/search')
    await expect(searchInput).toHaveAttribute('type', 'search')
    await expect(searchInput).toHaveAttribute('placeholder', 'header.searchPlaceholder')
    await expect(searchButton).toHaveText('header.searchButton')
  })

  test('should create programmatic NHS header', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__branding {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .public-good-header__logo-text {
              font-weight: bold;
              font-size: 24px;
            }
            .public-good-header__service-text {
              font-size: 20px;
              font-weight: 500;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getHeaderCode()}
            
            const header = createNHSHeader('Programmatic NHS Service', [
              { text: 'Health A-Z', href: '/health-az' },
              { text: 'Services', href: '/services' }
            ])
            
            document.getElementById('container').appendChild(header.element)
          </script>
        </body>
      </html>
    `)

    const header = page.locator('.public-good-header')
    const logoText = page.locator('.public-good-header__logo-text')
    const serviceText = page.locator('.public-good-header__service-text')
    const navLinks = page.locator('.public-good-header__navigation-link')

    await expect(header).toBeVisible()
    await expect(header).toHaveClass(/public-good-header--nhs-default/)
    await expect(logoText).toHaveText('NHS')
    await expect(serviceText).toHaveText('Programmatic NHS Service')
    await expect(navLinks).toHaveCount(2)
    await expect(navLinks.nth(0)).toHaveText('Health A-Z')
    await expect(navLinks.nth(1)).toHaveText('Services')
  })

  test('should create transactional header with back link', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: white;
              color: #333;
              border-bottom: 1px solid #d5d5d5;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 48px;
            }
            .public-good-header__branding {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .public-good-header__service-text {
              font-size: 18px;
              font-weight: 500;
            }
            .public-good-header__navigation-link {
              color: #005eb8;
              text-decoration: none;
              padding: 8px 12px;
            }
            .public-good-header__navigation-list {
              display: flex;
              gap: 12px;
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getHeaderCode()}
            
            const header = createTransactionalHeader('Apply for service', '/previous-step')
            document.getElementById('container').appendChild(header.element)
          </script>
        </body>
      </html>
    `)

    const header = page.locator('.public-good-header')
    const serviceText = page.locator('.public-good-header__service-text')
    const backLink = page.locator('.public-good-header__navigation-link')

    await expect(header).toBeVisible()
    await expect(header).toHaveClass(/public-good-header--transactional/)
    await expect(serviceText).toHaveText('Apply for service')
    await expect(backLink).toHaveText('header.back')
    await expect(backLink).toHaveAttribute('href', '/previous-step')
  })

  test('should handle external navigation links', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__navigation-list {
              display: flex;
              gap: 12px;
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .public-good-header__navigation-link {
              color: inherit;
              text-decoration: none;
              padding: 8px 12px;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getHeaderCode()}
            
            const header = createHeader({
              variant: 'nhs-default',
              serviceName: { name: 'Test Service' },
              navigation: {
                links: [
                  { text: 'Internal Link', href: '/internal' },
                  { text: 'External Link', href: 'https://example.com', openInNewTab: true }
                ]
              }
            })
            
            document.getElementById('container').appendChild(header.element)
          </script>
        </body>
      </html>
    `)

    const navLinks = page.locator('.public-good-header__navigation-link')
    const externalLink = navLinks.nth(1)

    await expect(navLinks).toHaveCount(2)
    await expect(navLinks.nth(0)).toHaveText('Internal Link')
    await expect(externalLink).toHaveText('External Link')
    await expect(externalLink).toHaveAttribute('target', '_blank')
    await expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(externalLink).toHaveAttribute('aria-label', 'External Link header.opensInNewTab')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__navigation-list {
              display: flex;
              gap: 12px;
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .public-good-header__navigation-link {
              color: inherit;
              text-decoration: none;
              padding: 8px 12px;
              border-radius: 4px;
            }
            .public-good-header__navigation-link:focus {
              outline: 3px solid #ffbf47;
              background-color: #ffbf47;
              color: #212529;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <main>
            <p>Main content</p>
          </main>
          <div data-public-good-header 
               data-variant="nhs-default"
               data-service-name="Test Service"
               data-navigation='[
                 {"text": "Home", "href": "/"},
                 {"text": "Services", "href": "/services"}
               ]'>
          </div>
          <script>
            ${await getHeaderCode()}
            initializeHeaders()
          </script>
        </body>
      </html>
    `)

    const firstLink = page.locator('.public-good-header__navigation-link').nth(0)
    const secondLink = page.locator('.public-good-header__navigation-link').nth(1)

    // Tab to first navigation link
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check if first link can be focused
    await firstLink.focus()
    await expect(firstLink).toBeFocused()

    // Tab to second link
    await page.keyboard.press('Tab')
    await expect(secondLink).toBeFocused()
  })

  test('should handle mobile menu button', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__branding,
            .public-good-header__actions {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .public-good-header__menu-button {
              background: none;
              border: none;
              color: inherit;
              cursor: pointer;
              padding: 8px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .public-good-header__menu-text {
              font-size: 14px;
              font-weight: 500;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div data-public-good-header 
               data-variant="nhs-default"
               data-service-name="Test Service"
               data-navigation='[
                 {"text": "Home", "href": "/"},
                 {"text": "Services", "href": "/services"}
               ]'>
          </div>
          <script>
            ${await getHeaderCode()}
            initializeHeaders()
          </script>
        </body>
      </html>
    `)

    const menuButton = page.locator('.public-good-header__menu-button')
    const menuText = page.locator('.public-good-header__menu-text')

    await expect(menuButton).toBeVisible()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(menuButton).toHaveAttribute('aria-label', 'header.menuButton')
    await expect(menuText).toHaveText('header.menu')
  })

  test('should handle logo with image and text', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: white;
              color: #333;
              border-bottom: 1px solid #d5d5d5;
              padding: 16px 0;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__branding {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .public-good-header__logo {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .public-good-header__logo-link {
              display: flex;
              align-items: center;
              gap: 8px;
              color: inherit;
              text-decoration: none;
              padding: 4px;
              border-radius: 4px;
            }
            .public-good-header__logo-image {
              height: 32px;
              width: auto;
            }
            .public-good-header__logo-text {
              font-weight: bold;
              font-size: 24px;
              color: #005eb8;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getHeaderCode()}
            
            const header = createHeader({
              variant: 'organisational',
              logo: {
                href: '/',
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiMwMDVlYjgiLz48L3N2Zz4=',
                alt: 'Organisation logo',
                text: 'My Organisation'
              },
              serviceName: { name: 'Test Service' }
            })
            
            document.getElementById('container').appendChild(header.element)
          </script>
        </body>
      </html>
    `)

    const header = page.locator('.public-good-header')
    const logoLink = page.locator('.public-good-header__logo-link')
    const logoImage = page.locator('.public-good-header__logo-image')
    const logoText = page.locator('.public-good-header__logo-text')

    await expect(header).toBeVisible()
    await expect(header).toHaveClass(/public-good-header--organisational/)
    await expect(logoLink).toHaveAttribute('href', '/')
    await expect(logoImage).toHaveAttribute('alt', 'Organisation logo')
    await expect(logoText).toHaveText('My Organisation')
  })

  test('should handle header without container', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 20px;
            }
            .public-good-header__content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              min-height: 64px;
            }
            .public-good-header__service-text {
              font-size: 20px;
              font-weight: 500;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getHeaderCode()}
            
            const header = createHeader({
              variant: 'nhs-default',
              serviceName: { name: 'No Container Service' },
              container: false
            })
            
            document.getElementById('container').appendChild(header.element)
          </script>
        </body>
      </html>
    `)

    const header = page.locator('.public-good-header')
    const containerDiv = page.locator('.public-good-header-container')
    const serviceText = page.locator('.public-good-header__service-text')

    await expect(header).toBeVisible()
    await expect(containerDiv).toHaveCount(0) // Should not exist
    await expect(serviceText).toHaveText('No Container Service')
  })

  test('should maintain semantic structure', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div data-public-good-header 
               data-variant="nhs-default"
               data-service-name="Test Service"
               data-navigation='[{"text": "Home", "href": "/"}]'>
          </div>
          <script>
            ${await getHeaderCode()}
            initializeHeaders()
          </script>
        </body>
      </html>
    `)

    const header = page.locator('header')
    const navigation = page.locator('nav')

    await expect(header).toHaveAttribute('role', 'banner')
    await expect(navigation).toHaveAttribute('aria-label', 'header.primaryNavigation')
  })

  test('should handle search form submission', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-header {
              background-color: #005eb8;
              color: white;
              padding: 16px 0;
            }
            .public-good-header__search-form {
              display: flex;
              align-items: center;
            }
            .public-good-header__search-input-group {
              display: flex;
              align-items: center;
              background-color: white;
              border-radius: 4px;
              overflow: hidden;
            }
            .public-good-header__search-input {
              flex: 1;
              border: none;
              padding: 8px 12px;
              color: #333;
            }
            .public-good-header__search-button {
              background-color: #007f3b;
              color: white;
              border: none;
              padding: 8px 12px;
              cursor: pointer;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
            }
          </style>
        </head>
        <body>
          <div data-public-good-header 
               data-variant="nhs-default"
               data-service-name="Test Service"
               data-search-action="/test-search">
          </div>
          <script>
            ${await getHeaderCode()}
            initializeHeaders()
          </script>
        </body>
      </html>
    `)

    const searchForm = page.locator('.public-good-header__search-form')
    const searchInput = page.locator('.public-good-header__search-input')

    await expect(searchForm).toBeVisible()
    await expect(searchForm).toHaveAttribute('action', '/test-search')
    await expect(searchForm).toHaveAttribute('method', 'GET')
    
    // Test that we can type in the search input
    await searchInput.fill('test search query')
    await expect(searchInput).toHaveValue('test search query')
  })
})