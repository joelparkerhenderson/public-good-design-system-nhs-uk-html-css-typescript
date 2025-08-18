# Card Component

A versatile card component for grouping related content with multiple variants including care cards, primary cards, secondary cards, and feature cards.

## Features

- **Multiple Variants**: Primary, secondary, feature, top task, and care cards
- **Care Card Types**: Non-urgent, urgent, and emergency care cards with appropriate styling
- **Clickable Cards**: Full card click areas with keyboard navigation support
- **Rich Content**: Support for text, HTML, images, and custom content
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Accessibility**: WCAG 2.1 AA compliant with proper semantics and screen reader support
- **Analytics Ready**: Built-in event tracking for user interactions
- **Card Groups**: Utilities for creating consistent card layouts

## Usage

### Basic Implementation

```typescript
import { createCard } from '@/components/card/card'

const card = createCard({
  heading: 'Help from NHS 111',
  description: 'If you\'re worried about a symptom and not sure what help you need, NHS 111 can tell you what to do next.'
})

document.body.appendChild(card.element)
```

### HTML Data Attributes

```html
<div data-public-good-card 
     data-heading="Help from NHS 111" 
     data-description="If you're worried about a symptom...">
</div>
```

### Clickable Cards

```typescript
const clickableCard = createCard({
  heading: 'Introduction to care and support',
  description: 'A quick guide for people who have care and support needs',
  clickable: true,
  href: '/care-support'
})
```

## Configuration Options

### CardConfig Interface

```typescript
interface CardConfig {
  heading?: string                    // Card heading text
  headingHtml?: string               // HTML content for heading (takes precedence)
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6  // HTML heading level (default: 2)
  headingClasses?: string            // Additional CSS classes for heading
  href?: string                      // URL for clickable cards
  clickable?: boolean               // Make entire card clickable
  type?: 'non-urgent' | 'urgent' | 'emergency'  // Care card type
  feature?: boolean                 // Feature card variant
  primary?: boolean                 // Primary card with chevron
  secondary?: boolean               // Secondary card variant
  topTask?: boolean                 // Top task card variant
  imgURL?: string                   // Image URL
  imgALT?: string                   // Image alt text
  description?: string              // Description text
  descriptionHtml?: string          // HTML description (takes precedence)
  content?: string                  // Raw HTML content
  classes?: string                  // Additional CSS classes
  attributes?: Record<string, string>  // Custom HTML attributes
  onClick?: (event: Event) => void     // Click event handler
}
```

## Card Variants

### Basic Card

```typescript
const basicCard = createCard({
  heading: 'Basic Card',
  description: 'A simple card with heading and description'
})
```

### Primary Card (with Chevron)

Primary cards are used for important navigation items and include a chevron icon.

```typescript
const primaryCard = createCard({
  heading: 'Breast screening',
  primary: true,
  clickable: true,
  href: '/breast-screening'
})
```

### Secondary Card

Secondary cards have minimal styling and are used for less prominent content.

```typescript
const secondaryCard = createCard({
  heading: 'Urgent and emergency care services',
  description: 'Services the NHS provides if you need urgent help',
  secondary: true,
  clickable: true,
  href: '/emergency-care'
})
```

### Feature Card

Feature cards have a highlighted header and are used to promote important content.

```typescript
const featureCard = createCard({
  heading: 'Feature card heading',
  description: 'Feature card description',
  feature: true,
  href: '/feature'
})
```

### Top Task Card

Small, compact cards for popular services (maximum 3 per page recommended).

```typescript
const topTaskCard = createCard({
  heading: 'Order a repeat prescription',
  topTask: true,
  clickable: true,
  href: '/prescription',
  headingLevel: 5
})
```

### Care Cards

Specialized cards for medical advice with different urgency levels.

#### Non-urgent (Blue)

```typescript
const nonUrgentCard = createCard({
  heading: 'Speak to a GP if:',
  type: 'non-urgent',
  content: `
    <ul>
      <li>you're not sure it's chickenpox</li>
      <li>the skin around the blisters is red, hot or painful</li>
    </ul>
  `
})
```

#### Urgent (Red)

```typescript
const urgentCard = createCard({
  heading: 'Ask for an urgent GP appointment if:',
  type: 'urgent',
  content: `
    <ul>
      <li>you're an adult and have chickenpox</li>
      <li>you're pregnant and haven't had chickenpox before</li>
    </ul>
  `
})
```

#### Emergency (Red and Black)

```typescript
const emergencyCard = createCard({
  heading: 'Call 999 if you have sudden chest pain that:',
  type: 'emergency',
  content: `
    <ul>
      <li>spreads to your arms, back, neck or jaw</li>
      <li>makes your chest feel tight or heavy</li>
    </ul>
  `
})
```

## Helper Functions

### Pre-configured Card Types

```typescript
import { 
  createCareCard, 
  createPrimaryCard, 
  createSecondaryCard, 
  createFeatureCard,
  createTopTaskCard 
} from '@/components/card/card'

// Care card with type
const careCard = createCareCard('urgent', { 
  heading: 'Ask for an urgent GP appointment if:' 
})

// Primary card (automatically clickable)
const primaryCard = createPrimaryCard({ 
  heading: 'Mental health support',
  href: '/mental-health'
})

// Secondary card
const secondaryCard = createSecondaryCard({ 
  heading: 'Health A-Z',
  description: 'Health information and advice'
})

// Feature card
const featureCard = createFeatureCard({ 
  heading: 'COVID-19 information',
  description: 'Latest guidance and advice'
})

// Top task card (uses h5 by default)
const topTaskCard = createTopTaskCard({ 
  heading: 'Book appointment'
})
```

### Card Groups

```typescript
import { createCardGroup } from '@/components/card/card'

const card1 = createCard({ heading: 'Card 1', description: 'First card' })
const card2 = createCard({ heading: 'Card 2', description: 'Second card' })
const card3 = createCard({ heading: 'Card 3', description: 'Third card' })

const cardGroup = createCardGroup([card1, card2, card3], 'custom-group-class')
document.body.appendChild(cardGroup)
```

## State Management

### Making Cards Clickable

```typescript
const card = createCard({ heading: 'Toggle Card', href: '/example' })

// Make clickable
card.setClickable(true)  // Adds click behavior, focus, and role

// Remove clickable behavior
card.setClickable(false)
```

### Updating Content

```typescript
const card = createCard({ heading: 'Dynamic Card', description: 'Original content' })

// Update with text
card.updateContent('New description text')

// Update with HTML
card.updateContent('<p>New <strong>HTML</strong> content</p>', true)
```

## Advanced Features

### Cards with Images

```typescript
const cardWithImage = createCard({
  heading: 'Exercise',
  description: 'Programmes and tips to get you moving',
  imgURL: '/images/exercise.jpg',
  imgALT: 'People exercising in a gym',
  clickable: true,
  href: '/exercise'
})
```

### Custom HTML Content

```typescript
const htmlCard = createCard({
  heading: 'Rich Content Card',
  content: `
    <p>This card contains <strong>rich HTML content</strong>.</p>
    <ul>
      <li>Unordered lists</li>
      <li>Links to <a href="/other-page">other pages</a></li>
      <li>Emphasis and <em>styling</em></li>
    </ul>
    <p>Perfect for complex card content.</p>
  `
})
```

### Custom Attributes and Classes

```typescript
const customCard = createCard({
  heading: 'Custom Card',
  description: 'Card with custom styling',
  classes: 'my-custom-class highlighted',
  attributes: {
    'data-analytics': 'homepage-card',
    'aria-describedby': 'card-help-text'
  }
})
```

## Layouts and Responsive Design

### CSS Grid Layouts

```css
.cards-grid {
  display: grid;
  gap: var(--public-good-spacing-5);
}

.cards-grid.two-columns {
  grid-template-columns: 1fr 1fr;
}

.cards-grid.three-columns {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .cards-grid.two-columns,
  .cards-grid.three-columns {
    grid-template-columns: 1fr;
  }
}
```

### Responsive Card Groups

The `createCardGroup` utility creates responsive card layouts that:

- Display horizontally on desktop
- Stack vertically on mobile
- Maintain consistent spacing
- Use flexbox for equal height cards

## Events and Analytics

The component emits custom events for analytics tracking:

```typescript
document.addEventListener('public-good:card:click', (event) => {
  console.log('Card interaction:', {
    heading: event.detail.heading,
    variant: event.detail.variant,  // 'default', 'primary', 'care-urgent', etc.
    type: event.detail.type,        // Care card type if applicable
    href: event.detail.href         // Destination URL
  })
})
```

### Event Data

- `heading`: Card heading text
- `variant`: Card variant (default, primary, secondary, feature, top-task, care-{type})
- `type`: Care card type (non-urgent, urgent, emergency) if applicable
- `href`: Destination URL for clickable cards

## Accessibility Features

### Semantic HTML

- Uses appropriate heading levels (`h2` by default)
- Proper `role="link"` for clickable cards
- Focusable elements with `tabindex="0"`

### Screen Reader Support

Care cards include hidden text for context:

```html
<!-- Non-urgent care card -->
<span role="text">
  <span class="public-good-sr-only">Non-urgent advice: </span>
  Speak to a GP if:
</span>
```

### Keyboard Navigation

- **Tab**: Navigate to clickable cards
- **Enter/Space**: Activate clickable cards
- **Focus**: Visible focus indicators

### Touch Targets

- Minimum 44px touch target size
- Full card click areas for better usability
- Appropriate spacing between interactive elements

## Styling and Theming

### CSS Custom Properties

```css
.public-good-card {
  --card-padding: var(--public-good-spacing-5);
  --card-border: var(--public-good-border-width-thin) solid var(--public-good-color-border);
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Care card colors */
.public-good-card--care--non-urgent {
  --care-color: var(--public-good-color-info);
  --care-border-width: 4px;
}

.public-good-card--care--urgent {
  --care-color: var(--public-good-color-warning);
  --care-border-width: 6px;
}

.public-good-card--care--emergency {
  --care-color: var(--public-good-color-error);
  --care-border-width: 8px;
}
```

### Visual Hierarchy

1. **Emergency cards**: Red header with black content area
2. **Urgent cards**: Red header, 6px left border
3. **Non-urgent cards**: Blue header, 4px left border
4. **Feature cards**: Blue highlighted header
5. **Primary cards**: Chevron icon, standard styling
6. **Secondary cards**: Minimal borders, transparent background

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Assistive Technology**: NVDA, JAWS, VoiceOver compatible

## Performance Considerations

- **Lightweight**: ~4KB gzipped (JS + CSS)
- **Tree Shakable**: Import only needed functions
- **Efficient Rendering**: Minimal DOM manipulation
- **Event Delegation**: Optimized event handling

## Migration from NHS UK Frontend

### Key Changes

1. **Namespace**: `nhsuk-` → `public-good-`
2. **Technology**: Nunjucks → TypeScript
3. **API**: Macro options → TypeScript config
4. **Events**: Added custom analytics events
5. **Variants**: Consistent naming and behavior

### Migration Example

**Before (NHS UK):**
```html
{{ nhsukCard({
  "heading": "Introduction to care and support",
  "clickable": true,
  "primary": true,
  "href": "/care-support"
}) }}
```

**After (Public Good):**
```typescript
import { createPrimaryCard } from '@/components/card/card'

const card = createPrimaryCard({
  heading: 'Introduction to care and support',
  href: '/care-support'
})
```

## Testing

The component includes comprehensive test coverage:

- **Unit Tests**: 50+ test cases covering all functionality
- **E2E Tests**: Cross-browser testing with Playwright
- **Accessibility Tests**: Automated a11y compliance testing
- **Visual Regression**: Screenshot comparison testing
- **Responsive Testing**: Multi-viewport verification

## Examples

See the `examples/` directory for complete implementations:

- **basic.html**: Standard card usage and content types
- **variants.html**: All card variants and care cards
- **groups.html**: Card groups and responsive layouts

## Related Components

- **[Action Link](../action-link/README.md)**: Link with arrow icon
- **[Button](../button/README.md)**: Interactive button component
- **[Breadcrumb](../breadcrumb/README.md)**: Navigation breadcrumbs