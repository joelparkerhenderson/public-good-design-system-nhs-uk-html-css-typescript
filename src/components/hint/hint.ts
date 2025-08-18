/**
 * Hint Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides helpful text to guide users when filling out forms or completing tasks.
 * Used to give additional context or instructions without overwhelming the interface.
 */

export interface HintOptions {
  text?: string;
  html?: string;
  id?: string;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface HintConfig {
  // No specific runtime configuration needed for hint component
  // This interface exists for consistency with other components
}

export class Hint {
  private readonly element: HTMLElement;
  private readonly config: HintConfig;

  constructor(element: HTMLElement, config: HintConfig = {}) {
    this.element = element;
    this.config = { ...config };

    // Hint is primarily a presentational component
    // No specific JavaScript functionality required beyond basic management
    this.init();
  }

  /**
   * Initialize the hint component
   */
  private init(): void {
    // Add any initialization logic if needed in the future
    // Currently hint is primarily CSS-driven
  }

  /**
   * Update the hint text content
   */
  public updateText(text: string): void {
    this.element.textContent = text;
  }

  /**
   * Update the hint with HTML content
   */
  public updateHtml(html: string): void {
    this.element.innerHTML = html;
  }

  /**
   * Get the hint text content
   */
  public getText(): string {
    return this.element.textContent || '';
  }

  /**
   * Get the hint HTML content
   */
  public getHtml(): string {
    return this.element.innerHTML;
  }

  /**
   * Show the hint component
   */
  public show(): void {
    this.element.style.display = '';
    this.element.hidden = false;
  }

  /**
   * Hide the hint component
   */
  public hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Check if hint is visible
   */
  public isVisible(): boolean {
    return this.element.style.display !== 'none' && !this.element.hidden;
  }

  /**
   * Get the hint element ID
   */
  public getId(): string | null {
    return this.element.getAttribute('id');
  }

  /**
   * Set the hint element ID
   */
  public setId(id: string): void {
    this.element.setAttribute('id', id);
  }

  /**
   * Add CSS class to the hint element
   */
  public addClass(className: string): void {
    this.element.classList.add(className);
  }

  /**
   * Remove CSS class from the hint element
   */
  public removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  /**
   * Check if hint has a specific CSS class
   */
  public hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  /**
   * Destroy the hint instance
   */
  public destroy(): void {
    // Clean up any event listeners or resources if added in the future
    // Currently no cleanup needed as hint is presentational
  }
}

/**
 * Create a hint component
 */
export function createHint(options: HintOptions): HTMLElement {
  const {
    text,
    html,
    id,
    classes = '',
    attributes = {}
  } = options;

  // Validate that either text or html is provided
  if (text === undefined && html === undefined) {
    throw new Error('Hint component requires either text or html option');
  }

  // Create hint element
  const div = document.createElement('div');
  div.className = `public-good-hint ${classes}`.trim();

  // Set ID if provided
  if (id) {
    div.id = id;
  }

  // Add custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    div.setAttribute(key, value);
  });

  // Set content - HTML takes precedence over text
  if (html) {
    div.innerHTML = html;
  } else if (text) {
    div.textContent = text;
  }

  return div;
}

/**
 * Initialize hint components from data attributes
 */
export function initializeHints(
  scope: Document | HTMLElement = document
): Hint[] {
  const elements = scope.querySelectorAll('[data-module="public-good-hint"]') as NodeListOf<HTMLElement>;
  const instances: Hint[] = [];

  elements.forEach(element => {
    try {
      const instance = new Hint(element);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize hint:', error);
    }
  });

  return instances;
}

/**
 * Helper function to create a simple text hint
 */
export function createTextHint(
  text: string,
  id?: string
): HTMLElement {
  return createHint({
    text,
    id
  });
}

/**
 * Helper function to create an HTML hint
 */
export function createHtmlHint(
  html: string,
  id?: string
): HTMLElement {
  return createHint({
    html,
    id
  });
}

/**
 * Helper function to create a hint for form fields
 * Automatically generates an ID based on the field ID
 */
export function createFormHint(
  text: string,
  fieldId: string
): HTMLElement {
  return createHint({
    text,
    id: `${fieldId}-hint`
  });
}

/**
 * Helper function to associate a hint with a form control
 * Adds the hint ID to the form control's aria-describedby attribute
 */
export function associateHintWithField(
  hintElement: HTMLElement,
  fieldElement: HTMLElement
): void {
  const hintId = hintElement.id;
  if (!hintId) {
    console.warn('Hint element must have an ID to be associated with a field');
    return;
  }

  const currentAriaDescribedBy = fieldElement.getAttribute('aria-describedby') || '';
  const describedByIds = currentAriaDescribedBy.split(' ').filter(id => id.length > 0);
  
  // Add hint ID if not already present
  if (!describedByIds.includes(hintId)) {
    describedByIds.push(hintId);
    fieldElement.setAttribute('aria-describedby', describedByIds.join(' '));
  }
}

/**
 * Helper function to create a hint and associate it with a field
 * Returns both the hint element and updates the field's aria-describedby
 */
export function createAndAssociateHint(
  text: string,
  fieldElement: HTMLElement,
  fieldId?: string
): HTMLElement {
  const actualFieldId = fieldId || fieldElement.id;
  if (!actualFieldId) {
    throw new Error('Field element must have an ID or fieldId must be provided');
  }

  const hint = createFormHint(text, actualFieldId);
  associateHintWithField(hint, fieldElement);
  
  return hint;
}

/**
 * Helper function to find and return all hints associated with a form field
 */
export function getAssociatedHints(fieldElement: HTMLElement): HTMLElement[] {
  const ariaDescribedBy = fieldElement.getAttribute('aria-describedby');
  if (!ariaDescribedBy) {
    return [];
  }

  const hints: HTMLElement[] = [];
  const ids = ariaDescribedBy.split(' ').filter(id => id.length > 0);
  
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element && element.classList.contains('public-good-hint')) {
      hints.push(element);
    }
  });

  return hints;
}