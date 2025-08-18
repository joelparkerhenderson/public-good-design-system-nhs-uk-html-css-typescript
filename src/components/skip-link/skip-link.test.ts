import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { 
  SkipLink,
  createSkipLink,
  createMainContentSkipLink,
  createPageSkipLinks,
  ensureSkipTarget,
  validateSkipLinks,
  initializeSkipLinks
} from './skip-link';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLAnchorElement = dom.window.HTMLAnchorElement;

// Mock scrollIntoView for JSDOM
global.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Skip Link Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createSkipLink', () => {
    it('should create a basic skip link with default options', () => {
      const link = createSkipLink({});

      expect(link.classList.contains('public-good-skip-link')).toBe(true);
      expect(link.tagName).toBe('A');
      expect(link.textContent).toBe('Skip to main content');
      expect(link.getAttribute('href')).toBe('#main');
    });

    it('should create skip link with custom text and href', () => {
      const link = createSkipLink({
        text: 'Skip to navigation',
        href: '#navigation'
      });

      expect(link.textContent).toBe('Skip to navigation');
      expect(link.getAttribute('href')).toBe('#navigation');
    });

    it('should add custom classes and attributes', () => {
      const link = createSkipLink({
        text: 'Custom skip link',
        classes: 'custom-class another-class',
        attributes: {
          'data-test': 'skip-value',
          'aria-describedby': 'skip-description'
        }
      });

      expect(link.classList.contains('custom-class')).toBe(true);
      expect(link.classList.contains('another-class')).toBe(true);
      expect(link.getAttribute('data-test')).toBe('skip-value');
      expect(link.getAttribute('aria-describedby')).toBe('skip-description');
    });
  });

  describe('SkipLink Class', () => {
    let linkElement: HTMLAnchorElement;
    let targetElement: HTMLElement;
    let instance: SkipLink;

    beforeEach(() => {
      // Create target element
      targetElement = document.createElement('main');
      targetElement.id = 'main-content';
      container.appendChild(targetElement);

      // Create skip link
      linkElement = createSkipLink({
        text: 'Skip to main content',
        href: '#main-content'
      });
      container.appendChild(linkElement);

      instance = new SkipLink(linkElement);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
      expect(instance.getText()).toBe('Skip to main content');
      expect(instance.getHref()).toBe('#main-content');
      expect(instance.getTarget()).toBe(targetElement);
    });

    it('should throw error for non-anchor element', () => {
      const divElement = document.createElement('div');
      
      expect(() => {
        new SkipLink(divElement as any);
      }).toThrow('Skip link component requires an anchor element');
    });

    it('should update text and href', () => {
      instance.updateText('Skip to footer');
      expect(instance.getText()).toBe('Skip to footer');

      instance.updateHref('#footer');
      expect(instance.getHref()).toBe('#footer');
    });

    it('should handle focus and blur events', () => {
      linkElement.dispatchEvent(new Event('focus'));
      expect(linkElement.classList.contains('public-good-skip-link--focused')).toBe(true);

      linkElement.dispatchEvent(new Event('blur'));
      expect(linkElement.classList.contains('public-good-skip-link--focused')).toBe(false);
    });

    it('should handle click events', () => {
      const clickEvent = new Event('click');
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

      // Mock scrollIntoView
      targetElement.scrollIntoView = vi.fn();

      linkElement.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    it('should handle keyboard events', () => {
      const clickSpy = vi.spyOn(linkElement, 'click');

      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const enterPreventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');
      linkElement.dispatchEvent(enterEvent);
      
      expect(enterPreventDefaultSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();

      clickSpy.mockClear();

      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      const spacePreventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');
      linkElement.dispatchEvent(spaceEvent);
      
      expect(spacePreventDefaultSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should focus target element when activated', () => {
      targetElement.focus = vi.fn();
      targetElement.scrollIntoView = vi.fn();
      
      instance.activate();
      
      expect(targetElement.focus).toHaveBeenCalled();
      expect(targetElement.scrollIntoView).toHaveBeenCalled();
    });

    it('should make target focusable if needed', () => {
      // Remove any existing tabindex
      targetElement.removeAttribute('tabindex');
      
      targetElement.focus = vi.fn();
      targetElement.scrollIntoView = vi.fn();
      
      instance.activate();
      
      // Should temporarily add tabindex="-1"
      expect(targetElement.getAttribute('tabindex')).toBe('-1');
      expect(targetElement.focus).toHaveBeenCalled();
    });

    it('should emit custom event on activation', () => {
      const eventSpy = vi.fn();
      linkElement.addEventListener('skipLink:activated', eventSpy);
      
      targetElement.scrollIntoView = vi.fn();
      
      instance.activate();
      
      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.skipLink).toBe(instance);
      expect(eventSpy.mock.calls[0][0].detail.target).toBe(targetElement);
      expect(eventSpy.mock.calls[0][0].detail.href).toBe('#main-content');
    });

    it('should check visibility state', () => {
      expect(instance.isVisible()).toBe(false);
      
      linkElement.classList.add('public-good-skip-link--focused');
      expect(instance.isVisible()).toBe(true);
    });

    it('should manage CSS classes', () => {
      instance.addClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(true);

      instance.removeClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(false);
    });

    it('should handle missing target gracefully', () => {
      instance.updateHref('#nonexistent');
      expect(instance.getTarget()).toBeNull();
      
      // Should not throw when activated with missing target
      expect(() => instance.activate()).not.toThrow();
    });
  });

  describe('Helper Functions', () => {
    describe('createMainContentSkipLink', () => {
      it('should create main content skip link with defaults', () => {
        const link = createMainContentSkipLink();
        
        expect(link.textContent).toBe('Skip to main content');
        expect(link.getAttribute('href')).toBe('#main');
      });

      it('should create main content skip link with custom options', () => {
        const link = createMainContentSkipLink('Skip to content', 'content');
        
        expect(link.textContent).toBe('Skip to content');
        expect(link.getAttribute('href')).toBe('#content');
      });
    });

    describe('createPageSkipLinks', () => {
      it('should create container with multiple skip links', () => {
        const container = createPageSkipLinks([
          { text: 'Skip to main content', href: '#main' },
          { text: 'Skip to navigation', href: '#nav' },
          { text: 'Skip to footer', href: '#footer' }
        ]);

        expect(container.classList.contains('public-good-skip-links')).toBe(true);
        
        const links = container.querySelectorAll('.public-good-skip-link');
        expect(links).toHaveLength(3);
        expect(links[0].textContent).toBe('Skip to main content');
        expect(links[1].textContent).toBe('Skip to navigation');
        expect(links[2].textContent).toBe('Skip to footer');
      });

      it('should create empty container for no links', () => {
        const container = createPageSkipLinks([]);
        
        expect(container.classList.contains('public-good-skip-links')).toBe(true);
        expect(container.querySelectorAll('.public-good-skip-link')).toHaveLength(0);
      });
    });

    describe('ensureSkipTarget', () => {
      it('should return existing target element', () => {
        const existing = document.createElement('main');
        existing.id = 'existing-main';
        document.body.appendChild(existing);

        const result = ensureSkipTarget('existing-main');
        
        expect(result).toBe(existing);
        expect(result.getAttribute('tabindex')).toBe('-1');
      });

      it('should create target element if missing', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        
        const result = ensureSkipTarget('new-target');
        
        expect(result.id).toBe('new-target');
        expect(result.getAttribute('tabindex')).toBe('-1');
        expect(document.getElementById('new-target')).toBe(result);
        expect(consoleSpy).toHaveBeenCalledWith(
          'Skip link target #new-target was created automatically. Consider adding it manually for better control.'
        );
        
        consoleSpy.mockRestore();
      });

      it('should insert target in logical position', () => {
        const header = document.createElement('header');
        const main = document.createElement('main');
        document.body.appendChild(header);
        document.body.appendChild(main);

        const result = ensureSkipTarget('logical-target');
        
        expect(result.nextSibling).toBe(main);
        expect(result.previousSibling).toBe(header);
      });
    });

    describe('validateSkipLinks', () => {
      it('should validate correctly formed skip links', () => {
        const target = document.createElement('main');
        target.id = 'main-content';
        container.appendChild(target);

        const link = createSkipLink({
          text: 'Skip to main',
          href: '#main-content'
        });
        container.appendChild(link);

        const result = validateSkipLinks(container);
        
        expect(result.skipLinks).toHaveLength(1);
        expect(result.issues).toHaveLength(0);
        expect(result.targets).toHaveLength(1);
        expect(result.targets[0]).toBe(target);
      });

      it('should detect missing skip links', () => {
        const result = validateSkipLinks(container);
        
        expect(result.skipLinks).toHaveLength(0);
        expect(result.issues).toContain('No skip links found on page');
      });

      it('should detect skip link issues', () => {
        // Link with missing href
        const linkNoHref = document.createElement('a');
        linkNoHref.className = 'public-good-skip-link';
        linkNoHref.textContent = 'Skip link';
        container.appendChild(linkNoHref);

        // Link with non-fragment href
        const linkBadHref = createSkipLink({
          text: 'Skip link',
          href: 'http://example.com'
        });
        container.appendChild(linkBadHref);

        // Link with missing target
        const linkMissingTarget = createSkipLink({
          text: 'Skip link',
          href: '#missing-target'
        });
        container.appendChild(linkMissingTarget);

        // Link with no text
        const linkNoText = createSkipLink({
          text: '',
          href: '#target'
        });
        container.appendChild(linkNoText);

        const result = validateSkipLinks(container);
        
        expect(result.skipLinks).toHaveLength(4);
        expect(result.issues.length).toBeGreaterThanOrEqual(4);
        expect(result.issues).toContain('Skip link 1 is missing href attribute');
        expect(result.issues).toContain('Skip link 2 href should be a page fragment (starting with #)');
        expect(result.issues).toContain('Skip link 3 target #missing-target does not exist');
        expect(result.issues).toContain('Skip link 4 has no visible text');
      });
    });
  });

  describe('initializeSkipLinks', () => {
    it('should initialize skip links from data attributes', () => {
      const link1 = createSkipLink({
        text: 'Skip link 1',
        attributes: { 'data-module': 'public-good-skip-link' }
      });
      const link2 = createSkipLink({
        text: 'Skip link 2',
        attributes: { 
          'data-module': 'public-good-skip-link',
          'data-scroll-behavior': 'auto',
          'data-focus-target': 'false'
        }
      });
      
      container.appendChild(link1);
      container.appendChild(link2);

      const instances = initializeSkipLinks(container);
      
      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(SkipLink);
      expect(instances[1]).toBeInstanceOf(SkipLink);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-skip-link');
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeSkipLinks(container);
      
      expect(instances).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize skip link:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should work with document scope', () => {
      const link = createSkipLink({
        text: 'Document skip link',
        attributes: { 'data-module': 'public-good-skip-link' }
      });
      document.body.appendChild(link);

      const instances = initializeSkipLinks();
      
      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });
  });

  describe('Configuration Options', () => {
    it('should respect scroll behavior configuration', () => {
      const target = document.createElement('main');
      target.id = 'scroll-target';
      target.scrollIntoView = vi.fn();
      container.appendChild(target);

      const link = createSkipLink({
        href: '#scroll-target'
      });
      container.appendChild(link);

      const instance = new SkipLink(link, {
        scrollBehavior: 'auto'
      });

      instance.activate();

      expect(target.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start'
      });

      instance.destroy();
    });

    it('should respect focus target configuration', () => {
      const target = document.createElement('main');
      target.id = 'focus-target';
      target.scrollIntoView = vi.fn();
      target.focus = vi.fn();
      container.appendChild(target);

      const link = createSkipLink({
        href: '#focus-target'
      });
      container.appendChild(link);

      const instance = new SkipLink(link, {
        focusTarget: false
      });

      instance.activate();

      expect(target.scrollIntoView).toHaveBeenCalled();
      expect(target.focus).not.toHaveBeenCalled();

      instance.destroy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper anchor element structure', () => {
      const link = createSkipLink({
        text: 'Accessible skip link'
      });

      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toBeTruthy();
      expect(link.textContent).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const link = createSkipLink({
        text: 'Keyboard skip link'
      });
      container.appendChild(link);

      const instance = new SkipLink(link);
      const clickSpy = vi.spyOn(link, 'click');

      // Should respond to Enter key
      link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(clickSpy).toHaveBeenCalled();

      clickSpy.mockClear();

      // Should respond to Space key
      link.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(clickSpy).toHaveBeenCalled();

      instance.destroy();
    });

    it('should handle focus management correctly', () => {
      const target = document.createElement('div');
      target.id = 'focus-test';
      target.focus = vi.fn();
      target.scrollIntoView = vi.fn();
      container.appendChild(target);

      const link = createSkipLink({
        href: '#focus-test'
      });
      container.appendChild(link);

      const instance = new SkipLink(link);
      
      instance.activate();

      // Target should receive focus
      expect(target.focus).toHaveBeenCalled();
      
      // Should have tabindex for focusability
      expect(target.getAttribute('tabindex')).toBe('-1');

      instance.destroy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty href', () => {
      const link = document.createElement('a');
      link.className = 'public-good-skip-link';
      link.textContent = 'Skip link';
      // No href attribute
      container.appendChild(link);

      const instance = new SkipLink(link);
      
      expect(instance.getHref()).toBe('');
      expect(instance.getTarget()).toBeNull();
      
      // Should not throw when activated
      expect(() => instance.activate()).not.toThrow();

      instance.destroy();
    });

    it('should handle malformed href', () => {
      const link = createSkipLink({
        text: 'Skip link',
        href: 'malformed-href'
      });
      container.appendChild(link);

      const instance = new SkipLink(link);
      
      expect(instance.getTarget()).toBeNull();
      
      // Should not throw when activated
      expect(() => instance.activate()).not.toThrow();

      instance.destroy();
    });

    it('should handle multiple skip links to same target', () => {
      const target = document.createElement('main');
      target.id = 'shared-target';
      container.appendChild(target);

      const link1 = createSkipLink({
        text: 'Skip link 1',
        href: '#shared-target'
      });
      const link2 = createSkipLink({
        text: 'Skip link 2',
        href: '#shared-target'
      });
      
      container.appendChild(link1);
      container.appendChild(link2);

      const instance1 = new SkipLink(link1);
      const instance2 = new SkipLink(link2);

      expect(instance1.getTarget()).toBe(target);
      expect(instance2.getTarget()).toBe(target);

      instance1.destroy();
      instance2.destroy();
    });
  });
});