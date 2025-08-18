/**
 * Do and Don't List Component Tests
 * Unit tests for the do and don't list component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createDoDontList, 
  initializeDoDontLists,
  createSimpleDoDontList,
  createDoDontListWithHTML,
  createDoList,
  createDontList,
  initAllDoDontLists
} from './do-dont-list'

describe('Do and Don\'t List Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createDoDontList', () => {
    it('should create a basic do and don\'t list with default properties', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }],
        dontItems: [{ text: 'Don\'t do this' }]
      })

      expect(doDontList.element).toBeDefined()
      expect(doDontList.config).toBeDefined()
      expect(doDontList.destroy).toBeInstanceOf(Function)
      expect(doDontList.addDoItem).toBeInstanceOf(Function)
      expect(doDontList.addDontItem).toBeInstanceOf(Function)

      // Check structure
      expect(doDontList.element.tagName).toBe('DIV')
      expect(doDontList.element.classList.contains('public-good-do-dont-list')).toBe(true)
      
      const doSection = doDontList.element.querySelector('.public-good-do-dont-list__do')
      expect(doSection).toBeTruthy()
      
      const dontSection = doDontList.element.querySelector('.public-good-do-dont-list__dont')
      expect(dontSection).toBeTruthy()
    })

    it('should create do and don\'t list with title', () => {
      const doDontList = createDoDontList({
        title: 'Important Guidelines',
        doItems: [{ text: 'Follow this' }],
        dontItems: [{ text: 'Avoid this' }]
      })

      const title = doDontList.element.querySelector('.public-good-do-dont-list__title')
      expect(title).toBeTruthy()
      expect(title?.textContent).toBe('Important Guidelines')
    })

    it('should create do and don\'t list with custom classes', () => {
      const doDontList = createDoDontList({
        classes: 'custom-list',
        doItems: [{ text: 'Do this' }]
      })

      expect(doDontList.element.classList.contains('custom-list')).toBe(true)
    })

    it('should create do and don\'t list with custom attributes', () => {
      const doDontList = createDoDontList({
        attributes: {
          'data-test': 'list-value',
          'aria-label': 'Custom list'
        },
        doItems: [{ text: 'Do this' }]
      })

      expect(doDontList.element.getAttribute('data-test')).toBe('list-value')
      expect(doDontList.element.getAttribute('aria-label')).toBe('Custom list')
    })

    it('should handle HTML content in items', () => {
      const doDontList = createDoDontList({
        doItems: [{ 
          text: 'Simple text',
          html: '<p>Do <strong>this</strong> action</p>' 
        }],
        dontItems: [{ 
          text: 'Simple text',
          html: '<p>Don\'t <em>do</em> this</p>' 
        }]
      })

      const doContent = doDontList.element.querySelector('.public-good-do-dont-list__do-content')
      expect(doContent?.innerHTML).toBe('<p>Do <strong>this</strong> action</p>')
      
      const dontContent = doDontList.element.querySelector('.public-good-do-dont-list__dont-content')
      expect(dontContent?.innerHTML).toBe('<p>Don\'t <em>do</em> this</p>')
    })

    it('should create SVG icons correctly', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }],
        dontItems: [{ text: 'Don\'t do this' }]
      })

      const tickIcon = doDontList.element.querySelector('.public-good-icon--tick')
      expect(tickIcon).toBeTruthy()
      expect(tickIcon?.tagName).toBe('svg')
      expect(tickIcon?.getAttribute('width')).toBe('34')
      expect(tickIcon?.getAttribute('height')).toBe('34')
      
      const crossIcon = doDontList.element.querySelector('.public-good-icon--cross')
      expect(crossIcon).toBeTruthy()
      expect(crossIcon?.tagName).toBe('svg')
      expect(crossIcon?.getAttribute('width')).toBe('34')
      expect(crossIcon?.getAttribute('height')).toBe('34')
    })

    it('should hide icons when showIcons is false', () => {
      const doDontList = createDoDontList({
        showIcons: false,
        doItems: [{ text: 'Do this' }],
        dontItems: [{ text: 'Don\'t do this' }]
      })

      const tickIcon = doDontList.element.querySelector('.public-good-icon--tick')
      expect(tickIcon).toBeFalsy()
      
      const crossIcon = doDontList.element.querySelector('.public-good-icon--cross')
      expect(crossIcon).toBeFalsy()
    })

    it('should hide empty sections', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }]
        // No dontItems
      })

      const doSection = doDontList.element.querySelector('.public-good-do-dont-list__do') as HTMLElement
      expect(doSection?.style.display).not.toBe('none')
      
      const dontSection = doDontList.element.querySelector('.public-good-do-dont-list__dont') as HTMLElement
      expect(dontSection?.style.display).toBe('none')
    })

    it('should have proper accessibility attributes', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }],
        dontItems: [{ text: 'Don\'t do this' }]
      })

      const doList = doDontList.element.querySelector('.public-good-do-dont-list__do-list')
      expect(doList?.getAttribute('role')).toBe('list')
      
      const dontList = doDontList.element.querySelector('.public-good-do-dont-list__dont-list')
      expect(dontList?.getAttribute('role')).toBe('list')

      const icons = doDontList.element.querySelectorAll('.public-good-icon')
      icons.forEach(icon => {
        expect(icon.getAttribute('aria-hidden')).toBe('true')
        expect(icon.getAttribute('focusable')).toBe('false')
      })
    })

    it('should emit events when items are added', () => {
      const doDontList = createDoDontList({
        doItems: [],
        dontItems: []
      })

      const eventSpy = vi.fn()
      doDontList.element.addEventListener('public-good:do-dont-list:item-added', eventSpy)

      doDontList.addDoItem({ text: 'New do item' })

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.type).toBe('do')
      expect(eventDetail.item.text).toBe('New do item')
      expect(eventDetail.totalDoItems).toBe(1)
    })

    it('should emit events when items are removed', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'First item' }, { text: 'Second item' }],
        dontItems: []
      })

      const eventSpy = vi.fn()
      doDontList.element.addEventListener('public-good:do-dont-list:item-removed', eventSpy)

      doDontList.removeDoItem(0)

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.type).toBe('do')
      expect(eventDetail.item.text).toBe('First item')
      expect(eventDetail.index).toBe(0)
      expect(eventDetail.totalDoItems).toBe(1)
    })

    it('should handle programmatic item management', () => {
      const doDontList = createDoDontList({
        doItems: [],
        dontItems: []
      })

      // Add items
      doDontList.addDoItem({ text: 'Do item 1' })
      doDontList.addDontItem({ text: 'Don\'t item 1' })

      expect(doDontList.getDoItems()).toHaveLength(1)
      expect(doDontList.getDontItems()).toHaveLength(1)
      expect(doDontList.getDoItems()[0]!.text).toBe('Do item 1')
      expect(doDontList.getDontItems()[0]!.text).toBe('Don\'t item 1')

      // Remove items
      doDontList.removeDoItem(0)
      doDontList.removeDontItem(0)

      expect(doDontList.getDoItems()).toHaveLength(0)
      expect(doDontList.getDontItems()).toHaveLength(0)
    })

    it('should handle invalid remove operations gracefully', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Only item' }],
        dontItems: []
      })

      // Try to remove non-existent items
      doDontList.removeDoItem(-1)
      doDontList.removeDoItem(5)
      doDontList.removeDontItem(0)

      expect(doDontList.getDoItems()).toHaveLength(1)
      expect(doDontList.getDontItems()).toHaveLength(0)
    })

    it('should update title dynamically', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }]
      })

      // Initially no title
      expect(doDontList.element.querySelector('.public-good-do-dont-list__title')).toBeFalsy()

      doDontList.setTitle('New Title')
      
      const title = doDontList.element.querySelector('.public-good-do-dont-list__title')
      expect(title).toBeTruthy()
      expect(title?.textContent).toBe('New Title')

      // Update existing title
      doDontList.setTitle('Updated Title')
      expect(title?.textContent).toBe('Updated Title')
    })

    it('should clean up when destroyed', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }]
      })
      document.body.appendChild(doDontList.element)

      expect(document.querySelector('.public-good-do-dont-list')).toBeTruthy()

      doDontList.destroy()
      expect(document.querySelector('.public-good-do-dont-list')).toBeFalsy()
    })
  })

  describe('initializeDoDontLists', () => {
    it('should initialize do and don\'t lists from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-do-dont-list 
             data-title="Guidelines"
             data-do-items='[{"text":"Do this"}]'
             data-dont-items='[{"text":"Don\\'t do this"}]'>
        </div>
      `

      const components = initializeDoDontLists()

      expect(components).toHaveLength(1)
      
      const listElement = document.querySelector('.public-good-do-dont-list')
      expect(listElement).toBeTruthy()
      
      const title = listElement?.querySelector('.public-good-do-dont-list__title')
      expect(title?.textContent).toBe('Guidelines')
    })

    it('should initialize from child elements with data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-do-dont-list data-title="Guidelines">
          <div data-do>Follow this guideline</div>
          <div data-do>Also follow this</div>
          <div data-dont>Avoid this practice</div>
        </div>
      `

      const components = initializeDoDontLists()

      expect(components).toHaveLength(1)
      expect(components[0]!.getDoItems()).toHaveLength(2)
      expect(components[0]!.getDontItems()).toHaveLength(1)
    })

    it('should handle configuration options from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-do-dont-list 
             data-id="test-list"
             data-classes="custom-class"
             data-show-icons="false"
             data-do-items='[{"text":"Do this"}]'>
        </div>
      `

      const components = initializeDoDontLists()

      expect(components).toHaveLength(1)
      expect(components[0]!.element.id).toBe('test-list')
      expect(components[0]!.element.classList.contains('custom-class')).toBe(true)
      expect(components[0]!.config.showIcons).toBe(false)
    })

    it('should handle invalid JSON gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-do-dont-list 
             data-do-items='invalid json'
             data-dont-items='[{"text":"Valid"}]'>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const components = initializeDoDontLists()

      expect(components).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith('Invalid JSON in data-do-items attribute')
      
      consoleSpy.mockRestore()
    })

    it('should handle initialization errors gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-do-dont-list>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Remove the element during processing to cause error
      const elements = document.querySelectorAll('[data-public-good-do-dont-list]')
      elements.forEach(element => {
        element.remove()
      })

      const components = initializeDoDontLists()

      expect(components).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create simple do and don\'t list', () => {
      const doDontList = createSimpleDoDontList(
        ['Do first thing', 'Do second thing'],
        ['Don\'t do this', 'Don\'t do that']
      )

      expect(doDontList.getDoItems()).toHaveLength(2)
      expect(doDontList.getDontItems()).toHaveLength(2)
      expect(doDontList.getDoItems()[0]!.text).toBe('Do first thing')
      expect(doDontList.getDontItems()[0]!.text).toBe('Don\'t do this')
    })

    it('should create do and don\'t list with HTML', () => {
      const doItems = [{ text: 'Plain text', html: '<p><strong>Do</strong> this</p>' }]
      const dontItems = [{ text: 'Plain text', html: '<p><em>Don\'t</em> do this</p>' }]
      
      const doDontList = createDoDontListWithHTML(doItems, dontItems)

      const doContent = doDontList.element.querySelector('.public-good-do-dont-list__do-content')
      expect(doContent?.innerHTML).toBe('<p><strong>Do</strong> this</p>')
    })

    it('should create do-only list', () => {
      const doList = createDoList(['First do', 'Second do'])

      expect(doList.getDoItems()).toHaveLength(2)
      expect(doList.getDontItems()).toHaveLength(0)
      
      const dontSection = doList.element.querySelector('.public-good-do-dont-list__dont') as HTMLElement
      expect(dontSection?.style.display).toBe('none')
    })

    it('should create don\'t-only list', () => {
      const dontList = createDontList(['First don\'t', 'Second don\'t'])

      expect(dontList.getDoItems()).toHaveLength(0)
      expect(dontList.getDontItems()).toHaveLength(2)
      
      const doSection = dontList.element.querySelector('.public-good-do-dont-list__do') as HTMLElement
      expect(doSection?.style.display).toBe('none')
    })

    it('should accept additional options in helper functions', () => {
      const doDontList = createSimpleDoDontList(
        ['Do this'],
        ['Don\'t do this'],
        { title: 'Helper Title', classes: 'helper-class' }
      )

      expect(doDontList.config.title).toBe('Helper Title')
      expect(doDontList.element.classList.contains('helper-class')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      const doDontList = createDoDontList({
        title: 'Guidelines',
        doItems: [{ text: 'Do this' }],
        dontItems: [{ text: 'Don\'t do this' }]
      })

      const title = doDontList.element.querySelector('.public-good-do-dont-list__title')
      expect(title?.tagName).toBe('H2')
      
      const doHeading = doDontList.element.querySelector('.public-good-do-dont-list__do-heading')
      expect(doHeading?.tagName).toBe('H3')
      expect(doHeading?.textContent).toBe('Do')
      
      const dontHeading = doDontList.element.querySelector('.public-good-do-dont-list__dont-heading')
      expect(dontHeading?.tagName).toBe('H3')
      expect(dontHeading?.textContent).toBe('Don\'t')
    })

    it('should have proper list structure', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }],
        dontItems: [{ text: 'Don\'t do this' }]
      })

      const doList = doDontList.element.querySelector('.public-good-do-dont-list__do-list')
      expect(doList?.tagName).toBe('UL')
      expect(doList?.getAttribute('role')).toBe('list')
      
      const dontList = doDontList.element.querySelector('.public-good-do-dont-list__dont-list')
      expect(dontList?.tagName).toBe('UL')
      expect(dontList?.getAttribute('role')).toBe('list')
    })

    it('should hide icons from screen readers', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Do this' }],
        dontItems: [{ text: 'Don\'t do this' }]
      })

      const icons = doDontList.element.querySelectorAll('.public-good-icon')
      icons.forEach(icon => {
        expect(icon.getAttribute('aria-hidden')).toBe('true')
        expect(icon.getAttribute('focusable')).toBe('false')
      })
    })
  })

  describe('dynamic updates', () => {
    it('should update DOM when items are added', () => {
      const doDontList = createDoDontList({
        doItems: [],
        dontItems: []
      })

      // Initially sections should be hidden
      let doSection = doDontList.element.querySelector('.public-good-do-dont-list__do') as HTMLElement
      expect(doSection?.style.display).toBe('none')

      doDontList.addDoItem({ text: 'New do item' })

      // Section should now be visible
      doSection = doDontList.element.querySelector('.public-good-do-dont-list__do') as HTMLElement
      expect(doSection?.style.display).not.toBe('none')

      const doItems = doDontList.element.querySelectorAll('.public-good-do-dont-list__do-item')
      expect(doItems).toHaveLength(1)
    })

    it('should update DOM when items are removed', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'First' }, { text: 'Second' }],
        dontItems: []
      })

      let doItems = doDontList.element.querySelectorAll('.public-good-do-dont-list__do-item')
      expect(doItems).toHaveLength(2)

      doDontList.removeDoItem(0)

      doItems = doDontList.element.querySelectorAll('.public-good-do-dont-list__do-item')
      expect(doItems).toHaveLength(1)
    })

    it('should maintain immutability of returned arrays', () => {
      const doDontList = createDoDontList({
        doItems: [{ text: 'Original' }],
        dontItems: []
      })

      const doItems = doDontList.getDoItems()
      doItems.push({ text: 'Added to copy' })

      // Original should be unchanged
      expect(doDontList.getDoItems()).toHaveLength(1)
      expect(doDontList.getDoItems()[0]!.text).toBe('Original')
    })
  })

  describe('initAllDoDontLists', () => {
    it('should initialize all do and don\'t lists on the page', () => {
      document.body.innerHTML = `
        <div data-public-good-do-dont-list data-do-items='[{"text":"First"}]'></div>
        <div data-public-good-do-dont-list data-dont-items='[{"text":"Second"}]'></div>
      `

      const components = initAllDoDontLists()

      expect(components).toHaveLength(2)
      expect(document.querySelectorAll('.public-good-do-dont-list')).toHaveLength(2)
    })
  })
})