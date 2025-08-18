# Character Count Component

The Character Count component helps users understand how much content they can enter in a textarea by providing real-time feedback about their input length. It can count either characters or words and provides clear feedback when approaching or exceeding limits.

## Features

- **Real-time counting**: Updates as users type
- **Character or word counting**: Flexible counting modes
- **Threshold-based visibility**: Only shows counter when approaching limit
- **Accessibility compliant**: Screen reader announcements and ARIA support
- **Error state handling**: Visual feedback when limits are exceeded
- **Configurable limits**: Set character or word limits
- **Progressive enhancement**: Works without JavaScript

## Usage

### Basic Character Count

```typescript
import { createCharacterCount } from './character-count';

const characterCount = createCharacterCount({
  id: 'feedback',
  name: 'feedback',
  label: { text: 'Your feedback' },
  maxlength: 200
});

document.body.appendChild(characterCount);
```

### Word Count

```typescript
const wordCount = createCharacterCount({
  id: 'description',
  name: 'description',
  label: { text: 'Description' },
  maxwords: 100,
  threshold: 80 // Show counter at 80% of limit
});
```

### With Error State

```typescript
const characterCountWithError = createCharacterCount({
  id: 'required-field',
  name: 'required-field',
  label: { text: 'Required field' },
  errorMessage: { text: 'This field is required' },
  maxlength: 500
});
```

## Configuration Options

### CharacterCountOptions

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `id` | `string` | Unique identifier for the textarea | Required |
| `name` | `string` | Name attribute for the textarea | Required |
| `label` | `object` | Label configuration | Required |
| `maxlength` | `number` | Maximum number of characters | - |
| `maxwords` | `number` | Maximum number of words | - |
| `threshold` | `number` | Percentage at which to show counter (0-100) | `0` |
| `hint` | `object` | Hint text configuration | - |
| `errorMessage` | `object` | Error message configuration | - |
| `value` | `string` | Initial value | `''` |
| `rows` | `number` | Number of textarea rows | `5` |
| `spellcheck` | `boolean` | Enable spellcheck | `true` |
| `classes` | `string` | Additional CSS classes | `''` |
| `attributes` | `object` | Additional HTML attributes | `{}` |

### Label Configuration

| Property | Type | Description |
|----------|------|-------------|
| `text` | `string` | Label text content |
| `html` | `string` | Label HTML content |
| `classes` | `string` | Additional CSS classes |
| `isPageHeading` | `boolean` | Wrap label in h1 element |

### Hint Configuration

| Property | Type | Description |
|----------|------|-------------|
| `text` | `string` | Hint text content |
| `html` | `string` | Hint HTML content |
| `classes` | `string` | Additional CSS classes |

### Error Message Configuration

| Property | Type | Description |
|----------|------|-------------|
| `text` | `string` | Error text content |
| `html` | `string` | Error HTML content |
| `classes` | `string` | Additional CSS classes |

## HTML Structure

```html
<div class="public-good-character-count" data-module="public-good-character-count" data-maxlength="200">
  <div class="public-good-form-group">
    <label class="public-good-label" for="example">
      Example label
    </label>
    <textarea class="public-good-textarea public-good-js-character-count" 
              id="example" 
              name="example" 
              aria-describedby="example-info">
    </textarea>
    <div id="example-info" class="public-good-hint public-good-character-count__message">
      You can enter up to 200 characters
    </div>
  </div>
</div>
```

## CSS Classes

### Component Classes

- `.public-good-character-count` - Main wrapper
- `.public-good-character-count__message` - Static message
- `.public-good-character-count__status` - Dynamic counter (visible)
- `.public-good-character-count__sr-status` - Dynamic counter (screen reader only)
- `.public-good-character-count__message--disabled` - Hidden counter state

### State Classes

- `.public-good-form-group--error` - Error state for form group
- `.public-good-textarea--error` - Error state for textarea
- `.public-good-error-message` - Error message styling
- `.public-good-hint` - Hint text styling

## JavaScript API

### CharacterCount Class

```typescript
// Create instance
const characterCount = new CharacterCount(element, config);

// Public methods
characterCount.getCount(): number          // Get current count
characterCount.getRemainingCount(): number // Get remaining count
characterCount.isOverLimit(): boolean      // Check if over limit
characterCount.destroy(): void             // Clean up instance
```

### Initialization Functions

```typescript
// Initialize from existing HTML
const instances = initializeCharacterCounts();

// Initialize with scope
const instances = initializeCharacterCounts(document.querySelector('.my-form'));
```

## Accessibility Features

### ARIA Support

- `aria-describedby` links textarea to counter and hint text
- `aria-live="polite"` for screen reader announcements
- `aria-hidden` controls when counter is announced

### Screen Reader Experience

- Clear count messages ("You have 5 characters remaining")
- Threshold-based announcements (only when approaching limit)
- Error state announcements
- Visually hidden error prefixes

### Keyboard Support

- All functionality available via keyboard
- Standard textarea keyboard interactions
- Focus management maintained

## Examples

### Basic Usage

```html
<div class="public-good-character-count" data-module="public-good-character-count" data-maxlength="100">
  <div class="public-good-form-group">
    <label class="public-good-label" for="basic-example">
      Your message
    </label>
    <textarea class="public-good-textarea public-good-js-character-count" 
              id="basic-example" 
              name="message"
              aria-describedby="basic-example-info"></textarea>
    <div id="basic-example-info" class="public-good-hint public-good-character-count__message">
      You can enter up to 100 characters
    </div>
  </div>
</div>
```

### Word Count with Threshold

```html
<div class="public-good-character-count" 
     data-module="public-good-character-count" 
     data-maxwords="50" 
     data-threshold="80">
  <div class="public-good-form-group">
    <label class="public-good-label" for="word-example">
      Description
    </label>
    <div id="word-example-hint" class="public-good-hint">
      Provide a detailed description
    </div>
    <textarea class="public-good-textarea public-good-js-character-count" 
              id="word-example" 
              name="description"
              aria-describedby="word-example-hint word-example-info"></textarea>
    <div id="word-example-info" class="public-good-hint public-good-character-count__message">
      You can enter up to 50 words
    </div>
  </div>
</div>
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
- **Module name**: `nhsuk-character-count` → `public-good-character-count`
- **TypeScript**: Full TypeScript implementation with strict types
- **Modern CSS**: Uses CSS custom properties instead of Sass variables
- **Enhanced API**: Additional methods and configuration options

### Migration Steps

1. Update class names in HTML and CSS
2. Update data-module attribute
3. Update import statements
4. Update any custom styling references

## Testing

The component includes comprehensive tests covering:

- Component creation and initialization
- Character and word counting accuracy
- Threshold behavior
- Error state handling
- Accessibility features
- Event handling
- Programmatic API

Run tests with: `npm test character-count`