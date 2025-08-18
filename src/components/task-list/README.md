# Task List Component

The task list component helps users navigate long, complex services by providing a structured way to track progress through multiple tasks. It allows users to complete tasks in their preferred order and gives them more control over multi-step processes.

## Features

- **Multiple task statuses** - Completed, incomplete, in progress, cannot start yet
- **Flexible task ordering** - Users can complete tasks in their preferred sequence
- **Progress tracking** - Built-in progress calculation and updates
- **State management** - Optional auto-save and restore functionality
- **Interactive controls** - Programmatic task management via JavaScript API
- **Accessibility compliant** - WCAG 2.2 compliant with full keyboard navigation
- **Responsive design** - Mobile-friendly with adaptive layouts
- **Size variants** - Compact and large variants available
- **TypeScript support** - Full type definitions included

## Basic Usage

### HTML

```html
<!-- Basic task list -->
<div class="public-good-task-list">
  <ul class="public-good-task-list__list">
    <li class="public-good-task-list__item">
      <a class="public-good-task-list__link" href="/personal-details">
        <div class="public-good-task-list__name-and-hint">
          <div class="public-good-task-list__name">Personal details</div>
          <div class="public-good-task-list__hint">Name, date of birth, address</div>
        </div>
        <div class="public-good-task-list__status">
          <strong>Completed</strong>
        </div>
      </a>
    </li>
    <li class="public-good-task-list__item">
      <a class="public-good-task-list__link" href="/contact-info">
        <div class="public-good-task-list__name-and-hint">
          <div class="public-good-task-list__name">Contact information</div>
        </div>
        <div class="public-good-task-list__status">
          <span class="public-good-task-list__status-incomplete">Incomplete</span>
        </div>
      </a>
    </li>
    <li class="public-good-task-list__item">
      <div class="public-good-task-list__link public-good-task-list__link--disabled" aria-disabled="true">
        <div class="public-good-task-list__name-and-hint">
          <div class="public-good-task-list__name">Review and submit</div>
        </div>
        <div class="public-good-task-list__status">
          <span class="public-good-task-list__status-cannot-start">Cannot start yet</span>
        </div>
      </div>
    </li>
  </ul>
</div>
```

### TypeScript/JavaScript

```typescript
import { TaskList, createTaskList, createTaskItem } from './task-list';

// Create task list from configuration
const taskList = createTaskList({
  tasks: [
    {
      title: 'Personal details',
      hint: 'Name, date of birth, address',
      status: 'completed',
      href: '/personal-details'
    },
    {
      title: 'Contact information',
      status: 'incomplete',
      href: '/contact-info'
    },
    {
      title: 'Review and submit',
      status: 'cannot-start'
    }
  ]
});

// Create interactive task list instance
const container = document.getElementById('task-container');
const instance = new TaskList(container, tasks, {
  trackProgress: true,
  autoSave: true,
  onProgressUpdate: (completed, total) => {
    console.log(`Progress: ${completed}/${total} completed`);
  }
});
```

## Task Status Types

### Available Statuses

- **`completed`** - Task has been finished
- **`in-progress`** - Task is currently being worked on
- **`incomplete`** - Task needs to be completed
- **`cannot-start`** - Task cannot be started yet (dependencies not met)

### Status HTML Examples

```html
<!-- Completed -->
<div class="public-good-task-list__status">
  <strong>Completed</strong>
</div>

<!-- In Progress -->
<div class="public-good-task-list__status">
  <span class="public-good-task-list__status-in-progress">In progress</span>
</div>

<!-- Incomplete -->
<div class="public-good-task-list__status">
  <span class="public-good-task-list__status-incomplete">Incomplete</span>
</div>

<!-- Cannot Start -->
<div class="public-good-task-list__status">
  <span class="public-good-task-list__status-cannot-start">Cannot start yet</span>
</div>
```

## Variants

### Size Variants

```html
<!-- Compact -->
<div class="public-good-task-list public-good-task-list--compact">
  <!-- Task items -->
</div>

<!-- Large -->
<div class="public-good-task-list public-good-task-list--large">
  <!-- Task items -->
</div>
```

### With Progress Bar

```html
<div class="public-good-task-list public-good-task-list--with-progress">
  <div class="public-good-task-list__progress">
    <div class="public-good-task-list__progress-text">
      Application progress: 2 of 4 tasks completed
    </div>
    <div class="public-good-task-list__progress-bar">
      <div class="public-good-task-list__progress-fill" style="width: 50%"></div>
    </div>
  </div>
  <ul class="public-good-task-list__list">
    <!-- Task items -->
  </ul>
</div>
```

## API Reference

### TaskList Class

#### Constructor

```typescript
new TaskList(element: HTMLElement, tasks: TaskOptions[], config?: TaskListConfig)
```

#### Methods

##### `getTasks(): TaskOptions[]`
Returns all tasks in the list.

##### `getTask(index: number): TaskOptions | null`
Returns a specific task by index.

##### `setTaskStatus(index: number, status: TaskStatus): void`
Updates the status of a specific task.

##### `addTask(task: TaskOptions, index?: number): void`
Adds a new task at the specified position (or at the end).

##### `removeTask(index: number): void`
Removes a task from the list.

##### `getProgress(): { completed: number; total: number; percentage: number }`
Returns progress statistics.

##### `getElement(): HTMLElement`
Returns the container element.

##### `destroy(): void`
Destroys the task list instance and cleans up event listeners.

### Functions

#### `createTaskList(options: TaskListOptions): HTMLElement`

Creates a task list element.

**Parameters:**
- `options.tasks` - Array of task configurations
- `options.classes` - Additional CSS classes
- `options.attributes` - Custom attributes
- `options.idPrefix` - Prefix for generated task IDs

#### `createTaskItem(task: TaskOptions, id?: string): HTMLElement`

Creates a single task item element.

#### `initializeTaskLists(scope?: Document | HTMLElement): TaskList[]`

Initializes task lists from existing markup with data attributes.

#### `validateTaskListAccessibility(scope?: Document | HTMLElement): ValidationResult`

Validates task list accessibility and returns issues found.

### Types

```typescript
type TaskStatus = 'completed' | 'incomplete' | 'cannot-start' | 'in-progress';

interface TaskOptions {
  id?: string;
  title: string;
  hint?: string;
  status: TaskStatus;
  href?: string;
  classes?: string;
  attributes?: Record<string, string>;
  onClick?: (task: TaskOptions) => void;
}

interface TaskListConfig {
  allowReordering?: boolean;
  trackProgress?: boolean;
  autoSave?: boolean;
  storageKey?: string;
  onTaskClick?: (task: TaskOptions, index: number) => void;
  onStatusChange?: (task: TaskOptions, index: number, oldStatus: TaskStatus) => void;
  onProgressUpdate?: (completed: number, total: number) => void;
}
```

## Events

The TaskList class emits custom events:

### `task-list:progress`
Fired when progress changes.
```typescript
element.addEventListener('task-list:progress', (event) => {
  console.log(event.detail); // { completed, total, percentage }
});
```

### `task-list:status-change`
Fired when a task status changes.
```typescript
element.addEventListener('task-list:status-change', (event) => {
  console.log(event.detail); // { task, index, oldStatus, newStatus }
});
```

### `task-list:task-added`
Fired when a task is added.

### `task-list:task-removed`
Fired when a task is removed.

## Usage Guidelines

### When to Use ✅

- For multi-step processes that are too complex to complete in one session
- When tasks can be completed in different orders
- To show progress through a long service
- When users need flexibility in task completion
- For applications with dependencies between tasks

### Best Practices ✅

- Use clear, concise task descriptions
- Provide helpful hint text for complex tasks
- Show clear status indicators
- Make the entire task row clickable for better accessibility
- Use consistent language for status labels
- Group related tasks logically
- Provide progress indicators for long lists

### When Not to Use ❌

- For simple, linear processes (use step-by-step flow instead)
- To display user answers (use summary list component instead)
- For processes that can be simplified into fewer steps
- When all tasks must be completed in strict order
- For very short processes (3 or fewer steps)

### Don't ❌

- Use vague or unclear task titles
- Omit helpful context in hint text
- Make individual elements within tasks clickable (whole row should be clickable)
- Use inconsistent status terminology
- Create overly long task lists without grouping

## Accessibility

- Uses semantic HTML with proper list structure
- Provides clear status indicators with appropriate markup
- Supports keyboard navigation
- Includes ARIA attributes for disabled tasks
- Maintains focus management
- Works with screen readers
- Meets WCAG 2.2 color contrast requirements

## State Management

The component supports automatic state persistence:

```typescript
const taskList = new TaskList(container, tasks, {
  autoSave: true,
  storageKey: 'my-application-tasks'
});
```

State includes:
- Task statuses
- Task order (if reordering is enabled)
- Timestamp of last update

## Examples

See the `examples/` directory for:
- `basic.html` - Basic usage patterns and variants
- `advanced.html` - Interactive demos and advanced features

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

Run tests with: `npm test task-list`

The component includes comprehensive tests covering:
- Component creation and customization
- Task status management
- Progress tracking
- State persistence
- Accessibility validation
- Event handling