/**
 * Card Component TypeScript
 * Converted from NHS UK Design System card component
 */

import { createElement } from '@/core/functions/dom-utils'
import { t } from '@/core/functions/i18n'

/**
 * Card variant types
 */
export type CardType = 'non-urgent' | 'urgent' | 'emergency'

/**
 * Card component configuration options
 */
export interface CardConfig {
  heading?: string
  headingHtml?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  headingClasses?: string
  href?: string
  clickable?: boolean
  type?: CardType
  feature?: boolean
  primary?: boolean
  secondary?: boolean
  topTask?: boolean
  imgURL?: string
  imgALT?: string
  description?: string
  descriptionHtml?: string
  content?: string
  classes?: string
  attributes?: Record<string, string>
  onClick?: (event: Event) => void
}

/**
 * Card component instance
 */
export interface CardComponent {
  element: HTMLElement
  config: CardConfig
  destroy: () => void
  setClickable: (clickable: boolean) => void
  updateContent: (content: string, isHtml?: boolean) => void
}

/**
 * Default configuration for cards
 */
const DEFAULT_CONFIG = {
  heading: t('common.cardHeading'),
  headingLevel: 2 as const,
  headingClasses: '',
  clickable: false,
  feature: false,
  primary: false,
  secondary: false,
  topTask: false,
  classes: '',
  attributes: {}
}

/**
 * Create a Card component
 */
export const createCard = (config: CardConfig): CardComponent => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  // Determine card type classes
  const cardClasses = [
    'public-good-card',
    finalConfig.clickable ? 'public-good-card--clickable' : '',
    finalConfig.secondary ? 'public-good-card--secondary' : '',
    finalConfig.type ? `public-good-card--care public-good-card--care--${finalConfig.type}` : '',
    finalConfig.feature ? 'public-good-card--feature' : '',
    finalConfig.topTask ? 'public-good-card--top-task' : '',
    finalConfig.classes
  ].filter(Boolean).join(' ')

  // Create card element
  const cardElement = createElement('div', {
    class: cardClasses,
    'data-module': 'public-good-card',
    ...finalConfig.attributes
  })

  // Add image if provided
  if (finalConfig.imgURL) {
    const img = createElement('img', {
      class: 'public-good-card__img',
      src: finalConfig.imgURL,
      alt: finalConfig.imgALT || ''
    })
    cardElement.appendChild(img)
  }

  // Create content wrapper
  const contentClasses = finalConfig.type
    ? 'public-good-card--care__heading-container'
    : [
        'public-good-card__content',
        finalConfig.feature ? 'public-good-card__content--feature' : '',
        finalConfig.primary ? 'public-good-card__content--primary' : '',
        finalConfig.secondary ? 'public-good-card__content--secondary' : ''
      ].filter(Boolean).join(' ')

  const contentWrapper = createElement('div', {
    class: contentClasses
  })

  // Create heading
  const headingTag = `h${finalConfig.headingLevel}` as keyof HTMLElementTagNameMap
  const headingClasses = [
    finalConfig.type ? 'public-good-card--care__heading' : 'public-good-card__heading',
    finalConfig.feature ? 'public-good-card__heading--feature' : '',
    finalConfig.headingClasses
  ].filter(Boolean).join(' ')

  const heading = createElement(headingTag, {
    class: headingClasses
  })

  // Set heading content
  if (finalConfig.headingHtml) {
    heading.innerHTML = finalConfig.headingHtml
  } else if (finalConfig.href && !finalConfig.feature) {
    // Create link inside heading
    const link = createElement('a', {
      class: 'public-good-card__link',
      href: finalConfig.href
    })
    link.textContent = finalConfig.heading
    heading.appendChild(link)
  } else if (finalConfig.type) {
    // Create accessible care card heading with screen reader text
    const spanWrapper = createElement('span', { role: 'text' })
    const hiddenSpan = createElement('span', { class: 'public-good-sr-only' })
    
    // Set appropriate screen reader text based on type
    let srText = ''
    switch (finalConfig.type) {
      case 'non-urgent':
        srText = t('card.nonUrgentAdvice')
        break
      case 'urgent':
        srText = t('card.urgentAdvice')
        break
      case 'emergency':
        srText = t('card.emergencyAdvice')
        break
      default:
        srText = t('card.nonUrgentAdvice')
    }
    
    hiddenSpan.textContent = `${srText} `
    spanWrapper.appendChild(hiddenSpan)
    spanWrapper.appendChild(document.createTextNode(finalConfig.heading))
    heading.appendChild(spanWrapper)
  } else {
    heading.textContent = finalConfig.heading
  }

  contentWrapper.appendChild(heading)

  // Add care card arrow for care cards
  if (finalConfig.type) {
    const arrow = createElement('span', {
      class: 'public-good-card--care__arrow',
      'aria-hidden': 'true'
    })
    contentWrapper.appendChild(arrow)
  }

  cardElement.appendChild(contentWrapper)

  // Add main content for care cards or primary content wrapper
  let mainContentWrapper = contentWrapper
  if (finalConfig.type) {
    mainContentWrapper = createElement('div', {
      class: 'public-good-card__content'
    })
    cardElement.appendChild(mainContentWrapper)
  }

  // Add description/content
  if (finalConfig.content) {
    mainContentWrapper.innerHTML += finalConfig.content
  } else if (finalConfig.descriptionHtml) {
    mainContentWrapper.innerHTML += finalConfig.descriptionHtml
  } else if (finalConfig.description) {
    const descriptionP = createElement('p', {
      class: 'public-good-card__description'
    })
    descriptionP.textContent = finalConfig.description
    mainContentWrapper.appendChild(descriptionP)
  }

  // Add primary card chevron icon
  if (finalConfig.primary) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    icon.setAttribute('class', 'public-good-icon')
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    icon.setAttribute('width', '27')
    icon.setAttribute('height', '27')
    icon.setAttribute('aria-hidden', 'true')
    icon.setAttribute('focusable', 'false')
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', '13.333')
    circle.setAttribute('cy', '13.333')
    circle.setAttribute('r', '13.333')
    circle.setAttribute('fill', '')
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('fill', 'none')
    g.setAttribute('stroke', '#fff')
    g.setAttribute('stroke-linecap', 'round')
    g.setAttribute('stroke-miterlimit', '10')
    g.setAttribute('stroke-width', '2.667')
    
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path1.setAttribute('d', 'M15.438 13l-3.771 3.771')
    
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path2.setAttribute('d', 'M11.667 9.229L15.438 13')
    
    g.appendChild(path1)
    g.appendChild(path2)
    icon.appendChild(circle)
    icon.appendChild(g)
    mainContentWrapper.appendChild(icon)
  }

  // Event handlers
  const handleClick = (event: Event): void => {
    // Call custom onClick handler if provided
    if (finalConfig.onClick) {
      finalConfig.onClick(event)
    }

    // Analytics tracking
    const customEvent = new CustomEvent('public-good:card:click', {
      bubbles: true,
      detail: {
        heading: finalConfig.heading,
        type: finalConfig.type || 'default',
        variant: getCardVariant(finalConfig),
        href: finalConfig.href
      }
    })
    cardElement.dispatchEvent(customEvent)
  }

  // Add event listeners for clickable cards
  if (finalConfig.clickable && finalConfig.href) {
    cardElement.addEventListener('click', handleClick)
    
    // Add keyboard support
    cardElement.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (finalConfig.href) {
          window.location.href = finalConfig.href
        }
      }
    })
    
    // Make card focusable
    cardElement.setAttribute('tabindex', '0')
    cardElement.setAttribute('role', 'link')
  }

  // Component methods
  const setClickable = (clickable: boolean): void => {
    if (clickable) {
      cardElement.classList.add('public-good-card--clickable')
      if (finalConfig.href) {
        cardElement.setAttribute('tabindex', '0')
        cardElement.setAttribute('role', 'link')
      }
    } else {
      cardElement.classList.remove('public-good-card--clickable')
      cardElement.removeAttribute('tabindex')
      cardElement.removeAttribute('role')
    }
    finalConfig.clickable = clickable
  }

  const updateContent = (content: string, isHtml = false): void => {
    const contentElement = cardElement.querySelector('.public-good-card__content')
    if (contentElement) {
      // Preserve heading
      const heading = contentElement.querySelector('.public-good-card__heading, .public-good-card--care__heading')
      contentElement.innerHTML = ''
      if (heading) {
        contentElement.appendChild(heading)
      }
      
      if (isHtml) {
        contentElement.innerHTML += content
      } else {
        const p = createElement('p', { class: 'public-good-card__description' })
        p.textContent = content
        contentElement.appendChild(p)
      }
    }
  }

  const destroy = (): void => {
    if (finalConfig.clickable) {
      cardElement.removeEventListener('click', handleClick)
    }
    cardElement.remove()
  }

  return {
    element: cardElement,
    config: finalConfig,
    destroy,
    setClickable,
    updateContent
  }
}

/**
 * Get card variant from config
 */
const getCardVariant = (config: CardConfig): string => {
  if (config.type) return `care-${config.type}`
  if (config.feature) return 'feature'
  if (config.primary) return 'primary'
  if (config.secondary) return 'secondary'
  if (config.topTask) return 'top-task'
  return 'default'
}

/**
 * Initialize all cards on the page
 */
export const initializeCards = (container: Document | Element = document): CardComponent[] => {
  const cards: CardComponent[] = []
  const elements = container.querySelectorAll('[data-public-good-card]')

  elements.forEach((element) => {
    try {
      // Extract configuration from data attributes
      const config: CardConfig = {
        ...(element.getAttribute('data-heading') && { heading: element.getAttribute('data-heading')! }),
        ...(element.getAttribute('data-heading-html') && { headingHtml: element.getAttribute('data-heading-html')! }),
        ...(element.getAttribute('data-heading-level') && { headingLevel: parseInt(element.getAttribute('data-heading-level')!) as 1 | 2 | 3 | 4 | 5 | 6 }),
        ...(element.getAttribute('data-heading-classes') && { headingClasses: element.getAttribute('data-heading-classes')! }),
        ...(element.getAttribute('data-href') && { href: element.getAttribute('data-href')! }),
        clickable: element.getAttribute('data-clickable') === 'true',
        ...(element.getAttribute('data-type') && { type: element.getAttribute('data-type') as CardType }),
        feature: element.getAttribute('data-feature') === 'true',
        primary: element.getAttribute('data-primary') === 'true',
        secondary: element.getAttribute('data-secondary') === 'true',
        topTask: element.getAttribute('data-top-task') === 'true',
        ...(element.getAttribute('data-img-url') && { imgURL: element.getAttribute('data-img-url')! }),
        ...(element.getAttribute('data-img-alt') && { imgALT: element.getAttribute('data-img-alt')! }),
        ...(element.getAttribute('data-description') && { description: element.getAttribute('data-description')! }),
        ...(element.getAttribute('data-description-html') && { descriptionHtml: element.getAttribute('data-description-html')! }),
        ...(element.getAttribute('data-classes') && { classes: element.getAttribute('data-classes')! }),
        attributes: {}
      }

      // Extract content from element inner HTML if provided
      if (element.innerHTML.trim() && !config.description && !config.descriptionHtml) {
        config.content = element.innerHTML
      }

      // Parse additional attributes
      const attributesData = element.getAttribute('data-attributes')
      if (attributesData) {
        try {
          config.attributes = JSON.parse(attributesData)
        } catch (error) {
          console.warn('Failed to parse card attributes:', error)
        }
      }

      // Create component and replace element
      const card = createCard(config)
      element.parentNode?.replaceChild(card.element, element)
      cards.push(card)
    } catch (error) {
      console.error('Failed to initialize card:', error)
    }
  })

  return cards
}

/**
 * Create a care card (non-urgent, urgent, or emergency)
 */
export const createCareCard = (type: CardType, config: Omit<CardConfig, 'type'> = {}): CardComponent => {
  return createCard({
    ...config,
    type,
    heading: config.heading || getDefaultCareCardHeading(type)
  })
}

/**
 * Create a primary card with chevron
 */
export const createPrimaryCard = (config: Omit<CardConfig, 'primary' | 'clickable'> = {}): CardComponent => {
  return createCard({
    ...config,
    primary: true,
    clickable: true
  })
}

/**
 * Create a secondary card
 */
export const createSecondaryCard = (config: Omit<CardConfig, 'secondary'> = {}): CardComponent => {
  return createCard({
    ...config,
    secondary: true
  })
}

/**
 * Create a feature card
 */
export const createFeatureCard = (config: Omit<CardConfig, 'feature'> = {}): CardComponent => {
  return createCard({
    ...config,
    feature: true
  })
}

/**
 * Create a top task card
 */
export const createTopTaskCard = (config: Omit<CardConfig, 'topTask'> = {}): CardComponent => {
  return createCard({
    ...config,
    topTask: true,
    headingLevel: config.headingLevel || 5,
    headingClasses: config.headingClasses || 'public-good-heading-xs'
  })
}

/**
 * Utility function to create a card group
 */
export const createCardGroup = (cards: CardComponent[], classes = ''): HTMLElement => {
  const group = createElement('ul', {
    class: `public-good-card-group${classes ? ` ${classes}` : ''}`
  })

  cards.forEach(card => {
    const listItem = createElement('li', {
      class: 'public-good-card-group__item'
    })
    listItem.appendChild(card.element)
    group.appendChild(listItem)
  })

  return group
}

/**
 * Get default heading for care card types
 */
const getDefaultCareCardHeading = (type: CardType): string => {
  switch (type) {
    case 'non-urgent':
      return t('card.speakToGP')
    case 'urgent':
      return t('card.urgentGPAppointment')
    case 'emergency':
      return t('card.call999')
    default:
      return t('card.speakToGP')
  }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeCards()
  })
} else {
  initializeCards()
}