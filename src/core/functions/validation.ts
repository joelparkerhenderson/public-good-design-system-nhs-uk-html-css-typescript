/**
 * Public Good Design System - Validation Utilities
 * Form validation and data validation helpers
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Create a validation result
 */
export const createValidationResult = (
  isValid: boolean,
  errors: string[] = [],
  warnings: string[] = []
): ValidationResult => ({
  isValid,
  errors,
  warnings
})

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = []
  
  if (!email || email.trim() === '') {
    errors.push('Email is required')
    return createValidationResult(false, errors)
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address')
  }
  
  if (email.length > 254) {
    errors.push('Email address is too long')
  }
  
  return createValidationResult(errors.length === 0, errors)
}

/**
 * Required field validation
 */
export const validateRequired = (
  value: string,
  fieldName: string = 'This field'
): ValidationResult => {
  const errors: string[] = []
  
  if (!value || value.trim() === '') {
    errors.push(`${fieldName} is required`)
  }
  
  return createValidationResult(errors.length === 0, errors)
}

/**
 * Minimum length validation
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = 'This field'
): ValidationResult => {
  const errors: string[] = []
  
  if (value && value.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`)
  }
  
  return createValidationResult(errors.length === 0, errors)
}

/**
 * Maximum length validation
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = 'This field'
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  
  if (value && value.length > maxLength) {
    errors.push(`${fieldName} must be no more than ${maxLength} characters long`)
  } else if (value && value.length > maxLength * 0.9) {
    warnings.push(`${fieldName} is approaching the maximum length`)
  }
  
  return createValidationResult(errors.length === 0, errors, warnings)
}

/**
 * Phone number validation (UK format)
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = []
  
  if (!phone || phone.trim() === '') {
    errors.push('Phone number is required')
    return createValidationResult(false, errors)
  }
  
  // Remove all non-numeric characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  
  // UK phone number patterns
  const ukMobileRegex = /^(\+44|0)7\d{9}$/
  const ukLandlineRegex = /^(\+44|0)[1-9]\d{8,9}$/
  
  if (!ukMobileRegex.test(cleanPhone) && !ukLandlineRegex.test(cleanPhone)) {
    errors.push('Please enter a valid UK phone number')
  }
  
  return createValidationResult(errors.length === 0, errors)
}

/**
 * Date validation
 */
export const validateDate = (
  day: string,
  month: string,
  year: string
): ValidationResult => {
  const errors: string[] = []
  
  // Check if all parts are provided
  if (!day || !month || !year) {
    errors.push('Please enter a complete date')
    return createValidationResult(false, errors)
  }
  
  // Convert to numbers
  const dayNum = parseInt(day, 10)
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)
  
  // Basic range checks
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
    errors.push('Day must be between 1 and 31')
  }
  
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    errors.push('Month must be between 1 and 12')
  }
  
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
    errors.push('Please enter a valid year')
  }
  
  // If basic checks pass, validate the actual date
  if (errors.length === 0) {
    const date = new Date(yearNum, monthNum - 1, dayNum)
    
    if (
      date.getDate() !== dayNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getFullYear() !== yearNum
    ) {
      errors.push('Please enter a valid date')
    }
  }
  
  return createValidationResult(errors.length === 0, errors)
}

/**
 * Password strength validation
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  
  if (!password) {
    errors.push('Password is required')
    return createValidationResult(false, errors)
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-z]/.test(password)) {
    warnings.push('Password should contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    warnings.push('Password should contain at least one uppercase letter')
  }
  
  if (!/\d/.test(password)) {
    warnings.push('Password should contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    warnings.push('Password should contain at least one special character')
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password',
    '123456',
    'qwerty',
    'admin',
    'letmein'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Please choose a more secure password')
  }
  
  return createValidationResult(errors.length === 0, errors, warnings)
}

/**
 * Postcode validation (UK format)
 */
export const validatePostcode = (postcode: string): ValidationResult => {
  const errors: string[] = []
  
  if (!postcode || postcode.trim() === '') {
    errors.push('Postcode is required')
    return createValidationResult(false, errors)
  }
  
  // UK postcode regex
  const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i
  
  if (!postcodeRegex.test(postcode.trim())) {
    errors.push('Please enter a valid UK postcode')
  }
  
  return createValidationResult(errors.length === 0, errors)
}

/**
 * Combine multiple validation results
 */
export const combineValidationResults = (
  ...results: ValidationResult[]
): ValidationResult => {
  const allErrors = results.flatMap(result => result.errors)
  const allWarnings = results.flatMap(result => result.warnings)
  const isValid = results.every(result => result.isValid)
  
  return createValidationResult(isValid, allErrors, allWarnings)
}

/**
 * Validate form data against a schema
 */
export const validateFormData = (
  data: Record<string, string>,
  schema: Record<string, (value: string) => ValidationResult>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {}
  
  Object.entries(schema).forEach(([fieldName, validator]) => {
    const value = data[fieldName] || ''
    results[fieldName] = validator(value)
  })
  
  return results
}