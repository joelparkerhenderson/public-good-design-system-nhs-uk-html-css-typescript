# Action Link Component

A prominent call-to-action link component that helps users navigate to important actions or information.

## Usage

The Action Link component is used to guide users to important actions or pages. It features a distinctive arrow icon and bold text to make it stand out from regular links.

### When to use

- To highlight the most important action on a page
- To guide users to key information or services
- As a call-to-action in content areas
- To provide shortcuts to frequently used functionality

### When not to use

- For regular navigation links - use standard links instead
- In lists of multiple similar actions - use buttons or regular links
- When the action is destructive or requires caution

## Basic Example

```html
<div class="public-good-action-link">
  <a href="/find-services" class="public-good-action-link__link">
    <svg class="public-good-icon public-good-icon--arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
    </svg>
    <span class="public-good-action-link__text">Find your nearest A&E</span>
  </a>
</div>
```

## TypeScript Usage

```typescript
import { createActionLink } from '@/components/action-link/action-link'

// Create an action link programmatically
const actionLink = createActionLink({
  text: 'Find your nearest A&E',
  href: '/find-services',
  openInNewWindow: false
})

// Append to container
document.querySelector('.container').appendChild(actionLink)
```

## Component API

### Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | string | Yes | The text to display in the action link |
| `href` | string | Yes | The URL the link points to |
| `openInNewWindow` | boolean | No | Whether to open the link in a new window/tab |
| `classes` | string | No | Additional CSS classes to apply |
| `attributes` | object | No | Additional HTML attributes to apply |

### CSS Classes

| Class | Description |
|-------|-------------|
| `.public-good-action-link` | Container wrapper |
| `.public-good-action-link__link` | The main link element |
| `.public-good-action-link__text` | Text content wrapper |
| `.public-good-icon--arrow-right-circle` | Arrow icon |

## Examples

### Default Action Link
```html
<div class="public-good-action-link">
  <a href="/services" class="public-good-action-link__link">
    <svg class="public-good-icon public-good-icon--arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
    </svg>
    <span class="public-good-action-link__text">Find services near you</span>
  </a>
</div>
```

### Action Link Opening in New Window
```html
<div class="public-good-action-link">
  <a href="https://external-service.com" class="public-good-action-link__link" target="_blank" rel="noopener noreferrer">
    <svg class="public-good-icon public-good-icon--arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
    </svg>
    <span class="public-good-action-link__text">Visit external service</span>
  </a>
</div>
```

### With Additional Classes
```html
<div class="public-good-action-link">
  <a href="/urgent-care" class="public-good-action-link__link public-good-action-link--urgent">
    <svg class="public-good-icon public-good-icon--arrow-right-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="36" height="36">
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"></path>
    </svg>
    <span class="public-good-action-link__text">Get urgent care</span>
  </a>
</div>
```

## Accessibility

This component follows WCAG 2.1 AA guidelines:

- Uses semantic `<a>` elements for proper link behavior
- Includes proper focus states with high contrast focus indicators
- Icon is marked as `aria-hidden="true"` to avoid screen reader duplication
- Text is wrapped in a span for proper semantic structure
- Supports keyboard navigation
- Provides sufficient color contrast ratios
- When opening in new window, includes `rel="noopener noreferrer"` for security

### Screen Reader Experience

Screen readers will announce: "Find your nearest A&E, link" - providing clear context about the action.

## Browser Support

This component is tested and supported in:
- Chrome (last 2 versions)
- Firefox (last 2 versions)  
- Safari (last 2 versions)
- Edge (last 2 versions)

## Migration from NHS UK

If migrating from the NHS UK Design System:

- Replace `nhsuk-action-link` with `public-good-action-link`
- Replace `nhsuk-action-link__link` with `public-good-action-link__link`
- Replace `nhsuk-action-link__text` with `public-good-action-link__text`
- Replace `nhsuk-icon__arrow-right-circle` with `public-good-icon--arrow-right-circle`
- Update color scheme from NHS blue/green to Public Good color palette