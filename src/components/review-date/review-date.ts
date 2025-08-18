/**
 * Review Date Component
 * 
 * Creates review date displays following NHS UK Design System patterns for showing page currency.
 * Used to reassure users that content is up to date by displaying when pages were last reviewed
 * and when they will be reviewed next.
 * 
 * Features:
 * - Last reviewed and next review date display
 * - Automatic date formatting
 * - Support for custom date formats
 * - Accessibility-focused markup
 * - Data attribute initialization
 * - TypeScript support with full type safety
 * 
 * Note: The standalone Review Date component has been deprecated by NHS UK.
 * This implementation supports the current pattern for showing page currency.
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Review date configuration
 */
export interface ReviewDateConfig {
  id?: string
  lastReviewed: string | Date
  nextReview?: string | Date
  dateFormat?: 'short' | 'long' | 'custom'
  customFormat?: Intl.DateTimeFormatOptions
  locale?: string
  showTime?: boolean
  prefix?: string
  separator?: string
  classes?: string
  attributes?: Record<string, string>
}

/**
 * Review date component result
 */
export interface ReviewDateResult {
  element: HTMLElement
  config: ReviewDateConfig
  updateLastReviewed: (date: string | Date) => void
  updateNextReview: (date: string | Date) => void
  setDateFormat: (format: 'short' | 'long' | 'custom', customFormat?: Intl.DateTimeFormatOptions) => void
  destroy: () => void
}

/**
 * Default date format options
 */
const DEFAULT_DATE_FORMATS: Record<string, Intl.DateTimeFormatOptions> = {
  short: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' }
}

/**
 * Creates a review date component
 */
export function createReviewDate(config: ReviewDateConfig): ReviewDateResult {
  const id = config.id || generateUniqueId('review-date')
  
  // Set defaults
  if (!config.id) {
    config.id = id
  }
  if (!config.dateFormat) {
    config.dateFormat = 'long'
  }
  if (!config.locale) {
    config.locale = 'en-GB'
  }
  if (config.showTime === undefined) {
    config.showTime = false
  }
  if (!config.prefix) {
    config.prefix = 'Page'
  }
  if (!config.separator) {
    config.separator = '<br>'
  }
  
  // Create review date container
  const reviewDate = document.createElement('p')
  reviewDate.className = 'public-good-review-date'
  reviewDate.id = id
  
  // Apply custom classes
  if (config.classes) {
    reviewDate.classList.add(...config.classes.split(' '))
  }
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      reviewDate.setAttribute(key, value)
    })
  }
  
  // Function to format dates
  function formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to review date component:', date)
      return 'Invalid date'
    }
    
    let formatOptions: Intl.DateTimeFormatOptions
    
    if (config.dateFormat === 'custom' && config.customFormat) {
      formatOptions = config.customFormat
    } else {
      formatOptions = DEFAULT_DATE_FORMATS[config.dateFormat || 'long']!
    }
    
    // Add time if requested
    if (config.showTime) {
      formatOptions = {
        ...formatOptions,
        hour: '2-digit',
        minute: '2-digit'
      }
    }
    
    try {
      return new Intl.DateTimeFormat(config.locale, formatOptions).format(dateObj)
    } catch (error) {
      console.warn('Error formatting date:', error)
      return dateObj.toLocaleDateString(config.locale)
    }
  }
  
  // Function to update the review date content
  function updateContent(): void {
    // Handle special case for "Last updated" prefix
    const isLastUpdated = config.prefix === 'Last updated'
    const lastReviewedText = isLastUpdated 
      ? `${config.prefix}: ${formatDate(config.lastReviewed)}`
      : `${config.prefix} last reviewed: ${formatDate(config.lastReviewed)}`
    
    let content = lastReviewedText
    
    if (config.nextReview) {
      const nextReviewText = `Next review due: ${formatDate(config.nextReview)}`
      content += config.separator + nextReviewText
    }
    
    reviewDate.innerHTML = content
  }
  
  // Initial content update
  updateContent()
  
  // Create result object
  const result: ReviewDateResult = {
    element: reviewDate,
    config,
    
    updateLastReviewed(date: string | Date): void {
      config.lastReviewed = date
      updateContent()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:review-date:last-reviewed-changed', {
        detail: { 
          lastReviewed: date,
          formattedDate: formatDate(date),
          element: reviewDate,
          config: config 
        },
        bubbles: true
      })
      reviewDate.dispatchEvent(event)
    },
    
    updateNextReview(date: string | Date): void {
      config.nextReview = date
      updateContent()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:review-date:next-review-changed', {
        detail: { 
          nextReview: date,
          formattedDate: formatDate(date),
          element: reviewDate,
          config: config 
        },
        bubbles: true
      })
      reviewDate.dispatchEvent(event)
    },
    
    setDateFormat(format: 'short' | 'long' | 'custom', customFormat?: Intl.DateTimeFormatOptions): void {
      config.dateFormat = format
      if (format === 'custom' && customFormat) {
        config.customFormat = customFormat
      }
      updateContent()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:review-date:format-changed', {
        detail: { 
          format,
          customFormat,
          element: reviewDate,
          config: config 
        },
        bubbles: true
      })
      reviewDate.dispatchEvent(event)
    },
    
    destroy(): void {
      reviewDate.remove()
      
      // Dispatch custom event
      const event = new CustomEvent('public-good:review-date:destroyed', {
        detail: { element: reviewDate, config: config },
        bubbles: true
      })
      document.dispatchEvent(event)
    }
  }
  
  // Dispatch creation event
  const creationEvent = new CustomEvent('public-good:review-date:created', {
    detail: { element: reviewDate, config: config },
    bubbles: true
  })
  reviewDate.dispatchEvent(creationEvent)
  
  return result
}

/**
 * Creates a simple review date with current NHS pattern styling
 */
export function createSimpleReviewDate(
  lastReviewed: string | Date,
  nextReview?: string | Date,
  options: Partial<ReviewDateConfig> = {}
): ReviewDateResult {
  const config: ReviewDateConfig = {
    lastReviewed,
    classes: 'public-good-body-s public-good-u-secondary-text-color public-good-u-margin-top-7 public-good-u-margin-bottom-0',
    ...options
  }
  if (nextReview !== undefined) {
    config.nextReview = nextReview
  }
  return createReviewDate(config)
}

/**
 * Creates a review date with short date format
 */
export function createShortReviewDate(
  lastReviewed: string | Date,
  nextReview?: string | Date,
  options: Partial<ReviewDateConfig> = {}
): ReviewDateResult {
  const config: ReviewDateConfig = {
    lastReviewed,
    dateFormat: 'short',
    ...options
  }
  if (nextReview !== undefined) {
    config.nextReview = nextReview
  }
  return createReviewDate(config)
}

/**
 * Creates a review date with custom formatting
 */
export function createCustomReviewDate(
  lastReviewed: string | Date,
  nextReview: string | Date | undefined,
  customFormat: Intl.DateTimeFormatOptions,
  options: Partial<ReviewDateConfig> = {}
): ReviewDateResult {
  const config: ReviewDateConfig = {
    lastReviewed,
    dateFormat: 'custom',
    customFormat,
    ...options
  }
  if (nextReview !== undefined) {
    config.nextReview = nextReview
  }
  return createReviewDate(config)
}

/**
 * Creates a review date showing only last reviewed (no next review)
 */
export function createLastReviewedOnly(
  lastReviewed: string | Date,
  options: Partial<ReviewDateConfig> = {}
): ReviewDateResult {
  return createReviewDate({
    lastReviewed,
    prefix: 'Last updated',
    ...options
  })
}

/**
 * Calculate next review date based on review frequency
 */
export function calculateNextReview(
  lastReviewed: string | Date,
  frequencyMonths: number = 36
): Date {
  const lastDate = typeof lastReviewed === 'string' ? new Date(lastReviewed) : lastReviewed
  const nextDate = new Date(lastDate)
  nextDate.setMonth(nextDate.getMonth() + frequencyMonths)
  return nextDate
}

/**
 * Check if content is due for review
 */
export function isDueForReview(nextReview: string | Date, warningDays: number = 30): boolean {
  const nextDate = typeof nextReview === 'string' ? new Date(nextReview) : nextReview
  const warningDate = new Date()
  warningDate.setDate(warningDate.getDate() + warningDays)
  
  return nextDate <= warningDate
}

/**
 * Initialize all review date components from data attributes in the DOM
 */
export function initializeReviewDates(): ReviewDateResult[] {
  const elements = document.querySelectorAll('[data-public-good-review-date]')
  const components: ReviewDateResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<ReviewDateConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const lastReviewed = element.getAttribute('data-last-reviewed')
      if (lastReviewed) config.lastReviewed = lastReviewed
      
      const nextReview = element.getAttribute('data-next-review')
      if (nextReview) config.nextReview = nextReview
      
      const dateFormat = element.getAttribute('data-date-format')
      if (dateFormat && ['short', 'long', 'custom'].includes(dateFormat)) {
        config.dateFormat = dateFormat as 'short' | 'long' | 'custom'
      }
      
      const locale = element.getAttribute('data-locale')
      if (locale) config.locale = locale
      
      const showTime = element.getAttribute('data-show-time')
      if (showTime) config.showTime = showTime === 'true'
      
      const prefix = element.getAttribute('data-prefix')
      if (prefix) config.prefix = prefix
      
      const separator = element.getAttribute('data-separator')
      if (separator) config.separator = separator
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      // Parse custom format
      const customFormat = element.getAttribute('data-custom-format')
      if (customFormat) {
        try {
          config.customFormat = JSON.parse(customFormat)
        } catch (error) {
          console.warn('Invalid JSON in data-custom-format attribute:', error)
        }
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
      
      // Ensure required fields are provided
      if (!config.lastReviewed) {
        console.warn('Review date component requires a last reviewed date')
        return
      }
      
      // Create the review date component
      const reviewDate = createReviewDate(config as ReviewDateConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(reviewDate.element, element)
      components.push(reviewDate)
      
    } catch (error) {
      console.error('Error initializing review date component:', error)
    }
  })
  
  return components
}

// Auto-initialize review date components when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReviewDates)
  } else {
    initializeReviewDates()
  }
}