/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  Textarea,
  createTextarea,
  initializeTextareas,
  validateTextareaAccessibility,
  type TextareaOptions,
  type TextareaConfig
} from './textarea';

describe('Textarea', () => {
  let container: HTMLElement;
  let textarea: HTMLTextAreaElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.innerHTML = `
      <textarea id="test-textarea" class="test-textarea">Test value</textarea>
    `;
    document.body.appendChild(container);
    textarea = container.querySelector('textarea') as HTMLTextAreaElement;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    it('should throw error without container element', () => {
      expect(() => {
        new Textarea(null as any);
      }).toThrow('Textarea component requires a container element');
    });

    it('should throw error without textarea element', () => {
      const emptyContainer = document.createElement('div');
      expect(() => {
        new Textarea(emptyContainer);
      }).toThrow('Textarea component requires a textarea element');
    });

    it('should initialize with valid container and textarea', () => {
      expect(() => {
        new Textarea(container);
      }).not.toThrow();
    });

    it('should apply default configuration', () => {
      const instance = new Textarea(container);
      
      expect(container.classList.contains('public-good-form-group')).toBe(true);
      expect(textarea.classList.contains('public-good-textarea')).toBe(true);
    });

    it('should merge provided configuration', () => {
      const config: TextareaConfig = {
        autoResize: true,
        showCharacterCount: true,
        maxLength: 100
      };
      
      const instance = new Textarea(container, config);
      
      // Should have character count element
      expect(container.querySelector('.public-good-character-count__status')).toBeTruthy();
    });
  });

  describe('Value Management', () => {
    it('should get current value', () => {
      const instance = new Textarea(container);
      expect(instance.getValue()).toBe('Test value');
    });

    it('should set value', () => {
      const instance = new Textarea(container);
      instance.setValue('New value');
      expect(textarea.value).toBe('New value');
      expect(instance.getValue()).toBe('New value');
    });

    it('should trigger auto-resize when setting value', () => {
      const instance = new Textarea(container, { autoResize: true });
      const initialHeight = textarea.style.height;
      
      instance.setValue('This is a very long text that should cause the textarea to expand its height automatically when auto-resize is enabled');
      
      // Height should be set after setValue with autoResize
      expect(textarea.style.height).toBeTruthy();
    });
  });

  describe('Character Count', () => {
    it('should setup character count when enabled', () => {
      new Textarea(container, { showCharacterCount: true });
      
      const countElement = container.querySelector('.public-good-character-count__status');
      expect(countElement).toBeTruthy();
      expect(countElement?.textContent).toBe('10 characters');
    });

    it('should setup character count with max length', () => {
      new Textarea(container, { maxLength: 20 });
      
      const countElement = container.querySelector('.public-good-character-count__status');
      expect(countElement).toBeTruthy();
      expect(countElement?.textContent).toBe('10 characters remaining');
    });

    it('should show over limit message when exceeded', () => {
      textarea.value = 'This text is longer than twenty chars';
      const instance = new Textarea(container, { maxLength: 20 });
      
      const countElement = container.querySelector('.public-good-character-count__status');
      expect(countElement?.textContent).toContain('characters over limit');
      expect(countElement?.classList.contains('public-good-character-count__status--error')).toBe(true);
      expect(textarea.classList.contains('public-good-textarea--error')).toBe(true);
    });

    it('should update character count on input', () => {
      const instance = new Textarea(container, { showCharacterCount: true });
      
      textarea.value = 'Updated text';
      textarea.dispatchEvent(new Event('input'));
      
      const countElement = container.querySelector('.public-good-character-count__status');
      expect(countElement?.textContent).toBe('12 characters');
    });
  });

  describe('Auto Resize', () => {
    it('should enable auto-resize when configured', () => {
      new Textarea(container, { autoResize: true });
      
      expect(textarea.style.minHeight).toBeTruthy();
    });

    it('should resize on input', () => {
      const instance = new Textarea(container, { autoResize: true });
      const initialHeight = textarea.scrollHeight;
      
      textarea.value = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
      textarea.dispatchEvent(new Event('input'));
      
      expect(textarea.style.height).toBeTruthy();
    });

    it('should resize on paste', async () => {
      const instance = new Textarea(container, { autoResize: true });
      
      textarea.dispatchEvent(new Event('paste'));
      
      // Use setTimeout to match the implementation
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(textarea.style.height).toBeTruthy();
    });
  });

  describe('Validation', () => {
    it('should validate with custom validator', () => {
      const validator = vi.fn((value: string) => {
        return value.length < 5 ? 'Too short' : null;
      });

      const instance = new Textarea(container, { 
        validator,
        validateOnBlur: true 
      });
      
      textarea.value = 'Hi';
      textarea.dispatchEvent(new Event('blur'));
      
      expect(validator).toHaveBeenCalledWith('Hi');
      expect(container.querySelector('.public-good-error-message')).toBeTruthy();
    });

    it('should validate on input when enabled', () => {
      const validator = vi.fn(() => null);
      
      const instance = new Textarea(container, { 
        validator,
        validateOnInput: true 
      });
      
      textarea.value = 'Test input';
      textarea.dispatchEvent(new Event('input'));
      
      expect(validator).toHaveBeenCalledWith('Test input');
    });

    it('should return validation result', () => {
      const validator = () => 'Error message';
      const instance = new Textarea(container, { validator });
      
      expect(instance.validate()).toBe(false);
      expect(container.querySelector('.public-good-error-message')).toBeTruthy();
    });
  });

  describe('Error Management', () => {
    it('should set error state', () => {
      const instance = new Textarea(container);
      
      instance.setError('Custom error');
      
      expect(container.classList.contains('public-good-form-group--error')).toBe(true);
      expect(textarea.classList.contains('public-good-textarea--error')).toBe(true);
      
      const errorElement = container.querySelector('.public-good-error-message');
      expect(errorElement?.textContent).toBe('Custom error');
    });

    it('should clear error state', () => {
      const instance = new Textarea(container);
      
      instance.setError('Error message');
      instance.clearError();
      
      expect(container.classList.contains('public-good-form-group--error')).toBe(false);
      expect(textarea.classList.contains('public-good-textarea--error')).toBe(false);
      expect(container.querySelector('.public-good-error-message')).toBeNull();
    });

    it('should update aria-describedby with error', () => {
      const instance = new Textarea(container);
      
      instance.setError('Error message');
      
      const errorId = container.querySelector('.public-good-error-message')?.id;
      expect(textarea.getAttribute('aria-describedby')).toContain(errorId);
    });
  });

  describe('State Management', () => {
    it('should disable textarea', () => {
      const instance = new Textarea(container);
      
      instance.setDisabled(true);
      
      expect(textarea.disabled).toBe(true);
      expect(container.classList.contains('public-good-form-group--disabled')).toBe(true);
    });

    it('should enable textarea', () => {
      const instance = new Textarea(container);
      
      instance.setDisabled(true);
      instance.setDisabled(false);
      
      expect(textarea.disabled).toBe(false);
      expect(container.classList.contains('public-good-form-group--disabled')).toBe(false);
    });

    it('should set readonly state', () => {
      const instance = new Textarea(container);
      
      instance.setReadonly(true);
      
      expect(textarea.readOnly).toBe(true);
      expect(container.classList.contains('public-good-form-group--readonly')).toBe(true);
    });
  });

  describe('Focus Management', () => {
    it('should focus textarea', () => {
      const instance = new Textarea(container);
      const focusSpy = vi.spyOn(textarea, 'focus');
      
      instance.focus();
      
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should blur textarea', () => {
      const instance = new Textarea(container);
      const blurSpy = vi.spyOn(textarea, 'blur');
      
      instance.blur();
      
      expect(blurSpy).toHaveBeenCalled();
    });
  });

  describe('Element Access', () => {
    it('should return textarea element', () => {
      const instance = new Textarea(container);
      
      expect(instance.getTextarea()).toBe(textarea);
    });

    it('should return container element', () => {
      const instance = new Textarea(container);
      
      expect(instance.getElement()).toBe(container);
    });
  });

  describe('Events', () => {
    it('should emit custom events on input', () => {
      const eventListener = vi.fn();
      container.addEventListener('textarea:input', eventListener);
      
      new Textarea(container);
      
      textarea.value = 'New value';
      textarea.dispatchEvent(new Event('input'));
      
      expect(eventListener).toHaveBeenCalled();
      expect(eventListener.mock.calls[0][0].detail.value).toBe('New value');
    });

    it('should emit custom events on focus', () => {
      const eventListener = vi.fn();
      container.addEventListener('textarea:focus', eventListener);
      
      new Textarea(container);
      
      textarea.dispatchEvent(new Event('focus'));
      
      expect(eventListener).toHaveBeenCalled();
    });

    it('should emit custom events on blur', () => {
      const eventListener = vi.fn();
      container.addEventListener('textarea:blur', eventListener);
      
      new Textarea(container);
      
      textarea.dispatchEvent(new Event('blur'));
      
      expect(eventListener).toHaveBeenCalled();
    });

    it('should emit error events', () => {
      const eventListener = vi.fn();
      container.addEventListener('textarea:error', eventListener);
      
      const instance = new Textarea(container);
      instance.setError('Test error');
      
      expect(eventListener).toHaveBeenCalled();
      expect(eventListener.mock.calls[0][0].detail.message).toBe('Test error');
    });

    it('should emit error cleared events', () => {
      const eventListener = vi.fn();
      container.addEventListener('textarea:error-cleared', eventListener);
      
      const instance = new Textarea(container);
      instance.setError('Test error');
      instance.clearError();
      
      expect(eventListener).toHaveBeenCalled();
    });
  });

  describe('Callback Functions', () => {
    it('should call onInput callback', () => {
      const onInput = vi.fn();
      new Textarea(container, { onInput });
      
      textarea.value = 'Callback test';
      textarea.dispatchEvent(new Event('input'));
      
      expect(onInput).toHaveBeenCalledWith('Callback test', textarea);
    });

    it('should call onFocus callback', () => {
      const onFocus = vi.fn();
      new Textarea(container, { onFocus });
      
      textarea.dispatchEvent(new Event('focus'));
      
      expect(onFocus).toHaveBeenCalledWith(textarea);
    });

    it('should call onBlur callback', () => {
      const onBlur = vi.fn();
      new Textarea(container, { onBlur });
      
      textarea.value = 'Blur test';
      textarea.dispatchEvent(new Event('blur'));
      
      expect(onBlur).toHaveBeenCalledWith('Blur test', textarea);
    });
  });

  describe('Destroy', () => {
    it('should clean up event listeners', () => {
      const instance = new Textarea(container);
      const originalTextarea = textarea;
      
      instance.destroy();
      
      // Should have replaced the textarea element
      const newTextarea = container.querySelector('textarea');
      expect(newTextarea).not.toBe(originalTextarea);
    });

    it('should remove character count element', () => {
      const instance = new Textarea(container, { showCharacterCount: true });
      
      expect(container.querySelector('.public-good-character-count__status')).toBeTruthy();
      
      instance.destroy();
      
      expect(container.querySelector('.public-good-character-count__status')).toBeNull();
    });

    it('should remove error element', () => {
      const instance = new Textarea(container);
      instance.setError('Test error');
      
      expect(container.querySelector('.public-good-error-message')).toBeTruthy();
      
      instance.destroy();
      
      expect(container.querySelector('.public-good-error-message')).toBeNull();
    });
  });
});

describe('createTextarea', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should create basic textarea', () => {
    const options: TextareaOptions = {
      label: 'Test Textarea'
    };
    
    const element = createTextarea(options);
    
    expect(element.classList.contains('public-good-form-group')).toBe(true);
    
    const label = element.querySelector('.public-good-label');
    expect(label?.textContent).toBe('Test Textarea');
    
    const textarea = element.querySelector('.public-good-textarea');
    expect(textarea).toBeTruthy();
  });

  it('should create textarea with all options', () => {
    const options: TextareaOptions = {
      id: 'custom-textarea',
      name: 'custom-name',
      label: 'Custom Textarea',
      hint: 'This is a hint',
      placeholder: 'Enter text here',
      value: 'Initial value',
      rows: 5,
      maxlength: 200,
      required: true,
      disabled: true,
      readonly: true,
      classes: 'custom-class',
      attributes: { 'data-test': 'value' },
      errorMessage: 'Error occurred',
      spellcheck: false,
      autocomplete: 'off',
      resize: 'horizontal'
    };
    
    const element = createTextarea(options);
    
    // Check form group
    expect(element.classList.contains('public-good-form-group')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.classList.contains('public-good-form-group--error')).toBe(true);
    expect(element.getAttribute('data-test')).toBe('value');
    
    // Check label
    const label = element.querySelector('label');
    expect(label?.textContent).toBe('Custom Textarea');
    expect(label?.getAttribute('for')).toBe('custom-textarea');
    
    // Check hint
    const hint = element.querySelector('.public-good-hint');
    expect(hint?.textContent).toBe('This is a hint');
    expect(hint?.id).toBe('custom-textarea-hint');
    
    // Check error message
    const error = element.querySelector('.public-good-error-message');
    expect(error?.textContent).toBe('Error occurred');
    expect(error?.id).toBe('custom-textarea-error');
    
    // Check textarea
    const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.id).toBe('custom-textarea');
    expect(textarea.name).toBe('custom-name');
    expect(textarea.placeholder).toBe('Enter text here');
    expect(textarea.value).toBe('Initial value');
    expect(textarea.rows).toBe(5);
    expect(textarea.maxLength).toBe(200);
    expect(textarea.required).toBe(true);
    expect(textarea.disabled).toBe(true);
    expect(textarea.readOnly).toBe(true);
    expect(textarea.spellcheck).toBe(false);
    expect(textarea.autocomplete).toBe('off');
    expect(textarea.style.resize).toBe('horizontal');
    
    // Check aria-describedby
    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy).toContain('custom-textarea-hint');
    expect(describedBy).toContain('custom-textarea-error');
  });

  it('should generate unique IDs when not provided', () => {
    const element1 = createTextarea({ label: 'Textarea 1' });
    const element2 = createTextarea({ label: 'Textarea 2' });
    
    const textarea1 = element1.querySelector('textarea');
    const textarea2 = element2.querySelector('textarea');
    
    expect(textarea1?.id).toBeTruthy();
    expect(textarea2?.id).toBeTruthy();
    expect(textarea1?.id).not.toBe(textarea2?.id);
  });
});

describe('initializeTextareas', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should initialize textareas with data attributes', () => {
    document.body.innerHTML = `
      <div data-module="public-good-textarea" data-auto-resize="true" data-show-character-count="true">
        <textarea>Test content</textarea>
      </div>
    `;
    
    const instances = initializeTextareas();
    
    expect(instances).toHaveLength(1);
    expect(instances[0]).toBeInstanceOf(Textarea);
    
    const container = document.querySelector('[data-module="public-good-textarea"]');
    expect(container?.classList.contains('public-good-form-group')).toBe(true);
    expect(container?.querySelector('.public-good-character-count__status')).toBeTruthy();
  });

  it('should parse configuration from data attributes', () => {
    document.body.innerHTML = `
      <div data-module="public-good-textarea" 
           data-auto-resize="true"
           data-validate-on-blur="true"
           data-validate-on-input="true"
           data-show-character-count="true"
           data-max-length="100">
        <textarea>Test content</textarea>
      </div>
    `;
    
    const instances = initializeTextareas();
    
    expect(instances).toHaveLength(1);
    
    // Check that character count was set up
    const container = document.querySelector('[data-module="public-good-textarea"]');
    expect(container?.querySelector('.public-good-character-count__status')).toBeTruthy();
  });

  it('should handle initialization errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    document.body.innerHTML = `
      <div data-module="public-good-textarea">
        <!-- Missing textarea element -->
      </div>
    `;
    
    const instances = initializeTextareas();
    
    expect(instances).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should initialize within specific scope', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div data-module="public-good-textarea">
        <textarea>Scoped content</textarea>
      </div>
    `;
    
    document.body.innerHTML = `
      <div data-module="public-good-textarea">
        <textarea>Global content</textarea>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const instances = initializeTextareas(container);
    
    expect(instances).toHaveLength(1);
    
    const textarea = instances[0].getTextarea();
    expect(textarea.textContent).toBe('Scoped content');
  });
});

describe('validateTextareaAccessibility', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should validate accessible textarea', () => {
    document.body.innerHTML = `
      <div class="public-good-form-group">
        <label for="accessible-textarea" class="public-good-label">Accessible Label</label>
        <textarea id="accessible-textarea" class="public-good-textarea"></textarea>
      </div>
    `;
    
    const result = validateTextareaAccessibility();
    
    expect(result.textareas).toHaveLength(1);
    expect(result.issues).toHaveLength(0);
  });

  it('should identify missing ID', () => {
    document.body.innerHTML = `
      <div class="public-good-form-group">
        <textarea class="public-good-textarea"></textarea>
      </div>
    `;
    
    const result = validateTextareaAccessibility();
    
    expect(result.issues).toContain('Textarea 1 should have an id attribute');
  });

  it('should identify missing label', () => {
    document.body.innerHTML = `
      <div class="public-good-form-group">
        <textarea id="no-label" class="public-good-textarea"></textarea>
      </div>
    `;
    
    const result = validateTextareaAccessibility();
    
    expect(result.issues).toContain('Textarea 1 should have an associated label element');
  });

  it('should identify placeholder-only labeling', () => {
    document.body.innerHTML = `
      <div class="public-good-form-group">
        <textarea id="placeholder-only" placeholder="Enter text here" class="public-good-textarea"></textarea>
      </div>
    `;
    
    const result = validateTextareaAccessibility();
    
    expect(result.issues).toContain('Textarea 1 should not rely solely on placeholder text for labeling');
  });

  it('should identify broken aria-describedby references', () => {
    document.body.innerHTML = `
      <div class="public-good-form-group">
        <label for="broken-refs" class="public-good-label">Label</label>
        <textarea id="broken-refs" aria-describedby="nonexistent-hint" class="public-good-textarea"></textarea>
      </div>
    `;
    
    const result = validateTextareaAccessibility();
    
    expect(result.issues).toContain('Textarea 1 references non-existent element #nonexistent-hint in aria-describedby');
  });

  it('should identify inconsistent error states', () => {
    document.body.innerHTML = `
      <div class="public-good-form-group public-good-form-group--error">
        <label for="inconsistent-error" class="public-good-label">Label</label>
        <textarea id="inconsistent-error" class="public-good-textarea"></textarea>
      </div>
    `;
    
    const result = validateTextareaAccessibility();
    
    expect(result.issues).toContain('Textarea 1 error state is inconsistent between textarea and form group');
  });

  it('should identify empty labels', () => {
    document.body.innerHTML = `
      <div class="public-good-form-group">
        <label for="empty-label" class="public-good-label">   </label>
        <textarea id="empty-label" class="public-good-textarea"></textarea>
      </div>
    `;
    
    const result = validateTextareaAccessibility();
    
    expect(result.issues).toContain('Textarea 1 has an empty label');
  });

  it('should validate within specific scope', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <textarea id="scoped-textarea" class="public-good-textarea"></textarea>
    `;
    
    document.body.innerHTML = `
      <div class="public-good-form-group">
        <label for="global-textarea" class="public-good-label">Global Label</label>
        <textarea id="global-textarea" class="public-good-textarea"></textarea>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const result = validateTextareaAccessibility(container);
    
    expect(result.textareas).toHaveLength(1);
    expect(result.textareas[0].id).toBe('scoped-textarea');
  });
});