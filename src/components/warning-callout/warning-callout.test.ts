/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  WarningCallout,
  createWarningCallout,
  initializeWarningCallouts,
  validateWarningCalloutAccessibility,
  type WarningCalloutOptions,
  type WarningCalloutConfig
} from './warning-callout';

describe('WarningCallout', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.innerHTML = `
      <h3 class="public-good-warning-callout__label">
        <span role="text">
          <span class="public-good-warning-callout-sr-only">Important: </span>
          Test Warning
        </span>
      </h3>
      <p>This is a test warning message.</p>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    it('should throw error without container element', () => {
      expect(() => {
        new WarningCallout(null as any);
      }).toThrow('WarningCallout component requires a container element');
    });

    it('should initialize with valid container', () => {
      expect(() => {
        new WarningCallout(container);
      }).not.toThrow();
    });

    it('should apply default classes', () => {
      new WarningCallout(container);
      
      expect(container.classList.contains('public-good-warning-callout')).toBe(true);
    });

    it('should emit initialization event', () => {
      const eventListener = vi.fn();
      container.addEventListener('warning-callout:initialized', eventListener);
      
      new WarningCallout(container);
      
      expect(eventListener).toHaveBeenCalled();
    });

    it('should merge provided configuration', () => {
      const config: WarningCalloutConfig = {
        trackInteractions: true,
        announceToScreenReader: true
      };
      
      const instance = new WarningCallout(container, config);
      
      expect(instance).toBeDefined();
    });
  });

  describe('Element Finding', () => {
    it('should find heading element', () => {
      const instance = new WarningCallout(container);
      const heading = instance.getHeading();
      
      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('public-good-warning-callout__label')).toBe(true);
    });

    it('should find content element', () => {
      const instance = new WarningCallout(container);
      const content = instance.getContent();
      
      expect(content).toBeTruthy();
      expect(content?.textContent).toBe('This is a test warning message.');
    });

    it('should handle missing elements gracefully', () => {
      const emptyContainer = document.createElement('div');
      const instance = new WarningCallout(emptyContainer);
      
      expect(instance.getHeading()).toBeNull();
      expect(instance.getContent()).toBeNull();
    });
  });

  describe('Content Management', () => {
    it('should update heading content', () => {
      const instance = new WarningCallout(container);
      
      instance.setHeading('Updated Warning', 'Alert: ');
      
      const heading = instance.getHeading();
      const hiddenSpan = heading?.querySelector('.public-good-warning-callout-sr-only');
      
      expect(hiddenSpan?.textContent).toBe('Alert: ');
      expect(heading?.textContent).toContain('Updated Warning');
    });

    it('should update content as text', () => {
      const instance = new WarningCallout(container);
      
      instance.setContent('Updated warning message');
      
      const content = instance.getContent();
      expect(content?.textContent).toBe('Updated warning message');
    });

    it('should update content as HTML', () => {
      const instance = new WarningCallout(container);
      
      instance.setContent('<strong>Bold</strong> warning message', true);
      
      const content = instance.getContent();
      expect(content?.innerHTML).toBe('<strong>Bold</strong> warning message');
      expect(content?.querySelector('strong')).toBeTruthy();
    });

    it('should emit content change events', () => {
      const instance = new WarningCallout(container);
      const eventListener = vi.fn();
      
      container.addEventListener('warning-callout:content-changed', eventListener);
      
      instance.setContent('New content');
      
      expect(eventListener).toHaveBeenCalled();
      expect(eventListener.mock.calls[0][0].detail.content).toBe('New content');
    });

    it('should emit heading change events', () => {
      const instance = new WarningCallout(container);
      const eventListener = vi.fn();
      
      container.addEventListener('warning-callout:heading-changed', eventListener);
      
      instance.setHeading('New heading');
      
      expect(eventListener).toHaveBeenCalled();
      expect(eventListener.mock.calls[0][0].detail.heading).toBe('New heading');
    });
  });

  describe('Visibility Management', () => {
    it('should show warning callout', () => {
      const instance = new WarningCallout(container);
      const eventListener = vi.fn();
      
      container.addEventListener('warning-callout:shown', eventListener);
      container.style.display = 'none';
      
      instance.show();
      
      expect(container.style.display).toBe('');
      expect(container.getAttribute('aria-hidden')).toBe('false');
      expect(eventListener).toHaveBeenCalled();
    });

    it('should hide warning callout', () => {
      const instance = new WarningCallout(container);
      const eventListener = vi.fn();
      
      container.addEventListener('warning-callout:hidden', eventListener);
      
      instance.hide();
      
      expect(container.style.display).toBe('none');
      expect(container.getAttribute('aria-hidden')).toBe('true');
      expect(eventListener).toHaveBeenCalled();
    });

    it('should check visibility correctly', () => {
      const instance = new WarningCallout(container);
      
      expect(instance.isVisible()).toBe(true);
      
      instance.hide();
      expect(instance.isVisible()).toBe(false);
      
      instance.show();
      expect(instance.isVisible()).toBe(true);
    });
  });

  describe('Interaction Tracking', () => {
    it('should track focus interactions when enabled', () => {
      const onInteraction = vi.fn();
      const instance = new WarningCallout(container, {
        trackInteractions: true,
        onInteraction
      });
      
      const focusableElement = document.createElement('button');
      focusableElement.textContent = 'Test Button';
      container.appendChild(focusableElement);
      
      focusableElement.dispatchEvent(new Event('focusin', { bubbles: true }));
      
      expect(onInteraction).toHaveBeenCalledWith('focus', focusableElement);
    });

    it('should track click interactions when enabled', () => {
      const onInteraction = vi.fn();
      const instance = new WarningCallout(container, {
        trackInteractions: true,
        onInteraction
      });
      
      container.dispatchEvent(new Event('click', { bubbles: true }));
      
      expect(onInteraction).toHaveBeenCalledWith('click', container);
    });

    it('should emit interaction events', () => {
      const eventListener = vi.fn();
      const instance = new WarningCallout(container, {
        trackInteractions: true
      });
      
      container.addEventListener('warning-callout:interaction', eventListener);
      container.dispatchEvent(new Event('click', { bubbles: true }));
      
      expect(eventListener).toHaveBeenCalled();
      expect(eventListener.mock.calls[0][0].detail.type).toBe('click');
    });

    it('should not track interactions when disabled', () => {
      const onInteraction = vi.fn();
      const instance = new WarningCallout(container, {
        trackInteractions: false,
        onInteraction
      });
      
      container.dispatchEvent(new Event('click', { bubbles: true }));
      
      expect(onInteraction).not.toHaveBeenCalled();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should announce to screen reader when enabled', () => {
      const instance = new WarningCallout(container, {
        announceToScreenReader: true
      });
      
      // Check that a live region was created and removed
      setTimeout(() => {
        const liveRegions = document.querySelectorAll('[aria-live="polite"]');
        expect(liveRegions.length).toBe(0); // Should be removed after announcement
      }, 1100);
    });

    it('should announce on show when configured', () => {
      const instance = new WarningCallout(container, {
        announceToScreenReader: true
      });
      
      container.style.display = 'none';
      instance.show();
      
      // Live region should be created temporarily
      setTimeout(() => {
        const liveRegions = document.querySelectorAll('.public-good-warning-callout-sr-only[aria-live]');
        expect(liveRegions.length).toBe(0); // Cleaned up after timeout
      }, 1100);
    });
  });

  describe('Validation', () => {
    it('should validate warning callout structure', () => {
      const instance = new WarningCallout(container);
      
      const issues = instance.validate();
      
      expect(issues).toHaveLength(0);
    });

    it('should identify missing heading', () => {
      container.innerHTML = '<p>Content without heading</p>';
      const instance = new WarningCallout(container);
      
      const issues = instance.validate();
      
      expect(issues).toContain('Warning callout should have a descriptive heading');
    });

    it('should identify missing content', () => {
      container.innerHTML = `
        <h3 class="public-good-warning-callout__label">Heading Only</h3>
      `;
      const instance = new WarningCallout(container);
      
      const issues = instance.validate();
      
      expect(issues).toContain('Warning callout should have content text');
    });

    it('should identify missing screen reader prefix', () => {
      container.innerHTML = `
        <h3 class="public-good-warning-callout__label">Plain Heading</h3>
        <p>Some content</p>
      `;
      const instance = new WarningCallout(container);
      
      const issues = instance.validate();
      
      expect(issues).toContain('Warning callout should include visually hidden prefix for screen readers');
    });

    it('should use custom validation when provided', () => {
      const customValidation = vi.fn(() => ['Custom issue']);
      const instance = new WarningCallout(container, { customValidation });
      
      const issues = instance.validate();
      
      expect(customValidation).toHaveBeenCalledWith(container);
      expect(issues).toContain('Custom issue');
    });
  });

  describe('Element Access', () => {
    it('should return container element', () => {
      const instance = new WarningCallout(container);
      
      expect(instance.getElement()).toBe(container);
    });

    it('should return heading element', () => {
      const instance = new WarningCallout(container);
      const heading = container.querySelector('.public-good-warning-callout__label');
      
      expect(instance.getHeading()).toBe(heading);
    });

    it('should return content element', () => {
      const instance = new WarningCallout(container);
      const content = container.querySelector('p');
      
      expect(instance.getContent()).toBe(content);
    });
  });

  describe('Destroy', () => {
    it('should clean up event listeners', () => {
      const onInteraction = vi.fn();
      const instance = new WarningCallout(container, {
        trackInteractions: true,
        onInteraction
      });
      
      instance.destroy();
      
      // After destroy, interactions should not be tracked
      const newContainer = document.querySelector('.public-good-warning-callout');
      newContainer?.dispatchEvent(new Event('click', { bubbles: true }));
      
      expect(onInteraction).not.toHaveBeenCalled();
    });

    it('should clear internal references', () => {
      const instance = new WarningCallout(container);
      
      instance.destroy();
      
      // Internal references should be cleared
      expect(instance.getHeading()).toBeNull();
      expect(instance.getContent()).toBeNull();
    });
  });
});

describe('createWarningCallout', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should create basic warning callout', () => {
    const options: WarningCalloutOptions = {
      heading: 'Test Warning',
      content: 'This is a test warning message.'
    };
    
    const element = createWarningCallout(options);
    
    expect(element.classList.contains('public-good-warning-callout')).toBe(true);
    
    const heading = element.querySelector('.public-good-warning-callout__label');
    expect(heading?.textContent).toContain('Test Warning');
    
    const hiddenPrefix = heading?.querySelector('.public-good-warning-callout-sr-only');
    expect(hiddenPrefix?.textContent).toBe('Important: ');
    
    const content = element.querySelector('.public-good-warning-callout__content');
    expect(content?.textContent?.trim()).toBe('This is a test warning message.');
  });

  it('should create warning callout with all options', () => {
    const options: WarningCalloutOptions = {
      id: 'custom-warning',
      heading: 'Custom Warning',
      headingLevel: 2,
      content: 'First paragraph.\n\nSecond paragraph.',
      classes: 'custom-class',
      attributes: { 'data-test': 'value' },
      hiddenPrefix: 'Alert: '
    };
    
    const element = createWarningCallout(options);
    
    expect(element.id).toBe('custom-warning');
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toBe('value');
    
    const heading = element.querySelector('h2.public-good-warning-callout__label');
    expect(heading).toBeTruthy();
    
    const hiddenPrefix = heading?.querySelector('.public-good-warning-callout-sr-only');
    expect(hiddenPrefix?.textContent).toBe('Alert: ');
    
    const paragraphs = element.querySelectorAll('.public-good-warning-callout__content p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe('First paragraph.');
    expect(paragraphs[1].textContent).toBe('Second paragraph.');
  });

  it('should create warning callout with HTML content', () => {
    const options: WarningCalloutOptions = {
      heading: 'HTML Warning',
      html: '<p>Content with <strong>bold text</strong> and <a href="#">a link</a>.</p>'
    };
    
    const element = createWarningCallout(options);
    
    const content = element.querySelector('.public-good-warning-callout__content');
    expect(content?.querySelector('strong')).toBeTruthy();
    expect(content?.querySelector('a')).toBeTruthy();
  });

  it('should handle different heading levels', () => {
    [1, 2, 3, 4, 5, 6].forEach(level => {
      const options: WarningCalloutOptions = {
        heading: `Level ${level} Heading`,
        headingLevel: level as 1 | 2 | 3 | 4 | 5 | 6
      };
      
      const element = createWarningCallout(options);
      const heading = element.querySelector(`h${level}.public-good-warning-callout__label`);
      
      expect(heading).toBeTruthy();
    });
  });

  it('should create warning callout without content', () => {
    const options: WarningCalloutOptions = {
      heading: 'Heading Only'
    };
    
    const element = createWarningCallout(options);
    
    const heading = element.querySelector('.public-good-warning-callout__label');
    expect(heading).toBeTruthy();
    
    const content = element.querySelector('.public-good-warning-callout__content');
    expect(content).toBeNull();
  });

  it('should handle empty content gracefully', () => {
    const options: WarningCalloutOptions = {
      heading: 'Test Heading',
      content: ''
    };
    
    const element = createWarningCallout(options);
    
    const content = element.querySelector('.public-good-warning-callout__content');
    expect(content?.children.length).toBe(0);
  });
});

describe('initializeWarningCallouts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should initialize warning callouts with data attributes', () => {
    document.body.innerHTML = `
      <div data-module="public-good-warning-callout" data-track-interactions="true">
        <h3 class="public-good-warning-callout__label">Warning</h3>
        <p>Content</p>
      </div>
    `;
    
    const instances = initializeWarningCallouts();
    
    expect(instances).toHaveLength(1);
    expect(instances[0]).toBeInstanceOf(WarningCallout);
    
    const container = document.querySelector('[data-module="public-good-warning-callout"]');
    expect(container?.classList.contains('public-good-warning-callout')).toBe(true);
  });

  it('should parse configuration from data attributes', () => {
    document.body.innerHTML = `
      <div data-module="public-good-warning-callout" 
           data-track-interactions="true"
           data-announce-to-screen-reader="true">
        <h3 class="public-good-warning-callout__label">Warning</h3>
        <p>Content</p>
      </div>
    `;
    
    const instances = initializeWarningCallouts();
    
    expect(instances).toHaveLength(1);
  });

  it('should handle initialization errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    document.body.innerHTML = `
      <div data-module="public-good-warning-callout">
        <!-- Invalid structure -->
      </div>
    `;
    
    const instances = initializeWarningCallouts();
    
    expect(instances).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should initialize within specific scope', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div data-module="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">Scoped Warning</h3>
        <p>Scoped content</p>
      </div>
    `;
    
    document.body.innerHTML = `
      <div data-module="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">Global Warning</h3>
        <p>Global content</p>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const instances = initializeWarningCallouts(container);
    
    expect(instances).toHaveLength(1);
    
    const heading = instances[0].getHeading();
    expect(heading?.textContent).toContain('Scoped Warning');
  });
});

describe('validateWarningCalloutAccessibility', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Mock window.getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        backgroundColor: '#fffbf0'
      })
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should validate accessible warning callout', () => {
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">
          <span role="text">
            <span class="public-good-warning-callout-sr-only">Important: </span>
            Accessible Warning
          </span>
        </h3>
        <p>This warning is accessible.</p>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.warningCallouts).toHaveLength(1);
    expect(result.issues).toHaveLength(0);
  });

  it('should identify missing heading', () => {
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <p>Warning without heading</p>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.issues).toContain("Warning callout 1 should have a heading with class 'public-good-warning-callout__label'");
  });

  it('should identify empty heading', () => {
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">   </h3>
        <p>Content</p>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.issues).toContain('Warning callout 1 heading should not be empty');
  });

  it('should identify missing hidden prefix', () => {
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">Plain Heading</h3>
        <p>Content</p>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.issues).toContain('Warning callout 1 should include visually hidden prefix for screen readers');
  });

  it('should identify missing role="text"', () => {
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">
          <span class="public-good-warning-callout-sr-only">Important: </span>
          Warning without role
        </h3>
        <p>Content</p>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.issues).toContain('Warning callout 1 heading should use role="text" for better screen reader support');
  });

  it('should identify missing content', () => {
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">Heading Only</h3>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.issues).toContain('Warning callout 1 should have content');
  });

  it('should identify empty content', () => {
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">Heading</h3>
        <p>   </p>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.issues).toContain('Warning callout 1 content should not be empty');
  });

  it('should validate within specific scope', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">Scoped Warning</h3>
      </div>
    `;
    
    document.body.innerHTML = `
      <div class="public-good-warning-callout">
        <h3 class="public-good-warning-callout__label">
          <span role="text">
            <span class="public-good-warning-callout-sr-only">Important: </span>
            Global Warning
          </span>
        </h3>
        <p>Global content</p>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const result = validateWarningCalloutAccessibility(container);
    
    expect(result.warningCallouts).toHaveLength(1);
    expect(result.warningCallouts[0].textContent).toContain('Scoped Warning');
  });

  it('should identify heading level issues', () => {
    document.body.innerHTML = `
      <h1>Main heading</h1>
      <div class="public-good-warning-callout">
        <h4 class="public-good-warning-callout__label">Skip level heading</h4>
        <p>Content</p>
      </div>
    `;
    
    const result = validateWarningCalloutAccessibility();
    
    expect(result.issues).toContain('Warning callout 1 heading level h4 skips levels (previous was h1)');
  });
});