# Button Component

A versatile button component that can render as `<button>`, `<a>`, or `<input>` elements with consistent styling and behavior across all variants.

## Features

- **Multi-Element Support**: Can render as button, anchor, or input elements
- **Multiple Variants**: Primary, secondary, warning, success, reverse styles
- **Accessibility**: WCAG 2.1 AA compliant with proper focus management
- **Loading States**: Built-in loading spinner and state management
- **Double-Click Prevention**: Configurable protection against accidental double-clicks
- **Analytics Ready**: Built-in event tracking for user interactions
- **Responsive Design**: Mobile-first approach with touch-friendly targets
- **Keyboard Support**: Full keyboard accessibility including space bar activation

## Usage

### Basic Implementation

```typescript
import { createButton } from '@/components/button/button'

const button = createButton({
  text: 'Save and continue',
  variant: 'primary',
  type: 'submit'
})

document.body.appendChild(button.element)
```

### HTML Data Attributes

```html
<div data-public-good-button 
     data-text="Submit form" 
     data-variant="primary"
     data-type="submit">
</div>
```

### Different Element Types

```typescript
// Button element (default)
const buttonElement = createButton({
  text: 'Click me',
  element: 'button'
})

// Anchor element (automatically selected when href provided)
const linkElement = createButton({
  text: 'Go to page',
  href: '/next-page'
})

// Input element
const inputElement = createButton({
  text: 'Submit',
  element: 'input',
  type: 'submit'
})
```

## Configuration Options

### ButtonConfig Interface

```typescript
interface ButtonConfig {
  text?: string                    // Button text content
  html?: string                   // HTML content (takes precedence over text)
  element?: 'button' | 'a' | 'input'  // HTML element type
  variant?: 'primary' | 'secondary' | 'secondary-solid' | 'reverse' | 'warning' | 'success'
  type?: 'submit' | 'button' | 'reset'  // Button/input type
  href?: string                   // URL for anchor elements
  name?: string                   // Form field name
  value?: string                  // Form field value
  disabled?: boolean              // Disabled state
  preventDoubleClick?: boolean    // Enable double-click prevention
  classes?: string               // Additional CSS classes
  attributes?: Record<string, string>  // Custom HTML attributes
  onClick?: (event: Event) => void    // Click event handler
}
```

## Button Variants

### Primary (Default)
The main call-to-action button on a page.

```typescript
const primaryButton = createButton({
  text: 'Save and continue',
  variant: 'primary'
})
```

### Secondary
For secondary actions or less prominent buttons.

```typescript
const secondaryButton = createButton({
  text: 'Cancel',
  variant: 'secondary'
})
```

### Secondary Solid
Secondary buttons with solid background, suitable for grey backgrounds.

```typescript
const secondarySolidButton = createButton({
  text: 'Find location',
  variant: 'secondary-solid'
})
```

### Warning
For destructive or dangerous actions.

```typescript
const warningButton = createButton({
  text: 'Delete item',
  variant: 'warning'
})
```

### Success
For positive confirmations and successful actions.

```typescript
const successButton = createButton({
  text: 'Confirm action',
  variant: 'success'
})
```

### Reverse
White buttons designed for dark backgrounds.

```typescript
const reverseButton = createButton({
  text: 'Log out',
  variant: 'reverse'
})
```

## Helper Functions

### Pre-configured Button Types

```typescript
import { 
  createSubmitButton, 
  createCancelButton, 
  createLinkButton, 
  createWarningButton 
} from '@/components/button/button'

// Submit button with sensible defaults
const submitBtn = createSubmitButton({ text: 'Submit Form' })

// Cancel button (secondary, type="button")
const cancelBtn = createCancelButton({ text: 'Cancel' })

// Link button (automatically creates <a> element)
const linkBtn = createLinkButton('/home', { text: 'Go Home' })

// Warning button for destructive actions
const deleteBtn = createWarningButton({ text: 'Delete Item' })
```

### Button Groups

```typescript
import { createButtonGroup } from '@/components/button/button'

const primaryBtn = createButton({ text: 'Save' })
const secondaryBtn = createButton({ text: 'Cancel', variant: 'secondary' })

const group = createButtonGroup([primaryBtn, secondaryBtn], 'custom-group-class')
document.body.appendChild(group)
```

## State Management

### Loading States

```typescript
const button = createButton({ text: 'Process Data' })

// Show loading
button.setLoading(true)  // Shows spinner, disables button, changes text to "Loading..."

// Hide loading
button.setLoading(false) // Restores original state
```

### Enable/Disable

```typescript
const button = createButton({ text: 'Submit' })

button.disable()  // Disables button and adds visual indicators
button.enable()   // Re-enables button
```

## Advanced Features

### Double-Click Prevention

```typescript
const button = createButton({
  text: 'Submit Form',
  preventDoubleClick: true,
  onClick: (event) => {
    // This will only fire once per second maximum
    console.log('Form submitted')
  }
})
```

### Custom Attributes and Classes

```typescript
const button = createButton({
  text: 'Custom Button',
  classes: 'my-custom-class',
  attributes: {
    'data-analytics': 'signup-button',
    'aria-describedby': 'button-help-text'
  }
})
```

### Form Integration

```typescript
const submitButton = createButton({
  text: 'Create Account',
  type: 'submit',
  name: 'action',
  value: 'signup'
})

// Add to form
const form = document.getElementById('signup-form')
form.appendChild(submitButton.element)
```

## Events and Analytics

The component emits custom events for analytics tracking:

```typescript
document.addEventListener('public-good:button:click', (event) => {
  console.log('Button interaction:', {
    text: event.detail.text,
    variant: event.detail.variant,
    element: event.detail.element,
    href: event.detail.href // Only for anchor elements
  })
})
```

## Accessibility Features

- **Semantic HTML**: Uses appropriate element types (`<button>`, `<a>`, `<input>`)
- **Keyboard Support**: Full keyboard navigation with Enter and Space activation
- **Focus Management**: Visible focus indicators and proper focus order
- **Touch Targets**: Minimum 44px touch target size for mobile devices
- **Screen Reader Support**: Proper ARIA attributes and state announcements
- **High Contrast**: Compatible with high contrast display modes

### Role Button for Links

When using anchor elements styled as buttons:

```typescript
const linkButton = createButton({
  text: 'Button-styled Link',
  href: '/page',
  element: 'a'
})
// Automatically adds role="button" and handles space bar activation
```

## Styling and Theming

### CSS Custom Properties

The component uses design tokens for consistent theming:

```css
.public-good-button {
  --button-primary-bg: var(--public-good-color-button-primary);
  --button-primary-hover-bg: var(--public-good-color-button-primary-hover);
  --button-shadow: var(--public-good-color-button-shadow);
  --button-padding-x: var(--public-good-spacing-button-padding-x);
  --button-padding-y: var(--public-good-spacing-button-padding-y);
}
```

### Button Shadows

Buttons feature a distinctive shadow that moves when pressed:

- **Normal**: 4px shadow below button
- **Active**: Shadow disappears, button moves down 4px
- **Focus**: Shadow changes to focus color

### Responsive Behavior

- **Mobile**: Full width by default
- **Tablet+**: Auto width, inline display
- **Button Groups**: Stack vertically on mobile, horizontal on desktop

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Assistive Technology**: NVDA, JAWS, VoiceOver compatible

## Performance Considerations

- **Lightweight**: ~3KB gzipped (JS + CSS)
- **Tree Shakable**: Import only what you need
- **Event Delegation**: Efficient event handling
- **Debounced Actions**: Built-in double-click prevention

## Migration from NHS UK Frontend

### Key Changes

1. **Namespace**: `nhsuk-` → `public-good-`
2. **Technology**: Nunjucks → TypeScript
3. **API**: Macro options → TypeScript config
4. **Events**: Added custom analytics events
5. **Variants**: Added success variant, renamed login → reverse

### Migration Example

**Before (NHS UK):**
```html
{{ nhsukButton({
  "text": "Save and continue",
  "classes": "nhsuk-button--secondary"
}) }}
```

**After (Public Good):**
```typescript
import { createButton } from '@/components/button/button'

const button = createButton({
  text: 'Save and continue',
  variant: 'secondary'
})
```

## Testing

The component includes comprehensive test coverage:

- **Unit Tests**: 40+ test cases covering all functionality
- **E2E Tests**: Cross-browser testing with Playwright
- **Accessibility Tests**: Automated a11y compliance testing
- **Visual Regression**: Screenshot comparison testing
- **Form Integration**: Real form submission testing

## Examples

See the `examples/` directory for complete implementations:

- **basic.html**: Standard button usage and states
- **variants.html**: All button variants and styling
- **forms.html**: Form integration and real-world examples

## Related Components

- **[Action Link](../action-link/README.md)**: Link with arrow icon
- **[Back Link](../back-link/README.md)**: Navigation back button
- **[Skip Link](../skip-link/README.md)**: Accessibility navigation