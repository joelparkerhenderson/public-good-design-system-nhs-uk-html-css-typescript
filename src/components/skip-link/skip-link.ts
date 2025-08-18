/**
 * Skip Link Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Helps keyboard-only users skip to the main content on a page,
 * improving navigation efficiency and accessibility.
 */

export interface SkipLinkOptions {
  text?: string;
  href?: string;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface SkipLinkConfig {
  // Configuration for skip link behavior
  scrollBehavior?: 'auto' | 'smooth';
  focusTarget?: boolean;
}

export class SkipLink {
  private readonly element: HTMLAnchorElement;
  private readonly config: SkipLinkConfig;
  private targetElement?: HTMLElement;

  constructor(element: HTMLAnchorElement, config: SkipLinkConfig = {}) {
    if (element.tagName !== 'A') {
      throw new Error('Skip link component requires an anchor element');
    }

    this.element = element;
    this.config = {
      scrollBehavior: 'smooth',
      focusTarget: true,
      ...config
    };

    this.init();
  }

  /**
   * Initialize the skip link component
   */
  private init(): void {
    // Find the target element if href is provided
    this.updateTarget();

    // Set up click handler for enhanced navigation
    this.element.addEventListener('click', (event) => {
      this.handleClick(event);
    });

    // Set up focus/blur handlers for visibility
    this.element.addEventListener('focus', () => {
      this.element.classList.add('public-good-skip-link--focused');
    });

    this.element.addEventListener('blur', () => {
      this.element.classList.remove('public-good-skip-link--focused');
    });

    // Set up keyboard handler
    this.element.addEventListener('keydown', (event) => {
      this.handleKeydown(event);
    });
  }

  /**
   * Update the target element based on current href
   */
  private updateTarget(): void {
    const href = this.element.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      this.targetElement = document.getElementById(targetId);
    }
  }

  /**
   * Handle click events on the skip link
   */
  private handleClick(event: Event): void {
    event.preventDefault();

    this.updateTarget();

    if (this.targetElement) {
      // Scroll to target with configured behavior
      this.targetElement.scrollIntoView({
        behavior: this.config.scrollBehavior,
        block: 'start'
      });

      // Focus the target element if configured
      if (this.config.focusTarget) {
        this.focusTarget();
      }

      // Emit custom event
      this.element.dispatchEvent(new CustomEvent('skipLink:activated', {
        bubbles: true,
        detail: { 
          skipLink: this,
          target: this.targetElement,
          href: this.element.getAttribute('href')
        }
      }));
    }
  }

  /**
   * Handle keydown events for accessibility
   */
  private handleKeydown(event: KeyboardEvent): void {
    // Handle Enter and Space as click
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.element.click();
    }
  }

  /**
   * Focus the target element
   */
  private focusTarget(): void {
    if (!this.targetElement) return;

    // Make target focusable if it isn't already
    let originalTabIndex = this.targetElement.getAttribute('tabindex');
    let shouldRestoreTabIndex = false;

    if (originalTabIndex === null && this.targetElement.tabIndex < 0) {
      this.targetElement.setAttribute('tabindex', '-1');
      shouldRestoreTabIndex = true;
    }

    // Focus the target
    this.targetElement.focus();

    // Restore original tabindex after a short delay
    if (shouldRestoreTabIndex) {
      setTimeout(() => {
        if (originalTabIndex === null) {
          this.targetElement?.removeAttribute('tabindex');
        } else {
          this.targetElement?.setAttribute('tabindex', originalTabIndex);
        }
      }, 100);
    }
  }

  /**
   * Update the skip link text
   */
  public updateText(text: string): void {
    this.element.textContent = text;
  }

  /**
   * Get the skip link text
   */
  public getText(): string {
    return this.element.textContent || '';
  }

  /**
   * Update the skip link href
   */
  public updateHref(href: string): void {
    this.element.setAttribute('href', href);
    this.updateTarget();
  }

  /**
   * Get the skip link href
   */
  public getHref(): string {
    return this.element.getAttribute('href') || '';
  }

  /**
   * Get the target element
   */
  public getTarget(): HTMLElement | null {
    this.updateTarget();
    return this.targetElement || null;
  }

  /**
   * Activate the skip link (same as clicking)
   */
  public activate(): void {
    this.element.click();
  }

  /**
   * Check if the skip link is visible (focused)
   */
  public isVisible(): boolean {
    return this.element.classList.contains('public-good-skip-link--focused') || 
           this.element === document.activeElement;
  }

  /**
   * Add CSS class to the skip link
   */
  public addClass(className: string): void {
    this.element.classList.add(className);
  }

  /**
   * Remove CSS class from the skip link
   */
  public removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  /**
   * Check if skip link has a specific CSS class
   */
  public hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  /**
   * Get the skip link element
   */
  public getElement(): HTMLAnchorElement {
    return this.element;
  }

  /**
   * Destroy the skip link instance
   */
  public destroy(): void {
    // Remove event listeners
    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('focus', this.init);
    this.element.removeEventListener('blur', this.init);
    this.element.removeEventListener('keydown', this.handleKeydown);

    // Remove CSS classes
    this.element.classList.remove('public-good-skip-link--focused');
  }
}

/**
 * Create a skip link component
 */
export function createSkipLink(options: SkipLinkOptions): HTMLAnchorElement {
  const {
    text = 'Skip to main content',
    href = '#main',
    classes = '',
    attributes = {}
  } = options;

  // Create the anchor element
  const link = document.createElement('a');
  link.className = `public-good-skip-link ${classes}`.trim();
  link.href = href;
  link.textContent = text;

  // Add custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    link.setAttribute(key, value);
  });

  return link;
}

/**
 * Initialize skip link components from data attributes
 */
export function initializeSkipLinks(
  scope: Document | HTMLElement = document
): SkipLink[] {
  const elements = scope.querySelectorAll('[data-module="public-good-skip-link"]') as NodeListOf<HTMLAnchorElement>;
  const instances: SkipLink[] = [];

  elements.forEach(element => {
    try {
      // Parse configuration from data attributes
      const config: SkipLinkConfig = {};
      
      const scrollBehavior = element.getAttribute('data-scroll-behavior') as 'auto' | 'smooth';
      if (scrollBehavior) {
        config.scrollBehavior = scrollBehavior;
      }

      const focusTarget = element.getAttribute('data-focus-target');
      if (focusTarget !== null) {
        config.focusTarget = focusTarget !== 'false';
      }

      const instance = new SkipLink(element, config);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize skip link:', error);
    }
  });

  return instances;
}

/**
 * Helper function to create a skip link for main content
 */
export function createMainContentSkipLink(
  text: string = 'Skip to main content',
  mainContentId: string = 'main'
): HTMLAnchorElement {
  return createSkipLink({
    text,
    href: `#${mainContentId}`
  });
}

/**
 * Helper function to create multiple skip links for a page
 */
export function createPageSkipLinks(links: Array<{
  text: string;
  href: string;
}>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'public-good-skip-links';

  links.forEach(linkData => {
    const link = createSkipLink(linkData);
    container.appendChild(link);
  });

  return container;
}

/**
 * Helper function to ensure a target element exists and is properly set up
 */
export function ensureSkipTarget(targetId: string): HTMLElement {
  let target = document.getElementById(targetId);

  if (!target) {
    // Create a target element if it doesn't exist
    target = document.createElement('div');
    target.id = targetId;
    target.setAttribute('tabindex', '-1');
    
    // Try to insert it at a logical place (after header, before main content)
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    const header = document.querySelector('header') || document.querySelector('[role="banner"]');
    
    if (main && main.parentNode) {
      main.parentNode.insertBefore(target, main);
    } else if (header && header.parentNode && header.nextSibling) {
      header.parentNode.insertBefore(target, header.nextSibling);
    } else {
      // Fallback: add to body
      document.body.appendChild(target);
    }

    console.warn(`Skip link target #${targetId} was created automatically. Consider adding it manually for better control.`);
  }

  // Ensure target can receive focus
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
  }

  return target;
}

/**
 * Helper function to validate skip links on a page
 */
export function validateSkipLinks(
  scope: Document | HTMLElement = document
): {
  skipLinks: HTMLAnchorElement[];
  issues: string[];
  targets: HTMLElement[];
} {
  const skipLinks = Array.from(scope.querySelectorAll('.public-good-skip-link')) as HTMLAnchorElement[];
  const issues: string[] = [];
  const targets: HTMLElement[] = [];

  if (skipLinks.length === 0) {
    issues.push('No skip links found on page');
  }

  skipLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent?.trim();

    if (!href) {
      issues.push(`Skip link ${index + 1} is missing href attribute`);
    } else if (!href.startsWith('#')) {
      issues.push(`Skip link ${index + 1} href should be a page fragment (starting with #)`);
    } else {
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      
      if (!target) {
        issues.push(`Skip link ${index + 1} target #${targetId} does not exist`);
      } else {
        targets.push(target);
      }
    }

    if (!text || text.length === 0) {
      issues.push(`Skip link ${index + 1} has no visible text`);
    }
  });

  return {
    skipLinks,
    issues,
    targets
  };
}