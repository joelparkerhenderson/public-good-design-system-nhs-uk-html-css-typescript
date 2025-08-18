/**
 * Breadcrumb Component TypeScript
 * Converted from NHS UK Design System breadcrumb component
 */

import { createElement } from '@/core/functions/dom-utils'
import { t } from '@/core/functions/i18n'

/**
 * Breadcrumb item configuration
 */
export interface BreadcrumbItem {
  text: string
  href?: string
  attributes?: Record<string, string>
}

/**
 * Breadcrumb component configuration options
 */
export interface BreadcrumbConfig {
  items: BreadcrumbItem[]
  classes?: string
  attributes?: Record<string, string>
  labelText?: string
}

/**
 * Breadcrumb component instance
 */
export interface BreadcrumbComponent {
  element: HTMLElement
  nav: HTMLElement
  list: HTMLOListElement
  backLink?: HTMLAnchorElement | undefined
  destroy: () => void
}

/**
 * Default configuration for breadcrumbs
 */
const DEFAULT_CONFIG: Required<Omit<BreadcrumbConfig, 'items'>> & { items: BreadcrumbItem[] } = {
  items: [],
  classes: '',
  attributes: {},
  labelText: t('nav.breadcrumb')
}

/**
 * Create the chevron separator SVG element
 */
const createChevronSeparator = (): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'public-good-icon public-good-icon--chevron-right')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('height', '18')
  svg.setAttribute('width', '18')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z')

  svg.appendChild(path)
  return svg
}

/**
 * Create the back arrow SVG element for mobile
 */
const createBackArrow = (): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'public-good-icon public-good-icon--chevron-left')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('height', '24')
  svg.setAttribute('width', '24')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z')

  svg.appendChild(path)
  return svg
}

/**
 * Create a Breadcrumb component
 */
export const createBreadcrumb = (config: BreadcrumbConfig): BreadcrumbComponent => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  if (!finalConfig.items || finalConfig.items.length === 0) {
    throw new Error('Breadcrumb requires at least one item')
  }

  // Create nav container
  const nav = createElement('nav', {
    class: `public-good-breadcrumb${finalConfig.classes ? ` ${finalConfig.classes}` : ''}`,
    'aria-label': finalConfig.labelText
  })

  // Add custom attributes to nav
  if (finalConfig.attributes) {
    Object.entries(finalConfig.attributes).forEach(([key, value]) => {
      nav.setAttribute(key, value)
    })
  }

  // Create ordered list
  const list = createElement('ol', {
    class: 'public-good-breadcrumb__list'
  }) as HTMLOListElement

  // Create breadcrumb items
  finalConfig.items.forEach((item, index) => {
    const listItem = createElement('li', {
      class: 'public-good-breadcrumb__item'
    })

    if (item.href) {
      // Create link element
      const link = createElement('a', {
        class: 'public-good-breadcrumb__link',
        href: item.href
      })

      // Add custom attributes to link
      if (item.attributes) {
        Object.entries(item.attributes).forEach(([key, value]) => {
          link.setAttribute(key, value)
        })
      }

      link.textContent = item.text
      listItem.appendChild(link)
    } else {
      // Create text span for non-clickable items
      const span = createElement('span', {
        class: 'public-good-breadcrumb__text'
      })
      
      // Add custom attributes to span
      if (item.attributes) {
        Object.entries(item.attributes).forEach(([key, value]) => {
          span.setAttribute(key, value)
        })
      }

      span.textContent = item.text
      listItem.appendChild(span)
    }

    // Add chevron separator (except for last item)
    if (index < finalConfig.items.length - 1) {
      const separator = createChevronSeparator()
      listItem.appendChild(separator)
    }

    list.appendChild(listItem)
  })

  nav.appendChild(list)

  // Create mobile back link (shows the last item as a back link)
  const lastItem = finalConfig.items[finalConfig.items.length - 1]!
  let backLink: HTMLAnchorElement | undefined

  if (lastItem.href) {
    const backParagraph = createElement('p', {
      class: 'public-good-breadcrumb__back'
    })

    backLink = createElement('a', {
      class: 'public-good-breadcrumb__backlink',
      href: lastItem.href
    }) as HTMLAnchorElement

    // Add custom attributes to back link
    if (lastItem.attributes) {
      Object.entries(lastItem.attributes).forEach(([key, value]) => {
        backLink!.setAttribute(key, value)
      })
    }

    // Add back arrow icon
    const backArrow = createBackArrow()
    backLink.appendChild(backArrow)

    // Add visually hidden "Back to" text for screen readers
    const hiddenText = createElement('span', {
      class: 'public-good-u-visually-hidden'
    })
    hiddenText.textContent = `${t('nav.backTo')} `
    backLink.appendChild(hiddenText)

    // Add visible back text
    const backText = document.createTextNode(lastItem.text)
    backLink.appendChild(backText)

    backParagraph.appendChild(backLink)
    nav.appendChild(backParagraph)
  }

  // Event handlers for analytics
  const handleBreadcrumbClick = (event: Event): void => {
    const target = event.target as HTMLElement
    const link = target.closest('.public-good-breadcrumb__link, .public-good-breadcrumb__backlink')
    
    if (link) {
      const customEvent = new CustomEvent('public-good:breadcrumb:click', {
        bubbles: true,
        detail: {
          text: link.textContent?.trim(),
          href: (link as HTMLAnchorElement).href,
          type: link.classList.contains('public-good-breadcrumb__backlink') ? 'mobile-back' : 'breadcrumb'
        }
      })
      link.dispatchEvent(customEvent)
    }
  }

  // Add event listeners
  nav.addEventListener('click', handleBreadcrumbClick)

  // Return component instance
  const component: BreadcrumbComponent = {
    element: nav,
    nav: nav,
    list: list,
    backLink: backLink,
    destroy: (): void => {
      nav.removeEventListener('click', handleBreadcrumbClick)
      nav.remove()
    }
  }

  return component
}

/**
 * Initialize all breadcrumbs on the page
 */
export const initializeBreadcrumbs = (container: Document | Element = document): BreadcrumbComponent[] => {
  const breadcrumbs: BreadcrumbComponent[] = []
  const elements = container.querySelectorAll('[data-public-good-breadcrumb]')

  elements.forEach((element) => {
    try {
      // Extract configuration from data attributes
      const itemsData = element.getAttribute('data-items')
      if (!itemsData) {
        console.warn('Breadcrumb element missing data-items attribute')
        return
      }

      let items: BreadcrumbItem[]
      try {
        items = JSON.parse(itemsData)
      } catch (error) {
        console.warn('Failed to parse breadcrumb items:', error)
        return
      }

      const config: BreadcrumbConfig = {
        items,
        ...(element.getAttribute('data-classes') && { classes: element.getAttribute('data-classes')! }),
        ...(element.getAttribute('data-label-text') && { labelText: element.getAttribute('data-label-text')! }),
        attributes: {}
      }

      // Parse additional attributes
      const attributesData = element.getAttribute('data-attributes')
      if (attributesData) {
        try {
          config.attributes = JSON.parse(attributesData)
        } catch (error) {
          console.warn('Failed to parse breadcrumb attributes:', error)
        }
      }

      // Create component and replace element
      const breadcrumb = createBreadcrumb(config)
      element.parentNode?.replaceChild(breadcrumb.element, element)
      breadcrumbs.push(breadcrumb)
    } catch (error) {
      console.error('Failed to initialize breadcrumb:', error)
    }
  })

  return breadcrumbs
}

/**
 * Create a breadcrumb from the current page URL
 */
export const createBreadcrumbFromUrl = (
  baseUrl = '/',
  urlMappings: Record<string, string> = {},
  config: Omit<BreadcrumbConfig, 'items'> = {}
): BreadcrumbComponent => {
  const pathname = window.location.pathname
  const pathParts = pathname.split('/').filter(Boolean)
  
  const items: BreadcrumbItem[] = [
    {
      text: t('nav.home'),
      href: baseUrl
    }
  ]

  // Build breadcrumb items from URL path
  let currentPath = baseUrl
  pathParts.forEach((part, index) => {
    currentPath = currentPath.endsWith('/') ? currentPath + part : currentPath + '/' + part
    
    // Use custom mapping if available, otherwise use the path part
    const text = urlMappings[currentPath] || urlMappings[part] || part.replace(/-/g, ' ')
    
    // Don't add href for the last item (current page)
    const isLastItem = index === pathParts.length - 1
    const item: BreadcrumbItem = {
      text: text.charAt(0).toUpperCase() + text.slice(1)
    }
    
    if (!isLastItem) {
      item.href = currentPath
    }
    
    items.push(item)
  })

  return createBreadcrumb({
    ...config,
    items
  })
}

/**
 * Utility function to get breadcrumb structured data for SEO
 */
export const getBreadcrumbStructuredData = (items: BreadcrumbItem[]): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.text,
      ...(item.href && { item: item.href })
    }))
  }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializeBreadcrumbs())
} else {
  initializeBreadcrumbs()
}