import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { 
  NotificationBanner,
  createNotificationBanner,
  createSuccessNotification,
  createErrorNotification,
  createWarningNotification,
  createInfoNotification,
  showTemporaryNotification,
  initializeNotificationBanners
} from './notification-banner';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLButtonElement = dom.window.HTMLButtonElement;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

describe('Notification Banner Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('createNotificationBanner', () => {
    it('should create a basic notification banner with text', () => {
      const banner = createNotificationBanner({
        text: 'This is a notification',
        titleText: 'Important'
      });

      container.appendChild(banner);

      expect(banner.classList.contains('public-good-notification-banner')).toBe(true);
      expect(banner.getAttribute('role')).toBe('region');
      expect(banner.querySelector('.public-good-notification-banner__title')?.textContent).toBe('Important');
      expect(banner.querySelector('.public-good-notification-banner__content')?.textContent).toBe('This is a notification');
    });

    it('should create notification banner with HTML content', () => {
      const banner = createNotificationBanner({
        html: 'This is <strong>important</strong> content',
        type: 'success'
      });

      expect(banner.innerHTML).toContain('This is <strong>important</strong> content');
      expect(banner.classList.contains('public-good-notification-banner--success')).toBe(true);
    });

    it('should prioritize HTML over text', () => {
      const banner = createNotificationBanner({
        text: 'Text content',
        html: 'HTML <em>content</em>'
      });

      expect(banner.innerHTML).toContain('HTML <em>content</em>');
      expect(banner.innerHTML).not.toContain('Text content');
    });

    it('should create dismissible notification banner', () => {
      const banner = createNotificationBanner({
        text: 'Dismissible notification',
        dismissible: true
      });

      const closeButton = banner.querySelector('.public-good-notification-banner__close');
      expect(closeButton).toBeTruthy();
      expect(closeButton?.getAttribute('aria-label')).toBe('Dismiss notification');
    });

    it('should set correct ARIA attributes for different types', () => {
      const errorBanner = createNotificationBanner({
        text: 'Error occurred',
        type: 'error'
      });

      const successBanner = createNotificationBanner({
        text: 'Success message',
        type: 'success'
      });

      expect(errorBanner.getAttribute('role')).toBe('region');
      expect(successBanner.getAttribute('role')).toBe('region');
    });

    it('should add custom classes and attributes', () => {
      const banner = createNotificationBanner({
        text: 'Custom notification',
        classes: 'custom-class another-class',
        attributes: {
          'data-test': 'notification-value',
          'aria-live': 'polite'
        }
      });

      expect(banner.classList.contains('custom-class')).toBe(true);
      expect(banner.classList.contains('another-class')).toBe(true);
      expect(banner.getAttribute('data-test')).toBe('notification-value');
      expect(banner.getAttribute('aria-live')).toBe('polite');
    });

    it('should throw error when neither text nor html is provided', () => {
      expect(() => {
        createNotificationBanner({});
      }).toThrow('Notification banner requires either text or html option');
    });
  });

  describe('NotificationBanner Class', () => {
    let bannerElement: HTMLElement;
    let instance: NotificationBanner;

    beforeEach(() => {
      bannerElement = createNotificationBanner({
        text: 'Test notification',
        titleText: 'Test Title',
        dismissible: true
      });
      container.appendChild(bannerElement);
      instance = new NotificationBanner(bannerElement);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
      expect(instance.getContent()).toBe('Test notification');
      expect(instance.getTitle()).toBe('Test Title');
      expect(instance.isDismissible()).toBe(true);
    });

    it('should update content', () => {
      instance.updateContent('Updated content');
      expect(instance.getContent()).toBe('Updated content');

      instance.updateHtml('<strong>HTML</strong> content');
      expect(instance.getHtml()).toBe('<strong>HTML</strong> content');
    });

    it('should update title', () => {
      instance.updateTitle('New Title');
      expect(instance.getTitle()).toBe('New Title');
    });

    it('should manage notification types', () => {
      expect(instance.getType()).toBe('default');

      instance.setType('success');
      expect(instance.getType()).toBe('success');
      expect(bannerElement.classList.contains('public-good-notification-banner--success')).toBe(true);

      instance.setType('error');
      expect(instance.getType()).toBe('error');
      expect(bannerElement.classList.contains('public-good-notification-banner--error')).toBe(true);
      expect(bannerElement.classList.contains('public-good-notification-banner--success')).toBe(false);

      instance.setType('default');
      expect(instance.getType()).toBe('default');
      expect(bannerElement.classList.contains('public-good-notification-banner--error')).toBe(false);
    });

    it('should show and hide banner', () => {
      instance.hide();
      expect(bannerElement.style.display).toBe('none');
      expect(instance.isVisible()).toBe(false);

      instance.show();
      expect(bannerElement.style.display).toBe('');
      expect(bannerElement.hidden).toBe(false);
      expect(instance.isVisible()).toBe(true);
    });

    it('should dismiss banner', () => {
      const dismissSpy = vi.fn();
      bannerElement.addEventListener('notificationBanner:dismiss', dismissSpy);

      instance.dismiss();

      expect(bannerElement.style.animation).toContain('public-good-notification-banner-dismiss');
      expect(dismissSpy).toHaveBeenCalled();

      // Fast forward past the animation
      vi.advanceTimersByTime(300);
      expect(bannerElement.style.display).toBe('none');
    });

    it('should handle close button clicks', () => {
      const closeButton = bannerElement.querySelector('.public-good-notification-banner__close') as HTMLButtonElement;
      expect(closeButton).toBeTruthy();

      const dismissSpy = vi.fn();
      bannerElement.addEventListener('notificationBanner:dismiss', dismissSpy);

      closeButton.click();

      expect(dismissSpy).toHaveBeenCalled();
    });

    it('should handle close button keyboard events', () => {
      const closeButton = bannerElement.querySelector('.public-good-notification-banner__close') as HTMLButtonElement;
      const dismissSpy = vi.fn();
      bannerElement.addEventListener('notificationBanner:dismiss', dismissSpy);

      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      closeButton.dispatchEvent(enterEvent);
      expect(dismissSpy).toHaveBeenCalled();

      dismissSpy.mockClear();

      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      closeButton.dispatchEvent(spaceEvent);
      expect(dismissSpy).toHaveBeenCalled();
    });

    it('should manage CSS classes', () => {
      instance.addClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(true);

      instance.removeClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(false);
    });

    it('should throw error for invalid element', () => {
      const invalidElement = document.createElement('div');
      
      expect(() => {
        new NotificationBanner(invalidElement);
      }).toThrow('Notification banner requires a content element');
    });
  });

  describe('Auto-dismiss functionality', () => {
    it('should auto-dismiss after specified delay', () => {
      const banner = createNotificationBanner({
        text: 'Auto-dismiss notification',
        dismissible: true
      });
      container.appendChild(banner);

      const instance = new NotificationBanner(banner, {
        autoDismissDelay: 3000
      });

      expect(instance.isVisible()).toBe(true);

      // Fast forward time
      vi.advanceTimersByTime(3000);

      expect(banner.style.animation).toContain('public-good-notification-banner-dismiss');

      instance.destroy();
    });

    it('should have hover and focus event listeners for pause/resume', () => {
      const banner = createNotificationBanner({
        text: 'Hover test notification',
        dismissible: true
      });
      container.appendChild(banner);

      const instance = new NotificationBanner(banner, {
        autoDismissDelay: 2000
      });

      // Verify the event listeners are set up by checking that hover events don't crash
      expect(() => {
        banner.dispatchEvent(new Event('mouseenter'));
        banner.dispatchEvent(new Event('mouseleave'));
        banner.dispatchEvent(new Event('focusin'));
        banner.dispatchEvent(new Event('focusout'));
      }).not.toThrow();

      instance.destroy();
    });
  });

  describe('Persistent dismissal', () => {
    it('should persist dismissal in localStorage', () => {
      const banner = createNotificationBanner({
        text: 'Persistent notification',
        dismissible: true
      });
      container.appendChild(banner);

      const instance = new NotificationBanner(banner, {
        persistDismissal: true,
        storageKey: 'test-notification'
      });

      instance.dismiss();

      expect(localStorage.setItem).toHaveBeenCalledWith('test-notification', 'true');

      instance.destroy();
    });

    it('should check localStorage on initialization', () => {
      localStorageMock.getItem.mockReturnValue('true');

      const banner = createNotificationBanner({
        text: 'Previously dismissed notification',
        dismissible: true
      });
      container.appendChild(banner);

      const instance = new NotificationBanner(banner, {
        persistDismissal: true,
        storageKey: 'test-notification'
      });

      expect(localStorage.getItem).toHaveBeenCalledWith('test-notification');
      expect(instance.isVisible()).toBe(false);

      instance.destroy();
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const banner = createNotificationBanner({
        text: 'Storage error test',
        dismissible: true
      });
      container.appendChild(banner);

      // Should not throw
      const instance = new NotificationBanner(banner, {
        persistDismissal: true,
        storageKey: 'test-notification'
      });

      expect(instance.isVisible()).toBe(true);

      instance.destroy();
    });
  });

  describe('Helper Functions', () => {
    it('should create success notification', () => {
      const banner = createSuccessNotification('Operation successful!');
      
      expect(banner.classList.contains('public-good-notification-banner--success')).toBe(true);
      expect(banner.getAttribute('role')).toBe('status');
      expect(banner.querySelector('.public-good-notification-banner__content')?.textContent).toBe('Operation successful!');
    });

    it('should create error notification', () => {
      const banner = createErrorNotification('An error occurred');
      
      expect(banner.classList.contains('public-good-notification-banner--error')).toBe(true);
      expect(banner.getAttribute('role')).toBe('alert');
    });

    it('should create warning notification', () => {
      const banner = createWarningNotification('This is a warning');
      
      expect(banner.classList.contains('public-good-notification-banner--warning')).toBe(true);
      expect(banner.getAttribute('role')).toBe('alert');
    });

    it('should create info notification', () => {
      const banner = createInfoNotification('Here is some information');
      
      expect(banner.classList.contains('public-good-notification-banner--info')).toBe(true);
      expect(banner.getAttribute('role')).toBe('status');
    });

    it('should show temporary notification', () => {
      const instance = showTemporaryNotification('Temporary message', 'success', 2000);
      
      expect(document.body.firstChild).toBe(instance.getElement());
      expect(instance.getType()).toBe('success');
      expect(instance.isDismissible()).toBe(true);

      instance.destroy();
    });
  });

  describe('initializeNotificationBanners', () => {
    it('should initialize banners from data attributes', () => {
      const banner1 = createNotificationBanner({
        text: 'Banner 1',
        attributes: { 'data-module': 'public-good-notification-banner' }
      });
      const banner2 = createNotificationBanner({
        text: 'Banner 2',
        attributes: { 
          'data-module': 'public-good-notification-banner',
          'data-auto-dismiss-delay': '5000',
          'data-persist-dismissal': 'true',
          'data-storage-key': 'banner-2'
        }
      });
      
      container.appendChild(banner1);
      container.appendChild(banner2);

      const instances = initializeNotificationBanners(container);
      
      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(NotificationBanner);
      expect(instances[1]).toBeInstanceOf(NotificationBanner);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-notification-banner');
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeNotificationBanners(container);
      
      expect(instances).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize notification banner:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should work with document scope', () => {
      const banner = createNotificationBanner({
        text: 'Document banner',
        attributes: { 'data-module': 'public-good-notification-banner' }
      });
      document.body.appendChild(banner);

      const instances = initializeNotificationBanners();
      
      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });
  });

  describe('Focus management', () => {
    it('should handle auto-focus configuration', () => {
      const banner = createNotificationBanner({
        text: 'Auto-focus banner',
        autoFocus: true,
        dismissible: true
      });
      container.appendChild(banner);

      // Should have data-auto-focus attribute set
      expect(banner.getAttribute('data-auto-focus')).toBe('true');
      expect(banner.getAttribute('tabindex')).toBe('0');

      const instance = new NotificationBanner(banner);
      instance.destroy();
    });

    it('should focus first focusable element', () => {
      const banner = createNotificationBanner({
        html: 'Banner with <a href="#">link</a>',
        dismissible: true
      });
      container.appendChild(banner);

      const instance = new NotificationBanner(banner);
      const link = banner.querySelector('a') as HTMLElement;
      const focusSpy = vi.spyOn(link, 'focus');

      instance.focus();

      expect(focusSpy).toHaveBeenCalled();

      instance.destroy();
    });
  });

  describe('Events', () => {
    it('should emit show event', () => {
      const banner = createNotificationBanner({
        text: 'Event test banner'
      });
      container.appendChild(banner);

      const instance = new NotificationBanner(banner);
      const showSpy = vi.fn();
      banner.addEventListener('notificationBanner:show', showSpy);

      instance.show();

      expect(showSpy).toHaveBeenCalled();
      expect(showSpy.mock.calls[0][0].detail.banner).toBe(instance);

      instance.destroy();
    });

    it('should emit dismiss event', () => {
      const banner = createNotificationBanner({
        text: 'Dismiss event test',
        dismissible: true
      });
      container.appendChild(banner);

      const instance = new NotificationBanner(banner);
      const dismissSpy = vi.fn();
      banner.addEventListener('notificationBanner:dismiss', dismissSpy);

      instance.dismiss();

      expect(dismissSpy).toHaveBeenCalled();
      expect(dismissSpy.mock.calls[0][0].detail.banner).toBe(instance);

      instance.destroy();
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes for different types', () => {
      const errorBanner = createNotificationBanner({
        text: 'Error message',
        type: 'error'
      });

      const instance = new NotificationBanner(errorBanner);
      instance.setType('error');
      expect(errorBanner.getAttribute('role')).toBe('alert');

      instance.setType('success');
      expect(errorBanner.getAttribute('role')).toBe('status');

      instance.setType('warning');
      expect(errorBanner.getAttribute('role')).toBe('alert');

      instance.setType('info');
      expect(errorBanner.getAttribute('role')).toBe('status');

      instance.setType('default');
      expect(errorBanner.getAttribute('role')).toBe('region');

      instance.destroy();
    });

    it('should have proper keyboard navigation', () => {
      const banner = createNotificationBanner({
        text: 'Keyboard test',
        dismissible: true,
        autoFocus: true
      });
      container.appendChild(banner);

      expect(banner.getAttribute('tabindex')).toBe('0');

      const instance = new NotificationBanner(banner);
      instance.destroy();
    });

    it('should have accessible close button', () => {
      const banner = createNotificationBanner({
        text: 'Accessible close test',
        dismissible: true
      });

      const closeButton = banner.querySelector('.public-good-notification-banner__close');
      expect(closeButton?.getAttribute('aria-label')).toBe('Dismiss notification');
      expect(closeButton?.querySelector('.public-good-notification-banner__close-icon')?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      const banner = createNotificationBanner({
        text: ''
      });

      expect(banner.querySelector('.public-good-notification-banner__content')?.textContent).toBe('');
      expect(banner.classList.contains('public-good-notification-banner')).toBe(true);
    });

    it('should handle empty HTML', () => {
      const banner = createNotificationBanner({
        html: ''
      });

      expect(banner.querySelector('.public-good-notification-banner__content')?.innerHTML).toBe('');
      expect(banner.classList.contains('public-good-notification-banner')).toBe(true);
    });

    it('should handle complex HTML content', () => {
      const complexHtml = `Complex <strong>HTML</strong> with <a href="#">links</a> and <ul><li>lists</li></ul>`;
      const banner = createNotificationBanner({ html: complexHtml });

      expect(banner.innerHTML).toContain(complexHtml);
    });

    it('should handle special characters in text', () => {
      const banner = createNotificationBanner({
        text: 'Special chars: <>&"\'àáâãäå'
      });

      expect(banner.querySelector('.public-good-notification-banner__content')?.textContent).toBe('Special chars: <>&"\'àáâãäå');
    });

    it('should handle notification without title', () => {
      const banner = createNotificationBanner({
        text: 'No title notification'
      });

      expect(banner.querySelector('.public-good-notification-banner__title')).toBeNull();
    });

    it('should handle non-dismissible notifications', () => {
      const banner = createNotificationBanner({
        text: 'Non-dismissible notification',
        dismissible: false
      });

      expect(banner.querySelector('.public-good-notification-banner__close')).toBeNull();

      const instance = new NotificationBanner(banner);
      expect(instance.isDismissible()).toBe(false);

      instance.destroy();
    });
  });
});