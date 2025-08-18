/**
 * Character Count Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides real-time character or word counting for textarea elements
 * with accessibility features and threshold-based visibility
 */

import { DOMUtils } from '../../core/utils/dom-utils';
import { ValidationUtils } from '../../core/utils/validation-utils';

export interface CharacterCountConfig {
  maxlength?: number;
  maxwords?: number;
  threshold?: number;
}

export interface CharacterCountOptions extends CharacterCountConfig {
  id: string;
  name: string;
  label: {
    text?: string;
    html?: string;
    classes?: string;
    isPageHeading?: boolean;
  };
  hint?: {
    text?: string;
    html?: string;
    classes?: string;
  };
  errorMessage?: {
    text?: string;
    html?: string;
    classes?: string;
  };
  value?: string;
  rows?: number;
  spellcheck?: boolean;
  classes?: string;
  attributes?: Record<string, string>;
  countMessage?: {
    classes?: string;
  };
}

export class CharacterCount {
  private readonly element: HTMLElement;
  private readonly textField: HTMLTextAreaElement | HTMLInputElement;
  private readonly visibleCountMessage: HTMLElement;
  private readonly screenReaderCountMessage: HTMLElement;
  private readonly config: Required<CharacterCountConfig>;
  private readonly maxLength: number;
  private lastInputTimestamp: number | null = null;
  private lastInputValue: string = '';
  private valueChecker: number | null = null;
  private errorMessage: HTMLElement | null = null;

  constructor(element: HTMLElement, config: CharacterCountConfig = {}) {
    this.element = element;
    this.config = {
      threshold: 0,
      ...config,
      ...this.getDatasetConfig(element)
    };

    // Find the text field
    const textField = element.querySelector('.public-good-js-character-count') as HTMLTextAreaElement | HTMLInputElement;
    if (!textField) {
      throw new Error('CharacterCount: Text field with class .public-good-js-character-count not found');
    }
    this.textField = textField;

    // Find existing error message
    this.errorMessage = element.querySelector('.public-good-error-message');

    // Set up count messages
    this.setupCountMessages();

    // Set max length
    this.maxLength = this.config.maxwords ?? this.config.maxlength ?? Infinity;
    
    // Remove hard limit if set
    this.textField.removeAttribute('maxlength');

    // Bind events
    this.bindEvents();

    // Initial update
    this.updateCountMessage();

    // Handle page restore
    window.addEventListener('pageshow', () => this.updateCountMessage());
  }

  private getDatasetConfig(element: HTMLElement): Partial<CharacterCountConfig> {
    const config: Partial<CharacterCountConfig> = {};
    
    if (element.dataset.maxlength) {
      config.maxlength = parseInt(element.dataset.maxlength, 10);
    }
    if (element.dataset.maxwords) {
      config.maxwords = parseInt(element.dataset.maxwords, 10);
    }
    if (element.dataset.threshold) {
      config.threshold = parseInt(element.dataset.threshold, 10);
    }

    return config;
  }

  private setupCountMessages(): void {
    const fieldId = this.textField.id;
    const fallbackMessageId = `${fieldId}-info`;
    
    // Find or create fallback message
    let fallbackMessage = document.getElementById(fallbackMessageId);
    if (!fallbackMessage) {
      fallbackMessage = document.createElement('div');
      fallbackMessage.id = fallbackMessageId;
      fallbackMessage.className = 'public-good-character-count__message';
      const countType = this.config.maxwords ? 'words' : 'characters';
      const maxCount = this.config.maxwords ?? this.config.maxlength ?? 0;
      fallbackMessage.textContent = `You can enter up to ${maxCount} ${countType}`;
      this.textField.insertAdjacentElement('afterend', fallbackMessage);
    }

    // Move fallback message after textarea and hide it
    this.textField.insertAdjacentElement('afterend', fallbackMessage);
    fallbackMessage.classList.add('public-good-u-visually-hidden');

    // Create screen reader count message
    this.screenReaderCountMessage = document.createElement('div');
    this.screenReaderCountMessage.className = 'public-good-character-count__sr-status public-good-u-visually-hidden';
    this.screenReaderCountMessage.setAttribute('aria-live', 'polite');
    this.screenReaderCountMessage.setAttribute('aria-hidden', 'true');
    fallbackMessage.insertAdjacentElement('afterend', this.screenReaderCountMessage);

    // Create visible count message
    this.visibleCountMessage = document.createElement('div');
    this.visibleCountMessage.className = `${fallbackMessage.className} public-good-character-count__status`;
    this.visibleCountMessage.setAttribute('aria-hidden', 'true');
    this.screenReaderCountMessage.insertAdjacentElement('afterend', this.visibleCountMessage);
  }

  private bindEvents(): void {
    this.textField.addEventListener('keyup', () => this.handleKeyUp());
    this.textField.addEventListener('focus', () => this.handleFocus());
    this.textField.addEventListener('blur', () => this.handleBlur());
  }

  private handleKeyUp(): void {
    this.updateCountMessage();
    this.lastInputTimestamp = Date.now();
  }

  private handleFocus(): void {
    this.valueChecker = window.setInterval(() => {
      if (!this.lastInputTimestamp || Date.now() - 500 >= this.lastInputTimestamp) {
        this.checkIfValueChanged();
      }
    }, 1000);
  }

  private handleBlur(): void {
    if (this.valueChecker) {
      window.clearInterval(this.valueChecker);
      this.valueChecker = null;
    }
  }

  private checkIfValueChanged(): void {
    if (this.textField.value !== this.lastInputValue) {
      this.lastInputValue = this.textField.value;
      this.updateCountMessage();
    }
  }

  private updateCountMessage(): void {
    this.updateVisibleCountMessage();
    this.updateScreenReaderCountMessage();
  }

  private updateVisibleCountMessage(): void {
    const remainingCount = this.maxLength - this.count(this.textField.value);
    const isOverLimit = remainingCount < 0;

    // Toggle visibility based on threshold
    this.visibleCountMessage.classList.toggle(
      'public-good-character-count__message--disabled',
      !this.isOverThreshold()
    );

    // Update styles
    if (!this.errorMessage) {
      this.textField.classList.toggle('public-good-textarea--error', isOverLimit);
      this.textField.classList.toggle('public-good-input--error', isOverLimit);
    }
    
    this.visibleCountMessage.classList.toggle('public-good-error-message', isOverLimit);
    this.visibleCountMessage.classList.toggle('public-good-hint', !isOverLimit);

    // Update message
    this.visibleCountMessage.textContent = this.formatCountMessage();
  }

  private updateScreenReaderCountMessage(): void {
    if (this.isOverThreshold()) {
      this.screenReaderCountMessage.removeAttribute('aria-hidden');
    } else {
      this.screenReaderCountMessage.setAttribute('aria-hidden', 'true');
    }

    this.screenReaderCountMessage.textContent = this.formatCountMessage();
  }

  private formatCountMessage(): string {
    const remainingCount = this.maxLength - this.count(this.textField.value);
    const countType = this.config.maxwords ? 'word' : 'character';
    const countTypeDisplay = countType + (Math.abs(remainingCount) === 1 ? '' : 's');
    const verb = remainingCount < 0 ? 'too many' : 'remaining';
    const displayCount = Math.abs(remainingCount);

    return `You have ${displayCount} ${countTypeDisplay} ${verb}`;
  }

  private count(text: string): number {
    if (this.config.maxwords) {
      const tokens = text.match(/\S+/g) || [];
      return tokens.length;
    }
    return text.length;
  }

  private isOverThreshold(): boolean {
    const currentLength = this.count(this.textField.value);
    const thresholdPercent = this.config.threshold;
    const thresholdValue = (this.maxLength * thresholdPercent) / 100;
    return thresholdValue <= currentLength;
  }

  public getCount(): number {
    return this.count(this.textField.value);
  }

  public getRemainingCount(): number {
    return this.maxLength - this.getCount();
  }

  public isOverLimit(): boolean {
    return this.getRemainingCount() < 0;
  }

  public destroy(): void {
    if (this.valueChecker) {
      window.clearInterval(this.valueChecker);
    }
    
    // Remove event listeners
    this.textField.removeEventListener('keyup', () => this.handleKeyUp());
    this.textField.removeEventListener('focus', () => this.handleFocus());
    this.textField.removeEventListener('blur', () => this.handleBlur());
  }
}

/**
 * Create a character count component with textarea
 */
export function createCharacterCount(options: CharacterCountOptions): HTMLElement {
  const {
    id,
    name,
    label,
    hint,
    errorMessage,
    value = '',
    rows = 5,
    spellcheck = true,
    classes = '',
    attributes = {},
    countMessage = {},
    maxlength,
    maxwords,
    threshold = 0
  } = options;

  const wrapper = document.createElement('div');
  wrapper.className = 'public-good-character-count';
  wrapper.setAttribute('data-module', 'public-good-character-count');
  
  if (maxlength) {
    wrapper.setAttribute('data-maxlength', maxlength.toString());
  }
  if (maxwords) {
    wrapper.setAttribute('data-maxwords', maxwords.toString());
  }
  if (threshold) {
    wrapper.setAttribute('data-threshold', threshold.toString());
  }

  // Form group
  const formGroup = document.createElement('div');
  formGroup.className = 'public-good-form-group';
  if (errorMessage) {
    formGroup.classList.add('public-good-form-group--error');
  }

  // Label
  if (label && (label.text || label.html)) {
    const labelElement = document.createElement('label');
    labelElement.className = `public-good-label ${label.classes || ''}`.trim();
    labelElement.setAttribute('for', id);
    
    if (label.isPageHeading) {
      const h1 = document.createElement('h1');
      h1.className = 'public-good-label-wrapper';
      h1.appendChild(labelElement);
      formGroup.appendChild(h1);
    } else {
      formGroup.appendChild(labelElement);
    }
    
    if (label.html) {
      labelElement.innerHTML = label.html;
    } else if (label.text) {
      labelElement.textContent = label.text;
    }
  }

  // Hint
  if (hint && (hint.text || hint.html)) {
    const hintElement = document.createElement('div');
    hintElement.id = `${id}-hint`;
    hintElement.className = `public-good-hint ${hint.classes || ''}`.trim();
    
    if (hint.html) {
      hintElement.innerHTML = hint.html;
    } else if (hint.text) {
      hintElement.textContent = hint.text;
    }
    
    formGroup.appendChild(hintElement);
  }

  // Error message
  if (errorMessage && (errorMessage.text || errorMessage.html)) {
    const errorElement = document.createElement('p');
    errorElement.id = `${id}-error`;
    errorElement.className = `public-good-error-message ${errorMessage.classes || ''}`.trim();
    
    const errorIcon = document.createElement('span');
    errorIcon.className = 'public-good-u-visually-hidden';
    errorIcon.textContent = 'Error: ';
    errorElement.appendChild(errorIcon);
    
    const errorText = document.createElement('span');
    if (errorMessage.html) {
      errorText.innerHTML = errorMessage.html;
    } else if (errorMessage.text) {
      errorText.textContent = errorMessage.text;
    }
    errorElement.appendChild(errorText);
    
    formGroup.appendChild(errorElement);
  }

  // Textarea
  const textarea = document.createElement('textarea');
  textarea.id = id;
  textarea.name = name;
  textarea.className = `public-good-textarea public-good-js-character-count ${classes}`.trim();
  textarea.rows = rows;
  textarea.spellcheck = spellcheck;
  textarea.value = value;

  // Add describedBy attributes
  const describedBy = [];
  if (hint) describedBy.push(`${id}-hint`);
  if (errorMessage) describedBy.push(`${id}-error`);
  describedBy.push(`${id}-info`);
  if (describedBy.length > 0) {
    textarea.setAttribute('aria-describedby', describedBy.join(' '));
  }

  // Add custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    textarea.setAttribute(key, value);
  });

  if (errorMessage) {
    textarea.classList.add('public-good-textarea--error');
  }

  formGroup.appendChild(textarea);

  // Count message hint
  const countMessageElement = document.createElement('div');
  countMessageElement.id = `${id}-info`;
  countMessageElement.className = `public-good-hint public-good-character-count__message ${countMessage.classes || ''}`.trim();
  
  const countType = maxwords ? 'words' : 'characters';
  const maxCount = maxwords ?? maxlength ?? 0;
  countMessageElement.textContent = `You can enter up to ${maxCount} ${countType}`;
  
  formGroup.appendChild(countMessageElement);

  wrapper.appendChild(formGroup);

  return wrapper;
}

/**
 * Initialize character count components from data attributes
 */
export function initializeCharacterCounts(scope: Document | HTMLElement = document): CharacterCount[] {
  const elements = scope.querySelectorAll('[data-module="public-good-character-count"]') as NodeListOf<HTMLElement>;
  const instances: CharacterCount[] = [];

  elements.forEach(element => {
    try {
      const instance = new CharacterCount(element);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize character count:', error);
    }
  });

  return instances;
}