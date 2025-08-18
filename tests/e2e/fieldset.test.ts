/**
 * Fieldset Component E2E Tests
 * Tests for fieldset functionality across browsers
 */

import { test, expect } from '@playwright/test'

// Helper function to get fieldset component code
async function getFieldsetCode() {
  return `
    // Simplified DOM utilities for E2E tests
    function generateUniqueId(prefix) {
      return prefix + '-' + Math.random().toString(36).substr(2, 9)
    }

    // Fieldset component code
    function createLegendElement(legendConfig) {
      const legend = document.createElement('legend')
      legend.className = 'public-good-fieldset__legend' + (legendConfig.classes ? ' ' + legendConfig.classes : '')
      
      if (legendConfig.attributes) {
        Object.entries(legendConfig.attributes).forEach(([key, value]) => {
          legend.setAttribute(key, value)
        })
      }
      
      if (legendConfig.isPageHeading) {
        const headingLevel = legendConfig.headingLevel || 1
        const heading = document.createElement('h' + headingLevel)
        heading.className = 'public-good-fieldset__heading'
        
        if (legendConfig.html) {
          heading.innerHTML = legendConfig.html
        } else if (legendConfig.text) {
          heading.textContent = legendConfig.text
        }
        
        legend.appendChild(heading)
        legend.classList.add('public-good-fieldset__legend--page-heading')
      } else {
        if (legendConfig.html) {
          legend.innerHTML = legendConfig.html
        } else if (legendConfig.text) {
          legend.textContent = legendConfig.text
        }
      }
      
      return legend
    }

    function createFieldset(config) {
      const id = config.id || generateUniqueId('fieldset')
      
      const fieldset = document.createElement('fieldset')
      fieldset.id = id
      fieldset.className = 'public-good-fieldset' + (config.classes ? ' ' + config.classes : '')
      
      if (config.role) {
        fieldset.setAttribute('role', config.role)
      }
      
      if (config.attributes) {
        Object.entries(config.attributes).forEach(([key, value]) => {
          fieldset.setAttribute(key, value)
        })
      }
      
      const legend = createLegendElement(config.legend)
      fieldset.appendChild(legend)
      
      if (config.content) {
        const contentDiv = document.createElement('div')
        contentDiv.className = 'public-good-fieldset__content'
        contentDiv.innerHTML = config.content
        fieldset.appendChild(contentDiv)
      }
      
      return {
        element: fieldset,
        legend: legend,
        config: config,
        setLegend: function(legendConfig) {
          config.legend = legendConfig
          const newLegend = createLegendElement(legendConfig)
          fieldset.replaceChild(newLegend, legend)
          Object.assign(this.legend, newLegend)
        },
        addContent: function(content) {
          let contentDiv = fieldset.querySelector('.public-good-fieldset__content')
          if (!contentDiv) {
            contentDiv = document.createElement('div')
            contentDiv.className = 'public-good-fieldset__content'
            fieldset.appendChild(contentDiv)
          }
          
          if (typeof content === 'string') {
            contentDiv.insertAdjacentHTML('beforeend', content)
          } else {
            contentDiv.appendChild(content)
          }
        }
      }
    }

    function initializeFieldsets() {
      const elements = document.querySelectorAll('[data-public-good-fieldset]')
      const components = []
      
      elements.forEach((element) => {
        try {
          const legendText = element.getAttribute('data-legend-text')
          const legendHtml = element.getAttribute('data-legend-html')
          
          if (!legendText && !legendHtml) {
            console.warn('Fieldset element missing required data-legend-text or data-legend-html attribute')
            return
          }
          
          const config = {
            legend: {}
          }
          
          if (legendText) config.legend.text = legendText
          if (legendHtml) config.legend.html = legendHtml
          
          const isPageHeading = element.getAttribute('data-legend-is-page-heading')
          if (isPageHeading === 'true') config.legend.isPageHeading = true
          
          const headingLevel = element.getAttribute('data-legend-heading-level')
          if (headingLevel) config.legend.headingLevel = parseInt(headingLevel)
          
          const id = element.getAttribute('data-id')
          if (id) config.id = id
          
          const classes = element.getAttribute('data-classes')
          if (classes) config.classes = classes
          
          const role = element.getAttribute('data-role')
          if (role) config.role = role
          
          const content = element.innerHTML.trim()
          if (content) config.content = content
          
          const fieldset = createFieldset(config)
          element.parentNode?.replaceChild(fieldset.element, element)
          components.push(fieldset)
        } catch (error) {
          console.error('Error initializing fieldset component:', error)
        }
      })
      
      return components
    }

    function createAddressFieldset(legendText = 'Address', options = {}) {
      const addressFields = \`
        <div>
          <label for="address-line-1">Address line 1</label>
          <input type="text" id="address-line-1" />
        </div>
        <div>
          <label for="address-postcode">Postcode</label>
          <input type="text" id="address-postcode" />
        </div>
      \`
      
      return createFieldset({
        legend: { text: legendText },
        content: addressFields,
        ...options
      })
    }

    function createDateFieldset(legendText = 'Date', options = {}) {
      const dateFields = \`
        <div>
          <label for="date-day">Day</label>
          <input type="text" id="date-day" maxlength="2" inputmode="numeric" />
        </div>
        <div>
          <label for="date-month">Month</label>
          <input type="text" id="date-month" maxlength="2" inputmode="numeric" />
        </div>
        <div>
          <label for="date-year">Year</label>
          <input type="text" id="date-year" maxlength="4" inputmode="numeric" />
        </div>
      \`
      
      return createFieldset({
        legend: { text: legendText },
        content: dateFields,
        ...options
      })
    }

    // Make functions available globally
    window.createFieldset = createFieldset
    window.initializeFieldsets = initializeFieldsets
    window.createAddressFieldset = createAddressFieldset
    window.createDateFieldset = createDateFieldset
  `
}

test.describe('Fieldset Component', () => {
  test('should render basic fieldset with legend', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
            .public-good-fieldset__legend--page-heading {
              margin-bottom: 20px;
            }
            .public-good-fieldset__heading {
              margin: 0;
            }
            .public-good-fieldset__content {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div data-public-good-fieldset data-legend-text="Personal Information">
            <label for="name">Name</label>
            <input type="text" id="name" />
          </div>
          <script>
            ${await getFieldsetCode()}
            initializeFieldsets()
          </script>
        </body>
      </html>
    `)

    const fieldset = page.locator('.public-good-fieldset')
    const legend = page.locator('.public-good-fieldset__legend')

    await expect(fieldset).toBeVisible()
    await expect(legend).toHaveText('Personal Information')
    await expect(fieldset).toHaveRole('group')
  })

  test('should render fieldset with page heading', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
            .public-good-fieldset__legend--page-heading {
              margin-bottom: 20px;
            }
            .public-good-fieldset__heading {
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div data-public-good-fieldset 
               data-legend-text="Main Section" 
               data-legend-is-page-heading="true"
               data-legend-heading-level="1">
            <input type="text" />
          </div>
          <script>
            ${await getFieldsetCode()}
            initializeFieldsets()
          </script>
        </body>
      </html>
    `)

    const legend = page.locator('.public-good-fieldset__legend')
    const heading = page.locator('.public-good-fieldset__heading')

    await expect(legend).toHaveClass(/public-good-fieldset__legend--page-heading/)
    await expect(heading).toHaveRole('heading')
    await expect(heading).toHaveText('Main Section')
  })

  test('should render fieldset with HTML legend', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
          </style>
        </head>
        <body>
          <div data-public-good-fieldset 
               data-legend-html="<span>Contact <strong>Information</strong></span>">
            <input type="email" />
          </div>
          <script>
            ${await getFieldsetCode()}
            initializeFieldsets()
          </script>
        </body>
      </html>
    `)

    const legend = page.locator('.public-good-fieldset__legend')
    const strongElement = legend.locator('strong')

    await expect(legend).toContainText('Contact Information')
    await expect(strongElement).toHaveText('Information')
  })

  test('should create programmatic fieldset', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
            .public-good-fieldset__content {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getFieldsetCode()}
            
            const fieldset = createFieldset({
              legend: { text: 'Programmatic Fieldset' },
              content: '<input type="text" placeholder="Test input" />'
            })
            
            document.getElementById('container').appendChild(fieldset.element)
          </script>
        </body>
      </html>
    `)

    const fieldset = page.locator('.public-good-fieldset')
    const legend = page.locator('.public-good-fieldset__legend')
    const input = page.locator('input[placeholder="Test input"]')

    await expect(fieldset).toBeVisible()
    await expect(legend).toHaveText('Programmatic Fieldset')
    await expect(input).toBeVisible()
  })

  test('should create address fieldset helper', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
            .public-good-fieldset__content {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getFieldsetCode()}
            
            const fieldset = createAddressFieldset()
            document.getElementById('container').appendChild(fieldset.element)
          </script>
        </body>
      </html>
    `)

    const fieldset = page.locator('.public-good-fieldset')
    const legend = page.locator('.public-good-fieldset__legend')
    const addressLine1 = page.locator('#address-line-1')
    const postcode = page.locator('#address-postcode')

    await expect(fieldset).toBeVisible()
    await expect(legend).toHaveText('Address')
    await expect(addressLine1).toBeVisible()
    await expect(postcode).toBeVisible()
  })

  test('should create date fieldset helper', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
            .public-good-fieldset__content {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
          <script>
            ${await getFieldsetCode()}
            
            const fieldset = createDateFieldset('Date of Birth')
            document.getElementById('container').appendChild(fieldset.element)
          </script>
        </body>
      </html>
    `)

    const fieldset = page.locator('.public-good-fieldset')
    const legend = page.locator('.public-good-fieldset__legend')
    const dayInput = page.locator('#date-day')
    const monthInput = page.locator('#date-month')
    const yearInput = page.locator('#date-year')

    await expect(fieldset).toBeVisible()
    await expect(legend).toHaveText('Date of Birth')
    await expect(dayInput).toBeVisible()
    await expect(monthInput).toBeVisible()
    await expect(yearInput).toBeVisible()
    
    await expect(dayInput).toHaveAttribute('maxlength', '2')
    await expect(monthInput).toHaveAttribute('maxlength', '2')
    await expect(yearInput).toHaveAttribute('maxlength', '4')
    await expect(dayInput).toHaveAttribute('inputmode', 'numeric')
  })

  test('should handle multiple fieldsets on page', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
          </style>
        </head>
        <body>
          <div data-public-good-fieldset data-legend-text="Fieldset 1">
            <input type="text" />
          </div>
          <div data-public-good-fieldset data-legend-text="Fieldset 2">
            <input type="email" />
          </div>
          <div data-public-good-fieldset data-legend-text="Fieldset 3">
            <input type="tel" />
          </div>
          <script>
            ${await getFieldsetCode()}
            initializeFieldsets()
          </script>
        </body>
      </html>
    `)

    const fieldsets = page.locator('.public-good-fieldset')
    const legends = page.locator('.public-good-fieldset__legend')

    await expect(fieldsets).toHaveCount(3)
    await expect(legends.nth(0)).toHaveText('Fieldset 1')
    await expect(legends.nth(1)).toHaveText('Fieldset 2')
    await expect(legends.nth(2)).toHaveText('Fieldset 3')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .public-good-fieldset {
              border: 0;
              margin: 0;
              padding: 0;
              margin-bottom: 24px;
              min-width: 0;
            }
            .public-good-fieldset__legend {
              font-weight: bold;
              margin-bottom: 16px;
              padding: 0;
              width: 100%;
              display: block;
            }
            .public-good-fieldset__content {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div data-public-good-fieldset data-legend-text="Keyboard Test">
            <div>
              <label for="input1">Input 1</label>
              <input type="text" id="input1" />
            </div>
            <div>
              <label for="input2">Input 2</label>
              <input type="text" id="input2" />
            </div>
            <button type="button">Submit</button>
          </div>
          <script>
            ${await getFieldsetCode()}
            initializeFieldsets()
          </script>
        </body>
      </html>
    `)

    const input1 = page.locator('#input1')
    const input2 = page.locator('#input2')
    const button = page.locator('button')

    // Tab through elements
    await page.keyboard.press('Tab')
    await expect(input1).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(input2).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(button).toBeFocused()
  })
})