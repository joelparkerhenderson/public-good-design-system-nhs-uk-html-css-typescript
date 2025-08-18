/**
 * Contents List Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides a navigation component for content sections with visual indicators
 * and current page highlighting
 */

export interface ContentsListItem {
  href: string;
  text: string;
  current?: boolean;
}

export interface ContentsListOptions {
  items: ContentsListItem[];
  classes?: string;
  attributes?: Record<string, string>;
  ariaLabel?: string;
  hiddenHeading?: string;
}

/**
 * Create a contents list navigation component
 */
export function createContentsList(options: ContentsListOptions): HTMLElement {
  const {
    items,
    classes = '',
    attributes = {},
    ariaLabel = 'Pages in this guide',
    hiddenHeading = 'Contents'
  } = options;

  // Create main navigation container
  const nav = document.createElement('nav');
  nav.className = `public-good-contents-list ${classes}`.trim();
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', ariaLabel);

  // Add custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    nav.setAttribute(key, value);
  });

  // Create visually hidden heading
  const heading = document.createElement('h2');
  heading.className = 'public-good-u-visually-hidden';
  heading.textContent = hiddenHeading;
  nav.appendChild(heading);

  // Create ordered list
  const ol = document.createElement('ol');
  ol.className = 'public-good-contents-list__list';

  // Create list items
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'public-good-contents-list__item';

    if (item.current) {
      li.setAttribute('aria-current', 'page');
      
      const span = document.createElement('span');
      span.className = 'public-good-contents-list__current';
      span.textContent = item.text;
      span.setAttribute('data-original-href', item.href);
      li.appendChild(span);
    } else {
      const link = document.createElement('a');
      link.className = 'public-good-contents-list__link';
      link.href = item.href;
      link.textContent = item.text;
      li.appendChild(link);
    }

    ol.appendChild(li);
  });

  nav.appendChild(ol);
  return nav;
}

/**
 * Initialize contents list components from data attributes
 */
export function initializeContentsLists(scope: Document | HTMLElement = document): HTMLElement[] {
  const elements = scope.querySelectorAll('[data-module="public-good-contents-list"]') as NodeListOf<HTMLElement>;
  const instances: HTMLElement[] = [];

  elements.forEach(element => {
    try {
      // Parse data attributes for configuration
      const config = parseContentsListData(element);
      
      // Replace existing element with properly structured one
      const contentsList = createContentsList(config);
      element.parentNode?.replaceChild(contentsList, element);
      instances.push(contentsList);
    } catch (error) {
      console.error('Failed to initialize contents list:', error);
    }
  });

  return instances;
}

/**
 * Parse contents list configuration from data attributes
 */
function parseContentsListData(element: HTMLElement): ContentsListOptions {
  const config: ContentsListOptions = {
    items: [],
    classes: element.dataset.classes || '',
    ariaLabel: element.dataset.ariaLabel || 'Pages in this guide',
    hiddenHeading: element.dataset.hiddenHeading || 'Contents'
  };

  // Parse items from data-items attribute (JSON)
  if (element.dataset.items) {
    try {
      config.items = JSON.parse(element.dataset.items);
    } catch (error) {
      console.error('Invalid JSON in data-items attribute:', error);
    }
  } else {
    // Fallback: parse from existing DOM structure
    const links = element.querySelectorAll('a, [aria-current="page"]');
    config.items = Array.from(links).map(link => {
      const item: ContentsListItem = {
        href: (link as HTMLAnchorElement).href || '#',
        text: link.textContent?.trim() || '',
        current: link.getAttribute('aria-current') === 'page'
      };
      return item;
    });
  }

  return config;
}

/**
 * Helper function to create a simple contents list with array of items
 */
export function createSimpleContentsList(items: Array<{href: string; text: string; current?: boolean}>): HTMLElement {
  return createContentsList({ items });
}

/**
 * Helper function to highlight current page in existing contents list
 */
export function setCurrentPage(contentsList: HTMLElement, href: string): void {
  // Remove existing current page indicators
  const currentItems = contentsList.querySelectorAll('[aria-current="page"]');
  currentItems.forEach(item => {
    item.removeAttribute('aria-current');
    
    // Convert span back to link if it was current
    const span = item.querySelector('.public-good-contents-list__current');
    if (span) {
      const originalHref = span.getAttribute('data-original-href') || '#';
      const link = document.createElement('a');
      link.className = 'public-good-contents-list__link';
      link.href = originalHref;
      link.textContent = span.textContent;
      span.parentNode?.replaceChild(link, span);
    }
  });

  // Find and set new current page
  const links = contentsList.querySelectorAll('.public-good-contents-list__link');
  links.forEach(link => {
    const anchor = link as HTMLAnchorElement;
    if (anchor.href === href || anchor.getAttribute('href') === href) {
      const listItem = anchor.closest('.public-good-contents-list__item');
      if (listItem) {
        listItem.setAttribute('aria-current', 'page');
        
        // Convert link to span and store original href
        const span = document.createElement('span');
        span.className = 'public-good-contents-list__current';
        span.textContent = anchor.textContent;
        span.setAttribute('data-original-href', anchor.href);
        anchor.parentNode?.replaceChild(span, anchor);
      }
    }
  });
}

/**
 * Get all items from a contents list
 */
export function getContentsListItems(contentsList: HTMLElement): ContentsListItem[] {
  const items: ContentsListItem[] = [];
  const listItems = contentsList.querySelectorAll('.public-good-contents-list__item');

  listItems.forEach(item => {
    const link = item.querySelector('.public-good-contents-list__link') as HTMLAnchorElement;
    const current = item.querySelector('.public-good-contents-list__current');
    
    if (link) {
      items.push({
        href: link.href,
        text: link.textContent?.trim() || '',
        current: false
      });
    } else if (current) {
      items.push({
        href: '#',
        text: current.textContent?.trim() || '',
        current: true
      });
    }
  });

  return items;
}