# CLAUDE.md

Instructions and conventions for Claude Code when working on this project.

## Project Overview

Public Good Design System - a TypeScript component library converted from the NHS UK Design System. Provides 36 accessible, WCAG AA-compliant UI components built with vanilla HTML, CSS, and TypeScript (no framework dependency).

## Tech Stack

- **Language**: TypeScript 5.9+ (strict mode)
- **Build**: Vite 7 (library mode, ES module output)
- **Package Manager**: pnpm 10+
- **Tests**: Vitest (unit, JSDOM environment) + Playwright (E2E, 3 browsers + 2 mobile)
- **Linting**: ESLint 9 (flat config) + Prettier
- **Node**: >= 18.0.0

## Commands

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Type-check + Vite build
pnpm test             # Run unit tests (Vitest)
pnpm test:coverage    # Unit tests with coverage (80% threshold)
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm type-check       # TypeScript type-check only (tsc --noEmit)
pnpm format           # Prettier format
pnpm format:check     # Check formatting
```

## Architecture

### Directory Structure

```
src/
  index.ts                     # Main entry - exports all components + auto-init
  index.css                    # Main CSS entry
  components/                  # 36 UI components
    {component-name}/
      {component-name}.ts      # Component implementation
      {component-name}.css     # Component styles
      {component-name}.test.ts # Unit tests (vitest)
  core/
    functions/
      dom-utils.ts             # DOM manipulation utilities
      i18n.ts                  # Internationalization (8 locales)
      validation.ts            # Form validation utilities
    tokens/
      colors.css               # Color design tokens (CSS custom properties)
      typography.css            # Typography tokens
      spacing.css              # Spacing tokens
      breakpoints.css          # Responsive breakpoints
    utilities/
      reset.css                # CSS reset
      layout.css               # Layout utilities
      accessibility.css        # Accessibility utilities
tests/
  e2e/                         # Playwright E2E tests
  helpers/
    setup.ts                   # Test environment setup (JSDOM mocks)
```

### Component Pattern

Each component follows a consistent pattern:
1. **Interface definitions** - TypeScript interfaces for config/options
2. **Class-based component** - For stateful components (e.g., `Tabs`, `CharacterCount`)
3. **Factory function** - `create{Component}(config)` returns an HTMLElement
4. **Helper functions** - Convenience wrappers (e.g., `createSimpleHero()`)
5. **Init function** - `initialize{Components}(scope)` for auto-init from DOM

### CSS Convention

- All CSS classes use `public-good-` prefix
- Design tokens use CSS custom properties: `--public-good-*`
- BEM-like naming: `public-good-{component}__{element}--{modifier}`
- JS hooks use: `public-good-js-{name}` class prefix

### Event Convention

- Custom events use `public-good:{component}:{event}` namespace
- Events bubble and are cancelable
- Detail contains relevant state

## TypeScript Configuration

- **Strict mode** enabled
- `noUncheckedIndexedAccess: true` - array/object indexing returns `T | undefined`
- `noImplicitReturns: true`
- Path aliases: `@/*` -> `src/*`, `@/components/*`, `@/core/*`, `@/assets/*`, `@/locales/*`
- Test files (`**/*.test.ts`) are excluded from compilation

## Code Style

- Prettier: no semicolons, single quotes, 2-space indent, trailing commas (ES5)
- ESLint: TypeScript recommended rules, `no-explicit-any` (warn), unused vars with `_` prefix allowed
- `no-console` is a warning (console usage is acceptable in error handlers and initialization)

## Testing

- Unit tests use JSDOM environment with global test utilities (describe, it, expect, vi)
- Coverage threshold: 80% for branches, functions, lines, statements
- E2E tests cover Chromium, Firefox, WebKit + Pixel 5, iPhone 12
- Test setup in `tests/helpers/setup.ts` mocks `matchMedia` and cleans DOM between tests

## Important Notes

- This is a **framework-agnostic** library - no React, Vue, or Svelte dependencies
- Components create DOM elements directly via `document.createElement`
- The library auto-initializes i18n and global event listeners on import
- All components must maintain WCAG AA accessibility compliance
- The i18n system supports 8 locales: en, cy, ga, gd, fr, de, es, ar (RTL for Arabic)
