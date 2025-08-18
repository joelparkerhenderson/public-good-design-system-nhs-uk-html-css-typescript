/**
 * Public Good Design System - Do and Don't List Component
 * TypeScript implementation of accessible guidance lists with visual indicators
 * Based on NHS UK Design System do and don't list patterns
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Individual list item configuration
 */
export interface DoDontListItem {
  text: string
  html?: string
}

/**
 * Do and Don't List configuration interface
 */
export interface DoDontListConfig {
  id?: string
  title?: string
  doItems?: DoDontListItem[]
  dontItems?: DoDontListItem[]
  classes?: string
  attributes?: Record<string, string>
  showIcons?: boolean
}

/**
 * Do and Don't List result interface
 */
export interface DoDontListResult {
  element: HTMLDivElement
  config: DoDontListConfig
  destroy: () => void
  addDoItem: (item: DoDontListItem) => void
  addDontItem: (item: DoDontListItem) => void
  removeDoItem: (index: number) => void
  removeDontItem: (index: number) => void
  setTitle: (title: string) => void
  getDoItems: () => DoDontListItem[]
  getDontItems: () => DoDontListItem[]
}

/**
 * Creates SVG tick icon for do items
 */
const createTickIcon = (): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '34')
  svg.setAttribute('height', '34')
  svg.setAttribute('viewBox', '0 0 34 34')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  svg.classList.add('public-good-icon', 'public-good-icon--tick')
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('cx', '17')
  circle.setAttribute('cy', '17')
  circle.setAttribute('r', '17')
  circle.setAttribute('fill', '#007f3b')
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M14.18 21.27l-6.45-6.45L6 16.55l8.18 8.18L26 12.91l-1.73-1.73z')
  path.setAttribute('fill', 'white')
  
  svg.appendChild(circle)
  svg.appendChild(path)
  
  return svg
}

/**
 * Creates SVG cross icon for don't items
 */
const createCrossIcon = (): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '34')
  svg.setAttribute('height', '34')
  svg.setAttribute('viewBox', '0 0 34 34')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  svg.classList.add('public-good-icon', 'public-good-icon--cross')
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('cx', '17')
  circle.setAttribute('cy', '17')
  circle.setAttribute('r', '17')
  circle.setAttribute('fill', '#d5281b')
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M25.07 10.18L23.93 9.05 17 15.98 10.07 9.05 8.93 10.18 15.86 17.11 8.93 24.04 10.07 25.18 17 18.25 23.93 25.18 25.07 24.04 18.14 17.11z')
  path.setAttribute('fill', 'white')
  
  svg.appendChild(circle)
  svg.appendChild(path)
  
  return svg
}

/**
 * Creates a list section (do or don't)
 */
const createListSection = (
  type: 'do' | 'dont',
  items: DoDontListItem[],
  showIcons: boolean
): HTMLDivElement => {
  const section = document.createElement('div')
  section.className = `public-good-do-dont-list__${type}`
  
  if (items.length === 0) {
    section.style.display = 'none'
    return section
  }
  
  // Create heading
  const heading = document.createElement('h3')
  heading.className = `public-good-do-dont-list__${type}-heading`
  heading.textContent = type === 'do' ? 'Do' : "Don't"
  section.appendChild(heading)
  
  // Create list
  const list = document.createElement('ul')
  list.className = `public-good-do-dont-list__${type}-list`
  list.setAttribute('role', 'list')
  
  items.forEach((item) => {
    const listItem = document.createElement('li')
    listItem.className = `public-good-do-dont-list__${type}-item`
    
    if (showIcons) {
      const icon = type === 'do' ? createTickIcon() : createCrossIcon()
      listItem.appendChild(icon)
    }
    
    const content = document.createElement('div')
    content.className = `public-good-do-dont-list__${type}-content`
    
    if (item.html) {
      content.innerHTML = item.html
    } else {
      content.textContent = item.text
    }
    
    listItem.appendChild(content)
    list.appendChild(listItem)
  })
  
  section.appendChild(list)
  return section
}

/**
 * Creates a do and don't list component
 */
export const createDoDontList = (config: DoDontListConfig): DoDontListResult => {
  const id = config.id || generateUniqueId('do-dont-list')
  
  // Create main container
  const container = document.createElement('div')
  container.id = id
  container.className = `public-good-do-dont-list${config.classes ? ` ${config.classes}` : ''}`
  
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      container.setAttribute(key, value)
    })
  }
  
  // Create title if provided
  let titleElement: HTMLHeadingElement | null = null
  if (config.title) {
    titleElement = document.createElement('h2')
    titleElement.className = 'public-good-do-dont-list__title'
    titleElement.textContent = config.title
    container.appendChild(titleElement)
  }
  
  // Create do section
  const doItems = config.doItems || []
  const doSection = createListSection('do', doItems, config.showIcons !== false)
  container.appendChild(doSection)
  
  // Create don't section
  const dontItems = config.dontItems || []
  const dontSection = createListSection('dont', dontItems, config.showIcons !== false)
  container.appendChild(dontSection)
  
  // Store references for dynamic updates
  let currentDoSection = doSection
  let currentDontSection = dontSection

  // Component API methods
  const addDoItem = (item: DoDontListItem): void => {
    config.doItems = config.doItems || []
    config.doItems.push(item)
    
    // Recreate do section
    const newDoSection = createListSection('do', config.doItems, config.showIcons !== false)
    container.replaceChild(newDoSection, currentDoSection)
    currentDoSection = newDoSection
    
    // Emit event
    const addEvent = new CustomEvent('public-good:do-dont-list:item-added', {
      detail: {
        id,
        type: 'do',
        item,
        totalDoItems: config.doItems.length
      },
      bubbles: true
    })
    container.dispatchEvent(addEvent)
  }
  
  const addDontItem = (item: DoDontListItem): void => {
    config.dontItems = config.dontItems || []
    config.dontItems.push(item)
    
    // Recreate don't section
    const newDontSection = createListSection('dont', config.dontItems, config.showIcons !== false)
    container.replaceChild(newDontSection, currentDontSection)
    currentDontSection = newDontSection
    
    // Emit event
    const addEvent = new CustomEvent('public-good:do-dont-list:item-added', {
      detail: {
        id,
        type: 'dont',
        item,
        totalDontItems: config.dontItems.length
      },
      bubbles: true
    })
    container.dispatchEvent(addEvent)
  }
  
  const removeDoItem = (index: number): void => {
    if (!config.doItems || index < 0 || index >= config.doItems.length) {
      return
    }
    
    const removedItem = config.doItems.splice(index, 1)[0]
    
    // Recreate do section
    const newDoSection = createListSection('do', config.doItems, config.showIcons !== false)
    container.replaceChild(newDoSection, currentDoSection)
    currentDoSection = newDoSection
    
    // Emit event
    const removeEvent = new CustomEvent('public-good:do-dont-list:item-removed', {
      detail: {
        id,
        type: 'do',
        item: removedItem,
        index,
        totalDoItems: config.doItems.length
      },
      bubbles: true
    })
    container.dispatchEvent(removeEvent)
  }
  
  const removeDontItem = (index: number): void => {
    if (!config.dontItems || index < 0 || index >= config.dontItems.length) {
      return
    }
    
    const removedItem = config.dontItems.splice(index, 1)[0]
    
    // Recreate don't section
    const newDontSection = createListSection('dont', config.dontItems, config.showIcons !== false)
    container.replaceChild(newDontSection, currentDontSection)
    currentDontSection = newDontSection
    
    // Emit event
    const removeEvent = new CustomEvent('public-good:do-dont-list:item-removed', {
      detail: {
        id,
        type: 'dont',
        item: removedItem,
        index,
        totalDontItems: config.dontItems.length
      },
      bubbles: true
    })
    container.dispatchEvent(removeEvent)
  }
  
  const setTitle = (title: string): void => {
    config.title = title
    
    if (!titleElement) {
      titleElement = document.createElement('h2')
      titleElement.className = 'public-good-do-dont-list__title'
      container.insertBefore(titleElement, container.firstChild)
    }
    
    titleElement.textContent = title
  }
  
  const getDoItems = (): DoDontListItem[] => {
    return [...(config.doItems || [])]
  }
  
  const getDontItems = (): DoDontListItem[] => {
    return [...(config.dontItems || [])]
  }
  
  const destroy = (): void => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }
  
  return {
    element: container,
    config,
    destroy,
    addDoItem,
    addDontItem,
    removeDoItem,
    removeDontItem,
    setTitle,
    getDoItems,
    getDontItems
  }
}

/**
 * Initialize do and don't list components from data attributes
 */
export const initializeDoDontLists = (): DoDontListResult[] => {
  const elements = document.querySelectorAll('[data-public-good-do-dont-list]')
  const components: DoDontListResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: DoDontListConfig = {}
      
      // Parse configuration from data attributes
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const title = element.getAttribute('data-title')
      if (title) config.title = title
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      const showIcons = element.getAttribute('data-show-icons')
      if (showIcons === 'false') config.showIcons = false
      
      // Parse do items from data attributes or child elements
      const doItemsData = element.getAttribute('data-do-items')
      if (doItemsData) {
        try {
          config.doItems = JSON.parse(doItemsData)
        } catch (error) {
          console.warn('Invalid JSON in data-do-items attribute')
        }
      } else {
        // Parse from child elements with data-do attribute
        const doElements = element.querySelectorAll('[data-do]')
        if (doElements.length > 0) {
          config.doItems = Array.from(doElements).map((el) => ({
            text: el.textContent || '',
            html: el.innerHTML
          }))
        }
      }
      
      // Parse don't items from data attributes or child elements
      const dontItemsData = element.getAttribute('data-dont-items')
      if (dontItemsData) {
        try {
          config.dontItems = JSON.parse(dontItemsData)
        } catch (error) {
          console.warn('Invalid JSON in data-dont-items attribute')
        }
      } else {
        // Parse from child elements with data-dont attribute
        const dontElements = element.querySelectorAll('[data-dont]')
        if (dontElements.length > 0) {
          config.dontItems = Array.from(dontElements).map((el) => ({
            text: el.textContent || '',
            html: el.innerHTML
          }))
        }
      }
      
      const doDontList = createDoDontList(config)
      element.parentNode?.replaceChild(doDontList.element, element)
      components.push(doDontList)
    } catch (error) {
      console.error('Error initializing do and don\'t list component:', error)
    }
  })
  
  return components
}

/**
 * Helper function to create a simple do and don't list
 */
export const createSimpleDoDontList = (
  doItems: string[],
  dontItems: string[],
  options?: Partial<DoDontListConfig>
): DoDontListResult => {
  return createDoDontList({
    doItems: doItems.map(text => ({ text })),
    dontItems: dontItems.map(text => ({ text })),
    ...options
  })
}

/**
 * Helper function to create a do and don't list with HTML content
 */
export const createDoDontListWithHTML = (
  doItems: DoDontListItem[],
  dontItems: DoDontListItem[],
  options?: Partial<DoDontListConfig>
): DoDontListResult => {
  return createDoDontList({
    doItems,
    dontItems,
    ...options
  })
}

/**
 * Helper function to create a do-only list
 */
export const createDoList = (
  items: string[],
  options?: Partial<DoDontListConfig>
): DoDontListResult => {
  return createDoDontList({
    doItems: items.map(text => ({ text })),
    ...options
  })
}

/**
 * Helper function to create a don't-only list
 */
export const createDontList = (
  items: string[],
  options?: Partial<DoDontListConfig>
): DoDontListResult => {
  return createDoDontList({
    dontItems: items.map(text => ({ text })),
    ...options
  })
}

/**
 * Initialize all do and don't list components on the page
 */
export const initAllDoDontLists = (): DoDontListResult[] => {
  return initializeDoDontLists()
}