/**
 * Tag Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides status indicators with color variants for showing item states.
 */

/**
 * Available color variants for tags
 */
export type TagColor = 
  | 'default' 
  | 'grey' 
  | 'red' 
  | 'green' 
  | 'blue'
  | 'white' 
  | 'aqua-green' 
  | 'purple' 
  | 'pink' 
  | 'orange' 
  | 'yellow';

/**
 * Configuration options for tag creation
 */
export interface TagOptions {
  text: string;
  color?: TagColor;
  classes?: string;
  attributes?: Record<string, string>;
}

/**
 * Create a tag element
 */
export function createTag(options: TagOptions): HTMLElement {
  const tag = document.createElement('strong');
  tag.className = 'public-good-tag';
  tag.textContent = options.text;

  // Add color variant class
  if (options.color && options.color !== 'default') {
    tag.classList.add(`public-good-tag--${options.color}`);
  }

  // Add custom classes
  if (options.classes) {
    options.classes.split(' ').forEach(cls => {
      if (cls.trim()) {
        tag.classList.add(cls.trim());
      }
    });
  }

  // Add custom attributes
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      tag.setAttribute(key, value);
    });
  }

  return tag;
}

/**
 * Create multiple tags from an array of options
 */
export function createTags(tagsOptions: TagOptions[]): HTMLElement[] {
  return tagsOptions.map(options => createTag(options));
}

/**
 * Create a tag container with multiple tags
 */
export function createTagContainer(
  tagsOptions: TagOptions[], 
  containerOptions?: {
    classes?: string;
    attributes?: Record<string, string>;
  }
): HTMLElement {
  const container = document.createElement('div');
  container.className = `public-good-tag-container ${containerOptions?.classes || ''}`;

  // Add custom attributes to container
  if (containerOptions?.attributes) {
    Object.entries(containerOptions.attributes).forEach(([key, value]) => {
      container.setAttribute(key, value);
    });
  }

  // Create and append tags
  const tags = createTags(tagsOptions);
  tags.forEach(tag => container.appendChild(tag));

  return container;
}

/**
 * Get the color variant of a tag element
 */
export function getTagColor(tag: HTMLElement): TagColor {
  const classList = Array.from(tag.classList);
  
  for (const className of classList) {
    if (className.startsWith('public-good-tag--')) {
      return className.replace('public-good-tag--', '') as TagColor;
    }
  }
  
  return 'default';
}

/**
 * Update the color variant of a tag element
 */
export function setTagColor(tag: HTMLElement, color: TagColor): void {
  // Remove existing color classes
  const classList = Array.from(tag.classList);
  classList.forEach(className => {
    if (className.startsWith('public-good-tag--')) {
      tag.classList.remove(className);
    }
  });

  // Add new color class (if not default)
  if (color !== 'default') {
    tag.classList.add(`public-good-tag--${color}`);
  }
}

/**
 * Update the text content of a tag element
 */
export function setTagText(tag: HTMLElement, text: string): void {
  tag.textContent = text;
}

/**
 * Check if an element is a tag component
 */
export function isTag(element: HTMLElement): boolean {
  return element.classList.contains('public-good-tag');
}

/**
 * Validate tag accessibility and best practices
 */
export function validateTags(scope: Document | HTMLElement = document): {
  tags: HTMLElement[];
  issues: string[];
} {
  const tags = scope.querySelectorAll('.public-good-tag') as NodeListOf<HTMLElement>;
  const issues: string[] = [];
  
  tags.forEach((tag, index) => {
    const tagNumber = index + 1;
    
    // Check if tag has text content
    if (!tag.textContent || tag.textContent.trim().length === 0) {
      issues.push(`Tag ${tagNumber} should have text content`);
    }
    
    // Check for appropriate semantic element
    if (tag.tagName.toLowerCase() !== 'strong') {
      issues.push(`Tag ${tagNumber} should use <strong> element for semantic meaning`);
    }
    
    // Check for overly long text
    if (tag.textContent && tag.textContent.length > 20) {
      issues.push(`Tag ${tagNumber} text is quite long (${tag.textContent.length} characters). Consider shorter labels.`);
    }
    
    // Check for verb usage (should be adjectives)
    const text = tag.textContent?.toLowerCase() || '';
    const commonVerbs = ['submit', 'click', 'press', 'select', 'choose', 'download'];
    if (commonVerbs.some(verb => text.includes(verb))) {
      issues.push(`Tag ${tagNumber} should use adjectives, not verbs ("${tag.textContent}")`);
    }
  });
  
  return {
    tags: Array.from(tags),
    issues
  };
}

/**
 * Initialize tag components from existing markup
 * (Note: Tags are mainly visual, so minimal initialization needed)
 */
export function initializeTags(scope: Document | HTMLElement = document): HTMLElement[] {
  const tags = scope.querySelectorAll('[data-module="public-good-tag"]') as NodeListOf<HTMLElement>;
  
  tags.forEach(tag => {
    // Ensure proper class exists
    if (!tag.classList.contains('public-good-tag')) {
      tag.classList.add('public-good-tag');
    }
    
    // Apply color variant from data attribute
    const colorAttribute = tag.getAttribute('data-color');
    if (colorAttribute) {
      setTagColor(tag, colorAttribute as TagColor);
    }
  });
  
  return Array.from(tags);
}