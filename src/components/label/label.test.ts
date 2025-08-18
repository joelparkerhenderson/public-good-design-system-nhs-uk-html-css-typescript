import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { 
  Label,
  createLabel, 
  createTextLabel,
  createHtmlLabel,
  createPageHeadingLabel,
  associateLabelWithControl,
  createAndAssociateLabel,
  getAssociatedLabels,
  validateLabelAssociation,
  initializeLabels 
} from './label';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLLabelElement = dom.window.HTMLLabelElement;

describe('Label Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createLabel', () => {
    it('should create a basic label with text', () => {
      const label = createLabel({
        text: 'Email address',
        for: 'email-input'
      });

      container.appendChild(label);

      expect(label.classList.contains('public-good-label')).toBe(true);
      expect(label.tagName).toBe('LABEL');
      expect(label.textContent).toBe('Email address');
      expect(label.getAttribute('for')).toBe('email-input');
    });

    it('should create label with HTML content', () => {
      const label = createLabel({
        html: 'Required <strong>field</strong>',
        for: 'required-input'
      });

      expect(label.innerHTML).toBe('Required <strong>field</strong>');
      expect(label.getAttribute('for')).toBe('required-input');
    });

    it('should prioritize HTML over text', () => {
      const label = createLabel({
        text: 'Text content',
        html: 'HTML <em>content</em>',
        for: 'test-input'
      });

      expect(label.innerHTML).toBe('HTML <em>content</em>');
      expect(label.textContent).not.toBe('Text content');
    });

    it('should create page heading label', () => {
      const label = createLabel({
        text: 'Main Form',
        for: 'main-input',
        isPageHeading: true,
        classes: 'public-good-label--xl'
      });

      expect(label.tagName).toBe('H1');
      expect(label.classList.contains('public-good-label-wrapper')).toBe(true);
      
      const innerLabel = label.querySelector('label');
      expect(innerLabel).toBeTruthy();
      expect(innerLabel?.classList.contains('public-good-label')).toBe(true);
      expect(innerLabel?.classList.contains('public-good-label--xl')).toBe(true);
      expect(innerLabel?.textContent).toBe('Main Form');
      expect(innerLabel?.getAttribute('for')).toBe('main-input');
    });

    it('should add custom classes', () => {
      const label = createLabel({
        text: 'Custom label',
        classes: 'public-good-label--s custom-class'
      });

      expect(label.classList.contains('public-good-label--s')).toBe(true);
      expect(label.classList.contains('custom-class')).toBe(true);
      expect(label.classList.contains('public-good-label')).toBe(true);
    });

    it('should add custom attributes', () => {
      const label = createLabel({
        text: 'Attributed label',
        attributes: {
          'data-test': 'label-value',
          'aria-describedby': 'help-text'
        }
      });

      expect(label.getAttribute('data-test')).toBe('label-value');
      expect(label.getAttribute('aria-describedby')).toBe('help-text');
    });

    it('should throw error when neither text nor html is provided', () => {
      expect(() => {
        createLabel({
          for: 'test-input'
        });
      }).toThrow('Label component requires either text or html option');
    });
  });

  describe('Label Class', () => {
    let labelElement: HTMLElement;
    let instance: Label;

    beforeEach(() => {
      labelElement = createLabel({
        text: 'Test label',
        for: 'test-input'
      });
      container.appendChild(labelElement);
      instance = new Label(labelElement);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
      expect(instance.getText()).toBe('Test label');
      expect(instance.getFor()).toBe('test-input');
    });

    it('should initialize with page heading wrapper', () => {
      const headingLabel = createLabel({
        text: 'Heading Label',
        isPageHeading: true
      });
      container.appendChild(headingLabel);
      
      const headingInstance = new Label(headingLabel);
      expect(headingInstance.isPageHeading()).toBe(true);
      expect(headingInstance.getText()).toBe('Heading Label');
      
      headingInstance.destroy();
    });

    it('should update text content', () => {
      instance.updateText('Updated text');
      expect(instance.getText()).toBe('Updated text');
    });

    it('should update HTML content', () => {
      instance.updateHtml('Updated <strong>HTML</strong>');
      expect(instance.getHtml()).toBe('Updated <strong>HTML</strong>');
    });

    it('should manage for attribute', () => {
      expect(instance.getFor()).toBe('test-input');
      
      instance.setFor('new-input');
      expect(instance.getFor()).toBe('new-input');
      
      instance.removeFor();
      expect(instance.getFor()).toBeNull();
    });

    it('should manage CSS classes', () => {
      instance.addClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(true);
      
      instance.removeClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(false);
    });

    it('should manage label size', () => {
      expect(instance.getSize()).toBeNull();
      
      instance.setSize('l');
      expect(instance.getSize()).toBe('l');
      expect(instance.hasClass('public-good-label--l')).toBe(true);
      
      instance.setSize('m');
      expect(instance.getSize()).toBe('m');
      expect(instance.hasClass('public-good-label--m')).toBe(true);
      expect(instance.hasClass('public-good-label--l')).toBe(false);
      
      instance.setSize(null);
      expect(instance.getSize()).toBeNull();
      expect(instance.hasClass('public-good-label--m')).toBe(false);
    });

    it('should show and hide label', () => {
      instance.hide();
      expect(labelElement.style.display).toBe('none');
      expect(instance.isVisible()).toBe(false);
      
      instance.show();
      expect(labelElement.style.display).toBe('');
      expect(labelElement.hidden).toBe(false);
      expect(instance.isVisible()).toBe(true);
    });

    it('should get associated control', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      input.type = 'text';
      container.appendChild(input);
      
      const control = instance.getAssociatedControl();
      expect(control).toBe(input);
    });

    it('should focus associated control', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      input.type = 'text';
      input.focus = vi.fn();
      container.appendChild(input);
      
      const result = instance.focusControl();
      expect(result).toBe(true);
      expect(input.focus).toHaveBeenCalled();
    });

    it('should handle missing associated control', () => {
      const result = instance.focusControl();
      expect(result).toBe(false);
    });

    it('should get label and wrapper elements', () => {
      expect(instance.getLabelElement()).toBe(labelElement);
      expect(instance.getWrapperElement()).toBe(labelElement);
    });

    it('should throw error for invalid element', () => {
      const invalidElement = document.createElement('div');
      
      expect(() => {
        new Label(invalidElement);
      }).toThrow('Label component requires a label element');
    });
  });

  describe('Helper Functions', () => {
    describe('createTextLabel', () => {
      it('should create text label', () => {
        const label = createTextLabel('Text label', 'text-input');
        
        expect(label.textContent).toBe('Text label');
        expect(label.getAttribute('for')).toBe('text-input');
        expect(label.classList.contains('public-good-label')).toBe(true);
      });

      it('should create text label with size', () => {
        const label = createTextLabel('Sized label', 'sized-input', 'l');
        
        expect(label.textContent).toBe('Sized label');
        expect(label.classList.contains('public-good-label--l')).toBe(true);
      });
    });

    describe('createHtmlLabel', () => {
      it('should create HTML label', () => {
        const label = createHtmlLabel('HTML <strong>label</strong>', 'html-input');
        
        expect(label.innerHTML).toBe('HTML <strong>label</strong>');
        expect(label.getAttribute('for')).toBe('html-input');
      });

      it('should create HTML label with size', () => {
        const label = createHtmlLabel('HTML label', 'html-input', 's');
        
        expect(label.innerHTML).toBe('HTML label');
        expect(label.classList.contains('public-good-label--s')).toBe(true);
      });
    });

    describe('createPageHeadingLabel', () => {
      it('should create page heading label', () => {
        const label = createPageHeadingLabel('Page Heading', 'heading-input');
        
        expect(label.tagName).toBe('H1');
        expect(label.classList.contains('public-good-label-wrapper')).toBe(true);
        
        const innerLabel = label.querySelector('label');
        expect(innerLabel?.textContent).toBe('Page Heading');
        expect(innerLabel?.getAttribute('for')).toBe('heading-input');
        expect(innerLabel?.classList.contains('public-good-label--xl')).toBe(true);
      });

      it('should create page heading label with custom size', () => {
        const label = createPageHeadingLabel('Large Heading', 'large-input', 'l');
        
        const innerLabel = label.querySelector('label');
        expect(innerLabel?.classList.contains('public-good-label--l')).toBe(true);
      });
    });
  });

  describe('Label-Control Association', () => {
    let input: HTMLInputElement;
    let label: HTMLElement;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      
      label = createLabel({
        text: 'Input label',
        for: 'test-input'
      });
      
      container.appendChild(input);
      container.appendChild(label);
    });

    describe('associateLabelWithControl', () => {
      it('should associate label with control using existing ID', () => {
        input.id = 'existing-input';
        
        associateLabelWithControl(label, input);
        
        const labelInstance = new Label(label);
        expect(labelInstance.getFor()).toBe('existing-input');
        
        labelInstance.destroy();
      });

      it('should generate ID and associate when control has no ID', () => {
        associateLabelWithControl(label, input, 'custom-id');
        
        expect(input.id).toBe('custom-id');
        
        const labelInstance = new Label(label);
        expect(labelInstance.getFor()).toBe('custom-id');
        
        labelInstance.destroy();
      });

      it('should auto-generate ID when none provided', () => {
        associateLabelWithControl(label, input);
        
        expect(input.id).toMatch(/^control-\d+-\w+$/);
        
        const labelInstance = new Label(label);
        expect(labelInstance.getFor()).toBe(input.id);
        
        labelInstance.destroy();
      });
    });

    describe('createAndAssociateLabel', () => {
      it('should create label and associate with control', () => {
        input.id = 'associated-input';
        
        const newLabel = createAndAssociateLabel('Associated label', input);
        container.appendChild(newLabel);
        
        expect(newLabel.textContent).toBe('Associated label');
        expect(newLabel.getAttribute('for')).toBe('associated-input');
      });

      it('should generate ID for control without ID', () => {
        const newLabel = createAndAssociateLabel('Auto-ID label', input);
        
        expect(input.id).toMatch(/^control-\d+-\w+$/);
        expect(newLabel.getAttribute('for')).toBe(input.id);
      });

      it('should support additional options', () => {
        input.id = 'options-input';
        
        const newLabel = createAndAssociateLabel('Options label', input, {
          classes: 'public-good-label--s',
          attributes: { 'data-test': 'options' }
        });
        
        expect(newLabel.classList.contains('public-good-label--s')).toBe(true);
        expect(newLabel.getAttribute('data-test')).toBe('options');
      });
    });

    describe('getAssociatedLabels', () => {
      it('should find labels associated by for attribute', () => {
        input.id = 'labeled-input';
        const labelInstance = new Label(label);
        labelInstance.setFor('labeled-input');
        
        const labels = getAssociatedLabels(input);
        
        expect(labels).toHaveLength(1);
        expect(labels[0]).toBe(labelInstance.getLabelElement());
        
        labelInstance.destroy();
      });

      it('should find multiple associated labels', () => {
        input.id = 'multi-labeled-input';
        
        const label1 = createLabel({ text: 'Label 1', for: 'multi-labeled-input' });
        const label2 = createLabel({ text: 'Label 2', for: 'multi-labeled-input' });
        
        container.appendChild(label1);
        container.appendChild(label2);
        
        const labels = getAssociatedLabels(input);
        
        expect(labels).toHaveLength(2);
        expect(labels.map(l => l.textContent)).toContain('Label 1');
        expect(labels.map(l => l.textContent)).toContain('Label 2');
      });

      it('should find parent label when input is nested', () => {
        const parentLabel = document.createElement('label');
        parentLabel.textContent = 'Parent label';
        parentLabel.appendChild(input);
        container.appendChild(parentLabel);
        
        const labels = getAssociatedLabels(input);
        
        expect(labels).toHaveLength(1);
        expect(labels[0]).toBe(parentLabel);
      });

      it('should return empty array when no labels found', () => {
        const unassociatedInput = document.createElement('input');
        container.appendChild(unassociatedInput);
        
        const labels = getAssociatedLabels(unassociatedInput);
        
        expect(labels).toHaveLength(0);
      });
    });

    describe('validateLabelAssociation', () => {
      it('should validate properly associated control', () => {
        input.id = 'valid-input';
        const labelInstance = new Label(label);
        labelInstance.setFor('valid-input');
        
        const validation = validateLabelAssociation(input);
        
        expect(validation.hasLabel).toBe(true);
        expect(validation.labelCount).toBe(1);
        expect(validation.labels).toHaveLength(1);
        expect(validation.warnings).toHaveLength(0);
        
        labelInstance.destroy();
      });

      it('should warn about missing labels', () => {
        const unassociatedInput = document.createElement('input');
        container.appendChild(unassociatedInput);
        
        const validation = validateLabelAssociation(unassociatedInput);
        
        expect(validation.hasLabel).toBe(false);
        expect(validation.labelCount).toBe(0);
        expect(validation.warnings).toContain('Form control has no associated label');
      });

      it('should warn about multiple labels', () => {
        input.id = 'multi-input';
        
        const label1 = createLabel({ text: 'Label 1', for: 'multi-input' });
        const label2 = createLabel({ text: 'Label 2', for: 'multi-input' });
        
        container.appendChild(label1);
        container.appendChild(label2);
        
        const validation = validateLabelAssociation(input);
        
        expect(validation.hasLabel).toBe(true);
        expect(validation.labelCount).toBe(2);
        expect(validation.warnings).toContain('Form control has multiple labels (2)');
      });

      it('should warn about empty labels', () => {
        input.id = 'empty-label-input';
        
        const emptyLabel = createLabel({ text: '   ', for: 'empty-label-input' });
        container.appendChild(emptyLabel);
        
        const validation = validateLabelAssociation(input);
        
        expect(validation.warnings).toContain('Label 1 is empty');
      });
    });
  });

  describe('initializeLabels', () => {
    it('should initialize labels from data attributes', () => {
      const label1 = createLabel({
        text: 'Label 1',
        attributes: { 'data-module': 'public-good-label' }
      });
      const label2 = createLabel({
        text: 'Label 2',
        attributes: { 'data-module': 'public-good-label' }
      });
      
      container.appendChild(label1);
      container.appendChild(label2);

      const instances = initializeLabels(container);
      
      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(Label);
      expect(instances[1]).toBeInstanceOf(Label);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-label');
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeLabels(container);
      
      expect(instances).toHaveLength(0); // Should not create instance for invalid element
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize label:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should work with document scope', () => {
      const label = createLabel({
        text: 'Document label',
        attributes: { 'data-module': 'public-good-label' }
      });
      document.body.appendChild(label);

      const instances = initializeLabels();
      
      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });
  });

  describe('Accessibility', () => {
    it('should be a label element', () => {
      const label = createLabel({
        text: 'Accessible label'
      });

      expect(label.tagName).toBe('LABEL');
    });

    it('should support aria attributes', () => {
      const label = createLabel({
        text: 'ARIA label',
        attributes: { 'aria-describedby': 'help-text' }
      });

      expect(label.getAttribute('aria-describedby')).toBe('help-text');
    });

    it('should properly associate with form controls', () => {
      const input = document.createElement('input');
      input.id = 'accessibility-test';
      input.type = 'text';
      
      const label = createLabel({
        text: 'Accessible input',
        for: 'accessibility-test'
      });
      
      container.appendChild(label);
      container.appendChild(input);
      
      expect(label.getAttribute('for')).toBe('accessibility-test');
      expect(input.id).toBe('accessibility-test');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      const label = createLabel({
        text: ''
      });

      expect(label.textContent).toBe('');
      expect(label.classList.contains('public-good-label')).toBe(true);
    });

    it('should handle empty HTML', () => {
      const label = createLabel({
        html: ''
      });

      expect(label.innerHTML).toBe('');
      expect(label.classList.contains('public-good-label')).toBe(true);
    });

    it('should handle whitespace-only text', () => {
      const label = createLabel({
        text: '   '
      });

      expect(label.textContent).toBe('   ');
    });

    it('should handle special characters', () => {
      const label = createLabel({
        text: 'Special chars: <>&"\'àáâãäå'
      });

      expect(label.textContent).toBe('Special chars: <>&"\'àáâãäå');
    });

    it('should handle complex HTML', () => {
      const html = `Complex <strong>HTML</strong> with <a href="#">links</a> and <em>emphasis</em>`;
      const label = createLabel({ html });

      expect(label.innerHTML).toBe(html);
    });

    it('should handle label without for attribute', () => {
      const label = createLabel({
        text: 'No for attribute'
      });

      expect(label.getAttribute('for')).toBeNull();
    });
  });
});