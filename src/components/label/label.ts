/**
 * Label Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides accessible labels for form controls with support for different sizes,
 * page headings, and programmatic control. Essential for form accessibility.
 */

export interface LabelOptions {
  text?: string;
  html?: string;
  for?: string;
  isPageHeading?: boolean;
  classes?: string;
  attributes?: Record<string, string>;
}

// Configuration for label behavior
// Currently minimal but allows for future enhancements
export type LabelConfig = Record<string, never>

export class Label {
  private readonly element: HTMLElement;
  private readonly config: LabelConfig;
  private readonly labelElement: HTMLLabelElement;

  constructor(element: HTMLElement, config: LabelConfig = {}) {
    this.element = element;
    this.config = { ...config };

    // Find the label element within the wrapper (if it's wrapped) or use the element itself
    this.labelElement = this.element.tagName === 'LABEL' 
      ? this.element as HTMLLabelElement
      : this.element.querySelector('label') as HTMLLabelElement;

    if (!this.labelElement) {
      throw new Error('Label component requires a label element');
    }

    this.init();
  }

  /**
   * Initialize the label component
   */
  private init(): void {
    // Label is primarily presentational but may need initialization for future features
  }

  /**
   * Update the label text content
   */
  public updateText(text: string): void {
    this.labelElement.textContent = text;
  }

  /**
   * Update the label with HTML content
   */
  public updateHtml(html: string): void {
    this.labelElement.innerHTML = html;
  }

  /**
   * Get the label text content
   */
  public getText(): string {
    return this.labelElement.textContent || '';
  }

  /**
   * Get the label HTML content
   */
  public getHtml(): string {
    return this.labelElement.innerHTML;
  }

  /**
   * Get the for attribute (associated form control ID)
   */
  public getFor(): string | null {
    return this.labelElement.getAttribute('for');
  }

  /**
   * Set the for attribute (associate with form control)
   */
  public setFor(controlId: string): void {
    this.labelElement.setAttribute('for', controlId);
  }

  /**
   * Remove the for attribute
   */
  public removeFor(): void {
    this.labelElement.removeAttribute('for');
  }

  /**
   * Check if this label is used as a page heading
   */
  public isPageHeading(): boolean {
    return this.element.tagName === 'H1' && this.element.classList.contains('public-good-label-wrapper');
  }

  /**
   * Get the associated form control element
   */
  public getAssociatedControl(): HTMLElement | null {
    const forId = this.getFor();
    if (!forId) return null;

    return document.getElementById(forId);
  }

  /**
   * Focus the associated form control
   */
  public focusControl(): boolean {
    const control = this.getAssociatedControl();
    if (control && typeof (control as any).focus === 'function') {
      (control as any).focus();
      return true;
    }
    return false;
  }

  /**
   * Add CSS class to the label element
   */
  public addClass(className: string): void {
    this.labelElement.classList.add(className);
  }

  /**
   * Remove CSS class from the label element
   */
  public removeClass(className: string): void {
    this.labelElement.classList.remove(className);
  }

  /**
   * Check if label has a specific CSS class
   */
  public hasClass(className: string): boolean {
    return this.labelElement.classList.contains(className);
  }

  /**
   * Set the label size
   */
  public setSize(size: 'xs' | 's' | 'm' | 'l' | 'xl' | null): void {
    // Remove existing size classes
    const sizeClasses = ['public-good-label--xs', 'public-good-label--s', 'public-good-label--m', 'public-good-label--l', 'public-good-label--xl'];
    sizeClasses.forEach(cls => this.removeClass(cls));

    // Add new size class if provided
    if (size) {
      this.addClass(`public-good-label--${size}`);
    }
  }

  /**
   * Get the current label size
   */
  public getSize(): string | null {
    const sizeClasses = ['xs', 's', 'm', 'l', 'xl'];
    for (const size of sizeClasses) {
      if (this.hasClass(`public-good-label--${size}`)) {
        return size;
      }
    }
    return null;
  }

  /**
   * Show the label
   */
  public show(): void {
    this.element.style.display = '';
    this.element.hidden = false;
  }

  /**
   * Hide the label
   */
  public hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Check if label is visible
   */
  public isVisible(): boolean {
    return this.element.style.display !== 'none' && !this.element.hidden;
  }

  /**
   * Get the label element
   */
  public getLabelElement(): HTMLLabelElement {
    return this.labelElement;
  }

  /**
   * Get the wrapper element (for page headings)
   */
  public getWrapperElement(): HTMLElement {
    return this.element;
  }

  /**
   * Destroy the label instance
   */
  public destroy(): void {
    // Clean up any event listeners or resources if added in the future
  }
}

/**
 * Create a label component
 */
export function createLabel(options: LabelOptions): HTMLElement {
  const {
    text,
    html,
    for: forAttribute,
    isPageHeading = false,
    classes = '',
    attributes = {}
  } = options;

  // Validate that either text or html is provided
  if (text === undefined && html === undefined) {
    throw new Error('Label component requires either text or html option');
  }

  // Create the label element
  const label = document.createElement('label');
  label.className = `public-good-label ${classes}`.trim();

  // Set for attribute if provided
  if (forAttribute) {
    label.setAttribute('for', forAttribute);
  }

  // Add custom attributes to label
  Object.entries(attributes).forEach(([key, value]) => {
    label.setAttribute(key, value);
  });

  // Set content - HTML takes precedence over text
  if (html) {
    label.innerHTML = html;
  } else if (text) {
    label.textContent = text;
  }

  // Wrap in heading if it's a page heading
  if (isPageHeading) {
    const wrapper = document.createElement('h1');
    wrapper.className = 'public-good-label-wrapper';
    wrapper.appendChild(label);
    return wrapper;
  }

  return label;
}

/**
 * Initialize label components from data attributes
 */
export function initializeLabels(
  scope: Document | HTMLElement = document
): Label[] {
  const elements = scope.querySelectorAll('[data-module="public-good-label"]') as NodeListOf<HTMLElement>;
  const instances: Label[] = [];

  elements.forEach(element => {
    try {
      const instance = new Label(element);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize label:', error);
    }
  });

  return instances;
}

/**
 * Helper function to create a simple text label
 */
export function createTextLabel(
  text: string,
  forAttribute?: string,
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
): HTMLElement {
  const classes = size ? `public-good-label--${size}` : '';
  
  return createLabel({
    text,
    for: forAttribute,
    classes
  });
}

/**
 * Helper function to create an HTML label
 */
export function createHtmlLabel(
  html: string,
  forAttribute?: string,
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
): HTMLElement {
  const classes = size ? `public-good-label--${size}` : '';
  
  return createLabel({
    html,
    for: forAttribute,
    classes
  });
}

/**
 * Helper function to create a page heading label
 */
export function createPageHeadingLabel(
  text: string,
  forAttribute?: string,
  size: 'l' | 'xl' = 'xl'
): HTMLElement {
  return createLabel({
    text,
    for: forAttribute,
    isPageHeading: true,
    classes: `public-good-label--${size}`
  });
}

/**
 * Helper function to associate a label with a form control
 */
export function associateLabelWithControl(
  labelElement: HTMLElement,
  controlElement: HTMLElement,
  controlId?: string
): void {
  // Set the control ID if provided or generate one if control has no ID
  if (controlId) {
    controlElement.id = controlId;
  } else if (!controlElement.id) {
    const generatedId = `control-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    controlElement.id = generatedId;
  }

  // Associate the label with the control
  const label = new Label(labelElement);
  label.setFor(controlElement.id);
}

/**
 * Helper function to create a label and associate it with a control
 */
export function createAndAssociateLabel(
  text: string,
  controlElement: HTMLElement,
  options: Omit<LabelOptions, 'text' | 'for'> = {}
): HTMLElement {
  // Ensure control has an ID
  if (!controlElement.id) {
    controlElement.id = `control-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const label = createLabel({
    text,
    for: controlElement.id,
    ...options
  });

  return label;
}

/**
 * Helper function to find labels associated with a form control
 */
export function getAssociatedLabels(controlElement: HTMLElement): HTMLLabelElement[] {
  const labels: HTMLLabelElement[] = [];
  
  // Find labels that reference this control by ID
  if (controlElement.id) {
    const labelsByFor = document.querySelectorAll(`label[for="${controlElement.id}"]`) as NodeListOf<HTMLLabelElement>;
    labels.push(...Array.from(labelsByFor));
  }

  // Check if control is nested within a label
  const parentLabel = controlElement.closest('label') as HTMLLabelElement;
  if (parentLabel && !labels.includes(parentLabel)) {
    labels.push(parentLabel);
  }

  return labels;
}

/**
 * Helper function to validate label-control association
 */
export function validateLabelAssociation(controlElement: HTMLElement): {
  hasLabel: boolean;
  labelCount: number;
  labels: HTMLLabelElement[];
  warnings: string[];
} {
  const labels = getAssociatedLabels(controlElement);
  const warnings: string[] = [];

  if (labels.length === 0) {
    warnings.push('Form control has no associated label');
  }

  if (labels.length > 1) {
    warnings.push(`Form control has multiple labels (${labels.length})`);
  }

  // Check for empty labels
  labels.forEach((label, index) => {
    if (!label.textContent?.trim()) {
      warnings.push(`Label ${index + 1} is empty`);
    }
  });

  return {
    hasLabel: labels.length > 0,
    labelCount: labels.length,
    labels,
    warnings
  };
}