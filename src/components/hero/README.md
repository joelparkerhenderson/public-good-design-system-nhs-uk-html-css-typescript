# Hero Component

The Hero component creates prominent banner sections typically used at the top of pages to introduce key content, showcase important messaging, or provide call-to-action elements. It supports both simple text-based layouts and rich image backgrounds with overlay content.

## Features

- **Flexible content**: Support for headings, text, and rich HTML content
- **Background images**: Optional image backgrounds with overlay content boxes
- **Responsive design**: Adapts layout and sizing across different screen sizes
- **Accessibility compliant**: Proper semantic structure and ARIA support
- **Programmatic API**: Dynamic content updates and state management
- **Progressive enhancement**: Works without JavaScript for basic functionality
- **Print optimized**: Appropriate styling for print media
- **High contrast support**: Adapts to Windows high contrast mode

## Usage

### Basic Hero

```typescript
import { createHero } from './hero';

const hero = createHero({
  heading: 'Welcome to Our Service',
  text: 'Providing excellent support for all your needs.'
});

document.body.appendChild(hero);
```

### Hero with Background Image

```typescript
const imageHero = createHero({
  heading: 'Your Health Matters',
  text: 'Discover comprehensive healthcare services designed around your needs.',
  imageURL: 'https://example.com/hero-background.jpg'
});
```

### Hero with Rich HTML Content

```typescript
const richHero = createHero({
  heading: 'Start Your Journey',
  html: `
    <p class="public-good-body-l">Take the first step towards <strong>better health</strong> and wellbeing.</p>
    <p><a href="#" class="public-good-link">Get started today</a> or 
       <a href="#" class="public-good-link">learn more</a> about our services.</p>
  `
});
```

### Programmatic Hero Management

```typescript
import { Hero } from './hero';

const heroElement = createHero({
  heading: 'Dynamic Hero',
  text: 'This content can be updated.'
});

const instance = new Hero(heroElement);

// Update content dynamically
instance.updateHeading('New Heading');
instance.updateContent('Updated content text');
instance.updateImage('https://example.com/new-background.jpg');

// Control visibility
instance.hide();
instance.show();

// Get hero information
console.log(instance.getHeading()); // "New Heading"
console.log(instance.hasImage()); // true
console.log(instance.isVisible()); // true
```

## Configuration Options

### HeroOptions

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `heading` | `string` | Hero heading text | - |
| `headingHtml` | `string` | Hero heading HTML (overrides heading) | - |
| `headingLevel` | `1\|2\|3\|4\|5\|6` | HTML heading level | `1` |
| `headingClasses` | `string` | Additional CSS classes for heading | `''` |
| `text` | `string` | Hero content text | - |
| `html` | `string` | Hero content HTML (overrides text) | - |
| `imageURL` | `string` | Background image URL | - |
| `containerClasses` | `string` | Additional classes for container | `''` |
| `classes` | `string` | Additional classes for hero element | `''` |
| `attributes` | `Record<string, string>` | Additional HTML attributes | `{}` |

## HTML Structure

### Basic Hero

```html
<section class="public-good-hero">
  <div class="public-good-width-container public-good-hero--border">
    <div class="public-good-grid-row">
      <div class="public-good-grid-column-two-thirds">
        <div class="public-good-hero__wrapper">
          <h1 class="public-good-hero__heading">Hero Heading</h1>
          <p class="public-good-body-l public-good-u-margin-bottom-0">Hero content text.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Hero with Background Image

```html
<section class="public-good-hero public-good-hero--image public-good-hero--image-description" 
         style="background-image: url('image.jpg');">
  <div class="public-good-hero__overlay">
    <div class="public-good-width-container">
      <div class="public-good-grid-row">
        <div class="public-good-grid-column-two-thirds">
          <div class="public-good-hero-content">
            <h1 class="public-good-hero__heading">Hero Heading</h1>
            <p class="public-good-body-l public-good-u-margin-bottom-0">Hero content text.</p>
            <span class="public-good-hero__arrow" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## CSS Classes

### Component Classes

- `.public-good-hero` - Main hero container
- `.public-good-hero--border` - Adds top border for heroes without images
- `.public-good-hero--image` - Hero with background image
- `.public-good-hero--image-description` - Hero with image and content overlay
- `.public-good-hero__wrapper` - Content wrapper for basic heroes
- `.public-good-hero__heading` - Hero heading element
- `.public-good-hero__overlay` - Semi-transparent overlay for image backgrounds
- `.public-good-hero-content` - Content box for image heroes
- `.public-good-hero__arrow` - Decorative arrow pointer

### Utility Classes

- `.public-good-u-margin-bottom-0` - Remove bottom margin
- `.public-good-body-l` - Large body text styling

## JavaScript API

### Hero Class

```typescript
// Constructor
const instance = new Hero(element: HTMLElement, config?: HeroConfig)

// Content management
instance.updateHeading(heading: string): void
instance.updateContent(content: string, isHtml?: boolean): void
instance.updateImage(imageURL: string | null): void

// State queries
instance.hasImage(): boolean
instance.getHeading(): string
instance.getContent(): string
instance.isVisible(): boolean

// Visibility control
instance.show(): void
instance.hide(): void

// Cleanup
instance.destroy(): void
```

### Helper Functions

```typescript
// Create simple hero
const simple = createSimpleHero(
  heading: string,
  text?: string,
  imageURL?: string
): HTMLElement

// Create image hero
const imageHero = createImageHero(
  imageURL: string,
  heading?: string,
  content?: string
): HTMLElement

// Initialize from data attributes
const instances = initializeHeroes(
  scope?: Document | HTMLElement
): Hero[]
```

## Responsive Behavior

The hero component adapts to different screen sizes:

### Mobile (up to 40em)
- Full-width content column
- Reduced padding and spacing
- Smaller minimum height for image heroes
- Simplified arrow positioning

### Tablet and Desktop (40em+)
- Two-thirds width content column
- Increased padding and spacing
- Larger minimum height for image heroes
- Enhanced content box styling with shadow

### Content Overlay Positioning
- **Mobile**: Content box appears above image with fixed offset
- **Desktop**: Content box positioned absolutely within image area
- **High contrast mode**: Content box returns to normal flow

## Accessibility Features

### Semantic Structure
- Uses `<section>` element for proper document structure
- Proper heading hierarchy with configurable levels
- Meaningful text alternatives and descriptions

### ARIA Support
- Decorative arrow has `aria-hidden="true"`
- Proper heading structure for screen readers
- Logical focus order and navigation

### Color and Contrast
- Sufficient color contrast ratios
- Text shadow on image backgrounds for readability
- High contrast mode adaptations
- Forced colors mode support

### Keyboard Support
- Standard keyboard navigation through links
- Proper focus indicators
- No keyboard traps or inaccessible elements

## Styling Customization

### CSS Custom Properties

The hero component uses these CSS custom properties:

```css
:root {
  --public-good-color-blue: #005eb8;
  --public-good-color-white: #ffffff;
  --public-good-color-black: #212b32;
  --public-good-color-border: #d8dde0;
  --public-good-color-focus: #ffeb3b;
  --public-good-spacing-3: 16px;
  --public-good-spacing-4: 24px;
  --public-good-spacing-5: 32px;
  --public-good-spacing-6: 40px;
  --public-good-spacing-8: 64px;
  --public-good-spacing-9: 80px;
}
```

### Custom Styling Example

```css
.custom-hero {
  --public-good-color-blue: #2c5282;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-hero .public-good-hero__heading {
  font-size: 2.5rem;
  text-transform: uppercase;
}

.custom-hero .public-good-hero-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}
```

## Animation and Motion

### Default Animations
- Content overlay slides up on page load (respects `prefers-reduced-motion`)
- Smooth focus transitions
- Hover state transitions for links

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .public-good-hero-content {
    animation: none;
  }
}
```

## Integration Patterns

### With Page Headers

```html
<header class="page-header">
  <section class="public-good-hero">
    <!-- Hero content -->
  </section>
</header>
```

### With Navigation

```html
<nav class="main-navigation">
  <!-- Navigation items -->
</nav>
<section class="public-good-hero">
  <!-- Hero content -->
</section>
```

### Multiple Heroes (Carousel Pattern)

```typescript
const heroes = [
  { heading: 'Hero 1', text: 'First hero content' },
  { heading: 'Hero 2', text: 'Second hero content' },
  { heading: 'Hero 3', text: 'Third hero content' }
];

let currentHero = 0;
const container = document.getElementById('hero-container');

function showHero(index) {
  const heroElement = createHero(heroes[index]);
  container.innerHTML = '';
  container.appendChild(heroElement);
}

// Cycle through heroes
setInterval(() => {
  currentHero = (currentHero + 1) % heroes.length;
  showHero(currentHero);
}, 5000);
```

## Examples

### Marketing Landing Page

```typescript
const marketingHero = createHero({
  heading: 'Transform Your Health Journey',
  html: `
    <p class="public-good-body-l">Join thousands of people who have taken control of their wellbeing with our comprehensive health platform.</p>
    <div style="margin-top: 1rem;">
      <a href="#signup" class="public-good-button">Get Started Today</a>
      <a href="#learn-more" class="public-good-link" style="margin-left: 1rem;">Learn More</a>
    </div>
  `,
  imageURL: 'https://example.com/happy-people.jpg'
});
```

### Service Information Page

```typescript
const serviceHero = createHero({
  heading: 'Emergency Services',
  headingLevel: 1,
  text: '24/7 emergency care when you need it most. Call 999 for life-threatening emergencies.',
  imageURL: 'https://example.com/emergency-room.jpg',
  containerClasses: 'emergency-service-container'
});
```

### Simple Page Banner

```typescript
const bannerHero = createHero({
  heading: 'About Our Organization',
  headingLevel: 1,
  classes: 'page-banner'
});
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari 14.4+
- Android Chrome 88+

## Migration from NHS UK

This component is converted from the NHS UK Design System. Key differences:

- **Class prefix**: `nhsuk-` → `public-good-`
- **Enhanced API**: Additional methods for programmatic control
- **Modern CSS**: Uses CSS custom properties instead of Sass variables
- **TypeScript**: Full TypeScript implementation with strict types
- **Improved accessibility**: Enhanced ARIA support and keyboard navigation

### Migration Steps

1. Update class names in HTML and CSS
2. Update any custom styling references
3. Update import statements for JavaScript functionality
4. Replace NHS UK specific colors and spacing with Public Good equivalents

## Testing

The component includes comprehensive tests covering:

- Component creation with various configurations
- Programmatic content management
- Image background handling
- Responsive behavior simulation
- Accessibility compliance
- Edge cases and error handling

Run tests with: `npm test hero`

## Related Components

- **Header**: For site-wide navigation and branding
- **Footer**: For site-wide information and links
- **Card**: For smaller content sections
- **Panel**: For highlighted information sections