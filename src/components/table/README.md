# Table Component

The Table component provides accessible, responsive data tables with sorting functionality and comprehensive customization options. It's designed to help users compare and scan information efficiently while maintaining excellent accessibility standards.

## Features

- **Semantic HTML**: Proper table structure with thead, tbody, and accessibility attributes
- **Sortable columns**: Click-to-sort functionality with keyboard support
- **Responsive design**: Adapts to mobile screens with stacked layout
- **Custom formatting**: Support for numeric data, custom cell formatters, and progress indicators
- **Accessibility compliant**: WCAG 2.1 AA compliance with screen reader support
- **Keyboard navigation**: Full keyboard accessibility for interactive elements
- **Persistent sorting**: Optional localStorage persistence for sort preferences
- **Data validation**: Built-in accessibility validation tools

## Usage

### Basic Table

```typescript
import { createTable } from './table';

const table = createTable({
  caption: 'Patient Symptoms and Causes'
});

document.body.appendChild(table);
```

### Data Table with Columns and Rows

```typescript
import { createDataTable } from './table';

const columns = [
  { key: 'name', header: 'Patient Name' },
  { key: 'age', header: 'Age', numeric: true },
  { key: 'condition', header: 'Condition' }
];

const rows = [
  { data: { name: 'John Doe', age: '45', condition: 'Hypertension' } },
  { data: { name: 'Jane Smith', age: '32', condition: 'Diabetes' } }
];

const table = createDataTable(columns, rows, {
  caption: 'Patient Information',
  sortable: true,
  responsive: true
});

document.body.appendChild(table);
```

### Programmatic Table Management

```typescript
import { Table } from './table';

const tableElement = document.getElementById('my-table');
const instance = new Table(tableElement, {
  sortable: true,
  responsive: true,
  persistSort: true,
  sortStorageKey: 'patient-table-sort'
});

// Programmatic sorting
instance.setSort('name', 'asc');

// Get current sort state
const currentSort = instance.getCurrentSort();

// Clear sorting
instance.clearSort();

// Add CSS classes
instance.addClass('custom-styling');

// Clean up
instance.destroy();
```

## Configuration Options

### TableOptions

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `caption` | `string` | Table caption for accessibility | `undefined` |
| `classes` | `string` | Additional CSS classes | `undefined` |
| `attributes` | `Record<string, string>` | HTML attributes | `undefined` |
| `sortable` | `boolean` | Enable sorting functionality | `false` |
| `responsive` | `boolean` | Enable responsive behavior | `false` |
| `numeric` | `boolean` | Default numeric formatting | `false` |

### ColumnConfig

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `key` | `string` | Data key for the column | Required |
| `header` | `string` | Column header text | Required |
| `sortable` | `boolean` | Enable sorting for this column | `true` |
| `numeric` | `boolean` | Numeric formatting and alignment | `false` |
| `classes` | `string` | Additional CSS classes | `undefined` |
| `format` | `(value: any) => string` | Custom formatting function | `undefined` |
| `scope` | `'col' \| 'row'` | Header scope attribute | `'col'` |

### TableConfig

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `sortable` | `boolean` | Enable sorting functionality | `false` |
| `responsive` | `boolean` | Enable responsive behavior | `false` |
| `persistSort` | `boolean` | Persist sort state to localStorage | `false` |
| `sortStorageKey` | `string` | localStorage key for persistence | `'table-sort'` |

## HTML Structure

### Basic Table

```html
<table class="public-good-table">
  <caption class="public-good-table__caption">Table Caption</caption>
  <thead class="public-good-table__head">
    <tr class="public-good-table__row">
      <th scope="col" class="public-good-table__header">Header 1</th>
      <th scope="col" class="public-good-table__header public-good-table__header--numeric">Header 2</th>
    </tr>
  </thead>
  <tbody class="public-good-table__body">
    <tr class="public-good-table__row">
      <td class="public-good-table__cell">Data 1</td>
      <td class="public-good-table__cell public-good-table__cell--numeric">Data 2</td>
    </tr>
  </tbody>
</table>
```

### Sortable Table

```html
<table class="public-good-table public-good-table--sortable" data-module="public-good-table" data-sortable="true">
  <thead class="public-good-table__head">
    <tr class="public-good-table__row">
      <th scope="col" class="public-good-table__header public-good-table__header--sortable" data-column="name">
        Name
        <button class="public-good-table__sort-button" type="button" aria-label="Sort by Name">
          <span class="public-good-table__sort-icon" aria-hidden="true"></span>
        </button>
      </th>
      <th scope="col" class="public-good-table__header" data-no-sort>
        Actions
      </th>
    </tr>
  </thead>
  <tbody class="public-good-table__body">
    <!-- Table rows -->
  </tbody>
</table>
```

### Responsive Table

```html
<table class="public-good-table public-good-table--responsive" data-module="public-good-table" data-responsive="true">
  <thead class="public-good-table__head">
    <tr class="public-good-table__row">
      <th scope="col" class="public-good-table__header">Date</th>
      <th scope="col" class="public-good-table__header">Patient</th>
    </tr>
  </thead>
  <tbody class="public-good-table__body">
    <tr class="public-good-table__row">
      <td class="public-good-table__cell" data-label="Date">2024-08-20</td>
      <td class="public-good-table__cell" data-label="Patient">John Doe</td>
    </tr>
  </tbody>
</table>
```

## CSS Classes

### Base Classes

- `.public-good-table` - Base table styling
- `.public-good-table__caption` - Table caption
- `.public-good-table__head` - Table header section
- `.public-good-table__body` - Table body section
- `.public-good-table__row` - Table row
- `.public-good-table__header` - Header cell
- `.public-good-table__cell` - Data cell

### Modifier Classes

- `.public-good-table--sortable` - Enable sortable styling
- `.public-good-table--responsive` - Enable responsive behavior
- `.public-good-table--striped` - Alternating row colors
- `.public-good-table--compact` - Reduced padding
- `.public-good-table--bordered` - Border around entire table
- `.public-good-table--word-break` - Allow word breaking in cells
- `.public-good-table--no-wrap` - Prevent text wrapping
- `.public-good-table--fixed` - Fixed table layout

### Numeric Styling

- `.public-good-table__header--numeric` - Right-align header
- `.public-good-table__cell--numeric` - Right-align cell with tabular nums

### Sorting States

- `.public-good-table__header--sortable` - Sortable header styling
- `.public-good-table__header--sorted-asc` - Ascending sort indicator
- `.public-good-table__header--sorted-desc` - Descending sort indicator

## JavaScript API

### Table Class

```typescript
// Constructor
const instance = new Table(element: HTMLTableElement, config?: TableConfig)

// Sorting methods
instance.setSort(column: string, direction: 'asc' | 'desc'): void
instance.getCurrentSort(): SortConfig | null
instance.clearSort(): void

// Class management
instance.addClass(className: string): void
instance.removeClass(className: string): void
instance.hasClass(className: string): boolean

// Element access
instance.getElement(): HTMLTableElement

// Cleanup
instance.destroy(): void
```

### Helper Functions

```typescript
// Create basic table
const table = createTable(options: TableOptions): HTMLTableElement

// Create data table with columns and rows
const dataTable = createDataTable(
  columns: ColumnConfig[],
  rows: RowConfig[],
  options?: TableOptions
): HTMLTableElement

// Initialize from existing markup
const instances = initializeTables(scope?: Document | HTMLElement): Table[]

// Validate accessibility
const validation = validateTableAccessibility(
  scope?: Document | HTMLElement
): {
  tables: HTMLTableElement[];
  issues: string[];
}
```

## Accessibility Features

### WCAG Compliance

The table component follows WCAG 2.1 AA guidelines:

- **Semantic structure**: Proper use of thead, tbody, th, and td elements
- **Header associations**: Scope attributes link data cells to headers
- **Keyboard navigation**: Full keyboard support for interactive elements
- **Screen reader support**: Proper ARIA attributes and announcements
- **Focus management**: Visible focus indicators and logical tab order

### Screen Reader Support

```html
<!-- Proper table caption -->
<caption class="public-good-table__caption">Patient medication schedule</caption>

<!-- Header associations -->
<th scope="col" class="public-good-table__header">Medication</th>
<th scope="row" class="public-good-table__header">Morning dose</th>

<!-- ARIA labels for sorting -->
<button class="public-good-table__sort-button" 
        type="button" 
        aria-label="Sort by patient name">
  <span class="public-good-table__sort-icon" aria-hidden="true"></span>
</button>
```

### Keyboard Navigation

- **Tab**: Navigate to sortable headers
- **Enter/Space**: Activate sorting
- **Shift+Tab**: Navigate backwards
- **Arrow keys**: Navigate within table cells

## Usage Patterns

### Healthcare Data Table

```typescript
const patientColumns = [
  { key: 'id', header: 'Patient ID', sortable: true },
  { key: 'name', header: 'Full Name', sortable: true },
  { key: 'age', header: 'Age', numeric: true, sortable: true },
  { key: 'condition', header: 'Primary Condition', sortable: true },
  { key: 'lastVisit', header: 'Last Visit', sortable: true },
  { key: 'status', header: 'Status', sortable: false }
];

const patientRows = [
  {
    data: {
      id: 'P001',
      name: 'Sarah Johnson',
      age: '45',
      condition: 'Hypertension',
      lastVisit: '2024-08-15',
      status: 'Active'
    }
  }
  // More patient data...
];

const table = createDataTable(patientColumns, patientRows, {
  caption: 'Patient Management Dashboard',
  sortable: true,
  responsive: true
});

const instance = new Table(table, {
  sortable: true,
  responsive: true,
  persistSort: true,
  sortStorageKey: 'patient-table-sort'
});
```

### Custom Formatted Data

```typescript
const metricsColumns = [
  { key: 'service', header: 'Service Name' },
  { 
    key: 'cpu', 
    header: 'CPU Usage', 
    numeric: true, 
    format: (value) => `${value}%` 
  },
  { 
    key: 'memory', 
    header: 'Memory', 
    numeric: true, 
    format: (value) => `${(parseInt(value) / 1024).toFixed(1)} GB` 
  },
  { 
    key: 'uptime', 
    header: 'Uptime', 
    format: (value) => {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }
];
```

### Filter and Search Integration

```typescript
class TableManager {
  private instance: Table;
  private originalData: RowConfig[];
  private filteredData: RowConfig[];

  constructor(tableElement: HTMLTableElement, data: RowConfig[]) {
    this.instance = new Table(tableElement, {
      sortable: true,
      responsive: true
    });
    this.originalData = [...data];
    this.filteredData = [...data];
  }

  filterByStatus(status: string): void {
    if (!status) {
      this.filteredData = [...this.originalData];
    } else {
      this.filteredData = this.originalData.filter(
        row => row.data.status === status
      );
    }
    this.refreshTable();
  }

  searchByName(query: string): void {
    const searchTerm = query.toLowerCase();
    if (!searchTerm) {
      this.filteredData = [...this.originalData];
    } else {
      this.filteredData = this.originalData.filter(
        row => row.data.name.toLowerCase().includes(searchTerm)
      );
    }
    this.refreshTable();
  }

  private refreshTable(): void {
    // Update table body with filtered data
    // This would involve DOM manipulation or regeneration
  }
}
```

## Events

The component dispatches custom events for integration:

```typescript
tableElement.addEventListener('table:sorted', (event) => {
  console.log('Table sorted:', {
    table: event.detail.table,
    column: event.detail.column,
    direction: event.detail.direction,
    columnIndex: event.detail.columnIndex
  });

  // Analytics tracking
  analytics.track('table_sorted', {
    column: event.detail.column,
    direction: event.detail.direction
  });
});
```

## Styling Customization

### CSS Custom Properties

```css
:root {
  --public-good-color-grey-6: #f5f5f5;
  --public-good-color-border: #d8dde0;
  --public-good-color-border-light: #e8edee;
  --public-good-color-text-secondary: #666666;
  --public-good-spacing-1: 8px;
  --public-good-spacing-2: 12px;
  --public-good-spacing-3: 16px;
  --public-good-spacing-4: 24px;
}
```

### Custom Table Styles

```css
/* Healthcare-themed table */
.healthcare-table {
  border: 2px solid #0066cc;
  border-radius: 8px;
  overflow: hidden;
}

.healthcare-table .public-good-table__header {
  background: linear-gradient(135deg, #0066cc, #004499);
  color: white;
  font-weight: 600;
}

.healthcare-table .public-good-table__row:hover {
  background-color: #e3f2fd;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 102, 204, 0.1);
}

/* Status indicators */
.status-active { color: #28a745; font-weight: 600; }
.status-pending { color: #ffc107; font-weight: 600; }
.status-inactive { color: #dc3545; font-weight: 600; }
```

## Testing and Validation

### Automated Accessibility Testing

```typescript
function validateTableAccessibility() {
  const validation = validateTableAccessibility();
  
  console.log(`Found ${validation.tables.length} tables`);
  
  if (validation.issues.length > 0) {
    console.error('Accessibility issues:', validation.issues);
  } else {
    console.log('✓ All tables are accessible');
  }

  return validation;
}
```

### Manual Testing Checklist

1. **Keyboard Navigation**
   - Tab through interactive elements
   - Use Enter/Space to sort columns
   - Verify focus indicators are visible

2. **Screen Reader Testing**
   - Test with NVDA, JAWS, or VoiceOver
   - Verify table structure is announced
   - Check header-data relationships

3. **Responsive Testing**
   - Test on mobile devices
   - Verify stacked layout works correctly
   - Check data-label attributes display properly

4. **Sorting Testing**
   - Test numeric and text sorting
   - Verify sort indicators work
   - Test with mixed data types

5. **Visual Testing**
   - Test in high contrast mode
   - Verify colors meet contrast requirements
   - Test with different zoom levels

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari 14.4+
- Android Chrome 88+

## Migration from NHS UK

This component is converted from the NHS UK Design System. Key differences:

- **Class prefix**: `nhsuk-` → `public-good-`
- **Enhanced functionality**: Added sorting, responsive behavior, and programmatic API
- **TypeScript support**: Full TypeScript implementation with strict types
- **Modern CSS**: CSS custom properties and modern layout techniques
- **Improved accessibility**: Enhanced ARIA support and keyboard navigation

### Migration Steps

1. Update class names: `nhsuk-table` → `public-good-table`
2. Replace NHS UK specific styling with Public Good design tokens
3. Update JavaScript imports if using programmatic functionality
4. Test table functionality and accessibility
5. Migrate data attributes for enhanced features

## Related Components

- **Pagination**: For tables with large datasets
- **Filter**: For table filtering functionality
- **Search**: For table search capabilities
- **Modal**: For table row detail views

## Testing

The component includes comprehensive tests covering:

- Table creation and configuration
- Sorting functionality and keyboard navigation
- Responsive behavior and data labels
- Accessibility compliance and validation
- Helper functions and utilities
- Storage persistence and error handling
- Edge cases and error scenarios

Run tests with: `npm test table`