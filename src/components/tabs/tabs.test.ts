import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  Tabs,
  createTabs,
  createTabsWithContent,
  initializeTabs,
  validateTabsAccessibility,
  type TabOptions,
  type TabsOptions
} from './tabs';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
} as any;

describe('Tabs Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up all tabs instances and elements
    document.body.innerHTML = '';
    // Also clean container 
    if (container && container.parentNode) {
      container.innerHTML = '';
    }
  });

  describe('createTabs', () => {
    it('should create a basic tabs container with default options', () => {
      const tabs = createTabs();

      expect(tabs.classList.contains('public-good-tabs')).toBe(true);
      expect(tabs.tagName).toBe('DIV');
      
      const tabList = tabs.querySelector('.public-good-tabs__list');
      expect(tabList).toBeTruthy();
      expect(tabList?.getAttribute('role')).toBe('tablist');
    });

    it('should create tabs container with title', () => {
      const tabs = createTabs({
        title: 'Test Tabs Title'
      });

      const title = tabs.querySelector('.public-good-tabs__title');
      expect(title).toBeTruthy();
      expect(title?.textContent).toBe('Test Tabs Title');
    });

    it('should add custom classes and attributes', () => {
      const tabs = createTabs({
        classes: 'custom-class another-class',
        attributes: {
          'data-test': 'tabs-value',
          'id': 'test-tabs'
        }
      });

      expect(tabs.classList.contains('custom-class')).toBe(true);
      expect(tabs.classList.contains('another-class')).toBe(true);
      expect(tabs.getAttribute('data-test')).toBe('tabs-value');
      expect(tabs.getAttribute('id')).toBe('test-tabs');
    });

    it('should handle vertical orientation', () => {
      const tabs = createTabs({
        orientation: 'vertical'
      });

      const tabList = tabs.querySelector('.public-good-tabs__list');
      expect(tabList?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  describe('createTabsWithContent', () => {
    it('should create a complete tabs interface', () => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'First Tab', content: '<p>First content</p>', active: true },
        { id: 'tab-2', label: 'Second Tab', content: '<p>Second content</p>' },
        { id: 'tab-3', label: 'Third Tab', content: '<p>Third content</p>' }
      ];

      const tabs = createTabsWithContent(tabOptions, {
        title: 'Test Tabs'
      });

      // Check structure
      expect(tabs.querySelector('.public-good-tabs__title')?.textContent).toBe('Test Tabs');
      expect(tabs.querySelectorAll('[role="tab"]')).toHaveLength(3);
      expect(tabs.querySelectorAll('[role="tabpanel"]')).toHaveLength(3);

      // Check tabs
      const tabElements = tabs.querySelectorAll('[role="tab"]');
      expect(tabElements[0].textContent).toBe('First Tab');
      expect(tabElements[0].getAttribute('aria-selected')).toBe('true');
      expect(tabElements[1].getAttribute('aria-selected')).toBe('false');

      // Check panels
      const panels = tabs.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].innerHTML).toBe('<p>First content</p>');
      expect(panels[0].hasAttribute('hidden')).toBe(false);
      expect(panels[1].hasAttribute('hidden')).toBe(true);
    });

    it('should handle disabled tabs', () => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Enabled Tab', content: 'Content 1' },
        { id: 'tab-2', label: 'Disabled Tab', content: 'Content 2', disabled: true }
      ];

      const tabs = createTabsWithContent(tabOptions);
      const tabElements = tabs.querySelectorAll('[role="tab"]');

      expect(tabElements[1].hasAttribute('disabled')).toBe(true);
      expect(tabElements[1].getAttribute('aria-disabled')).toBe('true');
    });

    it('should handle HTMLElement content', () => {
      const contentElement = document.createElement('div');
      contentElement.innerHTML = '<strong>HTML Content</strong>';

      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'HTML Tab', content: contentElement }
      ];

      const tabs = createTabsWithContent(tabOptions);
      const panel = tabs.querySelector('[role="tabpanel"]');

      expect(panel?.querySelector('strong')?.textContent).toBe('HTML Content');
    });
  });

  describe('Tabs Class', () => {
    let tabsElement: HTMLElement;
    let instance: Tabs;

    beforeEach(() => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'First Tab', content: 'First content', active: true },
        { id: 'tab-2', label: 'Second Tab', content: 'Second content' },
        { id: 'tab-3', label: 'Third Tab', content: 'Third content' }
      ];

      tabsElement = createTabsWithContent(tabOptions);
      container.appendChild(tabsElement);

      instance = new Tabs(tabsElement, {
        autoActivation: true,
        orientation: 'horizontal'
      });
    });

    afterEach(() => {
      instance?.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
      expect(tabsElement.classList.contains('public-good-tabs')).toBe(true);
      expect(instance.getActiveTabIndex()).toBe(0);
      expect(instance.getActiveTab()?.textContent).toBe('First Tab');
    });

    it('should throw error for invalid element', () => {
      expect(() => {
        new Tabs(null as any);
      }).toThrow('Tabs component requires a container element');
    });

    it('should handle tab activation by click', () => {
      const secondTab = tabsElement.querySelectorAll('[role="tab"]')[1] as HTMLElement;
      
      secondTab.click();
      
      expect(instance.getActiveTabIndex()).toBe(1);
      expect(secondTab.getAttribute('aria-selected')).toBe('true');
      
      const panels = tabsElement.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].hasAttribute('hidden')).toBe(true);
      expect(panels[1].hasAttribute('hidden')).toBe(false);
    });

    it('should handle keyboard navigation', () => {
      const firstTab = tabsElement.querySelectorAll('[role="tab"]')[0] as HTMLElement;
      firstTab.focus();

      // Test Right Arrow
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const rightPreventDefaultSpy = vi.spyOn(rightArrowEvent, 'preventDefault');
      firstTab.dispatchEvent(rightArrowEvent);

      expect(rightPreventDefaultSpy).toHaveBeenCalled();
      expect(instance.getActiveTabIndex()).toBe(1);

      // Test Left Arrow
      const secondTab = tabsElement.querySelectorAll('[role="tab"]')[1] as HTMLElement;
      const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const leftPreventDefaultSpy = vi.spyOn(leftArrowEvent, 'preventDefault');
      secondTab.dispatchEvent(leftArrowEvent);

      expect(leftPreventDefaultSpy).toHaveBeenCalled();
      expect(instance.getActiveTabIndex()).toBe(0);
    });

    it('should handle Home and End keys', () => {
      const firstTab = tabsElement.querySelectorAll('[role="tab"]')[0] as HTMLElement;

      // Test End key
      const endEvent = new KeyboardEvent('keydown', { key: 'End' });
      const endPreventDefaultSpy = vi.spyOn(endEvent, 'preventDefault');
      firstTab.dispatchEvent(endEvent);

      expect(endPreventDefaultSpy).toHaveBeenCalled();
      expect(instance.getActiveTabIndex()).toBe(2);

      // Test Home key
      const thirdTab = tabsElement.querySelectorAll('[role="tab"]')[2] as HTMLElement;
      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      const homePreventDefaultSpy = vi.spyOn(homeEvent, 'preventDefault');
      thirdTab.dispatchEvent(homeEvent);

      expect(homePreventDefaultSpy).toHaveBeenCalled();
      expect(instance.getActiveTabIndex()).toBe(0);
    });

    it('should handle Enter and Space keys', () => {
      const secondTab = tabsElement.querySelectorAll('[role="tab"]')[1] as HTMLElement;

      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const enterPreventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');
      secondTab.dispatchEvent(enterEvent);

      expect(enterPreventDefaultSpy).toHaveBeenCalled();
      expect(instance.getActiveTabIndex()).toBe(1);

      // Test Space key
      const thirdTab = tabsElement.querySelectorAll('[role="tab"]')[2] as HTMLElement;
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      const spacePreventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');
      thirdTab.dispatchEvent(spaceEvent);

      expect(spacePreventDefaultSpy).toHaveBeenCalled();
      expect(instance.getActiveTabIndex()).toBe(2);
    });

    it('should emit custom events on tab change', () => {
      const eventSpy = vi.fn();
      tabsElement.addEventListener('tabs:changed', eventSpy);

      instance.setActiveTab(1);

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.tabs).toBe(instance);
      expect(eventSpy.mock.calls[0][0].detail.activeIndex).toBe(1);
      expect(eventSpy.mock.calls[0][0].detail.previousIndex).toBe(0);
    });

    it('should programmatically set active tab', () => {
      instance.setActiveTab(2);

      expect(instance.getActiveTabIndex()).toBe(2);
      expect(instance.getActiveTab()?.textContent).toBe('Third Tab');
      
      const panels = tabsElement.querySelectorAll('[role="tabpanel"]');
      expect(panels[2].hasAttribute('hidden')).toBe(false);
      expect(panels[0].hasAttribute('hidden')).toBe(true);
      expect(panels[1].hasAttribute('hidden')).toBe(true);
    });

    it('should get tabs and panels', () => {
      const tabs = instance.getTabs();
      const panels = instance.getPanels();

      expect(tabs).toHaveLength(3);
      expect(panels).toHaveLength(3);
      expect(tabs[0].textContent).toBe('First Tab');
      expect(panels[0].getAttribute('role')).toBe('tabpanel');
    });

    it('should return tabs element', () => {
      expect(instance.getElement()).toBe(tabsElement);
    });
  });

  describe('Dynamic Tab Management', () => {
    let tabsElement: HTMLElement;
    let instance: Tabs;

    beforeEach(() => {
      tabsElement = createTabs({ title: 'Dynamic Tabs' });
      container.appendChild(tabsElement);
      instance = new Tabs(tabsElement);
    });

    afterEach(() => {
      instance?.destroy();
    });

    it('should add new tabs', () => {
      instance.addTab({
        id: 'new-tab',
        label: 'New Tab',
        content: '<p>New content</p>'
      });

      expect(instance.getTabs()).toHaveLength(1);
      expect(instance.getPanels()).toHaveLength(1);
      expect(instance.getTabs()[0].textContent).toBe('New Tab');
    });

    it('should add tab at specific position', () => {
      instance.addTab({ label: 'Tab 1', content: 'Content 1' });
      instance.addTab({ label: 'Tab 3', content: 'Content 3' });
      instance.addTab({ label: 'Tab 2', content: 'Content 2' }, 1);

      const tabs = instance.getTabs();
      expect(tabs).toHaveLength(3);
      expect(tabs[0].textContent).toBe('Tab 1');
      expect(tabs[1].textContent).toBe('Tab 2');
      expect(tabs[2].textContent).toBe('Tab 3');
    });

    it('should activate newly added tab if specified', () => {
      instance.addTab({ label: 'Tab 1', content: 'Content 1' });
      instance.addTab({ 
        label: 'Active Tab', 
        content: 'Active Content', 
        active: true 
      });

      expect(instance.getActiveTabIndex()).toBe(1);
      expect(instance.getActiveTab()?.textContent).toBe('Active Tab');
    });

    it('should disable and enable tabs', () => {
      instance.addTab({ label: 'Tab 1', content: 'Content 1' });
      instance.addTab({ label: 'Tab 2', content: 'Content 2' });

      instance.setTabDisabled(1, true);
      const tab = instance.getTabs()[1];
      expect(tab.hasAttribute('disabled')).toBe(true);
      expect(tab.getAttribute('aria-disabled')).toBe('true');

      instance.setTabDisabled(1, false);
      expect(tab.hasAttribute('disabled')).toBe(false);
      expect(tab.hasAttribute('aria-disabled')).toBe(false);
    });

    it('should update tab labels', () => {
      instance.addTab({ label: 'Original Label', content: 'Content' });
      
      instance.setTabLabel(0, 'Updated Label');
      
      expect(instance.getTabs()[0].textContent).toBe('Updated Label');
    });

    it('should emit events when adding tabs', () => {
      const eventSpy = vi.fn();
      tabsElement.addEventListener('tabs:added', eventSpy);

      instance.addTab({ label: 'New Tab', content: 'Content' });

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.tabs).toBe(instance);
      expect(eventSpy.mock.calls[0][0].detail.addedIndex).toBe(0);
      expect(eventSpy.mock.calls[0][0].detail.totalTabs).toBe(1);
    });
  });

  describe('Removable Tabs', () => {
    let tabsElement: HTMLElement;
    let instance: Tabs;

    beforeEach(() => {
      const tabOptions: TabOptions[] = [
        { 
          id: 'tab-1', 
          label: 'Removable Tab', 
          content: 'Content 1', 
          attributes: { 'data-removable': '' },
          active: true 
        },
        { id: 'tab-2', label: 'Fixed Tab', content: 'Content 2' }
      ];

      tabsElement = createTabsWithContent(tabOptions);
      container.appendChild(tabsElement);
      instance = new Tabs(tabsElement);
    });

    afterEach(() => {
      instance?.destroy();
    });

    it('should remove tabs with Delete key', () => {
      const removableTab = tabsElement.querySelectorAll('[role="tab"]')[0] as HTMLElement;
      
      const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
      const deletePreventDefaultSpy = vi.spyOn(deleteEvent, 'preventDefault');
      removableTab.dispatchEvent(deleteEvent);

      expect(deletePreventDefaultSpy).toHaveBeenCalled();
      expect(instance.getTabs()).toHaveLength(1);
      expect(instance.getActiveTabIndex()).toBe(0);
      expect(instance.getActiveTab()?.textContent).toBe('Fixed Tab');
    });

    it('should emit removal events', () => {
      const eventSpy = vi.fn();
      tabsElement.addEventListener('tabs:removed', eventSpy);

      const removableTab = tabsElement.querySelectorAll('[role="tab"]')[0] as HTMLElement;
      const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
      removableTab.dispatchEvent(deleteEvent);

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.tabs).toBe(instance);
      expect(eventSpy.mock.calls[0][0].detail.removedIndex).toBe(0);
      expect(eventSpy.mock.calls[0][0].detail.remainingTabs).toBe(1);
    });

    it('should not remove non-removable tabs', () => {
      const fixedTab = tabsElement.querySelectorAll('[role="tab"]')[1] as HTMLElement;
      
      const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
      fixedTab.dispatchEvent(deleteEvent);

      expect(instance.getTabs()).toHaveLength(2);
    });
  });

  describe('Storage and State Management', () => {
    let tabsElement: HTMLElement;
    let instance: Tabs;

    beforeEach(() => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Tab 1', content: 'Content 1', active: true },
        { id: 'tab-2', label: 'Tab 2', content: 'Content 2' }
      ];

      tabsElement = createTabsWithContent(tabOptions);
      container.appendChild(tabsElement);
    });

    afterEach(() => {
      instance?.destroy();
    });

    it('should save state to localStorage when enabled', () => {
      instance = new Tabs(tabsElement, {
        enableHistory: true,
        storageKey: 'test-tabs-state'
      });

      instance.setActiveTab(1);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-tabs-state',
        expect.stringContaining('"activeIndex":1')
      );
    });

    it('should restore state from localStorage', () => {
      const mockStateData = JSON.stringify({ 
        activeIndex: 1, 
        panelId: 'panel-tab-2' 
      });
      (localStorage.getItem as any).mockReturnValue(mockStateData);

      instance = new Tabs(tabsElement, {
        enableHistory: true,
        storageKey: 'test-tabs-state'
      });

      expect(localStorage.getItem).toHaveBeenCalledWith('test-tabs-state');
    });

    it('should handle localStorage errors gracefully', () => {
      (localStorage.getItem as any).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      instance = new Tabs(tabsElement, {
        enableHistory: true,
        storageKey: 'test-tabs-state'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to restore tabs state:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should clear state when destroyed', () => {
      instance = new Tabs(tabsElement, {
        enableHistory: true,
        storageKey: 'test-tabs-state'
      });

      instance.destroy();

      expect(localStorage.removeItem).toHaveBeenCalledWith('test-tabs-state');
    });
  });

  describe('initializeTabs', () => {
    it('should initialize tabs from data attributes', () => {
      const tabs1 = createTabs({ attributes: { 'data-module': 'public-good-tabs' } });
      const tabs2 = createTabs({
        attributes: {
          'data-module': 'public-good-tabs',
          'data-auto-activation': 'false',
          'data-orientation': 'vertical',
          'data-enable-history': 'true',
          'data-storage-key': 'custom-key'
        }
      });

      container.appendChild(tabs1);
      container.appendChild(tabs2);

      const instances = initializeTabs(container);

      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(Tabs);
      expect(instances[1]).toBeInstanceOf(Tabs);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      // Create a mock element that will throw an error during initialization
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-tabs');
      
      // Override querySelector to return null, which should cause initialization to fail
      const originalQuerySelector = invalidElement.querySelector;
      invalidElement.querySelector = vi.fn().mockImplementation(() => {
        throw new Error('Test initialization error');
      });
      
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeTabs(container);

      expect(instances).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize tabs:', expect.any(Error));

      consoleSpy.mockRestore();
      // Restore original method
      invalidElement.querySelector = originalQuerySelector;
    });

    it('should work with document scope', () => {
      const tabs = createTabs({ attributes: { 'data-module': 'public-good-tabs' } });
      document.body.appendChild(tabs);

      const instances = initializeTabs();

      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
      tabs.remove(); // Remove the element from DOM
    });
  });

  describe('validateTabsAccessibility', () => {
    beforeEach(() => {
      // Ensure clean container for validation tests
      container.innerHTML = '';
      // Also clean document body to prevent pollution from other tests
      const existingTabs = document.body.querySelectorAll('.public-good-tabs, [role="tablist"]');
      existingTabs.forEach(tab => {
        if (tab.parentNode === document.body) {
          document.body.removeChild(tab);
        }
      });
    });

    it('should validate properly structured tabs', () => {
      // Create a fresh, isolated container for this test
      const testContainer = document.createElement('div');
      testContainer.innerHTML = ''; // Ensure it's empty
      
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Tab 1', content: 'Content 1', active: true },
        { id: 'tab-2', label: 'Tab 2', content: 'Content 2' }
      ];

      const tabs = createTabsWithContent(tabOptions, { title: 'Test Tabs' });
      testContainer.appendChild(tabs);

      const result = validateTabsAccessibility(testContainer);

      expect(result.tabs).toHaveLength(1);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect missing tabs', () => {
      const emptyTabs = createTabs();
      container.appendChild(emptyTabs);

      const result = validateTabsAccessibility(container);

      expect(result.issues).toContain('Tabs container 1 should contain elements with role="tab"');
      expect(result.issues).toContain('Tabs container 1 should contain elements with role="tabpanel"');
    });

    it('should detect mismatched tabs and panels', () => {
      const tabs = createTabs();
      const tabList = tabs.querySelector('.public-good-tabs__list') as HTMLElement;
      
      // Add tab without panel
      const tab = document.createElement('button');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('id', 'lonely-tab');
      tab.textContent = 'Lonely Tab';
      tabList.appendChild(tab);
      
      container.appendChild(tabs);

      const result = validateTabsAccessibility(container);

      expect(result.issues).toContain('Tabs container 1 should have equal numbers of tabs (1) and panels (0)');
    });

    it('should detect missing IDs and ARIA attributes', () => {
      const tabs = createTabs();
      const tabList = tabs.querySelector('.public-good-tabs__list') as HTMLElement;
      
      // Add improperly configured tab
      const tab = document.createElement('button');
      tab.setAttribute('role', 'tab');
      // Missing id, aria-controls, aria-selected
      tab.textContent = 'Bad Tab';
      tabList.appendChild(tab);
      
      container.appendChild(tabs);

      const result = validateTabsAccessibility(container);

      expect(result.issues).toContain('Tab 1 in container 1 should have an id attribute');
      expect(result.issues).toContain('Tab 1 in container 1 should have aria-controls attribute');
      expect(result.issues).toContain('Tab 1 in container 1 should have aria-selected attribute');
    });

    it('should detect multiple active tabs', () => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Tab 1', content: 'Content 1', active: true },
        { id: 'tab-2', label: 'Tab 2', content: 'Content 2', active: true }
      ];

      const tabs = createTabsWithContent(tabOptions);
      container.appendChild(tabs);

      const result = validateTabsAccessibility(container);

      expect(result.issues).toContain('Container 1 should have only one active tab');
    });

    it('should detect missing accessible labeling', () => {
      const tabs = createTabs();
      container.appendChild(tabs);

      const result = validateTabsAccessibility(container);

      expect(result.issues).toContain('Tabs container 1 should have aria-label or aria-labelledby for accessibility');
    });

    it('should detect missing panel references', () => {
      const tabs = createTabs();
      const tabList = tabs.querySelector('.public-good-tabs__list') as HTMLElement;
      
      const tab = document.createElement('button');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('id', 'ref-tab');
      tab.setAttribute('aria-controls', 'nonexistent-panel');
      tab.setAttribute('aria-selected', 'true');
      tab.textContent = 'Reference Tab';
      tabList.appendChild(tab);
      
      container.appendChild(tabs);

      const result = validateTabsAccessibility(container);

      expect(result.issues).toContain('Tab 1 in container 1 references non-existent panel #nonexistent-panel');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tabs gracefully', () => {
      const emptyTabs = createTabs();
      container.appendChild(emptyTabs);

      const instance = new Tabs(emptyTabs);
      
      expect(instance.getActiveTabIndex()).toBe(0);
      expect(instance.getActiveTab()).toBeNull();
      expect(() => instance.setActiveTab(0)).not.toThrow();
      
      instance.destroy();
    });

    it('should handle invalid tab indices', () => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Tab 1', content: 'Content 1' }
      ];

      const tabs = createTabsWithContent(tabOptions);
      container.appendChild(tabs);

      const instance = new Tabs(tabs);
      
      expect(() => instance.setActiveTab(-1)).not.toThrow();
      expect(() => instance.setActiveTab(10)).not.toThrow();
      expect(() => instance.setTabDisabled(-1, true)).not.toThrow();
      expect(() => instance.setTabLabel(-1, 'Invalid')).not.toThrow();
      
      instance.destroy();
    });

    it('should handle malformed HTML gracefully', () => {
      const malformedTabs = document.createElement('div');
      malformedTabs.className = 'public-good-tabs';
      malformedTabs.innerHTML = '<div>Not proper tab structure</div>';
      container.appendChild(malformedTabs);

      const instance = new Tabs(malformedTabs);
      
      expect(() => instance.setActiveTab(0)).not.toThrow();
      
      instance.destroy();
    });

    it('should handle keyboard events on non-tab elements', () => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Tab 1', content: 'Content 1' }
      ];

      const tabs = createTabsWithContent(tabOptions);
      container.appendChild(tabs);

      const instance = new Tabs(tabs);
      const randomElement = document.createElement('div');
      
      expect(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        randomElement.dispatchEvent(event);
      }).not.toThrow();
      
      instance.destroy();
    });
  });

  describe('Configuration and Callbacks', () => {
    it('should respect auto-activation configuration', () => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Tab 1', content: 'Content 1', active: true },
        { id: 'tab-2', label: 'Tab 2', content: 'Content 2' }
      ];

      const tabs = createTabsWithContent(tabOptions);
      container.appendChild(tabs);

      const instance = new Tabs(tabs, { autoActivation: false });

      const firstTab = tabs.querySelectorAll('[role="tab"]')[0] as HTMLElement;
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      firstTab.dispatchEvent(rightArrowEvent);

      // With auto-activation disabled, should focus but not activate
      expect(document.activeElement?.textContent).toBe('Tab 2');
      expect(instance.getActiveTabIndex()).toBe(0); // Should remain on first tab

      instance.destroy();
    });

    it('should trigger onTabChange callback', () => {
      const tabOptions: TabOptions[] = [
        { id: 'tab-1', label: 'Tab 1', content: 'Content 1', active: true },
        { id: 'tab-2', label: 'Tab 2', content: 'Content 2' }
      ];

      const tabs = createTabsWithContent(tabOptions);
      container.appendChild(tabs);

      const callbackSpy = vi.fn();
      const instance = new Tabs(tabs, { 
        onTabChange: callbackSpy 
      });

      instance.setActiveTab(1);

      expect(callbackSpy).toHaveBeenCalledWith(1, expect.any(HTMLElement));

      instance.destroy();
    });
  });
});