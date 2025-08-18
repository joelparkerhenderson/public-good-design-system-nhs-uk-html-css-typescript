import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { CharacterCount, createCharacterCount, initializeCharacterCounts } from './character-count';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
global.HTMLInputElement = dom.window.HTMLInputElement;

describe('Character Count Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllTimers();
  });

  describe('createCharacterCount', () => {
    it('should create a basic character count component', () => {
      const element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        maxlength: 100
      });

      container.appendChild(element);

      expect(element.classList.contains('public-good-character-count')).toBe(true);
      expect(element.getAttribute('data-module')).toBe('public-good-character-count');
      expect(element.getAttribute('data-maxlength')).toBe('100');

      const textarea = element.querySelector('textarea');
      expect(textarea).toBeTruthy();
      expect(textarea?.id).toBe('test-textarea');
      expect(textarea?.name).toBe('test');

      const label = element.querySelector('label');
      expect(label?.textContent).toBe('Test Label');

      const countMessage = element.querySelector('.public-good-character-count__message');
      expect(countMessage?.textContent).toBe('You can enter up to 100 characters');
    });

    it('should create character count with word limit', () => {
      const element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        maxwords: 50
      });

      const countMessage = element.querySelector('.public-good-character-count__message');
      expect(countMessage?.textContent).toBe('You can enter up to 50 words');
    });

    it('should create character count with hint', () => {
      const element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        hint: { text: 'Enter your feedback' },
        maxlength: 200
      });

      const hint = element.querySelector('.public-good-hint');
      expect(hint?.textContent).toBe('Enter your feedback');

      const textarea = element.querySelector('textarea');
      expect(textarea?.getAttribute('aria-describedby')).toContain('test-textarea-hint');
    });

    it('should create character count with error message', () => {
      const element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        errorMessage: { text: 'Enter a valid response' },
        maxlength: 100
      });

      const formGroup = element.querySelector('.public-good-form-group');
      expect(formGroup?.classList.contains('public-good-form-group--error')).toBe(true);

      const errorMessage = element.querySelector('.public-good-error-message');
      expect(errorMessage?.textContent).toContain('Enter a valid response');

      const textarea = element.querySelector('textarea');
      expect(textarea?.classList.contains('public-good-textarea--error')).toBe(true);
      expect(textarea?.getAttribute('aria-describedby')).toContain('test-textarea-error');
    });

    it('should handle custom attributes and classes', () => {
      const element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        classes: 'custom-class',
        attributes: { 'data-custom': 'value' },
        maxlength: 100
      });

      const textarea = element.querySelector('textarea');
      expect(textarea?.classList.contains('custom-class')).toBe(true);
      expect(textarea?.getAttribute('data-custom')).toBe('value');
    });

    it('should set threshold attribute', () => {
      const element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        maxlength: 100,
        threshold: 75
      });

      expect(element.getAttribute('data-threshold')).toBe('75');
    });
  });

  describe('CharacterCount Class', () => {
    let characterCount: CharacterCount;
    let element: HTMLElement;

    beforeEach(() => {
      element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        maxlength: 100,
        threshold: 75
      });
      container.appendChild(element);
      characterCount = new CharacterCount(element);
    });

    afterEach(() => {
      characterCount.destroy();
    });

    it('should initialize correctly', () => {
      expect(characterCount).toBeDefined();
      expect(characterCount.getCount()).toBe(0);
      expect(characterCount.getRemainingCount()).toBe(100);
    });

    it('should count characters correctly', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'Hello world';
      
      expect(characterCount.getCount()).toBe(11);
      expect(characterCount.getRemainingCount()).toBe(89);
    });

    it('should detect when over limit', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      
      // Under limit
      textarea.value = 'Short text';
      expect(characterCount.isOverLimit()).toBe(false);
      
      // Over limit
      textarea.value = 'a'.repeat(150);
      expect(characterCount.isOverLimit()).toBe(true);
    });

    it('should update count message on input', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const visibleCount = element.querySelector('.public-good-character-count__status') as HTMLElement;
      
      textarea.value = 'Hello';
      textarea.dispatchEvent(new Event('keyup'));
      
      expect(visibleCount.textContent).toContain('95 characters remaining');
    });

    it('should show error state when over limit', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const visibleCount = element.querySelector('.public-good-character-count__status') as HTMLElement;
      
      textarea.value = 'a'.repeat(105);
      textarea.dispatchEvent(new Event('keyup'));
      
      expect(visibleCount.textContent).toContain('5 characters too many');
      expect(visibleCount.classList.contains('public-good-error-message')).toBe(true);
      expect(textarea.classList.contains('public-good-textarea--error')).toBe(true);
    });

    it('should handle threshold visibility', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const visibleCount = element.querySelector('.public-good-character-count__status') as HTMLElement;
      
      // Below threshold (75% of 100 = 75)
      textarea.value = 'a'.repeat(70);
      textarea.dispatchEvent(new Event('keyup'));
      expect(visibleCount.classList.contains('public-good-character-count__message--disabled')).toBe(true);
      
      // Above threshold
      textarea.value = 'a'.repeat(80);
      textarea.dispatchEvent(new Event('keyup'));
      expect(visibleCount.classList.contains('public-good-character-count__message--disabled')).toBe(false);
    });

    it('should handle focus and blur events', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      
      // Test focus
      textarea.dispatchEvent(new Event('focus'));
      // Should start polling for value changes
      
      // Test blur
      textarea.dispatchEvent(new Event('blur'));
      // Should stop polling for value changes
      
      // This test mainly ensures no errors are thrown
      expect(true).toBe(true);
    });
  });

  describe('Word counting', () => {
    let element: HTMLElement;
    let characterCount: CharacterCount;

    beforeEach(() => {
      element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        maxwords: 10
      });
      container.appendChild(element);
      characterCount = new CharacterCount(element);
    });

    afterEach(() => {
      characterCount.destroy();
    });

    it('should count words correctly', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      
      textarea.value = 'Hello world test';
      expect(characterCount.getCount()).toBe(3);
      
      textarea.value = 'Word1 word2   word3\n\nword4';
      expect(characterCount.getCount()).toBe(4);
      
      textarea.value = '';
      expect(characterCount.getCount()).toBe(0);
    });

    it('should show word count message', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const visibleCount = element.querySelector('.public-good-character-count__status') as HTMLElement;
      
      textarea.value = 'One two three';
      textarea.dispatchEvent(new Event('keyup'));
      
      expect(visibleCount.textContent).toContain('7 words remaining');
    });

    it('should handle word limit exceeded', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const visibleCount = element.querySelector('.public-good-character-count__status') as HTMLElement;
      
      textarea.value = 'one two three four five six seven eight nine ten eleven twelve';
      textarea.dispatchEvent(new Event('keyup'));
      
      expect(visibleCount.textContent).toContain('2 words too many');
      expect(characterCount.isOverLimit()).toBe(true);
    });
  });

  describe('initializeCharacterCounts', () => {
    it('should initialize multiple character count components', () => {
      const element1 = createCharacterCount({
        id: 'test1',
        name: 'test1',
        label: { text: 'Test 1' },
        maxlength: 100
      });
      
      const element2 = createCharacterCount({
        id: 'test2',
        name: 'test2',
        label: { text: 'Test 2' },
        maxwords: 50
      });

      container.appendChild(element1);
      container.appendChild(element2);

      const instances = initializeCharacterCounts(container);
      
      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(CharacterCount);
      expect(instances[1]).toBeInstanceOf(CharacterCount);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-character-count');
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const instances = initializeCharacterCounts(container);
      
      expect(instances).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    let element: HTMLElement;
    let characterCount: CharacterCount;

    beforeEach(() => {
      element = createCharacterCount({
        id: 'test-textarea',
        name: 'test',
        label: { text: 'Test Label' },
        hint: { text: 'Enter your text' },
        maxlength: 100,
        threshold: 75
      });
      container.appendChild(element);
      characterCount = new CharacterCount(element);
    });

    afterEach(() => {
      characterCount.destroy();
    });

    it('should have proper ARIA attributes', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const label = element.querySelector('label') as HTMLLabelElement;
      
      expect(label.getAttribute('for')).toBe('test-textarea');
      expect(textarea.getAttribute('aria-describedby')).toContain('test-textarea-hint');
      expect(textarea.getAttribute('aria-describedby')).toContain('test-textarea-info');
    });

    it('should have screen reader announcements', () => {
      const screenReaderStatus = element.querySelector('.public-good-character-count__sr-status') as HTMLElement;
      
      expect(screenReaderStatus.getAttribute('aria-live')).toBe('polite');
      expect(screenReaderStatus.classList.contains('public-good-u-visually-hidden')).toBe(true);
    });

    it('should toggle screen reader announcements based on threshold', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const screenReaderStatus = element.querySelector('.public-good-character-count__sr-status') as HTMLElement;
      
      // Initially, aria-hidden should be set to true
      expect(screenReaderStatus.getAttribute('aria-hidden')).toBe('true');
      
      // Below threshold (75% of 100 = 75) - should be hidden
      textarea.value = 'a'.repeat(70);
      textarea.dispatchEvent(new Event('keyup'));
      expect(screenReaderStatus.getAttribute('aria-hidden')).toBe('true');
      
      // Above threshold - should be visible (aria-hidden removed)
      textarea.value = 'a'.repeat(80);
      textarea.dispatchEvent(new Event('keyup'));
      expect(screenReaderStatus.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should provide clear count messages', () => {
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      const visibleCount = element.querySelector('.public-good-character-count__status') as HTMLElement;
      
      // Single character
      textarea.value = 'a';
      textarea.dispatchEvent(new Event('keyup'));
      expect(visibleCount.textContent).toContain('99 characters remaining');
      
      // Multiple characters
      textarea.value = 'ab';
      textarea.dispatchEvent(new Event('keyup'));
      expect(visibleCount.textContent).toContain('98 characters remaining');
      
      // Over limit
      textarea.value = 'a'.repeat(101);
      textarea.dispatchEvent(new Event('keyup'));
      expect(visibleCount.textContent).toContain('1 character too many');
    });
  });

  describe('Configuration from data attributes', () => {
    it('should read configuration from data attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-module', 'public-good-character-count');
      element.setAttribute('data-maxlength', '200');
      element.setAttribute('data-threshold', '80');
      
      const textarea = document.createElement('textarea');
      textarea.className = 'public-good-js-character-count';
      textarea.id = 'test';
      element.appendChild(textarea);
      
      container.appendChild(element);
      
      const characterCount = new CharacterCount(element);
      
      expect(characterCount.getRemainingCount()).toBe(200); // maxlength from data attribute
      
      characterCount.destroy();
    });
  });
});