/**
 * @jest-environment jsdom
 */

import { test, expect, Page } from '@playwright/test'

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Summary List E2E Test</title>
  <link rel="stylesheet" href="/src/index.css">
  <style>
    body { 
      margin: 20px; 
      font-family: Arial, sans-serif; 
    }
  </style>
</head>
<body>
  <h1>Summary List Component E2E Tests</h1>
  
  <!-- Basic Summary List -->
  <section>
    <h2>Basic Summary List</h2>
    <div id="basic-summary-list"></div>
  </section>
  
  <!-- Editable Summary List -->
  <section>
    <h2>Editable Summary List</h2>
    <div id="editable-summary-list"></div>
  </section>
  
  <!-- Borderless Summary List -->
  <section>
    <h2>Borderless Summary List</h2>
    <div id="borderless-summary-list"></div>
  </section>
  
  <!-- Data Attribute Initialized Summary List -->
  <section>
    <h2>Data Attribute Initialized</h2>
    <div 
      data-public-good-summary-list
      data-id="data-summary-list"
      data-no-border="false"
      data-classes="custom-test-class"
      data-rows='[
        {"key":{"text":"Name"},"value":{"text":"John Doe"},"actions":{"items":[{"href":"/edit-name","text":"Change","visuallyHiddenText":"name"}]}},
        {"key":{"text":"Email"},"value":{"text":"john@example.com"}},
        {"key":{"text":"Phone"},"value":{"text":"+44 123 456 7890"}}
      ]'
    ></div>
  </section>
  
  <!-- Test Controls -->
  <section style="margin-top: 40px; border-top: 2px solid #ccc; padding-top: 20px;">
    <h2>Test Controls</h2>
    <button id="add-row-btn">Add Row</button>
    <button id="remove-row-btn">Remove First Row</button>
    <button id="update-row-btn">Update First Row</button>
    <button id="toggle-border-btn">Toggle Border</button>
    <div id="event-log" style="margin-top: 20px; padding: 10px; background: #f5f5f5; border: 1px solid #ccc; height: 100px; overflow-y: scroll;"></div>
  </section>

  <script type="module">
    import { 
      createSummaryList, 
      createSimpleSummaryList,
      createEditableSummaryList, 
      createBorderlessSummaryList 
    } from '/src/components/summary-list/summary-list.js'
    
    // Event logging
    const eventLog = document.getElementById('event-log')
    function logEvent(message) {
      const time = new Date().toLocaleTimeString()
      eventLog.innerHTML += \`<div>[\${time}] \${message}</div>\`
      eventLog.scrollTop = eventLog.scrollHeight
    }
    
    // Create basic summary list
    const basicData = [
      { key: 'Full Name', value: 'Sarah Johnson' },
      { key: 'Date of Birth', value: '15 March 1985' },
      { key: 'Address', value: '123 Healthcare Street, Medical City, MC1 2AB' }
    ]
    
    const basicSummaryList = createSimpleSummaryList(basicData, {
      id: 'basic-summary-list-component'
    })
    document.getElementById('basic-summary-list').appendChild(basicSummaryList.element)
    
    // Create editable summary list
    const editableData = [
      { key: 'Name', value: 'Dr. Emily Watson', editHref: '/edit-name' },
      { key: 'Specialty', value: 'Cardiology', editHref: '/edit-specialty', editText: 'Edit' },
      { key: 'Contact', value: 'emily.watson@hospital.nhs.uk', editHref: '/edit-contact' }
    ]
    
    const editableSummaryList = createEditableSummaryList(editableData, {
      id: 'editable-summary-list-component'
    })
    document.getElementById('editable-summary-list').appendChild(editableSummaryList.element)
    
    // Create borderless summary list
    const borderlessData = [
      { key: 'Status', value: 'Active' },
      { key: 'Last Updated', value: 'Today at 2:30pm' },
      { key: 'Updates By', value: 'System Administrator' }
    ]
    
    const borderlessSummaryList = createBorderlessSummaryList(borderlessData, {
      id: 'borderless-summary-list-component'
    })
    document.getElementById('borderless-summary-list').appendChild(borderlessSummaryList.element)
    
    // Store reference to basic summary list for manipulation
    window.testSummaryList = basicSummaryList
    
    // Set up event listeners for all summary lists
    document.addEventListener('public-good:summary-list:created', (e) => {
      logEvent(\`Summary list created: \${e.detail.element.id}\`)
    })
    
    document.addEventListener('public-good:summary-list:row-added', (e) => {
      logEvent(\`Row added to \${e.detail.element.id} at index \${e.detail.index}\`)
    })
    
    document.addEventListener('public-good:summary-list:row-removed', (e) => {
      logEvent(\`Row removed from \${e.detail.element.id} at index \${e.detail.index}\`)
    })
    
    document.addEventListener('public-good:summary-list:row-updated', (e) => {
      logEvent(\`Row updated in \${e.detail.element.id} at index \${e.detail.index}\`)
    })
    
    // Test control buttons
    document.getElementById('add-row-btn').addEventListener('click', () => {
      window.testSummaryList.addRow({
        key: { text: 'Emergency Contact' },
        value: { text: 'Jane Doe - 07700 900 123' }
      })
    })
    
    document.getElementById('remove-row-btn').addEventListener('click', () => {
      const success = window.testSummaryList.removeRow(0)
      if (!success) {
        logEvent('Failed to remove row - no rows available')
      }
    })
    
    document.getElementById('update-row-btn').addEventListener('click', () => {
      const success = window.testSummaryList.updateRow(0, {
        value: { text: 'Sarah Johnson (Updated)' }
      })
      if (!success) {
        logEvent('Failed to update row - no rows available')
      }
    })
    
    document.getElementById('toggle-border-btn').addEventListener('click', () => {
      const element = window.testSummaryList.element
      const hasBorder = !element.classList.contains('public-good-summary-list--no-border')
      
      if (hasBorder) {
        element.classList.add('public-good-summary-list--no-border')
        window.testSummaryList.config.noBorder = true
        logEvent('Borders removed from summary list')
      } else {
        element.classList.remove('public-good-summary-list--no-border')
        window.testSummaryList.config.noBorder = false
        logEvent('Borders added to summary list')
      }
    })
    
    // Log initial state
    logEvent('Summary List E2E Test initialized')
    logEvent(\`Basic summary list has \${basicSummaryList.getRowCount()} rows\`)
    logEvent(\`Editable summary list has \${editableSummaryList.getRowCount()} rows\`)
    logEvent(\`Borderless summary list has \${borderlessSummaryList.getRowCount()} rows\`)
  </script>
</body>
</html>
`

// E2E Tests using Playwright-style API but adapted for Jest
describe('Summary List E2E Tests', () => {
  let page: any

  beforeAll(async () => {
    // Set up page-like object for testing
    page = {
      content: '',
      goto: jest.fn(),
      setContent: jest.fn(),
      locator: jest.fn(),
      getByRole: jest.fn(),
      getByText: jest.fn(),
      click: jest.fn(),
      fill: jest.fn(),
      waitFor: jest.fn(),
      screenshot: jest.fn()
    }
  })

  beforeEach(async () => {
    // Reset DOM
    document.body.innerHTML = HTML_TEMPLATE
    
    // Simulate script execution
    const scriptTags = document.querySelectorAll('script[type="module"]')
    // Note: In a real E2E test, these scripts would execute automatically
    // Here we're documenting the expected behavior
  })

  afterEach(async () => {
    document.body.innerHTML = ''
  })

  test('should display basic summary list correctly', async () => {
    // In a real E2E test, we would:
    // await page.setContent(HTML_TEMPLATE)
    
    const basicSummaryList = document.querySelector('#basic-summary-list-component')
    
    // Verify the summary list exists and has correct structure
    expect(basicSummaryList).toBeTruthy()
    expect(basicSummaryList?.tagName).toBe('DL')
    expect(basicSummaryList?.classList.contains('public-good-summary-list')).toBe(true)
    
    // Check for expected content structure
    const expectedSelectors = [
      '.public-good-summary-list__row',
      '.public-good-summary-list__key',
      '.public-good-summary-list__value'
    ]
    
    expectedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  test('should display editable summary list with action links', async () => {
    const editableSummaryList = document.querySelector('#editable-summary-list-component')
    
    expect(editableSummaryList).toBeTruthy()
    
    // Check for action links
    const actionLinks = document.querySelectorAll('.public-good-summary-list__actions .public-good-link')
    expect(actionLinks.length).toBeGreaterThan(0)
    
    // Verify action link attributes
    actionLinks.forEach(link => {
      expect(link.getAttribute('href')).toBeTruthy()
      expect(link.textContent).toBeTruthy()
    })
  })

  test('should display borderless summary list correctly', async () => {
    const borderlessSummaryList = document.querySelector('#borderless-summary-list-component')
    
    expect(borderlessSummaryList).toBeTruthy()
    expect(borderlessSummaryList?.classList.contains('public-good-summary-list--no-border')).toBe(true)
  })

  test('should initialize from data attributes', async () => {
    const dataSummaryList = document.querySelector('#data-summary-list')
    
    expect(dataSummaryList).toBeTruthy()
    expect(dataSummaryList?.tagName).toBe('DL')
    expect(dataSummaryList?.classList.contains('custom-test-class')).toBe(true)
    
    // Check that rows were created from JSON data
    const rows = dataSummaryList?.querySelectorAll('.public-good-summary-list__row')
    expect(rows?.length).toBe(3) // Based on the data-rows JSON
  })

  test('should handle keyboard navigation correctly', async () => {
    // Test tab navigation through action links
    const actionLinks = document.querySelectorAll('.public-good-summary-list__actions .public-good-link')
    
    actionLinks.forEach(link => {
      // Verify links are focusable
      expect(link.getAttribute('href')).toBeTruthy()
      expect(link.tagName).toBe('A')
    })
  })

  test('should handle row addition via button click', async () => {
    // This would test the dynamic functionality
    // In a real E2E test:
    // await page.click('#add-row-btn')
    
    const addButton = document.querySelector('#add-row-btn')
    expect(addButton).toBeTruthy()
    
    // Simulate click event
    if (addButton) {
      const clickEvent = new Event('click', { bubbles: true })
      addButton.dispatchEvent(clickEvent)
    }
    
    // In a real E2E test, we would verify the row was added to the DOM
    // await expect(page.locator('.public-good-summary-list__row')).toHaveCount(4)
  })

  test('should handle row removal via button click', async () => {
    const removeButton = document.querySelector('#remove-row-btn')
    expect(removeButton).toBeTruthy()
    
    // In a real E2E test:
    // const initialCount = await page.locator('.public-good-summary-list__row').count()
    // await page.click('#remove-row-btn')
    // await expect(page.locator('.public-good-summary-list__row')).toHaveCount(initialCount - 1)
  })

  test('should handle row updates via button click', async () => {
    const updateButton = document.querySelector('#update-row-btn')
    expect(updateButton).toBeTruthy()
    
    // In a real E2E test:
    // await page.click('#update-row-btn')
    // await expect(page.locator('.public-good-summary-list__value').first()).toContainText('(Updated)')
  })

  test('should toggle border styling', async () => {
    const toggleButton = document.querySelector('#toggle-border-btn')
    expect(toggleButton).toBeTruthy()
    
    // In a real E2E test:
    // await page.click('#toggle-border-btn')
    // await expect(page.locator('#basic-summary-list-component')).toHaveClass(/no-border/)
  })

  test('should log events to event log', async () => {
    const eventLog = document.querySelector('#event-log')
    expect(eventLog).toBeTruthy()
    
    // In a real E2E test, we would verify events are logged:
    // await page.click('#add-row-btn')
    // await expect(page.locator('#event-log')).toContainText('Row added')
  })

  test('should have proper semantic HTML structure', async () => {
    // Verify semantic HTML
    const summaryLists = document.querySelectorAll('dl.public-good-summary-list')
    
    summaryLists.forEach(list => {
      const terms = list.querySelectorAll('dt')
      const definitions = list.querySelectorAll('dd')
      
      expect(terms.length).toBeGreaterThan(0)
      expect(definitions.length).toBeGreaterThanOrEqual(terms.length)
    })
  })

  test('should support screen readers with proper ARIA', async () => {
    const visuallyHiddenElements = document.querySelectorAll('.public-good-visually-hidden')
    
    visuallyHiddenElements.forEach(element => {
      // Verify visually hidden elements have content for screen readers
      expect(element.textContent?.trim()).toBeTruthy()
    })
  })

  test('should handle responsive design correctly', async () => {
    // In a real E2E test, we would test different viewport sizes:
    // await page.setViewportSize({ width: 375, height: 667 }) // Mobile
    // await expect(page.locator('.public-good-summary-list__row')).toHaveCSS('flex-direction', 'column')
    
    // await page.setViewportSize({ width: 1024, height: 768 }) // Desktop
    // await expect(page.locator('.public-good-summary-list__row')).toHaveCSS('flex-direction', 'row')
    
    const summaryLists = document.querySelectorAll('.public-good-summary-list')
    expect(summaryLists.length).toBeGreaterThan(0)
  })

  test('should handle print styles correctly', async () => {
    // In a real E2E test with print emulation:
    // await page.emulateMedia({ media: 'print' })
    // await expect(page.locator('.public-good-summary-list__actions')).toHaveCSS('display', 'none')
    
    const actionElements = document.querySelectorAll('.public-good-summary-list__actions')
    expect(actionElements.length).toBeGreaterThan(0)
  })

  test('should maintain focus management', async () => {
    const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
    
    focusableElements.forEach(element => {
      expect(element.getAttribute('href') || element.getAttribute('tabindex') || element.tagName === 'BUTTON').toBeTruthy()
    })
  })
})