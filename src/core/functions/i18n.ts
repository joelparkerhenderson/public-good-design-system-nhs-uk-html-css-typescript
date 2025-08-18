/**
 * Public Good Design System - Internationalization Utilities
 * Simple i18n system for component localization
 */

/**
 * Supported locales
 */
export type Locale = 'en' | 'cy' | 'ga' | 'gd' | 'fr' | 'de' | 'es' | 'ar'

/**
 * Translation key-value pairs
 */
export type Translations = Record<string, string>

/**
 * Locale configuration
 */
export interface LocaleConfig {
  locale: Locale
  direction: 'ltr' | 'rtl'
  translations: Translations
}

/**
 * Default translations for English
 */
const defaultTranslations: Translations = {
  'common.close': 'Close',
  'common.open': 'Open',
  'common.menu': 'Menu',
  'common.search': 'Search',
  'common.submit': 'Submit',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.warning': 'Warning',
  'common.success': 'Success',
  'common.info': 'Information',
  
  // Form related
  'form.required': 'This field is required',
  'form.invalid': 'Please enter a valid value',
  'form.email.invalid': 'Please enter a valid email address',
  'form.phone.invalid': 'Please enter a valid phone number',
  'form.postcode.invalid': 'Please enter a valid postcode',
  'form.date.invalid': 'Please enter a valid date',
  'form.characterCount': 'You have {count} characters remaining',
  'form.characterCountOver': 'You have {count} characters too many',
  
  // Navigation
  'nav.skipToContent': 'Skip to main content',
  'nav.home': 'Home',
  'nav.back': 'Back',
  'nav.backTo': 'Back to',
  'nav.breadcrumb': 'Breadcrumb',
  
  // Components
  'button.login': 'Sign in',
  'button.logout': 'Sign out',
  'details.show': 'Show',
  'details.hide': 'Hide',
  'pagination.previous': 'Previous page',
  'pagination.next': 'Next page',
  'pagination.page': 'Page {page}',
  'tabs.showPanel': 'Show {panel} panel',
  'tabs.hidePanel': 'Hide {panel} panel',
  
  // Card component
  'common.cardHeading': 'Card heading',
  'card.nonUrgentAdvice': 'Non-urgent advice:',
  'card.urgentAdvice': 'Urgent advice:',
  'card.emergencyAdvice': 'Immediate action required:',
  'card.speakToGP': 'Speak to a GP if:',
  'card.urgentGPAppointment': 'Ask for an urgent GP appointment if:',
  'card.call999': 'Call 999 if:',
  
  // Checkboxes component
  'checkboxes.selectAll': 'Select all',
  'checkboxes.unselectAll': 'Unselect all',
  'checkboxes.noneSelected': 'No options selected',
  'checkboxes.multipleSelected': '{count} options selected',
  
  // Date input component
  'dateInput.day': 'Day',
  'dateInput.month': 'Month',
  'dateInput.year': 'Year',
  'dateInput.hint': 'For example, 27 3 2007',
  'dateInput.incomplete': 'Enter a complete date',
  'dateInput.invalid': 'Enter a valid date',
  
  // Details component
  'details.showMore': 'Show more',
  'details.showLess': 'Show less',
  'details.expanded': 'Expanded',
  'details.collapsed': 'Collapsed',
  
  // Error message component
  'errorMessage.prefix': 'Error:',
  
  // Footer component
  'footer.supportLinks': 'Support links',
  'footer.navigation': 'Footer navigation',
  'footer.opensInNewTab': '(opens in new tab)',
  'footer.copyright': '©',
  'footer.copyrightHolder': 'Crown copyright',
  'footer.nhsCopyrightHolder': 'NHS England',
  'footer.accessibility': 'Accessibility statement',
  'footer.contact': 'Contact us',
  'footer.cookies': 'Cookies',
  'footer.privacy': 'Privacy policy',
  'footer.terms': 'Terms and conditions',
  
  // Header component
  'header.logoAlt': 'Organisation logo',
  'header.opensInNewTab': '(opens in new tab)',
  'header.searchLabel': 'Search',
  'header.searchPlaceholder': 'Search',
  'header.searchButton': 'Search',
  'header.searchSuggestions': 'Search suggestions',
  'header.primaryNavigation': 'Primary navigation',
  'header.secondaryNavigation': 'Secondary navigation',
  'header.menuButton': 'Toggle navigation menu',
  'header.menu': 'Menu',
  'header.back': 'Back'
}

/**
 * Current locale state
 */
let currentLocale: Locale = 'en'
let currentTranslations: Translations = { ...defaultTranslations }
let currentDirection: 'ltr' | 'rtl' = 'ltr'

/**
 * Get current locale
 */
export const getCurrentLocale = (): Locale => currentLocale

/**
 * Get current text direction
 */
export const getCurrentDirection = (): 'ltr' | 'rtl' => currentDirection

/**
 * Set locale and translations
 */
export const setLocale = (config: LocaleConfig): void => {
  currentLocale = config.locale
  currentDirection = config.direction
  currentTranslations = { ...defaultTranslations, ...config.translations }
  
  // Update document attributes
  document.documentElement.lang = currentLocale
  document.documentElement.dir = currentDirection
}

/**
 * Get translation for a key
 */
export const t = (key: string, interpolations?: Record<string, string | number>): string => {
  let translation = currentTranslations[key] || key
  
  // Handle interpolations
  if (interpolations) {
    Object.entries(interpolations).forEach(([placeholder, value]) => {
      translation = translation.replace(`{${placeholder}}`, String(value))
    })
  }
  
  return translation
}

/**
 * Add translations to current locale
 */
export const addTranslations = (translations: Translations): void => {
  currentTranslations = { ...currentTranslations, ...translations }
}

/**
 * Format date according to locale
 */
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  try {
    return new Intl.DateTimeFormat(currentLocale, options).format(date)
  } catch (error) {
    console.warn('Date formatting failed, falling back to default:', error)
    return date.toLocaleDateString()
  }
}

/**
 * Format number according to locale
 */
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  try {
    return new Intl.NumberFormat(currentLocale, options).format(number)
  } catch (error) {
    console.warn('Number formatting failed, falling back to default:', error)
    return number.toString()
  }
}

/**
 * Format currency according to locale
 */
export const formatCurrency = (amount: number, currency: string = 'GBP'): string => {
  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  } catch (error) {
    console.warn('Currency formatting failed, falling back to default:', error)
    return `${currency} ${amount}`
  }
}

/**
 * Check if locale uses RTL text direction
 */
export const isRTL = (locale?: Locale): boolean => {
  const rtlLocales: Locale[] = ['ar']
  return rtlLocales.includes(locale || currentLocale)
}

/**
 * Get appropriate text alignment for current locale
 */
export const getTextAlign = (): 'left' | 'right' => {
  return currentDirection === 'rtl' ? 'right' : 'left'
}

/**
 * Get appropriate margin/padding direction for current locale
 */
export const getLogicalProperty = (property: 'start' | 'end'): 'left' | 'right' => {
  if (currentDirection === 'rtl') {
    return property === 'start' ? 'right' : 'left'
  }
  return property === 'start' ? 'left' : 'right'
}

/**
 * Check if a translation key exists
 */
export const hasTranslation = (key: string): boolean => {
  return key in currentTranslations
}

/**
 * Get all available translation keys
 */
export const getTranslationKeys = (): string[] => {
  return Object.keys(currentTranslations)
}

/**
 * Pluralization helper (simple English rules)
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) {
    return t(singular)
  }
  
  if (plural) {
    return t(plural)
  }
  
  // Simple pluralization for English
  const singularTranslation = t(singular)
  if (singularTranslation.endsWith('y')) {
    return singularTranslation.slice(0, -1) + 'ies'
  }
  if (singularTranslation.endsWith('s') || singularTranslation.endsWith('x') || singularTranslation.endsWith('z')) {
    return singularTranslation + 'es'
  }
  return singularTranslation + 's'
}

/**
 * Initialize i18n system with browser locale detection
 */
export const initializeI18n = (): void => {
  // Detect browser locale
  const browserLocale = navigator.language.split('-')[0] as Locale
  const supportedLocales: Locale[] = ['en', 'cy', 'ga', 'gd', 'fr', 'de', 'es', 'ar']
  
  const detectedLocale = supportedLocales.includes(browserLocale) ? browserLocale : 'en'
  
  // Set initial locale
  setLocale({
    locale: detectedLocale,
    direction: isRTL(detectedLocale) ? 'rtl' : 'ltr',
    translations: {}
  })
}