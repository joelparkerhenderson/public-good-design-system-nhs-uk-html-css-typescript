/**
 * Summary List Component
 * 
 * Creates summary lists for presenting key-value pairs following NHS UK Design System patterns.
 * Use summary lists to summarize information, like user responses at the end of a form.
 * 
 * Features:
 * - Key-value pair display using description lists
 * - Optional action links with accessibility features
 * - Borderless variant support
 * - Data attribute initialization
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Action item for summary list rows
 */
export interface SummaryListAction {
  href: string
  text: string
  visuallyHiddenText?: string
  attributes?: Record<string, string>
}

/**
 * Summary list row configuration
 */
export interface SummaryListRow {
  key: {
    text: string
    html?: boolean
  }
  value: {
    text: string
    html?: boolean
  }
  actions?: {
    items: SummaryListAction[]
  }
}

/**
 * Summary list configuration
 */
export interface SummaryListConfig {
  id?: string
  rows: SummaryListRow[]
  noBorder?: boolean
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Summary list component result
 */
export interface SummaryListResult {
  element: HTMLElement
  config: SummaryListConfig
  addRow: (row: SummaryListRow, index?: number) => void
  removeRow: (index: number) => boolean
  updateRow: (index: number, row: Partial<SummaryListRow>) => boolean
  getRow: (index: number) => SummaryListRow | null
  getRowCount: () => number
  destroy: () => void
}

/**
 * Creates a summary list component
 */
export function createSummaryList(config: SummaryListConfig): SummaryListResult {
  const id = config.id || generateUniqueId('summary-list')
  
  // Set defaults
  if (!config.id) {
    config.id = id
  }
  if (config.noBorder === undefined) {
    config.noBorder = false
  }
  
  // Create summary list container
  const summaryList = document.createElement('dl')
  summaryList.className = 'public-good-summary-list'
  summaryList.id = id
  
  if (config.noBorder) {
    summaryList.classList.add('public-good-summary-list--no-border')
  }
  
  // Apply custom classes
  if (config.classes) {
    summaryList.classList.add(...config.classes.split(' '))
  }
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      summaryList.setAttribute(key, value)
    })
  }
  
  // Function to create a single row
  function createRow(rowConfig: SummaryListRow): HTMLElement {
    const row = document.createElement('div')
    row.className = 'public-good-summary-list__row'
    
    // Create key element
    const keyElement = document.createElement('dt')
    keyElement.className = 'public-good-summary-list__key'
    
    if (rowConfig.key.html) {
      keyElement.innerHTML = rowConfig.key.text
    } else {
      keyElement.textContent = rowConfig.key.text
    }
    
    row.appendChild(keyElement)
    
    // Create value element
    const valueElement = document.createElement('dd')
    valueElement.className = 'public-good-summary-list__value'
    
    if (rowConfig.value.html) {
      valueElement.innerHTML = rowConfig.value.text
    } else {
      valueElement.textContent = rowConfig.value.text
    }
    
    row.appendChild(valueElement)
    
    // Create actions element if provided
    if (rowConfig.actions && rowConfig.actions.items.length > 0) {
      const actionsElement = document.createElement('dd')
      actionsElement.className = 'public-good-summary-list__actions'
      
      // Create list of actions
      const actionsList = document.createElement('ul')
      actionsList.className = 'public-good-summary-list__actions-list'
      
      rowConfig.actions.items.forEach((action) => {
        const actionItem = document.createElement('li')
        actionItem.className = 'public-good-summary-list__actions-list-item'
        
        const actionLink = document.createElement('a')
        actionLink.className = 'public-good-link'
        actionLink.href = action.href
        
        // Add custom attributes
        if (action.attributes) {
          Object.entries(action.attributes).forEach(([key, value]) => {
            actionLink.setAttribute(key, value)
          })
        }
        
        // Create link text with visually hidden context
        if (action.visuallyHiddenText) {
          actionLink.innerHTML = `${action.text}<span class="public-good-visually-hidden"> ${action.visuallyHiddenText}</span>`
        } else {
          actionLink.textContent = action.text
        }
        
        actionItem.appendChild(actionLink)
        actionsList.appendChild(actionItem)
      })
      
      actionsElement.appendChild(actionsList)
      row.appendChild(actionsElement)
    }
    
    return row
  }
  
  // Function to rebuild the summary list
  function rebuildList(): void {
    summaryList.innerHTML = ''
    config.rows.forEach((rowConfig) => {
      const row = createRow(rowConfig)
      summaryList.appendChild(row)
    })
  }
  
  // Initial build
  rebuildList()
  
  // Create result object
  const result: SummaryListResult = {
    element: summaryList,
    config,
    
    addRow(row: SummaryListRow, index?: number): void {
      const insertIndex = index !== undefined ? index : config.rows.length
      config.rows.splice(insertIndex, 0, row)
      rebuildList()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:summary-list:row-added', {
        detail: { 
          row,
          index: insertIndex,
          element: summaryList,
          config: config 
        },
        bubbles: true
      })
      summaryList.dispatchEvent(event)
    },
    
    removeRow(index: number): boolean {
      if (index >= 0 && index < config.rows.length) {
        const removedRow = config.rows.splice(index, 1)[0]
        rebuildList()
        
        // Dispatch custom event
        const event = new CustomEvent('public-good:summary-list:row-removed', {
          detail: { 
            row: removedRow,
            index,
            element: summaryList,
            config: config 
          },
          bubbles: true
        })
        summaryList.dispatchEvent(event)
        
        return true
      }
      return false
    },
    
    updateRow(index: number, row: Partial<SummaryListRow>): boolean {
      const existingRow = config.rows[index]
      if (index >= 0 && index < config.rows.length && existingRow) {
        const oldRow = { ...existingRow }
        config.rows[index] = { ...existingRow, ...row }
        rebuildList()
        
        // Dispatch custom event
        const event = new CustomEvent('public-good:summary-list:row-updated', {
          detail: { 
            oldRow,
            newRow: config.rows[index],
            index,
            element: summaryList,
            config: config 
          },
          bubbles: true
        })
        summaryList.dispatchEvent(event)
        
        return true
      }
      return false
    },
    
    getRow(index: number): SummaryListRow | null {
      const row = config.rows[index]
      if (index >= 0 && index < config.rows.length && row) {
        return { ...row }
      }
      return null
    },
    
    getRowCount(): number {
      return config.rows.length
    },
    
    destroy(): void {
      summaryList.remove()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:summary-list:destroyed', {
        detail: { element: summaryList, config: config },
        bubbles: true
      })
      document.dispatchEvent(event)
    }
  }
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:summary-list:created', {
    detail: { element: summaryList, config: config },
    bubbles: true
  })
  summaryList.dispatchEvent(creationEvent)
  
  return result
}

/**
 * Creates a simple summary list with basic key-value pairs
 */
export function createSimpleSummaryList(
  data: Array<{ key: string; value: string }>,
  options: Partial<SummaryListConfig> = {}
): SummaryListResult {
  const rows: SummaryListRow[] = data.map(item => ({
    key: { text: item.key },
    value: { text: item.value }
  }))
  
  return createSummaryList({
    rows,
    ...options
  })
}

/**
 * Creates a summary list with action links for editing
 */
export function createEditableSummaryList(
  data: Array<{ key: string; value: string; editHref: string; editText?: string }>,
  options: Partial<SummaryListConfig> = {}
): SummaryListResult {
  const rows: SummaryListRow[] = data.map(item => ({
    key: { text: item.key },
    value: { text: item.value },
    actions: {
      items: [{
        href: item.editHref,
        text: item.editText || 'Change',
        visuallyHiddenText: item.key.toLowerCase()
      }]
    }
  }))
  
  return createSummaryList({
    rows,
    ...options
  })
}

/**
 * Creates a borderless summary list
 */
export function createBorderlessSummaryList(
  data: Array<{ key: string; value: string }>,
  options: Partial<SummaryListConfig> = {}
): SummaryListResult {
  return createSimpleSummaryList(data, {
    noBorder: true,
    ...options
  })
}

/**
 * Initialize all summary list components from data attributes in the DOM
 */
export function initializeSummaryLists(): SummaryListResult[] {
  const elements = document.querySelectorAll('[data-public-good-summary-list]')
  const components: SummaryListResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<SummaryListConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const noBorder = element.getAttribute('data-no-border')
      if (noBorder) config.noBorder = noBorder === 'true'
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      // Parse rows from data attribute
      const rowsData = element.getAttribute('data-rows')
      if (rowsData) {
        try {
          config.rows = JSON.parse(rowsData)
        } catch (error) {
          console.warn('Invalid JSON in data-rows attribute:', error)
          return
        }
      }
      
      // Parse custom attributes
      const customAttributes = element.getAttribute('data-attributes')
      if (customAttributes) {
        try {
          config.attributes = JSON.parse(customAttributes)
        } catch (error) {
          console.warn('Invalid JSON in data-attributes attribute:', error)
        }
      }
      
      // Ensure required fields are provided
      if (!config.rows) {
        console.warn('Summary list component requires rows data')
        return
      }
      
      // Create the summary list component
      const summaryList = createSummaryList(config as SummaryListConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(summaryList.element, element)
      components.push(summaryList)
      
    } catch (error) {
      console.error('Error initializing summary list component:', error)
    }
  })
  
  return components
}

// Auto-initialize summary list components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSummaryLists)
  } else {
    initializeSummaryLists()
  }
}