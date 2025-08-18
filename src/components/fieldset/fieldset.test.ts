/**
 * Fieldset Component Tests
 * Unit tests for the fieldset component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createFieldset, 
  initializeFieldsets,
  createSimpleFieldset,
  createPageHeadingFieldset,
  createFieldsetWithHTMLLegend,
  createAddressFieldset,
  createDateFieldset,
  groupFormElements,
  initAllFieldsets
} from './fieldset'

describe('Fieldset Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createFieldset', () => {
    it('should create a basic fieldset with default properties', () => {
      const fieldset = createFieldset({
        legend: { text: 'Personal Information' }
      })

      expect(fieldset.element).toBeDefined()
      expect(fieldset.legend).toBeDefined()
      expect(fieldset.config).toBeDefined()
      expect(fieldset.destroy).toBeInstanceOf(Function)
      expect(fieldset.setLegend).toBeInstanceOf(Function)
      expect(fieldset.setContent).toBeInstanceOf(Function)

      // Check structure
      expect(fieldset.element.tagName).toBe('FIELDSET')
      expect(fieldset.element.classList.contains('public-good-fieldset')).toBe(true)
      
      const legend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(legend).toBeTruthy()
      expect(legend?.textContent).toBe('Personal Information')
    })

    it('should create fieldset with HTML legend', () => {
      const fieldset = createFieldset({
        legend: { html: '<span>Contact <strong>details</strong></span>' }
      })

      const legend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(legend?.innerHTML).toBe('<span>Contact <strong>details</strong></span>')
    })

    it('should create fieldset with page heading legend', () => {
      const fieldset = createFieldset({
        legend: { 
          text: 'Main Heading',
          isPageHeading: true,
          headingLevel: 1
        }
      })

      const legend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(legend?.classList.contains('public-good-fieldset__legend--page-heading')).toBe(true)
      
      const heading = legend?.querySelector('.public-good-fieldset__heading')
      expect(heading?.tagName).toBe('H1')
      expect(heading?.textContent).toBe('Main Heading')
    })

    it('should create fieldset with different heading levels', () => {
      const fieldset = createFieldset({
        legend: { 
          text: 'Section Heading',
          isPageHeading: true,
          headingLevel: 3
        }
      })

      const heading = fieldset.element.querySelector('.public-good-fieldset__heading')
      expect(heading?.tagName).toBe('H3')
    })

    it('should create fieldset with custom classes', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' },
        classes: 'custom-fieldset'
      })

      expect(fieldset.element.classList.contains('custom-fieldset')).toBe(true)
    })

    it('should create fieldset with custom attributes', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' },
        attributes: {
          'data-test': 'fieldset-value',
          'aria-label': 'Custom fieldset'
        }
      })

      expect(fieldset.element.getAttribute('data-test')).toBe('fieldset-value')
      expect(fieldset.element.getAttribute('aria-label')).toBe('Custom fieldset')
    })

    it('should create fieldset with legend classes and attributes', () => {
      const fieldset = createFieldset({
        legend: { 
          text: 'Test Legend',
          classes: 'custom-legend',
          attributes: {
            'data-legend': 'legend-value'
          }
        }
      })

      const legend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(legend?.classList.contains('custom-legend')).toBe(true)
      expect(legend?.getAttribute('data-legend')).toBe('legend-value')
    })

    it('should create fieldset with initial content', () => {
      const content = '<div class="test-content">Initial content</div>'
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' },
        content
      })

      const contentDiv = fieldset.element.querySelector('.public-good-fieldset__content')
      expect(contentDiv).toBeTruthy()
      expect(contentDiv?.innerHTML).toBe(content)
    })

    it('should handle role attribute', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' },
        role: 'group'
      })

      expect(fieldset.element.getAttribute('role')).toBe('group')
    })

    it('should emit events when legend changes', () => {
      const fieldset = createFieldset({
        legend: { text: 'Original Legend' }
      })

      const eventSpy = vi.fn()
      fieldset.element.addEventListener('public-good:fieldset:legend-changed', eventSpy)

      fieldset.setLegend({ text: 'Updated Legend' })

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.legend.text).toBe('Updated Legend')
    })

    it('should emit events when content changes', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' }
      })

      const eventSpy = vi.fn()
      fieldset.element.addEventListener('public-good:fieldset:content-changed', eventSpy)

      fieldset.setContent('<p>New content</p>')

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.content).toBe('<p>New content</p>')
    })

    it('should handle content addition', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' }
      })

      const addEventSpy = vi.fn()
      fieldset.element.addEventListener('public-good:fieldset:content-added', addEventSpy)

      fieldset.addContent('<p>First paragraph</p>')
      fieldset.addContent('<p>Second paragraph</p>')

      expect(addEventSpy).toHaveBeenCalledTimes(2)
      
      const contentDiv = fieldset.element.querySelector('.public-good-fieldset__content')
      expect(contentDiv?.innerHTML).toBe('<p>First paragraph</p><p>Second paragraph</p>')
    })

    it('should handle HTML element addition', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' }
      })

      const element = document.createElement('div')
      element.textContent = 'Element content'
      element.className = 'test-element'

      fieldset.addContent(element)

      const contentDiv = fieldset.element.querySelector('.public-good-fieldset__content')
      const addedElement = contentDiv?.querySelector('.test-element')
      expect(addedElement).toBeTruthy()
      expect(addedElement?.textContent).toBe('Element content')
    })

    it('should handle content clearing', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' },
        content: '<p>Initial content</p>'
      })

      const clearEventSpy = vi.fn()
      fieldset.element.addEventListener('public-good:fieldset:content-cleared', clearEventSpy)

      fieldset.clearContent()

      expect(clearEventSpy).toHaveBeenCalled()
      
      const contentDiv = fieldset.element.querySelector('.public-good-fieldset__content')
      expect(contentDiv?.innerHTML).toBe('')
    })

    it('should get form elements within fieldset', () => {
      const fieldset = createFieldset({
        legend: { text: 'Form Elements' },
        content: `
          <input type="text" id="text-input" />
          <textarea id="textarea"></textarea>
          <select id="select">
            <option>Option 1</option>
          </select>
          <button type="button">Button</button>
          <div>Not a form element</div>
        `
      })

      const formElements = fieldset.getFormElements()
      expect(formElements).toHaveLength(4)
      expect(formElements[0]!.tagName).toBe('INPUT')
      expect(formElements[1]!.tagName).toBe('TEXTAREA')
      expect(formElements[2]!.tagName).toBe('SELECT')
      expect(formElements[3]!.tagName).toBe('BUTTON')
    })

    it('should handle disabled state', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' }
      })

      const disabledEventSpy = vi.fn()
      fieldset.element.addEventListener('public-good:fieldset:disabled-changed', disabledEventSpy)

      expect(fieldset.isDisabled()).toBe(false)

      fieldset.setDisabled(true)
      expect(fieldset.isDisabled()).toBe(true)
      expect(fieldset.element.disabled).toBe(true)
      expect(disabledEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ disabled: true })
        })
      )

      fieldset.setDisabled(false)
      expect(fieldset.isDisabled()).toBe(false)
      expect(fieldset.element.disabled).toBe(false)
    })

    it('should clean up when destroyed', () => {
      const fieldset = createFieldset({
        legend: { text: 'Test Legend' }
      })
      document.body.appendChild(fieldset.element)

      expect(document.querySelector('.public-good-fieldset')).toBeTruthy()

      fieldset.destroy()
      expect(document.querySelector('.public-good-fieldset')).toBeFalsy()
    })
  })

  describe('initializeFieldsets', () => {
    it('should initialize fieldsets from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-fieldset 
             data-legend-text="Contact Information">
          <input type="email" placeholder="Email" />
        </div>
      `

      const components = initializeFieldsets()

      expect(components).toHaveLength(1)
      
      const fieldsetElement = document.querySelector('.public-good-fieldset')
      expect(fieldsetElement).toBeTruthy()
      
      const legend = fieldsetElement?.querySelector('.public-good-fieldset__legend')
      expect(legend?.textContent).toBe('Contact Information')
    })

    it('should initialize fieldsets with HTML legend', () => {
      document.body.innerHTML = `
        <div data-public-good-fieldset 
             data-legend-html="<span>Contact <strong>Information</strong></span>">
          <input type="email" placeholder="Email" />
        </div>
      `

      const components = initializeFieldsets()

      expect(components).toHaveLength(1)
      
      const legend = document.querySelector('.public-good-fieldset__legend')
      expect(legend?.innerHTML).toBe('<span>Contact <strong>Information</strong></span>')
    })

    it('should initialize fieldsets with page heading', () => {
      document.body.innerHTML = `
        <div data-public-good-fieldset 
             data-legend-text="Main Section"
             data-legend-is-page-heading="true"
             data-legend-heading-level="2">
          <input type="text" />
        </div>
      `

      const components = initializeFieldsets()

      expect(components).toHaveLength(1)
      expect(components[0]!.config.legend.isPageHeading).toBe(true)
      expect(components[0]!.config.legend.headingLevel).toBe(2)
      
      const heading = document.querySelector('.public-good-fieldset__heading')
      expect(heading?.tagName).toBe('H2')
    })

    it('should initialize fieldsets with all configuration options', () => {
      document.body.innerHTML = `
        <div data-public-good-fieldset 
             data-id="test-fieldset"
             data-legend-text="Full Config"
             data-legend-classes="custom-legend"
             data-classes="custom-fieldset"
             data-role="group">
          <p>Content here</p>
        </div>
      `

      const components = initializeFieldsets()

      expect(components).toHaveLength(1)
      
      const component = components[0]!
      expect(component.element.id).toBe('test-fieldset')
      expect(component.element.classList.contains('custom-fieldset')).toBe(true)
      expect(component.element.getAttribute('role')).toBe('group')
      expect(component.legend.classList.contains('custom-legend')).toBe(true)
    })

    it('should handle missing legend gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-fieldset>
          <input type="text" />
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const components = initializeFieldsets()

      expect(components).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith('Fieldset element missing required data-legend-text or data-legend-html attribute')
      
      consoleSpy.mockRestore()
    })

    it('should handle initialization errors gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-fieldset 
             data-legend-text="Test">
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Remove the element during processing to cause error
      const elements = document.querySelectorAll('[data-public-good-fieldset]')
      elements.forEach(element => {
        element.remove()
      })

      const components = initializeFieldsets()

      expect(components).toHaveLength(0)
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create simple fieldset', () => {
      const fieldset = createSimpleFieldset('Simple Legend', '<p>Simple content</p>')

      expect(fieldset.config.legend.text).toBe('Simple Legend')
      expect(fieldset.config.content).toBe('<p>Simple content</p>')
      
      const legend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(legend?.textContent).toBe('Simple Legend')
    })

    it('should create page heading fieldset', () => {
      const fieldset = createPageHeadingFieldset('Page Heading', 2, '<p>Content</p>')

      expect(fieldset.config.legend.text).toBe('Page Heading')
      expect(fieldset.config.legend.isPageHeading).toBe(true)
      expect(fieldset.config.legend.headingLevel).toBe(2)
      
      const heading = fieldset.element.querySelector('.public-good-fieldset__heading')
      expect(heading?.tagName).toBe('H2')
      expect(heading?.textContent).toBe('Page Heading')
    })

    it('should create fieldset with HTML legend', () => {
      const htmlLegend = '<span>HTML <strong>Legend</strong></span>'
      const fieldset = createFieldsetWithHTMLLegend(htmlLegend, '<p>Content</p>')

      expect(fieldset.config.legend.html).toBe(htmlLegend)
      
      const legend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(legend?.innerHTML).toBe(htmlLegend)
    })

    it('should create address fieldset', () => {
      const fieldset = createAddressFieldset()

      expect(fieldset.config.legend.text).toBe('Address')
      
      // Check that it contains address fields
      const addressLine1 = fieldset.element.querySelector('#address-line-1')
      const postcode = fieldset.element.querySelector('#address-postcode')
      expect(addressLine1).toBeTruthy()
      expect(postcode).toBeTruthy()
    })

    it('should create date fieldset', () => {
      const fieldset = createDateFieldset('Birth Date')

      expect(fieldset.config.legend.text).toBe('Birth Date')
      
      // Check that it contains date fields
      const dayField = fieldset.element.querySelector('#date-day')
      const monthField = fieldset.element.querySelector('#date-month')
      const yearField = fieldset.element.querySelector('#date-year')
      expect(dayField).toBeTruthy()
      expect(monthField).toBeTruthy()
      expect(yearField).toBeTruthy()
    })

    it('should group form elements', () => {
      const input1 = document.createElement('input')
      input1.type = 'text'
      input1.placeholder = 'First input'
      
      const input2 = document.createElement('input')
      input2.type = 'email'
      input2.placeholder = 'Email input'
      
      const fieldset = groupFormElements('Grouped Elements', [input1, input2])

      expect(fieldset.config.legend.text).toBe('Grouped Elements')
      expect(fieldset.getFormElements()).toHaveLength(2)
    })

    it('should accept additional options in helper functions', () => {
      const fieldset = createSimpleFieldset('Legend', '<p>Content</p>', {
        classes: 'helper-class',
        role: 'group'
      })

      expect(fieldset.element.classList.contains('helper-class')).toBe(true)
      expect(fieldset.element.getAttribute('role')).toBe('group')
    })
  })

  describe('accessibility', () => {
    it('should have proper semantic structure', () => {
      const fieldset = createFieldset({
        legend: { text: 'Accessible Fieldset' }
      })

      expect(fieldset.element.tagName).toBe('FIELDSET')
      
      const legend = fieldset.element.querySelector('legend')
      expect(legend?.tagName).toBe('LEGEND')
      expect(legend?.classList.contains('public-good-fieldset__legend')).toBe(true)
    })

    it('should support proper heading hierarchy', () => {
      const fieldset = createFieldset({
        legend: { 
          text: 'Section Heading',
          isPageHeading: true,
          headingLevel: 3
        }
      })

      const heading = fieldset.element.querySelector('h3')
      expect(heading).toBeTruthy()
      expect(heading?.classList.contains('public-good-fieldset__heading')).toBe(true)
    })

    it('should group related form elements', () => {
      const fieldset = createFieldset({
        legend: { text: 'Contact Details' },
        content: `
          <div class="public-good-form-group">
            <label for="name">Name</label>
            <input type="text" id="name" />
          </div>
          <div class="public-good-form-group">
            <label for="email">Email</label>
            <input type="email" id="email" />
          </div>
        `
      })

      const formElements = fieldset.getFormElements()
      expect(formElements).toHaveLength(2)
      
      // Check that the fieldset groups the related inputs
      const inputs = fieldset.element.querySelectorAll('input')
      expect(inputs).toHaveLength(2)
    })
  })

  describe('dynamic content management', () => {
    it('should update legend dynamically', () => {
      const fieldset = createFieldset({
        legend: { text: 'Original Legend' }
      })

      const originalLegend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(originalLegend?.textContent).toBe('Original Legend')

      fieldset.setLegend({ 
        text: 'Updated Legend',
        isPageHeading: true,
        headingLevel: 2
      })

      const updatedLegend = fieldset.element.querySelector('.public-good-fieldset__legend')
      expect(updatedLegend?.classList.contains('public-good-fieldset__legend--page-heading')).toBe(true)
      
      const heading = updatedLegend?.querySelector('.public-good-fieldset__heading')
      expect(heading?.tagName).toBe('H2')
      expect(heading?.textContent).toBe('Updated Legend')
    })

    it('should manage content dynamically', () => {
      const fieldset = createFieldset({
        legend: { text: 'Dynamic Content' }
      })

      // Set initial content
      fieldset.setContent('<p>Initial content</p>')
      let contentDiv = fieldset.element.querySelector('.public-good-fieldset__content')
      expect(contentDiv?.innerHTML).toBe('<p>Initial content</p>')

      // Add more content
      fieldset.addContent('<p>Additional content</p>')
      expect(contentDiv?.innerHTML).toBe('<p>Initial content</p><p>Additional content</p>')

      // Clear content
      fieldset.clearContent()
      expect(contentDiv?.innerHTML).toBe('')
    })

    it('should maintain content container across operations', () => {
      const fieldset = createFieldset({
        legend: { text: 'Container Test' }
      })

      fieldset.addContent('<p>First</p>')
      let contentDiv = fieldset.element.querySelector('.public-good-fieldset__content')
      expect(contentDiv).toBeTruthy()

      fieldset.setContent('<p>Reset</p>')
      const sameContentDiv = fieldset.element.querySelector('.public-good-fieldset__content')
      expect(sameContentDiv).toBe(contentDiv) // Should be the same element

      fieldset.addContent('<p>Added</p>')
      expect(sameContentDiv?.innerHTML).toBe('<p>Reset</p><p>Added</p>')
    })
  })

  describe('initAllFieldsets', () => {
    it('should initialize all fieldsets on the page', () => {
      document.body.innerHTML = `
        <div data-public-good-fieldset data-legend-text="First"></div>
        <div data-public-good-fieldset data-legend-text="Second"></div>
      `

      const components = initAllFieldsets()

      expect(components).toHaveLength(2)
      expect(document.querySelectorAll('.public-good-fieldset')).toHaveLength(2)
    })
  })
})