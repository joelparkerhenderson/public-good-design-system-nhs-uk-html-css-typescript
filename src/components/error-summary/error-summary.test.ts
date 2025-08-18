import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { 
  ErrorSummary,
  createErrorSummary, 
  createSimpleErrorSummary,
  createErrorSummaryFromForm,
  initializeErrorSummaries 
} from './error-summary';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLAnchorElement = dom.window.HTMLAnchorElement;
global.HTMLInputElement = dom.window.HTMLInputElement;
global.HTMLFormElement = dom.window.HTMLFormElement;

describe('Error Summary Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createErrorSummary', () => {
    it('should create a basic error summary', () => {
      const errorSummary = createErrorSummary({
        titleText: 'There are errors',
        errorList: [
          { text: 'Enter your name', href: '#name' },
          { text: 'Enter your email', href: '#email' }
        ]
      });

      container.appendChild(errorSummary);

      expect(errorSummary.classList.contains('public-good-error-summary')).toBe(true);
      expect(errorSummary.getAttribute('role')).toBe('alert');
      expect(errorSummary.getAttribute('tabindex')).toBe('-1');
      expect(errorSummary.getAttribute('aria-labelledby')).toBe('error-summary-title');

      const title = errorSummary.querySelector('.public-good-error-summary__title');
      expect(title?.textContent).toBe('There are errors');
      expect(title?.id).toBe('error-summary-title');

      const list = errorSummary.querySelector('.public-good-error-summary__list');
      expect(list?.children).toHaveLength(2);

      const firstLink = list?.querySelector('a');
      expect(firstLink?.textContent).toBe('Enter your name');
      expect(firstLink?.href).toContain('#name');
    });

    it('should create error summary with HTML title', () => {
      const errorSummary = createErrorSummary({
        titleHtml: '<strong>Critical errors found</strong>',
        errorList: [{ text: 'Error message', href: '#field' }]
      });

      const title = errorSummary.querySelector('.public-good-error-summary__title');
      expect(title?.innerHTML).toBe('<strong>Critical errors found</strong>');
    });

    it('should create error summary with description', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        descriptionText: 'Please fix the following issues:',
        errorList: [{ text: 'Fix this field', href: '#field' }]
      });

      const description = errorSummary.querySelector('.public-good-error-summary__body p');
      expect(description?.textContent).toBe('Please fix the following issues:');
    });

    it('should create error summary with HTML description', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        descriptionHtml: 'Please fix <strong>all</strong> issues:',
        errorList: [{ text: 'Fix this field', href: '#field' }]
      });

      const description = errorSummary.querySelector('.public-good-error-summary__body p');
      expect(description?.innerHTML).toBe('Please fix <strong>all</strong> issues:');
    });

    it('should handle errors without href', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        errorList: [
          { text: 'Static error message' },
          { html: '<em>HTML error message</em>' }
        ]
      });

      const listItems = errorSummary.querySelectorAll('.public-good-error-summary__list li');
      expect(listItems[0].textContent).toBe('Static error message');
      expect(listItems[1].innerHTML).toBe('<em>HTML error message</em>');
      
      // Should not contain links
      expect(listItems[0].querySelector('a')).toBeNull();
      expect(listItems[1].querySelector('a')).toBeNull();
    });

    it('should handle custom classes and attributes', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        errorList: [{ text: 'Error', href: '#field' }],
        classes: 'custom-class',
        attributes: { 'data-test': 'value' }
      });

      expect(errorSummary.classList.contains('custom-class')).toBe(true);
      expect(errorSummary.getAttribute('data-test')).toBe('value');
    });

    it('should handle error attributes', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        errorList: [{
          text: 'Error message',
          href: '#field',
          attributes: { 'data-field': 'name' }
        }]
      });

      const link = errorSummary.querySelector('a');
      expect(link?.getAttribute('data-field')).toBe('name');
    });
  });

  describe('ErrorSummary Class', () => {
    let errorSummary: HTMLElement;
    let instance: ErrorSummary;

    beforeEach(() => {
      errorSummary = createErrorSummary({
        titleText: 'Test Errors',
        errorList: [
          { text: 'Name error', href: '#name' },
          { text: 'Email error', href: '#email' }
        ]
      });
      container.appendChild(errorSummary);
      
      // Mock focus method
      errorSummary.focus = vi.fn();
      
      instance = new ErrorSummary(errorSummary);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
      expect(errorSummary.focus).toHaveBeenCalled();
    });

    it('should not auto-focus when disabled', () => {
      const element = createErrorSummary({
        titleText: 'Test',
        errorList: [{ text: 'Error', href: '#field' }]
      });
      element.focus = vi.fn();
      
      const instanceNoFocus = new ErrorSummary(element, { disableAutoFocus: true });
      expect(element.focus).not.toHaveBeenCalled();
      
      instanceNoFocus.destroy();
    });

    it('should add new errors', () => {
      const initialCount = instance.getErrorCount();
      
      instance.addError({
        text: 'New error',
        href: '#new-field'
      });

      expect(instance.getErrorCount()).toBe(initialCount + 1);
      
      const newLink = errorSummary.querySelector('a[href="#new-field"]');
      expect(newLink?.textContent).toBe('New error');
    });

    it('should remove errors by href', () => {
      const initialCount = instance.getErrorCount();
      
      instance.removeError('#name');
      
      expect(instance.getErrorCount()).toBe(initialCount - 1);
      expect(errorSummary.querySelector('a[href="#name"]')).toBeNull();
    });

    it('should clear all errors', () => {
      instance.clearErrors();
      
      expect(instance.getErrorCount()).toBe(0);
      
      const list = errorSummary.querySelector('.public-good-error-summary__list');
      expect(list?.innerHTML).toBe('');
    });

    it('should show and hide', () => {
      instance.hide();
      expect(errorSummary.style.display).toBe('none');
      expect(instance.isVisible()).toBe(false);
      
      instance.show();
      expect(errorSummary.style.display).toBe('');
      expect(instance.isVisible()).toBe(true);
    });

    it('should handle focus management', () => {
      instance.focus();
      expect(errorSummary.focus).toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    let errorSummary: HTMLElement;
    let instance: ErrorSummary;
    let targetInput: HTMLInputElement;
    let targetLabel: HTMLLabelElement;

    beforeEach(() => {
      // Create target form elements
      targetInput = document.createElement('input');
      targetInput.id = 'test-input';
      targetInput.type = 'text';
      
      targetLabel = document.createElement('label');
      targetLabel.setAttribute('for', 'test-input');
      targetLabel.textContent = 'Test Input';
      
      container.appendChild(targetLabel);
      container.appendChild(targetInput);

      // Mock methods
      targetInput.focus = vi.fn();
      targetLabel.scrollIntoView = vi.fn();

      errorSummary = createErrorSummary({
        titleText: 'Test Errors',
        errorList: [{ text: 'Input error', href: '#test-input' }]
      });
      container.appendChild(errorSummary);
      
      errorSummary.focus = vi.fn();
      instance = new ErrorSummary(errorSummary, { disableAutoFocus: true });
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should focus target element when error link is clicked', () => {
      const link = errorSummary.querySelector('a[href="#test-input"]') as HTMLAnchorElement;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      
      // Mock preventDefault
      clickEvent.preventDefault = vi.fn();
      
      link.dispatchEvent(clickEvent);
      
      expect(targetLabel.scrollIntoView).toHaveBeenCalled();
      expect(targetInput.focus).toHaveBeenCalledWith({ preventScroll: true });
      expect(clickEvent.preventDefault).toHaveBeenCalled();
    });

    it('should handle fieldset and legend', () => {
      // Create fieldset structure
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = 'Group Label';
      
      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.id = 'radio-test';
      
      fieldset.appendChild(legend);
      fieldset.appendChild(radioInput);
      container.appendChild(fieldset);

      // Mock methods
      radioInput.focus = vi.fn();
      legend.scrollIntoView = vi.fn();
      
      // Add error for radio input
      instance.addError({
        text: 'Radio error',
        href: '#radio-test'
      });

      const link = errorSummary.querySelector('a[href="#radio-test"]') as HTMLAnchorElement;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      clickEvent.preventDefault = vi.fn();
      
      link.dispatchEvent(clickEvent);
      
      // For radio inputs, should use legend
      expect(legend.scrollIntoView).toHaveBeenCalled();
      expect(radioInput.focus).toHaveBeenCalledWith({ preventScroll: true });
    });
  });

  describe('createSimpleErrorSummary', () => {
    it('should create a simple error summary', () => {
      const errors = [
        { text: 'Name is required', href: '#name' },
        { text: 'Email is invalid', href: '#email' }
      ];
      
      const errorSummary = createSimpleErrorSummary(errors, 'Fix these errors');
      
      const title = errorSummary.querySelector('.public-good-error-summary__title');
      expect(title?.textContent).toBe('Fix these errors');
      
      const links = errorSummary.querySelectorAll('a');
      expect(links).toHaveLength(2);
      expect(links[0].textContent).toBe('Name is required');
      expect(links[1].textContent).toBe('Email is invalid');
    });
  });

  describe('createErrorSummaryFromForm', () => {
    it('should create error summary from form validation', () => {
      const form = document.createElement('form');
      
      // Create form field with validation error
      const input = document.createElement('input');
      input.id = 'name';
      input.type = 'text';
      input.required = true;
      input.setCustomValidity('This field is required');
      
      const label = document.createElement('label');
      label.setAttribute('for', 'name');
      label.textContent = 'Full Name';
      
      form.appendChild(label);
      form.appendChild(input);
      container.appendChild(form);

      // Mock the :invalid selector
      const originalQuerySelectorAll = form.querySelectorAll;
      form.querySelectorAll = vi.fn((selector) => {
        if (selector === ':invalid') {
          return [input] as any;
        }
        return originalQuerySelectorAll.call(form, selector);
      });

      const errorSummary = createErrorSummaryFromForm(form, 'Form has errors');
      
      const title = errorSummary.querySelector('.public-good-error-summary__title');
      expect(title?.textContent).toBe('Form has errors');
      
      const link = errorSummary.querySelector('a');
      expect(link?.textContent).toBe('Full Name has an error');
      expect(link?.href).toContain('#name');
    });
  });

  describe('initializeErrorSummaries', () => {
    it('should initialize error summaries from data attributes', () => {
      const element = createErrorSummary({
        titleText: 'Test',
        errorList: [{ text: 'Error', href: '#field' }]
      });
      element.focus = vi.fn();
      container.appendChild(element);

      const instances = initializeErrorSummaries(container);
      
      expect(instances).toHaveLength(1);
      expect(instances[0]).toBeInstanceOf(ErrorSummary);
      expect(element.focus).toHaveBeenCalled();

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle focus on page load option', () => {
      const element = createErrorSummary({
        titleText: 'Test',
        errorList: [{ text: 'Error', href: '#field' }]
      });
      element.focus = vi.fn();
      container.appendChild(element);

      const instances = initializeErrorSummaries(container, { focusOnPageLoad: false });
      
      expect(instances).toHaveLength(1);
      expect(element.focus).not.toHaveBeenCalled();

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const element = document.createElement('div');
      element.setAttribute('data-module', 'public-good-error-summary');
      container.appendChild(element);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Force an error by creating an invalid element structure
      const instances = initializeErrorSummaries(container);
      
      expect(instances).toHaveLength(1); // Should still create instance
      expect(consoleSpy).not.toHaveBeenCalled(); // No error in this case
      
      consoleSpy.mockRestore();

      // Clean up
      instances.forEach(instance => instance.destroy());
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        errorList: [{ text: 'Error message', href: '#field' }]
      });

      expect(errorSummary.getAttribute('role')).toBe('alert');
      expect(errorSummary.getAttribute('aria-labelledby')).toBe('error-summary-title');
      expect(errorSummary.getAttribute('tabindex')).toBe('-1');

      const list = errorSummary.querySelector('.public-good-error-summary__list');
      expect(list?.getAttribute('role')).toBe('list');
    });

    it('should have focusable error summary', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        errorList: [{ text: 'Error message', href: '#field' }]
      });

      expect(errorSummary.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper heading structure', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Form errors',
        errorList: [{ text: 'Error message', href: '#field' }]
      });

      const heading = errorSummary.querySelector('h2');
      expect(heading?.id).toBe('error-summary-title');
      expect(heading?.classList.contains('public-good-error-summary__title')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty error list', () => {
      const errorSummary = createErrorSummary({
        titleText: 'No errors',
        errorList: []
      });

      const list = errorSummary.querySelector('.public-good-error-summary__list');
      expect(list?.children).toHaveLength(0);
    });

    it('should handle missing target elements in focus management', () => {
      const errorSummary = createErrorSummary({
        titleText: 'Errors',
        errorList: [{ text: 'Error for missing field', href: '#missing-field' }]
      });
      
      const instance = new ErrorSummary(errorSummary, { disableAutoFocus: true });
      
      const link = errorSummary.querySelector('a') as HTMLAnchorElement;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      clickEvent.preventDefault = vi.fn();
      
      // Should not throw error when target doesn't exist
      expect(() => {
        link.dispatchEvent(clickEvent);
      }).not.toThrow();
      
      // Should not prevent default when target is not found
      expect(clickEvent.preventDefault).not.toHaveBeenCalled();
      
      instance.destroy();
    });
  });
});