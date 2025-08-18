/**
 * Inset Text Component Unit Tests
 * 
 * Tests for inset text creation, content management, accessibility, and functionality
 */

import { describe, it, expect, vi } from 'vitest'
import {
  createInsetText,
  createInsetTextWithText,
  createInsetTextWithHtml,
  createHealthInsetText,
  createWarningInsetText,
  type InsetTextConfig
} from './inset-text'

// Mock the DOM utilities
vi.mock('../../core/functions/dom-utils', () => ({
  generateUniqueId: vi.fn((prefix: string) => `${prefix}-test-id`)
}))

describe('Inset Text Component', () => {
  describe('Configuration', () => {
    it('should create inset text with basic configuration', () => {
      const config: InsetTextConfig = {
        text: 'Important information for users'
      }

      const insetText = createInsetText(config)

      expect(insetText.element).toBeDefined()
      expect(insetText.config.text).toBe('Important information for users')
      expect(typeof insetText.updateContent).toBe('function')
      expect(typeof insetText.updateHiddenLabel).toBe('function')
      expect(typeof insetText.destroy).toBe('function')
    })

    it('should create inset text with custom configuration', () => {
      const config: InsetTextConfig = {
        id: 'custom-inset',
        text: 'Custom inset text',
        hiddenLabel: 'Custom label: ',
        classes: 'custom-class'
      }

      const insetText = createInsetText(config)

      expect(insetText.config.id).toBe('custom-inset')
      expect(insetText.config.text).toBe('Custom inset text')
      expect(insetText.config.hiddenLabel).toBe('Custom label: ')
      expect(insetText.config.classes).toBe('custom-class')
    })

    it('should create inset text with HTML content', () => {
      const config: InsetTextConfig = {
        html: '<p>Important <strong>health</strong> information</p>'
      }

      const insetText = createInsetText(config)

      expect(insetText.config.html).toBe('<p>Important <strong>health</strong> information</p>')
      expect(insetText.config.text).toBeUndefined()
    })

    it('should prioritize HTML over text when both are provided', () => {
      const config: InsetTextConfig = {
        text: 'Plain text',
        html: '<p>HTML content</p>'
      }

      const insetText = createInsetText(config)

      expect(insetText.config.html).toBe('<p>HTML content</p>')
      expect(insetText.config.text).toBe('Plain text')
    })

    it('should use default hidden label when not provided', () => {
      const config: InsetTextConfig = {
        text: 'Test content'
      }

      const insetText = createInsetText(config)

      expect(insetText.config.hiddenLabel).toBe('Information: ')
    })
  })

  describe('Helper Functions', () => {
    it('should create inset text with text using helper function', () => {
      const insetText = createInsetTextWithText(
        'Helper function text',
        'Custom label: '
      )

      expect(insetText.config.text).toBe('Helper function text')
      expect(insetText.config.hiddenLabel).toBe('Custom label: ')
      expect(insetText.config.html).toBeUndefined()
    })

    it('should create inset text with HTML using helper function', () => {
      const insetText = createInsetTextWithHtml(
        '<p>Helper <em>HTML</em> content</p>',
        'HTML label: '
      )

      expect(insetText.config.html).toBe('<p>Helper <em>HTML</em> content</p>')
      expect(insetText.config.hiddenLabel).toBe('HTML label: ')
      expect(insetText.config.text).toBeUndefined()
    })

    it('should create health inset text with correct styling', () => {
      const insetText = createHealthInsetText('Health information', false)

      expect(insetText.config.text).toBe('Health information')
      expect(insetText.config.hiddenLabel).toBe('Important health information: ')
      expect(insetText.config.classes).toBe('public-good-inset-text--health')
    })

    it('should create health inset text with HTML content', () => {
      const insetText = createHealthInsetText('<p>Health <strong>warning</strong></p>', true)

      expect(insetText.config.html).toBe('<p>Health <strong>warning</strong></p>')
      expect(insetText.config.hiddenLabel).toBe('Important health information: ')
      expect(insetText.config.classes).toBe('public-good-inset-text--health')
      expect(insetText.config.text).toBeUndefined()
    })

    it('should create warning inset text with correct styling', () => {
      const insetText = createWarningInsetText('Warning message', false)

      expect(insetText.config.text).toBe('Warning message')
      expect(insetText.config.hiddenLabel).toBe('Warning: ')
      expect(insetText.config.classes).toBe('public-good-inset-text--warning')
    })

    it('should create warning inset text with HTML content', () => {
      const insetText = createWarningInsetText('<p>Warning <em>content</em></p>', true)

      expect(insetText.config.html).toBe('<p>Warning <em>content</em></p>')
      expect(insetText.config.hiddenLabel).toBe('Warning: ')
      expect(insetText.config.classes).toBe('public-good-inset-text--warning')
      expect(insetText.config.text).toBeUndefined()
    })
  })

  describe('Content Management', () => {
    it('should update text content', () => {
      const insetText = createInsetText({
        text: 'Original text'
      })

      insetText.updateContent('Updated text content', false)

      expect(insetText.config.text).toBe('Updated text content')
      expect(insetText.config.html).toBeUndefined()
    })

    it('should update HTML content', () => {
      const insetText = createInsetText({
        text: 'Original text'
      })

      insetText.updateContent('<p>Updated <strong>HTML</strong> content</p>', true)

      expect(insetText.config.html).toBe('<p>Updated <strong>HTML</strong> content</p>')
      expect(insetText.config.text).toBeUndefined()
    })

    it('should switch from HTML to text content', () => {
      const insetText = createInsetText({
        html: '<p>HTML content</p>'
      })

      insetText.updateContent('Plain text content', false)

      expect(insetText.config.text).toBe('Plain text content')
      expect(insetText.config.html).toBeUndefined()
    })

    it('should switch from text to HTML content', () => {
      const insetText = createInsetText({
        text: 'Plain text'
      })

      insetText.updateContent('<p>HTML content</p>', true)

      expect(insetText.config.html).toBe('<p>HTML content</p>')
      expect(insetText.config.text).toBeUndefined()
    })

    it('should update hidden label', () => {
      const insetText = createInsetText({
        text: 'Test content',
        hiddenLabel: 'Original label: '
      })

      insetText.updateHiddenLabel('Updated label: ')

      expect(insetText.config.hiddenLabel).toBe('Updated label: ')
    })
  })

  describe('Custom Attributes and Classes', () => {
    it('should apply custom attributes', () => {
      const config: InsetTextConfig = {
        text: 'Test content',
        attributes: {
          'data-test': 'test-value',
          'aria-describedby': 'description-id'
        }
      }

      const insetText = createInsetText(config)

      expect(insetText.config.attributes).toEqual({
        'data-test': 'test-value',
        'aria-describedby': 'description-id'
      })
    })

    it('should apply custom classes', () => {
      const config: InsetTextConfig = {
        text: 'Test content',
        classes: 'custom-class another-class'
      }

      const insetText = createInsetText(config)

      expect(insetText.config.classes).toBe('custom-class another-class')
    })

    it('should work without custom classes', () => {
      const config: InsetTextConfig = {
        text: 'Test content'
      }

      const insetText = createInsetText(config)

      expect(insetText.config.classes).toBeUndefined()
    })
  })

  describe('Helper Functions with Options', () => {
    it('should create health inset text with custom options', () => {
      const insetText = createHealthInsetText(
        'Health content',
        false,
        {
          id: 'health-custom',
          classes: 'extra-class',
          attributes: { 'data-health': 'true' }
        }
      )

      expect(insetText.config.id).toBe('health-custom')
      expect(insetText.config.classes).toBe('public-good-inset-text--health extra-class')
      expect(insetText.config.attributes).toEqual({ 'data-health': 'true' })
    })

    it('should create warning inset text with custom options', () => {
      const insetText = createWarningInsetText(
        'Warning content',
        false,
        {
          id: 'warning-custom',
          hiddenLabel: 'Important warning: ',
          classes: 'urgent-warning'
        }
      )

      expect(insetText.config.id).toBe('warning-custom')
      expect(insetText.config.hiddenLabel).toBe('Important warning: ')
      expect(insetText.config.classes).toBe('public-good-inset-text--warning urgent-warning')
    })

    it('should merge helper function classes with custom classes', () => {
      const insetText = createHealthInsetText(
        'Content',
        false,
        { classes: 'custom-health-class' }
      )

      expect(insetText.config.classes).toBe('public-good-inset-text--health custom-health-class')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty configuration', () => {
      expect(() => {
        createInsetText({})
      }).not.toThrow()
    })

    it('should handle empty text content', () => {
      const config: InsetTextConfig = {
        text: ''
      }

      const insetText = createInsetText(config)

      expect(insetText.config.text).toBe('')
    })

    it('should handle empty HTML content', () => {
      const config: InsetTextConfig = {
        html: ''
      }

      const insetText = createInsetText(config)

      expect(insetText.config.html).toBe('')
    })

    it('should provide all required methods', () => {
      const insetText = createInsetText({
        text: 'Test content'
      })

      expect(typeof insetText.updateContent).toBe('function')
      expect(typeof insetText.updateHiddenLabel).toBe('function')
      expect(typeof insetText.destroy).toBe('function')
    })

    it('should handle null/undefined values gracefully', () => {
      const config: InsetTextConfig = {
        text: 'Test content'
      }

      expect(() => createInsetText(config)).not.toThrow()
    })
  })

  describe('Configuration Integrity', () => {
    it('should maintain configuration reference', () => {
      const originalConfig: InsetTextConfig = {
        text: 'Original text',
        hiddenLabel: 'Original: '
      }

      const insetText = createInsetText(originalConfig)

      expect(insetText.config).toBe(originalConfig)
      expect(insetText.config.text).toBe('Original text')
      
      // Updates through the API should update the config
      insetText.updateContent('Updated text')
      expect(insetText.config.text).toBe('Updated text')
      
      insetText.updateHiddenLabel('Updated: ')
      expect(insetText.config.hiddenLabel).toBe('Updated: ')
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should enforce configuration properties', () => {
      // These should compile correctly
      const validConfigs: InsetTextConfig[] = [
        { text: 'Text content' },
        { html: '<p>HTML content</p>' },
        { text: 'Text', hiddenLabel: 'Label: ' },
        { html: '<p>HTML</p>', classes: 'custom-class' },
        { text: 'Text', attributes: { 'data-test': 'value' } }
      ]

      validConfigs.forEach((config) => {
        expect(() => createInsetText(config)).not.toThrow()
      })
    })

    it('should support optional properties', () => {
      const config: InsetTextConfig = {
        id: 'test-id',
        text: 'Test content',
        html: '<p>HTML content</p>',
        hiddenLabel: 'Custom label: ',
        classes: 'custom-class',
        attributes: { 'data-test': 'value' }
      }

      const insetText = createInsetText(config)

      expect(insetText.config.id).toBe('test-id')
      expect(insetText.config.text).toBe('Test content')
      expect(insetText.config.html).toBe('<p>HTML content</p>')
      expect(insetText.config.hiddenLabel).toBe('Custom label: ')
      expect(insetText.config.classes).toBe('custom-class')
      expect(insetText.config.attributes).toEqual({ 'data-test': 'value' })
    })

    it('should handle partial configurations in helper functions', () => {
      const partialConfig = { classes: 'extra-class' }
      
      expect(() => {
        createInsetTextWithText('Text', 'Label: ', partialConfig)
        createInsetTextWithHtml('<p>HTML</p>', 'Label: ', partialConfig)
        createHealthInsetText('Health', false, partialConfig)
        createWarningInsetText('Warning', false, partialConfig)
      }).not.toThrow()
    })
  })

  describe('Default Behavior', () => {
    it('should work with minimal configuration', () => {
      const insetText = createInsetText({ text: 'Minimal config' })

      expect(insetText.element).toBeDefined()
      expect(insetText.config.text).toBe('Minimal config')
      expect(insetText.config.hiddenLabel).toBe('Information: ')
    })

    it('should generate unique IDs when not provided', () => {
      const insetText1 = createInsetText({ text: 'Text 1' })
      const insetText2 = createInsetText({ text: 'Text 2' })

      expect(insetText1.config.id).toBe('inset-text-test-id')
      expect(insetText2.config.id).toBe('inset-text-test-id')
    })

    it('should handle content updates correctly', () => {
      const insetText = createInsetText({ text: 'Initial' })

      // Update to new text
      insetText.updateContent('New text')
      expect(insetText.config.text).toBe('New text')
      expect(insetText.config.html).toBeUndefined()

      // Update to HTML
      insetText.updateContent('<strong>HTML</strong>', true)
      expect(insetText.config.html).toBe('<strong>HTML</strong>')
      expect(insetText.config.text).toBeUndefined()

      // Back to text
      insetText.updateContent('Back to text', false)
      expect(insetText.config.text).toBe('Back to text')
      expect(insetText.config.html).toBeUndefined()
    })
  })
})