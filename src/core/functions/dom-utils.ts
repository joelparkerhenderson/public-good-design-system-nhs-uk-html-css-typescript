/**
 * Public Good Design System - DOM Utilities
 * Helper functions for DOM manipulation and queries
 */

/**
 * Generate unique ID with optional prefix
 */
export const generateUniqueId = (prefix: string = 'id'): string => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${randomPart}`
}

/**
 * Safely query a single element
 */
export const querySelector = <T extends Element = Element>(
  selector: string,
  context: Document | Element = document
): T | null => {
  try {
    return context.querySelector<T>(selector)
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error)
    return null
  }
}

/**
 * Safely query multiple elements
 */
export const querySelectorAll = <T extends Element = Element>(
  selector: string,
  context: Document | Element = document
): T[] => {
  try {
    return Array.from(context.querySelectorAll<T>(selector))
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error)
    return []
  }
}

/**
 * Get element by ID with type safety
 */
export const getElementById = <T extends HTMLElement = HTMLElement>(
  id: string
): T | null => {
  const element = document.getElementById(id)
  return element as T | null
}

/**
 * Create element with attributes and content
 */
export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes?: Record<string, string>,
  content?: string
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName)
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
  }
  
  if (content) {
    element.textContent = content
  }
  
  return element
}

/**
 * Add CSS class with safety checks
 */
export const addClass = (element: Element, className: string): void => {
  if (element && className) {
    element.classList.add(className)
  }
}

/**
 * Remove CSS class with safety checks
 */
export const removeClass = (element: Element, className: string): void => {
  if (element && className) {
    element.classList.remove(className)
  }
}

/**
 * Toggle CSS class with safety checks
 */
export const toggleClass = (
  element: Element,
  className: string,
  force?: boolean
): boolean => {
  if (!element || !className) {
    return false
  }
  return element.classList.toggle(className, force)
}

/**
 * Check if element has CSS class
 */
export const hasClass = (element: Element, className: string): boolean => {
  if (!element || !className) {
    return false
  }
  return element.classList.contains(className)
}

/**
 * Set multiple attributes on an element
 */
export const setAttributes = (
  element: Element,
  attributes: Record<string, string>
): void => {
  if (!element || !attributes) {
    return
  }
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

/**
 * Get attribute with fallback
 */
export const getAttribute = (
  element: Element,
  attributeName: string,
  fallback: string = ''
): string => {
  if (!element || !attributeName) {
    return fallback
  }
  
  return element.getAttribute(attributeName) ?? fallback
}

/**
 * Remove multiple attributes from an element
 */
export const removeAttributes = (
  element: Element,
  attributeNames: string[]
): void => {
  if (!element || !attributeNames.length) {
    return
  }
  
  attributeNames.forEach(name => {
    element.removeAttribute(name)
  })
}

/**
 * Check if element is visible
 */
export const isVisible = (element: Element): boolean => {
  if (!element) {
    return false
  }
  
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  )
}

/**
 * Check if element is focusable
 */
export const isFocusable = (element: Element): boolean => {
  if (!element) {
    return false
  }
  
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ]
  
  return focusableSelectors.some(selector => element.matches(selector))
}

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: Element): Element[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')
  
  return querySelectorAll(focusableSelectors, container).filter(isVisible)
}

/**
 * Safely focus an element
 */
export const focusElement = (element: Element): boolean => {
  if (!element || !isFocusable(element)) {
    return false
  }
  
  try {
    ;(element as HTMLElement).focus()
    return document.activeElement === element
  } catch (error) {
    console.warn('Failed to focus element:', error)
    return false
  }
}

/**
 * Dispatch custom event
 */
export const dispatchEvent = (
  element: Element,
  eventType: string,
  detail?: unknown
): boolean => {
  if (!element || !eventType) {
    return false
  }
  
  try {
    const event = new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
      detail
    })
    
    return element.dispatchEvent(event)
  } catch (error) {
    console.warn('Failed to dispatch event:', error)
    return false
  }
}