# Tag Component

The tag component is used to indicate the status of an item, such as "Active", "Inactive", or "Completed". Tags help users quickly understand the state of something in a list or table.

## Features

- **Multiple color variants** - Default, grey, red, green, blue, white, aqua-green, purple, pink, orange, yellow
- **Semantic status variants** - Active, inactive, pending, completed, error
- **Size variants** - Small, regular, large
- **Interactive states** - Hover, focus, click support
- **Removable tags** - With close button functionality
- **Accessibility compliant** - WCAG 2.2 color contrast, semantic HTML
- **Responsive design** - Mobile-friendly sizing
- **High contrast support** - Works in forced colors mode
- **TypeScript support** - Full type definitions included

## Basic Usage

### HTML

```html
<!-- Basic tag -->
<strong class="public-good-tag">Active</strong>

<!-- Colored tags -->
<strong class="public-good-tag public-good-tag--green">Success</strong>
<strong class="public-good-tag public-good-tag--red">Error</strong>
<strong class="public-good-tag public-good-tag--blue">Info</strong>

<!-- Multiple tags in container -->
<div class="public-good-tag-container">
  <strong class="public-good-tag public-good-tag--green">Approved</strong>
  <strong class="public-good-tag public-good-tag--orange">Pending</strong>
  <strong class="public-good-tag public-good-tag--red">Rejected</strong>
</div>
```

### TypeScript/JavaScript

```typescript
import { createTag, createTags, createTagContainer } from './tag';

// Create a single tag
const tag = createTag({
  text: 'Active',
  color: 'green',
  classes: 'custom-class',
  attributes: { 'data-status': 'active' }
});

// Create multiple tags
const tags = createTags([
  { text: 'Approved', color: 'green' },
  { text: 'Pending', color: 'orange' },
  { text: 'Rejected', color: 'red' }
]);

// Create tag container
const container = createTagContainer([
  { text: 'Status 1', color: 'blue' },
  { text: 'Status 2', color: 'green' }
]);
```

## Color Variants

### Standard Colors
- `public-good-tag` - Default blue
- `public-good-tag--grey` - Grey
- `public-good-tag--red` - Red
- `public-good-tag--green` - Green
- `public-good-tag--blue` - Blue (explicit)

### Extended Palette
- `public-good-tag--white` - White with border
- `public-good-tag--aqua-green` - Aqua green
- `public-good-tag--purple` - Purple
- `public-good-tag--pink` - Pink
- `public-good-tag--orange` - Orange
- `public-good-tag--yellow` - Yellow

### Semantic Status Colors
- `public-good-tag--active` - Active state (green)
- `public-good-tag--inactive` - Inactive state (grey)
- `public-good-tag--pending` - Pending state (orange)
- `public-good-tag--completed` - Completed state (green)
- `public-good-tag--error` - Error state (red)

## Size Variants

```html
<strong class="public-good-tag public-good-tag--small">Small</strong>
<strong class="public-good-tag">Regular</strong>
<strong class="public-good-tag public-good-tag--large">Large</strong>
```

## Interactive Features

### Interactive Tags

```html
<strong class="public-good-tag public-good-tag--interactive public-good-tag--green">
  Clickable
</strong>
```

### Removable Tags

```html
<strong class="public-good-tag public-good-tag--removable">
  Removable Tag
</strong>
```

## API Reference

### Functions

#### `createTag(options: TagOptions): HTMLElement`

Creates a single tag element.

**Parameters:**
- `options.text` (string) - The tag text content
- `options.color` (TagColor, optional) - Color variant
- `options.classes` (string, optional) - Additional CSS classes
- `options.attributes` (Record<string, string>, optional) - Custom attributes

#### `createTags(tagsOptions: TagOptions[]): HTMLElement[]`

Creates multiple tag elements from an array of options.

#### `createTagContainer(tagsOptions: TagOptions[], containerOptions?): HTMLElement`

Creates a container with multiple tags.

#### `getTagColor(tag: HTMLElement): TagColor`

Returns the current color variant of a tag.

#### `setTagColor(tag: HTMLElement, color: TagColor): void`

Updates the color variant of a tag.

#### `setTagText(tag: HTMLElement, text: string): void`

Updates the text content of a tag.

#### `isTag(element: HTMLElement): boolean`

Checks if an element is a tag component.

#### `validateTags(scope?: Document | HTMLElement): ValidationResult`

Validates tag accessibility and best practices.

#### `initializeTags(scope?: Document | HTMLElement): HTMLElement[]`

Initializes tags from existing markup with data attributes.

### Types

```typescript
type TagColor = 
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

interface TagOptions {
  text: string;
  color?: TagColor;
  classes?: string;
  attributes?: Record<string, string>;
}
```

## Usage Guidelines

### Do ✅
- Use adjectives for tag text (Active, Completed, Valid)
- Keep text short and descriptive
- Use consistent colors for similar statuses
- Start with the smallest number of statuses needed
- Use the `<strong>` element for semantic meaning

### Don't ❌
- Use verbs in tag text (Submit, Click, Download)
- Add links to tags - they should be informational only
- Rely solely on color to convey information
- Use too many different status types
- Make tag text too long (over 20 characters)

## Accessibility

- Uses `<strong>` element for semantic importance
- Meets WCAG 2.2 color contrast requirements
- Supports high contrast mode and forced colors
- Provides focus indicators for interactive tags
- Includes validation function for accessibility compliance

## Examples

See the `examples/` directory for:
- `basic.html` - Basic usage and all variants
- `advanced.html` - Interactive demos and advanced patterns

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

The component includes comprehensive tests covering:
- Component creation and customization
- Color variant management
- Text content updates
- Accessibility validation
- Edge cases and error handling

Run tests with: `npm test tag`