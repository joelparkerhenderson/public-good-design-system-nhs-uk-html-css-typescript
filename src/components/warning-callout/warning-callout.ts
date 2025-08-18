/**
 * Warning Callout Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides warning callouts to help users identify and understand important warning content.
 */

/**
 * Configuration options for warning callout creation
 */
export interface WarningCalloutOptions {
  id?: string;
  heading?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  content?: string;
  html?: string;
  classes?: string;
  attributes?: Record<string, string>;
  hiddenPrefix?: string;
  role?: string;
}

/**
 * Configuration for the WarningCallout class
 */
export interface WarningCalloutConfig {
  trackInteractions?: boolean;
  onInteraction?: (type: string, element: HTMLElement) => void;
  customValidation?: (element: HTMLElement) => string[];
  announceToScreenReader?: boolean;
}

/**
 * Enhanced WarningCallout class for managing interactive warning callouts
 */
export class WarningCallout {
  private element: HTMLElement;
  private config: WarningCalloutConfig;
  private heading: HTMLElement | null = null;
  private content: HTMLElement | null = null;

  constructor(element: HTMLElement, config: WarningCalloutConfig = {}) {
    if (!element) {
      throw new Error('WarningCallout component requires a container element');
    }

    this.element = element;
    this.config = {
      trackInteractions: false,
      announceToScreenReader: false,
      hiddenPrefix: 'Important: ',
      ...config
    };

    this.init();
  }

  private init(): void {
    this.element.classList.add('public-good-warning-callout');
    
    // Find existing heading and content
    this.heading = this.element.querySelector('.public-good-warning-callout__label');
    this.content = this.element.querySelector('.public-good-warning-callout__content, p, div');

    this.setupEventListeners();

    // Announce to screen reader if configured
    if (this.config.announceToScreenReader) {
      this.announceWarning();
    }

    // Emit initialization event
    this.element.dispatchEvent(new CustomEvent('warning-callout:initialized', {
      detail: { warningCallout: this }
    }));
  }

  private setupEventListeners(): void {
    if (!this.config.trackInteractions) return;

    // Track focus events
    this.element.addEventListener('focusin', (event) => {
      this.trackInteraction('focus', event.target as HTMLElement);
    });

    // Track click events
    this.element.addEventListener('click', (event) => {
      this.trackInteraction('click', event.target as HTMLElement);
    });

    // Track when callout enters viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackInteraction('view', this.element);
            observer.unobserve(this.element);
          }
        });
      });
      observer.observe(this.element);
    }
  }

  private trackInteraction(type: string, element: HTMLElement): void {
    if (this.config.onInteraction) {
      this.config.onInteraction(type, element);
    }

    // Emit interaction event
    this.element.dispatchEvent(new CustomEvent('warning-callout:interaction', {
      detail: { type, element, warningCallout: this }
    }));
  }

  private announceWarning(): void {
    // Create a live region for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'public-good-warning-callout-sr-only';
    
    const headingText = this.heading?.textContent?.replace(/^Important:\s*/i, '') || '';
    const contentText = this.content?.textContent || '';
    
    announcement.textContent = `Warning: ${headingText}. ${contentText}`;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after screen readers have processed it
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  /**
   * Update the heading content
   */
  setHeading(heading: string, hiddenPrefix: string = 'Important: '): void {
    if (!this.heading) return;

    const span = this.heading.querySelector('span[role="text"]') || this.heading;
    const hiddenSpan = span.querySelector('.public-good-warning-callout-sr-only');
    
    if (hiddenSpan) {
      hiddenSpan.textContent = hiddenPrefix;
      // Update visible text
      span.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE || 
            (node.nodeType === Node.ELEMENT_NODE && !node.classList?.contains('public-good-warning-callout-sr-only'))) {
          if (node.textContent) {
            node.textContent = heading;
          }
        }
      });
    } else {
      span.textContent = heading;
    }

    // Emit heading change event
    this.element.dispatchEvent(new CustomEvent('warning-callout:heading-changed', {
      detail: { heading, hiddenPrefix, warningCallout: this }
    }));
  }

  /**
   * Update the content
   */
  setContent(content: string, isHTML: boolean = false): void {
    if (!this.content) return;

    if (isHTML) {
      this.content.innerHTML = content;
    } else {
      this.content.textContent = content;
    }

    // Emit content change event
    this.element.dispatchEvent(new CustomEvent('warning-callout:content-changed', {
      detail: { content, isHTML, warningCallout: this }
    }));
  }

  /**
   * Show the warning callout
   */
  show(): void {
    this.element.style.display = '';
    this.element.setAttribute('aria-hidden', 'false');

    // Announce if configured
    if (this.config.announceToScreenReader) {
      this.announceWarning();
    }

    // Emit show event
    this.element.dispatchEvent(new CustomEvent('warning-callout:shown', {
      detail: { warningCallout: this }
    }));
  }

  /**
   * Hide the warning callout
   */
  hide(): void {
    this.element.style.display = 'none';
    this.element.setAttribute('aria-hidden', 'true');

    // Emit hide event
    this.element.dispatchEvent(new CustomEvent('warning-callout:hidden', {
      detail: { warningCallout: this }
    }));
  }

  /**
   * Check if the callout is visible
   */
  isVisible(): boolean {
    return this.element.style.display !== 'none' && 
           this.element.getAttribute('aria-hidden') !== 'true';
  }

  /**
   * Get the heading element
   */
  getHeading(): HTMLElement | null {
    return this.heading;
  }

  /**
   * Get the content element
   */
  getContent(): HTMLElement | null {
    return this.content;
  }

  /**
   * Get the container element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Validate the warning callout
   */
  validate(): string[] {
    const issues: string[] = [];

    // Check for heading
    if (!this.heading || !this.heading.textContent?.trim()) {
      issues.push('Warning callout should have a descriptive heading');
    }

    // Check for content
    if (!this.content || !this.content.textContent?.trim()) {
      issues.push('Warning callout should have content text');
    }

    // Check for hidden prefix
    const hiddenElement = this.element.querySelector('.public-good-warning-callout-sr-only');
    if (!hiddenElement) {
      issues.push('Warning callout should include visually hidden prefix for screen readers');
    }

    // Custom validation
    if (this.config.customValidation) {
      issues.push(...this.config.customValidation(this.element));
    }

    return issues;
  }

  /**
   * Destroy the warning callout instance
   */
  destroy(): void {
    // Remove event listeners by cloning the element
    const newElement = this.element.cloneNode(true) as HTMLElement;
    this.element.parentNode?.replaceChild(newElement, this.element);

    // Clear references
    this.heading = null;
    this.content = null;
  }
}

/**
 * Create a warning callout element
 */
export function createWarningCallout(options: WarningCalloutOptions): HTMLElement {
  const container = document.createElement('div');
  container.className = `public-good-warning-callout ${options.classes || ''}`;
  
  if (options.id) {
    container.id = options.id;
  }
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      container.setAttribute(key, value);
    });
  }

  // Create heading
  if (options.heading) {
    const headingLevel = options.headingLevel || 3;
    const heading = document.createElement(`h${headingLevel}`);
    heading.className = 'public-good-warning-callout__label';
    
    // Create span with role="text" for better screen reader support
    const span = document.createElement('span');
    span.setAttribute('role', 'text');
    
    // Add hidden prefix
    const hiddenPrefix = document.createElement('span');
    hiddenPrefix.className = 'public-good-warning-callout-sr-only';
    hiddenPrefix.textContent = options.hiddenPrefix || 'Important: ';
    
    span.appendChild(hiddenPrefix);
    span.appendChild(document.createTextNode(options.heading));
    heading.appendChild(span);
    container.appendChild(heading);
  }

  // Create content
  if (options.content || options.html) {
    const content = document.createElement('div');
    content.className = 'public-good-warning-callout__content';
    
    if (options.html) {
      content.innerHTML = options.html;
    } else if (options.content) {
      // Split content into paragraphs if it contains line breaks
      const paragraphs = options.content.split('\n\n');
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
          const p = document.createElement('p');
          p.textContent = paragraph.trim();
          content.appendChild(p);
        }
      });
    }
    
    container.appendChild(content);
  }

  return container;
}

/**
 * Initialize warning callouts from existing markup
 */
export function initializeWarningCallouts(scope: Document | HTMLElement = document): WarningCallout[] {
  const calloutElements = scope.querySelectorAll('[data-module="public-good-warning-callout"]') as NodeListOf<HTMLElement>;
  const instances: WarningCallout[] = [];
  
  calloutElements.forEach(element => {
    try {
      const config: WarningCalloutConfig = {};
      
      // Parse configuration from data attributes
      if (element.hasAttribute('data-track-interactions')) {
        config.trackInteractions = element.getAttribute('data-track-interactions') === 'true';
      }
      
      if (element.hasAttribute('data-announce-to-screen-reader')) {
        config.announceToScreenReader = element.getAttribute('data-announce-to-screen-reader') === 'true';
      }
      
      const instance = new WarningCallout(element, config);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize warning callout:', error);
    }
  });
  
  return instances;
}

/**
 * Validate warning callout accessibility
 */
export function validateWarningCalloutAccessibility(
  scope: Document | HTMLElement = document
): {
  warningCallouts: HTMLElement[];
  issues: string[];
} {
  const warningCallouts = scope.querySelectorAll('.public-good-warning-callout') as NodeListOf<HTMLElement>;
  const issues: string[] = [];
  
  warningCallouts.forEach((callout, index) => {
    const calloutNumber = index + 1;
    
    // Check for heading
    const heading = callout.querySelector('.public-good-warning-callout__label');
    if (!heading) {
      issues.push(`Warning callout ${calloutNumber} should have a heading with class 'public-good-warning-callout__label'`);
    } else {
      // Check heading content
      if (!heading.textContent?.trim()) {
        issues.push(`Warning callout ${calloutNumber} heading should not be empty`);
      }
      
      // Check for hidden prefix
      const hiddenPrefix = heading.querySelector('.public-good-warning-callout-sr-only');
      if (!hiddenPrefix) {
        issues.push(`Warning callout ${calloutNumber} should include visually hidden prefix for screen readers`);
      }
      
      // Check role="text" usage
      const roleText = heading.querySelector('[role="text"]');
      if (!roleText) {
        issues.push(`Warning callout ${calloutNumber} heading should use role="text" for better screen reader support`);
      }
    }
    
    // Check for content
    const content = callout.querySelector('.public-good-warning-callout__content, p');
    if (!content) {
      issues.push(`Warning callout ${calloutNumber} should have content`);
    } else if (!content.textContent?.trim()) {
      issues.push(`Warning callout ${calloutNumber} content should not be empty`);
    }
    
    // Check for proper heading levels
    const headingElement = callout.querySelector('h1, h2, h3, h4, h5, h6');
    if (headingElement) {
      const level = parseInt(headingElement.tagName.charAt(1));
      const prevHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .filter(h => h.compareDocumentPosition(headingElement) & Node.DOCUMENT_POSITION_PRECEDING);
      
      if (prevHeadings.length > 0) {
        const prevLevel = parseInt(prevHeadings[prevHeadings.length - 1].tagName.charAt(1));
        if (level > prevLevel + 1) {
          issues.push(`Warning callout ${calloutNumber} heading level h${level} skips levels (previous was h${prevLevel})`);
        }
      }
    }
    
    // Check color contrast (basic check for common issues)
    const computedStyle = window.getComputedStyle(callout);
    if (computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || computedStyle.backgroundColor === 'transparent') {
      issues.push(`Warning callout ${calloutNumber} should have a background color for visibility`);
    }
  });
  
  return {
    warningCallouts: Array.from(warningCallouts),
    issues
  };
}