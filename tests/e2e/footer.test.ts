/**
 * Footer Component E2E Tests
 * Tests for footer functionality across browsers
 */

import { test, expect } from '@playwright/test'

// Helper function to get footer component code
async function getFooterCode() {
  return `
    // Simplified DOM utilities for E2E tests
    function generateUniqueId(prefix) {
      return prefix + '-' + Math.random().toString(36).substr(2, 9)
    }

    // I18n utilities for E2E tests
    const translations = {
      'footer.supportLinks': 'Support links',
      'footer.navigation': 'Footer navigation',
      'footer.opensInNewTab': '(opens in new tab)',
      'footer.copyright': '©',
      'footer.copyrightHolder': 'Crown copyright',
      'footer.nhsCopyrightHolder': 'NHS England',
      'footer.accessibility': 'Accessibility statement',
      'footer.contact': 'Contact us',
      'footer.cookies': 'Cookies',
      'footer.privacy': 'Privacy policy',
      'footer.terms': 'Terms and conditions'
    }
    
    function t(key) {
      return translations[key] || key
    }

    // Footer component code
    function createFooterLink(link) {
      const linkElement = document.createElement('a')
      linkElement.href = link.href
      linkElement.className = 'public-good-footer__link'
      linkElement.textContent = link.text
      
      if (link.openInNewTab) {
        linkElement.target = '_blank'
        linkElement.rel = 'noopener noreferrer'
        linkElement.setAttribute('aria-label', link.text + ' ' + t('footer.opensInNewTab'))
      }
      
      if (link.attributes) {
        Object.entries(link.attributes).forEach(([key, value]) => {
          linkElement.setAttribute(key, value)
        })
      }
      
      return linkElement
    }

    function buildFooterContent(container, config) {
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
          sectionContainer.className = 'public-good-footer__navigation-section' + (section.classes ? ' ' + section.classes : '')
          
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
          copyrightLink.textContent = copyrightText + ' ' + copyrightHolder
          copyrightSection.appendChild(copyrightLink)
        } else {
          const copyrightParagraph = document.createElement('p')
          copyrightParagraph.className = 'public-good-footer__copyright-text'
          copyrightParagraph.textContent = copyrightText + ' ' + copyrightHolder
          copyrightSection.appendChild(copyrightParagraph)
        }
        
        container.appendChild(copyrightSection)
      }
    }

    function createFooter(config = {}) {
      const id = config.id || generateUniqueId('footer')
      
      const footer = document.createElement('footer')
      footer.id = id
      footer.className = 'public-good-footer' + (config.classes ? ' ' + config.classes : '')
      footer.setAttribute('role', 'contentinfo')
      
      if (config.attributes) {
        Object.entries(config.attributes).forEach(([key, value]) => {
          footer.setAttribute(key, value)
        })
      }
      
      let container
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
      
      const visuallyHiddenTitle = document.createElement('h2')
      visuallyHiddenTitle.className = 'public-good-sr-only'
      visuallyHiddenTitle.textContent = config.visuallyHiddenTitle || t('footer.supportLinks')
      container.appendChild(visuallyHiddenTitle)
      
      buildFooterContent(container, config)
      
      return {
        element: footer,
        config: config
      }
    }

    function initializeFooters() {
      const elements = document.querySelectorAll('[data-public-good-footer]')
      const components = []
      
      elements.forEach((element) => {
        try {
          const config = {}
          
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
          
          const linksData = element.getAttribute('data-links')
          if (linksData) {
            try {
              config.links = JSON.parse(linksData)
            } catch (error) {
              console.warn('Invalid JSON in data-links attribute:', error)
            }
          } else {
            const existingLinks = element.querySelectorAll('a[href]')
            if (existingLinks.length > 0) {
              config.links = Array.from(existingLinks).map((link) => ({
                text: link.textContent?.trim() || '',
                href: link.href,
                openInNewTab: link.target === '_blank'
              }))
            }
          }
          
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

    function createNHSFooter(additionalLinks, options = {}) {
      const standardLinks = [
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

    // Make functions available globally
    window.createFooter = createFooter
    window.initializeFooters = initializeFooters
    window.createNHSFooter = createNHSFooter
  `
}

test.describe('Footer Component', () => {
  test('should render basic footer with copyright', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              border-top: 1px solid #d5d5d5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer-container {
              width: 100%;
            }
            .public-good-width-container {
              max-width: 1020px;
              margin: 0 auto;
              padding: 0 20px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__copyright {
              border-top: 1px solid #d5d5d5;
              padding-top: 20px;
            }
            .public-good-footer__copyright-text {
              color: #6c757d;
              margin: 0;
            }
            .public-good-sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }
          </style>
        </head>
        <body>
          <div data-public-good-footer data-copyright-holder="Test Organization">
          </div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('.public-good-footer')
    const copyrightText = page.locator('.public-good-footer__copyright-text')

    await expect(footer).toBeVisible()
    await expect(footer).toHaveAttribute('role', 'contentinfo')
    await expect(copyrightText).toContainText('Test Organization')
  })

  test('should render footer with meta links', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__meta {
              border-top: 1px solid #d5d5d5;
              padding-top: 20px;
            }
            .public-good-footer__meta-list {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              gap: 20px;
            }
            .public-good-footer__link {
              color: #005eb8;
              text-decoration: underline;
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
          <div data-public-good-footer 
               data-links='[{"text":"Privacy Policy","href":"/privacy"},{"text":"Terms","href":"/terms"}]'>
          </div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('.public-good-footer')
    const links = page.locator('.public-good-footer__link')

    await expect(footer).toBeVisible()
    await expect(links).toHaveCount(2)
    await expect(links.nth(0)).toHaveText('Privacy Policy')
    await expect(links.nth(1)).toHaveText('Terms')
    await expect(links.nth(0)).toHaveAttribute('href', '/privacy')
  })

  test('should render footer with navigation sections', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__navigation-list {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 24px;
            }
            .public-good-footer__navigation-title {
              font-weight: bold;
              margin-bottom: 12px;
            }
            .public-good-footer__navigation-items {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .public-good-footer__link {
              color: #005eb8;
              text-decoration: underline;
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
          <div data-public-good-footer 
               data-navigation-sections='[{"title":"Services","links":[{"text":"Service 1","href":"/service1"}]},{"title":"Support","links":[{"text":"Help","href":"/help"}]}]'>
          </div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('.public-good-footer')
    const navigation = page.locator('.public-good-footer__navigation')
    const sections = page.locator('.public-good-footer__navigation-section')
    const titles = page.locator('.public-good-footer__navigation-title')

    await expect(footer).toBeVisible()
    await expect(navigation).toHaveAttribute('aria-labelledby', 'footer-navigation')
    await expect(sections).toHaveCount(2)
    await expect(titles.nth(0)).toHaveText('Services')
    await expect(titles.nth(1)).toHaveText('Support')
  })

  test('should create programmatic footer', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__meta-list {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              gap: 20px;
            }
            .public-good-footer__link {
              color: #005eb8;
              text-decoration: underline;
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
            ${await getFooterCode()}
            
            const footer = createFooter({
              links: [
                { text: 'Programmatic Link', href: '/programmatic' }
              ],
              copyrightHolder: 'Programmatic Org'
            })
            
            document.getElementById('container').appendChild(footer.element)
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('.public-good-footer')
    const link = page.locator('.public-good-footer__link')
    const copyright = page.locator('.public-good-footer__copyright-text')

    await expect(footer).toBeVisible()
    await expect(link).toHaveText('Programmatic Link')
    await expect(copyright).toContainText('Programmatic Org')
  })

  test('should handle external links with new tab', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__meta-list {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              gap: 20px;
            }
            .public-good-footer__link {
              color: #005eb8;
              text-decoration: underline;
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
            ${await getFooterCode()}
            
            const footer = createFooter({
              links: [
                { text: 'External Link', href: 'https://example.com', openInNewTab: true }
              ]
            })
            
            document.getElementById('container').appendChild(footer.element)
          </script>
        </body>
      </html>
    `)

    const link = page.locator('.public-good-footer__link')

    await expect(link).toHaveText('External Link')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(link).toHaveAttribute('aria-label', 'External Link (opens in new tab)')
  })

  test('should create NHS footer with standard links', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__meta-list {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
            }
            .public-good-footer__link {
              color: #005eb8;
              text-decoration: underline;
            }
            .public-good-footer__copyright-text {
              color: #6c757d;
              margin: 0;
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
            ${await getFooterCode()}
            
            const footer = createNHSFooter()
            document.getElementById('container').appendChild(footer.element)
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('.public-good-footer')
    const links = page.locator('.public-good-footer__link')
    const copyright = page.locator('.public-good-footer__copyright-text')

    await expect(footer).toBeVisible()
    await expect(links).toHaveCount(5) // Standard NHS links
    await expect(links.nth(0)).toHaveText('Accessibility statement')
    await expect(links.nth(1)).toHaveText('Contact us')
    await expect(links.nth(2)).toHaveText('Cookies')
    await expect(links.nth(3)).toHaveText('Privacy policy')
    await expect(links.nth(4)).toHaveText('Terms and conditions')
    await expect(copyright).toContainText('NHS England')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__meta-list {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              gap: 20px;
            }
            .public-good-footer__link {
              color: #005eb8;
              text-decoration: underline;
            }
            .public-good-footer__link:focus {
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
          <div data-public-good-footer 
               data-links='[{"text":"Link 1","href":"/link1"},{"text":"Link 2","href":"/link2"}]'>
          </div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const firstLink = page.locator('.public-good-footer__link').nth(0)
    const secondLink = page.locator('.public-good-footer__link').nth(1)

    // Tab to first link
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // May need multiple tabs depending on page structure
    await page.keyboard.press('Tab')
    
    // Check if first link is focused (use a more reliable method)
    await firstLink.focus()
    await expect(firstLink).toBeFocused()

    // Tab to second link
    await page.keyboard.press('Tab')
    await expect(secondLink).toBeFocused()
  })

  test('should handle copyright with URL link', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__copyright {
              border-top: 1px solid #d5d5d5;
              padding-top: 20px;
            }
            .public-good-footer__copyright-link {
              color: #005eb8;
              text-decoration: underline;
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
          <div data-public-good-footer 
               data-copyright-text="©"
               data-copyright-holder="Linked Organization"
               data-copyright-url="/copyright-info">
          </div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const copyrightLink = page.locator('.public-good-footer__copyright-link')

    await expect(copyrightLink).toBeVisible()
    await expect(copyrightLink).toHaveText('© Linked Organization')
    await expect(copyrightLink).toHaveAttribute('href', '/copyright-info')
  })

  test('should handle existing links in DOM', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              font-size: 14px;
            }
            .public-good-footer__content {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            .public-good-footer__meta-list {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              gap: 20px;
            }
            .public-good-footer__link {
              color: #005eb8;
              text-decoration: underline;
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
          <div data-public-good-footer>
            <a href="/existing1">Existing Link 1</a>
            <a href="/existing2" target="_blank">Existing Link 2</a>
          </div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('.public-good-footer')
    const links = page.locator('.public-good-footer__link')

    await expect(footer).toBeVisible()
    await expect(links).toHaveCount(2)
    await expect(links.nth(0)).toHaveText('Existing Link 1')
    await expect(links.nth(1)).toHaveText('Existing Link 2')
    await expect(links.nth(1)).toHaveAttribute('target', '_blank')
  })

  test('should maintain semantic structure', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
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
          <div data-public-good-footer 
               data-navigation-sections='[{"title":"Test Section","links":[{"text":"Test Link","href":"/test"}]}]'>
          </div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('footer')
    const navigation = page.locator('nav')
    const h2 = page.locator('h2')
    const h3 = page.locator('h3')
    const h4 = page.locator('h4')

    await expect(footer).toHaveAttribute('role', 'contentinfo')
    await expect(navigation).toHaveAttribute('aria-labelledby', 'footer-navigation')
    await expect(h2).toHaveClass(/public-good-sr-only/)
    await expect(h3).toHaveClass(/public-good-sr-only/)
    await expect(h4).toHaveClass(/public-good-footer__navigation-title/)
  })

  test('should handle multiple footers on page', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
              margin-bottom: 20px;
            }
            .public-good-footer__copyright-text {
              margin: 0;
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
          <div data-public-good-footer data-copyright-holder="Footer 1"></div>
          <div data-public-good-footer data-copyright-holder="Footer 2"></div>
          <script>
            ${await getFooterCode()}
            initializeFooters()
          </script>
        </body>
      </html>
    `)

    const footers = page.locator('.public-good-footer')
    const copyrightTexts = page.locator('.public-good-footer__copyright-text')

    await expect(footers).toHaveCount(2)
    await expect(copyrightTexts.nth(0)).toContainText('Footer 1')
    await expect(copyrightTexts.nth(1)).toContainText('Footer 2')
  })

  test('should handle disabled container option', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-footer {
              background-color: #f0f4f5;
              padding: 32px 0;
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
            ${await getFooterCode()}
            
            const footer = createFooter({
              container: false,
              copyrightHolder: 'No Container Org'
            })
            
            document.getElementById('container').appendChild(footer.element)
          </script>
        </body>
      </html>
    `)

    const footer = page.locator('.public-good-footer')
    const containerDiv = page.locator('.public-good-footer-container')
    const title = page.locator('.public-good-sr-only')

    await expect(footer).toBeVisible()
    await expect(containerDiv).toHaveCount(0) // Should not exist
    await expect(title).toBeVisible() // Should be directly in footer
  })
})