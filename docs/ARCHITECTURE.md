# Architecture

## Overview

The Public Good Design System is a framework-agnostic TypeScript component library that creates DOM elements directly. It follows the patterns of the NHS UK Design System while modernizing the build tooling and adding type safety.

## Directory Layout

```
src/
├── index.ts                    # Entry point: exports + auto-initialization
├── index.css                   # CSS entry: imports all styles
├── components/                 # 36 UI components
│   └── {name}/
│       ├── {name}.ts           # Component logic
│       ├── {name}.css          # Component styles
│       └── {name}.test.ts      # Unit tests
├── core/
│   ├── functions/
│   │   ├── dom-utils.ts        # DOM manipulation helpers
│   │   ├── i18n.ts             # Internationalization
│   │   └── validation.ts       # Form validation
│   ├── tokens/
│   │   ├── colors.css          # Color palette
│   │   ├── typography.css      # Font scales
│   │   ├── spacing.css         # Spacing scale
│   │   └── breakpoints.css     # Media queries
│   └── utilities/
│       ├── reset.css           # Browser reset
│       ├── layout.css          # Grid/flex utilities
│       └── accessibility.css   # SR-only, focus styles
tests/
├── e2e/                        # Playwright E2E tests
├── fixtures/                   # Test data
└── helpers/
    └── setup.ts                # JSDOM setup + mocks
```

## Component Architecture

### Pattern

Every component follows a predictable structure:

1. **Type Definitions** - TypeScript interfaces for all configuration
2. **Factory Function** - `create{Component}(config): HTMLElement` builds DOM
3. **Class (optional)** - For components needing state management
4. **Helper Functions** - Convenience wrappers for common use cases
5. **Initializer** - `initialize{Components}(scope)` for progressive enhancement

### Example: Button Component

```typescript
// Types
export interface ButtonConfig {
  text?: string
  variant?: ButtonVariant
  onClick?: (event: Event) => void
}

// Factory function
export function createButton(config: ButtonConfig): HTMLElement {
  const button = document.createElement('button')
  button.className = 'public-good-button'
  button.textContent = config.text ?? ''
  return button
}

// Initializer (for server-rendered HTML)
export function initializeButtons(scope = document): void {
  scope.querySelectorAll('[data-module="public-good-button"]')
    .forEach(el => new Button(el as HTMLElement))
}
```

### State Management

Stateful components (Tabs, CharacterCount, TaskList, etc.) use a class pattern:

```typescript
export class Tabs {
  private element: HTMLElement
  private config: TabsConfig
  private activeTabIndex = 0

  constructor(element: HTMLElement, config: TabsConfig = {}) {
    this.element = element
    this.config = { ...defaults, ...config }
    this.init()
  }

  activateTab(index: number): void { /* ... */ }
  destroy(): void { /* cleanup */ }
}
```

## CSS Architecture

### Design Tokens

All visual properties flow through CSS custom properties defined in `core/tokens/`:

```css
:root {
  --public-good-color-primary: #005eb8;
  --public-good-spacing-4: 1rem;
  --public-good-font-size-body: 1rem;
}
```

### Naming Convention

BEM-like with `public-good-` prefix:

```
.public-good-button                    /* Block */
.public-good-button__icon              /* Element */
.public-good-button--secondary         /* Modifier */
.public-good-js-character-count        /* JS hook (not for styling) */
```

### Responsive Design

Mobile-first with breakpoints in `core/tokens/breakpoints.css`:

```css
/* Small: 0-640px (default) */
/* Medium: 641-768px */
/* Large: 769-1024px */
/* XLarge: 1025px+ */
```

## Event System

Components communicate via CustomEvents on the `public-good:` namespace:

```typescript
element.dispatchEvent(new CustomEvent('public-good:tabs:changed', {
  bubbles: true,
  cancelable: true,
  detail: { activeIndex, previousIndex, activeTab }
}))
```

## Build Pipeline

1. **TypeScript** - `tsc --noEmit` type-checks without emitting
2. **Vite** - Bundles to ES module format with source maps
3. **Output** - Single `dist/index.js` + `dist/index.css`

Vite config uses library mode targeting ES modules:

```typescript
build: {
  lib: {
    entry: 'src/index.ts',
    formats: ['es'],
    fileName: 'index'
  }
}
```

## Testing Strategy

### Unit Tests (Vitest + JSDOM)

- Each component has co-located `*.test.ts` files
- Tests run in JSDOM environment for DOM APIs
- Coverage threshold: 80% minimum
- Mocks: `matchMedia`, `localStorage`, DOM cleanup

### E2E Tests (Playwright)

- Located in `tests/e2e/`
- Test across 3 desktop browsers + 2 mobile viewports
- Screenshots captured on failure
- Retries: 0 in development, 2 in CI

## Internationalization

The i18n system (`core/functions/i18n.ts`) provides:

- 8 supported locales with RTL support for Arabic
- Translation keys organized by component
- Auto-initialization on module import
- Locale detection from `<html lang="">` attribute
