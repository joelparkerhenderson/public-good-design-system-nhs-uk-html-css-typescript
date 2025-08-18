# Back Link Component

A navigation component that helps users go back to the previous page in a journey.

## Usage

The Back Link component helps users navigate backwards through a multi-step process or return to a previous page. It features a distinctive left-pointing chevron icon and can function as either a link or button.

### When to use

- At the start of multi-step processes or forms
- To help users navigate back in a linear journey
- In page hierarchies where users need to go back one level
- When the browser back button might not be reliable or appropriate

### When not to use

- On the home page or landing pages
- When users might lose unsaved data by going back
- In non-linear journeys where "back" is ambiguous
- When breadcrumbs would be more appropriate for complex hierarchies

## Basic Example

```html
<div class="public-good-back-link">
  <a href="/previous-page" class="public-good-back-link__link">
    <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
    </svg>
    Back
  </a>
</div>
```

## TypeScript Usage

```typescript
import { createBackLink } from '@/components/back-link/back-link'

// Create a back link programmatically
const backLink = createBackLink({
  text: 'Back to services',
  href: '/services',
  element: 'a'
})

// Create a button back link with JavaScript handler
const buttonBackLink = createBackLink({
  text: 'Back',
  element: 'button',
  onClick: () => {
    window.history.back()
  }
})

// Append to container
document.querySelector('.container').appendChild(backLink)
```

## Component API

### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | string | No | The text to display. Defaults to "Back" |
| `html` | string | No | HTML content instead of text (takes precedence over text) |
| `href` | string | No | The URL to navigate to (only for links) |
| `element` | 'a' \| 'button' | No | Element type. Defaults to 'a' |
| `classes` | string | No | Additional CSS classes to apply |
| `attributes` | object | No | Additional HTML attributes to apply |
| `onClick` | function | No | Click handler (for button elements) |

### CSS Classes

| Class | Description |
|-------|-------------|
| `.public-good-back-link` | Container wrapper |
| `.public-good-back-link__link` | The main link/button element |
| `.public-good-back-link--reverse` | White text variant for dark backgrounds |
| `.public-good-icon--chevron-left` | Left chevron icon |

## Examples

### Default Back Link
```html
<div class="public-good-back-link">
  <a href="/previous-page" class="public-good-back-link__link">
    <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
    </svg>
    Back
  </a>
</div>
```

### Custom Text
```html
<div class="public-good-back-link">
  <a href="/services" class="public-good-back-link__link">
    <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
    </svg>
    Back to services
  </a>
</div>
```

### As Button Element
```html
<div class="public-good-back-link">
  <button type="button" class="public-good-back-link__link">
    <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
    </svg>
    Back
  </button>
</div>
```

### Reverse (White Text)
```html
<div class="public-good-back-link public-good-back-link--reverse">
  <a href="/previous-page" class="public-good-back-link__link">
    <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
    </svg>
    Back
  </a>
</div>
```

### With Custom HTML Content
```html
<div class="public-good-back-link">
  <a href="/step-1" class="public-good-back-link__link">
    <svg class="public-good-icon public-good-icon--chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
    </svg>
    Back to <span class="public-good-sr-only">step 1: </span>personal details
  </a>
</div>
```

## Accessibility

This component follows WCAG 2.1 AA guidelines:

- Uses semantic `<a>` or `<button>` elements for proper navigation behavior
- Includes proper focus states with high contrast focus indicators
- Icon is marked as `aria-hidden="true"` to avoid screen reader duplication
- Supports keyboard navigation (Enter and Space for buttons)
- Provides sufficient color contrast ratios
- Button variant includes `type="button"` to prevent form submission

### Screen Reader Experience

Screen readers will announce: "Back, link" or "Back to services, link" providing clear context about the navigation action.

### Keyboard Navigation

- **Tab**: Move focus to the back link
- **Enter**: Activate the link/button
- **Space**: Activate button elements (not links, per HTML standards)

## JavaScript Behavior

### Button Back Links

When using `element: 'button'`, you can provide an `onClick` handler:

```typescript
const backLink = createBackLink({
  text: 'Back',
  element: 'button',
  onClick: (event) => {
    // Custom back navigation logic
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/home'
    }
  }
})
```

### History Management

The component can work with browser history:

```typescript
// Simple browser back
const goBack = () => window.history.back()

// Safe back with fallback
const safeGoBack = () => {
  if (document.referrer) {
    window.history.back()
  } else {
    window.location.href = '/home'
  }
}
```

## Browser Support

This component is tested and supported in:
- Chrome (last 2 versions)
- Firefox (last 2 versions)  
- Safari (last 2 versions)
- Edge (last 2 versions)

## Migration from NHS UK

If migrating from the NHS UK Design System:

- Replace `nhsuk-back-link` with `public-good-back-link`
- Replace `nhsuk-back-link__link` with `public-good-back-link__link`
- Replace `nhsuk-back-link--reverse` with `public-good-back-link--reverse`
- Replace `nhsuk-icon__chevron-left` with `public-good-icon--chevron-left`
- Update color scheme from NHS blue to Public Good color palette
- No changes needed for element types (button/link) or functionality