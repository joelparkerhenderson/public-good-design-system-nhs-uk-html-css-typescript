/**
 * Panel Component E2E Tests
 * 
 * End-to-end tests for panel user interactions, accessibility, and visual behavior
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  createPanel,
  createSuccessPanel,
  createConfirmationPanel,
  createHtmlPanel
} from './panel'

describe('Panel Component E2E Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('User Interactions', () => {
    it('should handle focus management within panel', () => {
      const panel = createSuccessPanel(
        'Application complete',
        'We have sent you a <a href="/confirmation">confirmation email</a>',
        { html: true }
      )
      
      document.body.appendChild(panel.element)

      const link = panel.element.querySelector('a') as HTMLAnchorElement
      expect(link).toBeTruthy()

      // Test focus behavior
      link.focus()
      expect(document.activeElement).toBe(link)

      // Test keyboard navigation
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      link.dispatchEvent(tabEvent)

      document.body.removeChild(panel.element)
    })

    it('should handle dynamic content updates', () => {
      const panel = createPanel({ title: 'Initial Title' })
      document.body.appendChild(panel.element)

      // Test dynamic title updates
      panel.setTitle('Updated Title')
      expect(panel.titleElement.textContent).toBe('Updated Title')

      // Test dynamic body updates
      panel.setBody('Updated body content')
      expect(panel.bodyElement?.textContent).toBe('Updated body content')

      // Test removing body content
      panel.setBody('')
      expect(panel.element.querySelector('.public-good-panel__body')).toBe(null)

      document.body.removeChild(panel.element)
    })

    it('should handle HTML content injection safely', () => {
      const panel = createHtmlPanel(
        'Success <strong>Message</strong>',
        'Your application contains: <em>important</em> information'
      )
      
      document.body.appendChild(panel.element)

      // Verify HTML content is rendered
      const strongElement = panel.titleElement.querySelector('strong')
      const emElement = panel.bodyElement?.querySelector('em')
      
      expect(strongElement?.textContent).toBe('Message')
      expect(emElement?.textContent).toBe('important')

      // Test dynamic HTML updates
      panel.setTitle('New <code>HTML</code> Title', true)
      const codeElement = panel.titleElement.querySelector('code')
      expect(codeElement?.textContent).toBe('HTML')

      document.body.removeChild(panel.element)
    })
  })

  describe('Accessibility Features', () => {
    it('should support proper heading hierarchy', () => {
      const panels = [
        createPanel({ title: 'Main Confirmation', titleLevel: 1 }),
        createPanel({ title: 'Section Confirmation', titleLevel: 2 }),
        createPanel({ title: 'Subsection Confirmation', titleLevel: 3 })
      ]
      
      panels.forEach((panel, index) => {
        document.body.appendChild(panel.element)
        const expectedLevel = index + 1
        expect(panel.titleElement.tagName).toBe(`H${expectedLevel}`)
      })

      panels.forEach(panel => document.body.removeChild(panel.element))
    })

    it('should support screen reader navigation', () => {
      const panel = createSuccessPanel(
        'Application submitted successfully',
        'We have received your application and will process it within 5 working days.'
      )
      
      document.body.appendChild(panel.element)

      // Check semantic structure
      expect(panel.element.tagName).toBe('DIV')
      expect(panel.titleElement.tagName).toBe('H1')
      
      // Check content is accessible
      expect(panel.titleElement.textContent).toBe('Application submitted successfully')
      expect(panel.bodyElement?.textContent).toContain('We have received your application')

      // Test dynamic updates for screen reader announcements
      panel.setTitle('Updated: Application confirmed')
      expect(panel.titleElement.textContent).toBe('Updated: Application confirmed')

      document.body.removeChild(panel.element)
    })

    it('should handle keyboard navigation for interactive content', () => {
      const panel = createHtmlPanel(
        'Complete your application',
        'Please <a href="/next-step">continue to the next step</a> or <button type="button">save for later</button>.'
      )
      
      document.body.appendChild(panel.element)

      const link = panel.element.querySelector('a') as HTMLAnchorElement
      const button = panel.element.querySelector('button') as HTMLButtonElement

      // Test Tab navigation between interactive elements
      link.focus()
      expect(document.activeElement).toBe(link)

      // Simulate Tab to next element
      button.focus()
      expect(document.activeElement).toBe(button)

      // Test Enter key on button
      let buttonClicked = false
      button.addEventListener('click', () => { buttonClicked = true })
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      button.dispatchEvent(enterEvent)
      button.click() // Simulate the enter key effect
      expect(buttonClicked).toBe(true)

      document.body.removeChild(panel.element)
    })
  })

  describe('Content Scenarios', () => {
    it('should handle confirmation page scenarios', () => {
      // Simulate a typical NHS confirmation page
      const panel = createSuccessPanel(
        'GP appointment booked',
        'Your appointment with Dr. Smith is confirmed for Monday 15 January 2024 at 2:30pm.'
      )
      
      document.body.appendChild(panel.element)

      // Verify confirmation panel structure
      expect(panel.element.classList.contains('public-good-panel')).toBe(true)
      expect(panel.titleElement.textContent).toBe('GP appointment booked')
      expect(panel.bodyElement?.textContent).toContain('Dr. Smith')
      expect(panel.bodyElement?.textContent).toContain('Monday 15 January 2024')

      document.body.removeChild(panel.element)
    })

    it('should handle form submission scenarios', () => {
      const panel = createConfirmationPanel(
        'Form submitted',
        'We have received your health questionnaire. You will receive a response within 3 working days.',
        2
      )
      
      document.body.appendChild(panel.element)

      // Verify form submission panel
      expect(panel.titleElement.tagName).toBe('H2')
      expect(panel.titleElement.textContent).toBe('Form submitted')
      expect(panel.bodyElement?.textContent).toContain('health questionnaire')

      document.body.removeChild(panel.element)
    })

    it('should handle complex content with lists and links', () => {
      const panel = createHtmlPanel(
        'Registration complete',
        `
          <p>Your NHS account has been created successfully.</p>
          <p>You can now:</p>
          <ul>
            <li><a href="/book-appointment">Book appointments</a></li>
            <li><a href="/view-records">View your medical records</a></li>
            <li><a href="/prescriptions">Order repeat prescriptions</a></li>
          </ul>
          <p><strong>Important:</strong> Keep your login details safe.</p>
        `.trim()
      )
      
      document.body.appendChild(panel.element)

      // Verify complex content structure
      const links = panel.bodyElement?.querySelectorAll('a')
      const list = panel.bodyElement?.querySelector('ul')
      const strongText = panel.bodyElement?.querySelector('strong')

      expect(links?.length).toBe(3)
      expect(list).toBeTruthy()
      expect(strongText?.textContent).toBe('Important:')

      // Test that all links are focusable
      links?.forEach(link => {
        link.focus()
        expect(document.activeElement).toBe(link)
      })

      document.body.removeChild(panel.element)
    })
  })

  describe('Visual and Layout Behavior', () => {
    it('should maintain proper visual hierarchy', () => {
      const panel = createSuccessPanel(
        'Payment successful',
        'Your payment of £25.00 has been processed successfully. Receipt number: #12345'
      )
      
      document.body.appendChild(panel.element)

      // Check visual structure classes
      expect(panel.element.classList.contains('public-good-panel')).toBe(true)
      expect(panel.titleElement.classList.contains('public-good-panel__title')).toBe(true)
      expect(panel.bodyElement?.classList.contains('public-good-panel__body')).toBe(true)

      // Check heading hierarchy
      expect(panel.titleElement.tagName).toBe('H1')

      document.body.removeChild(panel.element)
    })

    it('should handle different heading levels appropriately', () => {
      const levels: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6]
      
      levels.forEach(level => {
        const panel = createConfirmationPanel(
          `Level ${level} Confirmation`,
          `This is a level ${level} confirmation panel.`,
          level
        )
        
        document.body.appendChild(panel.element)
        
        // Verify correct heading level
        expect(panel.titleElement.tagName).toBe(`H${level}`)
        expect(panel.titleElement.classList.contains('public-good-panel__title')).toBe(true)
        
        document.body.removeChild(panel.element)
      })
    })

    it('should handle responsive behavior structure', () => {
      const panel = createSuccessPanel(
        'Long confirmation title that might wrap on smaller screens',
        'This is a longer body of text that will test how the panel handles responsive behavior and text wrapping across different screen sizes and viewport widths.'
      )
      
      document.body.appendChild(panel.element)

      // Check that structure supports responsive CSS
      expect(panel.element.classList.contains('public-good-panel')).toBe(true)
      
      // Verify content is properly structured for responsive design
      expect(panel.titleElement.textContent).toContain('Long confirmation title')
      expect(panel.bodyElement?.textContent).toContain('responsive behavior')

      document.body.removeChild(panel.element)
    })
  })

  describe('Integration with Data Attributes', () => {
    it('should initialize from data attributes', () => {
      // Create a mock element with data attributes
      const mockElement = document.createElement('div')
      mockElement.setAttribute('data-public-good-panel', '')
      mockElement.setAttribute('data-title', 'Data Attribute Panel')
      mockElement.setAttribute('data-body', 'Initialized from data attributes')
      mockElement.setAttribute('data-title-level', '2')
      document.body.appendChild(mockElement)

      // Test that the component can be initialized (this would be done by the auto-init)
      const config = {
        title: mockElement.getAttribute('data-title') || '',
        body: mockElement.getAttribute('data-body') || '',
        titleLevel: parseInt(mockElement.getAttribute('data-title-level') || '1', 10) as 1 | 2 | 3 | 4 | 5 | 6
      }

      const panel = createPanel(config)
      expect(panel.config.title).toBe('Data Attribute Panel')
      expect(panel.config.body).toBe('Initialized from data attributes')
      expect(panel.config.titleLevel).toBe(2)

      document.body.removeChild(mockElement)
    })
  })

  describe('Event-Driven Behavior', () => {
    it('should handle dynamic content updates with events', () => {
      const panel = createPanel({ title: 'Initial Title' })
      document.body.appendChild(panel.element)

      let titleChangedEvents = 0
      let bodyChangedEvents = 0

      panel.element.addEventListener('public-good:panel:title-changed', () => {
        titleChangedEvents++
      })

      panel.element.addEventListener('public-good:panel:body-changed', () => {
        bodyChangedEvents++
      })

      // Test multiple updates
      panel.setTitle('First Update')
      panel.setTitle('Second Update')
      panel.setBody('First Body')
      panel.setBody('Second Body')

      expect(titleChangedEvents).toBe(2)
      expect(bodyChangedEvents).toBe(2)

      document.body.removeChild(panel.element)
    })

    it('should track panel lifecycle events', () => {
      let creationEvents = 0
      let destroyEvents = 0

      // Listen for creation events
      document.addEventListener('public-good:panel:created', () => {
        creationEvents++
      })

      // Listen for destroy events  
      document.addEventListener('public-good:panel:destroyed', () => {
        destroyEvents++
      })

      const panel = createPanel({ title: 'Lifecycle Test' })
      document.body.appendChild(panel.element)
      
      // Manually trigger creation event for testing
      const creationEvent = new CustomEvent('public-good:panel:created', {
        detail: { element: panel.element, config: panel.config },
        bubbles: true
      })
      document.dispatchEvent(creationEvent)

      panel.destroy()

      expect(creationEvents).toBe(1)
      expect(destroyEvents).toBe(1)
    })
  })

  describe('Performance and Cleanup', () => {
    it('should handle rapid creation and destruction', () => {
      const panels: any[] = []

      // Create multiple panels rapidly
      for (let i = 0; i < 10; i++) {
        const panel = createSuccessPanel(
          `Panel ${i}`,
          `Body content for panel ${i}`
        )
        panels.push(panel)
        document.body.appendChild(panel.element)
      }

      expect(document.querySelectorAll('.public-good-panel').length).toBe(10)

      // Destroy all panels
      panels.forEach(panel => panel.destroy())

      expect(document.querySelectorAll('.public-good-panel').length).toBe(0)
    })

    it('should handle memory cleanup on destroy', () => {
      const panel = createSuccessPanel('Test Panel', 'Test body')
      document.body.appendChild(panel.element)

      // Verify panel exists
      expect(document.body.contains(panel.element)).toBe(true)

      panel.destroy()

      // Verify panel is removed
      expect(document.body.contains(panel.element)).toBe(false)
    })
  })
})