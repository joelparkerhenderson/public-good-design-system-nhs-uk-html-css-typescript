# Textarea Component

The textarea component allows users to enter multi-line text. Use it for longer responses that may span several lines, such as comments, descriptions, or detailed explanations.

## Features

- **Multi-line text input** - Allows users to enter text across multiple lines
- **Auto-resize functionality** - Optional automatic height adjustment based on content
- **Character counting** - Built-in character count with limit enforcement
- **Form validation** - Real-time validation with custom error messaging
- **Accessibility compliant** - WCAG 2.2 compliant with proper ARIA attributes
- **Responsive design** - Mobile-friendly with adaptive layouts
- **Size variants** - Small, default, and large size options
- **Resize control** - Configurable resize behavior (vertical, horizontal, both, none)
- **State management** - Support for disabled and readonly states
- **TypeScript support** - Full type definitions included

## Basic Usage

### HTML

```html
<!-- Basic textarea -->
<div class="public-good-form-group">
  <label for="comments" class="public-good-label">Comments</label>
  <textarea id="comments" class="public-good-textarea" rows="4"></textarea>
</div>
```

### TypeScript/JavaScript

```typescript
import { Textarea, createTextarea } from './textarea';

// Create textarea from configuration
const textareaElement = createTextarea({
  label: 'Your message',
  hint: 'Please provide detailed information',
  rows: 5,
  maxlength: 500
});

// Create interactive textarea instance
const container = document.getElementById('textarea-container');
const instance = new Textarea(container, {
  autoResize: true,
  showCharacterCount: true,
  validateOnBlur: true,
  validator: (value) => value.length < 10 ? 'Please enter at least 10 characters' : null
});
```

## Textarea with Hint Text

```html
<div class="public-good-form-group">
  <label for="symptoms" class="public-good-label">Describe your symptoms</label>
  <div id="symptoms-hint" class="public-good-hint">Include when they started and how severe they are</div>
  <textarea id="symptoms" class="public-good-textarea" rows="5" 
            aria-describedby="symptoms-hint"></textarea>
</div>
```

## Character Count

### With Character Limit

```html
<div class="public-good-form-group">
  <label for="description" class="public-good-label">Brief description</label>
  <textarea id="description" class="public-good-textarea" rows="3" maxlength="200"
            aria-describedby="description-count"></textarea>
  <div id="description-count" class="public-good-character-count__status" aria-live="polite">
    You have 200 characters remaining
  </div>
</div>
```

### JavaScript Character Count

```typescript
const textarea = new Textarea(container, {
  maxLength: 200,
  showCharacterCount: true,
  onInput: (value, element) => {
    console.log(`Current length: ${value.length}`);
  }
});
```

## Error State

```html
<div class="public-good-form-group public-good-form-group--error">
  <label for="error-textarea" class="public-good-label">Additional information</label>
  <span id="error-textarea-error" class="public-good-error-message">Enter more information</span>
  <textarea id="error-textarea" class="public-good-textarea public-good-textarea--error" 
            rows="4" aria-describedby="error-textarea-error" aria-invalid="true"></textarea>
</div>
```

## Size Variants

### Small Textarea

```html
<textarea class="public-good-textarea public-good-textarea--small" rows="2"></textarea>
```

### Large Textarea

```html
<textarea class="public-good-textarea public-good-textarea--large" rows="6"></textarea>
```

## Resize Options

### No Resize

```html
<textarea class="public-good-textarea public-good-textarea--no-resize"></textarea>
```

### Horizontal Resize Only

```html
<textarea class="public-good-textarea public-good-textarea--resize-horizontal"></textarea>
```

### Both Directions

```html
<textarea class="public-good-textarea public-good-textarea--resize-both"></textarea>
```

## Width Utilities

### Fixed Character Widths

```html
<!-- 20 character width -->
<textarea class="public-good-textarea public-good-textarea--width-20"></textarea>

<!-- 10 character width -->
<textarea class="public-good-textarea public-good-textarea--width-10"></textarea>

<!-- 5 character width -->
<textarea class="public-good-textarea public-good-textarea--width-5"></textarea>
```

### Height Utilities

```html
<!-- Small height (4em) -->
<textarea class="public-good-textarea public-good-textarea--height-small"></textarea>

<!-- Medium height (8em) -->
<textarea class="public-good-textarea public-good-textarea--height-medium"></textarea>

<!-- Large height (12em) -->
<textarea class="public-good-textarea public-good-textarea--height-large"></textarea>
```

## API Reference

### Textarea Class

#### Constructor

```typescript
new Textarea(element: HTMLElement, config?: TextareaConfig)
```

#### Methods

##### `getValue(): string`
Returns the current textarea value.

##### `setValue(value: string): void`
Sets the textarea value and triggers validation and auto-resize if configured.

##### `focus(): void`
Focuses the textarea element.

##### `blur(): void`
Blurs the textarea element.

##### `validate(): boolean`
Manually validates the textarea using the configured validator.

##### `setError(message: string): void`
Sets an error state with the specified message.

##### `clearError(): void`
Clears any error state.

##### `setDisabled(disabled: boolean): void`
Enables or disables the textarea.

##### `setReadonly(readonly: boolean): void`
Sets the readonly state of the textarea.

##### `getTextarea(): HTMLTextAreaElement`
Returns the textarea element.

##### `getElement(): HTMLElement`
Returns the container element.

##### `destroy(): void`
Destroys the instance and cleans up event listeners.

### Functions

#### `createTextarea(options: TextareaOptions): HTMLElement`

Creates a textarea element with form group structure.

**Parameters:**
- `options.label` - Label text (required)
- `options.id` - Unique identifier
- `options.name` - Form field name
- `options.hint` - Hint text
- `options.placeholder` - Placeholder text
- `options.value` - Initial value
- `options.rows` - Number of visible rows
- `options.maxlength` - Maximum character length
- `options.required` - Whether field is required
- `options.disabled` - Whether field is disabled
- `options.readonly` - Whether field is readonly
- `options.classes` - Additional CSS classes
- `options.attributes` - Custom HTML attributes
- `options.errorMessage` - Error message to display
- `options.spellcheck` - Enable/disable spellcheck
- `options.autocomplete` - Autocomplete attribute value
- `options.resize` - Resize behavior ('none', 'vertical', 'horizontal', 'both')

#### `initializeTextareas(scope?: Document | HTMLElement): Textarea[]`

Initializes textareas from existing markup with `data-module="public-good-textarea"`.

**Data Attributes:**
- `data-auto-resize="true"` - Enable auto-resize
- `data-validate-on-blur="true"` - Validate on blur
- `data-validate-on-input="true"` - Validate on input
- `data-show-character-count="true"` - Show character count
- `data-max-length="100"` - Set maximum length

#### `validateTextareaAccessibility(scope?: Document | HTMLElement): ValidationResult`

Validates textarea accessibility and returns any issues found.

### Types

```typescript
interface TextareaOptions {
  id?: string;
  name?: string;
  label: string;
  hint?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  maxlength?: number;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  classes?: string;
  attributes?: Record<string, string>;
  errorMessage?: string;
  spellcheck?: boolean;
  autocomplete?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

interface TextareaConfig {
  autoResize?: boolean;
  trackChanges?: boolean;
  validateOnBlur?: boolean;
  validateOnInput?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  onInput?: (value: string, textarea: HTMLTextAreaElement) => void;
  onBlur?: (value: string, textarea: HTMLTextAreaElement) => void;
  onFocus?: (textarea: HTMLTextAreaElement) => void;
  validator?: (value: string) => string | null;
}
```

## Events

The Textarea class emits custom events:

### `textarea:input`
Fired when the textarea value changes.
```typescript
element.addEventListener('textarea:input', (event) => {
  console.log(event.detail); // { value, textarea }
});
```

### `textarea:focus`
Fired when the textarea receives focus.

### `textarea:blur`
Fired when the textarea loses focus.

### `textarea:error`
Fired when an error state is set.
```typescript
element.addEventListener('textarea:error', (event) => {
  console.log(event.detail); // { message, textarea }
});
```

### `textarea:error-cleared`
Fired when an error state is cleared.

## Advanced Features

### Auto-Resize

```typescript
const textarea = new Textarea(container, {
  autoResize: true,
  onInput: (value) => {
    console.log('Content changed, height may have adjusted');
  }
});
```

### Custom Validation

```typescript
const textarea = new Textarea(container, {
  validateOnBlur: true,
  validator: (value) => {
    if (value.length < 10) return 'Please enter at least 10 characters';
    if (!/[A-Z]/.test(value)) return 'Please include at least one uppercase letter';
    return null; // No errors
  }
});
```

### Real-time Character Count

```typescript
const textarea = new Textarea(container, {
  maxLength: 500,
  showCharacterCount: true,
  onInput: (value) => {
    if (value.length > 450) {
      console.log('Approaching character limit');
    }
  }
});
```

## Usage Guidelines

### When to Use ✅

- For longer responses that may span multiple lines
- When users need to provide detailed information
- For comments, descriptions, or explanations
- When you expect more than a sentence of input
- For content that benefits from being able to see multiple lines at once

### Best Practices ✅

- Use clear, descriptive labels
- Provide helpful hint text when needed
- Set an appropriate number of rows for expected content
- Use character limits when necessary
- Show character count for limited inputs
- Make the resize behavior appropriate for the content type
- Provide clear error messages
- Test with screen readers

### When Not to Use ❌

- For short, single-line inputs (use text input instead)
- For structured data entry (use specific input types)
- When you need formatted text input (consider rich text editor)
- For passwords or other sensitive data that shouldn't be visible
- For very short responses (a few words)

### Don't ❌

- Use placeholder text as the only form of labeling
- Set the textarea too small for expected content
- Forget to associate error messages with aria-describedby
- Use overly restrictive character limits
- Disable spell checking unnecessarily
- Make the textarea non-resizable when users might need more space

## Accessibility

- Uses semantic HTML with proper form structure
- Provides clear labeling with `<label>` elements
- Supports keyboard navigation
- Includes ARIA attributes for error states and descriptions
- Works with screen readers
- Supports high contrast mode
- Respects reduced motion preferences
- Maintains focus management
- Meets WCAG 2.2 color contrast requirements
- Provides live announcements for character count changes

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports progressive enhancement

## Examples

See the `examples/` directory for:
- `basic.html` - Basic usage patterns and variants
- `advanced.html` - Interactive demos and TypeScript integration

## Testing

Run tests with: `npm test textarea`

The component includes comprehensive tests covering:
- Component creation and configuration
- Value management and validation
- Character counting functionality
- Auto-resize behavior
- Error state management
- Event handling
- Accessibility validation
- Keyboard interaction
- Screen reader compatibility