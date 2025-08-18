/**
 * Hero Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * A prominent banner component used at the top of pages to introduce
 * key content or call-to-action messaging with optional background imagery
 */

export interface HeroOptions {
  heading?: string;
  headingHtml?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  headingClasses?: string;
  text?: string;
  html?: string;
  imageURL?: string;
  containerClasses?: string;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface HeroConfig {
  // No specific runtime configuration needed for hero component
  // This interface exists for consistency with other components
}

export class Hero {
  private readonly element: HTMLElement;
  private readonly config: HeroConfig;

  constructor(element: HTMLElement, config: HeroConfig = {}) {
    this.element = element;
    this.config = { ...config };

    // Hero is primarily a presentational component
    // No specific JavaScript functionality required
    this.init();
  }

  /**
   * Initialize the hero component
   */
  private init(): void {
    // Add any initialization logic if needed in the future
    // Currently hero is primarily CSS-driven
  }

  /**
   * Update the hero heading
   */
  public updateHeading(heading: string): void {
    const headingElement = this.element.querySelector('.public-good-hero__heading');
    if (headingElement) {
      headingElement.textContent = heading;
    }
  }

  /**
   * Update the hero content
   */
  public updateContent(content: string, isHtml: boolean = false): void {
    const contentContainer = this.element.querySelector('.public-good-hero__wrapper, .public-good-hero-content');
    if (!contentContainer) return;

    // Find existing content element (paragraph or div)
    let contentElement = contentContainer.querySelector('p, div:not(.public-good-hero__heading)');
    
    if (!contentElement) {
      contentElement = document.createElement('p');
      contentElement.className = 'public-good-body-l public-good-u-margin-bottom-0';
      
      // Insert after heading if it exists
      const heading = contentContainer.querySelector('.public-good-hero__heading');
      if (heading) {
        heading.insertAdjacentElement('afterend', contentElement);
      } else {
        contentContainer.appendChild(contentElement);
      }
    }

    if (isHtml) {
      contentElement.innerHTML = content;
    } else {
      contentElement.textContent = content;
    }
  }

  /**
   * Update the background image
   */
  public updateImage(imageURL: string | null): void {
    if (imageURL) {
      this.element.style.backgroundImage = `url('${imageURL}')`;
      this.element.classList.add('public-good-hero--image');
      
      // Add overlay if it doesn't exist
      if (!this.element.querySelector('.public-good-hero__overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'public-good-hero__overlay';
        
        // Move existing content into overlay
        const existingContent = Array.from(this.element.children);
        existingContent.forEach(child => {
          overlay.appendChild(child);
        });
        
        this.element.appendChild(overlay);
      }
    } else {
      this.element.style.backgroundImage = '';
      this.element.classList.remove('public-good-hero--image', 'public-good-hero--image-description');
      
      // Remove overlay and move content back
      const overlay = this.element.querySelector('.public-good-hero__overlay');
      if (overlay) {
        const content = Array.from(overlay.children);
        content.forEach(child => {
          this.element.appendChild(child);
        });
        overlay.remove();
      }
    }
  }

  /**
   * Check if hero has an image
   */
  public hasImage(): boolean {
    return this.element.classList.contains('public-good-hero--image');
  }

  /**
   * Get hero heading text
   */
  public getHeading(): string {
    const headingElement = this.element.querySelector('.public-good-hero__heading');
    return headingElement?.textContent || '';
  }

  /**
   * Get hero content text
   */
  public getContent(): string {
    const contentElement = this.element.querySelector('.public-good-hero__wrapper p, .public-good-hero-content p');
    return contentElement?.textContent || '';
  }

  /**
   * Show the hero component
   */
  public show(): void {
    this.element.style.display = '';
    this.element.hidden = false;
  }

  /**
   * Hide the hero component
   */
  public hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Check if hero is visible
   */
  public isVisible(): boolean {
    return this.element.style.display !== 'none' && !this.element.hidden;
  }

  /**
   * Destroy the hero instance
   */
  public destroy(): void {
    // Clean up any event listeners or resources if added in the future
    // Currently no cleanup needed as hero is presentational
  }
}

/**
 * Create a hero component
 */
export function createHero(options: HeroOptions): HTMLElement {
  const {
    heading,
    headingHtml,
    headingLevel = 1,
    headingClasses = '',
    text,
    html,
    imageURL,
    containerClasses = '',
    classes = '',
    attributes = {}
  } = options;

  // Create main hero element
  const section = document.createElement('section');
  let heroClasses = 'public-good-hero';
  
  if (imageURL) {
    heroClasses += ' public-good-hero--image';
    if (heading || text || html) {
      heroClasses += ' public-good-hero--image-description';
    }
  }
  
  if (classes) {
    heroClasses += ` ${classes}`;
  }
  
  section.className = heroClasses;

  // Set background image if provided
  if (imageURL) {
    section.style.backgroundImage = `url('${imageURL}')`;
  }

  // Add custom attributes
  Object.entries(attributes).forEach(([key, value]) => {
    section.setAttribute(key, value);
  });

  // Create overlay for image heroes
  let contentContainer: HTMLElement = section;
  if (imageURL) {
    const overlay = document.createElement('div');
    overlay.className = 'public-good-hero__overlay';
    section.appendChild(overlay);
    contentContainer = overlay;
  }

  // Only create content container if there's content to display
  if (heading || headingHtml || text || html) {
    const widthContainer = document.createElement('div');
    let containerClass = 'public-good-width-container';
    
    if (containerClasses) {
      containerClass += ` ${containerClasses}`;
    }
    
    if (!imageURL) {
      containerClass += ' public-good-hero--border';
    }
    
    widthContainer.className = containerClass;

    const gridRow = document.createElement('div');
    gridRow.className = 'public-good-grid-row';

    const gridColumn = document.createElement('div');
    gridColumn.className = 'public-good-grid-column-two-thirds';

    const wrapper = document.createElement('div');
    wrapper.className = imageURL ? 'public-good-hero-content' : 'public-good-hero__wrapper';

    // Create heading if provided
    if (heading || headingHtml) {
      const headingElement = document.createElement(`h${headingLevel}`) as HTMLHeadingElement;
      let headingClass = 'public-good-hero__heading';
      
      if (headingClasses) {
        headingClass += ` ${headingClasses}`;
      }
      
      // Add margin class if no content follows
      if (!text && !html) {
        headingClass += ' public-good-u-margin-bottom-0';
      }
      
      headingElement.className = headingClass;
      
      if (headingHtml) {
        headingElement.innerHTML = headingHtml;
      } else if (heading) {
        headingElement.textContent = heading;
      }
      
      wrapper.appendChild(headingElement);
    }

    // Add content
    if (html) {
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = html;
      wrapper.appendChild(contentDiv);
    } else if (text) {
      const paragraph = document.createElement('p');
      paragraph.className = 'public-good-body-l public-good-u-margin-bottom-0';
      paragraph.textContent = text;
      wrapper.appendChild(paragraph);
    }

    // Add arrow for image heroes with content
    if (imageURL && (heading || headingHtml || text || html)) {
      const arrow = document.createElement('span');
      arrow.className = 'public-good-hero__arrow';
      arrow.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(arrow);
    }

    gridColumn.appendChild(wrapper);
    gridRow.appendChild(gridColumn);
    widthContainer.appendChild(gridRow);
    contentContainer.appendChild(widthContainer);
  }

  return section;
}

/**
 * Initialize hero components from data attributes
 */
export function initializeHeroes(
  scope: Document | HTMLElement = document
): Hero[] {
  const elements = scope.querySelectorAll('[data-module="public-good-hero"]') as NodeListOf<HTMLElement>;
  const instances: Hero[] = [];

  elements.forEach(element => {
    try {
      const instance = new Hero(element);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize hero:', error);
    }
  });

  return instances;
}

/**
 * Helper function to create a simple hero with just heading and text
 */
export function createSimpleHero(
  heading: string,
  text?: string,
  imageURL?: string
): HTMLElement {
  return createHero({
    heading,
    text,
    imageURL
  });
}

/**
 * Helper function to create an image hero with content overlay
 */
export function createImageHero(
  imageURL: string,
  heading?: string,
  content?: string
): HTMLElement {
  return createHero({
    heading,
    text: content,
    imageURL
  });
}