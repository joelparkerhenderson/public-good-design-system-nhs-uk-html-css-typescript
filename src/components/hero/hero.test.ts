import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { 
  Hero,
  createHero, 
  createSimpleHero,
  createImageHero,
  initializeHeroes 
} from './hero';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;

describe('Hero Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createHero', () => {
    it('should create a basic hero with heading and text', () => {
      const hero = createHero({
        heading: 'Welcome to our service',
        text: 'We are here to help you.'
      });

      container.appendChild(hero);

      expect(hero.classList.contains('public-good-hero')).toBe(true);
      expect(hero.tagName).toBe('SECTION');

      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.textContent).toBe('Welcome to our service');
      expect(heading?.tagName).toBe('H1'); // Default heading level

      const paragraph = hero.querySelector('p');
      expect(paragraph?.textContent).toBe('We are here to help you.');
      expect(paragraph?.classList.contains('public-good-body-l')).toBe(true);
    });

    it('should create hero with custom heading level', () => {
      const hero = createHero({
        heading: 'Service Header',
        headingLevel: 2
      });

      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.tagName).toBe('H2');
    });

    it('should create hero with HTML heading', () => {
      const hero = createHero({
        headingHtml: '<strong>Important</strong> Service',
        text: 'Description text'
      });

      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.innerHTML).toBe('<strong>Important</strong> Service');
    });

    it('should create hero with HTML content', () => {
      const hero = createHero({
        heading: 'Service',
        html: '<p>Custom <strong>HTML</strong> content</p><ul><li>List item</li></ul>'
      });

      const content = hero.querySelector('.public-good-hero__wrapper div');
      expect(content?.innerHTML).toBe('<p>Custom <strong>HTML</strong> content</p><ul><li>List item</li></ul>');
    });

    it('should create hero with background image', () => {
      const imageURL = 'https://example.com/hero-image.jpg';
      const hero = createHero({
        heading: 'Image Hero',
        text: 'Hero with background',
        imageURL
      });

      expect(hero.classList.contains('public-good-hero--image')).toBe(true);
      expect(hero.classList.contains('public-good-hero--image-description')).toBe(true);
      expect(hero.style.backgroundImage).toBe(`url("${imageURL}")`);

      const overlay = hero.querySelector('.public-good-hero__overlay');
      expect(overlay).toBeTruthy();

      const arrow = hero.querySelector('.public-good-hero__arrow');
      expect(arrow).toBeTruthy();
      expect(arrow?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should create image-only hero without description class', () => {
      const hero = createHero({
        imageURL: 'https://example.com/image.jpg'
      });

      expect(hero.classList.contains('public-good-hero--image')).toBe(true);
      expect(hero.classList.contains('public-good-hero--image-description')).toBe(false);
      
      const arrow = hero.querySelector('.public-good-hero__arrow');
      expect(arrow).toBeNull(); // No arrow without content
    });

    it('should handle custom classes and attributes', () => {
      const hero = createHero({
        heading: 'Custom Hero',
        classes: 'custom-hero-class',
        attributes: { 'data-test': 'hero-value', 'id': 'main-hero' }
      });

      expect(hero.classList.contains('custom-hero-class')).toBe(true);
      expect(hero.getAttribute('data-test')).toBe('hero-value');
      expect(hero.getAttribute('id')).toBe('main-hero');
    });

    it('should handle container classes', () => {
      const hero = createHero({
        heading: 'Container Test',
        containerClasses: 'custom-container'
      });

      const container = hero.querySelector('.public-good-width-container');
      expect(container?.classList.contains('custom-container')).toBe(true);
      expect(container?.classList.contains('public-good-hero--border')).toBe(true);
    });

    it('should handle heading classes', () => {
      const hero = createHero({
        heading: 'Styled Heading',
        headingClasses: 'custom-heading-style'
      });

      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.classList.contains('custom-heading-style')).toBe(true);
    });

    it('should add margin-bottom-0 class when no content follows heading', () => {
      const hero = createHero({
        heading: 'Standalone Heading'
      });

      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.classList.contains('public-good-u-margin-bottom-0')).toBe(true);
    });

    it('should not add margin-bottom-0 class when content follows heading', () => {
      const hero = createHero({
        heading: 'Heading with Content',
        text: 'Some content'
      });

      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.classList.contains('public-good-u-margin-bottom-0')).toBe(false);
    });
  });

  describe('Hero Class', () => {
    let heroElement: HTMLElement;
    let instance: Hero;

    beforeEach(() => {
      heroElement = createHero({
        heading: 'Test Hero',
        text: 'Test content'
      });
      container.appendChild(heroElement);
      instance = new Hero(heroElement);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
    });

    it('should update heading', () => {
      instance.updateHeading('New Heading');
      
      const heading = heroElement.querySelector('.public-good-hero__heading');
      expect(heading?.textContent).toBe('New Heading');
    });

    it('should update content text', () => {
      instance.updateContent('New content text');
      
      const content = heroElement.querySelector('p');
      expect(content?.textContent).toBe('New content text');
    });

    it('should update content HTML', () => {
      instance.updateContent('<strong>New HTML content</strong>', true);
      
      const content = heroElement.querySelector('p');
      expect(content?.innerHTML).toBe('<strong>New HTML content</strong>');
    });

    it('should create content element if none exists', () => {
      // Create hero without content
      const emptyHero = createHero({ heading: 'Just Heading' });
      const emptyInstance = new Hero(emptyHero);
      
      emptyInstance.updateContent('Added content');
      
      const content = emptyHero.querySelector('p');
      expect(content?.textContent).toBe('Added content');
      expect(content?.classList.contains('public-good-body-l')).toBe(true);
      
      emptyInstance.destroy();
    });

    it('should update background image', () => {
      const imageURL = 'https://example.com/new-image.jpg';
      instance.updateImage(imageURL);
      
      expect(heroElement.style.backgroundImage).toBe(`url("${imageURL}")`);
      expect(heroElement.classList.contains('public-good-hero--image')).toBe(true);
      
      const overlay = heroElement.querySelector('.public-good-hero__overlay');
      expect(overlay).toBeTruthy();
    });

    it('should remove background image', () => {
      // First add an image
      instance.updateImage('https://example.com/image.jpg');
      expect(instance.hasImage()).toBe(true);
      
      // Then remove it
      instance.updateImage(null);
      
      expect(heroElement.style.backgroundImage).toBe('');
      expect(heroElement.classList.contains('public-good-hero--image')).toBe(false);
      expect(heroElement.querySelector('.public-good-hero__overlay')).toBeNull();
    });

    it('should check if hero has image', () => {
      expect(instance.hasImage()).toBe(false);
      
      instance.updateImage('https://example.com/image.jpg');
      expect(instance.hasImage()).toBe(true);
    });

    it('should get heading text', () => {
      expect(instance.getHeading()).toBe('Test Hero');
    });

    it('should get content text', () => {
      expect(instance.getContent()).toBe('Test content');
    });

    it('should show and hide hero', () => {
      instance.hide();
      expect(heroElement.style.display).toBe('none');
      expect(instance.isVisible()).toBe(false);
      
      instance.show();
      expect(heroElement.style.display).toBe('');
      expect(heroElement.hidden).toBe(false);
      expect(instance.isVisible()).toBe(true);
    });
  });

  describe('createSimpleHero', () => {
    it('should create a simple hero with heading and text', () => {
      const hero = createSimpleHero(
        'Simple Hero',
        'Simple description'
      );
      
      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.textContent).toBe('Simple Hero');
      
      const paragraph = hero.querySelector('p');
      expect(paragraph?.textContent).toBe('Simple description');
    });

    it('should create simple hero with image', () => {
      const hero = createSimpleHero(
        'Image Hero',
        'With background',
        'https://example.com/image.jpg'
      );
      
      expect(hero.classList.contains('public-good-hero--image')).toBe(true);
      expect(hero.style.backgroundImage).toContain('image.jpg');
    });
  });

  describe('createImageHero', () => {
    it('should create image hero with content', () => {
      const hero = createImageHero(
        'https://example.com/background.jpg',
        'Image Hero Title',
        'Hero description text'
      );
      
      expect(hero.classList.contains('public-good-hero--image')).toBe(true);
      expect(hero.classList.contains('public-good-hero--image-description')).toBe(true);
      
      const heading = hero.querySelector('.public-good-hero__heading');
      expect(heading?.textContent).toBe('Image Hero Title');
      
      const content = hero.querySelector('p');
      expect(content?.textContent).toBe('Hero description text');
    });

    it('should create image hero without content', () => {
      const hero = createImageHero('https://example.com/background.jpg');
      
      expect(hero.classList.contains('public-good-hero--image')).toBe(true);
      expect(hero.classList.contains('public-good-hero--image-description')).toBe(false);
    });
  });

  describe('initializeHeroes', () => {
    it('should initialize heroes from data attributes', () => {
      const hero1 = createHero({
        heading: 'Hero 1',
        attributes: { 'data-module': 'public-good-hero' }
      });
      const hero2 = createHero({
        heading: 'Hero 2',
        attributes: { 'data-module': 'public-good-hero' }
      });
      
      container.appendChild(hero1);
      container.appendChild(hero2);

      const instances = initializeHeroes(container);
      
      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(Hero);
      expect(instances[1]).toBeInstanceOf(Hero);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-hero');
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeHeroes(container);
      
      expect(instances).toHaveLength(1); // Should still create instance
      
      consoleSpy.mockRestore();

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should work with document scope', () => {
      const hero = createHero({
        heading: 'Document Hero',
        attributes: { 'data-module': 'public-good-hero' }
      });
      document.body.appendChild(hero);

      const instances = initializeHeroes();
      
      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });
  });

  describe('Accessibility', () => {
    it('should use proper heading structure', () => {
      const hero = createHero({
        heading: 'Accessible Hero',
        headingLevel: 2
      });

      const heading = hero.querySelector('h2');
      expect(heading?.classList.contains('public-good-hero__heading')).toBe(true);
    });

    it('should have aria-hidden on decorative arrow', () => {
      const hero = createHero({
        heading: 'Arrow Hero',
        text: 'With arrow',
        imageURL: 'https://example.com/image.jpg'
      });

      const arrow = hero.querySelector('.public-good-hero__arrow');
      expect(arrow?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should be a semantic section element', () => {
      const hero = createHero({
        heading: 'Semantic Hero'
      });

      expect(hero.tagName).toBe('SECTION');
    });
  });

  describe('Edge cases', () => {
    it('should handle missing heading element in update', () => {
      const hero = createHero({ text: 'No heading' });
      const instance = new Hero(hero);
      
      expect(() => {
        instance.updateHeading('New heading');
      }).not.toThrow();
      
      instance.destroy();
    });

    it('should handle missing content container', () => {
      const emptyHero = document.createElement('section');
      emptyHero.className = 'public-good-hero';
      const instance = new Hero(emptyHero);
      
      expect(() => {
        instance.updateContent('Content');
      }).not.toThrow();
      
      instance.destroy();
    });

    it('should handle empty options', () => {
      const hero = createHero({});
      
      expect(hero.classList.contains('public-good-hero')).toBe(true);
      expect(hero.querySelector('.public-good-width-container')).toBeNull();
    });

    it('should prioritize HTML over text content', () => {
      const hero = createHero({
        heading: 'Priority Test',
        text: 'Text content',
        html: '<p>HTML content</p>'
      });

      const htmlContent = hero.querySelector('.public-good-hero__wrapper div');
      expect(htmlContent?.innerHTML).toBe('<p>HTML content</p>');
      
      const textContent = hero.querySelector('.public-good-hero__wrapper p.public-good-body-l');
      expect(textContent).toBeNull(); // Should not exist when HTML is provided
    });
  });
});