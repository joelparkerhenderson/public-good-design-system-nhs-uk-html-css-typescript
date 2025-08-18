# Hint Component

The Hint component provides helpful text to guide users when filling out forms or completing tasks. It gives additional context or instructions without overwhelming the interface, helping users understand what's expected without cluttering the main content.

## Features

- **Flexible content**: Support for both plain text and rich HTML content
- **Form integration**: Easy association with form fields using aria-describedby
- **Programmatic control**: Dynamic content updates and visibility management
- **Accessibility compliant**: Proper ARIA support and screen reader compatibility
- **Responsive design**: Adapts to different screen sizes and contexts
- **Multiple variants**: Different sizes and contextual styles available
- **Progressive enhancement**: Works without JavaScript for basic functionality

## Usage

### Basic Hint

```typescript
import { createHint } from './hint';

const hint = createHint({
  text: 'Enter your full name as it appears on official documents'
});

document.body.appendChild(hint);
```

### Hint with HTML Content

```typescript
const htmlHint = createHint({
  html: 'We\'ll use this to send you <strong>important updates</strong>. See our <a href="#privacy">privacy policy</a> for more information.'
});
```

### Form Field Association

```typescript
import { createAndAssociateHint } from './hint';

const field = document.getElementById('username');
const hint = createAndAssociateHint('Choose a unique username (3-20 characters)', field);

// Insert hint before the field
field.parentElement.insertBefore(hint, field);
```

### Programmatic Hint Management

```typescript
import { Hint } from './hint';

const hintElement = createHint({
  text: 'Initial hint text',
  id: 'dynamic-hint'
});

const instance = new Hint(hintElement);

// Update content
instance.updateText('Updated hint text');
instance.updateHtml('<strong>Updated</strong> HTML hint');

// Control visibility
instance.hide();
instance.show();

// Manage classes
instance.addClass('custom-style');
instance.removeClass('custom-style');

// Get information
console.log(instance.getText()); // "Updated HTML hint"
console.log(instance.getId()); // "dynamic-hint"
console.log(instance.isVisible()); // true
```

## Configuration Options

### HintOptions

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `text` | `string` | Plain text content for the hint | Yes (or html) |
| `html` | `string` | HTML content for the hint (overrides text) | Yes (or text) |
| `id` | `string` | Unique identifier for the hint element | No |
| `classes` | `string` | Additional CSS classes | No |
| `attributes` | `Record<string, string>` | Additional HTML attributes | No |

## HTML Structure

### Basic Hint

```html
<div class="public-good-hint">
  Enter your full name as it appears on official documents
</div>
```

### Hint with Form Field

```html
<div class="public-good-form-group">
  <label class="public-good-label" for="username">Username</label>
  <div class="public-good-hint" id="username-hint">
    Choose a unique username (3-20 characters, letters and numbers only)
  </div>
  <input class="public-good-input" 
         id="username" 
         name="username" 
         type="text" 
         aria-describedby="username-hint">
</div>
```

### Hint with Fieldset

```html
<fieldset class="public-good-fieldset">
  <legend class="public-good-fieldset__legend">Contact preferences</legend>
  <div class="public-good-hint">
    Select all the ways you'd like us to contact you
  </div>
  <!-- Form controls -->
</fieldset>
```

## CSS Classes

### Base Classes

- `.public-good-hint` - Main hint styling
- `.public-good-hint--inline` - Inline hint for use within text
- `.public-good-hint--small` - Smaller hint text
- `.public-good-hint--large` - Larger hint text for emphasis

### Contextual Classes

- `.public-good-hint--success` - Success/positive hint styling
- `.public-good-hint--warning` - Warning/caution hint styling
- `.public-good-hint--error` - Error/negative hint styling

### Spacing and Layout

The hint component automatically adjusts spacing when used with:
- Labels (`.public-good-label`)
- Fieldset legends (`.public-good-fieldset__legend`)
- Form groups (`.public-good-form-group`)

## JavaScript API

### Hint Class

```typescript
// Constructor
const instance = new Hint(element: HTMLElement, config?: HintConfig)

// Content management
instance.updateText(text: string): void
instance.updateHtml(html: string): void
instance.getText(): string
instance.getHtml(): string

// Visibility control
instance.show(): void
instance.hide(): void
instance.isVisible(): boolean

// Element management
instance.getId(): string | null
instance.setId(id: string): void
instance.addClass(className: string): void
instance.removeClass(className: string): void
instance.hasClass(className: string): boolean

// Cleanup
instance.destroy(): void
```

### Helper Functions

```typescript
// Create simple text hint
const textHint = createTextHint(
  text: string,
  id?: string
): HTMLElement

// Create HTML hint
const htmlHint = createHtmlHint(
  html: string,
  id?: string
): HTMLElement

// Create form field hint
const formHint = createFormHint(
  text: string,
  fieldId: string
): HTMLElement

// Associate hint with field
associateHintWithField(
  hintElement: HTMLElement,
  fieldElement: HTMLElement
): void

// Create and associate in one step
const associatedHint = createAndAssociateHint(
  text: string,
  fieldElement: HTMLElement,
  fieldId?: string
): HTMLElement

// Get hints associated with a field
const hints = getAssociatedHints(
  fieldElement: HTMLElement
): HTMLElement[]

// Initialize from data attributes
const instances = initializeHints(
  scope?: Document | HTMLElement
): Hint[]
```

## Accessibility Features

### ARIA Support

- **Form association**: Automatic `aria-describedby` relationship with form fields
- **Live regions**: Support for `aria-live` and `role` attributes for dynamic updates
- **Screen readers**: Proper announcement of hint content and changes

### Form Integration

```typescript
// Automatic association
const field = document.getElementById('email');
const hint = createAndAssociateHint('Enter a valid email address', field);

// Manual association
const customHint = createHint({
  text: 'Custom hint text',
  id: 'custom-hint'
});

associateHintWithField(customHint, field);
// Now field has aria-describedby="custom-hint"
```

### Dynamic Updates

```typescript
// For live updates that should be announced
const liveHint = createHint({
  text: 'Initial status',
  id: 'live-hint',
  attributes: {
    'role': 'status',
    'aria-live': 'polite'
  }
});

const hintInstance = new Hint(liveHint);
hintInstance.updateText('Status updated'); // Announced to screen readers
```

## Form Integration Patterns

### Basic Form Field

```html
<div class="public-good-form-group">
  <label class="public-good-label" for="phone">Phone number</label>
  <div class="public-good-hint" id="phone-hint">
    Include your country code, for example +44 7700 900123
  </div>
  <input class="public-good-input" 
         id="phone" 
         name="phone" 
         type="tel" 
         aria-describedby="phone-hint">
</div>
```

### Multiple Hints

```html
<div class="public-good-form-group">
  <label class="public-good-label" for="password">Password</label>
  <div class="public-good-hint" id="password-length">
    Must be at least 8 characters long
  </div>
  <div class="public-good-hint" id="password-complexity">
    Include uppercase, lowercase, numbers, and symbols
  </div>
  <input class="public-good-input" 
         id="password" 
         name="password" 
         type="password" 
         aria-describedby="password-length password-complexity">
</div>
```

### Conditional Hints

```typescript
const field = document.getElementById('account-type');
const hint = document.getElementById('account-hint');
const hintInstance = new Hint(hint);

field.addEventListener('change', () => {
  const value = field.value;
  
  switch (value) {
    case 'personal':
      hintInstance.updateText('Personal accounts are for individual use');
      hintInstance.show();
      break;
    case 'business':
      hintInstance.updateText('Business accounts require additional verification');
      hintInstance.show();
      break;
    default:
      hintInstance.hide();
  }
});
```

## Styling Customization

### CSS Custom Properties

```css
:root {
  --public-good-color-text-secondary: #666666;
  --public-good-color-link: #0066cc;
  --public-good-color-link-hover: #003d7a;
  --public-good-color-grey-4: #f0f0f0;
  --public-good-spacing-1: 8px;
  --public-good-spacing-2: 12px;
  --public-good-spacing-3: 16px;
  --public-good-spacing-4: 24px;
}
```

### Custom Styling

```css
.custom-hint {
  --public-good-color-text-secondary: #2c5282;
  background-color: #ebf8ff;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 3px solid #3182ce;
}

.custom-hint code {
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
}
```

## Validation Integration

### Real-time Validation Hints

```typescript
class FormValidator {
  private hints = new Map<string, Hint>();
  
  setupFieldValidation(fieldId: string, validator: (value: string) => string | null) {
    const field = document.getElementById(fieldId);
    const hintElement = document.getElementById(`${fieldId}-hint`);
    const hint = new Hint(hintElement);
    
    this.hints.set(fieldId, hint);
    
    field.addEventListener('input', () => {
      const error = validator(field.value);
      
      if (error) {
        hint.updateText(error);
        hint.addClass('public-good-hint--error');
      } else {
        hint.updateText('Looking good!');
        hint.removeClass('public-good-hint--error');
        hint.addClass('public-good-hint--success');
      }
    });
  }
}

// Usage
const validator = new FormValidator();
validator.setupFieldValidation('username', (value) => {
  if (!value) return 'Username is required';
  if (value.length < 3) return 'Username must be at least 3 characters';
  return null; // Valid
});
```

## Examples

### Registration Form

```html
<form class="registration-form">
  <div class="public-good-form-group">
    <label class="public-good-label" for="reg-username">Username</label>
    <div class="public-good-hint" id="username-requirements">
      Choose a unique username (3-20 characters, letters and numbers only)
    </div>
    <input class="public-good-input" 
           id="reg-username" 
           name="username" 
           type="text" 
           aria-describedby="username-requirements">
  </div>

  <div class="public-good-form-group">
    <label class="public-good-label" for="reg-email">Email address</label>
    <div class="public-good-hint" id="email-purpose">
      We'll use this to send you important account updates and notifications
    </div>
    <input class="public-good-input" 
           id="reg-email" 
           name="email" 
           type="email" 
           aria-describedby="email-purpose">
  </div>

  <fieldset class="public-good-fieldset">
    <legend class="public-good-fieldset__legend">Communication preferences</legend>
    <div class="public-good-hint">
      Select how you'd like us to contact you (you can change this later)
    </div>
    <!-- Checkbox options -->
  </fieldset>
</form>
```

### Dynamic Content Form

```typescript
const form = document.getElementById('content-form');
const typeSelect = form.querySelector('#content-type');
const hintElement = form.querySelector('#content-hint');
const hint = new Hint(hintElement);

const hintContent = {
  article: 'Write a comprehensive article with clear headings and structure',
  blog: 'Create an engaging blog post with personal insights and experiences',
  tutorial: 'Provide step-by-step instructions with examples and screenshots',
  review: 'Share your honest opinion with specific details and comparisons'
};

typeSelect.addEventListener('change', () => {
  const selectedType = typeSelect.value;
  if (hintContent[selectedType]) {
    hint.updateText(hintContent[selectedType]);
    hint.show();
  } else {
    hint.hide();
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
- **Enhanced API**: Additional methods for programmatic control and form association
- **Modern CSS**: Uses CSS custom properties instead of Sass variables
- **TypeScript**: Full TypeScript implementation with strict types
- **Improved accessibility**: Enhanced ARIA support and form integration helpers

### Migration Steps

1. Update class names in HTML and CSS: `nhsuk-hint` → `public-good-hint`
2. Update any custom styling references to use new class names
3. Update JavaScript imports if using programmatic functionality
4. Replace NHS UK specific colors with Public Good design tokens

## Testing

The component includes comprehensive tests covering:

- Component creation with text and HTML content
- Programmatic content management and visibility control
- Form field association and aria-describedby management
- Helper functions for common use cases
- Accessibility features and ARIA compliance
- Edge cases and error handling

Run tests with: `npm test hint`

## Related Components

- **Label**: For form field labels that work alongside hints
- **Error Message**: For validation error messages
- **Fieldset**: For grouping related form controls with hints
- **Form Group**: For structuring form fields with labels, hints, and errors