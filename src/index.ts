/**
 * Public Good Design System - Main Entry Point
 * Exports all components, utilities, and functions
 */

// Core utilities
export * from './core/functions/dom-utils'
export * from './core/functions/validation'
export * from './core/functions/i18n'

// Components
export * from './components/action-link/action-link'
export * from './components/back-link/back-link'
export * from './components/breadcrumb/breadcrumb'
export * from './components/button/button'
export * from './components/card/card'
export * from './components/checkboxes/checkboxes'
export * from './components/date-input/date-input'
export * from './components/details/details'
export * from './components/do-dont-list/do-dont-list'
export * from './components/error-message/error-message'
export * from './components/fieldset/fieldset'
export * from './components/footer/footer'
export * from './components/header/header'
export * from './components/image/image'
export * from './components/inset-text/inset-text'
export * from './components/input/input'
export * from './components/pagination/pagination'
export * from './components/panel/panel'
export * from './components/radios/radios'
export * from './components/review-date/review-date'
export * from './components/select/select'

// Initialize the design system
import { initializeI18n } from './core/functions/i18n'

// Auto-initialize i18n when imported
initializeI18n()

// Version
export const version = '1.0.0'

/**
 * Initialize the design system
 * This function can be called to set up global event listeners
 * and perform any necessary initialization
 */
export const initialize = (): void => {
  // Add global keyboard user detection
  const addKeyboardUserClass = (): void => {
    document.body.classList.add('public-good-keyboard-user')
  }
  
  const removeKeyboardUserClass = (): void => {
    document.body.classList.remove('public-good-keyboard-user')
  }
  
  // Detect keyboard usage
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      addKeyboardUserClass()
    }
  })
  
  // Detect mouse usage
  document.addEventListener('mousedown', removeKeyboardUserClass)
  
  // Initialize focus trap for modals and overlays
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Find any open modal or overlay and close it
      const openModal = document.querySelector('[data-public-good-modal-open]')
      if (openModal) {
        const closeEvent = new CustomEvent('public-good:close', {
          bubbles: true,
          cancelable: true
        })
        openModal.dispatchEvent(closeEvent)
      }
    }
  })
  
  console.log(`Public Good Design System v${version} initialized`)
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  initialize()
}