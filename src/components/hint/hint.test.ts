import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { 
  Hint,
  createHint, 
  createTextHint,
  createHtmlHint,
  createFormHint,
  associateHintWithField,
  createAndAssociateHint,
  getAssociatedHints,
  initializeHints 
} from './hint';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;

describe('Hint Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createHint', () => {
    it('should create a basic hint with text', () => {
      const hint = createHint({
        text: 'This is helpful hint text'
      });

      container.appendChild(hint);

      expect(hint.classList.contains('public-good-hint')).toBe(true);
      expect(hint.tagName).toBe('DIV');
      expect(hint.textContent).toBe('This is helpful hint text');
    });

    it('should create hint with HTML content', () => {
      const hint = createHint({
        html: 'This is <strong>important</strong> hint text'
      });

      expect(hint.innerHTML).toBe('This is <strong>important</strong> hint text');
    });

    it('should prioritize HTML over text', () => {
      const hint = createHint({
        text: 'Text content',
        html: 'HTML <em>content</em>'
      });

      expect(hint.innerHTML).toBe('HTML <em>content</em>');
      expect(hint.textContent).not.toBe('Text content');
    });

    it('should set ID when provided', () => {
      const hint = createHint({
        text: 'Hint with ID',
        id: 'my-hint'
      });

      expect(hint.id).toBe('my-hint');
    });

    it('should add custom classes', () => {
      const hint = createHint({
        text: 'Custom hint',
        classes: 'custom-class another-class'
      });

      expect(hint.classList.contains('custom-class')).toBe(true);
      expect(hint.classList.contains('another-class')).toBe(true);
      expect(hint.classList.contains('public-good-hint')).toBe(true);
    });

    it('should add custom attributes', () => {
      const hint = createHint({
        text: 'Hint with attributes',
        attributes: {
          'data-test': 'hint-value',
          'aria-live': 'polite'
        }
      });

      expect(hint.getAttribute('data-test')).toBe('hint-value');
      expect(hint.getAttribute('aria-live')).toBe('polite');
    });

    it('should throw error when neither text nor html is provided', () => {
      expect(() => {
        createHint({});
      }).toThrow('Hint component requires either text or html option');
    });
  });

  describe('Hint Class', () => {
    let hintElement: HTMLElement;
    let instance: Hint;

    beforeEach(() => {
      hintElement = createHint({
        text: 'Test hint text',
        id: 'test-hint'
      });
      container.appendChild(hintElement);
      instance = new Hint(hintElement);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
    });

    it('should update text content', () => {
      instance.updateText('Updated text');
      expect(instance.getText()).toBe('Updated text');
      expect(hintElement.textContent).toBe('Updated text');
    });

    it('should update HTML content', () => {
      instance.updateHtml('Updated <strong>HTML</strong>');
      expect(instance.getHtml()).toBe('Updated <strong>HTML</strong>');
      expect(hintElement.innerHTML).toBe('Updated <strong>HTML</strong>');
    });

    it('should get text content', () => {
      expect(instance.getText()).toBe('Test hint text');
    });

    it('should get HTML content', () => {
      expect(instance.getHtml()).toBe('Test hint text');
    });

    it('should show and hide hint', () => {
      instance.hide();
      expect(hintElement.style.display).toBe('none');
      expect(instance.isVisible()).toBe(false);
      
      instance.show();
      expect(hintElement.style.display).toBe('');
      expect(hintElement.hidden).toBe(false);
      expect(instance.isVisible()).toBe(true);
    });

    it('should get and set ID', () => {
      expect(instance.getId()).toBe('test-hint');
      
      instance.setId('new-hint-id');
      expect(instance.getId()).toBe('new-hint-id');
      expect(hintElement.id).toBe('new-hint-id');
    });

    it('should manage CSS classes', () => {
      instance.addClass('new-class');
      expect(instance.hasClass('new-class')).toBe(true);
      expect(hintElement.classList.contains('new-class')).toBe(true);
      
      instance.removeClass('new-class');
      expect(instance.hasClass('new-class')).toBe(false);
      expect(hintElement.classList.contains('new-class')).toBe(false);
    });

    it('should handle element without ID', () => {
      const hintWithoutId = createHint({ text: 'No ID hint' });
      const instanceWithoutId = new Hint(hintWithoutId);
      
      expect(instanceWithoutId.getId()).toBeNull();
      
      instanceWithoutId.destroy();
    });
  });

  describe('Helper Functions', () => {
    describe('createTextHint', () => {
      it('should create text hint', () => {
        const hint = createTextHint('Simple text hint');
        
        expect(hint.textContent).toBe('Simple text hint');
        expect(hint.classList.contains('public-good-hint')).toBe(true);
      });

      it('should create text hint with ID', () => {
        const hint = createTextHint('Text with ID', 'text-hint-id');
        
        expect(hint.textContent).toBe('Text with ID');
        expect(hint.id).toBe('text-hint-id');
      });
    });

    describe('createHtmlHint', () => {
      it('should create HTML hint', () => {
        const hint = createHtmlHint('HTML <strong>hint</strong>');
        
        expect(hint.innerHTML).toBe('HTML <strong>hint</strong>');
        expect(hint.classList.contains('public-good-hint')).toBe(true);
      });

      it('should create HTML hint with ID', () => {
        const hint = createHtmlHint('HTML hint', 'html-hint-id');
        
        expect(hint.innerHTML).toBe('HTML hint');
        expect(hint.id).toBe('html-hint-id');
      });
    });

    describe('createFormHint', () => {
      it('should create form hint with generated ID', () => {
        const hint = createFormHint('Form field hint', 'username');
        
        expect(hint.textContent).toBe('Form field hint');
        expect(hint.id).toBe('username-hint');
      });
    });
  });

  describe('Field Association', () => {
    let field: HTMLInputElement;
    let hint: HTMLElement;

    beforeEach(() => {
      field = document.createElement('input');
      field.id = 'test-field';
      field.type = 'text';
      
      hint = createHint({
        text: 'Field hint',
        id: 'test-field-hint'
      });
      
      container.appendChild(field);
      container.appendChild(hint);
    });

    describe('associateHintWithField', () => {
      it('should associate hint with field', () => {
        associateHintWithField(hint, field);
        
        expect(field.getAttribute('aria-describedby')).toBe('test-field-hint');
      });

      it('should append to existing aria-describedby', () => {
        field.setAttribute('aria-describedby', 'existing-id');
        
        associateHintWithField(hint, field);
        
        expect(field.getAttribute('aria-describedby')).toBe('existing-id test-field-hint');
      });

      it('should not duplicate hint ID', () => {
        field.setAttribute('aria-describedby', 'test-field-hint other-id');
        
        associateHintWithField(hint, field);
        
        expect(field.getAttribute('aria-describedby')).toBe('test-field-hint other-id');
      });

      it('should warn when hint has no ID', () => {
        const hintWithoutId = createHint({ text: 'No ID' });
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        
        associateHintWithField(hintWithoutId, field);
        
        expect(consoleSpy).toHaveBeenCalledWith('Hint element must have an ID to be associated with a field');
        expect(field.getAttribute('aria-describedby')).toBeNull();
        
        consoleSpy.mockRestore();
      });
    });

    describe('createAndAssociateHint', () => {
      it('should create hint and associate with field', () => {
        const newHint = createAndAssociateHint('Associated hint', field);
        
        expect(newHint.textContent).toBe('Associated hint');
        expect(newHint.id).toBe('test-field-hint');
        expect(field.getAttribute('aria-describedby')).toBe('test-field-hint');
      });

      it('should use provided field ID', () => {
        const fieldWithoutId = document.createElement('input');
        container.appendChild(fieldWithoutId);
        
        const newHint = createAndAssociateHint('Custom ID hint', fieldWithoutId, 'custom-field');
        
        expect(newHint.id).toBe('custom-field-hint');
        expect(fieldWithoutId.getAttribute('aria-describedby')).toBe('custom-field-hint');
      });

      it('should throw error when field has no ID and none provided', () => {
        const fieldWithoutId = document.createElement('input');
        
        expect(() => {
          createAndAssociateHint('Error hint', fieldWithoutId);
        }).toThrow('Field element must have an ID or fieldId must be provided');
      });
    });

    describe('getAssociatedHints', () => {
      it('should return associated hints', () => {
        associateHintWithField(hint, field);
        
        const associatedHints = getAssociatedHints(field);
        
        expect(associatedHints).toHaveLength(1);
        expect(associatedHints[0]).toBe(hint);
      });

      it('should return multiple associated hints', () => {
        const hint2 = createHint({
          text: 'Second hint',
          id: 'second-hint'
        });
        container.appendChild(hint2);
        
        field.setAttribute('aria-describedby', 'test-field-hint second-hint');
        
        const associatedHints = getAssociatedHints(field);
        
        expect(associatedHints).toHaveLength(2);
        expect(associatedHints.map(h => h.id)).toContain('test-field-hint');
        expect(associatedHints.map(h => h.id)).toContain('second-hint');
      });

      it('should return empty array when no aria-describedby', () => {
        const associatedHints = getAssociatedHints(field);
        
        expect(associatedHints).toHaveLength(0);
      });

      it('should filter out non-hint elements', () => {
        const nonHint = document.createElement('div');
        nonHint.id = 'non-hint';
        container.appendChild(nonHint);
        
        field.setAttribute('aria-describedby', 'test-field-hint non-hint');
        
        const associatedHints = getAssociatedHints(field);
        
        expect(associatedHints).toHaveLength(1);
        expect(associatedHints[0]).toBe(hint);
      });

      it('should handle missing referenced elements', () => {
        field.setAttribute('aria-describedby', 'test-field-hint missing-id');
        
        const associatedHints = getAssociatedHints(field);
        
        expect(associatedHints).toHaveLength(1);
        expect(associatedHints[0]).toBe(hint);
      });
    });
  });

  describe('initializeHints', () => {
    it('should initialize hints from data attributes', () => {
      const hint1 = createHint({
        text: 'Hint 1',
        attributes: { 'data-module': 'public-good-hint' }
      });
      const hint2 = createHint({
        text: 'Hint 2',
        attributes: { 'data-module': 'public-good-hint' }
      });
      
      container.appendChild(hint1);
      container.appendChild(hint2);

      const instances = initializeHints(container);
      
      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(Hint);
      expect(instances[1]).toBeInstanceOf(Hint);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-hint');
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeHints(container);
      
      expect(instances).toHaveLength(1); // Should still create instance
      
      consoleSpy.mockRestore();

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should work with document scope', () => {
      const hint = createHint({
        text: 'Document hint',
        attributes: { 'data-module': 'public-good-hint' }
      });
      document.body.appendChild(hint);

      const instances = initializeHints();
      
      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });
  });

  describe('Accessibility', () => {
    it('should be a div element', () => {
      const hint = createHint({
        text: 'Accessible hint'
      });

      expect(hint.tagName).toBe('DIV');
    });

    it('should support aria-live for dynamic updates', () => {
      const hint = createHint({
        text: 'Live hint',
        attributes: { 'aria-live': 'polite' }
      });

      expect(hint.getAttribute('aria-live')).toBe('polite');
    });

    it('should support role attribute', () => {
      const hint = createHint({
        text: 'Status hint',
        attributes: { 'role': 'status' }
      });

      expect(hint.getAttribute('role')).toBe('status');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      const hint = createHint({
        text: ''
      });

      expect(hint.textContent).toBe('');
      expect(hint.classList.contains('public-good-hint')).toBe(true);
    });

    it('should handle empty HTML', () => {
      const hint = createHint({
        html: ''
      });

      expect(hint.innerHTML).toBe('');
      expect(hint.classList.contains('public-good-hint')).toBe(true);
    });

    it('should handle whitespace-only text', () => {
      const hint = createHint({
        text: '   '
      });

      expect(hint.textContent).toBe('   ');
    });

    it('should handle special characters in text', () => {
      const hint = createHint({
        text: 'Special chars: <>&"\'àáâãäå'
      });

      expect(hint.textContent).toBe('Special chars: <>&"\'àáâãäå');
    });

    it('should handle complex HTML', () => {
      const html = `
        <p>Complex HTML with <strong>emphasis</strong> and <a href="#">links</a>.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      `;
      
      const hint = createHint({ html });

      expect(hint.innerHTML).toBe(html);
    });
  });
});