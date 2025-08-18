/**
 * Tabs Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides accessible tab navigation with keyboard support and ARIA compliance.
 */

/**
 * Configuration options for tab creation
 */
export interface TabOptions {
  id?: string;
  label: string;
  content?: string | HTMLElement;
  active?: boolean;
  disabled?: boolean;
  classes?: string;
  attributes?: Record<string, string>;
}

/**
 * Configuration options for tabs container
 */
export interface TabsOptions {
  title?: string;
  classes?: string;
  attributes?: Record<string, string>;
  autoActivation?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Tab configuration for the Tabs class
 */
export interface TabsConfig {
  autoActivation?: boolean;
  orientation?: 'horizontal' | 'vertical';
  enableHistory?: boolean;
  storageKey?: string;
  onTabChange?: (activeTab: number, tabElement: HTMLElement) => void;
}

/**
 * Enhanced Tabs class for programmatic tab management
 */
export class Tabs {
  private element: HTMLElement;
  private config: TabsConfig;
  private tabList: HTMLElement;
  private tabs: HTMLElement[] = [];
  private panels: HTMLElement[] = [];
  private activeTabIndex: number = 0;
  private keys = {
    END: 'End',
    HOME: 'Home',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    DELETE: 'Delete',
    ENTER: 'Enter',
    SPACE: ' '
  };

  constructor(element: HTMLElement, config: TabsConfig = {}) {
    if (!element) {
      throw new Error('Tabs component requires a container element');
    }

    this.element = element;
    this.config = {
      autoActivation: true,
      orientation: 'horizontal',
      enableHistory: false,
      storageKey: 'tabs-state',
      ...config
    };

    this.init();
  }

  private init(): void {
    this.element.classList.add('public-good-tabs');
    
    // Find or create tab list
    this.tabList = this.element.querySelector('[role="tablist"]') as HTMLElement;
    if (!this.tabList) {
      this.setupFromBasicStructure();
    }

    // Collect tabs and panels
    this.collectTabsAndPanels();
    
    // Setup ARIA attributes and event listeners
    this.setupAccessibility();
    this.setupEventListeners();
    
    // Set initial active tab
    this.setInitialActiveTab();
    
    // Restore state if enabled
    if (this.config.enableHistory) {
      this.restoreState();
    }
  }

  private setupFromBasicStructure(): void {
    // Convert basic structure to proper tabs
    const title = this.element.querySelector('.public-good-tabs__title');
    const list = this.element.querySelector('.public-good-tabs__list');
    
    if (list && !list.getAttribute('role')) {
      list.setAttribute('role', 'tablist');
      this.tabList = list as HTMLElement;
      
      // Convert list items to proper tab structure
      const listItems = list.querySelectorAll('li');
      listItems.forEach((item, index) => {
        const link = item.querySelector('a');
        if (link) {
          const tabId = `tab-${index}`;
          const panelId = link.getAttribute('href')?.substring(1) || `panel-${index}`;
          
          // Create button element
          const button = document.createElement('button');
          button.setAttribute('role', 'tab');
          button.setAttribute('id', tabId);
          button.setAttribute('aria-controls', panelId);
          button.setAttribute('aria-selected', 'false');
          button.setAttribute('tabindex', '-1');
          button.className = 'public-good-tabs__tab';
          button.textContent = link.textContent || '';
          
          // Replace link with button
          item.replaceChild(button, link);
          item.className = 'public-good-tabs__list-item';
        }
      });
    }
  }

  private collectTabsAndPanels(): void {
    if (!this.tabList) {
      this.tabs = [];
      this.panels = [];
      return;
    }
    
    this.tabs = Array.from(this.tabList.querySelectorAll('[role="tab"]'));
    
    // Find corresponding panels
    this.panels = this.tabs.map(tab => {
      const panelId = tab.getAttribute('aria-controls');
      const panel = panelId ? this.element.querySelector(`#${panelId}`) : null;
      return panel as HTMLElement;
    }).filter(Boolean);
    
    // Ensure panels have proper attributes
    this.panels.forEach((panel, index) => {
      if (panel) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('tabindex', '0');
        
        const tabId = this.tabs[index]?.getAttribute('id');
        if (tabId) {
          panel.setAttribute('aria-labelledby', tabId);
        }
        
        if (!panel.classList.contains('public-good-tabs__panel')) {
          panel.classList.add('public-good-tabs__panel');
        }
      }
    });
  }

  private setupAccessibility(): void {
    // Setup tablist ARIA attributes
    if (this.tabList) {
      this.tabList.setAttribute('role', 'tablist');
      
      if (this.config.orientation === 'vertical') {
        this.tabList.setAttribute('aria-orientation', 'vertical');
        this.element.classList.add('public-good-tabs--vertical');
      }
      
      // Add accessible label
      const title = this.element.querySelector('.public-good-tabs__title');
      if (title && !this.tabList.getAttribute('aria-label') && !this.tabList.getAttribute('aria-labelledby')) {
        if (!title.id) {
          title.id = `tabs-title-${Math.random().toString(36).substr(2, 9)}`;
        }
        this.tabList.setAttribute('aria-labelledby', title.id);
      }
    }

    // Setup individual tabs
    this.tabs.forEach((tab, index) => {
      if (!tab.getAttribute('id')) {
        tab.setAttribute('id', `tab-${index}`);
      }
      
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
      
      if (!tab.classList.contains('public-good-tabs__tab')) {
        tab.classList.add('public-good-tabs__tab');
      }
    });
  }

  private setupEventListeners(): void {
    // Tab click events
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        this.activateTab(index);
      });

      tab.addEventListener('keydown', (event) => {
        this.handleKeyDown(event, index);
      });
    });

    // Handle hash changes for history support
    if (this.config.enableHistory) {
      window.addEventListener('hashchange', () => {
        this.handleHashChange();
      });
    }
  }

  private handleKeyDown(event: KeyboardEvent, currentIndex: number): void {
    const { key } = event;
    let newIndex = currentIndex;
    let preventDefault = false;

    switch (key) {
      case this.keys.LEFT:
      case this.keys.UP:
        newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        preventDefault = true;
        break;

      case this.keys.RIGHT:
      case this.keys.DOWN:
        newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        preventDefault = true;
        break;

      case this.keys.HOME:
        newIndex = 0;
        preventDefault = true;
        break;

      case this.keys.END:
        newIndex = this.tabs.length - 1;
        preventDefault = true;
        break;

      case this.keys.ENTER:
      case this.keys.SPACE:
        this.activateTab(currentIndex);
        preventDefault = true;
        break;

      case this.keys.DELETE:
        if (this.isTabRemovable(currentIndex)) {
          this.removeTab(currentIndex);
          preventDefault = true;
        }
        break;
    }

    if (preventDefault) {
      event.preventDefault();
    }

    if (newIndex !== currentIndex) {
      this.focusTab(newIndex);
      
      if (this.config.autoActivation) {
        this.activateTab(newIndex);
      }
    }
  }

  private setInitialActiveTab(): void {
    // Check for pre-selected tab
    let initialIndex = 0;
    
    this.tabs.forEach((tab, index) => {
      if (tab.getAttribute('aria-selected') === 'true' || 
          tab.classList.contains('public-good-tabs__tab--active') ||
          tab.closest('.public-good-tabs__list-item')?.classList.contains('public-good-tabs__list-item--selected')) {
        initialIndex = index;
      }
    });

    this.activateTab(initialIndex);
  }

  private activateTab(index: number): void {
    if (index < 0 || index >= this.tabs.length) {
      return;
    }

    const previousIndex = this.activeTabIndex;
    this.activeTabIndex = index;

    // Update all tabs and panels
    this.tabs.forEach((tab, i) => {
      const isActive = i === index;
      const panel = this.panels[i];
      const listItem = tab.closest('.public-good-tabs__list-item');

      // Update tab attributes and classes
      tab.setAttribute('aria-selected', isActive.toString());
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      
      tab.classList.toggle('public-good-tabs__tab--active', isActive);
      if (listItem) {
        listItem.classList.toggle('public-good-tabs__list-item--selected', isActive);
      }

      // Update panel visibility
      if (panel) {
        if (isActive) {
          panel.removeAttribute('hidden');
          panel.classList.add('public-good-tabs__panel--active');
        } else {
          panel.setAttribute('hidden', '');
          panel.classList.remove('public-good-tabs__panel--active');
        }
      }
    });

    // Focus the active tab if it wasn't already focused
    if (document.activeElement !== this.tabs[index]) {
      this.focusTab(index);
    }

    // Save state if history is enabled
    if (this.config.enableHistory) {
      this.saveState();
    }

    // Trigger callback
    if (this.config.onTabChange) {
      this.config.onTabChange(index, this.tabs[index]);
    }

    // Emit custom event
    this.element.dispatchEvent(new CustomEvent('tabs:changed', {
      detail: {
        tabs: this,
        activeIndex: index,
        previousIndex: previousIndex,
        activeTab: this.tabs[index],
        activePanel: this.panels[index]
      }
    }));
  }

  private focusTab(index: number): void {
    if (this.tabs[index]) {
      this.tabs[index].focus();
    }
  }

  private isTabRemovable(index: number): boolean {
    const tab = this.tabs[index];
    return tab && tab.hasAttribute('data-removable');
  }

  private removeTab(index: number): void {
    if (index < 0 || index >= this.tabs.length || !this.isTabRemovable(index)) {
      return;
    }

    const tab = this.tabs[index];
    const panel = this.panels[index];
    const listItem = tab.closest('.public-good-tabs__list-item');

    // Remove elements from DOM
    if (listItem) {
      listItem.remove();
    } else {
      tab.remove();
    }
    
    if (panel) {
      panel.remove();
    }

    // Update internal arrays
    this.tabs.splice(index, 1);
    this.panels.splice(index, 1);

    // Adjust active tab index if necessary
    if (index === this.activeTabIndex) {
      const newActiveIndex = Math.min(index, this.tabs.length - 1);
      this.activateTab(Math.max(0, newActiveIndex));
    } else if (index < this.activeTabIndex) {
      this.activeTabIndex--;
    }

    // Emit removal event
    this.element.dispatchEvent(new CustomEvent('tabs:removed', {
      detail: {
        tabs: this,
        removedIndex: index,
        remainingTabs: this.tabs.length
      }
    }));
  }

  private handleHashChange(): void {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const index = this.tabs.findIndex(tab => {
        const panelId = tab.getAttribute('aria-controls');
        return panelId === hash;
      });
      
      if (index !== -1) {
        this.activateTab(index);
      }
    }
  }

  private saveState(): void {
    if (this.config.storageKey) {
      const state = {
        activeIndex: this.activeTabIndex,
        panelId: this.panels[this.activeTabIndex]?.id
      };
      
      try {
        localStorage.setItem(this.config.storageKey, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save tabs state:', error);
      }
    }
  }

  private restoreState(): void {
    if (this.config.storageKey) {
      try {
        const stored = localStorage.getItem(this.config.storageKey);
        if (stored) {
          const state = JSON.parse(stored);
          if (state.activeIndex >= 0 && state.activeIndex < this.tabs.length) {
            this.activateTab(state.activeIndex);
          }
        }
      } catch (error) {
        console.warn('Failed to restore tabs state:', error);
      }
    }
  }

  /**
   * Get the currently active tab index
   */
  getActiveTabIndex(): number {
    return this.activeTabIndex;
  }

  /**
   * Get the currently active tab element
   */
  getActiveTab(): HTMLElement | null {
    return this.tabs[this.activeTabIndex] || null;
  }

  /**
   * Get the currently active panel element
   */
  getActivePanel(): HTMLElement | null {
    return this.panels[this.activeTabIndex] || null;
  }

  /**
   * Activate a specific tab by index
   */
  setActiveTab(index: number): void {
    this.activateTab(index);
  }

  /**
   * Add a new tab
   */
  addTab(options: TabOptions, insertAt?: number): void {
    const index = insertAt !== undefined ? insertAt : this.tabs.length;
    
    // Create tab element
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', options.id || `tab-${Date.now()}`);
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
    tab.className = `public-good-tabs__tab ${options.classes || ''}`;
    tab.textContent = options.label;
    
    if (options.disabled) {
      tab.setAttribute('disabled', '');
      tab.setAttribute('aria-disabled', 'true');
    }
    
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        tab.setAttribute(key, value);
      });
    }

    // Create panel element
    const panelId = `panel-${tab.id}`;
    const panel = document.createElement('div');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', panelId);
    panel.setAttribute('aria-labelledby', tab.id);
    panel.setAttribute('tabindex', '0');
    panel.setAttribute('hidden', '');
    panel.className = 'public-good-tabs__panel';
    
    if (typeof options.content === 'string') {
      panel.innerHTML = options.content;
    } else if (options.content instanceof HTMLElement) {
      panel.appendChild(options.content);
    }

    // Create list item if needed
    const listItem = document.createElement('li');
    listItem.className = 'public-good-tabs__list-item';
    listItem.appendChild(tab);

    // Insert into DOM
    const targetItem = this.tabList.children[index];
    if (targetItem) {
      this.tabList.insertBefore(listItem, targetItem);
    } else {
      this.tabList.appendChild(listItem);
    }
    
    this.element.appendChild(panel);

    // Update internal arrays
    this.tabs.splice(index, 0, tab);
    this.panels.splice(index, 0, panel);
    
    // Update aria-controls
    tab.setAttribute('aria-controls', panelId);

    // Setup event listeners for new tab
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      this.activateTab(this.tabs.indexOf(tab));
    });

    tab.addEventListener('keydown', (event) => {
      this.handleKeyDown(event, this.tabs.indexOf(tab));
    });

    // Activate if specified
    if (options.active) {
      this.activateTab(index);
    }

    // Emit addition event
    this.element.dispatchEvent(new CustomEvent('tabs:added', {
      detail: {
        tabs: this,
        addedIndex: index,
        totalTabs: this.tabs.length
      }
    }));
  }

  /**
   * Enable or disable a tab
   */
  setTabDisabled(index: number, disabled: boolean): void {
    const tab = this.tabs[index];
    if (!tab) return;

    if (disabled) {
      tab.setAttribute('disabled', '');
      tab.setAttribute('aria-disabled', 'true');
      tab.classList.add('public-good-tabs__tab--disabled');
    } else {
      tab.removeAttribute('disabled');
      tab.removeAttribute('aria-disabled');
      tab.classList.remove('public-good-tabs__tab--disabled');
    }
  }

  /**
   * Update tab label
   */
  setTabLabel(index: number, label: string): void {
    const tab = this.tabs[index];
    if (tab) {
      tab.textContent = label;
    }
  }

  /**
   * Get all tab elements
   */
  getTabs(): HTMLElement[] {
    return [...this.tabs];
  }

  /**
   * Get all panel elements
   */
  getPanels(): HTMLElement[] {
    return [...this.panels];
  }

  /**
   * Get the tabs container element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Destroy the tabs instance
   */
  destroy(): void {
    // Remove event listeners
    this.tabs.forEach(tab => {
      tab.replaceWith(tab.cloneNode(true));
    });

    // Remove classes
    this.element.classList.remove('public-good-tabs', 'public-good-tabs--vertical');
    
    // Clear state
    if (this.config.enableHistory && this.config.storageKey) {
      try {
        localStorage.removeItem(this.config.storageKey);
      } catch (error) {
        console.warn('Failed to clear tabs state:', error);
      }
    }
  }
}

/**
 * Create a basic tabs container
 */
export function createTabs(options: TabsOptions = {}): HTMLElement {
  const container = document.createElement('div');
  container.className = `public-good-tabs ${options.classes || ''}`;
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      container.setAttribute(key, value);
    });
  }

  if (options.title) {
    const title = document.createElement('h2');
    title.className = 'public-good-tabs__title';
    title.textContent = options.title;
    container.appendChild(title);
  }

  const tabList = document.createElement('ul');
  tabList.className = 'public-good-tabs__list';
  tabList.setAttribute('role', 'tablist');
  
  if (options.orientation === 'vertical') {
    tabList.setAttribute('aria-orientation', 'vertical');
  }
  
  container.appendChild(tabList);

  return container;
}

/**
 * Create a complete tabs interface with tabs and panels
 */
export function createTabsWithContent(
  tabs: TabOptions[],
  options: TabsOptions = {}
): HTMLElement {
  const container = createTabs(options);
  const tabList = container.querySelector('.public-good-tabs__list') as HTMLElement;

  // Set up accessible labeling if there's a title
  const title = container.querySelector('.public-good-tabs__title');
  if (title && tabList) {
    if (!title.id) {
      title.id = `tabs-title-${Math.random().toString(36).substr(2, 9)}`;
    }
    tabList.setAttribute('aria-labelledby', title.id);
  }

  tabs.forEach((tabOption, index) => {
    // Create tab
    const listItem = document.createElement('li');
    listItem.className = 'public-good-tabs__list-item';
    
    const tab = document.createElement('button');
    tab.className = 'public-good-tabs__tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', tabOption.id || `tab-${index}`);
    tab.setAttribute('aria-selected', tabOption.active ? 'true' : 'false');
    tab.setAttribute('tabindex', tabOption.active ? '0' : '-1');
    tab.textContent = tabOption.label;
    
    if (tabOption.classes) {
      tab.className += ` ${tabOption.classes}`;
    }
    
    if (tabOption.disabled) {
      tab.setAttribute('disabled', '');
      tab.setAttribute('aria-disabled', 'true');
    }
    
    if (tabOption.attributes) {
      Object.entries(tabOption.attributes).forEach(([key, value]) => {
        tab.setAttribute(key, value);
      });
    }

    // Create panel
    const panelId = `panel-${tab.id}`;
    const panel = document.createElement('div');
    panel.className = 'public-good-tabs__panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', panelId);
    panel.setAttribute('aria-labelledby', tab.id);
    panel.setAttribute('tabindex', '0');
    
    if (!tabOption.active) {
      panel.setAttribute('hidden', '');
    }

    if (typeof tabOption.content === 'string') {
      panel.innerHTML = tabOption.content;
    } else if (tabOption.content instanceof HTMLElement) {
      panel.appendChild(tabOption.content);
    }

    // Connect tab and panel
    tab.setAttribute('aria-controls', panelId);
    
    // Add to DOM
    listItem.appendChild(tab);
    tabList.appendChild(listItem);
    container.appendChild(panel);
    
    // Mark as active if specified
    if (tabOption.active) {
      listItem.classList.add('public-good-tabs__list-item--selected');
      tab.classList.add('public-good-tabs__tab--active');
      panel.classList.add('public-good-tabs__panel--active');
    }
  });

  return container;
}

/**
 * Initialize tabs from existing markup
 */
export function initializeTabs(scope: Document | HTMLElement = document): Tabs[] {
  const tabElements = scope.querySelectorAll('[data-module="public-good-tabs"]') as NodeListOf<HTMLElement>;
  const instances: Tabs[] = [];
  
  tabElements.forEach(element => {
    try {
      const config: TabsConfig = {};
      
      // Parse configuration from data attributes
      if (element.hasAttribute('data-auto-activation')) {
        config.autoActivation = element.getAttribute('data-auto-activation') !== 'false';
      }
      
      if (element.hasAttribute('data-orientation')) {
        config.orientation = element.getAttribute('data-orientation') as 'horizontal' | 'vertical';
      }
      
      if (element.hasAttribute('data-enable-history')) {
        config.enableHistory = element.getAttribute('data-enable-history') === 'true';
      }
      
      if (element.hasAttribute('data-storage-key')) {
        config.storageKey = element.getAttribute('data-storage-key') || undefined;
      }
      
      const instance = new Tabs(element, config);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize tabs:', error);
    }
  });
  
  return instances;
}

/**
 * Validate tabs accessibility
 */
export function validateTabsAccessibility(
  scope: Document | HTMLElement = document
): {
  tabs: HTMLElement[];
  issues: string[];
} {
  const tabContainers = scope.querySelectorAll('.public-good-tabs') as NodeListOf<HTMLElement>;
  const issues: string[] = [];
  
  tabContainers.forEach((container, index) => {
    const containerNumber = index + 1;
    
    // Check for proper tablist structure
    const tablist = container.querySelector('[role="tablist"]') || container;
    const tabs = tablist.querySelectorAll('[role="tab"]');
    const panels = container.querySelectorAll('[role="tabpanel"]');
    
    if (tabs.length === 0) {
      issues.push(`Tabs container ${containerNumber} should contain elements with role="tab"`);
    }
    
    if (panels.length === 0) {
      issues.push(`Tabs container ${containerNumber} should contain elements with role="tabpanel"`);
    }
    
    if (tabs.length !== panels.length) {
      issues.push(`Tabs container ${containerNumber} should have equal numbers of tabs (${tabs.length}) and panels (${panels.length})`);
    }
    
    // Check individual tabs
    let hasActiveTab = false;
    tabs.forEach((tab, tabIndex) => {
      const tabNumber = tabIndex + 1;
      
      if (!tab.getAttribute('id')) {
        issues.push(`Tab ${tabNumber} in container ${containerNumber} should have an id attribute`);
      }
      
      if (!tab.getAttribute('aria-controls')) {
        issues.push(`Tab ${tabNumber} in container ${containerNumber} should have aria-controls attribute`);
      }
      
      const ariaSelected = tab.getAttribute('aria-selected');
      if (!ariaSelected) {
        issues.push(`Tab ${tabNumber} in container ${containerNumber} should have aria-selected attribute`);
      } else if (ariaSelected === 'true') {
        if (hasActiveTab) {
          issues.push(`Container ${containerNumber} should have only one active tab`);
        }
        hasActiveTab = true;
      }
      
      // Check corresponding panel
      const panelId = tab.getAttribute('aria-controls');
      if (panelId) {
        const panel = container.querySelector(`#${panelId}`);
        if (!panel) {
          issues.push(`Tab ${tabNumber} in container ${containerNumber} references non-existent panel #${panelId}`);
        } else {
          if (!panel.getAttribute('aria-labelledby')) {
            issues.push(`Panel #${panelId} should have aria-labelledby attribute`);
          }
        }
      }
    });
    
    if (!hasActiveTab && tabs.length > 0) {
      issues.push(`Container ${containerNumber} should have one active tab (aria-selected="true")`);
    }
    
    // Check for accessible labeling
    const hasAriaLabel = tablist.getAttribute('aria-label');
    const hasAriaLabelledBy = tablist.getAttribute('aria-labelledby');
    
    if (!hasAriaLabel && !hasAriaLabelledBy) {
      issues.push(`Tabs container ${containerNumber} should have aria-label or aria-labelledby for accessibility`);
    }
  });
  
  return {
    tabs: Array.from(tabContainers),
    issues
  };
}