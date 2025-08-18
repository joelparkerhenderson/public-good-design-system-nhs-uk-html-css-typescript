/**
 * Error Summary Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides a summary of validation errors with accessibility features
 * and intelligent focus management for form validation
 */

export interface ErrorSummaryItem {
  text?: string;
  html?: string;
  href?: string;
  attributes?: Record<string, string>;
}

export interface ErrorSummaryOptions {
  titleText?: string;
  titleHtml?: string;
  descriptionText?: string;
  descriptionHtml?: string;
  errorList: ErrorSummaryItem[];
  classes?: string;
  attributes?: Record<string, string>;
  disableAutoFocus?: boolean;
}

export interface ErrorSummaryConfig {
  disableAutoFocus?: boolean;
}

export class ErrorSummary {
  private readonly element: HTMLElement;
  private readonly config: ErrorSummaryConfig;

  constructor(element: HTMLElement, config: ErrorSummaryConfig = {}) {
    this.element = element;
    this.config = {
      disableAutoFocus: false,
      ...config
    };

    // Auto-focus on the error summary when created (unless disabled)
    if (!this.config.disableAutoFocus) {
      this.element.focus();
    }

    // Add click handler for smart focus management
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Get associated legend or label for an input element
   * 
   * This implements intelligent focus targeting by finding the most
   * appropriate legend or label to scroll into view before focusing the input
   */
  private getAssociatedLegendOrLabel(input: HTMLElement): HTMLElement | null {
    const fieldset = input.closest('fieldset');

    if (fieldset) {
      const legends = fieldset.getElementsByTagName('legend');
      
      if (legends.length > 0) {
        const candidateLegend = legends[0];

        // For radio and checkbox inputs, always use the legend
        if (input instanceof HTMLInputElement && 
            (input.type === 'checkbox' || input.type === 'radio')) {
          return candidateLegend;
        }

        // For other input types, only use legend if it won't push input off screen
        const legendRect = candidateLegend.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();

        if (inputRect.height && window.innerHeight) {
          const inputBottom = inputRect.top + inputRect.height;
          
          // Use legend if input would remain in top half of screen
          if (inputBottom - legendRect.top < window.innerHeight / 2) {
            return candidateLegend;
          }
        }
      }
    }

    // Look for associated label
    const inputId = input.getAttribute('id');
    if (inputId) {
      const associatedLabel = document.querySelector(`label[for="${inputId}"]`);
      if (associatedLabel) {
        return associatedLabel as HTMLElement;
      }
    }

    // Look for parent label
    return input.closest('label') as HTMLElement | null;
  }

  /**
   * Focus the target element with intelligent scrolling
   * 
   * Ensures that when an error link is clicked, the associated form field
   * and its label/legend are properly visible and announced by screen readers
   */
  private focusTarget(target: EventTarget): boolean {
    // Only handle anchor elements
    if (!(target instanceof HTMLAnchorElement)) {
      return false;
    }

    const hash = target.hash;
    if (!hash) {
      return false;
    }

    const inputId = hash.replace('#', '');
    const input = document.getElementById(inputId);
    
    if (!input) {
      return false;
    }

    const legendOrLabel = this.getAssociatedLegendOrLabel(input);
    
    if (!legendOrLabel) {
      // If no legend or label found, just focus the input
      input.focus();
      return true;
    }

    // Scroll the legend or label into view first
    legendOrLabel.scrollIntoView();
    
    // Then focus the input without additional scrolling
    input.focus({ preventScroll: true });

    return true;
  }

  /**
   * Handle click events on error summary links
   */
  private handleClick(event: Event): void {
    const target = event.target;
    
    if (target && this.focusTarget(target)) {
      event.preventDefault();
    }
  }

  /**
   * Add an error to the summary
   */
  public addError(error: ErrorSummaryItem): void {
    const list = this.element.querySelector('.public-good-error-summary__list');
    if (!list) return;

    const listItem = document.createElement('li');
    
    if (error.href) {
      const link = document.createElement('a');
      link.href = error.href;
      
      if (error.html) {
        link.innerHTML = error.html;
      } else if (error.text) {
        link.textContent = error.text;
      }

      // Add custom attributes
      if (error.attributes) {
        Object.entries(error.attributes).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });
      }

      listItem.appendChild(link);
    } else {
      if (error.html) {
        listItem.innerHTML = error.html;
      } else if (error.text) {
        listItem.textContent = error.text;
      }
    }

    list.appendChild(listItem);
  }

  /**
   * Remove an error from the summary by href
   */
  public removeError(href: string): void {
    const link = this.element.querySelector(`a[href="${href}"]`);
    if (link && link.parentElement) {
      link.parentElement.remove();
    }
  }

  /**
   * Clear all errors from the summary
   */
  public clearErrors(): void {
    const list = this.element.querySelector('.public-good-error-summary__list');
    if (list) {
      list.innerHTML = '';
    }
  }

  /**
   * Get count of current errors
   */
  public getErrorCount(): number {
    const list = this.element.querySelector('.public-good-error-summary__list');
    return list?.children.length || 0;
  }

  /**
   * Focus the error summary
   */
  public focus(): void {
    this.element.focus();
  }

  /**
   * Check if error summary is visible
   */
  public isVisible(): boolean {
    return this.element.style.display !== 'none' && 
           !this.element.hidden;
  }

  /**
   * Show the error summary
   */
  public show(): void {
    this.element.style.display = '';
    this.element.hidden = false;
  }

  /**
   * Hide the error summary
   */
  public hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Destroy the error summary instance
   */
  public destroy(): void {
    this.element.removeEventListener('click', this.handleClick);
  }
}

/**
 * Create an error summary component
 */
export function createErrorSummary(options: ErrorSummaryOptions): HTMLElement {
  const {
    titleText = 'There is a problem',
    titleHtml,
    descriptionText,
    descriptionHtml,
    errorList,
    classes = '',
    attributes = {},
    disableAutoFocus = false
  } = options;

  // Create main container
  const div = document.createElement('div');
  div.className = `public-good-error-summary ${classes}`.trim();
  div.setAttribute('aria-labelledby', 'error-summary-title');
  div.setAttribute('role', 'alert');
  div.setAttribute('tabindex', '-1');
  div.setAttribute('data-module', 'public-good-error-summary');

  // Add custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    div.setAttribute(key, value);
  });

  // Create title
  const title = document.createElement('h2');
  title.className = 'public-good-error-summary__title';
  title.id = 'error-summary-title';
  
  if (titleHtml) {
    title.innerHTML = titleHtml;
  } else {
    title.textContent = titleText;
  }

  div.appendChild(title);

  // Create body
  const body = document.createElement('div');
  body.className = 'public-good-error-summary__body';

  // Add description if provided
  if (descriptionText || descriptionHtml) {
    const description = document.createElement('p');
    
    if (descriptionHtml) {
      description.innerHTML = descriptionHtml;
    } else if (descriptionText) {
      description.textContent = descriptionText;
    }
    
    body.appendChild(description);
  }

  // Create error list
  const list = document.createElement('ul');
  list.className = 'public-good-list public-good-error-summary__list';
  list.setAttribute('role', 'list');

  // Add error items
  errorList.forEach(error => {
    const listItem = document.createElement('li');
    
    if (error.href) {
      const link = document.createElement('a');
      link.href = error.href;
      
      if (error.html) {
        link.innerHTML = error.html;
      } else if (error.text) {
        link.textContent = error.text;
      }

      // Add custom attributes
      if (error.attributes) {
        Object.entries(error.attributes).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });
      }

      listItem.appendChild(link);
    } else {
      if (error.html) {
        listItem.innerHTML = error.html;
      } else if (error.text) {
        listItem.textContent = error.text;
      }
    }

    list.appendChild(listItem);
  });

  body.appendChild(list);
  div.appendChild(body);

  return div;
}

/**
 * Initialize error summary components from data attributes
 */
export function initializeErrorSummaries(
  scope: Document | HTMLElement = document,
  options: { focusOnPageLoad?: boolean } = {}
): ErrorSummary[] {
  const elements = scope.querySelectorAll('[data-module="public-good-error-summary"]') as NodeListOf<HTMLElement>;
  const instances: ErrorSummary[] = [];

  elements.forEach(element => {
    try {
      const instance = new ErrorSummary(element, {
        disableAutoFocus: options.focusOnPageLoad === false
      });
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize error summary:', error);
    }
  });

  return instances;
}

/**
 * Helper function to create a simple error summary with just text and links
 */
export function createSimpleErrorSummary(
  errors: Array<{ text: string; href: string }>,
  title: string = 'There is a problem'
): HTMLElement {
  return createErrorSummary({
    titleText: title,
    errorList: errors
  });
}

/**
 * Helper function to create error summary from form validation
 */
export function createErrorSummaryFromForm(
  form: HTMLFormElement,
  title: string = 'There is a problem'
): HTMLElement {
  const errors: ErrorSummaryItem[] = [];
  
  // Find all inputs with validation errors
  const invalidInputs = form.querySelectorAll(':invalid');
  
  invalidInputs.forEach(input => {
    const fieldId = input.getAttribute('id');
    if (!fieldId) return;

    const label = form.querySelector(`label[for="${fieldId}"]`) || 
                  input.closest('label') ||
                  input.closest('fieldset')?.querySelector('legend');
    
    const fieldName = label?.textContent?.trim() || 'This field';
    
    errors.push({
      text: `${fieldName} has an error`,
      href: `#${fieldId}`
    });
  });

  return createErrorSummary({
    titleText: title,
    errorList: errors
  });
}