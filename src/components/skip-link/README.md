# Skip Link Component

The Skip Link component helps keyboard-only users skip to the main content on a page, improving navigation efficiency and accessibility. Skip links are essential for users who rely on keyboard navigation or screen readers, allowing them to bypass repetitive navigation elements.

## Features

- **Keyboard accessibility**: Invisible until focused, appearing when tabbed to
- **Smooth scrolling**: Configurable scroll behavior with respect for reduced motion preferences
- **Target focus management**: Automatically focuses the target element after navigation
- **Multiple skip links**: Support for creating multiple skip links on a page
- **Target validation**: Helper functions to ensure skip link targets exist
- **Event system**: Custom events for integration with analytics or other systems
- **Responsive design**: Adapts to different screen sizes and orientations

## Usage

### Basic Skip Link

```typescript
import { createSkipLink } from './skip-link';

const skipLink = createSkipLink({
  text: 'Skip to main content',
  href: '#main'
});

// Add to the beginning of your page
document.body.insertBefore(skipLink, document.body.firstChild);
```

### Multiple Skip Links

```typescript
import { createPageSkipLinks } from './skip-link';

const skipLinksContainer = createPageSkipLinks([
  { text: 'Skip to main content', href: '#main' },
  { text: 'Skip to navigation', href: '#navigation' },
  { text: 'Skip to footer', href: '#footer' }
]);

document.body.insertBefore(skipLinksContainer, document.body.firstChild);
```

### Programmatic Skip Link Management

```typescript
import { SkipLink } from './skip-link';

const skipLinkElement = createSkipLink({
  text: 'Skip to content',
  href: '#main-content'
});

const instance = new SkipLink(skipLinkElement, {
  scrollBehavior: 'smooth',
  focusTarget: true
});

// Update skip link dynamically
instance.updateText('Skip to updated content');
instance.updateHref('#updated-content');

// Programmatically activate
instance.activate();

// Check if visible (focused)
console.log(instance.isVisible());
```

## Configuration Options

### SkipLinkOptions

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `text` | `string` | Skip link text | No (default: 'Skip to main content') |
| `href` | `string` | Target element ID with # prefix | No (default: '#main') |
| `classes` | `string` | Additional CSS classes | No |
| `attributes` | `Record<string, string>` | Additional HTML attributes | No |

### SkipLinkConfig

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `scrollBehavior` | `'auto' \| 'smooth'` | Scroll behavior when navigating | 'smooth' |
| `focusTarget` | `boolean` | Whether to focus the target element | true |

## HTML Structure

### Basic Skip Link

```html
<a class="public-good-skip-link" href="#main">
  Skip to main content
</a>
```

### Multiple Skip Links Container

```html
<div class="public-good-skip-links">
  <a class="public-good-skip-link" href="#main">Skip to main content</a>
  <a class="public-good-skip-link" href="#navigation">Skip to navigation</a>
  <a class="public-good-skip-link" href="#footer">Skip to footer</a>
</div>
```

### Target Element

```html
<main id="main" tabindex="-1">
  <!-- Main content -->
</main>
```

## CSS Classes

### Base Classes

- `.public-good-skip-link` - Base skip link styling (hidden by default)
- `.public-good-skip-link--focused` - Visible state when focused
- `.public-good-skip-links` - Container for multiple skip links

### Positioning Variants

- `.public-good-skip-link--fixed` - Fixed positioning variant
- `.public-good-skip-link--center` - Center-aligned positioning

### Style Variants

- `.public-good-skip-link--compact` - Compact padding variant
- `.public-good-skip-link--high-contrast` - High contrast color scheme

## JavaScript API

### SkipLink Class

```typescript
// Constructor
const instance = new SkipLink(element: HTMLAnchorElement, config?: SkipLinkConfig)

// Content management
instance.updateText(text: string): void
instance.getText(): string
instance.updateHref(href: string): void
instance.getHref(): string

// Target management
instance.getTarget(): HTMLElement | null
instance.activate(): void

// State management
instance.isVisible(): boolean
instance.addClass(className: string): void
instance.removeClass(className: string): void
instance.hasClass(className: string): boolean

// Element access
instance.getElement(): HTMLAnchorElement

// Cleanup
instance.destroy(): void
```

### Helper Functions

```typescript
// Create basic skip link
const skipLink = createSkipLink(options: SkipLinkOptions): HTMLAnchorElement

// Create main content skip link
const mainSkipLink = createMainContentSkipLink(
  text?: string,
  mainContentId?: string
): HTMLAnchorElement

// Create multiple skip links
const container = createPageSkipLinks(
  links: Array<{ text: string; href: string }>
): HTMLElement

// Ensure target exists
const target = ensureSkipTarget(targetId: string): HTMLElement

// Validate skip links on page
const validation = validateSkipLinks(
  scope?: Document | HTMLElement
): {
  skipLinks: HTMLAnchorElement[];
  issues: string[];
  targets: HTMLElement[];
}

// Initialize from markup
const instances = initializeSkipLinks(
  scope?: Document | HTMLElement
): SkipLink[]
```

## Accessibility Features

### WCAG Compliance

The skip link component follows WCAG 2.1 AA guidelines:

- **Focusable**: All skip links are keyboard accessible
- **Visible when focused**: Skip links become visible when receiving keyboard focus
- **Descriptive text**: Clear, descriptive link text indicates the destination
- **Proper semantics**: Uses native anchor elements for screen reader compatibility

### Screen Reader Support

```html
<!-- Basic skip link with clear destination -->
<a class="public-good-skip-link" href="#main">Skip to main content</a>

<!-- Skip link with additional context -->
<a class="public-good-skip-link" href="#search" aria-describedby="search-help">
  Skip to search
</a>
<span id="search-help" class="sr-only">Bypass navigation and go to search form</span>
```

### Focus Management

```typescript
// Ensure target can receive focus
const target = ensureSkipTarget('main-content');

// The target will automatically receive tabindex="-1" if needed
// and will be focused when the skip link is activated
```

## Usage Patterns

### Standard Page Layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Page with Skip Links</title>
  <link rel="stylesheet" href="skip-link.css">
</head>
<body>
  <!-- Skip links should be first interactive elements -->
  <div class="public-good-skip-links">
    <a class="public-good-skip-link" href="#main">Skip to main content</a>
    <a class="public-good-skip-link" href="#navigation">Skip to navigation</a>
  </div>
  
  <header>
    <nav id="navigation">
      <!-- Navigation content -->
    </nav>
  </header>
  
  <main id="main" tabindex="-1">
    <!-- Main content -->
  </main>
  
  <footer>
    <!-- Footer content -->
  </footer>
</body>
</html>
```

### Dynamic Skip Link Creation

```typescript
class PageLayoutManager {
  private skipLinks: SkipLink[] = [];

  constructor() {
    this.createSkipLinks();
  }

  private createSkipLinks(): void {
    const links = [
      { text: 'Skip to main content', href: '#main' },
      { text: 'Skip to navigation', href: '#nav' },
      { text: 'Skip to search', href: '#search' }
    ];

    const container = createPageSkipLinks(links);
    document.body.insertBefore(container, document.body.firstChild);

    // Initialize programmatic control
    const linkElements = container.querySelectorAll('.public-good-skip-link') as NodeListOf<HTMLAnchorElement>;
    linkElements.forEach(element => {
      const instance = new SkipLink(element, {
        scrollBehavior: 'smooth',
        focusTarget: true
      });
      this.skipLinks.push(instance);
    });

    // Ensure all targets exist
    links.forEach(link => {
      const targetId = link.href.substring(1);
      ensureSkipTarget(targetId);
    });
  }

  public validateAccessibility(): void {
    const validation = validateSkipLinks();
    
    if (validation.issues.length > 0) {
      console.warn('Skip link issues found:', validation.issues);
    } else {
      console.log('All skip links are properly configured');
    }
  }

  public destroy(): void {
    this.skipLinks.forEach(instance => instance.destroy());
    this.skipLinks = [];
  }
}
```

### Single Page Application Integration

```typescript
class SPASkipLinkManager {
  private currentSkipLinks: SkipLink[] = [];
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'public-good-skip-links';
    document.body.insertBefore(this.container, document.body.firstChild);
  }

  updateSkipLinksForRoute(routeConfig: {
    mainContent?: string;
    navigation?: string;
    sidebar?: string;
    footer?: string;
  }): void {
    // Clear existing skip links
    this.clearSkipLinks();

    const links: Array<{ text: string; href: string }> = [];

    if (routeConfig.mainContent) {
      links.push({ text: 'Skip to main content', href: `#${routeConfig.mainContent}` });
    }
    
    if (routeConfig.navigation) {
      links.push({ text: 'Skip to navigation', href: `#${routeConfig.navigation}` });
    }
    
    if (routeConfig.sidebar) {
      links.push({ text: 'Skip to sidebar', href: `#${routeConfig.sidebar}` });
    }

    // Create new skip links
    links.forEach(linkConfig => {
      const skipLink = createSkipLink(linkConfig);
      this.container.appendChild(skipLink);

      const instance = new SkipLink(skipLink);
      this.currentSkipLinks.push(instance);

      // Ensure target exists
      const targetId = linkConfig.href.substring(1);
      ensureSkipTarget(targetId);
    });
  }

  private clearSkipLinks(): void {
    this.currentSkipLinks.forEach(instance => instance.destroy());
    this.currentSkipLinks = [];
    this.container.innerHTML = '';
  }

  destroy(): void {
    this.clearSkipLinks();
    this.container.remove();
  }
}

// Usage in route handlers
const skipLinkManager = new SPASkipLinkManager();

// When navigating to different pages
skipLinkManager.updateSkipLinksForRoute({
  mainContent: 'main-content',
  navigation: 'primary-nav',
  sidebar: 'page-sidebar'
});
```

### Form-Heavy Page Skip Links

```typescript
class FormPageSkipLinks {
  constructor(formConfig: {
    formId: string;
    sectionsIds: string[];
    summaryId?: string;
  }) {
    const links = [
      { text: 'Skip to form', href: `#${formConfig.formId}` }
    ];

    // Add links for form sections
    formConfig.sectionsIds.forEach((sectionId, index) => {
      links.push({
        text: `Skip to section ${index + 1}`,
        href: `#${sectionId}`
      });
    });

    // Add summary link if present
    if (formConfig.summaryId) {
      links.push({
        text: 'Skip to form summary',
        href: `#${formConfig.summaryId}`
      });
    }

    const container = createPageSkipLinks(links);
    document.body.insertBefore(container, document.body.firstChild);

    // Initialize skip link instances
    const skipLinkElements = container.querySelectorAll('.public-good-skip-link') as NodeListOf<HTMLAnchorElement>;
    skipLinkElements.forEach(element => {
      new SkipLink(element, {
        scrollBehavior: 'smooth',
        focusTarget: true
      });
    });

    // Ensure all form targets exist and are properly configured
    [formConfig.formId, ...formConfig.sectionsIds, formConfig.summaryId]
      .filter(Boolean)
      .forEach(targetId => {
        const target = ensureSkipTarget(targetId!);
        
        // Make form sections more accessible
        if (!target.getAttribute('role')) {
          target.setAttribute('role', 'region');
        }
        
        if (!target.getAttribute('aria-label') && !target.getAttribute('aria-labelledby')) {
          target.setAttribute('aria-label', `Form section: ${targetId}`);
        }
      });
  }
}
```

## Events

The component dispatches custom events for integration:

```typescript
skipLinkElement.addEventListener('skipLink:activated', (event) => {
  console.log('Skip link activated:', {
    skipLink: event.detail.skipLink,
    target: event.detail.target,
    href: event.detail.href
  });
  
  // Analytics tracking
  analytics.track('skip_link_used', {
    destination: event.detail.href,
    page: window.location.pathname
  });
});
```

## Styling Customization

### CSS Custom Properties

```css
:root {
  --public-good-z-index-skip-link: 9999;
  --public-good-color-focus: #ffeb3b;
  --public-good-color-focus-hover: #f4e642;
  --public-good-color-focus-active: #e6d835;
  --public-good-color-focus-outline: #0066cc;
}
```

### Custom Skip Link Styles

```css
/* Branded skip link */
.branded-skip-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: white;
  font-weight: bold;
}

.branded-skip-link:focus:hover {
  background: white;
  color: #667eea;
  border-color: #667eea;
}

/* High contrast skip link */
.high-contrast-skip-link {
  background: #000000;
  color: #ffffff;
  border: 3px solid #ffffff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Compact mobile skip link */
@media (max-width: 768px) {
  .mobile-skip-link:focus {
    left: 8px;
    right: 8px;
    top: 8px;
    width: auto;
    font-size: 0.875rem;
    padding: 8px 12px;
  }
}
```

## Testing and Validation

### Automated Validation

```typescript
// Test skip links on your page
function testSkipLinks(): void {
  const validation = validateSkipLinks();
  
  console.log(`Found ${validation.skipLinks.length} skip links`);
  console.log(`Found ${validation.targets.length} valid targets`);
  
  if (validation.issues.length > 0) {
    console.error('Skip link issues:', validation.issues);
  } else {
    console.log('✓ All skip links are properly configured');
  }

  // Test each skip link
  validation.skipLinks.forEach((link, index) => {
    const instance = new SkipLink(link);
    
    console.log(`Skip link ${index + 1}:`, {
      text: instance.getText(),
      href: instance.getHref(),
      hasTarget: !!instance.getTarget()
    });

    instance.destroy();
  });
}

// Run validation on page load
document.addEventListener('DOMContentLoaded', testSkipLinks);
```

### Manual Testing

1. **Keyboard Navigation**: Press Tab on page load - skip links should be the first focusable elements
2. **Visibility**: Skip links should be invisible until focused, then clearly visible
3. **Activation**: Pressing Enter or Space on focused skip links should navigate to targets
4. **Target Focus**: After activation, the target element should receive focus
5. **Screen Reader**: Test with screen readers to ensure proper announcements

## Browser Support

- Chrome/Edge 88+
- Firefox 85+  
- Safari 14+
- iOS Safari 14.4+
- Android Chrome 88+

## Migration from NHS UK

This component is converted from the NHS UK Design System. Key differences:

- **Class prefix**: `nhsuk-` → `public-good-`
- **Enhanced API**: Additional methods for programmatic control and validation
- **TypeScript**: Full TypeScript implementation with strict types
- **Modern CSS**: Uses CSS custom properties and modern layout techniques
- **Accessibility helpers**: Built-in validation and target management

### Migration Steps

1. Update class names: `nhsuk-skip-link` → `public-good-skip-link`
2. Update JavaScript imports if using programmatic functionality  
3. Replace NHS UK specific styling with Public Good design tokens
4. Test skip link functionality with keyboard navigation

## Related Components

- **Header**: Often contains navigation that skip links bypass
- **Navigation**: Primary navigation menu that users skip over
- **Main Content**: The target destination for most skip links

## Testing

The component includes comprehensive tests covering:

- Skip link creation and configuration
- Keyboard navigation and activation
- Target focus management and validation
- Helper functions and utilities
- Accessibility compliance
- Edge cases and error handling

Run tests with: `npm test skip-link`