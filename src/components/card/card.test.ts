/**
 * Card Component Tests
 * Unit tests for the card component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  createCard, 
  initializeCards,
  createCareCard,
  createPrimaryCard,
  createSecondaryCard,
  createFeatureCard,
  createTopTaskCard,
  createCardGroup
} from './card'

describe('Card Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  describe('createCard', () => {
    it('should create a basic card with default properties', () => {
      const card = createCard({ heading: 'Test Card' })

      expect(card.element).toBeDefined()
      expect(card.config).toBeDefined()
      expect(card.destroy).toBeInstanceOf(Function)
      expect(card.setClickable).toBeInstanceOf(Function)
      expect(card.updateContent).toBeInstanceOf(Function)

      // Check card structure
      expect(card.element.classList.contains('public-good-card')).toBe(true)
      expect(card.element.tagName.toLowerCase()).toBe('div')
      expect(card.element.querySelector('.public-good-card__heading')?.textContent).toBe('Test Card')
    })

    it('should create clickable card when configured', () => {
      const card = createCard({ 
        heading: 'Clickable Card',
        clickable: true,
        href: '/test-page'
      })

      expect(card.element.classList.contains('public-good-card--clickable')).toBe(true)
      expect(card.element.getAttribute('tabindex')).toBe('0')
      expect(card.element.getAttribute('role')).toBe('link')
      
      const link = card.element.querySelector('.public-good-card__link') as HTMLAnchorElement
      expect(link?.href).toContain('/test-page')
    })

    it('should create cards with different heading levels', () => {
      const h3Card = createCard({ heading: 'H3 Card', headingLevel: 3 })
      const h4Card = createCard({ heading: 'H4 Card', headingLevel: 4 })

      expect(h3Card.element.querySelector('h3')).toBeTruthy()
      expect(h4Card.element.querySelector('h4')).toBeTruthy()
    })

    it('should handle HTML content over text', () => {
      const card = createCard({ 
        heading: 'This should be ignored',
        headingHtml: '<strong>HTML</strong> heading'
      })

      const heading = card.element.querySelector('.public-good-card__heading')
      const strongElement = heading?.querySelector('strong')
      expect(strongElement).toBeTruthy()
      expect(strongElement?.textContent).toBe('HTML')
    })

    it('should create primary card with chevron icon', () => {
      const card = createCard({ 
        heading: 'Primary Card',
        primary: true,
        clickable: true,
        href: '/test'
      })

      expect(card.element.classList.contains('public-good-card--clickable')).toBe(true)
      expect(card.element.querySelector('.public-good-card__content--primary')).toBeTruthy()
      expect(card.element.querySelector('.public-good-icon')).toBeTruthy()
    })

    it('should create secondary card with correct styling', () => {
      const card = createCard({ 
        heading: 'Secondary Card',
        secondary: true
      })

      expect(card.element.classList.contains('public-good-card--secondary')).toBe(true)
      expect(card.element.querySelector('.public-good-card__content--secondary')).toBeTruthy()
    })

    it('should create feature card with special heading', () => {
      const card = createCard({ 
        heading: 'Feature Card',
        feature: true
      })

      expect(card.element.classList.contains('public-good-card--feature')).toBe(true)
      expect(card.element.querySelector('.public-good-card__heading--feature')).toBeTruthy()
      expect(card.element.querySelector('.public-good-card__content--feature')).toBeTruthy()
    })

    it('should create top task card', () => {
      const card = createCard({ 
        heading: 'Top Task',
        topTask: true
      })

      expect(card.element.classList.contains('public-good-card--top-task')).toBe(true)
    })

    it('should add image when imgURL is provided', () => {
      const card = createCard({ 
        heading: 'Card with Image',
        imgURL: '/test-image.jpg',
        imgALT: 'Test image'
      })

      const img = card.element.querySelector('.public-good-card__img') as HTMLImageElement
      expect(img).toBeTruthy()
      expect(img.src).toContain('/test-image.jpg')
      expect(img.alt).toBe('Test image')
    })

    it('should add description text', () => {
      const card = createCard({ 
        heading: 'Card with Description',
        description: 'This is a test description'
      })

      const description = card.element.querySelector('.public-good-card__description')
      expect(description?.textContent).toBe('This is a test description')
    })

    it('should add HTML description', () => {
      const card = createCard({ 
        heading: 'Card with HTML Description',
        descriptionHtml: '<p>HTML <strong>description</strong></p>'
      })

      const content = card.element.querySelector('.public-good-card__content')
      const strongElement = content?.querySelector('strong')
      expect(strongElement?.textContent).toBe('description')
    })

    it('should add raw content', () => {
      const card = createCard({ 
        heading: 'Card with Content',
        content: '<ul><li>Item 1</li><li>Item 2</li></ul>'
      })

      const content = card.element.querySelector('.public-good-card__content')
      const listItems = content?.querySelectorAll('li')
      expect(listItems).toHaveLength(2)
    })

    it('should apply custom classes and attributes', () => {
      const card = createCard({ 
        heading: 'Custom Card',
        classes: 'custom-class another-class',
        attributes: {
          'data-test': 'card-test',
          'aria-describedby': 'description'
        }
      })

      expect(card.element.classList.contains('public-good-card')).toBe(true)
      expect(card.element.classList.contains('custom-class')).toBe(true)
      expect(card.element.classList.contains('another-class')).toBe(true)
      expect(card.element.getAttribute('data-test')).toBe('card-test')
      expect(card.element.getAttribute('aria-describedby')).toBe('description')
    })

    it('should handle click events with analytics', () => {
      const card = createCard({ 
        heading: 'Analytics Card',
        clickable: true,
        href: '/test'
      })
      document.body.appendChild(card.element)

      const eventSpy = vi.fn()
      card.element.addEventListener('public-good:card:click', eventSpy)

      // Simulate click
      card.element.click()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.heading).toBe('Analytics Card')
      expect(eventDetail.variant).toBe('default')
      expect(eventDetail.href).toBe('/test')
    })

    it('should handle custom onClick handler', () => {
      const onClickSpy = vi.fn()
      const card = createCard({ 
        heading: 'Custom Click',
        clickable: true,
        href: '/test',
        onClick: onClickSpy
      })

      // Simulate click
      card.element.click()

      expect(onClickSpy).toHaveBeenCalled()
    })

    it('should handle keyboard navigation for clickable cards', () => {
      const card = createCard({ 
        heading: 'Keyboard Card',
        clickable: true,
        href: '/test'
      })

      // Mock window.location.href
      const originalLocation = window.location
      const mockLocation = { ...originalLocation, href: '' }
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true
      })

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
      card.element.dispatchEvent(enterEvent)

      expect(enterEvent.defaultPrevented).toBe(true)
      expect(window.location.href).toBe('/test')

      // Restore original location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true
      })
    })

    it('should create care cards with proper structure', () => {
      const nonUrgentCard = createCard({ 
        heading: 'Speak to a GP if:',
        type: 'non-urgent'
      })

      expect(nonUrgentCard.element.classList.contains('public-good-card--care')).toBe(true)
      expect(nonUrgentCard.element.classList.contains('public-good-card--care--non-urgent')).toBe(true)
      expect(nonUrgentCard.element.querySelector('.public-good-card--care__heading-container')).toBeTruthy()
      expect(nonUrgentCard.element.querySelector('.public-good-card--care__heading')).toBeTruthy()
      expect(nonUrgentCard.element.querySelector('.public-good-card--care__arrow')).toBeTruthy()
    })

    it('should create urgent care card', () => {
      const urgentCard = createCard({ 
        heading: 'Ask for an urgent GP appointment if:',
        type: 'urgent'
      })

      expect(urgentCard.element.classList.contains('public-good-card--care--urgent')).toBe(true)
    })

    it('should create emergency care card', () => {
      const emergencyCard = createCard({ 
        heading: 'Call 999 if:',
        type: 'emergency'
      })

      expect(emergencyCard.element.classList.contains('public-good-card--care--emergency')).toBe(true)
    })

    it('should add screen reader text for care cards', () => {
      const nonUrgentCard = createCard({ 
        heading: 'Test symptoms',
        type: 'non-urgent'
      })

      const heading = nonUrgentCard.element.querySelector('.public-good-card--care__heading')
      const hiddenText = heading?.querySelector('.public-good-sr-only')
      expect(hiddenText?.textContent).toContain('Non-urgent advice:')
    })

    it('should toggle clickable state', () => {
      const card = createCard({ 
        heading: 'Toggle Card',
        href: '/test'
      })

      // Initially not clickable
      expect(card.element.classList.contains('public-good-card--clickable')).toBe(false)
      expect(card.element.getAttribute('tabindex')).toBe(null)

      // Make clickable
      card.setClickable(true)
      expect(card.element.classList.contains('public-good-card--clickable')).toBe(true)
      expect(card.element.getAttribute('tabindex')).toBe('0')

      // Make not clickable
      card.setClickable(false)
      expect(card.element.classList.contains('public-good-card--clickable')).toBe(false)
      expect(card.element.getAttribute('tabindex')).toBe(null)
    })

    it('should update content', () => {
      const card = createCard({ 
        heading: 'Update Test',
        description: 'Original content'
      })

      // Update with text
      card.updateContent('New content')
      const description = card.element.querySelector('.public-good-card__description')
      expect(description?.textContent).toBe('New content')

      // Update with HTML
      card.updateContent('<p>HTML <em>content</em></p>', true)
      const content = card.element.querySelector('.public-good-card__content')
      const emElement = content?.querySelector('em')
      expect(emElement?.textContent).toBe('content')
    })

    it('should clean up event listeners when destroyed', () => {
      const card = createCard({ 
        heading: 'Destroy Test',
        clickable: true,
        href: '/test'
      })
      document.body.appendChild(card.element)

      // Verify element is in DOM
      expect(document.querySelector('.public-good-card')).toBeTruthy()

      // Destroy component
      card.destroy()

      // Verify element is removed from DOM
      expect(document.querySelector('.public-good-card')).toBeFalsy()
    })
  })

  describe('initializeCards', () => {
    it('should initialize cards from data attributes', () => {
      document.body.innerHTML = `
        <div data-public-good-card 
             data-heading="Initialize Card" 
             data-clickable="true"
             data-href="/test">
        </div>
        <div data-public-good-card 
             data-heading="Secondary Card" 
             data-secondary="true">
        </div>
      `

      const cards = initializeCards()

      expect(cards).toHaveLength(2)
      
      // Check first card
      const firstCard = document.querySelectorAll('.public-good-card')[0] as HTMLElement
      expect(firstCard?.querySelector('.public-good-card__heading')?.textContent).toContain('Initialize Card')
      expect(firstCard?.classList.contains('public-good-card--clickable')).toBe(true)

      // Check second card
      const secondCard = document.querySelectorAll('.public-good-card')[1] as HTMLElement
      expect(secondCard?.querySelector('.public-good-card__heading')?.textContent).toContain('Secondary Card')
      expect(secondCard?.classList.contains('public-good-card--secondary')).toBe(true)
    })

    it('should handle care card initialization', () => {
      document.body.innerHTML = `
        <div data-public-good-card 
             data-heading="Emergency Advice" 
             data-type="emergency">
        </div>
      `

      const cards = initializeCards()

      expect(cards).toHaveLength(1)
      const card = document.querySelector('.public-good-card')
      expect(card?.classList.contains('public-good-card--care--emergency')).toBe(true)
    })

    it('should handle content from element innerHTML', () => {
      document.body.innerHTML = `
        <div data-public-good-card data-heading="Content Card">
          <p>This is content from innerHTML</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `

      const cards = initializeCards()

      expect(cards).toHaveLength(1)
      const content = document.querySelector('.public-good-card__content')
      const listItems = content?.querySelectorAll('li')
      expect(listItems).toHaveLength(2)
    })

    it('should handle invalid JSON in data attributes gracefully', () => {
      document.body.innerHTML = `
        <div data-public-good-card 
             data-heading="Invalid JSON" 
             data-attributes='{invalid: json}'>
        </div>
      `

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const cards = initializeCards()

      expect(cards).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse card attributes:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('helper functions', () => {
    it('should create care card with correct defaults', () => {
      const nonUrgentCard = createCareCard('non-urgent', { heading: 'Custom Heading' })

      expect(nonUrgentCard.element.classList.contains('public-good-card--care--non-urgent')).toBe(true)
      expect(nonUrgentCard.element.querySelector('.public-good-card--care__heading')?.textContent).toContain('Custom Heading')
    })

    it('should create primary card with correct defaults', () => {
      const primaryCard = createPrimaryCard({ heading: 'Primary Heading' })

      expect(primaryCard.element.classList.contains('public-good-card--clickable')).toBe(true)
      expect(primaryCard.element.querySelector('.public-good-card__content--primary')).toBeTruthy()
      expect(primaryCard.element.querySelector('.public-good-icon')).toBeTruthy()
    })

    it('should create secondary card with correct defaults', () => {
      const secondaryCard = createSecondaryCard({ heading: 'Secondary Heading' })

      expect(secondaryCard.element.classList.contains('public-good-card--secondary')).toBe(true)
      expect(secondaryCard.element.querySelector('.public-good-card__content--secondary')).toBeTruthy()
    })

    it('should create feature card with correct defaults', () => {
      const featureCard = createFeatureCard({ heading: 'Feature Heading' })

      expect(featureCard.element.classList.contains('public-good-card--feature')).toBe(true)
      expect(featureCard.element.querySelector('.public-good-card__heading--feature')).toBeTruthy()
    })

    it('should create top task card with correct defaults', () => {
      const topTaskCard = createTopTaskCard({ heading: 'Top Task' })

      expect(topTaskCard.element.classList.contains('public-good-card--top-task')).toBe(true)
      const heading = topTaskCard.element.querySelector('h5')
      expect(heading).toBeTruthy()
    })

    it('should create card group', () => {
      const card1 = createCard({ heading: 'Card 1' })
      const card2 = createCard({ heading: 'Card 2' })
      const group = createCardGroup([card1, card2], 'custom-group-class')

      expect(group.classList.contains('public-good-card-group')).toBe(true)
      expect(group.classList.contains('custom-group-class')).toBe(true)
      expect(group.children).toHaveLength(2)
      expect(group.children[0]?.classList.contains('public-good-card-group__item')).toBe(true)
      expect(group.children[1]?.classList.contains('public-good-card-group__item')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have proper card semantics', () => {
      const card = createCard({ heading: 'Accessible Card' })

      expect(card.element.tagName.toLowerCase()).toBe('div')
      expect(card.element.querySelector('h2')).toBeTruthy()
    })

    it('should have proper clickable card semantics', () => {
      const card = createCard({ 
        heading: 'Link Card',
        clickable: true,
        href: '/test'
      })

      expect(card.element.getAttribute('role')).toBe('link')
      expect(card.element.getAttribute('tabindex')).toBe('0')
    })

    it('should provide accessible care card headings', () => {
      const emergencyCard = createCard({ 
        heading: 'Emergency symptoms',
        type: 'emergency'
      })

      const heading = emergencyCard.element.querySelector('.public-good-card--care__heading')
      const spanWrapper = heading?.querySelector('span[role="text"]')
      expect(spanWrapper).toBeTruthy()
      
      const hiddenText = spanWrapper?.querySelector('.public-good-sr-only')
      expect(hiddenText?.textContent).toContain('Immediate action required:')
    })

    it('should handle focus for clickable cards', () => {
      const card = createCard({ 
        heading: 'Focus Test',
        clickable: true,
        href: '/test'
      })

      document.body.appendChild(card.element)
      card.element.focus()

      expect(document.activeElement).toBe(card.element)
    })
  })

  describe('analytics and events', () => {
    it('should emit click events with correct data', () => {
      const card = createCard({ 
        heading: 'Analytics Test',
        clickable: true,
        href: '/analytics',
        primary: true
      })

      const eventSpy = vi.fn()
      card.element.addEventListener('public-good:card:click', eventSpy)

      card.element.click()

      expect(eventSpy).toHaveBeenCalled()
      const eventDetail = eventSpy.mock.calls[0]![0]!.detail
      expect(eventDetail.heading).toBe('Analytics Test')
      expect(eventDetail.variant).toBe('primary')
      expect(eventDetail.href).toBe('/analytics')
    })

    it('should identify different card variants correctly', () => {
      const careCard = createCard({ heading: 'Care', type: 'urgent', clickable: true, href: '#care' })
      const featureCard = createCard({ heading: 'Feature', feature: true, clickable: true, href: '#feature' })
      const secondaryCard = createCard({ heading: 'Secondary', secondary: true, clickable: true, href: '#secondary' })

      const careEventSpy = vi.fn()
      const featureEventSpy = vi.fn()
      const secondaryEventSpy = vi.fn()

      careCard.element.addEventListener('public-good:card:click', careEventSpy)
      featureCard.element.addEventListener('public-good:card:click', featureEventSpy)
      secondaryCard.element.addEventListener('public-good:card:click', secondaryEventSpy)

      careCard.element.click()
      featureCard.element.click()
      secondaryCard.element.click()

      expect(careEventSpy.mock.calls[0]![0]!.detail.variant).toBe('care-urgent')
      expect(featureEventSpy.mock.calls[0]![0]!.detail.variant).toBe('feature')
      expect(secondaryEventSpy.mock.calls[0]![0]!.detail.variant).toBe('secondary')
    })
  })
})