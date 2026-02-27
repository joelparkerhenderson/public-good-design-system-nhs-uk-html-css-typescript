# Component Documentation

This document provides detailed documentation for all 36 components in the Public Good Design System.

## Table of Contents

- [Form Elements](#form-elements)
- [Navigation](#navigation)
- [Content Display](#content-display)
- [Interactive](#interactive)
- [Layout](#layout)

---

## Form Elements

### Button

Creates accessible button elements with multiple variants.

```typescript
import { createButton } from './components/button/button'

const button = createButton({
  text: 'Save and continue',
  variant: 'primary',      // 'primary' | 'secondary' | 'secondary-solid' | 'reverse' | 'warning' | 'success'
  element: 'button',       // 'button' | 'a' | 'input'
  type: 'submit',          // 'submit' | 'button' | 'reset'
  disabled: false,
  preventDoubleClick: true,
  classes: '',
  attributes: {},
  onClick: (event) => {}
})
```

**Variants:**
- `primary` - Blue background, white text (default)
- `secondary` - White background, blue border
- `secondary-solid` - Grey background
- `reverse` - White background (for dark backgrounds)
- `warning` - Red background for destructive actions
- `success` - Green background for positive actions

### Checkboxes

Creates checkbox groups with conditional reveals and exclusive options.

```typescript
import { createCheckboxes } from './components/checkboxes/checkboxes'

const checkboxes = createCheckboxes({
  name: 'contact-preferences',
  items: [
    { value: 'email', text: 'Email', checked: true },
    { value: 'phone', text: 'Phone' },
    { value: 'text', text: 'Text message' },
    { divider: 'or' },
    { value: 'none', text: 'None of the above', exclusive: true }
  ],
  fieldset: {
    legend: { text: 'How should we contact you?', classes: 'public-good-fieldset__legend--l' }
  }
})

// Methods
checkboxes.getValues()      // Returns checked values
checkboxes.setValues(['email', 'phone'])
checkboxes.checkAll()
checkboxes.uncheckAll()
checkboxes.validate()
```

### Character Count

Provides real-time character or word counting for textareas.

```typescript
import { CharacterCount, createCharacterCount } from './components/character-count/character-count'

// From existing markup
const instance = new CharacterCount(element, { maxlength: 200, threshold: 75 })

// Programmatic creation
const element = createCharacterCount({
  id: 'message',
  name: 'message',
  label: { text: 'Your message' },
  maxlength: 200,
  threshold: 75
})

instance.getCount()         // Current count
instance.getRemainingCount() // Remaining characters
instance.isOverLimit()       // Boolean
```

### Date Input

Accessible date input with separate day/month/year fields.

```typescript
import { createDateInput } from './components/date-input/date-input'

const dateInput = createDateInput({
  id: 'dob',
  namePrefix: 'dob',
  fieldset: {
    legend: { text: 'What is your date of birth?' }
  },
  hint: { text: 'For example, 31 3 1980' },
  items: [
    { name: 'day', classes: 'public-good-input--width-2' },
    { name: 'month', classes: 'public-good-input--width-2' },
    { name: 'year', classes: 'public-good-input--width-4' }
  ]
})
```

### Error Message

Inline error messages for form fields.

```typescript
import { createErrorMessage } from './components/error-message/error-message'

const error = createErrorMessage({
  text: 'Enter your full name',
  id: 'name-error',
  visuallyHiddenText: 'Error'
})
```

### Error Summary

Summary of form errors with anchor links to affected fields.

```typescript
import { ErrorSummary } from './components/error-summary/error-summary'

const summary = new ErrorSummary(element, {
  disableAutoFocus: false
})

// Programmatic creation
const element = createErrorSummary({
  titleText: 'There is a problem',
  errorList: [
    { text: 'Enter your name', href: '#name' },
    { text: 'Enter your email', href: '#email' }
  ]
})
```

### Input

Text input with various types and validation.

```typescript
import { createInput } from './components/input/input'

const input = createInput({
  id: 'email',
  name: 'email',
  type: 'email',
  label: { text: 'Email address' },
  hint: { text: 'We will only use this for notifications' },
  autocomplete: 'email',
  spellcheck: false
})
```

### Label

Form field labels with page heading support.

```typescript
import { createLabel, createPageHeadingLabel } from './components/label/label'

const label = createLabel({
  text: 'Full name',
  for: 'name-input',
  classes: 'public-good-label--l'
})

const headingLabel = createPageHeadingLabel('What is your name?', 'name-input')
```

### Radios

Radio button groups with conditional reveals.

```typescript
import { createRadios } from './components/radios/radios'

const radios = createRadios({
  id: 'contact',
  name: 'contact',
  legend: 'How should we contact you?',
  options: [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone', conditional: { html: '<input type="tel">' } },
    { value: 'text', label: 'Text message' }
  ]
})

radios.getValue()           // Selected value
radios.setValue('email')
radios.showError('Select an option')
radios.hideError()
```

### Select

Dropdown select with search and custom rendering.

```typescript
import { createSelect } from './components/select/select'

const select = createSelect({
  id: 'sort',
  name: 'sort',
  label: { text: 'Sort by' },
  items: [
    { value: 'relevance', text: 'Relevance' },
    { value: 'date', text: 'Date', selected: true },
    { value: 'title', text: 'Title' }
  ]
})
```

### Textarea

Multi-line text input with auto-resize.

```typescript
import { createTextarea } from './components/textarea/textarea'

const textarea = createTextarea({
  id: 'details',
  name: 'details',
  label: 'Give details',
  rows: 5,
  maxlength: 500,
  hint: 'Do not include personal information'
})
```

---

## Navigation

### Action Link

Styled links with arrow icons.

```typescript
import { createActionLink } from './components/action-link/action-link'

const link = createActionLink({
  text: 'Find a GP',
  href: '/find-gp'
})
```

### Back Link

Back navigation link.

```typescript
import { createBackLink } from './components/back-link/back-link'

const backLink = createBackLink({
  text: 'Go back',
  href: '/previous-page'
})
```

### Breadcrumb

Breadcrumb trail navigation.

```typescript
import { createBreadcrumb } from './components/breadcrumb/breadcrumb'

const breadcrumb = createBreadcrumb({
  items: [
    { text: 'Home', href: '/' },
    { text: 'Services', href: '/services' },
    { text: 'Current page' }
  ]
})
```

### Contents List

Page contents navigation list.

```typescript
import { createContentsList } from './components/contents-list/contents-list'

const contents = createContentsList({
  items: [
    { text: 'Overview', href: '#overview', current: true },
    { text: 'Symptoms', href: '#symptoms' },
    { text: 'Treatment', href: '#treatment' }
  ]
})
```

### Footer

Page footer with navigation sections and copyright.

```typescript
import { createFooter } from './components/footer/footer'

const footer = createFooter({
  links: [
    { label: 'Accessibility', url: '/accessibility' },
    { label: 'Privacy', url: '/privacy' }
  ],
  navigationSections: [
    { title: 'Services', links: [...] }
  ],
  showCopyright: true
})
```

### Header

Page header with logo and navigation.

```typescript
import { createHeader } from './components/header/header'

const header = createHeader({
  showNav: true,
  showSearch: true,
  navigation: [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' }
  ]
})
```

### Pagination

Page navigation with previous/next links.

```typescript
import { createPagination } from './components/pagination/pagination'

const pagination = createPagination({
  previous: { href: '/page/1', text: 'Previous', label: 'Page 1' },
  next: { href: '/page/3', text: 'Next', label: 'Page 3' }
})
```

### Skip Link

Skip to main content for keyboard users.

```typescript
import { SkipLink } from './components/skip-link/skip-link'

const skipLink = new SkipLink(element, {
  scrollBehavior: 'smooth',
  focusTarget: true
})
```

---

## Content Display

### Card

Content cards with image, heading, and description.

```typescript
import { createCard } from './components/card/card'

const card = createCard({
  heading: 'Mental health',
  headingLevel: 2,
  href: '/mental-health',
  description: 'Information about mental health conditions and support.',
  image: { src: '/images/mental-health.jpg', alt: '' }
})
```

### Details

Expandable content sections.

```typescript
import { createDetails } from './components/details/details'

const details = createDetails({
  summary: 'Where to find your NHS number',
  html: '<p>Your NHS number is a 10-digit number...</p>'
})
```

### Do/Don't List

Lists of recommended and discouraged practices.

```typescript
import { createDoDontList } from './components/do-dont-list/do-dont-list'

const doList = createDoDontList({
  type: 'do',
  items: [
    { text: 'Cover burns with cling film' },
    { text: 'Use cool running water' }
  ]
})
```

### Hero

Hero banner with heading, text, and image.

```typescript
import { createHero, createSimpleHero } from './components/hero/hero'

const hero = createHero({
  heading: 'Welcome to the service',
  text: 'Find and book appointments online.',
  imageURL: '/images/hero.jpg'
})

// Simple helper
const simpleHero = createSimpleHero('Welcome', 'Subtitle text')
```

### Image

Responsive images with captions.

```typescript
import { createImage } from './components/image/image'

const image = createImage({
  src: '/images/photo.jpg',
  alt: 'Description of the image',
  caption: 'Photo caption text'
})
```

### Inset Text

Indented content for quotes and callouts.

```typescript
import { createInsetText } from './components/inset-text/inset-text'

const inset = createInsetText({
  html: '<p>You can report a side effect through the Yellow Card scheme.</p>'
})
```

### Notification Banner

Dismissible notification messages.

```typescript
import { createNotificationBanner } from './components/notification-banner/notification-banner'

const banner = createNotificationBanner({
  type: 'success',
  heading: 'Success',
  html: '<p>Your application has been submitted.</p>',
  dismissible: true
})
```

### Panel

Confirmation panels for transaction completion.

```typescript
import { createPanel, createSuccessPanel } from './components/panel/panel'

const panel = createPanel({
  title: 'Application complete',
  body: 'Your reference number is HDJ2123F',
  titleLevel: 1
})

// Helper
const success = createSuccessPanel('Application complete', 'Reference: HDJ2123F')
```

### Summary List

Key-value pair display for form summaries.

```typescript
import { createSummaryList } from './components/summary-list/summary-list'

const summary = createSummaryList({
  rows: [
    {
      key: { text: 'Name' },
      value: { text: 'Jane Smith' },
      actions: { items: [{ text: 'Change', href: '/name', visuallyHiddenText: 'name' }] }
    }
  ]
})
```

### Table

Data tables with sorting and responsive layout.

```typescript
import { Table } from './components/table/table'

const table = new Table(element, {
  sortable: true,
  responsive: true,
  persistSort: true
})

table.sort('name', 'asc')
table.resetSort()
```

### Tabs

Tabbed content navigation with keyboard support.

```typescript
import { Tabs } from './components/tabs/tabs'

const tabs = new Tabs(element, {
  autoActivation: true,
  orientation: 'horizontal',
  enableHistory: true,
  onTabChange: (index, tab) => {}
})

tabs.activateTab(2)
tabs.getActiveTabIndex()
```

### Tag

Status indicator tags.

```typescript
import { createTag } from './components/tag/tag'

const tag = createTag({
  text: 'Active',
  color: 'green'   // 'white' | 'grey' | 'green' | 'aqua-green' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow'
})
```

### Task List

Progress tracking task lists.

```typescript
import { TaskList } from './components/task-list/task-list'

const taskList = new TaskList(element, [
  { title: 'Personal details', status: 'completed', href: '/personal' },
  { title: 'Contact information', status: 'in-progress', href: '/contact' },
  { title: 'Submit application', status: 'not-started' }
], {
  trackProgress: true,
  allowReordering: false,
  autoSave: true
})

taskList.setTaskStatus(1, 'completed')
taskList.getProgress()
```

### Warning Callout

Important warning messages.

```typescript
import { createWarningCallout } from './components/warning-callout/warning-callout'

const callout = createWarningCallout({
  heading: 'Important',
  content: 'Contact your GP if symptoms persist for more than 3 days.',
  hiddenPrefix: 'Important: '
})
```

### Review Date

Content review date display.

```typescript
import { createReviewDate } from './components/review-date/review-date'

const reviewDate = createReviewDate({
  lastReview: '12 February 2024',
  nextReview: '12 February 2027'
})
```

---

## Core Utilities

### DOM Utilities

```typescript
import { generateUniqueId, createElement, querySelector } from './core/functions/dom-utils'

const id = generateUniqueId('component')       // 'component-1709...'
const el = createElement('div', { class: 'foo', id: 'bar' })
const found = querySelector('.my-class', parentElement)
```

### Validation

```typescript
import { validateEmail, validateRequired, validateMinLength } from './core/functions/validation'

validateEmail('user@example.com')    // { isValid: true, errors: [], warnings: [] }
validateRequired('')                  // { isValid: false, errors: ['Required'], warnings: [] }
validateMinLength('ab', 3)           // { isValid: false, errors: ['Min 3 chars'], warnings: [] }
```

### Internationalization

```typescript
import { initializeI18n, setLocale, t, getLocale } from './core/functions/i18n'

initializeI18n()                     // Auto-called on import
setLocale('cy')                      // Switch to Welsh
t('navigation.back')                 // Translated string
getLocale()                          // Current locale code
```
