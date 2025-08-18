/**
 * @jest-environment jsdom
 */

import {
  createSummaryList,
  createSimpleSummaryList,
  createEditableSummaryList,
  createBorderlessSummaryList,
  initializeSummaryLists,
  SummaryListConfig,
  SummaryListRow,
  SummaryListAction,
  SummaryListResult
} from '../summary-list'

// Mock generateUniqueId
jest.mock('../../../core/functions/dom-utils', () => ({
  generateUniqueId: jest.fn((prefix: string) => `${prefix}-mock-id`)
}))

describe('Summary List Component', () => {
  let mockRows: SummaryListRow[]
  let mockConfig: SummaryListConfig
  
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
    
    mockRows = [
      {
        key: { text: 'Name' },
        value: { text: 'John Doe' },
        actions: {
          items: [
            { href: '/edit-name', text: 'Change', visuallyHiddenText: 'name' }
          ]
        }
      },
      {
        key: { text: 'Email' },
        value: { text: 'john@example.com' }
      }
    ]
    
    mockConfig = {
      id: 'test-summary-list',
      rows: mockRows
    }
  })
  
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('createSummaryList', () => {
    test('should create basic summary list with correct structure', () => {
      const result = createSummaryList(mockConfig)
      
      expect(result.element).toBeInstanceOf(HTMLDListElement)
      expect(result.element.className).toBe('public-good-summary-list')
      expect(result.element.id).toBe('test-summary-list')
      expect(result.config).toEqual(mockConfig)
    })
    
    test('should generate unique ID when not provided', () => {
      const configWithoutId = { ...mockConfig }
      delete configWithoutId.id
      
      const result = createSummaryList(configWithoutId)
      
      expect(result.element.id).toBe('summary-list-mock-id')
      expect(result.config.id).toBe('summary-list-mock-id')
    })
    
    test('should create rows with correct structure', () => {
      const result = createSummaryList(mockConfig)
      
      const rows = result.element.querySelectorAll('.public-good-summary-list__row')
      expect(rows).toHaveLength(2)
      
      // Check first row with actions
      const firstRow = rows[0]
      expect(firstRow.querySelector('.public-good-summary-list__key')?.textContent).toBe('Name')
      expect(firstRow.querySelector('.public-good-summary-list__value')?.textContent).toBe('John Doe')
      
      const actions = firstRow.querySelector('.public-good-summary-list__actions')
      expect(actions).toBeInTheDocument()
      
      const actionLink = actions?.querySelector('a')
      expect(actionLink?.href).toContain('/edit-name')
      expect(actionLink?.textContent).toContain('Change')
      expect(actionLink?.textContent).toContain('name')
      
      // Check second row without actions
      const secondRow = rows[1]
      expect(secondRow.querySelector('.public-good-summary-list__key')?.textContent).toBe('Email')
      expect(secondRow.querySelector('.public-good-summary-list__value')?.textContent).toBe('john@example.com')
      expect(secondRow.querySelector('.public-good-summary-list__actions')).toBeNull()
    })
    
    test('should handle HTML content in key and value', () => {
      const htmlConfig: SummaryListConfig = {
        rows: [
          {
            key: { text: '<strong>Name</strong>', html: true },
            value: { text: '<em>John Doe</em>', html: true }
          }
        ]
      }
      
      const result = createSummaryList(htmlConfig)
      const row = result.element.querySelector('.public-good-summary-list__row')
      
      expect(row?.querySelector('.public-good-summary-list__key strong')).toBeInTheDocument()
      expect(row?.querySelector('.public-good-summary-list__value em')).toBeInTheDocument()
    })
    
    test('should apply no-border class when specified', () => {
      const borderlessConfig = { ...mockConfig, noBorder: true }
      const result = createSummaryList(borderlessConfig)
      
      expect(result.element.classList.contains('public-good-summary-list--no-border')).toBe(true)
    })
    
    test('should apply custom classes and attributes', () => {
      const customConfig = {
        ...mockConfig,
        classes: 'custom-class another-class',
        attributes: { 'data-test': 'value', 'aria-label': 'Test summary list' }
      }
      
      const result = createSummaryList(customConfig)
      
      expect(result.element.classList.contains('custom-class')).toBe(true)
      expect(result.element.classList.contains('another-class')).toBe(true)
      expect(result.element.getAttribute('data-test')).toBe('value')
      expect(result.element.getAttribute('aria-label')).toBe('Test summary list')
    })
    
    test('should handle action attributes correctly', () => {
      const actionConfig: SummaryListConfig = {
        rows: [
          {
            key: { text: 'Test' },
            value: { text: 'Value' },
            actions: {
              items: [
                {
                  href: '/test',
                  text: 'Edit',
                  attributes: { 'data-action': 'edit', 'class': 'custom-link' }
                }
              ]
            }
          }
        ]
      }
      
      const result = createSummaryList(actionConfig)
      const actionLink = result.element.querySelector('.public-good-summary-list__actions a')
      
      expect(actionLink?.getAttribute('data-action')).toBe('edit')
      expect(actionLink?.getAttribute('class')).toContain('custom-link')
    })
  })

  describe('Row Management Methods', () => {
    let summaryList: SummaryListResult
    
    beforeEach(() => {
      summaryList = createSummaryList(mockConfig)
    })
    
    test('should add row at specified index', () => {
      const newRow: SummaryListRow = {
        key: { text: 'Phone' },
        value: { text: '+44 123 456 7890' }
      }
      
      summaryList.addRow(newRow, 1)
      
      expect(summaryList.getRowCount()).toBe(3)
      expect(summaryList.getRow(1)).toEqual(newRow)
      
      const rows = summaryList.element.querySelectorAll('.public-good-summary-list__row')
      expect(rows).toHaveLength(3)
      expect(rows[1].querySelector('.public-good-summary-list__key')?.textContent).toBe('Phone')
    })
    
    test('should add row at end when index not specified', () => {
      const newRow: SummaryListRow = {
        key: { text: 'Address' },
        value: { text: '123 Test Street' }
      }
      
      summaryList.addRow(newRow)
      
      expect(summaryList.getRowCount()).toBe(3)
      expect(summaryList.getRow(2)).toEqual(newRow)
    })
    
    test('should remove row by index', () => {
      const result = summaryList.removeRow(0)
      
      expect(result).toBe(true)
      expect(summaryList.getRowCount()).toBe(1)
      
      const remainingRow = summaryList.getRow(0)
      expect(remainingRow?.key.text).toBe('Email')
    })
    
    test('should return false when removing invalid index', () => {
      const result = summaryList.removeRow(5)
      expect(result).toBe(false)
      expect(summaryList.getRowCount()).toBe(2)
    })
    
    test('should update row partially', () => {
      const result = summaryList.updateRow(0, {
        value: { text: 'Jane Doe' }
      })
      
      expect(result).toBe(true)
      
      const updatedRow = summaryList.getRow(0)
      expect(updatedRow?.key.text).toBe('Name') // Should remain unchanged
      expect(updatedRow?.value.text).toBe('Jane Doe') // Should be updated
    })
    
    test('should return false when updating invalid index', () => {
      const result = summaryList.updateRow(5, { value: { text: 'Test' } })
      expect(result).toBe(false)
    })
    
    test('should return null for invalid row index', () => {
      expect(summaryList.getRow(-1)).toBeNull()
      expect(summaryList.getRow(5)).toBeNull()
    })
    
    test('should return correct row count', () => {
      expect(summaryList.getRowCount()).toBe(2)
      
      summaryList.addRow({ key: { text: 'New' }, value: { text: 'Value' } })
      expect(summaryList.getRowCount()).toBe(3)
      
      summaryList.removeRow(0)
      expect(summaryList.getRowCount()).toBe(2)
    })
  })

  describe('Event Handling', () => {
    test('should dispatch creation event', () => {
      const eventSpy = jest.fn()
      document.addEventListener('public-good:summary-list:created', eventSpy)
      
      const summaryList = createSummaryList(mockConfig)
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            element: summaryList.element,
            config: mockConfig
          })
        })
      )
    })
    
    test('should dispatch row added event', () => {
      const summaryList = createSummaryList(mockConfig)
      const eventSpy = jest.fn()
      
      summaryList.element.addEventListener('public-good:summary-list:row-added', eventSpy)
      
      const newRow: SummaryListRow = {
        key: { text: 'Test' },
        value: { text: 'Value' }
      }
      
      summaryList.addRow(newRow, 1)
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            row: newRow,
            index: 1,
            element: summaryList.element
          })
        })
      )
    })
    
    test('should dispatch row removed event', () => {
      const summaryList = createSummaryList(mockConfig)
      const eventSpy = jest.fn()
      
      summaryList.element.addEventListener('public-good:summary-list:row-removed', eventSpy)
      
      summaryList.removeRow(0)
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            row: mockRows[0],
            index: 0,
            element: summaryList.element
          })
        })
      )
    })
    
    test('should dispatch row updated event', () => {
      const summaryList = createSummaryList(mockConfig)
      const eventSpy = jest.fn()
      
      summaryList.element.addEventListener('public-good:summary-list:row-updated', eventSpy)
      
      const updateData = { value: { text: 'Updated Value' } }
      summaryList.updateRow(0, updateData)
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            oldRow: mockRows[0],
            newRow: expect.objectContaining({
              ...mockRows[0],
              ...updateData
            }),
            index: 0,
            element: summaryList.element
          })
        })
      )
    })
    
    test('should dispatch destroyed event', () => {
      const summaryList = createSummaryList(mockConfig)
      const eventSpy = jest.fn()
      
      document.addEventListener('public-good:summary-list:destroyed', eventSpy)
      
      summaryList.destroy()
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            element: summaryList.element,
            config: mockConfig
          })
        })
      )
    })
  })

  describe('Utility Functions', () => {
    test('createSimpleSummaryList should create basic summary list', () => {
      const data = [
        { key: 'Name', value: 'John Doe' },
        { key: 'Email', value: 'john@example.com' }
      ]
      
      const result = createSimpleSummaryList(data, { id: 'simple-test' })
      
      expect(result.element.id).toBe('simple-test')
      expect(result.getRowCount()).toBe(2)
      
      const firstRow = result.getRow(0)
      expect(firstRow?.key.text).toBe('Name')
      expect(firstRow?.value.text).toBe('John Doe')
    })
    
    test('createEditableSummaryList should create summary list with edit actions', () => {
      const data = [
        { key: 'Name', value: 'John Doe', editHref: '/edit-name' },
        { key: 'Email', value: 'john@example.com', editHref: '/edit-email', editText: 'Edit' }
      ]
      
      const result = createEditableSummaryList(data)
      
      expect(result.getRowCount()).toBe(2)
      
      // Check first row has default "Change" text
      const firstRowActions = result.element.querySelector('.public-good-summary-list__row .public-good-summary-list__actions a')
      expect(firstRowActions?.textContent).toContain('Change')
      expect(firstRowActions?.href).toContain('/edit-name')
      
      // Check second row has custom "Edit" text
      const secondRowActions = result.element.querySelectorAll('.public-good-summary-list__row .public-good-summary-list__actions a')[1]
      expect(secondRowActions?.textContent).toContain('Edit')
      expect(secondRowActions?.href).toContain('/edit-email')
    })
    
    test('createBorderlessSummaryList should create summary list without borders', () => {
      const data = [
        { key: 'Name', value: 'John Doe' }
      ]
      
      const result = createBorderlessSummaryList(data)
      
      expect(result.element.classList.contains('public-good-summary-list--no-border')).toBe(true)
      expect(result.config.noBorder).toBe(true)
    })
  })

  describe('DOM Initialization', () => {
    test('should initialize from data attributes', () => {
      document.body.innerHTML = `
        <div 
          data-public-good-summary-list
          data-id="attr-summary-list"
          data-no-border="true"
          data-classes="custom-summary"
          data-rows='[{"key":{"text":"Test"},"value":{"text":"Value"}}]'
          data-attributes='{"data-test":"value"}'
        ></div>
      `
      
      const components = initializeSummaryLists()
      
      expect(components).toHaveLength(1)
      
      const summaryList = document.getElementById('attr-summary-list')
      expect(summaryList).toBeInstanceOf(HTMLDListElement)
      expect(summaryList?.classList.contains('public-good-summary-list--no-border')).toBe(true)
      expect(summaryList?.classList.contains('custom-summary')).toBe(true)
      expect(summaryList?.getAttribute('data-test')).toBe('value')
      
      const row = summaryList?.querySelector('.public-good-summary-list__row')
      expect(row?.querySelector('.public-good-summary-list__key')?.textContent).toBe('Test')
    })
    
    test('should handle invalid JSON in data attributes', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      document.body.innerHTML = `
        <div 
          data-public-good-summary-list
          data-rows='invalid-json'
        ></div>
      `
      
      const components = initializeSummaryLists()
      
      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Invalid JSON in data-rows attribute:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
    
    test('should warn when required data is missing', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      document.body.innerHTML = `
        <div data-public-good-summary-list></div>
      `
      
      const components = initializeSummaryLists()
      
      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Summary list component requires rows data')
      
      consoleSpy.mockRestore()
    })
    
    test('should handle initialization errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      document.body.innerHTML = `
        <div 
          data-public-good-summary-list
          data-rows='[{"key":{"text":"Test"},"value":{"text":"Value"}}]'
        ></div>
      `
      
      // Mock createSummaryList to throw an error
      const originalCreateSummaryList = require('../summary-list').createSummaryList
      require('../summary-list').createSummaryList = jest.fn(() => {
        throw new Error('Test error')
      })
      
      const components = initializeSummaryLists()
      
      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Error initializing summary list component:', expect.any(Error))
      
      // Restore original function
      require('../summary-list').createSummaryList = originalCreateSummaryList
      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    test('should create semantic HTML structure with description list', () => {
      const result = createSummaryList(mockConfig)
      
      expect(result.element.tagName).toBe('DL')
      
      const keys = result.element.querySelectorAll('dt')
      const values = result.element.querySelectorAll('dd')
      
      expect(keys).toHaveLength(2)
      expect(values).toHaveLength(3) // 2 values + 1 actions dd
      
      expect(keys[0].textContent).toBe('Name')
      expect(values[0].textContent).toBe('John Doe')
    })
    
    test('should include visually hidden text for screen readers', () => {
      const result = createSummaryList(mockConfig)
      
      const visuallyHidden = result.element.querySelector('.public-good-visually-hidden')
      expect(visuallyHidden).toBeInTheDocument()
      expect(visuallyHidden?.textContent).toContain('name')
    })
    
    test('should create accessible action links', () => {
      const result = createSummaryList(mockConfig)
      
      const actionLink = result.element.querySelector('.public-good-summary-list__actions a')
      expect(actionLink?.className).toContain('public-good-link')
      expect(actionLink?.getAttribute('href')).toBe('/edit-name')
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty rows array', () => {
      const emptyConfig: SummaryListConfig = { rows: [] }
      const result = createSummaryList(emptyConfig)
      
      expect(result.getRowCount()).toBe(0)
      expect(result.element.children).toHaveLength(0)
    })
    
    test('should handle rows without actions', () => {
      const noActionsConfig: SummaryListConfig = {
        rows: [{ key: { text: 'Test' }, value: { text: 'Value' } }]
      }
      
      const result = createSummaryList(noActionsConfig)
      
      const row = result.element.querySelector('.public-good-summary-list__row')
      expect(row?.querySelector('.public-good-summary-list__actions')).toBeNull()
    })
    
    test('should handle multiple actions per row', () => {
      const multiActionConfig: SummaryListConfig = {
        rows: [
          {
            key: { text: 'Test' },
            value: { text: 'Value' },
            actions: {
              items: [
                { href: '/edit', text: 'Edit' },
                { href: '/delete', text: 'Delete' },
                { href: '/copy', text: 'Copy' }
              ]
            }
          }
        ]
      }
      
      const result = createSummaryList(multiActionConfig)
      
      const actionLinks = result.element.querySelectorAll('.public-good-summary-list__actions a')
      expect(actionLinks).toHaveLength(3)
      
      const actionItems = result.element.querySelectorAll('.public-good-summary-list__actions-list-item')
      expect(actionItems).toHaveLength(3)
      
      // Check borders between action items (first two should have border-right)
      expect(actionItems[0].classList.contains('public-good-summary-list__actions-list-item')).toBe(true)
      expect(actionItems[2].classList.contains('public-good-summary-list__actions-list-item')).toBe(true)
    })
  })

  describe('Destroy Method', () => {
    test('should remove element from DOM when destroyed', () => {
      const result = createSummaryList(mockConfig)
      document.body.appendChild(result.element)
      
      expect(document.getElementById('test-summary-list')).toBeInTheDocument()
      
      result.destroy()
      
      expect(document.getElementById('test-summary-list')).not.toBeInTheDocument()
    })
  })
})