import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { 
  createContentsList, 
  createSimpleContentsList,
  initializeContentsLists,
  setCurrentPage,
  getContentsListItems 
} from './contents-list';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;

describe('Contents List Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createContentsList', () => {
    it('should create a basic contents list', () => {
      const items = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2', current: true },
        { href: '/page3', text: 'Page 3' }
      ];

      const contentsList = createContentsList({ items });
      container.appendChild(contentsList);

      expect(contentsList.tagName).toBe('NAV');
      expect(contentsList.classList.contains('public-good-contents-list')).toBe(true);
      expect(contentsList.getAttribute('role')).toBe('navigation');
      expect(contentsList.getAttribute('aria-label')).toBe('Pages in this guide');

      const heading = contentsList.querySelector('h2');
      expect(heading?.textContent).toBe('Contents');
      expect(heading?.classList.contains('public-good-u-visually-hidden')).toBe(true);

      const list = contentsList.querySelector('ol');
      expect(list?.classList.contains('public-good-contents-list__list')).toBe(true);

      const listItems = contentsList.querySelectorAll('.public-good-contents-list__item');
      expect(listItems).toHaveLength(3);
    });

    it('should create links for non-current items', () => {
      const items = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2' }
      ];

      const contentsList = createContentsList({ items });
      
      const links = contentsList.querySelectorAll('.public-good-contents-list__link');
      expect(links).toHaveLength(2);
      
      const firstLink = links[0] as HTMLAnchorElement;
      expect(firstLink.href).toContain('/page1');
      expect(firstLink.textContent).toBe('Page 1');
    });

    it('should create current page indicator', () => {
      const items = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2', current: true }
      ];

      const contentsList = createContentsList({ items });
      
      const currentItem = contentsList.querySelector('[aria-current="page"]');
      expect(currentItem).toBeTruthy();
      
      const currentSpan = contentsList.querySelector('.public-good-contents-list__current');
      expect(currentSpan?.textContent).toBe('Page 2');
    });

    it('should handle custom classes and attributes', () => {
      const items = [{ href: '/page1', text: 'Page 1' }];
      
      const contentsList = createContentsList({
        items,
        classes: 'custom-class',
        attributes: { 'data-test': 'value' },
        ariaLabel: 'Custom navigation',
        hiddenHeading: 'Custom heading'
      });

      expect(contentsList.classList.contains('custom-class')).toBe(true);
      expect(contentsList.getAttribute('data-test')).toBe('value');
      expect(contentsList.getAttribute('aria-label')).toBe('Custom navigation');
      
      const heading = contentsList.querySelector('h2');
      expect(heading?.textContent).toBe('Custom heading');
    });
  });

  describe('createSimpleContentsList', () => {
    it('should create a simple contents list', () => {
      const items = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2', current: true }
      ];

      const contentsList = createSimpleContentsList(items);
      
      expect(contentsList.classList.contains('public-good-contents-list')).toBe(true);
      expect(contentsList.querySelectorAll('.public-good-contents-list__item')).toHaveLength(2);
    });
  });

  describe('setCurrentPage', () => {
    let contentsList: HTMLElement;

    beforeEach(() => {
      const items = [
        { href: '/page1', text: 'Page 1', current: true },
        { href: '/page2', text: 'Page 2' },
        { href: '/page3', text: 'Page 3' }
      ];
      contentsList = createContentsList({ items });
      container.appendChild(contentsList);
    });

    it('should update current page indicator', () => {
      setCurrentPage(contentsList, '/page2');

      // Check that page 1 is no longer current (should be a link now)
      const links = contentsList.querySelectorAll('.public-good-contents-list__link');
      const page1Link = Array.from(links).find(link => 
        (link as HTMLAnchorElement).href.includes('/page1')
      );
      expect(page1Link).toBeTruthy();
      expect(page1Link?.textContent).toBe('Page 1');

      // Check page 2 is now current
      const newCurrent = Array.from(contentsList.querySelectorAll('.public-good-contents-list__item'))
        .find(item => item.getAttribute('aria-current') === 'page');
      expect(newCurrent?.querySelector('.public-good-contents-list__current')?.textContent).toBe('Page 2');
      
      // Verify old current page (page 1) no longer has aria-current
      const page1Item = page1Link?.closest('.public-good-contents-list__item');
      expect(page1Item?.getAttribute('aria-current')).toBeNull();
    });
  });

  describe('getContentsListItems', () => {
    it('should extract items from existing contents list', () => {
      const originalItems = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2', current: true },
        { href: '/page3', text: 'Page 3' }
      ];

      const contentsList = createContentsList({ items: originalItems });
      const extractedItems = getContentsListItems(contentsList);

      expect(extractedItems).toHaveLength(3);
      expect(extractedItems[0].text).toBe('Page 1');
      expect(extractedItems[0].current).toBe(false);
      expect(extractedItems[1].text).toBe('Page 2');
      expect(extractedItems[1].current).toBe(true);
    });
  });

  describe('initializeContentsLists', () => {
    it('should initialize from data attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-module', 'public-good-contents-list');
      element.setAttribute('data-items', JSON.stringify([
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2', current: true }
      ]));
      element.setAttribute('data-classes', 'custom-class');
      element.setAttribute('data-aria-label', 'Test navigation');
      
      container.appendChild(element);

      const instances = initializeContentsLists(container);
      
      expect(instances).toHaveLength(1);
      const contentsList = instances[0];
      expect(contentsList.classList.contains('public-good-contents-list')).toBe(true);
      expect(contentsList.classList.contains('custom-class')).toBe(true);
      expect(contentsList.getAttribute('aria-label')).toBe('Test navigation');
    });

    it('should parse from existing DOM structure', () => {
      const element = document.createElement('div');
      element.setAttribute('data-module', 'public-good-contents-list');
      element.innerHTML = `
        <a href="/page1">Page 1</a>
        <span aria-current="page">Page 2</span>
        <a href="/page3">Page 3</a>
      `;
      
      container.appendChild(element);

      const instances = initializeContentsLists(container);
      
      expect(instances).toHaveLength(1);
      const contentsList = instances[0];
      const items = getContentsListItems(contentsList);
      expect(items).toHaveLength(3);
      expect(items[1].current).toBe(true);
    });

    it('should handle invalid JSON gracefully', () => {
      const element = document.createElement('div');
      element.setAttribute('data-module', 'public-good-contents-list');
      element.setAttribute('data-items', 'invalid json');
      
      container.appendChild(element);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const instances = initializeContentsLists(container);
      
      expect(instances).toHaveLength(1);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle initialization errors gracefully', () => {
      const element = document.createElement('div');
      element.setAttribute('data-module', 'public-good-contents-list');
      element.setAttribute('data-items', '{"invalid": "json"'); // Invalid JSON to cause parse error
      container.appendChild(element);
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const instances = initializeContentsLists(container);
      
      // Should still create instance but with empty items due to JSON parse error
      expect(instances).toHaveLength(1);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper navigation semantics', () => {
      const items = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2', current: true }
      ];

      const contentsList = createContentsList({ items });
      
      expect(contentsList.getAttribute('role')).toBe('navigation');
      expect(contentsList.getAttribute('aria-label')).toBe('Pages in this guide');
      
      const hiddenHeading = contentsList.querySelector('h2');
      expect(hiddenHeading?.classList.contains('public-good-u-visually-hidden')).toBe(true);
    });

    it('should mark current page correctly', () => {
      const items = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2', current: true }
      ];

      const contentsList = createContentsList({ items });
      
      const currentItem = contentsList.querySelector('[aria-current="page"]');
      expect(currentItem).toBeTruthy();
      expect(currentItem?.querySelector('.public-good-contents-list__current')).toBeTruthy();
    });

    it('should have accessible link structure', () => {
      const items = [
        { href: '/page1', text: 'Page 1' },
        { href: '/page2', text: 'Page 2' }
      ];

      const contentsList = createContentsList({ items });
      
      const links = contentsList.querySelectorAll('.public-good-contents-list__link');
      links.forEach(link => {
        expect((link as HTMLAnchorElement).href).toBeTruthy();
        expect(link.textContent?.trim()).toBeTruthy();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', () => {
      const contentsList = createContentsList({ items: [] });
      
      expect(contentsList.classList.contains('public-good-contents-list')).toBe(true);
      expect(contentsList.querySelectorAll('.public-good-contents-list__item')).toHaveLength(0);
    });

    it('should handle items with empty text', () => {
      const items = [
        { href: '/page1', text: '' },
        { href: '/page2', text: 'Page 2' }
      ];

      const contentsList = createContentsList({ items });
      
      const listItems = contentsList.querySelectorAll('.public-good-contents-list__item');
      expect(listItems).toHaveLength(2);
    });

    it('should handle multiple current items', () => {
      const items = [
        { href: '/page1', text: 'Page 1', current: true },
        { href: '/page2', text: 'Page 2', current: true }
      ];

      const contentsList = createContentsList({ items });
      
      const currentItems = contentsList.querySelectorAll('[aria-current="page"]');
      expect(currentItems).toHaveLength(2);
    });
  });
});