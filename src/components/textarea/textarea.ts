/**
 * Textarea Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides multi-line text input with form integration and accessibility features.
 */

/**
 * Configuration options for textarea creation
 */
export interface TextareaOptions {
  id?: string;
  name?: string;
  label: string;
  hint?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  maxlength?: number;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  classes?: string;
  attributes?: Record<string, string>;
  errorMessage?: string;
  spellcheck?: boolean;
  autocomplete?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * Configuration for the Textarea class
 */
export interface TextareaConfig {
  autoResize?: boolean;
  trackChanges?: boolean;
  validateOnBlur?: boolean;
  validateOnInput?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  onInput?: (value: string, textarea: HTMLTextAreaElement) => void;
  onBlur?: (value: string, textarea: HTMLTextAreaElement) => void;
  onFocus?: (textarea: HTMLTextAreaElement) => void;
  validator?: (value: string) => string | null;
}

/**
 * Enhanced Textarea class for managing interactive textareas
 */
export class Textarea {
  private element: HTMLElement;
  private textarea: HTMLTextAreaElement;
  private config: TextareaConfig;
  private errorElement: HTMLElement | null = null;
  private characterCountElement: HTMLElement | null = null;
  private initialHeight: number = 0;

  constructor(element: HTMLElement, config: TextareaConfig = {}) {
    if (!element) {
      throw new Error('Textarea component requires a container element');
    }

    this.element = element;
    this.config = {
      autoResize: false,
      trackChanges: true,
      validateOnBlur: false,
      validateOnInput: false,
      showCharacterCount: false,
      ...config
    };

    const textarea = element.querySelector('textarea');
    if (!textarea) {
      throw new Error('Textarea component requires a textarea element');
    }

    this.textarea = textarea;
    this.init();
  }

  private init(): void {
    this.element.classList.add('public-good-form-group');
    this.textarea.classList.add('public-good-textarea');
    
    // Store initial height for auto-resize
    if (this.config.autoResize) {
      this.initialHeight = this.textarea.scrollHeight;
      this.textarea.style.minHeight = `${this.initialHeight}px`;
    }

    // Setup character count if enabled
    if (this.config.showCharacterCount || this.config.maxLength) {
      this.setupCharacterCount();
    }

    // Setup event listeners
    this.setupEventListeners();

    // Initial validation if value exists
    if (this.textarea.value && this.config.validator) {
      this.validateTextarea();
    }
  }

  private setupEventListeners(): void {
    // Input event
    this.textarea.addEventListener('input', (event) => {
      const target = event.target as HTMLTextAreaElement;
      
      if (this.config.autoResize) {
        this.autoResize();
      }
      
      if (this.config.showCharacterCount || this.config.maxLength) {
        this.updateCharacterCount();
      }
      
      if (this.config.validateOnInput && this.config.validator) {
        this.validateTextarea();
      }
      
      if (this.config.onInput) {
        this.config.onInput(target.value, target);
      }

      // Emit custom event
      this.element.dispatchEvent(new CustomEvent('textarea:input', {
        detail: { value: target.value, textarea: target }
      }));
    });

    // Blur event
    this.textarea.addEventListener('blur', (event) => {
      const target = event.target as HTMLTextAreaElement;
      
      if (this.config.validateOnBlur && this.config.validator) {
        this.validateTextarea();
      }
      
      if (this.config.onBlur) {
        this.config.onBlur(target.value, target);
      }

      // Emit custom event
      this.element.dispatchEvent(new CustomEvent('textarea:blur', {
        detail: { value: target.value, textarea: target }
      }));
    });

    // Focus event
    this.textarea.addEventListener('focus', (event) => {
      const target = event.target as HTMLTextAreaElement;
      
      if (this.config.onFocus) {
        this.config.onFocus(target);
      }

      // Emit custom event
      this.element.dispatchEvent(new CustomEvent('textarea:focus', {
        detail: { textarea: target }
      }));
    });

    // Handle paste events for auto-resize
    if (this.config.autoResize) {
      this.textarea.addEventListener('paste', () => {
        // Use setTimeout to allow paste to complete
        setTimeout(() => this.autoResize(), 0);
      });
    }
  }

  private setupCharacterCount(): void {
    // Create character count element if it doesn't exist
    let countElement = this.element.querySelector('.public-good-character-count__status');
    
    if (!countElement) {
      countElement = document.createElement('div');
      countElement.className = 'public-good-character-count__status';
      countElement.setAttribute('aria-live', 'polite');
      
      // Insert after textarea
      this.textarea.parentNode?.insertBefore(countElement, this.textarea.nextSibling);
    }
    
    this.characterCountElement = countElement as HTMLElement;
    
    // Set aria-describedby on textarea
    const existingDescribedBy = this.textarea.getAttribute('aria-describedby') || '';
    const countId = `${this.textarea.id || 'textarea'}-count`;
    this.characterCountElement.id = countId;
    
    const describedBy = existingDescribedBy 
      ? `${existingDescribedBy} ${countId}`
      : countId;
    this.textarea.setAttribute('aria-describedby', describedBy);
    
    // Initial count update
    this.updateCharacterCount();
  }

  private updateCharacterCount(): void {
    if (!this.characterCountElement) return;
    
    const currentLength = this.textarea.value.length;
    const maxLength = this.config.maxLength || parseInt(this.textarea.getAttribute('maxlength') || '0', 10);
    
    if (maxLength > 0) {
      const remaining = maxLength - currentLength;
      const isOverLimit = remaining < 0;
      
      this.characterCountElement.textContent = isOverLimit
        ? `${Math.abs(remaining)} characters over limit`
        : `${remaining} characters remaining`;
      
      this.characterCountElement.classList.toggle('public-good-character-count__status--error', isOverLimit);
      this.textarea.classList.toggle('public-good-textarea--error', isOverLimit);
    } else {
      this.characterCountElement.textContent = `${currentLength} characters`;
    }
  }

  private autoResize(): void {
    if (!this.config.autoResize) return;
    
    // Reset height to auto to get the correct scrollHeight
    this.textarea.style.height = 'auto';
    
    // Calculate new height
    const newHeight = Math.max(this.initialHeight, this.textarea.scrollHeight);
    
    // Set the new height
    this.textarea.style.height = `${newHeight}px`;
  }

  private validateTextarea(): boolean {
    if (!this.config.validator) return true;
    
    const errorMessage = this.config.validator(this.textarea.value);
    
    if (errorMessage) {
      this.setError(errorMessage);
      return false;
    } else {
      this.clearError();
      return true;
    }
  }

  /**
   * Set error state and message
   */
  setError(message: string): void {
    // Add error classes
    this.element.classList.add('public-good-form-group--error');
    this.textarea.classList.add('public-good-textarea--error');
    
    // Create or update error message element
    if (!this.errorElement) {
      this.errorElement = document.createElement('span');
      this.errorElement.className = 'public-good-error-message';
      this.errorElement.id = `${this.textarea.id || 'textarea'}-error`;
      
      // Insert before textarea
      this.textarea.parentNode?.insertBefore(this.errorElement, this.textarea);
    }
    
    this.errorElement.textContent = message;
    
    // Update aria-describedby
    const existingDescribedBy = this.textarea.getAttribute('aria-describedby') || '';
    const errorId = this.errorElement.id;
    
    if (!existingDescribedBy.includes(errorId)) {
      const describedBy = existingDescribedBy 
        ? `${existingDescribedBy} ${errorId}`
        : errorId;
      this.textarea.setAttribute('aria-describedby', describedBy);
    }

    // Emit error event
    this.element.dispatchEvent(new CustomEvent('textarea:error', {
      detail: { message, textarea: this.textarea }
    }));
  }

  /**
   * Clear error state
   */
  clearError(): void {
    // Remove error classes
    this.element.classList.remove('public-good-form-group--error');
    this.textarea.classList.remove('public-good-textarea--error');
    
    // Remove error message
    if (this.errorElement) {
      const errorId = this.errorElement.id;
      this.errorElement.remove();
      this.errorElement = null;
      
      // Update aria-describedby
      const describedBy = this.textarea.getAttribute('aria-describedby') || '';
      const newDescribedBy = describedBy.replace(errorId, '').trim();
      
      if (newDescribedBy) {
        this.textarea.setAttribute('aria-describedby', newDescribedBy);
      } else {
        this.textarea.removeAttribute('aria-describedby');
      }
    }

    // Emit error cleared event
    this.element.dispatchEvent(new CustomEvent('textarea:error-cleared', {
      detail: { textarea: this.textarea }
    }));
  }

  /**
   * Get current value
   */
  getValue(): string {
    return this.textarea.value;
  }

  /**
   * Set value
   */
  setValue(value: string): void {
    this.textarea.value = value;
    
    if (this.config.autoResize) {
      this.autoResize();
    }
    
    if (this.config.showCharacterCount || this.config.maxLength) {
      this.updateCharacterCount();
    }
    
    if (this.config.validator) {
      this.validateTextarea();
    }
  }

  /**
   * Focus the textarea
   */
  focus(): void {
    this.textarea.focus();
  }

  /**
   * Blur the textarea
   */
  blur(): void {
    this.textarea.blur();
  }

  /**
   * Validate the textarea
   */
  validate(): boolean {
    return this.validateTextarea();
  }

  /**
   * Enable or disable the textarea
   */
  setDisabled(disabled: boolean): void {
    this.textarea.disabled = disabled;
    this.element.classList.toggle('public-good-form-group--disabled', disabled);
  }

  /**
   * Set readonly state
   */
  setReadonly(readonly: boolean): void {
    this.textarea.readOnly = readonly;
    this.element.classList.toggle('public-good-form-group--readonly', readonly);
  }

  /**
   * Get the textarea element
   */
  getTextarea(): HTMLTextAreaElement {
    return this.textarea;
  }

  /**
   * Get the container element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Destroy the textarea instance
   */
  destroy(): void {
    // Remove event listeners by cloning elements
    const newTextarea = this.textarea.cloneNode(true) as HTMLTextAreaElement;
    this.textarea.parentNode?.replaceChild(newTextarea, this.textarea);
    
    // Remove added elements
    if (this.errorElement) {
      this.errorElement.remove();
    }
    
    if (this.characterCountElement && this.characterCountElement.parentNode) {
      this.characterCountElement.remove();
    }
  }
}

/**
 * Create a textarea element with form group structure
 */
export function createTextarea(options: TextareaOptions): HTMLElement {
  const formGroup = document.createElement('div');
  formGroup.className = `public-good-form-group ${options.classes || ''}`;
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      formGroup.setAttribute(key, value);
    });
  }

  // Create label
  const label = document.createElement('label');
  label.className = 'public-good-label';
  label.textContent = options.label;
  
  const textareaId = options.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  label.setAttribute('for', textareaId);
  
  formGroup.appendChild(label);

  // Create hint if provided
  let hintId: string | undefined;
  if (options.hint) {
    const hint = document.createElement('div');
    hint.className = 'public-good-hint';
    hintId = `${textareaId}-hint`;
    hint.id = hintId;
    hint.textContent = options.hint;
    formGroup.appendChild(hint);
  }

  // Create error message if provided
  let errorId: string | undefined;
  if (options.errorMessage) {
    const error = document.createElement('span');
    error.className = 'public-good-error-message';
    errorId = `${textareaId}-error`;
    error.id = errorId;
    error.textContent = options.errorMessage;
    formGroup.appendChild(error);
    
    formGroup.classList.add('public-good-form-group--error');
  }

  // Create textarea
  const textarea = document.createElement('textarea');
  textarea.className = `public-good-textarea ${options.errorMessage ? 'public-good-textarea--error' : ''}`;
  textarea.id = textareaId;
  
  if (options.name) textarea.name = options.name;
  if (options.placeholder) textarea.placeholder = options.placeholder;
  if (options.value) textarea.value = options.value;
  if (options.rows) textarea.rows = options.rows;
  if (options.maxlength) textarea.maxLength = options.maxlength;
  if (options.required) textarea.required = true;
  if (options.disabled) textarea.disabled = true;
  if (options.readonly) textarea.readOnly = true;
  if (options.spellcheck !== undefined) textarea.spellcheck = options.spellcheck;
  if (options.autocomplete) textarea.autocomplete = options.autocomplete;

  // Set resize style
  if (options.resize) {
    textarea.style.resize = options.resize;
  }

  // Set aria-describedby
  const describedByIds = [hintId, errorId].filter(Boolean);
  if (describedByIds.length > 0) {
    textarea.setAttribute('aria-describedby', describedByIds.join(' '));
  }

  formGroup.appendChild(textarea);

  return formGroup;
}

/**
 * Initialize textareas from existing markup
 */
export function initializeTextareas(scope: Document | HTMLElement = document): Textarea[] {
  const textareaElements = scope.querySelectorAll('[data-module="public-good-textarea"]') as NodeListOf<HTMLElement>;
  const instances: Textarea[] = [];
  
  textareaElements.forEach(element => {
    try {
      const config: TextareaConfig = {};
      
      // Parse configuration from data attributes
      if (element.hasAttribute('data-auto-resize')) {
        config.autoResize = element.getAttribute('data-auto-resize') === 'true';
      }
      
      if (element.hasAttribute('data-validate-on-blur')) {
        config.validateOnBlur = element.getAttribute('data-validate-on-blur') === 'true';
      }
      
      if (element.hasAttribute('data-validate-on-input')) {
        config.validateOnInput = element.getAttribute('data-validate-on-input') === 'true';
      }
      
      if (element.hasAttribute('data-show-character-count')) {
        config.showCharacterCount = element.getAttribute('data-show-character-count') === 'true';
      }
      
      if (element.hasAttribute('data-max-length')) {
        config.maxLength = parseInt(element.getAttribute('data-max-length') || '0', 10);
      }
      
      const instance = new Textarea(element, config);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize textarea:', error);
    }
  });
  
  return instances;
}

/**
 * Validate textarea accessibility
 */
export function validateTextareaAccessibility(
  scope: Document | HTMLElement = document
): {
  textareas: HTMLElement[];
  issues: string[];
} {
  const textareas = scope.querySelectorAll('textarea') as NodeListOf<HTMLTextAreaElement>;
  const issues: string[] = [];
  
  textareas.forEach((textarea, index) => {
    const textareaNumber = index + 1;
    
    // Check for associated label
    const id = textarea.id;
    if (!id) {
      issues.push(`Textarea ${textareaNumber} should have an id attribute`);
    } else {
      const label = scope.querySelector(`label[for="${id}"]`);
      if (!label) {
        issues.push(`Textarea ${textareaNumber} should have an associated label element`);
      }
    }
    
    // Check for placeholder as label anti-pattern
    if (textarea.placeholder && !scope.querySelector(`label[for="${id}"]`)) {
      issues.push(`Textarea ${textareaNumber} should not rely solely on placeholder text for labeling`);
    }
    
    // Check for aria-describedby consistency
    const describedBy = textarea.getAttribute('aria-describedby');
    if (describedBy) {
      const referencedIds = describedBy.split(' ');
      referencedIds.forEach(refId => {
        if (!scope.querySelector(`#${refId}`)) {
          issues.push(`Textarea ${textareaNumber} references non-existent element #${refId} in aria-describedby`);
        }
      });
    }
    
    // Check for error state consistency
    const hasErrorClass = textarea.classList.contains('public-good-textarea--error');
    const formGroup = textarea.closest('.public-good-form-group');
    const hasFormGroupError = formGroup?.classList.contains('public-good-form-group--error');
    
    if (hasErrorClass !== hasFormGroupError) {
      issues.push(`Textarea ${textareaNumber} error state is inconsistent between textarea and form group`);
    }
    
    // Check for empty labels
    if (id) {
      const label = scope.querySelector(`label[for="${id}"]`);
      if (label && !label.textContent?.trim()) {
        issues.push(`Textarea ${textareaNumber} has an empty label`);
      }
    }
  });
  
  return {
    textareas: Array.from(textareas),
    issues
  };
}