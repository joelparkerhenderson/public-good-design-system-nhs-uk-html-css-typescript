import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  createTag,
  createTags,
  createTagContainer,
  getTagColor,
  setTagColor,
  setTagText,
  isTag,
  validateTags,
  initializeTags,
  type TagColor,
  type TagOptions
} from './tag';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;

describe('Tag Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createTag', () => {
    it('should create a basic tag with default styling', () => {
      const tag = createTag({ text: 'Active' });

      expect(tag.tagName).toBe('STRONG');
      expect(tag.classList.contains('public-good-tag')).toBe(true);
      expect(tag.textContent).toBe('Active');
    });

    it('should create a tag with color variant', () => {
      const tag = createTag({ 
        text: 'Completed', 
        color: 'green' 
      });

      expect(tag.classList.contains('public-good-tag--green')).toBe(true);
      expect(tag.textContent).toBe('Completed');
    });

    it('should not add color class for default color', () => {
      const tag = createTag({ 
        text: 'Default', 
        color: 'default' 
      });

      expect(tag.classList.contains('public-good-tag--default')).toBe(false);
      expect(tag.classList.contains('public-good-tag')).toBe(true);
    });

    it('should add custom classes', () => {
      const tag = createTag({
        text: 'Custom',
        classes: 'custom-class another-class'
      });

      expect(tag.classList.contains('custom-class')).toBe(true);
      expect(tag.classList.contains('another-class')).toBe(true);
    });

    it('should add custom attributes', () => {
      const tag = createTag({
        text: 'Attributed',
        attributes: {
          'data-test': 'tag-value',
          'id': 'test-tag'
        }
      });

      expect(tag.getAttribute('data-test')).toBe('tag-value');
      expect(tag.getAttribute('id')).toBe('test-tag');
    });

    it('should handle all color variants', () => {
      const colors: TagColor[] = ['grey', 'red', 'green', 'blue', 'white', 'aqua-green', 'purple', 'pink', 'orange', 'yellow'];
      
      colors.forEach(color => {
        const tag = createTag({ text: 'Test', color });
        expect(tag.classList.contains(`public-good-tag--${color}`)).toBe(true);
      });
    });

    it('should handle empty or whitespace classes', () => {
      const tag = createTag({
        text: 'Test',
        classes: '  custom-class   another-class  '
      });

      expect(tag.classList.contains('custom-class')).toBe(true);
      expect(tag.classList.contains('another-class')).toBe(true);
    });
  });

  describe('createTags', () => {
    it('should create multiple tags from array', () => {
      const options: TagOptions[] = [
        { text: 'Active', color: 'green' },
        { text: 'Pending', color: 'yellow' },
        { text: 'Inactive', color: 'grey' }
      ];

      const tags = createTags(options);

      expect(tags).toHaveLength(3);
      expect(tags[0].textContent).toBe('Active');
      expect(tags[0].classList.contains('public-good-tag--green')).toBe(true);
      expect(tags[1].textContent).toBe('Pending');
      expect(tags[1].classList.contains('public-good-tag--yellow')).toBe(true);
      expect(tags[2].textContent).toBe('Inactive');
      expect(tags[2].classList.contains('public-good-tag--grey')).toBe(true);
    });

    it('should handle empty array', () => {
      const tags = createTags([]);
      expect(tags).toHaveLength(0);
    });
  });

  describe('createTagContainer', () => {
    it('should create container with tags', () => {
      const options: TagOptions[] = [
        { text: 'Tag 1' },
        { text: 'Tag 2', color: 'red' }
      ];

      const container = createTagContainer(options);

      expect(container.classList.contains('public-good-tag-container')).toBe(true);
      expect(container.children).toHaveLength(2);
      expect(container.children[0].textContent).toBe('Tag 1');
      expect(container.children[1].textContent).toBe('Tag 2');
    });

    it('should add custom classes and attributes to container', () => {
      const container = createTagContainer(
        [{ text: 'Test' }],
        {
          classes: 'custom-container',
          attributes: { 'data-test': 'container' }
        }
      );

      expect(container.classList.contains('custom-container')).toBe(true);
      expect(container.getAttribute('data-test')).toBe('container');
    });
  });

  describe('getTagColor', () => {
    it('should return correct color variant', () => {
      const redTag = createTag({ text: 'Red', color: 'red' });
      const defaultTag = createTag({ text: 'Default' });

      expect(getTagColor(redTag)).toBe('red');
      expect(getTagColor(defaultTag)).toBe('default');
    });

    it('should return default for tag without color class', () => {
      const tag = document.createElement('strong');
      tag.className = 'public-good-tag';
      
      expect(getTagColor(tag)).toBe('default');
    });
  });

  describe('setTagColor', () => {
    it('should update tag color', () => {
      const tag = createTag({ text: 'Test', color: 'red' });
      
      setTagColor(tag, 'green');
      
      expect(tag.classList.contains('public-good-tag--red')).toBe(false);
      expect(tag.classList.contains('public-good-tag--green')).toBe(true);
    });

    it('should remove color class when setting to default', () => {
      const tag = createTag({ text: 'Test', color: 'blue' });
      
      setTagColor(tag, 'default');
      
      expect(tag.classList.contains('public-good-tag--blue')).toBe(false);
      expect(tag.classList.contains('public-good-tag')).toBe(true);
    });

    it('should handle multiple color classes', () => {
      const tag = createTag({ text: 'Test' });
      tag.classList.add('public-good-tag--red', 'public-good-tag--blue');
      
      setTagColor(tag, 'green');
      
      expect(tag.classList.contains('public-good-tag--red')).toBe(false);
      expect(tag.classList.contains('public-good-tag--blue')).toBe(false);
      expect(tag.classList.contains('public-good-tag--green')).toBe(true);
    });
  });

  describe('setTagText', () => {
    it('should update tag text content', () => {
      const tag = createTag({ text: 'Original' });
      
      setTagText(tag, 'Updated');
      
      expect(tag.textContent).toBe('Updated');
    });
  });

  describe('isTag', () => {
    it('should identify tag elements', () => {
      const tag = createTag({ text: 'Test' });
      const notTag = document.createElement('div');
      
      expect(isTag(tag)).toBe(true);
      expect(isTag(notTag)).toBe(false);
    });
  });

  describe('validateTags', () => {
    beforeEach(() => {
      container.innerHTML = '';
    });

    it('should validate properly formed tags', () => {
      const tag1 = createTag({ text: 'Active' });
      const tag2 = createTag({ text: 'Completed' });
      container.appendChild(tag1);
      container.appendChild(tag2);

      const result = validateTags(container);

      expect(result.tags).toHaveLength(2);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect empty tags', () => {
      const emptyTag = createTag({ text: '' });
      container.appendChild(emptyTag);

      const result = validateTags(container);

      expect(result.issues).toContain('Tag 1 should have text content');
    });

    it('should detect tags with whitespace-only content', () => {
      const tag = createTag({ text: '   ' });
      container.appendChild(tag);

      const result = validateTags(container);

      expect(result.issues).toContain('Tag 1 should have text content');
    });

    it('should detect non-strong elements', () => {
      const divTag = document.createElement('div');
      divTag.className = 'public-good-tag';
      divTag.textContent = 'Not Strong';
      container.appendChild(divTag);

      const result = validateTags(container);

      expect(result.issues).toContain('Tag 1 should use <strong> element for semantic meaning');
    });

    it('should detect overly long text', () => {
      const longTag = createTag({ text: 'This is a very long tag text that exceeds the recommended length' });
      container.appendChild(longTag);

      const result = validateTags(container);

      expect(result.issues.some(issue => issue.includes('text is quite long'))).toBe(true);
    });

    it('should detect verb usage', () => {
      const verbTag = createTag({ text: 'Click Here' });
      container.appendChild(verbTag);

      const result = validateTags(container);

      expect(result.issues.some(issue => issue.includes('should use adjectives, not verbs'))).toBe(true);
    });

    it('should detect multiple issues', () => {
      const emptyTag = createTag({ text: '' });
      const divTag = document.createElement('div');
      divTag.className = 'public-good-tag';
      divTag.textContent = 'Submit Now';
      
      container.appendChild(emptyTag);
      container.appendChild(divTag);

      const result = validateTags(container);

      expect(result.issues.length).toBeGreaterThan(2);
    });
  });

  describe('initializeTags', () => {
    it('should initialize tags from data attributes', () => {
      const tag1 = document.createElement('strong');
      tag1.setAttribute('data-module', 'public-good-tag');
      tag1.textContent = 'Test 1';
      
      const tag2 = document.createElement('strong');
      tag2.setAttribute('data-module', 'public-good-tag');
      tag2.setAttribute('data-color', 'red');
      tag2.textContent = 'Test 2';
      
      container.appendChild(tag1);
      container.appendChild(tag2);

      const tags = initializeTags(container);

      expect(tags).toHaveLength(2);
      expect(tags[0].classList.contains('public-good-tag')).toBe(true);
      expect(tags[1].classList.contains('public-good-tag')).toBe(true);
      expect(tags[1].classList.contains('public-good-tag--red')).toBe(true);
    });

    it('should add tag class if missing', () => {
      const tag = document.createElement('strong');
      tag.setAttribute('data-module', 'public-good-tag');
      tag.textContent = 'Test';
      container.appendChild(tag);

      expect(tag.classList.contains('public-good-tag')).toBe(false);

      initializeTags(container);

      expect(tag.classList.contains('public-good-tag')).toBe(true);
    });

    it('should handle color data attributes', () => {
      const colors: TagColor[] = ['grey', 'red', 'green', 'blue'];
      
      colors.forEach((color, index) => {
        const tag = document.createElement('strong');
        tag.setAttribute('data-module', 'public-good-tag');
        tag.setAttribute('data-color', color);
        tag.textContent = `Test ${index}`;
        container.appendChild(tag);
      });

      const tags = initializeTags(container);

      expect(tags).toHaveLength(4);
      colors.forEach((color, index) => {
        expect(tags[index].classList.contains(`public-good-tag--${color}`)).toBe(true);
      });
    });

    it('should work with document scope', () => {
      const tag = document.createElement('strong');
      tag.setAttribute('data-module', 'public-good-tag');
      tag.textContent = 'Global Test';
      document.body.appendChild(tag);

      const tags = initializeTags();

      expect(tags.length).toBeGreaterThan(0);
      
      // Clean up
      tag.remove();
    });

    it('should handle empty scope', () => {
      const emptyDiv = document.createElement('div');
      const tags = initializeTags(emptyDiv);
      
      expect(tags).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null or undefined text', () => {
      const tag1 = createTag({ text: null as any });
      const tag2 = createTag({ text: undefined as any });

      expect(tag1.textContent).toBe('');
      expect(tag2.textContent).toBe('');
    });

    it('should handle invalid color variants gracefully', () => {
      const tag = createTag({ text: 'Test', color: 'invalid-color' as TagColor });
      
      expect(tag.classList.contains('public-good-tag--invalid-color')).toBe(true);
      expect(tag.classList.contains('public-good-tag')).toBe(true);
    });

    it('should handle tags with existing classes', () => {
      const existingTag = document.createElement('strong');
      existingTag.className = 'existing-class';
      existingTag.textContent = 'Test';
      
      setTagColor(existingTag, 'red');
      
      expect(existingTag.classList.contains('existing-class')).toBe(true);
      expect(existingTag.classList.contains('public-good-tag--red')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should use strong element for semantic meaning', () => {
      const tag = createTag({ text: 'Important Status' });
      
      expect(tag.tagName).toBe('STRONG');
    });

    it('should maintain text content for screen readers', () => {
      const tag = createTag({ text: 'Active Status' });
      
      expect(tag.textContent).toBe('Active Status');
      expect(tag.getAttribute('aria-label')).toBeNull(); // Should rely on text content
    });
  });

  describe('Performance', () => {
    it('should handle large numbers of tags efficiently', () => {
      const start = performance.now();
      
      const manyOptions: TagOptions[] = Array.from({ length: 1000 }, (_, i) => ({
        text: `Tag ${i}`,
        color: ['red', 'green', 'blue', 'grey'][i % 4] as TagColor
      }));
      
      const tags = createTags(manyOptions);
      
      const end = performance.now();
      
      expect(tags).toHaveLength(1000);
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});