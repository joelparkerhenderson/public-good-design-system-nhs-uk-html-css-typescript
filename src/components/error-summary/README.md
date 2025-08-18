# Error Summary Component

The Error Summary component provides a centralized way to display form validation errors at the top of a page. It improves accessibility by giving users a clear overview of all validation issues and provides links to jump directly to problematic fields.

## Features

- **Centralized error display**: Shows all validation errors in one place
- **Smart focus management**: Intelligently focuses form fields when error links are clicked
- **Accessibility compliant**: Uses ARIA attributes and live regions for screen readers
- **Auto-focus capability**: Can automatically focus the error summary when errors appear
- **Programmatic API**: Add, remove, and manage errors dynamically
- **Legend/label association**: Finds the best element to scroll into view (legend for fieldsets, labels for inputs)
- **Progressive enhancement**: Works without JavaScript for basic functionality

## Usage

### Basic Error Summary

```typescript
import { createErrorSummary } from './error-summary';

const errorSummary = createErrorSummary({
  titleText: 'There is a problem',
  errorList: [
    { text: 'Enter your full name', href: '#name' },
    { text: 'Enter a valid email address', href: '#email' }
  ]
});

document.body.appendChild(errorSummary);
```

### With Description and Custom Title

```typescript
const errorSummary = createErrorSummary({
  titleText: 'Please fix the following errors',
  descriptionText: 'All required fields must be completed before continuing.',
  errorList: [
    { text: 'Date of birth is required', href: '#dob' },
    { text: 'Select your preferred contact method', href: '#contact-method' }
  ]
});
```

### Programmatic Error Management

```typescript
import { ErrorSummary } from './error-summary';

const instance = new ErrorSummary(errorSummaryElement);

// Add errors dynamically
instance.addError({
  text: 'Password is too weak',
  href: '#password'
});

// Remove specific errors
instance.removeError('#password');

// Clear all errors
instance.clearErrors();

// Get error count
const count = instance.getErrorCount();

// Focus the error summary
instance.focus();
```

## Configuration Options

### ErrorSummaryOptions

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `titleText` | `string` | Error summary title text | `'There is a problem'` |
| `titleHtml` | `string` | Error summary title HTML (overrides titleText) | - |
| `descriptionText` | `string` | Additional description text | - |
| `descriptionHtml` | `string` | Additional description HTML | - |
| `errorList` | `ErrorSummaryItem[]` | Array of error items | Required |
| `classes` | `string` | Additional CSS classes | `''` |
| `attributes` | `Record<string, string>` | Additional HTML attributes | `{}` |
| `disableAutoFocus` | `boolean` | Disable auto-focus on creation | `false` |

### ErrorSummaryItem

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `text` | `string` | Error message text | Yes (or html) |
| `html` | `string` | Error message HTML | Yes (or text) |
| `href` | `string` | Link to form field with error | No |
| `attributes` | `Record<string, string>` | Additional link attributes | No |

## HTML Structure

```html
<div class="public-good-error-summary" 
     aria-labelledby="error-summary-title" 
     role="alert" 
     tabindex="-1"
     data-module="public-good-error-summary">
  <h2 class="public-good-error-summary__title" id="error-summary-title">
    There is a problem
  </h2>
  <div class="public-good-error-summary__body">
    <p>Please fix the following issues:</p>
    <ul class="public-good-list public-good-error-summary__list" role="list">
      <li>
        <a href="#name">Enter your full name</a>
      </li>
      <li>
        <a href="#email">Enter a valid email address</a>
      </li>
    </ul>
  </div>
</div>
```

## CSS Classes

### Component Classes

- `.public-good-error-summary` - Main container with error styling
- `.public-good-error-summary__title` - Error summary heading
- `.public-good-error-summary__body` - Content container
- `.public-good-error-summary__list` - Error list

### State Classes

- `.hidden` - Hide the error summary
- `.public-good-error-summary[data-error-count="0"]` - Automatically hide when no errors

## JavaScript API

### ErrorSummary Class

```typescript
// Constructor
const instance = new ErrorSummary(element: HTMLElement, config?: ErrorSummaryConfig)

// Public methods
instance.addError(error: ErrorSummaryItem): void        // Add an error
instance.removeError(href: string): void               // Remove error by href
instance.clearErrors(): void                           // Clear all errors
instance.getErrorCount(): number                       // Get error count
instance.focus(): void                                 // Focus the summary
instance.show(): void                                  // Show the summary
instance.hide(): void                                  // Hide the summary
instance.isVisible(): boolean                          // Check visibility
instance.destroy(): void                               // Clean up instance
```

### Helper Functions

```typescript
// Create simple error summary
const simple = createSimpleErrorSummary(
  errors: Array<{text: string, href: string}>,
  title?: string
): HTMLElement

// Create from form validation
const fromForm = createErrorSummaryFromForm(
  form: HTMLFormElement,
  title?: string
): HTMLElement

// Initialize from data attributes
const instances = initializeErrorSummaries(
  scope?: Document | HTMLElement,
  options?: { focusOnPageLoad?: boolean }
): ErrorSummary[]
```

## Focus Management

The component implements intelligent focus management:

### Legend and Label Association

1. **Fieldset with Legend**: For radio/checkbox inputs, scrolls legend into view
2. **Associated Label**: For other inputs, finds `label[for="inputId"]`
3. **Parent Label**: Falls back to closest parent label element
4. **Smart Scrolling**: Ensures context (legend/label) is visible before focusing input

### Focus Behavior

- **Auto-focus**: Error summary gains focus when created (unless disabled)
- **Link Navigation**: Clicking error links scrolls to and focuses the relevant field
- **Screen Reader Support**: Proper announcements and context for all interactions

## Accessibility Features

### ARIA Support

- `role="alert"` for immediate screen reader announcement
- `aria-labelledby` linking title to summary
- `tabindex="-1"` for programmatic focus
- `role="list"` for error list structure

### Screen Reader Experience

- Error summary announced as alert when it appears
- Clear heading structure with h2 element
- Meaningful error messages with field context
- Proper focus management preserves context

### Keyboard Support

- Error summary is focusable for keyboard users
- Standard link navigation through error list
- Tab order maintains logical flow

## Integration Patterns

### Form Validation Integration

```typescript
function validateForm(form: HTMLFormElement) {
  const errors: ErrorSummaryItem[] = [];
  
  // Collect validation errors
  const invalidFields = form.querySelectorAll(':invalid');
  invalidFields.forEach(field => {
    const fieldName = getFieldLabel(field);
    const errorMessage = getValidationMessage(field);
    
    errors.push({
      text: `${fieldName}: ${errorMessage}`,
      href: `#${field.id}`
    });
  });
  
  // Create or update error summary
  if (errors.length > 0) {
    const errorSummary = createErrorSummary({
      titleText: 'Please fix the following errors',
      errorList: errors
    });
    
    // Insert at top of form
    form.insertBefore(errorSummary, form.firstChild);
    
    return false; // Prevent submission
  }
  
  return true; // Allow submission
}
```

### Real-time Error Updates

```typescript
const errorSummary = new ErrorSummary(element);

function updateFieldValidation(fieldId: string, isValid: boolean, message: string) {
  if (isValid) {
    errorSummary.removeError(`#${fieldId}`);
  } else {
    errorSummary.addError({
      text: message,
      href: `#${fieldId}`
    });
  }
  
  // Show/hide summary based on error count
  if (errorSummary.getErrorCount() === 0) {
    errorSummary.hide();
  } else {
    errorSummary.show();
  }
}
```

## Examples

### Basic Form Validation

```html
<div class="public-good-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1">
  <h2 class="public-good-error-summary__title" id="error-summary-title">
    There is a problem
  </h2>
  <div class="public-good-error-summary__body">
    <ul class="public-good-list public-good-error-summary__list" role="list">
      <li><a href="#name">Enter your full name</a></li>
      <li><a href="#email">Enter a valid email address</a></li>
    </ul>
  </div>
</div>

<form>
  <div class="public-good-form-group">
    <label for="name">Full name</label>
    <input id="name" class="public-good-input--error" type="text">
    <div class="public-good-error-message">Enter your full name</div>
  </div>
  
  <div class="public-good-form-group">
    <label for="email">Email address</label>
    <input id="email" class="public-good-input--error" type="email">
    <div class="public-good-error-message">Enter a valid email address</div>
  </div>
</form>
```

### Multi-step Form Errors

```typescript
class MultiStepFormValidator {
  private errorSummary: ErrorSummary;
  private allErrors = new Map<number, ErrorSummaryItem[]>();
  
  constructor(summaryElement: HTMLElement) {
    this.errorSummary = new ErrorSummary(summaryElement);
  }
  
  validateStep(stepNumber: number, fields: HTMLElement[]): boolean {
    const stepErrors: ErrorSummaryItem[] = [];
    
    fields.forEach(field => {
      if (!this.isFieldValid(field)) {
        stepErrors.push({
          text: this.getErrorMessage(field),
          href: `#${field.id}`
        });
      }
    });
    
    this.allErrors.set(stepNumber, stepErrors);
    this.updateErrorSummary();
    
    return stepErrors.length === 0;
  }
  
  private updateErrorSummary() {
    this.errorSummary.clearErrors();
    
    this.allErrors.forEach(errors => {
      errors.forEach(error => {
        this.errorSummary.addError(error);
      });
    });
  }
}
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
- **Module name**: `nhsuk-error-summary` → `public-good-error-summary`
- **Enhanced API**: Additional methods for programmatic control
- **Modern CSS**: Uses CSS custom properties instead of Sass variables
- **TypeScript**: Full TypeScript implementation with strict types

### Migration Steps

1. Update class names in HTML and CSS
2. Update data-module attribute
3. Update import statements for JavaScript functionality
4. Update any custom styling references

## Testing

The component includes comprehensive tests covering:

- Component creation and configuration
- Error management (add, remove, clear)
- Focus management and smart scrolling
- Accessibility features and ARIA attributes
- Edge cases and error handling
- Integration with form validation

Run tests with: `npm test error-summary`

## Related Components

- **Error Message**: For individual field validation messages
- **Form Group**: For structuring form fields with validation
- **Character Count**: For input length validation
- **Field Validation**: For real-time form validation