# Public Good Design System &rarr; NHS UK &rarr; HTML CSS TypeScript

A modern, accessible UI component library converted from the NHS UK Design System, built with HTML, CSS, and TypeScript.

One of three variations:

- [NHS UK &rarr; HTML CSS Javascript](https://github.com/joelparkerhenderson/public-good-design-system-nhs-uk-html-css-typescript) (This one)
- [NHS UK &rarr; Next.js Tailwind DaisyUI](https://github.com/joelparkerhenderson/public-good-design-system-nhs-uk-next-tailwind-daisyui)
- [NHS UK &rarr; Svelte Tailwind DaisyUI](https://github.com/joelparkerhenderson/public-good-design-system-nhs-uk-svelte-tailwind-daisyui)

## Features

- **36 Components** - Complete set of production-ready UI components
- **Accessibility First** - WCAG AA compliant with keyboard navigation and screen reader support
- **TypeScript** - Full type safety with strict mode
- **Framework Agnostic** - Works with any framework or vanilla JS
- **Internationalization** - Multi-language support (8 locales including RTL)
- **Design Tokens** - CSS custom properties for colors, typography, spacing, breakpoints
- **Comprehensive Testing** - Unit tests (Vitest) and E2E tests (Playwright)
- **Modern Build** - Vite library mode, ES modules, tree-shakeable

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
git clone <repository-url>
cd public-good-design-system-nhs-uk-html-css-typescript
pnpm install
```

### Development

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Type-check + production build
pnpm test             # Run unit tests
pnpm test:coverage    # Tests with coverage report
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm type-check       # TypeScript type-check
pnpm format           # Prettier format
```

## Components

### Form Elements

| Component       | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| Button          | Primary, secondary, warning, and reverse button variants       |
| Checkboxes      | Checkbox groups with conditional reveals and exclusive options |
| Character Count | Real-time character/word counting for textareas                |
| Date Input      | Accessible date input with day/month/year fields               |
| Error Message   | Inline error messages for form fields                          |
| Error Summary   | Summary of form errors with anchor links                       |
| Fieldset        | Groups related form fields with legend                         |
| Hint            | Help text for form fields                                      |
| Input           | Text input with various types and validation                   |
| Label           | Form field labels with page heading support                    |
| Radios          | Radio button groups with conditional reveals                   |
| Select          | Dropdown select with search and custom rendering               |
| Textarea        | Multi-line text input with auto-resize                         |

### Navigation

| Component     | Description                                  |
| ------------- | -------------------------------------------- |
| Action Link   | Styled links with arrow icons                |
| Back Link     | Back navigation link                         |
| Breadcrumb    | Breadcrumb trail navigation                  |
| Contents List | Page contents navigation list                |
| Footer        | Page footer with navigation sections         |
| Header        | Page header with logo and navigation         |
| Pagination    | Page navigation with previous/next           |
| Skip Link     | Skip to main content link for keyboard users |

### Content Display

| Component           | Description                                        |
| ------------------- | -------------------------------------------------- |
| Card                | Content cards with image, heading, and description |
| Details             | Expandable content sections                        |
| Do/Don't List       | Lists of recommended and discouraged practices     |
| Hero                | Hero banner with heading, text, and image          |
| Image               | Responsive images with captions                    |
| Inset Text          | Indented content for quotes and callouts           |
| Notification Banner | Dismissible notification messages                  |
| Panel               | Confirmation panels for transaction completion     |
| Review Date         | Content review date display                        |
| Summary List        | Key-value pair display for form summaries          |
| Table               | Data tables with sorting and responsive layout     |
| Tabs                | Tabbed content navigation                          |
| Tag                 | Status indicator tags                              |
| Task List           | Progress tracking task lists                       |
| Warning Callout     | Important warning messages                         |

## Usage

### Importing Components

```typescript
import {
  createButton,
  createCard,
  createTabs,
  initialize,
} from 'public-good-design-system-with-html-css-typescript'

// Initialize global event listeners
initialize()

// Create a button
const button = createButton({
  text: 'Submit',
  variant: 'primary',
  onClick: event => console.log('Clicked!'),
})
document.body.appendChild(button)
```

### Importing Styles

```css
@import 'public-good-design-system-with-html-css-typescript/styles';
```

### Design Tokens

The design system uses CSS custom properties for theming:

```css
/* Colors */
--public-good-color-primary: #005eb8;
--public-good-color-white: #ffffff;
--public-good-color-black: #212b32;

/* Typography */
--public-good-font-family: 'Frutiger W01', Arial, sans-serif;
--public-good-font-size-base: 1rem;

/* Spacing */
--public-good-spacing-1: 0.25rem;
--public-good-spacing-4: 1rem;
--public-good-spacing-8: 2rem;
```

## Architecture

### Component Structure

Each component follows a consistent pattern:

```
src/components/{component-name}/
  {component-name}.ts        # TypeScript implementation
  {component-name}.css       # Component styles
  {component-name}.test.ts   # Unit tests
```

Components typically provide:

- **TypeScript interfaces** for configuration
- **Factory function** (`createComponent(config)`) that returns an HTMLElement
- **Class** for stateful components with programmatic control
- **Init function** (`initializeComponents(scope)`) for auto-initialization from DOM markup

### CSS Naming

- Class prefix: `public-good-`
- BEM convention: `public-good-{block}__{element}--{modifier}`
- JS hooks: `public-good-js-{name}`
- Design tokens: `--public-good-{category}-{name}`

### Event System

Components emit custom events for integration:

```typescript
element.addEventListener('public-good:tabs:changed', event => {
  const { activeIndex, activeTab } = event.detail
})
```

## Internationalization

Supported locales: English (en), Welsh (cy), Irish (ga), Scottish Gaelic (gd), French (fr), German (de), Spanish (es), Arabic (ar, RTL).

```typescript
import {
  setLocale,
  t,
} from 'public-good-design-system-with-html-css-typescript'

setLocale('cy')
console.log(t('navigation.back')) // "Yn ol"
```

## Accessibility

All components are built with accessibility in mind:

- WCAG AA compliance
- Keyboard navigation support
- Screen reader compatibility (ARIA attributes)
- Focus management
- High contrast mode support
- Reduced motion support
- RTL layout support

## Testing

### Unit Tests (Vitest)

```bash
pnpm test              # Run once
pnpm test:ui           # Interactive UI dashboard
pnpm test:coverage     # With coverage report (80% threshold)
```

### E2E Tests (Playwright)

```bash
pnpm test:e2e          # Run all browsers
pnpm test:e2e:ui       # Interactive UI mode
```

Browsers tested: Chromium, Firefox, WebKit, Pixel 5 (mobile), iPhone 12 (mobile).

## Design Principles

Converted from the NHS UK Design System, maintaining core principles:

- **Accessible** - WCAG AA standards
- **Cohesive** - Consistent design patterns
- **Open** - Built for reuse and contribution
- **Useful** - Solving real user needs

## License

MIT License
