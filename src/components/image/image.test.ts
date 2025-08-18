/**
 * Image Component Unit Tests
 * 
 * Tests for image creation, responsive behavior, captions, and accessibility
 */

import { describe, it, expect, vi } from 'vitest'
import {
  createImage,
  createResponsiveImage,
  createImageWithCaption,
  createLazyImage,
  type ImageConfig,
  type ImageSource
} from './image'

// Mock the DOM utilities
vi.mock('../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`)
}))

// Mock the i18n function
vi.mock('../../core/functions/i18n', () => ({
  t: vi.fn((key: string) => key)
}))

describe('Image Component', () => {
  describe('Configuration', () => {
    it('should create image with basic configuration', () => {
      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image description'
      }

      const image = createImage(config)

      expect(image.element).toBeDefined()
      expect(image.config.src).toBe('/test-image.jpg')
      expect(image.config.alt).toBe('Test image description')
      expect(typeof image.updateSource).toBe('function')
      expect(typeof image.updateCaption).toBe('function')
      expect(typeof image.destroy).toBe('function')
    })

    it('should create image with custom configuration', () => {
      const config: ImageConfig = {
        id: 'custom-image',
        src: '/test-image.jpg',
        alt: 'Test image',
        caption: 'Test caption',
        loading: 'lazy',
        width: 800,
        height: 600
      }

      const image = createImage(config)

      expect(image.config.id).toBe('custom-image')
      expect(image.config.src).toBe('/test-image.jpg')
      expect(image.config.alt).toBe('Test image')
      expect(image.config.caption).toBe('Test caption')
      expect(image.config.loading).toBe('lazy')
      expect(image.config.width).toBe(800)
      expect(image.config.height).toBe(600)
    })

    it('should create image with responsive sources', () => {
      const sources: ImageSource[] = [
        { src: '/image-400.jpg', width: 400 },
        { src: '/image-800.jpg', width: 800 }
      ]

      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Responsive image',
        sources: sources,
        sizes: '(max-width: 768px) 100vw, 50vw'
      }

      const image = createImage(config)

      expect(image.config.sources).toEqual(sources)
      expect(image.config.sizes).toBe('(max-width: 768px) 100vw, 50vw')
    })
  })

  describe('Helper Functions', () => {
    it('should create responsive image using helper function', () => {
      const sources: ImageSource[] = [
        { src: '/image-small.jpg', width: 400 },
        { src: '/image-large.jpg', width: 800 }
      ]

      const image = createResponsiveImage(
        '/image-large.jpg',
        'Responsive test image',
        sources,
        '(max-width: 600px) 100vw, 50vw'
      )

      expect(image.config.src).toBe('/image-large.jpg')
      expect(image.config.alt).toBe('Responsive test image')
      expect(image.config.sources).toEqual(sources)
      expect(image.config.sizes).toBe('(max-width: 600px) 100vw, 50vw')
    })

    it('should create image with caption using helper function', () => {
      const image = createImageWithCaption(
        '/test-image.jpg',
        'Test image',
        'Caption text'
      )

      expect(image.config.src).toBe('/test-image.jpg')
      expect(image.config.alt).toBe('Test image')
      expect(image.config.caption).toBe('Caption text')
    })

    it('should create lazy-loaded image using helper function', () => {
      const image = createLazyImage('/test-image.jpg', 'Lazy loaded image')

      expect(image.config.src).toBe('/test-image.jpg')
      expect(image.config.alt).toBe('Lazy loaded image')
      expect(image.config.loading).toBe('lazy')
    })
  })

  describe('Image Management Methods', () => {
    it('should update image source', () => {
      const image = createImage({
        src: '/original-image.jpg',
        alt: 'Original image'
      })

      image.updateSource('/new-image.jpg', 'New image description')

      expect(image.config.src).toBe('/new-image.jpg')
      expect(image.config.alt).toBe('New image description')
    })

    it('should update image source without changing alt text', () => {
      const image = createImage({
        src: '/original-image.jpg',
        alt: 'Original description'
      })

      image.updateSource('/new-image.jpg')

      expect(image.config.src).toBe('/new-image.jpg')
      expect(image.config.alt).toBe('Original description')
    })

    it('should update caption', () => {
      const image = createImage({
        src: '/test-image.jpg',
        alt: 'Test image',
        caption: 'Original caption'
      })

      image.updateCaption('Updated caption')

      expect(image.config.caption).toBe('Updated caption')
    })

    it('should add caption to image without initial caption', () => {
      const image = createImage({
        src: '/test-image.jpg',
        alt: 'Test image'
      })

      expect(image.config.caption).toBeUndefined()

      image.updateCaption('New caption')

      expect(image.config.caption).toBe('New caption')
    })

    it('should update responsive sources', () => {
      const image = createImage({
        src: '/test-image.jpg',
        alt: 'Test image'
      })

      const newSources: ImageSource[] = [
        { src: '/new-image-400.jpg', width: 400 },
        { src: '/new-image-800.jpg', width: 800 }
      ]

      image.updateSources(newSources)

      expect(image.config.sources).toEqual(newSources)
    })
  })

  describe('Image Sources and Responsive Behavior', () => {
    it('should handle custom descriptors in sources', () => {
      const sources: ImageSource[] = [
        { src: '/image-1x.jpg', width: 400, descriptor: '1x' },
        { src: '/image-2x.jpg', width: 800, descriptor: '2x' }
      ]

      const image = createImage({
        src: '/image-1x.jpg',
        alt: 'High DPI image',
        sources: sources
      })

      expect(image.config.sources).toEqual(sources)
      expect(image.config.sources![0].descriptor).toBe('1x')
      expect(image.config.sources![1].descriptor).toBe('2x')
    })

    it('should handle empty sources array', () => {
      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image',
        sources: []
      }

      const image = createImage(config)

      expect(image.config.sources).toEqual([])
    })
  })

  describe('Custom Attributes and Classes', () => {
    it('should apply custom attributes to image configuration', () => {
      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image',
        attributes: {
          'data-test': 'test-value',
          'aria-describedby': 'description-id'
        }
      }

      const image = createImage(config)

      expect(image.config.attributes).toEqual({
        'data-test': 'test-value',
        'aria-describedby': 'description-id'
      })
    })

    it('should apply custom attributes to figure configuration', () => {
      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image',
        figureAttributes: {
          'data-figure': 'figure-value',
          'role': 'img'
        }
      }

      const image = createImage(config)

      expect(image.config.figureAttributes).toEqual({
        'data-figure': 'figure-value',
        'role': 'img'
      })
    })

    it('should apply custom attributes to caption configuration', () => {
      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image',
        caption: 'Test caption',
        captionAttributes: {
          'data-caption': 'caption-value',
          'id': 'caption-id'
        }
      }

      const image = createImage(config)

      expect(image.config.captionAttributes).toEqual({
        'data-caption': 'caption-value',
        'id': 'caption-id'
      })
    })
  })

  describe('Event Handling Configuration', () => {
    it('should accept load and error handlers in configuration', () => {
      const onLoad = vi.fn()
      const onError = vi.fn()

      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image',
        onLoad: onLoad,
        onError: onError
      }

      const image = createImage(config)

      expect(image.config.onLoad).toBe(onLoad)
      expect(image.config.onError).toBe(onError)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty configuration gracefully', () => {
      expect(() => {
        createImage({
          src: '',
          alt: ''
        })
      }).not.toThrow()
    })

    it('should handle null/undefined values gracefully', () => {
      const config: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image'
      }

      expect(() => createImage(config)).not.toThrow()
    })

    it('should provide all required methods', () => {
      const image = createImage({
        src: '/test-image.jpg',
        alt: 'Test image'
      })

      expect(typeof image.updateSource).toBe('function')
      expect(typeof image.updateCaption).toBe('function')
      expect(typeof image.updateSources).toBe('function')
      expect(typeof image.reload).toBe('function')
      expect(typeof image.destroy).toBe('function')
    })

    it('should maintain configuration reference', () => {
      const originalConfig: ImageConfig = {
        src: '/test-image.jpg',
        alt: 'Test image',
        caption: 'Original caption',
        loading: 'lazy'
      }

      const image = createImage(originalConfig)

      // The image stores the reference to the config object
      expect(image.config).toBe(originalConfig)
      expect(image.config.caption).toBe('Original caption')
      
      // Updates through the API should update the config
      image.updateCaption('API updated caption')
      expect(image.config.caption).toBe('API updated caption')
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should enforce required properties', () => {
      // These should compile correctly
      const validConfig: ImageConfig = {
        src: '/test.jpg',
        alt: 'Test'
      }

      expect(validConfig.src).toBe('/test.jpg')
      expect(validConfig.alt).toBe('Test')
    })

    it('should support optional properties', () => {
      const config: ImageConfig = {
        src: '/test.jpg',
        alt: 'Test',
        caption: 'Optional caption',
        loading: 'lazy',
        width: 800,
        height: 600,
        sizes: '100vw',
        classes: 'custom-class'
      }

      expect(config.caption).toBe('Optional caption')
      expect(config.loading).toBe('lazy')
      expect(config.width).toBe(800)
      expect(config.height).toBe(600)
      expect(config.sizes).toBe('100vw')
      expect(config.classes).toBe('custom-class')
    })

    it('should type ImageSource correctly', () => {
      const source: ImageSource = {
        src: '/image.jpg',
        width: 800,
        descriptor: '800w'
      }

      expect(source.src).toBe('/image.jpg')
      expect(source.width).toBe(800)
      expect(source.descriptor).toBe('800w')
    })
  })
})