# Breadcrumb Component

A responsive breadcrumb navigation component that shows users their location within the site hierarchy. Automatically adapts to different screen sizes with a simplified mobile back link.

## Features

- **Responsive Design**: Full breadcrumb on desktop/tablet, simplified back link on mobile
- **Accessibility**: WCAG 2.1 AA compliant with proper landmarks and screen reader support
- **Customizable**: Support for custom classes, attributes, and styling variants
- **Analytics Ready**: Built-in event tracking for user interactions
- **SEO Friendly**: Structured data generation for search engines
- **URL Integration**: Automatic breadcrumb generation from current page URL
- **Internationalization**: Full i18n support with RTL language compatibility

## Usage

### Basic Implementation

```typescript
import { createBreadcrumb } from '@/components/breadcrumb/breadcrumb'

const breadcrumb = createBreadcrumb({
  items: [
    { text: 'Home', href: '/' },
    { text: 'Services', href: '/services' },
    { text: 'Find a GP', href: '/services/find-a-gp' },
    { text: 'Book appointment' } // Current page (no href)
  ]
})

document.body.appendChild(breadcrumb.element)
```

### HTML Data Attributes

```html
<div data-public-good-breadcrumb 
     data-items='[
       {"text": "Home", "href": "/"},
       {"text": "Health A-Z", "href": "/health-a-z"},
       {"text": "Mental health"}
     ]'
     data-label-text="Page navigation">
</div>
```

### URL-Based Breadcrumb

```typescript
import { createBreadcrumbFromUrl } from '@/components/breadcrumb/breadcrumb'

const breadcrumb = createBreadcrumbFromUrl('/', {
  'services': 'Our Services',
  'health-a-z': 'Health Information'
})
```

### Reverse Variant for Dark Backgrounds

```typescript
const breadcrumb = createBreadcrumb({
  items: [
    { text: 'Home', href: '/' },
    { text: 'Emergency', href: '/emergency' },
    { text: 'COVID-19 guidance' }
  ],
  classes: 'public-good-breadcrumb--reverse'
})
```

## Configuration Options

### BreadcrumbConfig Interface

```typescript
interface BreadcrumbConfig {
  items: BreadcrumbItem[]           // Required: Array of breadcrumb items
  classes?: string                  // Optional: Additional CSS classes
  attributes?: Record<string, string> // Optional: Custom HTML attributes
  labelText?: string               // Optional: ARIA label (default: "Breadcrumb")
}
```

### BreadcrumbItem Interface

```typescript
interface BreadcrumbItem {
  text: string                     // Required: Display text
  href?: string                    // Optional: Link URL (omit for current page)
  attributes?: Record<string, string> // Optional: Custom HTML attributes
}
```

## Responsive Behavior

The breadcrumb component automatically adapts to different screen sizes:

### Desktop/Tablet (≥768px)
- Shows full breadcrumb trail with separators
- All links are clickable
- Optimal for navigation with many levels

### Mobile (<768px)
- Hides full breadcrumb trail
- Shows simplified "Back to [previous page]" link
- Reduces cognitive load on small screens
- Maintains touch target accessibility standards

## Accessibility Features

- **Semantic HTML**: Uses `<nav>` and `<ol>` elements for proper structure
- **ARIA Labels**: Configurable `aria-label` for screen readers
- **Hidden Decorations**: Chevron separators hidden from assistive technology
- **Touch Targets**: Minimum 44px touch target size for mobile interactions
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Screen Reader Support**: Visually hidden context for mobile back links

## Styling and Theming

### CSS Custom Properties

The component uses design tokens for consistent theming:

```css
.public-good-breadcrumb {
  --breadcrumb-padding: var(--public-good-spacing-3);
  --breadcrumb-font-size: var(--public-good-body-size);
  --breadcrumb-link-color: var(--public-good-color-link);
  --breadcrumb-separator-color: var(--public-good-color-text-secondary);
}
```

### Reverse Variant

```css
.public-good-breadcrumb--reverse {
  /* White text and icons for dark backgrounds */
}
```

### RTL Support

Full right-to-left language support with automatic icon flipping:

```css
[dir="rtl"] .public-good-breadcrumb__backlink {
  /* RTL-specific positioning and icon transforms */
}
```

## Events and Analytics

The component emits custom events for analytics tracking:

```typescript
document.addEventListener('public-good:breadcrumb:click', (event) => {
  console.log('Breadcrumb interaction:', {
    text: event.detail.text,
    href: event.detail.href,
    type: event.detail.type // 'breadcrumb' or 'mobile-back'
  })
})
```

## SEO and Structured Data

Generate JSON-LD structured data for search engines:

```typescript
import { getBreadcrumbStructuredData } from '@/components/breadcrumb/breadcrumb'

const structuredData = getBreadcrumbStructuredData(breadcrumbItems)

// Add to page head
const script = document.createElement('script')
script.type = 'application/ld+json'
script.textContent = JSON.stringify(structuredData)
document.head.appendChild(script)
```

## Advanced Usage

### Custom Attributes

```typescript
const breadcrumb = createBreadcrumb({
  items: [
    { 
      text: 'Home', 
      href: '/',
      attributes: { 
        'data-analytics': 'home-breadcrumb',
        'hreflang': 'en'
      }
    }
  ],
  attributes: {
    'data-testid': 'main-breadcrumb',
    'role': 'navigation'
  }
})
```

### Dynamic Updates

```typescript
// Create breadcrumb
const breadcrumb = createBreadcrumb({ items: initialItems })

// Update by destroying and recreating
breadcrumb.destroy()
const newBreadcrumb = createBreadcrumb({ items: updatedItems })
```

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Assistive Technology**: NVDA, JAWS, VoiceOver compatible
- **CSS Features**: CSS Grid, Flexbox, Custom Properties

## Performance Considerations

- **Lightweight**: ~2KB gzipped (JS + CSS)
- **Tree Shakable**: Import only what you need
- **No Dependencies**: Pure TypeScript implementation
- **Efficient Rendering**: Minimal DOM manipulation
- **Event Delegation**: Optimized event handling

## Migration from NHS UK Frontend

### Key Changes

1. **Namespace**: `nhsuk-` → `public-good-`
2. **Technology**: Nunjucks → TypeScript
3. **Icons**: Background images → Inline SVG
4. **Events**: Custom analytics events added
5. **Configuration**: Data attributes → TypeScript config

### Migration Example

**Before (NHS UK):**
```html
{{ nhsukBreadcrumb({
  "items": [
    {"href": "/", "text": "Home"},
    {"href": "/services", "text": "Services"}
  ]
}) }}
```

**After (Public Good):**
```typescript
import { createBreadcrumb } from '@/components/breadcrumb/breadcrumb'

const breadcrumb = createBreadcrumb({
  items: [
    { text: 'Home', href: '/' },
    { text: 'Services', href: '/services' }
  ]
})
```

## Testing

The component includes comprehensive test coverage:

- **Unit Tests**: 35+ test cases covering all functionality
- **E2E Tests**: Cross-browser testing with Playwright
- **Accessibility Tests**: Automated a11y compliance testing
- **Visual Regression**: Screenshot comparison testing
- **Performance Tests**: Load time and interaction benchmarks

## Examples

See the `examples/` directory for complete implementations:

- **basic.html**: Standard breadcrumb usage
- **reverse.html**: Dark background variants
- **responsive.html**: Mobile behavior demonstration

## Related Components

- **[Back Link](../back-link/README.md)**: Simple back navigation
- **[Skip Link](../skip-link/README.md)**: Accessibility navigation
- **[Pagination](../pagination/README.md)**: Multi-page navigation