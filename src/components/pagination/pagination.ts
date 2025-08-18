/**
 * Pagination Component
 * 
 * Creates accessible pagination navigation for content series following NHS UK Design System patterns.
 * Allows users to navigate between related pages with previous/next links and page titles.
 * 
 * Features:
 * - Previous and next page navigation
 * - Page titles for context
 * - Directional arrows and icons
 * - Accessibility-focused with proper ARIA attributes
 * - Keyboard navigation support
 * - Data attribute initialization
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Pagination page configuration
 */
export interface PaginationPage {
  title: string
  url: string
}

/**
 * Pagination component configuration
 */
export interface PaginationConfig {
  id?: string
  previousPage?: PaginationPage
  nextPage?: PaginationPage
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Pagination component result
 */
export interface PaginationResult {
  element: HTMLElement
  config: PaginationConfig
  destroy: () => void
}

/**
 * Creates a pagination component
 */
export function createPagination(config: PaginationConfig = {}): PaginationResult {
  const id = config.id || generateUniqueId('pagination')
  
  // Set defaults in config
  if (!config.id) {
    config.id = id
  }
  
  // Create navigation element
  const nav = document.createElement('nav')
  nav.className = 'public-good-pagination'
  nav.id = id
  nav.setAttribute('role', 'navigation')
  nav.setAttribute('aria-label', 'Pagination')
  
  // Add visually hidden heading for screen readers
  const heading = document.createElement('h2')
  heading.className = 'public-good-sr-only'
  heading.textContent = 'Pagination'
  nav.appendChild(heading)
  
  // Create pagination list
  const list = document.createElement('ul')
  list.className = 'public-good-pagination__list'
  
  // Add previous page link if provided
  if (config.previousPage) {
    const prevItem = document.createElement('li')
    prevItem.className = 'public-good-pagination-item--previous'
    
    const prevLink = document.createElement('a')
    prevLink.className = 'public-good-pagination__link public-good-pagination__link--prev'
    prevLink.href = config.previousPage.url
    prevLink.rel = 'prev'
    
    // Create previous link content
    const prevContent = document.createElement('span')
    prevContent.className = 'public-good-pagination__link-title'
    
    // Add arrow icon
    const prevArrow = document.createElement('span')
    prevArrow.className = 'public-good-pagination__link-label'
    prevArrow.setAttribute('aria-hidden', 'true')
    
    // Create SVG arrow icon
    const prevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    prevSvg.setAttribute('class', 'public-good-icon public-good-icon__arrow-left')
    prevSvg.setAttribute('width', '34')
    prevSvg.setAttribute('height', '34')
    prevSvg.setAttribute('viewBox', '0 0 24 24')
    prevSvg.setAttribute('fill', 'none')
    
    const prevPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    prevPath.setAttribute('d', 'M4.1 12.3l2.7 3c.2.2.5.2.7 0 .1-.1.1-.2.1-.3v-2h8.6c.2 0 .4-.2.4-.4v-.9c0-.3-.2-.5-.4-.5H7.6v-2c0-.2-.1-.4-.3-.5h-.2c-.1 0-.3.1-.4.2l-2.7 3.1c-.1.2-.1.4 0 .5z')
    prevPath.setAttribute('fill', 'currentColor')
    
    prevSvg.appendChild(prevPath)
    prevArrow.appendChild(prevSvg)
    prevArrow.appendChild(document.createTextNode(' Previous'))
    
    // Add page title
    const prevTitle = document.createElement('span')
    prevTitle.className = 'public-good-pagination__link-title-text'
    prevTitle.textContent = config.previousPage.title
    
    prevContent.appendChild(prevArrow)
    prevContent.appendChild(prevTitle)
    prevLink.appendChild(prevContent)
    prevItem.appendChild(prevLink)
    list.appendChild(prevItem)
  }
  
  // Add next page link if provided
  if (config.nextPage) {
    const nextItem = document.createElement('li')
    nextItem.className = 'public-good-pagination-item--next'
    
    const nextLink = document.createElement('a')
    nextLink.className = 'public-good-pagination__link public-good-pagination__link--next'
    nextLink.href = config.nextPage.url
    nextLink.rel = 'next'
    
    // Create next link content
    const nextContent = document.createElement('span')
    nextContent.className = 'public-good-pagination__link-title'
    
    // Add arrow icon
    const nextArrow = document.createElement('span')
    nextArrow.className = 'public-good-pagination__link-label'
    nextArrow.setAttribute('aria-hidden', 'true')
    nextArrow.appendChild(document.createTextNode('Next '))
    
    // Create SVG arrow icon
    const nextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    nextSvg.setAttribute('class', 'public-good-icon public-good-icon__arrow-right')
    nextSvg.setAttribute('width', '34')
    nextSvg.setAttribute('height', '34')
    nextSvg.setAttribute('viewBox', '0 0 24 24')
    nextSvg.setAttribute('fill', 'none')
    
    const nextPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    nextPath.setAttribute('d', 'M19.6 11.66l-2.73-3A.51.51 0 0 0 16 9v2H7.34A.66.66 0 0 0 7 11.64v.72A.66.66 0 0 0 7.34 13H16v2a.5.5 0 0 0 .32.46.51.51 0 0 0 .55-.14l2.73-3a.5.5 0 0 0 0-.66z')
    nextPath.setAttribute('fill', 'currentColor')
    
    nextSvg.appendChild(nextPath)
    nextArrow.appendChild(nextSvg)
    
    // Add page title
    const nextTitle = document.createElement('span')
    nextTitle.className = 'public-good-pagination__link-title-text'
    nextTitle.textContent = config.nextPage.title
    
    nextContent.appendChild(nextArrow)
    nextContent.appendChild(nextTitle)
    nextLink.appendChild(nextContent)
    nextItem.appendChild(nextLink)
    list.appendChild(nextItem)
  }
  
  nav.appendChild(list)
  
  // Apply custom classes
  if (config.classes) {
    nav.classList.add(...config.classes.split(' '))
  }
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      nav.setAttribute(key, value)
    })
  }
  
  // Cleanup function
  function destroy(): void {
    nav.remove()
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:pagination:destroyed', {
      detail: { element: nav, config: config },
      bubbles: true
    })
    document.dispatchEvent(event)
  }
  
  // Add click event listeners for analytics/tracking
  const links = nav.querySelectorAll('.public-good-pagination__link')
  links.forEach(link => {
    link.addEventListener('click', (event) => {
      const customEvent = new CustomEvent('public-good:pagination:click', {
        detail: { 
          element: nav,
          link: event.target,
          url: (event.target as HTMLAnchorElement).href,
          direction: link.classList.contains('public-good-pagination__link--prev') ? 'previous' : 'next',
          config: config 
        },
        bubbles: true
      })
      nav.dispatchEvent(customEvent)
    })
  })
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:pagination:created', {
    detail: { element: nav, config: config },
    bubbles: true
  })
  nav.dispatchEvent(creationEvent)
  
  return {
    element: nav,
    config,
    destroy
  }
}

/**
 * Creates a pagination with both previous and next pages
 */
export function createFullPagination(
  previousPage: PaginationPage,
  nextPage: PaginationPage,
  options: Partial<PaginationConfig> = {}
): PaginationResult {
  return createPagination({
    previousPage,
    nextPage,
    ...options
  })
}

/**
 * Creates a pagination with only previous page
 */
export function createPreviousPagination(
  previousPage: PaginationPage,
  options: Partial<PaginationConfig> = {}
): PaginationResult {
  return createPagination({
    previousPage,
    ...options
  })
}

/**
 * Creates a pagination with only next page
 */
export function createNextPagination(
  nextPage: PaginationPage,
  options: Partial<PaginationConfig> = {}
): PaginationResult {
  return createPagination({
    nextPage,
    ...options
  })
}

/**
 * Initialize all pagination components from data attributes in the DOM
 */
export function initializePaginations(): PaginationResult[] {
  const elements = document.querySelectorAll('[data-public-good-pagination]')
  const components: PaginationResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<PaginationConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      // Previous page configuration
      const prevTitle = element.getAttribute('data-prev-title')
      const prevUrl = element.getAttribute('data-prev-url')
      if (prevTitle && prevUrl) {
        config.previousPage = { title: prevTitle, url: prevUrl }
      }
      
      // Next page configuration
      const nextTitle = element.getAttribute('data-next-title')
      const nextUrl = element.getAttribute('data-next-url')
      if (nextTitle && nextUrl) {
        config.nextPage = { title: nextTitle, url: nextUrl }
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
      
      // Create the pagination component
      const pagination = createPagination(config as PaginationConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(pagination.element, element)
      components.push(pagination)
      
    } catch (error) {
      console.error('Error initializing pagination component:', error)
    }
  })
  
  return components
}

// Auto-initialize pagination components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePaginations)
  } else {
    initializePaginations()
  }
}