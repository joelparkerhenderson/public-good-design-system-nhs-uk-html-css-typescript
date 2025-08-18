/**
 * Notification Banner Component
 * Public Good Design System
 * 
 * A notification banner component for displaying important system messages,
 * announcements, or status updates at the top of a page or section.
 */

export interface NotificationBannerOptions {
  text?: string;
  html?: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  dismissible?: boolean;
  autoFocus?: boolean;
  role?: 'banner' | 'region' | 'alert' | 'status';
  titleText?: string;
  titleId?: string;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface NotificationBannerConfig {
  autoDismissDelay?: number;
  persistDismissal?: boolean;
  storageKey?: string;
}

export class NotificationBanner {
  private readonly element: HTMLElement;
  private readonly config: NotificationBannerConfig;
  private readonly content: HTMLElement;
  private readonly titleElement?: HTMLElement;
  private readonly closeButton?: HTMLButtonElement;
  private autoDismissTimer?: number;
  private isDismissed = false;

  constructor(element: HTMLElement, config: NotificationBannerConfig = {}) {
    this.element = element;
    this.config = {
      autoDismissDelay: 0, // 0 means no auto-dismiss
      persistDismissal: false,
      storageKey: 'notification-banner-dismissed',
      ...config
    };

    // Find key elements
    this.content = this.element.querySelector('.public-good-notification-banner__content') as HTMLElement;
    this.titleElement = this.element.querySelector('.public-good-notification-banner__title') as HTMLElement;
    this.closeButton = this.element.querySelector('.public-good-notification-banner__close') as HTMLButtonElement;

    if (!this.content) {
      throw new Error('Notification banner requires a content element with class "public-good-notification-banner__content"');
    }

    this.init();
  }

  /**
   * Initialize the notification banner
   */
  private init(): void {
    // Check if this banner was previously dismissed (if persistence is enabled)
    if (this.config.persistDismissal && this.config.storageKey) {
      try {
        const dismissed = localStorage.getItem(this.config.storageKey);
        if (dismissed === 'true') {
          this.hide();
          this.isDismissed = true;
          return;
        }
      } catch (e) {
        // localStorage might not be available, continue normally
      }
    }

    // Set up close button if dismissible
    if (this.closeButton) {
      this.setupCloseButton();
    }

    // Set up auto-dismiss if configured
    if (this.config.autoDismissDelay && this.config.autoDismissDelay > 0) {
      this.setupAutoDismiss();
    }

    // Auto-focus if configured
    if (this.element.getAttribute('data-auto-focus') === 'true') {
      // Use setTimeout to ensure DOM is ready and element is visible
      setTimeout(() => this.focus(), 0);
    }
  }

  /**
   * Set up the close button functionality
   */
  private setupCloseButton(): void {
    if (!this.closeButton) return;

    this.closeButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.dismiss();
    });

    // Keyboard support
    this.closeButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.dismiss();
      }
    });
  }

  /**
   * Set up auto-dismiss functionality
   */
  private setupAutoDismiss(): void {
    if (!this.config.autoDismissDelay || this.config.autoDismissDelay <= 0) return;

    this.startAutoDismissTimer();

    // Pause auto-dismiss on hover or focus
    this.element.addEventListener('mouseenter', () => this.pauseAutoDismiss());
    this.element.addEventListener('mouseleave', () => this.resumeAutoDismiss());
    this.element.addEventListener('focusin', () => this.pauseAutoDismiss());
    this.element.addEventListener('focusout', () => this.resumeAutoDismiss());
  }

  /**
   * Start the auto-dismiss timer
   */
  private startAutoDismissTimer(): void {
    if (!this.config.autoDismissDelay || this.isDismissed) return;
    
    this.autoDismissTimer = window.setTimeout(() => {
      if (!this.isDismissed) {
        this.dismiss();
      }
    }, this.config.autoDismissDelay);
  }

  /**
   * Pause the auto-dismiss timer
   */
  private pauseAutoDismiss(): void {
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
    }
  }

  /**
   * Resume the auto-dismiss timer
   */
  private resumeAutoDismiss(): void {
    if (this.config.autoDismissDelay && this.config.autoDismissDelay > 0 && !this.isDismissed) {
      this.startAutoDismissTimer();
    }
  }

  /**
   * Focus the notification banner
   */
  public focus(): void {
    if (!this.isVisible()) return;

    // Focus the banner itself or the first focusable element within
    const focusableElement = this.element.querySelector('[tabindex="0"], button, a, input, select, textarea') as HTMLElement;
    if (focusableElement) {
      focusableElement.focus();
    } else if (this.element.getAttribute('tabindex') === '0') {
      this.element.focus();
    }
  }

  /**
   * Update the banner content
   */
  public updateContent(text: string): void {
    this.content.textContent = text;
  }

  /**
   * Update the banner content with HTML
   */
  public updateHtml(html: string): void {
    this.content.innerHTML = html;
  }

  /**
   * Get the banner content text
   */
  public getContent(): string {
    return this.content.textContent || '';
  }

  /**
   * Get the banner content HTML
   */
  public getHtml(): string {
    return this.content.innerHTML;
  }

  /**
   * Update the banner title
   */
  public updateTitle(title: string): void {
    if (this.titleElement) {
      this.titleElement.textContent = title;
    }
  }

  /**
   * Get the banner title
   */
  public getTitle(): string {
    return this.titleElement?.textContent || '';
  }

  /**
   * Set the banner type
   */
  public setType(type: 'default' | 'success' | 'warning' | 'error' | 'info'): void {
    // Remove existing type classes
    const typeClasses = ['public-good-notification-banner--success', 'public-good-notification-banner--warning', 'public-good-notification-banner--error', 'public-good-notification-banner--info'];
    typeClasses.forEach(cls => this.element.classList.remove(cls));

    // Add new type class (skip 'default' as it's the base state)
    if (type !== 'default') {
      this.element.classList.add(`public-good-notification-banner--${type}`);
    }

    // Update ARIA attributes based on type
    this.updateAriaRole(type);
  }

  /**
   * Get the current banner type
   */
  public getType(): string {
    const typeClasses = ['success', 'warning', 'error', 'info'];
    for (const type of typeClasses) {
      if (this.element.classList.contains(`public-good-notification-banner--${type}`)) {
        return type;
      }
    }
    return 'default';
  }

  /**
   * Update ARIA role based on type
   */
  private updateAriaRole(type: string): void {
    switch (type) {
      case 'error':
      case 'warning':
        this.element.setAttribute('role', 'alert');
        break;
      case 'success':
      case 'info':
        this.element.setAttribute('role', 'status');
        break;
      default:
        this.element.setAttribute('role', 'region');
    }
  }

  /**
   * Show the notification banner
   */
  public show(): void {
    this.element.hidden = false;
    this.element.style.display = '';
    this.isDismissed = false;

    // Restart auto-dismiss if configured
    if (this.config.autoDismissDelay && this.config.autoDismissDelay > 0) {
      this.startAutoDismissTimer();
    }

    // Emit custom event
    this.element.dispatchEvent(new CustomEvent('notificationBanner:show', {
      bubbles: true,
      detail: { banner: this }
    }));
  }

  /**
   * Hide the notification banner
   */
  public hide(): void {
    this.element.style.display = 'none';
    
    // Clear auto-dismiss timer
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
    }
  }

  /**
   * Dismiss the notification banner
   */
  public dismiss(): void {
    this.isDismissed = true;
    
    // Persist dismissal if configured
    if (this.config.persistDismissal && this.config.storageKey) {
      try {
        localStorage.setItem(this.config.storageKey, 'true');
      } catch (e) {
        // localStorage might not be available, continue normally
      }
    }

    // Animate out and then hide
    this.element.style.animation = 'public-good-notification-banner-dismiss 0.3s ease-out forwards';
    
    setTimeout(() => {
      this.hide();
      this.element.style.animation = '';
    }, 300);

    // Emit custom event
    this.element.dispatchEvent(new CustomEvent('notificationBanner:dismiss', {
      bubbles: true,
      detail: { banner: this }
    }));
  }

  /**
   * Check if banner is visible
   */
  public isVisible(): boolean {
    return !this.element.hidden && this.element.style.display !== 'none' && !this.isDismissed;
  }

  /**
   * Check if banner is being dismissed (animation in progress)
   */
  public isDismissing(): boolean {
    return this.element.style.animation.includes('public-good-notification-banner-dismiss');
  }

  /**
   * Check if banner is dismissible
   */
  public isDismissible(): boolean {
    return !!this.closeButton;
  }

  /**
   * Add CSS class
   */
  public addClass(className: string): void {
    this.element.classList.add(className);
  }

  /**
   * Remove CSS class
   */
  public removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  /**
   * Check if has CSS class
   */
  public hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  /**
   * Get the banner element
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Destroy the notification banner
   */
  public destroy(): void {
    // Clear timers
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
    }

    // Remove event listeners
    if (this.closeButton) {
      this.closeButton.removeEventListener('click', this.dismiss);
      this.closeButton.removeEventListener('keydown', this.dismiss);
    }

    // Remove from DOM
    this.element.remove();
  }
}

/**
 * Create a notification banner component
 */
export function createNotificationBanner(options: NotificationBannerOptions): HTMLElement {
  const {
    text,
    html,
    type = 'default',
    dismissible = false,
    autoFocus = false,
    role = 'region',
    titleText,
    titleId,
    classes = '',
    attributes = {}
  } = options;

  // Validate that either text or html is provided
  if (text === undefined && html === undefined) {
    throw new Error('Notification banner requires either text or html option');
  }

  // Create the banner container
  const banner = document.createElement('div');
  banner.className = `public-good-notification-banner ${classes}`.trim();
  
  // Add type class
  if (type !== 'default') {
    banner.classList.add(`public-good-notification-banner--${type}`);
  }

  // Set ARIA attributes
  banner.setAttribute('role', role);
  banner.setAttribute('aria-labelledby', titleId || `notification-banner-title-${Date.now()}`);
  banner.setAttribute('tabindex', autoFocus ? '0' : '-1');

  if (autoFocus) {
    banner.setAttribute('data-auto-focus', 'true');
  }

  // Add custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    banner.setAttribute(key, value);
  });

  // Create title if provided
  let titleElement = '';
  if (titleText) {
    const actualTitleId = titleId || `notification-banner-title-${Date.now()}`;
    titleElement = `<h2 class="public-good-notification-banner__title" id="${actualTitleId}">${titleText}</h2>`;
  }

  // Create close button if dismissible
  let closeButton = '';
  if (dismissible) {
    closeButton = `
      <button class="public-good-notification-banner__close" type="button" aria-label="Dismiss notification">
        <span class="public-good-notification-banner__close-icon" aria-hidden="true">×</span>
      </button>
    `;
  }

  // Set banner content
  const content = html || text || '';
  
  banner.innerHTML = `
    ${titleElement}
    <div class="public-good-notification-banner__content">${content}</div>
    ${closeButton}
  `;

  return banner;
}

/**
 * Initialize notification banner components from data attributes
 */
export function initializeNotificationBanners(
  scope: Document | HTMLElement = document
): NotificationBanner[] {
  const elements = scope.querySelectorAll('[data-module="public-good-notification-banner"]') as NodeListOf<HTMLElement>;
  const instances: NotificationBanner[] = [];

  elements.forEach(element => {
    try {
      // Parse configuration from data attributes
      const config: NotificationBannerConfig = {};
      
      const autoDismissDelay = element.getAttribute('data-auto-dismiss-delay');
      if (autoDismissDelay) {
        config.autoDismissDelay = parseInt(autoDismissDelay, 10);
      }

      const persistDismissal = element.getAttribute('data-persist-dismissal');
      if (persistDismissal) {
        config.persistDismissal = persistDismissal === 'true';
      }

      const storageKey = element.getAttribute('data-storage-key');
      if (storageKey) {
        config.storageKey = storageKey;
      }

      const instance = new NotificationBanner(element, config);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize notification banner:', error);
    }
  });

  return instances;
}

/**
 * Helper function to create a success notification
 */
export function createSuccessNotification(
  text: string,
  options: Omit<NotificationBannerOptions, 'text' | 'type'> = {}
): HTMLElement {
  return createNotificationBanner({
    text,
    type: 'success',
    role: 'status',
    ...options
  });
}

/**
 * Helper function to create an error notification
 */
export function createErrorNotification(
  text: string,
  options: Omit<NotificationBannerOptions, 'text' | 'type'> = {}
): HTMLElement {
  return createNotificationBanner({
    text,
    type: 'error',
    role: 'alert',
    ...options
  });
}

/**
 * Helper function to create a warning notification
 */
export function createWarningNotification(
  text: string,
  options: Omit<NotificationBannerOptions, 'text' | 'type'> = {}
): HTMLElement {
  return createNotificationBanner({
    text,
    type: 'warning',
    role: 'alert',
    ...options
  });
}

/**
 * Helper function to create an info notification
 */
export function createInfoNotification(
  text: string,
  options: Omit<NotificationBannerOptions, 'text' | 'type'> = {}
): HTMLElement {
  return createNotificationBanner({
    text,
    type: 'info',
    role: 'status',
    ...options
  });
}

/**
 * Helper function to show a temporary notification
 */
export function showTemporaryNotification(
  text: string,
  type: 'success' | 'warning' | 'error' | 'info' = 'info',
  duration = 5000
): NotificationBanner {
  const banner = createNotificationBanner({
    text,
    type,
    dismissible: true,
    autoFocus: true
  });

  // Insert at top of body
  document.body.insertBefore(banner, document.body.firstChild);

  const instance = new NotificationBanner(banner, {
    autoDismissDelay: duration
  });

  return instance;
}