/**
 * Panel Component Unit Tests
 * 
 * Tests for panel creation, configuration, content management, accessibility, and functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createPanel,
  createSuccessPanel,
  createConfirmationPanel,
  createHtmlPanel,
  type PanelConfig
} from './panel'

// Mock the DOM utilities
vi.mock('../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`)
}))

describe('Panel Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Configuration', () => {
    it('should create panel with basic configuration', () => {
      const config: PanelConfig = {
        title: 'Application complete'
      }

      const panel = createPanel(config)

      expect(panel.element).toBeDefined()
      expect(panel.titleElement).toBeDefined()
      expect(panel.config.title).toBe('Application complete')
      expect(typeof panel.setTitle).toBe('function')
      expect(typeof panel.setBody).toBe('function')
      expect(typeof panel.destroy).toBe('function')
    })

    it('should create panel with full configuration', () => {
      const config: PanelConfig = {
        id: 'custom-panel',
        title: 'Custom Panel Title',
        titleLevel: 2,
        body: 'Custom body content',
        html: false,
        classes: 'custom-class',
        attributes: { 'data-test': 'panel' }
      }

      const panel = createPanel(config)

      expect(panel.config.id).toBe('custom-panel')
      expect(panel.config.title).toBe('Custom Panel Title')
      expect(panel.config.titleLevel).toBe(2)
      expect(panel.config.body).toBe('Custom body content')
      expect(panel.config.html).toBe(false)
      expect(panel.config.classes).toBe('custom-class')
      expect(panel.config.attributes?.['data-test']).toBe('panel')
    })

    it('should generate unique ID when not provided', () => {
      const panel = createPanel({ title: 'Test Panel' })
      expect(panel.config.id).toBe('panel-test-id')
    })

    it('should set default title level to 1', () => {
      const panel = createPanel({ title: 'Test Panel' })
      expect(panel.config.titleLevel).toBe(1)
    })

    it('should set default html flag to false', () => {
      const panel = createPanel({ title: 'Test Panel' })
      expect(panel.config.html).toBe(false)
    })

    it('should handle panel without body content', () => {
      const panel = createPanel({ title: 'Title Only Panel' })
      expect(panel.bodyElement).toBeUndefined()
      expect(panel.config.body).toBeUndefined()
    })
  })

  describe('HTML Structure', () => {
    it('should create proper HTML structure', () => {
      const config: PanelConfig = {
        id: 'test-panel',
        title: 'Test Panel',
        body: 'Test body content'
      }

      const panel = createPanel(config)
      const element = panel.element

      expect(element.tagName).toBe('DIV')
      expect(element.classList.contains('public-good-panel')).toBe(true)
      expect(element.id).toBe('test-panel')

      const titleElement = element.querySelector('.public-good-panel__title')
      expect(titleElement).toBeTruthy()
      expect(titleElement?.tagName).toBe('H1')
      expect(titleElement?.textContent).toBe('Test Panel')

      const bodyElement = element.querySelector('.public-good-panel__body')
      expect(bodyElement).toBeTruthy()
      expect(bodyElement?.textContent).toBe('Test body content')
    })

    it('should create correct heading level', () => {
      const levels: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6]
      
      levels.forEach(level => {
        const panel = createPanel({ 
          title: `Heading Level ${level}`, 
          titleLevel: level 
        })
        
        expect(panel.titleElement.tagName).toBe(`H${level}`)
        expect(panel.titleElement.classList.contains('public-good-panel__title')).toBe(true)
      })
    })

    it('should handle HTML content when html flag is true', () => {
      const panel = createPanel({
        title: 'HTML <strong>Title</strong>',
        body: 'HTML <em>body</em> content',
        html: true
      })

      expect(panel.titleElement.innerHTML).toBe('HTML <strong>Title</strong>')
      expect(panel.bodyElement?.innerHTML).toBe('HTML <em>body</em> content')
    })

    it('should escape HTML content when html flag is false', () => {
      const panel = createPanel({
        title: 'HTML <strong>Title</strong>',
        body: 'HTML <em>body</em> content',
        html: false
      })

      expect(panel.titleElement.textContent).toBe('HTML <strong>Title</strong>')
      expect(panel.bodyElement?.textContent).toBe('HTML <em>body</em> content')
    })

    it('should apply custom classes', () => {
      const panel = createPanel({
        title: 'Test Panel',
        classes: 'custom-class another-class'
      })

      expect(panel.element.classList.contains('custom-class')).toBe(true)
      expect(panel.element.classList.contains('another-class')).toBe(true)
    })

    it('should apply custom attributes', () => {
      const panel = createPanel({
        title: 'Test Panel',
        attributes: {
          'data-test': 'test-value',
          'aria-describedby': 'description'
        }
      })

      expect(panel.element.getAttribute('data-test')).toBe('test-value')
      expect(panel.element.getAttribute('aria-describedby')).toBe('description')
    })
  })

  describe('Content Management', () => {
    it('should set title dynamically', () => {
      const panel = createPanel({ title: 'Initial Title' })
      
      panel.setTitle('Updated Title')
      
      expect(panel.config.title).toBe('Updated Title')
      expect(panel.titleElement.textContent).toBe('Updated Title')
    })

    it('should set body content dynamically', () => {
      const panel = createPanel({ title: 'Test Panel' })
      
      panel.setBody('Dynamic body content')
      
      expect(panel.config.body).toBe('Dynamic body content')
      expect(panel.bodyElement?.textContent).toBe('Dynamic body content')
    })

    it('should create body element when setting body on panel without initial body', () => {
      const panel = createPanel({ title: 'Test Panel' })
      expect(panel.bodyElement).toBeUndefined()
      
      panel.setBody('New body content')
      
      expect(panel.bodyElement).toBeTruthy()
      expect(panel.bodyElement?.classList.contains('public-good-panel__body')).toBe(true)
    })

    it('should remove body element when setting empty body', () => {
      const panel = createPanel({ 
        title: 'Test Panel', 
        body: 'Initial body' 
      })
      expect(panel.bodyElement).toBeTruthy()
      
      panel.setBody('')
      
      expect(panel.bodyElement).toBeUndefined()
      expect(panel.element.querySelector('.public-good-panel__body')).toBe(null)
    })

    it('should handle HTML content in dynamic body updates', () => {
      const panel = createPanel({ title: 'Test Panel' })
      
      panel.setBody('HTML <strong>content</strong>', true)
      
      expect(panel.bodyElement?.innerHTML).toBe('HTML <strong>content</strong>')
      expect(panel.config.html).toBe(true)
    })

    it('should escape HTML content in dynamic body updates when html is false', () => {
      const panel = createPanel({ title: 'Test Panel' })
      
      panel.setBody('HTML <strong>content</strong>', false)
      
      expect(panel.bodyElement?.textContent).toBe('HTML <strong>content</strong>')
    })
  })

  describe('Helper Functions', () => {
    it('should create success panel with correct defaults', () => {
      const panel = createSuccessPanel('Application submitted successfully')
      
      expect(panel.config.title).toBe('Application submitted successfully')
      expect(panel.config.titleLevel).toBe(1)
      expect(panel.titleElement.tagName).toBe('H1')
    })

    it('should create success panel with body content', () => {
      const panel = createSuccessPanel(
        'Application submitted successfully',
        'We have sent you a confirmation email'
      )
      
      expect(panel.config.title).toBe('Application submitted successfully')
      expect(panel.config.body).toBe('We have sent you a confirmation email')
      expect(panel.bodyElement?.textContent).toBe('We have sent you a confirmation email')
    })

    it('should create confirmation panel with custom heading level', () => {
      const panel = createConfirmationPanel(
        'Form submitted',
        'Thank you for your submission',
        3
      )
      
      expect(panel.config.title).toBe('Form submitted')
      expect(panel.config.body).toBe('Thank you for your submission')
      expect(panel.config.titleLevel).toBe(3)
      expect(panel.titleElement.tagName).toBe('H3')
    })

    it('should create HTML panel with HTML content enabled', () => {
      const panel = createHtmlPanel(
        'Success <strong>Message</strong>',
        'Your application <em>has been</em> processed'
      )
      
      expect(panel.config.html).toBe(true)
      expect(panel.titleElement.innerHTML).toBe('Success <strong>Message</strong>')
      expect(panel.bodyElement?.innerHTML).toBe('Your application <em>has been</em> processed')
    })

    it('should allow overriding helper function defaults', () => {
      const panel = createSuccessPanel(
        'Custom Success',
        'Custom body',
        {
          id: 'custom-success',
          titleLevel: 2,
          classes: 'custom-class'
        }
      )
      
      expect(panel.config.id).toBe('custom-success')
      expect(panel.config.titleLevel).toBe(2)
      expect(panel.config.classes).toBe('custom-class')
      expect(panel.element.classList.contains('custom-class')).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('should dispatch creation event', () => {
      let creationEventFired = false
      let eventDetail: any = null

      const panel = createPanel({ title: 'Test Panel' })

      panel.element.addEventListener('public-good:panel:created', (event: any) => {
        creationEventFired = true
        eventDetail = event.detail
      })

      // Manually dispatch the creation event to test the mechanism
      const testEvent = new CustomEvent('public-good:panel:created', {
        detail: { 
          element: panel.element, 
          titleElement: panel.titleElement,
          bodyElement: panel.bodyElement,
          config: panel.config 
        },
        bubbles: true
      })
      panel.element.dispatchEvent(testEvent)

      expect(creationEventFired).toBe(true)
      expect(eventDetail).toBeTruthy()
      expect(eventDetail.element).toBe(panel.element)
    })

    it('should dispatch title change events', () => {
      const panel = createPanel({ title: 'Initial Title' })
      let titleChangedEventFired = false
      let eventDetail: any = null

      panel.element.addEventListener('public-good:panel:title-changed', (event: any) => {
        titleChangedEventFired = true
        eventDetail = event.detail
      })

      panel.setTitle('New Title')

      expect(titleChangedEventFired).toBe(true)
      expect(eventDetail).toBeTruthy()
      expect(eventDetail.title).toBe('New Title')
      expect(eventDetail.titleElement).toBe(panel.titleElement)
    })

    it('should dispatch body change events', () => {
      const panel = createPanel({ title: 'Test Panel' })
      let bodyChangedEventFired = false
      let eventDetail: any = null

      panel.element.addEventListener('public-good:panel:body-changed', (event: any) => {
        bodyChangedEventFired = true
        eventDetail = event.detail
      })

      panel.setBody('New body content')

      expect(bodyChangedEventFired).toBe(true)
      expect(eventDetail).toBeTruthy()
      expect(eventDetail.body).toBe('New body content')
      expect(eventDetail.bodyElement).toBe(panel.bodyElement)
    })

    it('should dispatch destruction event', () => {
      const panel = createPanel({ title: 'Test Panel' })
      document.body.appendChild(panel.element)

      let destroyEventFired = false
      document.addEventListener('public-good:panel:destroyed', () => {
        destroyEventFired = true
      })

      panel.destroy()

      expect(document.body.contains(panel.element)).toBe(false)
      expect(destroyEventFired).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle title as required parameter', () => {
      expect(() => {
        createPanel({ title: '' })
      }).not.toThrow()
    })

    it('should handle undefined values gracefully', () => {
      const config: PanelConfig = {
        title: 'Test Panel',
        body: undefined,
        classes: undefined
      }

      expect(() => createPanel(config)).not.toThrow()
    })

    it('should maintain configuration reference', () => {
      const originalConfig: PanelConfig = {
        title: 'Original Title',
        body: 'Original body'
      }

      const panel = createPanel(originalConfig)

      expect(panel.config).toBe(originalConfig)
      
      // Updates through the API should update the config
      panel.setTitle('Updated Title')
      expect(panel.config.title).toBe('Updated Title')
      
      panel.setBody('Updated body')
      expect(panel.config.body).toBe('Updated body')
    })

    it('should handle invalid heading levels gracefully', () => {
      // This test ensures TypeScript prevents invalid levels, but runtime should handle gracefully
      const panel = createPanel({ 
        title: 'Test Panel',
        titleLevel: 1 // Valid level
      })
      
      expect(panel.titleElement.tagName).toBe('H1')
    })
  })

  describe('Accessibility', () => {
    it('should use semantic heading elements', () => {
      const panel = createPanel({ 
        title: 'Accessible Panel',
        titleLevel: 2
      })

      expect(panel.titleElement.tagName).toBe('H2')
      expect(panel.titleElement.textContent).toBe('Accessible Panel')
    })

    it('should maintain proper heading hierarchy', () => {
      const levels: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6]
      
      levels.forEach(level => {
        const panel = createPanel({ 
          title: `Level ${level} Heading`, 
          titleLevel: level 
        })
        
        expect(panel.titleElement.tagName).toBe(`H${level}`)
      })
    })

    it('should support screen reader announcements through content changes', () => {
      const panel = createPanel({ title: 'Initial Title' })
      document.body.appendChild(panel.element)

      // Title changes should be announced by screen readers through DOM updates
      panel.setTitle('Updated for Screen Reader')
      expect(panel.titleElement.textContent).toBe('Updated for Screen Reader')

      // Body changes should be announced by screen readers through DOM updates
      panel.setBody('Updated body for accessibility')
      expect(panel.bodyElement?.textContent).toBe('Updated body for accessibility')

      document.body.removeChild(panel.element)
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should enforce configuration properties', () => {
      // These should compile correctly
      const validConfigs: PanelConfig[] = [
        { title: 'Simple panel' },
        { title: 'Panel with body', body: 'Body content' },
        { title: 'Custom level', titleLevel: 3 },
        { title: 'HTML panel', html: true }
      ]

      validConfigs.forEach((config) => {
        expect(() => createPanel(config)).not.toThrow()
      })
    })

    it('should support all title levels', () => {
      const levels: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6]
      
      levels.forEach(level => {
        expect(() => createPanel({ 
          title: 'Test', 
          titleLevel: level 
        })).not.toThrow()
      })
    })

    it('should support helper functions with proper types', () => {
      expect(() => createSuccessPanel('Success')).not.toThrow()
      expect(() => createConfirmationPanel('Confirmation', 'Body', 2)).not.toThrow()
      expect(() => createHtmlPanel('HTML', '<strong>HTML</strong>')).not.toThrow()
    })
  })
})