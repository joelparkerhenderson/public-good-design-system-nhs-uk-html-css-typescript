# Contents List Component

The Contents List component provides a navigation structure for multi-page content, allowing users to understand their current location and navigate between related pages. It displays a list of pages with visual indicators for the current page.

## Features

- **Clear navigation structure**: Ordered list with visual separators
- **Current page indication**: Bold styling and `aria-current` for accessibility
- **Flexible configuration**: Support for custom classes, attributes, and labels
- **Accessible by default**: Proper navigation semantics and screen reader support
- **Programmatic control**: Methods to update current page and extract items
- **Progressive enhancement**: Works without JavaScript

## Usage

### Basic Contents List

```typescript
import { createContentsList } from './contents-list';

const contentsList = createContentsList({
  items: [
    { href: '/intro', text: 'Introduction' },
    { href: '/setup', text: 'Setup', current: true },
    { href: '/usage', text: 'Usage' }
  ]
});

document.body.appendChild(contentsList);
```

### With Custom Configuration

```typescript
const contentsList = createContentsList({
  items: [
    { href: '/page1', text: 'Page 1' },
    { href: '/page2', text: 'Page 2', current: true },
    { href: '/page3', text: 'Page 3' }
  ],
  classes: 'custom-navigation',
  ariaLabel: 'Guide sections',
  hiddenHeading: 'Guide Contents',
  attributes: { 'data-analytics': 'contents-nav' }
});
```

### Simple Helper Function

```typescript
import { createSimpleContentsList } from './contents-list';

const simpleList = createSimpleContentsList([
  { href: '/step1', text: 'Step 1' },
  { href: '/step2', text: 'Step 2', current: true },
  { href: '/step3', text: 'Step 3' }
]);
```

## Configuration Options

### ContentsListOptions

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `items` | `ContentsListItem[]` | Array of navigation items | Required |
| `classes` | `string` | Additional CSS classes | `''` |
| `attributes` | `Record<string, string>` | Additional HTML attributes | `{}` |
| `ariaLabel` | `string` | ARIA label for navigation | `'Pages in this guide'` |
| `hiddenHeading` | `string` | Visually hidden heading text | `'Contents'` |

### ContentsListItem

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `href` | `string` | Link destination URL | Yes |
| `text` | `string` | Link text content | Yes |
| `current` | `boolean` | Whether this is the current page | No |

## HTML Structure

```html
<nav class="public-good-contents-list" role="navigation" aria-label="Pages in this guide">
  <h2 class="public-good-u-visually-hidden">Contents</h2>
  <ol class="public-good-contents-list__list">
    <li class="public-good-contents-list__item">
      <a class="public-good-contents-list__link" href="/page1">Page 1</a>
    </li>
    <li class="public-good-contents-list__item" aria-current="page">
      <span class="public-good-contents-list__current">Page 2</span>
    </li>
    <li class="public-good-contents-list__item">
      <a class="public-good-contents-list__link" href="/page3">Page 3</a>
    </li>
  </ol>
</nav>
```

## CSS Classes

### Component Classes

- `.public-good-contents-list` - Main navigation container
- `.public-good-contents-list__list` - Ordered list container
- `.public-good-contents-list__item` - Individual list item
- `.public-good-contents-list__link` - Navigation link
- `.public-good-contents-list__current` - Current page indicator

### Utility Classes

- `.public-good-u-visually-hidden` - Screen reader only content

## JavaScript API

### Core Functions

```typescript
// Create contents list
const contentsList = createContentsList(options: ContentsListOptions): HTMLElement

// Create simple contents list
const simpleList = createSimpleContentsList(items: ContentsListItem[]): HTMLElement

// Update current page
setCurrentPage(contentsList: HTMLElement, href: string): void

// Get all items from existing list
const items = getContentsListItems(contentsList: HTMLElement): ContentsListItem[]

// Initialize from data attributes
const instances = initializeContentsLists(scope?: Document | HTMLElement): HTMLElement[]
```

### Data Attribute Initialization

```html
<div data-module="public-good-contents-list"
     data-items='[{"href":"/page1","text":"Page 1"},{"href":"/page2","text":"Page 2","current":true}]'
     data-classes="custom-class"
     data-aria-label="Custom navigation"
     data-hidden-heading="Custom heading">
</div>
```

## Accessibility Features

### ARIA Support

- `role="navigation"` for semantic navigation landmark
- `aria-label` for navigation context
- `aria-current="page"` for current page indication
- Visually hidden heading for screen reader context

### Screen Reader Experience

- Clear navigation structure with proper semantics
- Current page clearly identified
- Meaningful labels and context
- Logical tab order through links

### Keyboard Support

- Standard link navigation (Tab, Enter, Space)
- Focus indicators on all interactive elements
- Skip links can target contents list for quick navigation

## Styling and Theming

### CSS Custom Properties

The component uses CSS custom properties for consistent theming:

```css
--public-good-spacing-* /* Spacing scale */
--public-good-color-link /* Link colors */
--public-good-color-text /* Text colors */
--public-good-color-border-secondary /* Border colors */
--public-good-color-focus /* Focus indicators */
--public-good-font-weight-bold /* Typography */
```

### Visual Design

- Gray lines before each item for visual separation
- Bold text for current page
- Hover and focus states for links
- Responsive spacing and layout
- High contrast mode support

## Examples

### Basic Implementation

```html
<nav class="public-good-contents-list" role="navigation" aria-label="Pages in this guide">
  <h2 class="public-good-u-visually-hidden">Contents</h2>
  <ol class="public-good-contents-list__list">
    <li class="public-good-contents-list__item" aria-current="page">
      <span class="public-good-contents-list__current">What is AMD?</span>
    </li>
    <li class="public-good-contents-list__item">
      <a class="public-good-contents-list__link" href="/symptoms">Symptoms</a>
    </li>
    <li class="public-good-contents-list__item">
      <a class="public-good-contents-list__link" href="/diagnosis">Getting diagnosed</a>
    </li>
  </ol>
</nav>
```

### Programmatic Updates

```typescript
// Update current page based on navigation
function handleNavigation(newHref: string, contentsList: HTMLElement) {
  setCurrentPage(contentsList, newHref);
  
  // Update page content
  loadPageContent(newHref);
}

// Get current navigation state
const items = getContentsListItems(contentsList);
const currentItem = items.find(item => item.current);
console.log('Current page:', currentItem?.text);
```

### Integration with Routing

```typescript
// Example integration with browser navigation
window.addEventListener('popstate', (event) => {
  const currentPath = window.location.pathname;
  const contentsList = document.querySelector('.public-good-contents-list');
  
  if (contentsList) {
    setCurrentPage(contentsList, currentPath);
  }
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
- **Module name**: No JavaScript in original → Full TypeScript implementation
- **Enhanced API**: Additional helper functions and programmatic control
- **Modern CSS**: Uses CSS custom properties instead of Sass variables

### Migration Steps

1. Update class names in HTML and CSS
2. Update any custom styling references
3. Use new TypeScript API for dynamic functionality
4. Update data attributes for initialization

## Testing

The component includes comprehensive tests covering:

- Component creation and configuration
- Current page indication and updates
- Data attribute parsing and initialization
- Accessibility features and semantics
- Edge cases and error handling
- Programmatic API functionality

Run tests with: `npm test contents-list`

## Related Components

- **Breadcrumb**: For hierarchical navigation
- **Pagination**: For sequential page navigation
- **Header**: For main site navigation
- **Skip Link**: For accessibility navigation shortcuts