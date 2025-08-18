# Warning Callout Component

Use warning callouts to help users identify and understand important warning content on the page, even if they do not read the whole page.

## Features

- **Critical information highlighting** - Draws attention to time-sensitive or important warnings
- **Multiple variants** - Default, compact, critical, and subtle styling options
- **Accessibility compliant** - WCAG 2.2 compliant with proper ARIA attributes and screen reader support
- **Flexible heading levels** - Support for H1-H6 headings with proper hierarchy
- **Interactive functionality** - Optional interaction tracking and screen reader announcements
- **Responsive design** - Mobile-friendly with adaptive layouts
- **Multi-language support** - RTL text direction and customizable hidden prefixes
- **Form integration** - Seamless integration with form validation and user flows
- **TypeScript support** - Full type definitions included

## Basic Usage

### HTML

```html
<!-- Basic warning callout -->
<div class="public-good-warning-callout">
  <h3 class="public-good-warning-callout__label">
    <span role="text">
      <span class="public-good-warning-callout-sr-only">Important: </span>
      School, nursery or work
    </span>
  </h3>
  <p>Stay away from school, nursery or work until all the spots have crusted over.</p>
</div>
```

### TypeScript/JavaScript

```typescript
import { WarningCallout, createWarningCallout } from './warning-callout';

// Create warning callout from configuration
const warningElement = createWarningCallout({
  heading: 'System maintenance',
  content: 'Our services will be temporarily unavailable from 2:00 AM to 6:00 AM.',
  headingLevel: 3
});

// Create interactive warning callout instance
const container = document.getElementById('warning-container');
const instance = new WarningCallout(container, {
  trackInteractions: true,
  announceToScreenReader: true,
  onInteraction: (type, element) => {
    console.log(`Warning interaction: ${type}`);
  }
});
```

## Warning Callout with Content Structure

```html
<div class="public-good-warning-callout">
  <h3 class="public-good-warning-callout__label">
    <span role="text">
      <span class="public-good-warning-callout-sr-only">Important: </span>
      If you have symptoms
    </span>
  </h3>
  <div class="public-good-warning-callout__content">
    <p>Contact your GP or call 111 if you experience any symptoms:</p>
    <ul>
      <li>High fever (over 38°C)</li>
      <li>Difficulty breathing</li>
      <li>Severe headache</li>
    </ul>
    <p>Do not wait if symptoms worsen.</p>
  </div>
</div>
```

## Variants

### Compact Variant

```html
<div class="public-good-warning-callout public-good-warning-callout--compact">
  <h4 class="public-good-warning-callout__label">
    <span role="text">
      <span class="public-good-warning-callout-sr-only">Important: </span>
      Limited time offer
    </span>
  </h4>
  <p>This compact callout takes up less space.</p>
</div>
```

### Critical Variant

```html
<div class="public-good-warning-callout public-good-warning-callout--critical">
  <h3 class="public-good-warning-callout__label">
    <span role="text">
      <span class="public-good-warning-callout-sr-only">Critical: </span>
      Urgent action required
    </span>
  </h3>
  <p>This critical variant provides enhanced visual prominence for urgent warnings.</p>
</div>
```

### Subtle Variant

```html
<div class="public-good-warning-callout public-good-warning-callout--subtle">
  <h4 class="public-good-warning-callout__label">
    <span role="text">
      <span class="public-good-warning-callout-sr-only">Note: </span>
      Please note
    </span>
  </h4>
  <p>This subtle variant is less prominent but still clearly indicates important information.</p>
</div>
```

## Different Heading Levels

```html
<!-- H2 heading for major warnings -->
<div class="public-good-warning-callout">
  <h2 class="public-good-warning-callout__label">
    <span role="text">
      <span class="public-good-warning-callout-sr-only">Important: </span>
      Service disruption
    </span>
  </h2>
  <p>Major service disruption expected.</p>
</div>

<!-- H4 heading for minor warnings -->
<div class="public-good-warning-callout">
  <h4 class="public-good-warning-callout__label">
    <span role="text">
      <span class="public-good-warning-callout-sr-only">Note: </span>
      Browser compatibility
    </span>
  </h4>
  <p>For best experience, use a modern browser.</p>
</div>
```

## API Reference

### WarningCallout Class

#### Constructor

```typescript
new WarningCallout(element: HTMLElement, config?: WarningCalloutConfig)
```

#### Methods

##### `setHeading(heading: string, hiddenPrefix?: string): void`
Updates the heading content and optional hidden prefix.

##### `setContent(content: string, isHTML?: boolean): void`
Updates the content. Set `isHTML` to `true` to insert HTML content.

##### `show(): void`
Shows the warning callout and announces to screen readers if configured.

##### `hide(): void`
Hides the warning callout.

##### `isVisible(): boolean`
Returns whether the callout is currently visible.

##### `validate(): string[]`
Validates the warning callout structure and returns any issues found.

##### `getHeading(): HTMLElement | null`
Returns the heading element.

##### `getContent(): HTMLElement | null`
Returns the content element.

##### `getElement(): HTMLElement`
Returns the container element.

##### `destroy(): void`
Destroys the instance and cleans up event listeners.

### Functions

#### `createWarningCallout(options: WarningCalloutOptions): HTMLElement`

Creates a warning callout element with the specified options.

**Parameters:**
- `options.heading` - Heading text
- `options.headingLevel` - Heading level (1-6, defaults to 3)
- `options.content` - Plain text content
- `options.html` - HTML content (alternative to content)
- `options.id` - Unique identifier
- `options.classes` - Additional CSS classes
- `options.attributes` - Custom HTML attributes
- `options.hiddenPrefix` - Screen reader prefix (defaults to "Important: ")

#### `initializeWarningCallouts(scope?: Document | HTMLElement): WarningCallout[]`

Initializes warning callouts from existing markup with `data-module="public-good-warning-callout"`.

**Data Attributes:**
- `data-track-interactions="true"` - Enable interaction tracking
- `data-announce-to-screen-reader="true"` - Enable screen reader announcements

#### `validateWarningCalloutAccessibility(scope?: Document | HTMLElement): ValidationResult`

Validates warning callout accessibility and returns any issues found.

### Types

```typescript
interface WarningCalloutOptions {
  id?: string;
  heading?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  content?: string;
  html?: string;
  classes?: string;
  attributes?: Record<string, string>;
  hiddenPrefix?: string;
  role?: string;
}

interface WarningCalloutConfig {
  trackInteractions?: boolean;
  onInteraction?: (type: string, element: HTMLElement) => void;
  customValidation?: (element: HTMLElement) => string[];
  announceToScreenReader?: boolean;
}
```

## Events

The WarningCallout class emits custom events:

### `warning-callout:initialized`
Fired when the warning callout is initialized.

### `warning-callout:interaction`
Fired when user interacts with the callout (if tracking is enabled).
```typescript
element.addEventListener('warning-callout:interaction', (event) => {
  console.log(event.detail); // { type, element, warningCallout }
});
```

### `warning-callout:heading-changed`
Fired when the heading content is updated.

### `warning-callout:content-changed`
Fired when the content is updated.

### `warning-callout:shown`
Fired when the callout is shown.

### `warning-callout:hidden`
Fired when the callout is hidden.

## Advanced Features

### Interaction Tracking

```typescript
const warningCallout = new WarningCallout(container, {
  trackInteractions: true,
  onInteraction: (type, element) => {
    // Track user interactions
    console.log(`User ${type}ed the warning callout`);
    
    // Send analytics
    analytics.track('warning_callout_interaction', {
      type,
      heading: element.querySelector('.public-good-warning-callout__label')?.textContent
    });
  }
});
```

### Screen Reader Announcements

```typescript
const warningCallout = new WarningCallout(container, {
  announceToScreenReader: true
});

// Manually trigger announcement
warningCallout.show(); // Will announce the warning content
```

### Dynamic Content Updates

```typescript
const warningCallout = new WarningCallout(container);

// Update heading
warningCallout.setHeading('System Alert', 'Urgent: ');

// Update content
warningCallout.setContent('New warning information has been posted.');

// Update with HTML content
warningCallout.setContent('<strong>Critical:</strong> Immediate action required.', true);
```

### Custom Validation

```typescript
const warningCallout = new WarningCallout(container, {
  customValidation: (element) => {
    const issues = [];
    
    // Custom validation logic
    if (element.textContent.length > 200) {
      issues.push('Warning callout content is too long');
    }
    
    return issues;
  }
});

const validationIssues = warningCallout.validate();
console.log('Validation issues:', validationIssues);
```

## Usage Guidelines

### When to Use ✅

- Information that is time critical
- Content that could significantly impact the user's health, wellbeing, or safety
- To address common misconceptions or mistakes
- When users might miss important information in body text
- To highlight exceptions to general rules
- For legal or compliance warnings

### Best Practices ✅

- Give the callout a short, clearly worded heading
- Make the callout concise, specific and self-contained
- Avoid having more than 2 callouts on a page
- Use appropriate heading levels that fit the page hierarchy
- Always include the visually hidden prefix for screen readers
- Use `role="text"` to ensure screen readers read the heading as one unit
- Choose the appropriate variant based on urgency
- Test with real users to ensure effectiveness

### When Not to Use ❌

- On transactional pages (forms, checkout flows) - can disrupt user flow
- For general information that isn't critical or time-sensitive
- To replace proper page structure or clear content organization
- For promotional content or calls to action
- When the information can be better integrated into main content
- For error messages in forms (use field-level error messages instead)

### Don't ❌

- Introduce a callout with "If this happens..." - explain the circumstances clearly
- Use more than 2 warning callouts on a single page
- Rely on color alone to convey the warning
- Use vague or unclear headings
- Forget the visually hidden prefix for screen readers
- Use warning callouts as a substitute for clear, well-structured content
- Overuse callouts - they lose effectiveness when used too frequently

## Accessibility

- Uses semantic HTML with proper heading structure
- Provides clear labeling with visually hidden prefixes for screen readers
- Includes `role="text"` to ensure headings are read as complete units
- Supports keyboard navigation and focus management
- Works with screen readers and assistive technologies
- Maintains high contrast ratios (11.92:1 for headings, 13.69:1 for content)
- Supports reduced motion preferences
- Meets WCAG 2.2 AA standards
- Provides live region announcements when configured
- Supports RTL (right-to-left) text direction

## Multi-language Support

```typescript
// Example with Arabic text
const arabicWarning = createWarningCallout({
  heading: 'صيانة الخدمة',
  content: 'ستكون خدماتنا غير متاحة مؤقتاً للصيانة المجدولة.',
  hiddenPrefix: 'مهم: ',
  attributes: { dir: 'rtl' }
});
```

## Form Integration

```typescript
// Warning callout in form context
const formWarning = createWarningCallout({
  heading: 'Security Notice',
  content: 'Ensure you are on a secure connection when entering sensitive information.',
  classes: 'public-good-warning-callout--subtle'
});

// Insert before form
document.getElementById('sensitive-form').parentNode.insertBefore(formWarning, sensitiveForm);
```

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

Run tests with: `npm test warning-callout`

The component includes comprehensive tests covering:
- Component creation and configuration
- Content management and updates
- Visibility and state management
- Interaction tracking
- Screen reader announcements
- Accessibility validation
- Event handling
- Multi-language support