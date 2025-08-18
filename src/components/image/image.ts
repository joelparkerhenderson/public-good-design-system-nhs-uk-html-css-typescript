/**
 * Image Component
 * 
 * Creates accessible image components with support for responsive images,
 * captions, and proper semantic HTML using figure and figcaption elements.
 * 
 * Features:
 * - Responsive image support with srcset and sizes
 * - Optional captions using figcaption element
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Support for different image types and formats
 * - Lazy loading capability
 * - Error handling for broken images
 * - TypeScript support with full type safety
 */

import { generateUniqueId } from '../../core/functions/dom-utils'

/**
 * Responsive image source configuration
 */
export interface ImageSource {
  src: string
  width: number
  descriptor?: string // e.g., "1x", "2x" for density or "600w" for width
}

/**
 * Image component configuration
 */
export interface ImageConfig {
  id?: string
  src: string
  alt: string
  caption?: string
  sources?: ImageSource[]
  sizes?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  classes?: string
  attributes?: Record<string, string>
  figureClasses?: string
  figureAttributes?: Record<string, string>
  captionClasses?: string
  captionAttributes?: Record<string, string>
  onLoad?: (event: Event) => void
  onError?: (event: Event) => void
}

/**
 * Image component result
 */
export interface ImageResult {
  element: HTMLElement
  config: ImageConfig
  updateSource: (src: string, alt?: string) => void
  updateCaption: (caption: string) => void
  updateSources: (sources: ImageSource[]) => void
  reload: () => void
  destroy: () => void
}

/**
 * Creates an image element with responsive support
 */
function createImageElement(config: ImageConfig): HTMLImageElement {
  const img = document.createElement('img')
  img.src = config.src
  img.alt = config.alt
  img.className = 'public-good-image__img' + (config.classes ? ` ${config.classes}` : '')
  
  // Set dimensions if provided
  if (config.width) {
    img.width = config.width
  }
  if (config.height) {
    img.height = config.height
  }
  
  // Set loading behavior
  if (config.loading) {
    img.loading = config.loading
  }
  
  // Build srcset from sources
  if (config.sources && config.sources.length > 0) {
    const srcset = config.sources
      .map(source => `${source.src} ${source.descriptor || `${source.width}w`}`)
      .join(', ')
    img.srcset = srcset
  }
  
  // Set sizes attribute for responsive behavior
  if (config.sizes) {
    img.sizes = config.sizes
  }
  
  // Add custom attributes
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      img.setAttribute(key, value)
    })
  }
  
  return img
}

/**
 * Creates a figure caption element
 */
function createCaptionElement(caption: string, config: ImageConfig): HTMLElement {
  const figcaption = document.createElement('figcaption')
  figcaption.className = 'public-good-image__caption' + (config.captionClasses ? ` ${config.captionClasses}` : '')
  figcaption.textContent = caption
  
  // Add custom attributes
  if (config.captionAttributes) {
    Object.entries(config.captionAttributes).forEach(([key, value]) => {
      figcaption.setAttribute(key, value)
    })
  }
  
  return figcaption
}

/**
 * Creates an image component with optional caption
 */
export function createImage(config: ImageConfig): ImageResult {
  const id = config.id || generateUniqueId('image')
  
  // Create figure element to wrap image and caption
  const figure = document.createElement('figure')
  figure.id = id
  figure.className = 'public-good-image' + (config.figureClasses ? ` ${config.figureClasses}` : '')
  
  // Add custom figure attributes
  if (config.figureAttributes) {
    Object.entries(config.figureAttributes).forEach(([key, value]) => {
      figure.setAttribute(key, value)
    })
  }
  
  // Create image element
  const img = createImageElement(config)
  figure.appendChild(img)
  
  // Create caption if provided
  let captionElement: HTMLElement | null = null
  if (config.caption) {
    captionElement = createCaptionElement(config.caption, config)
    figure.appendChild(captionElement)
  }
  
  // Set up event listeners
  if (config.onLoad) {
    img.addEventListener('load', config.onLoad)
  }
  
  if (config.onError) {
    img.addEventListener('error', config.onError)
  }
  
  // Default error handler for broken images
  img.addEventListener('error', () => {
    // Add error class to figure
    figure.classList.add('public-good-image--error')
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:image:error', {
      detail: { 
        image: img, 
        figure: figure, 
        src: config.src,
        config: config 
      },
      bubbles: true
    })
    figure.dispatchEvent(event)
  })
  
  // Load event handler
  img.addEventListener('load', () => {
    // Remove any error classes
    figure.classList.remove('public-good-image--error')
    
    // Add loaded class
    figure.classList.add('public-good-image--loaded')
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:image:loaded', {
      detail: { 
        image: img, 
        figure: figure, 
        src: img.src,
        config: config 
      },
      bubbles: true
    })
    figure.dispatchEvent(event)
  })
  
  // Update source
  function updateSource(src: string, alt?: string): void {
    const oldSrc = img.src
    img.src = src
    if (alt !== undefined) {
      img.alt = alt
    }
    
    // Update config
    config.src = src
    if (alt !== undefined) {
      config.alt = alt
    }
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:image:source-updated', {
      detail: { 
        image: img, 
        figure: figure, 
        oldSrc: oldSrc,
        newSrc: src,
        alt: img.alt,
        config: config 
      },
      bubbles: true
    })
    figure.dispatchEvent(event)
  }
  
  // Update caption
  function updateCaption(caption: string): void {
    if (captionElement) {
      captionElement.textContent = caption
    } else {
      // Create new caption element
      captionElement = createCaptionElement(caption, config)
      figure.appendChild(captionElement)
    }
    
    // Update config
    config.caption = caption
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:image:caption-updated', {
      detail: { 
        image: img, 
        figure: figure, 
        caption: caption,
        captionElement: captionElement,
        config: config 
      },
      bubbles: true
    })
    figure.dispatchEvent(event)
  }
  
  // Update sources for responsive images
  function updateSources(sources: ImageSource[]): void {
    const srcset = sources
      .map(source => `${source.src} ${source.descriptor || `${source.width}w`}`)
      .join(', ')
    img.srcset = srcset
    
    // Update config
    config.sources = sources
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:image:sources-updated', {
      detail: { 
        image: img, 
        figure: figure, 
        sources: sources,
        srcset: srcset,
        config: config 
      },
      bubbles: true
    })
    figure.dispatchEvent(event)
  }
  
  // Reload image (useful for retry after error)
  function reload(): void {
    const currentSrc = img.src
    img.src = ''
    img.src = currentSrc
    
    // Dispatch custom event
    const event = new CustomEvent('public-good:image:reloaded', {
      detail: { 
        image: img, 
        figure: figure, 
        src: currentSrc,
        config: config 
      },
      bubbles: true
    })
    figure.dispatchEvent(event)
  }
  
  // Cleanup function
  function destroy(): void {
    if (config.onLoad) {
      img.removeEventListener('load', config.onLoad)
    }
    if (config.onError) {
      img.removeEventListener('error', config.onError)
    }
    figure.remove()
  }
  
  return {
    element: figure,
    config,
    updateSource,
    updateCaption,
    updateSources,
    reload,
    destroy
  }
}

/**
 * Creates a responsive image with multiple sources
 */
export function createResponsiveImage(
  src: string,
  alt: string,
  sources: ImageSource[],
  sizes?: string,
  options: Partial<ImageConfig> = {}
): ImageResult {
  return createImage({
    src,
    alt,
    sources,
    sizes: sizes || '(max-width: 768px) 100vw, 50vw',
    ...options
  })
}

/**
 * Creates an image with caption
 */
export function createImageWithCaption(
  src: string,
  alt: string,
  caption: string,
  options: Partial<ImageConfig> = {}
): ImageResult {
  return createImage({
    src,
    alt,
    caption,
    ...options
  })
}

/**
 * Creates a lazy-loaded image
 */
export function createLazyImage(
  src: string,
  alt: string,
  options: Partial<ImageConfig> = {}
): ImageResult {
  return createImage({
    src,
    alt,
    loading: 'lazy',
    ...options
  })
}

/**
 * Initialize all images from data attributes in the DOM
 */
export function initializeImages(): ImageResult[] {
  const elements = document.querySelectorAll('[data-public-good-image]')
  const components: ImageResult[] = []
  
  elements.forEach((element) => {
    try {
      const config: Partial<ImageConfig> = {}
      
      // Basic configuration
      const id = element.getAttribute('data-id')
      if (id) config.id = id
      
      const src = element.getAttribute('data-src')
      if (!src) {
        console.warn('Image component missing required data-src attribute')
        return
      }
      config.src = src
      
      const alt = element.getAttribute('data-alt')
      if (!alt) {
        console.warn('Image component missing required data-alt attribute')
        return
      }
      config.alt = alt
      
      const caption = element.getAttribute('data-caption')
      if (caption) config.caption = caption
      
      const sizes = element.getAttribute('data-sizes')
      if (sizes) config.sizes = sizes
      
      const loading = element.getAttribute('data-loading') as 'lazy' | 'eager'
      if (loading) config.loading = loading
      
      const classes = element.getAttribute('data-classes')
      if (classes) config.classes = classes
      
      const figureClasses = element.getAttribute('data-figure-classes')
      if (figureClasses) config.figureClasses = figureClasses
      
      const captionClasses = element.getAttribute('data-caption-classes')
      if (captionClasses) config.captionClasses = captionClasses
      
      // Width and height
      const width = element.getAttribute('data-width')
      if (width) config.width = parseInt(width, 10)
      
      const height = element.getAttribute('data-height')
      if (height) config.height = parseInt(height, 10)
      
      // Sources for responsive images
      const sourcesData = element.getAttribute('data-sources')
      if (sourcesData) {
        try {
          config.sources = JSON.parse(sourcesData) as ImageSource[]
        } catch (error) {
          console.warn('Invalid JSON in data-sources attribute:', error)
        }
      }
      
      // Create the image component
      const image = createImage(config as ImageConfig)
      
      // Replace the original element
      element.parentNode?.replaceChild(image.element, element)
      components.push(image)
      
    } catch (error) {
      console.error('Error initializing image component:', error)
    }
  })
  
  return components
}

// Auto-initialize images when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImages)
  } else {
    initializeImages()
  }
}