/**
 * Button Component Tests
 * Unit tests for the button component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createButton, 
  initializeButtons,
  createSubmitButton,
  createCancelButton,
  createLinkButton,
  createWarningButton,
  createButtonGroup
} from './button'

describe('Button Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createButton', () => {
    it('should create a basic button with default properties', () => {
      const button = createButton({ text: 'Test Button' })

      expect(button.element).toBeDefined()
      expect(button.config).toBeDefined()
      expect(button.destroy).toBeInstanceOf(Function)
      expect(button.disable).toBeInstanceOf(Function)
      expect(button.enable).toBeInstanceOf(Function)
      expect(button.setLoading).toBeInstanceOf(Function)

      // Check button structure
      expect(button.element.classList.contains('public-good-button')).toBe(true)
      expect(button.element.tagName.toLowerCase()).toBe('button')
      expect((button.element as HTMLButtonElement).type).toBe('submit')
      expect(button.element.textContent).toBe('Test Button')
    })

    it('should automatically create anchor element when href is provided', () => {
      const button = createButton({ 
        text: 'Link Button',
        href: '/test-page'
      })

      expect(button.element.tagName.toLowerCase()).toBe('a')
      expect((button.element as HTMLAnchorElement).getAttribute('href')).toBe('/test-page')
      expect(button.element.getAttribute('role')).toBe('button')
      expect(button.element.getAttribute('draggable')).toBe('false')
    })

    it('should create input element when specified', () => {
      const button = createButton({ 
        text: 'Input Button',
        element: 'input',
        type: 'button'
      })

      expect(button.element.tagName.toLowerCase()).toBe('input')
      expect((button.element as HTMLInputElement).type).toBe('button')
      expect((button.element as HTMLInputElement).value).toBe('Input Button')
    })

    it('should apply different button variants', () => {
      const primaryButton = createButton({ text: 'Primary', variant: 'primary' })
      expect(primaryButton.element.classList.contains('public-good-button')).toBe(true)
      expect(primaryButton.element.classList.contains('public-good-button--primary')).toBe(false)

      const secondaryButton = createButton({ text: 'Secondary', variant: 'secondary' })
      expect(secondaryButton.element.classList.contains('public-good-button--secondary')).toBe(true)

      const warningButton = createButton({ text: 'Warning', variant: 'warning' })
      expect(warningButton.element.classList.contains('public-good-button--warning')).toBe(true)

      const reverseButton = createButton({ text: 'Reverse', variant: 'reverse' })
      expect(reverseButton.element.classList.contains('public-good-button--reverse')).toBe(true)

      const successButton = createButton({ text: 'Success', variant: 'success' })
      expect(successButton.element.classList.contains('public-good-button--success')).toBe(true)
    })

    it('should handle HTML content over text', () => {
      const button = createButton({ 
        text: 'This should be ignored',
        html: 'HTML <strong>content</strong>'
      })

      const strongElement = button.element.querySelector('strong')
      expect(strongElement).toBeTruthy()
      expect(strongElement?.textContent).toBe('content')
    })

    it('should apply custom classes and attributes', () => {
      const button = createButton({ 
        text: 'Custom Button',
        classes: 'custom-class another-class',
        attributes: {
          'data-test': 'button-test',
          'aria-describedby': 'description'
        }
      })

      expect(button.element.classList.contains('public-good-button')).toBe(true)
      expect(button.element.classList.contains('custom-class')).toBe(true)
      expect(button.element.classList.contains('another-class')).toBe(true)
      expect(button.element.getAttribute('data-test')).toBe('button-test')
      expect(button.element.getAttribute('aria-describedby')).toBe('description')
    })

    it('should handle disabled state', () => {
      const button = createButton({ 
        text: 'Disabled Button',
        disabled: true
      })

      expect((button.element as HTMLButtonElement).disabled).toBe(true)
      expect(button.element.getAttribute('aria-disabled')).toBe('true')
    })

    it('should set prevent double click attribute when enabled', () => {
      const button = createButton({ 
        text: 'No Double Click',
        preventDoubleClick: true
      })

      expect(button.element.getAttribute('data-prevent-double-click')).toBe('true')
    })

    it('should handle click events with analytics', () => {
      const button = createButton({ text: 'Analytics Button' })
      document.body.appendChild(button.element)

      const eventSpy = vi.fn()
      button.element.addEventListener('public-good:button:click', eventSpy)

      // Simulate click
      button.element.click()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.text).toBe('Analytics Button')
      expect(eventDetail.variant).toBe('primary')
      expect(eventDetail.element).toBe('button')
    })

    it('should handle custom onClick handler', () => {
      const onClickSpy = vi.fn()
      const button = createButton({ 
        text: 'Custom Click',
        onClick: onClickSpy
      })

      // Simulate click
      button.element.click()

      expect(onClickSpy).toHaveBeenCalled()
    })

    it('should prevent double clicks when enabled', () => {
      vi.useFakeTimers()
      
      const onClickSpy = vi.fn()
      const button = createButton({ 
        text: 'No Double Click',
        preventDoubleClick: true,
        onClick: onClickSpy
      })

      // First click should work
      button.element.click()
      expect(onClickSpy).toHaveBeenCalledTimes(1)

      // Second immediate click should be prevented
      const secondClickEvent = new Event('click', { cancelable: true })
      button.element.dispatchEvent(secondClickEvent)
      expect(secondClickEvent.defaultPrevented).toBe(true)
      expect(onClickSpy).toHaveBeenCalledTimes(1)

      // After timeout, clicking should work again
      vi.advanceTimersByTime(1000)
      button.element.click()
      expect(onClickSpy).toHaveBeenCalledTimes(2)

      vi.useRealTimers()
    })

    it('should handle keyboard events for anchor elements with role button', () => {
      const button = createButton({ 
        text: 'Link Button',
        href: '/test'
      })

      const clickSpy = vi.spyOn(button.element, 'click')

      // Simulate space key press
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
      button.element.dispatchEvent(spaceEvent)

      expect(spaceEvent.defaultPrevented).toBe(true)
      expect(clickSpy).toHaveBeenCalled()
    })

    it('should enable and disable button correctly', () => {
      const button = createButton({ text: 'Toggle Button' })

      // Test disable
      button.disable!()
      expect((button.element as HTMLButtonElement).disabled).toBe(true)
      expect(button.element.getAttribute('aria-disabled')).toBe('true')
      expect(button.element.classList.contains('public-good-button--disabled')).toBe(true)

      // Test enable
      button.enable!()
      expect((button.element as HTMLButtonElement).disabled).toBe(false)
      expect(button.element.getAttribute('aria-disabled')).toBe(null)
      expect(button.element.classList.contains('public-good-button--disabled')).toBe(false)
    })

    it('should handle loading state', () => {
      const button = createButton({ text: 'Loading Button' })

      // Test set loading
      button.setLoading!(true)
      expect(button.element.classList.contains('public-good-button--loading')).toBe(true)
      expect(button.element.getAttribute('aria-busy')).toBe('true')
      expect(button.element.textContent).toContain('Loading...')
      expect(button.element.querySelector('.public-good-button__spinner')).toBeTruthy()

      // Should be disabled during loading
      expect((button.element as HTMLButtonElement).disabled).toBe(true)

      // Test remove loading
      button.setLoading!(false)
      expect(button.element.classList.contains('public-good-button--loading')).toBe(false)
      expect(button.element.getAttribute('aria-busy')).toBe(null)
      expect(button.element.textContent).toBe('Loading Button')
      expect(button.element.querySelector('.public-good-button__spinner')).toBeFalsy()
    })

    it('should clean up event listeners when destroyed', () => {
      const button = createButton({ text: 'Destroy Test' })
      document.body.appendChild(button.element)

      // Verify element is in DOM
      expect(document.querySelector('.public-good-button')).toBeTruthy()

      // Destroy component
      button.destroy()

      // Verify element is removed from DOM
      expect(document.querySelector('.public-good-button')).toBeFalsy()
    })
  })

  describe('initializeButtons', () => {
    it('should initialize buttons from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-button 
             data-text="Initialize Button" 
             data-variant="secondary"
             data-type="button">
        </div>
        <div data-public-good-button 
             data-text="Another Button" 
             data-href="/test"
             data-prevent-double-click="true">
        </div>
      `

      const buttons = initializeButtons()

      expect(buttons).toHaveLength(2)
      
      // Check first button
      const firstButton = document.querySelector('.public-good-button') as HTMLButtonElement
      expect(firstButton?.textContent).toBe('Initialize Button')
      expect(firstButton?.classList.contains('public-good-button--secondary')).toBe(true)
      expect(firstButton?.type).toBe('button')

      // Check second button (should be anchor)
      const anchors = document.querySelectorAll('a.public-good-button')
      expect(anchors).toHaveLength(1)
      expect(anchors[0]?.textContent).toBe('Another Button')
      expect(anchors[0]?.getAttribute('href')).toBe('/test')
      expect(anchors[0]?.getAttribute('data-prevent-double-click')).toBe('true')
    })

    it('should handle invalid JSON in data attributes gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-button 
             data-text="Invalid JSON" 
             data-attributes='{invalid: json}'>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const buttons = initializeButtons()

      expect(buttons).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse button attributes:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create submit button with correct defaults', () => {
      const button = createSubmitButton({ text: 'Submit Form' })

      expect(button.element.tagName.toLowerCase()).toBe('button')
      expect((button.element as HTMLButtonElement).type).toBe('submit')
      expect(button.element.textContent).toBe('Submit Form')
    })

    it('should create cancel button with correct defaults', () => {
      const button = createCancelButton({ text: 'Cancel Action' })

      expect(button.element.tagName.toLowerCase()).toBe('button')
      expect((button.element as HTMLButtonElement).type).toBe('button')
      expect(button.element.classList.contains('public-good-button--secondary')).toBe(true)
      expect(button.element.textContent).toBe('Cancel Action')
    })

    it('should create link button with correct defaults', () => {
      const button = createLinkButton('/home', { text: 'Go Home' })

      expect(button.element.tagName.toLowerCase()).toBe('a')
      expect((button.element as HTMLAnchorElement).href).toContain('/home')
      expect(button.element.textContent).toBe('Go Home')
    })

    it('should create warning button with correct defaults', () => {
      const button = createWarningButton({ text: 'Delete Item' })

      expect(button.element.classList.contains('public-good-button--warning')).toBe(true)
      expect(button.element.textContent).toBe('Delete Item')
    })

    it('should create button group', () => {
      const button1 = createButton({ text: 'Button 1' })
      const button2 = createButton({ text: 'Button 2' })
      const group = createButtonGroup([button1, button2], 'custom-group-class')

      expect(group.classList.contains('public-good-button-group')).toBe(true)
      expect(group.classList.contains('custom-group-class')).toBe(true)
      expect(group.children).toHaveLength(2)
      expect(group.children[0]).toBe(button1.element)
      expect(group.children[1]).toBe(button2.element)
    })
  })

  describe('accessibility', () => {
    it('should have proper button semantics', () => {
      const button = createButton({ text: 'Accessible Button' })

      expect(button.element.tagName.toLowerCase()).toBe('button')
      expect(button.element.getAttribute('type')).toBe('submit')
    })

    it('should have proper link button semantics', () => {
      const button = createButton({ 
        text: 'Link Button',
        href: '/test'
      })

      expect(button.element.tagName.toLowerCase()).toBe('a')
      expect(button.element.getAttribute('role')).toBe('button')
      expect(button.element.getAttribute('draggable')).toBe('false')
    })

    it('should handle disabled state correctly for screen readers', () => {
      const button = createButton({ 
        text: 'Disabled Button',
        disabled: true
      })

      expect(button.element.getAttribute('aria-disabled')).toBe('true')
      expect((button.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('should provide loading state feedback for screen readers', () => {
      const button = createButton({ text: 'Loading Test' })

      button.setLoading!(true)
      expect(button.element.getAttribute('aria-busy')).toBe('true')

      button.setLoading!(false)
      expect(button.element.getAttribute('aria-busy')).toBe(null)
    })

    it('should handle custom name and value attributes', () => {
      const button = createButton({ 
        text: 'Form Button',
        name: 'submit-action',
        value: 'save'
      })

      expect((button.element as HTMLButtonElement).name).toBe('submit-action')
      expect((button.element as HTMLButtonElement).value).toBe('save')
    })
  })

  describe('global keyboard handling', () => {
    it('should handle space key on role=button elements', () => {
      // Create a custom element with role="button"
      const customButton = document.createElement('div')
      customButton.setAttribute('role', 'button')
      customButton.textContent = 'Custom Button'
      document.body.appendChild(customButton)

      const clickSpy = vi.spyOn(customButton, 'click')

      // Simulate space key press
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
      Object.defineProperty(spaceEvent, 'target', { value: customButton })
      
      document.dispatchEvent(spaceEvent)

      expect(spaceEvent.defaultPrevented).toBe(true)
      expect(clickSpy).toHaveBeenCalled()
    })

    it('should ignore other keys', () => {
      const customButton = document.createElement('div')
      customButton.setAttribute('role', 'button')
      document.body.appendChild(customButton)

      const clickSpy = vi.spyOn(customButton, 'click')

      // Simulate enter key press (should be ignored)
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
      Object.defineProperty(enterEvent, 'target', { value: customButton })
      
      document.dispatchEvent(enterEvent)

      expect(enterEvent.defaultPrevented).toBe(false)
      expect(clickSpy).not.toHaveBeenCalled()
    })
  })
})