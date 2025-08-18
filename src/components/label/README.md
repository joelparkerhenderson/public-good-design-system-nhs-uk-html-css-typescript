# Label Component

The Label component provides accessible labels for form controls with support for different sizes, page headings, and programmatic control. It's essential for form accessibility, ensuring that all form controls have proper semantic labels that are properly associated using the `for` attribute.

## Features

- **Flexible content**: Support for both plain text and rich HTML content
- **Multiple sizes**: From extra small to extra large for different contexts
- **Page heading support**: Labels that can serve as page headings for single-question forms
- **Form association**: Automatic and manual association with form controls
- **Accessibility validation**: Built-in validation of label-control relationships
- **Programmatic control**: Dynamic content updates and state management
- **Required/optional indicators**: Visual indicators for field requirements

## Usage

### Basic Label

```typescript
import { createLabel } from './label';

const label = createLabel({
  text: 'Email address',
  for: 'email-input'
});

document.body.appendChild(label);
```

### Label with HTML Content

```typescript
const htmlLabel = createLabel({
  html: 'I agree to the <a href="#terms">terms and conditions</a> <strong>(required)</strong>',
  for: 'terms-checkbox'
});
```

### Page Heading Label

```typescript
const headingLabel = createLabel({
  text: 'What is your NHS number?',
  for: 'nhs-number',
  isPageHeading: true,
  classes: 'public-good-label--xl'
});
```

### Programmatic Label Management

```typescript
import { Label } from './label';

const labelElement = createLabel({
  text: 'Initial label',
  for: 'my-input'
});

const instance = new Label(labelElement);

// Update content
instance.updateText('Updated label text');
instance.updateHtml('<strong>Updated</strong> label');

// Manage size
instance.setSize('l');
instance.setSize(null); // Remove size

// Control association
instance.setFor('other-input');
instance.removeFor();

// Focus management
instance.focusControl(); // Focus associated form control

// State management
instance.hide();
instance.show();
console.log(instance.isVisible()); // true
```

### Automatic Form Association

```typescript
import { createAndAssociateLabel } from './label';

const input = document.createElement('input');
input.type = 'text';

// Creates label and automatically associates it
const label = createAndAssociateLabel('Username', input);

// Input now has an ID and label is associated
console.log(input.id); // Auto-generated ID
console.log(label.getAttribute('for')); // Same as input.id
```

## Configuration Options

### LabelOptions

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `text` | `string` | Plain text content for the label | Yes (or html) |
| `html` | `string` | HTML content for the label (overrides text) | Yes (or text) |
| `for` | `string` | ID of the associated form control | No |
| `isPageHeading` | `boolean` | Whether label serves as page heading | No |
| `classes` | `string` | Additional CSS classes | No |
| `attributes` | `Record<string, string>` | Additional HTML attributes | No |

## HTML Structure

### Basic Label

```html
<label class="public-good-label" for="email-input">
  Email address
</label>
<input class="public-good-input" id="email-input" type="email">
```

### Page Heading Label

```html
<h1 class="public-good-label-wrapper">
  <label class="public-good-label public-good-label--xl" for="main-question">
    What is your NHS number?
  </label>
</h1>
<input class="public-good-input" id="main-question" type="text">
```

### Label with Size Modifier

```html
<label class="public-good-label public-good-label--l" for="important-field">
  Important Information
</label>
<textarea class="public-good-textarea" id="important-field"></textarea>
```

## CSS Classes

### Base Classes

- `.public-good-label` - Base label styling
- `.public-good-label-wrapper` - Wrapper for page heading labels

### Size Modifiers

- `.public-good-label--xs` - Extra small label
- `.public-good-label--s` - Small label (bold)
- `.public-good-label--m` - Medium label (like h3)
- `.public-good-label--l` - Large label (like h2)
- `.public-good-label--xl` - Extra large label (like h1)

### State Classes

- `.public-good-label--required` - Adds asterisk for required fields
- `.public-good-label--optional` - Adds "(optional)" text
- `.public-good-label--disabled` - Disabled state styling
- `.public-good-label--inline` - Inline label (rare use case)

## JavaScript API

### Label Class

```typescript
// Constructor
const instance = new Label(element: HTMLElement, config?: LabelConfig)

// Content management
instance.updateText(text: string): void
instance.updateHtml(html: string): void
instance.getText(): string
instance.getHtml(): string

// Form association
instance.getFor(): string | null
instance.setFor(controlId: string): void
instance.removeFor(): void
instance.getAssociatedControl(): HTMLElement | null
instance.focusControl(): boolean

// Size management
instance.setSize(size: 'xs' | 's' | 'm' | 'l' | 'xl' | null): void
instance.getSize(): string | null

// State management
instance.addClass(className: string): void
instance.removeClass(className: string): void
instance.hasClass(className: string): boolean
instance.show(): void
instance.hide(): void
instance.isVisible(): boolean

// Element access
instance.getLabelElement(): HTMLLabelElement
instance.getWrapperElement(): HTMLElement
instance.isPageHeading(): boolean

// Cleanup
instance.destroy(): void
```

### Helper Functions

```typescript
// Create simple text label
const textLabel = createTextLabel(
  text: string,
  forAttribute?: string,
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
): HTMLElement

// Create HTML label
const htmlLabel = createHtmlLabel(
  html: string,
  forAttribute?: string,
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
): HTMLElement

// Create page heading label
const headingLabel = createPageHeadingLabel(
  text: string,
  forAttribute?: string,
  size?: 'l' | 'xl'
): HTMLElement

// Associate existing elements
associateLabelWithControl(
  labelElement: HTMLElement,
  controlElement: HTMLElement,
  controlId?: string
): void

// Create and associate in one step
const associatedLabel = createAndAssociateLabel(
  text: string,
  controlElement: HTMLElement,
  options?: LabelOptions
): HTMLElement

// Find associated labels
const labels = getAssociatedLabels(
  controlElement: HTMLElement
): HTMLLabelElement[]

// Validate associations
const validation = validateLabelAssociation(
  controlElement: HTMLElement
): ValidationResult

// Initialize from data attributes
const instances = initializeLabels(
  scope?: Document | HTMLElement
): Label[]
```

## Accessibility Features

### Semantic Association

```html
<!-- Explicit association with for/id -->
<label for="username">Username</label>
<input id="username" type="text">

<!-- Implicit association (nested) -->
<label>
  Password
  <input type="password">
</label>
```

### Validation and Debugging

```typescript
// Validate form accessibility
const form = document.getElementById('my-form');
const controls = form.querySelectorAll('input, select, textarea');

controls.forEach(control => {
  const validation = validateLabelAssociation(control);
  
  if (!validation.hasLabel) {
    console.warn(`Control ${control.id} has no label`);
  }
  
  if (validation.warnings.length > 0) {
    console.warn(`Issues with ${control.id}:`, validation.warnings);
  }
});
```

### Screen Reader Support

- **Proper semantic markup**: Uses `<label>` elements for native screen reader support
- **Form association**: Ensures all controls are properly labeled
- **Content announcements**: Changes to label content are announced appropriately
- **Focus management**: Provides methods to focus associated controls

## Form Integration Patterns

### Registration Form

```html
<form class="registration-form">
  <div class="public-good-form-group">
    <label class="public-good-label public-good-label--required" for="reg-email">
      Email address
    </label>
    <input class="public-good-input" id="reg-email" type="email" required>
  </div>

  <div class="public-good-form-group">
    <label class="public-good-label public-good-label--optional" for="reg-phone">
      Phone number
    </label>
    <input class="public-good-input" id="reg-phone" type="tel">
  </div>

  <fieldset class="public-good-fieldset">
    <legend class="public-good-label public-good-label--m">
      Communication preferences
    </legend>
    <div class="checkbox-option">
      <input class="public-good-checkbox" id="email-updates" type="checkbox">
      <label class="public-good-label" for="email-updates">Email updates</label>
    </div>
  </fieldset>
</form>
```

### Dynamic Form Building

```typescript
class FormBuilder {
  private container: HTMLElement;
  private fieldCount = 0;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  addField(type: string, labelText: string, required = false): void {
    this.fieldCount++;
    const fieldId = `field-${this.fieldCount}`;

    // Create form group
    const formGroup = document.createElement('div');
    formGroup.className = 'public-good-form-group';

    // Create and associate label
    const input = document.createElement('input');
    input.type = type;
    input.id = fieldId;
    input.name = fieldId;
    input.className = 'public-good-input';
    
    if (required) {
      input.required = true;
    }

    const labelClasses = required ? 'public-good-label--required' : '';
    const label = createAndAssociateLabel(labelText, input, {
      classes: labelClasses
    });

    // Add to form
    formGroup.appendChild(label);
    formGroup.appendChild(input);
    this.container.appendChild(formGroup);
  }
}

// Usage
const builder = new FormBuilder(document.getElementById('dynamic-form'));
builder.addField('text', 'First Name', true);
builder.addField('email', 'Email Address', true);
builder.addField('tel', 'Phone Number', false);
```

### Conditional Labels

```typescript
class ConditionalLabelManager {
  private labels = new Map<string, Label>();

  constructor() {
    this.setupAccountTypeHandler();
  }

  private setupAccountTypeHandler(): void {
    const accountType = document.getElementById('account-type');
    const entityLabel = this.labels.get('entity') || 
                       new Label(document.getElementById('entity-label'));
    const idLabel = this.labels.get('id') || 
                   new Label(document.getElementById('id-label'));

    accountType.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      
      switch (value) {
        case 'personal':
          entityLabel.updateText('Full Name');
          idLabel.updateText('National Insurance Number');
          break;
        case 'business':
          entityLabel.updateText('Company Name');
          idLabel.updateText('Company Registration Number');
          break;
        case 'organization':
          entityLabel.updateText('Organization Name');
          idLabel.updateText('Charity Number');
          break;
      }
    });
  }
}
```

## Styling Customization

### CSS Custom Properties

```css
:root {
  --public-good-color-text: #212b32;
  --public-good-color-text-secondary: #666666;
  --public-good-color-text-disabled: #999999;
  --public-good-color-error: #d5281b;
  --public-good-spacing-1: 8px;
  --public-good-spacing-2: 12px;
  --public-good-spacing-3: 16px;
}
```

### Custom Label Styles

```css
.custom-label-theme {
  --public-good-color-text: #2c5282;
}

.custom-label-theme .public-good-label {
  font-family: 'Custom Font', sans-serif;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.custom-label-theme .public-good-label:hover {
  border-bottom-color: var(--public-good-color-text);
}

.priority-label {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
}
```

## Examples

### Multi-Step Form with Dynamic Labels

```typescript
class MultiStepForm {
  private currentStep = 1;
  private totalSteps = 3;
  private pageHeading: Label;

  constructor() {
    const headingElement = document.getElementById('step-heading');
    this.pageHeading = new Label(headingElement);
    this.updateStepHeading();
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStepHeading();
      this.showStep(this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepHeading();
      this.showStep(this.currentStep);
    }
  }

  private updateStepHeading(): void {
    const headings = [
      'Personal Information',
      'Contact Details', 
      'Review and Submit'
    ];
    
    this.pageHeading.updateText(
      `Step ${this.currentStep} of ${this.totalSteps}: ${headings[this.currentStep - 1]}`
    );
  }

  private showStep(step: number): void {
    document.querySelectorAll('.form-step').forEach((el, index) => {
      el.classList.toggle('hidden', index + 1 !== step);
    });
  }
}
```

### Smart Form Validation with Label Updates

```typescript
class SmartFormValidator {
  private labels = new Map<string, Label>();

  constructor(form: HTMLFormElement) {
    this.initializeLabels(form);
    this.setupValidation(form);
  }

  private initializeLabels(form: HTMLFormElement): void {
    const labels = form.querySelectorAll('label');
    labels.forEach(label => {
      const forId = label.getAttribute('for');
      if (forId) {
        this.labels.set(forId, new Label(label));
      }
    });
  }

  private setupValidation(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input as HTMLElement));
      input.addEventListener('input', () => this.updateFieldStatus(input as HTMLElement));
    });
  }

  private validateField(field: HTMLElement): void {
    const label = this.labels.get(field.id);
    if (!label) return;

    const isValid = this.isFieldValid(field);
    const originalText = label.getText().replace(/ ✓| ❌/, '');
    
    if (isValid) {
      label.updateText(`${originalText} ✓`);
      label.removeClass('public-good-label--error');
      label.addClass('public-good-label--success');
    } else {
      label.updateText(`${originalText} ❌`);
      label.removeClass('public-good-label--success');
      label.addClass('public-good-label--error');
    }
  }

  private updateFieldStatus(field: HTMLElement): void {
    const label = this.labels.get(field.id);
    if (!label) return;

    // Show character count or other real-time feedback
    if (field instanceof HTMLTextAreaElement && field.maxLength) {
      const remaining = field.maxLength - field.value.length;
      const originalText = label.getText().split(' (')[0];
      label.updateText(`${originalText} (${remaining} characters remaining)`);
    }
  }

  private isFieldValid(field: HTMLElement): boolean {
    return (field as HTMLInputElement).checkValidity();
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
- **Enhanced API**: Additional methods for programmatic control and validation
- **Modern CSS**: Uses CSS custom properties instead of Sass variables
- **TypeScript**: Full TypeScript implementation with strict types
- **Accessibility helpers**: Built-in validation and association management

### Migration Steps

1. Update class names: `nhsuk-label` → `public-good-label`
2. Update size classes: `nhsuk-label--xl` → `public-good-label--xl`
3. Update wrapper class: `nhsuk-label-wrapper` → `public-good-label-wrapper`
4. Update JavaScript imports if using programmatic functionality
5. Replace NHS UK specific styling with Public Good design tokens

## Testing

The component includes comprehensive tests covering:

- Component creation with various configurations
- Programmatic content and size management
- Form association and validation helpers
- Accessibility compliance and ARIA support
- Edge cases and error handling
- Helper functions and utilities

Run tests with: `npm test label`

## Related Components

- **Hint**: For additional guidance text alongside labels
- **Error Message**: For validation error messages
- **Fieldset**: For grouping related form controls with legends
- **Form Group**: For structuring complete form fields
- **Input**: For the form controls that labels describe