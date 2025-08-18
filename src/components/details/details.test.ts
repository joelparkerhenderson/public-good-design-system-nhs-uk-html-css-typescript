/**
 * Details Component Tests
 * Unit tests for the details component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createDetails, 
  initializeDetails,
  createSimpleDetails,
  createDetailsWithHTML,
  loadDetailsPolyfill,
  initAllDetails
} from './details'

describe('Details Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createDetails', () => {
    it('should create a basic details component with default properties', () => {
      const details = createDetails({
        summaryText: 'Click to expand',
        content: 'This is the hidden content'
      })

      expect(details.element).toBeDefined()
      expect(details.config).toBeDefined()
      expect(details.destroy).toBeInstanceOf(Function)
      expect(details.toggle).toBeInstanceOf(Function)
      expect(details.open).toBeInstanceOf(Function)
      expect(details.close).toBeInstanceOf(Function)
      expect(details.isOpen).toBeInstanceOf(Function)

      // Check structure
      expect(details.element.tagName).toBe('DETAILS')
      expect(details.element.classList.contains('public-good-details')).toBe(true)
      
      const summary = details.element.querySelector('.public-good-details__summary')
      expect(summary).toBeTruthy()
      
      const content = details.element.querySelector('.public-good-details__text')
      expect(content).toBeTruthy()
      expect(content?.textContent).toBe('This is the hidden content')
    })

    it('should create details component with open state', () => {
      const details = createDetails({
        summaryText: 'Already expanded',
        content: 'Visible content',
        open: true
      })

      expect(details.element.open).toBe(true)
      expect(details.isOpen()).toBe(true)
    })

    it('should create details with custom classes', () => {
      const details = createDetails({
        summaryText: 'Custom styled',
        content: 'Content',
        classes: 'custom-details',
        summaryClasses: 'custom-summary',
        contentClasses: 'custom-content'
      })

      expect(details.element.classList.contains('custom-details')).toBe(true)
      
      const summary = details.element.querySelector('.public-good-details__summary')
      expect(summary?.classList.contains('custom-summary')).toBe(true)
      
      const content = details.element.querySelector('.public-good-details__text')
      expect(content?.classList.contains('custom-content')).toBe(true)
    })

    it('should create details with custom attributes', () => {
      const details = createDetails({
        summaryText: 'With attributes',
        content: 'Content',
        attributes: {
          'data-test': 'details-value',
          'aria-label': 'Custom details'
        },
        summaryAttributes: {
          'data-summary': 'summary-value'
        },
        contentAttributes: {
          'data-content': 'content-value'
        }
      })

      expect(details.element.getAttribute('data-test')).toBe('details-value')
      expect(details.element.getAttribute('aria-label')).toBe('Custom details')
      
      const summary = details.element.querySelector('.public-good-details__summary')
      expect(summary?.getAttribute('data-summary')).toBe('summary-value')
      
      const content = details.element.querySelector('.public-good-details__text')
      expect(content?.getAttribute('data-content')).toBe('content-value')
    })

    it('should handle HTML content correctly', () => {
      const htmlContent = '<p>This is <strong>HTML</strong> content</p><ul><li>Item 1</li><li>Item 2</li></ul>'
      const details = createDetails({
        summaryText: 'HTML content',
        content: htmlContent
      })

      const content = details.element.querySelector('.public-good-details__text')
      expect(content?.innerHTML).toBe(htmlContent)
      expect(content?.querySelector('strong')?.textContent).toBe('HTML')
      expect(content?.querySelectorAll('li')).toHaveLength(2)
    })

    it('should emit toggle events', () => {
      const details = createDetails({
        summaryText: 'Toggle test',
        content: 'Content'
      })

      const eventSpy = vi.fn()
      details.element.addEventListener('public-good:details:toggle', eventSpy)

      details.toggle()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.isOpen).toBe(true)
      expect(eventDetail.summaryText).toBe('Toggle test')
    })

    it('should handle keyboard interaction', () => {
      const details = createDetails({
        summaryText: 'Keyboard test',
        content: 'Content'
      })
      document.body.appendChild(details.element)

      const summary = details.element.querySelector('.public-good-details__summary') as HTMLElement

      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault')
      summary.dispatchEvent(enterEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(details.isOpen()).toBe(true)

      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      const spacePreventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault')
      summary.dispatchEvent(spaceEvent)

      expect(spacePreventDefaultSpy).toHaveBeenCalled()
      expect(details.isOpen()).toBe(false)
    })

    it('should set aria-expanded correctly', () => {
      const details = createDetails({
        summaryText: 'ARIA test',
        content: 'Content'
      })

      const content = details.element.querySelector('.public-good-details__text')
      expect(content?.getAttribute('aria-expanded')).toBe('false')

      details.open()
      expect(content?.getAttribute('aria-expanded')).toBe('true')

      details.close()
      expect(content?.getAttribute('aria-expanded')).toBe('false')
    })

    it('should handle programmatic open/close/toggle', () => {
      const details = createDetails({
        summaryText: 'API test',
        content: 'Content'
      })

      // Initially closed
      expect(details.isOpen()).toBe(false)

      // Open programmatically
      details.open()
      expect(details.isOpen()).toBe(true)
      expect(details.element.open).toBe(true)

      // Close programmatically
      details.close()
      expect(details.isOpen()).toBe(false)
      expect(details.element.open).toBe(false)

      // Toggle programmatically
      details.toggle()
      expect(details.isOpen()).toBe(true)

      details.toggle()
      expect(details.isOpen()).toBe(false)
    })

    it('should update summary text dynamically', () => {
      const details = createDetails({
        summaryText: 'Original text',
        content: 'Content'
      })

      const summaryText = details.element.querySelector('.public-good-details__summary-text')
      expect(summaryText?.textContent).toBe('Original text')

      details.setSummaryText('Updated text')
      expect(summaryText?.textContent).toBe('Updated text')
      expect(details.config.summaryText).toBe('Updated text')
    })

    it('should update content dynamically', () => {
      const details = createDetails({
        summaryText: 'Summary',
        content: 'Original content'
      })

      const content = details.element.querySelector('.public-good-details__text')
      expect(content?.innerHTML).toBe('Original content')

      details.setContent('<p>Updated <em>content</em></p>')
      expect(content?.innerHTML).toBe('<p>Updated <em>content</em></p>')
      expect(details.config.content).toBe('<p>Updated <em>content</em></p>')
    })

    it('should prevent multiple open calls from triggering events', () => {
      const details = createDetails({
        summaryText: 'Event test',
        content: 'Content'
      })

      const eventSpy = vi.fn()
      details.element.addEventListener('public-good:details:toggle', eventSpy)

      details.open()
      expect(eventSpy).toHaveBeenCalledTimes(1)

      // Second open call should not trigger event
      details.open()
      expect(eventSpy).toHaveBeenCalledTimes(1)
    })

    it('should prevent multiple close calls from triggering events', () => {
      const details = createDetails({
        summaryText: 'Event test',
        content: 'Content',
        open: true
      })

      const eventSpy = vi.fn()
      details.element.addEventListener('public-good:details:toggle', eventSpy)

      details.close()
      expect(eventSpy).toHaveBeenCalledTimes(1)

      // Second close call should not trigger event
      details.close()
      expect(eventSpy).toHaveBeenCalledTimes(1)
    })

    it('should clean up when destroyed', () => {
      const details = createDetails({
        summaryText: 'Destroy test',
        content: 'Content'
      })
      document.body.appendChild(details.element)

      expect(document.querySelector('.public-good-details')).toBeTruthy()

      details.destroy()
      expect(document.querySelector('.public-good-details')).toBeFalsy()
    })
  })

  describe('initializeDetails', () => {
    it('should initialize details from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-details 
             data-summary-text="Click to expand"
             data-content="Hidden content">
        </div>
      `

      const detailsComponents = initializeDetails()

      expect(detailsComponents).toHaveLength(1)
      
      const detailsElement = document.querySelector('.public-good-details')
      expect(detailsElement).toBeTruthy()
      
      const summary = detailsElement?.querySelector('.public-good-details__summary-text')
      expect(summary?.textContent).toBe('Click to expand')
      
      const content = detailsElement?.querySelector('.public-good-details__text')
      expect(content?.textContent).toBe('Hidden content')
    })

    it('should initialize details with all configuration options', () => {
      document.body.innerHTML = `
        <div data-public-good-details 
             data-id="test-details"
             data-summary-text="Full config test"
             data-content="<p>HTML content</p>"
             data-open="true"
             data-classes="custom-class"
             data-summary-classes="custom-summary"
             data-content-classes="custom-content"
             data-polyfill="true">
        </div>
      `

      const detailsComponents = initializeDetails()

      expect(detailsComponents).toHaveLength(1)
      
      const component = detailsComponents[0]!
      expect(component.config.summaryText).toBe('Full config test')
      expect(component.config.open).toBe(true)
      expect(component.config.classes).toBe('custom-class')
      expect(component.config.summaryClasses).toBe('custom-summary')
      expect(component.config.contentClasses).toBe('custom-content')
      expect(component.config.polyfill).toBe(true)
      expect(component.element.id).toBe('test-details')
      expect(component.isOpen()).toBe(true)
    })

    it('should use existing innerHTML as content when data-content is not provided', () => {
      document.body.innerHTML = `
        <div data-public-good-details 
             data-summary-text="Existing content">
          <p>This is existing content</p>
          <ul><li>Item 1</li><li>Item 2</li></ul>
        </div>
      `

      const detailsComponents = initializeDetails()

      expect(detailsComponents).toHaveLength(1)
      
      const content = document.querySelector('.public-good-details__text')
      expect(content?.innerHTML).toContain('This is existing content')
      expect(content?.querySelectorAll('li')).toHaveLength(2)
    })

    it('should handle missing summary text gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-details 
             data-content="Content without summary">
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const detailsComponents = initializeDetails()

      expect(detailsComponents).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Details element missing required data-summary-text attribute')
      
      consoleSpy.mockRestore()
    })

    it('should handle initialization errors gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-details 
             data-summary-text="Error test">
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Remove the element during processing to cause error
      const elements = document.querySelectorAll('[data-public-good-details]')
      elements.forEach(element => {
        element.remove()
      })

      const detailsComponents = initializeDetails()

      expect(detailsComponents).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create simple details with correct defaults', () => {
      const details = createSimpleDetails('Simple summary', 'Simple content')

      expect(details.config.summaryText).toBe('Simple summary')
      expect(details.config.content).toBe('Simple content')
      
      const summary = details.element.querySelector('.public-good-details__summary-text')
      expect(summary?.textContent).toBe('Simple summary')
      
      const content = details.element.querySelector('.public-good-details__text')
      expect(content?.textContent).toBe('Simple content')
    })

    it('should create details with HTML content', () => {
      const htmlContent = '<div><h3>Title</h3><p>Paragraph</p></div>'
      const details = createDetailsWithHTML('HTML summary', htmlContent)

      expect(details.config.content).toBe(htmlContent)
      
      const content = details.element.querySelector('.public-good-details__text')
      expect(content?.innerHTML).toBe(htmlContent)
      expect(content?.querySelector('h3')?.textContent).toBe('Title')
    })

    it('should accept additional options in helper functions', () => {
      const details = createSimpleDetails('Summary', 'Content', {
        open: true,
        classes: 'helper-class'
      })

      expect(details.isOpen()).toBe(true)
      expect(details.element.classList.contains('helper-class')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      const details = createDetails({
        summaryText: 'Accessible summary',
        content: 'Accessible content'
      })

      expect(details.element.tagName).toBe('DETAILS')
      
      const summary = details.element.querySelector('summary')
      expect(summary?.tagName).toBe('SUMMARY')
      expect(summary?.classList.contains('public-good-details__summary')).toBe(true)
    })

    it('should maintain focus management', () => {
      const details = createDetails({
        summaryText: 'Focus test',
        content: 'Content'
      })
      document.body.appendChild(details.element)

      const summary = details.element.querySelector('summary') as HTMLElement
      summary.focus()
      
      expect(document.activeElement).toBe(summary)
    })

    it('should handle aria-expanded state changes', () => {
      const details = createDetails({
        summaryText: 'ARIA test',
        content: 'Content'
      })

      const content = details.element.querySelector('.public-good-details__text')
      
      // Initially collapsed
      expect(content?.getAttribute('aria-expanded')).toBe('false')

      // Open and check expanded state
      details.open()
      expect(content?.getAttribute('aria-expanded')).toBe('true')

      // Close and check collapsed state
      details.close()
      expect(content?.getAttribute('aria-expanded')).toBe('false')
    })

    it('should support keyboard navigation', () => {
      const details = createDetails({
        summaryText: 'Keyboard test',
        content: 'Content'
      })
      document.body.appendChild(details.element)

      const summary = details.element.querySelector('summary') as HTMLElement

      // Should be focusable
      summary.focus()
      expect(document.activeElement).toBe(summary)

      // Enter key should toggle
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      summary.dispatchEvent(enterEvent)
      expect(details.isOpen()).toBe(true)

      // Space key should toggle
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      summary.dispatchEvent(spaceEvent)
      expect(details.isOpen()).toBe(false)
    })
  })

  describe('polyfill functionality', () => {
    it('should detect native details support', async () => {
      // In a modern browser environment like JSDOM, details is supported
      // This test ensures the polyfill check works correctly
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Create a test element to check support
      const testDetails = document.createElement('details')
      const isSupported = 'open' in testDetails
      
      await loadDetailsPolyfill()

      // In a modern environment, polyfill should not load
      if (isSupported) {
        expect(consoleSpy).not.toHaveBeenCalled()
      } else {
        expect(consoleSpy).toHaveBeenCalledWith('Loading details polyfill for legacy browser support')
      }
      
      consoleSpy.mockRestore()
    })

    it('should initialize with polyfill option', async () => {
      document.body.innerHTML = `
        <div data-public-good-details 
             data-summary-text="Polyfill test"
             data-content="Content">
        </div>
      `

      const detailsComponents = await initAllDetails({ polyfill: true })

      expect(detailsComponents).toHaveLength(1)
      expect(detailsComponents[0]!.config.summaryText).toBe('Polyfill test')
    })
  })

  describe('event handling', () => {
    it('should handle native toggle events', () => {
      const details = createDetails({
        summaryText: 'Native toggle test',
        content: 'Content'
      })

      const eventSpy = vi.fn()
      details.element.addEventListener('public-good:details:toggle', eventSpy)

      // Simulate native toggle event
      const toggleEvent = new Event('toggle')
      details.element.dispatchEvent(toggleEvent)

      expect(eventSpy).toHaveBeenCalled()
    })

    it('should not interfere with other keyboard events', () => {
      const details = createDetails({
        summaryText: 'Keyboard test',
        content: 'Content'
      })
      document.body.appendChild(details.element)

      const summary = details.element.querySelector('summary') as HTMLElement

      // Test unhandled key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault')
      summary.dispatchEvent(tabEvent)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
      expect(details.isOpen()).toBe(false)
    })
  })
})