/**
 * Table Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides enhanced table functionality with sorting, responsive behavior,
 * and accessibility features.
 */

/**
 * Configuration options for table creation
 */
export interface TableOptions {
  caption?: string;
  classes?: string;
  attributes?: Record<string, string>;
  sortable?: boolean;
  responsive?: boolean;
  numeric?: boolean;
}

/**
 * Configuration options for table columns
 */
export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  numeric?: boolean;
  classes?: string;
  format?: (value: any) => string;
  scope?: 'col' | 'row';
}

/**
 * Configuration options for table rows
 */
export interface RowConfig {
  data: Record<string, any>;
  classes?: string;
  attributes?: Record<string, string>;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * Table configuration for the Table class
 */
export interface TableConfig {
  sortable?: boolean;
  responsive?: boolean;
  persistSort?: boolean;
  sortStorageKey?: string;
}

/**
 * Enhanced Table class for programmatic table management
 */
export class Table {
  private element: HTMLTableElement;
  private config: TableConfig;
  private columns: Map<string, ColumnConfig> = new Map();
  private currentSort: SortConfig | null = null;
  private originalData: RowConfig[] = [];

  constructor(element: HTMLTableElement, config: TableConfig = {}) {
    if (!(element instanceof HTMLTableElement)) {
      throw new Error('Table component requires a table element');
    }

    this.element = element;
    this.config = {
      sortable: false,
      responsive: false,
      persistSort: false,
      sortStorageKey: 'table-sort',
      ...config
    };

    this.init();
  }

  private init(): void {
    this.element.classList.add('public-good-table');
    
    if (this.config.responsive) {
      this.element.classList.add('public-good-table--responsive');
      this.setupResponsive();
    }

    if (this.config.sortable) {
      this.element.classList.add('public-good-table--sortable');
      this.setupSorting();
    }

    // Setup accessibility features
    this.setupAccessibility();
    
    // Restore sort from storage if enabled
    if (this.config.persistSort) {
      this.restoreSort();
    }

    // Store original data for sorting
    this.storeOriginalData();
  }

  private setupAccessibility(): void {
    // Ensure table has proper role
    if (!this.element.getAttribute('role')) {
      this.element.setAttribute('role', 'table');
    }

    // Add ARIA labels for screen readers
    const caption = this.element.querySelector('caption');
    if (caption && !this.element.getAttribute('aria-labelledby')) {
      if (!caption.id) {
        caption.id = `table-caption-${Math.random().toString(36).substr(2, 9)}`;
      }
      this.element.setAttribute('aria-labelledby', caption.id);
    }

    // Ensure proper scope attributes
    const headers = this.element.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.getAttribute('scope')) {
        const isInThead = header.closest('thead');
        header.setAttribute('scope', isInThead ? 'col' : 'row');
      }
    });
  }

  private setupResponsive(): void {
    const headers = this.element.querySelectorAll('thead th');
    const rows = this.element.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (headers[index]) {
          const headerText = headers[index].textContent?.trim() || '';
          cell.setAttribute('data-label', headerText);
        }
      });
    });
  }

  private setupSorting(): void {
    const headers = this.element.querySelectorAll('thead th');
    
    headers.forEach((header, index) => {
      const isSortable = !header.hasAttribute('data-no-sort');
      
      if (isSortable) {
        header.classList.add('public-good-table__header--sortable');
        header.setAttribute('role', 'columnheader');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-sort', 'none');
        
        // Add sort button
        const sortButton = document.createElement('button');
        sortButton.className = 'public-good-table__sort-button';
        sortButton.type = 'button';
        sortButton.setAttribute('aria-label', `Sort by ${header.textContent?.trim()}`);
        
        const sortIcon = document.createElement('span');
        sortIcon.className = 'public-good-table__sort-icon';
        sortIcon.setAttribute('aria-hidden', 'true');
        sortButton.appendChild(sortIcon);
        
        header.appendChild(sortButton);
        
        // Add event listeners
        const handleSort = () => this.sortByColumn(index);
        header.addEventListener('click', handleSort);
        header.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleSort();
          }
        });
      }
    });
  }

  private sortByColumn(columnIndex: number): void {
    const header = this.element.querySelector(`thead th:nth-child(${columnIndex + 1})`) as HTMLElement;
    if (!header) return;

    const columnKey = header.getAttribute('data-column') || columnIndex.toString();
    const isNumeric = header.classList.contains('public-good-table__header--numeric');
    
    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (this.currentSort?.column === columnKey) {
      newDirection = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    }

    this.currentSort = { column: columnKey, direction: newDirection };
    this.applySortToColumn(columnIndex, newDirection);
  }

  private applySortToColumn(columnIndex: number, direction: 'asc' | 'desc'): void {
    const header = this.element.querySelector(`thead th:nth-child(${columnIndex + 1})`) as HTMLElement;
    if (!header) return;

    const columnKey = header.getAttribute('data-column') || columnIndex.toString();
    const isNumeric = header.classList.contains('public-good-table__header--numeric');
    
    // Update ARIA attributes
    const allHeaders = this.element.querySelectorAll('thead th');
    allHeaders.forEach(h => h.setAttribute('aria-sort', 'none'));
    header.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
    
    // Update visual indicators
    allHeaders.forEach(h => h.classList.remove('public-good-table__header--sorted-asc', 'public-good-table__header--sorted-desc'));
    header.classList.add(`public-good-table__header--sorted-${direction}`);

    // Sort the table rows
    this.sortTableRows(columnIndex, direction, isNumeric);
    
    // Persist sort if enabled
    if (this.config.persistSort) {
      this.saveSort();
    }

    // Emit sort event
    this.element.dispatchEvent(new CustomEvent('table:sorted', {
      detail: {
        table: this,
        column: columnKey,
        direction: direction,
        columnIndex
      }
    }));
  }

  private sortTableRows(columnIndex: number, direction: 'asc' | 'desc', isNumeric: boolean): void {
    const tbody = this.element.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
      const aCell = a.querySelector(`td:nth-child(${columnIndex + 1})`);
      const bCell = b.querySelector(`td:nth-child(${columnIndex + 1})`);
      
      if (!aCell || !bCell) return 0;
      
      let aValue = aCell.textContent?.trim() || '';
      let bValue = bCell.textContent?.trim() || '';
      
      if (isNumeric) {
        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
      }
      
      const comparison = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
      return direction === 'asc' ? comparison : -comparison;
    });
    
    // Reorder DOM elements
    rows.forEach(row => tbody.appendChild(row));
  }

  private storeOriginalData(): void {
    const rows = this.element.querySelectorAll('tbody tr');
    this.originalData = Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td, th');
      const data: Record<string, any> = {};
      
      cells.forEach((cell, index) => {
        data[index.toString()] = cell.textContent?.trim() || '';
      });
      
      return {
        data,
        classes: row.className,
        attributes: {}
      };
    });
  }

  private saveSort(): void {
    if (this.currentSort && this.config.sortStorageKey) {
      localStorage.setItem(this.config.sortStorageKey, JSON.stringify(this.currentSort));
    }
  }

  private restoreSort(): void {
    if (this.config.sortStorageKey) {
      try {
        const stored = localStorage.getItem(this.config.sortStorageKey);
        if (stored) {
          this.currentSort = JSON.parse(stored);
          // Apply the restored sort
          const columnIndex = parseInt(this.currentSort!.column) || 0;
          this.sortByColumn(columnIndex);
        }
      } catch (error) {
        console.warn('Failed to restore table sort:', error);
      }
    }
  }

  /**
   * Get current sort configuration
   */
  getCurrentSort(): SortConfig | null {
    return this.currentSort;
  }

  /**
   * Set sort programmatically
   */
  setSort(column: string, direction: 'asc' | 'desc'): void {
    const columnIndex = parseInt(column) || 0;
    this.currentSort = { column, direction };
    this.applySortToColumn(columnIndex, direction);
  }

  /**
   * Clear current sort and restore original order
   */
  clearSort(): void {
    this.currentSort = null;
    
    // Reset ARIA attributes and visual indicators
    const headers = this.element.querySelectorAll('thead th');
    headers.forEach(header => {
      header.setAttribute('aria-sort', 'none');
      header.classList.remove('public-good-table__header--sorted-asc', 'public-good-table__header--sorted-desc');
    });
    
    // Restore original row order
    const tbody = this.element.querySelector('tbody');
    if (tbody && this.originalData.length > 0) {
      // Clear current rows
      tbody.innerHTML = '';
      
      // Recreate original rows (simplified restoration)
      this.originalData.forEach(rowData => {
        const row = document.createElement('tr');
        row.className = rowData.classes || '';
        
        Object.values(rowData.data).forEach(cellData => {
          const cell = document.createElement('td');
          cell.className = 'public-good-table__cell';
          cell.textContent = cellData as string;
          row.appendChild(cell);
        });
        
        tbody.appendChild(row);
      });
      
      // Reapply responsive data labels if needed
      if (this.config.responsive) {
        this.setupResponsive();
      }
    }
    
    // Clear persisted sort
    if (this.config.persistSort && this.config.sortStorageKey) {
      localStorage.removeItem(this.config.sortStorageKey);
    }
  }

  /**
   * Add CSS class to table
   */
  addClass(className: string): void {
    this.element.classList.add(className);
  }

  /**
   * Remove CSS class from table
   */
  removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  /**
   * Check if table has CSS class
   */
  hasClass(className: string): boolean {
    return this.element.classList.contains(className);
  }

  /**
   * Get the table element
   */
  getElement(): HTMLTableElement {
    return this.element;
  }

  /**
   * Destroy the table instance
   */
  destroy(): void {
    // Remove event listeners
    const sortableHeaders = this.element.querySelectorAll('.public-good-table__header--sortable');
    sortableHeaders.forEach(header => {
      header.replaceWith(header.cloneNode(true));
    });
    
    // Clear sort state
    this.clearSort();
    
    // Remove classes
    this.element.classList.remove('public-good-table', 'public-good-table--responsive', 'public-good-table--sortable');
  }
}

/**
 * Create a basic table element
 */
export function createTable(options: TableOptions = {}): HTMLTableElement {
  const table = document.createElement('table');
  table.className = 'public-good-table';
  
  if (options.classes) {
    table.className += ` ${options.classes}`;
  }
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      table.setAttribute(key, value);
    });
  }
  
  if (options.caption) {
    const caption = document.createElement('caption');
    caption.className = 'public-good-table__caption';
    caption.textContent = options.caption;
    table.appendChild(caption);
  }
  
  return table;
}

/**
 * Create a data table with columns and rows
 */
export function createDataTable(
  columns: ColumnConfig[],
  rows: RowConfig[],
  options: TableOptions = {}
): HTMLTableElement {
  const table = createTable(options);
  
  // Create header
  const thead = document.createElement('thead');
  thead.className = 'public-good-table__head';
  
  const headerRow = document.createElement('tr');
  headerRow.className = 'public-good-table__row';
  
  columns.forEach(column => {
    const th = document.createElement('th');
    th.className = 'public-good-table__header';
    th.textContent = column.header;
    th.setAttribute('scope', column.scope || 'col');
    th.setAttribute('data-column', column.key);
    
    if (column.numeric) {
      th.classList.add('public-good-table__header--numeric');
    }
    
    if (column.classes) {
      th.className += ` ${column.classes}`;
    }
    
    if (options.sortable && column.sortable !== false) {
      th.classList.add('public-good-table__header--sortable');
    } else if (column.sortable === false) {
      th.setAttribute('data-no-sort', '');
    }
    
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create body
  const tbody = document.createElement('tbody');
  tbody.className = 'public-good-table__body';
  
  rows.forEach(rowConfig => {
    const tr = document.createElement('tr');
    tr.className = 'public-good-table__row';
    
    if (rowConfig.classes) {
      tr.className += ` ${rowConfig.classes}`;
    }
    
    if (rowConfig.attributes) {
      Object.entries(rowConfig.attributes).forEach(([key, value]) => {
        tr.setAttribute(key, value);
      });
    }
    
    columns.forEach(column => {
      const td = document.createElement('td');
      td.className = 'public-good-table__cell';
      
      const cellValue = rowConfig.data[column.key];
      const displayValue = column.format ? column.format(cellValue) : cellValue;
      
      if (typeof displayValue === 'string') {
        td.textContent = displayValue;
      } else {
        td.appendChild(displayValue);
      }
      
      if (column.numeric) {
        td.classList.add('public-good-table__cell--numeric');
      }
      
      if (column.classes) {
        td.className += ` ${column.classes}`;
      }
      
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  return table;
}

/**
 * Initialize table components from existing markup
 */
export function initializeTables(scope: Document | HTMLElement = document): Table[] {
  const tableElements = scope.querySelectorAll('[data-module="public-good-table"]') as NodeListOf<HTMLTableElement>;
  const instances: Table[] = [];
  
  tableElements.forEach(element => {
    try {
      const config: TableConfig = {};
      
      // Parse configuration from data attributes
      if (element.hasAttribute('data-sortable')) {
        config.sortable = element.getAttribute('data-sortable') !== 'false';
      }
      
      if (element.hasAttribute('data-responsive')) {
        config.responsive = element.getAttribute('data-responsive') !== 'false';
      }
      
      if (element.hasAttribute('data-persist-sort')) {
        config.persistSort = element.getAttribute('data-persist-sort') !== 'false';
      }
      
      if (element.hasAttribute('data-sort-storage-key')) {
        config.sortStorageKey = element.getAttribute('data-sort-storage-key') || undefined;
      }
      
      const instance = new Table(element, config);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize table:', error);
    }
  });
  
  return instances;
}

/**
 * Validate table accessibility
 */
export function validateTableAccessibility(
  scope: Document | HTMLElement = document
): {
  tables: HTMLTableElement[];
  issues: string[];
} {
  const tables = scope.querySelectorAll('table') as NodeListOf<HTMLTableElement>;
  const issues: string[] = [];
  
  tables.forEach((table, index) => {
    const tableNumber = index + 1;
    
    // Check for caption or aria-label
    const caption = table.querySelector('caption');
    const ariaLabel = table.getAttribute('aria-label');
    const ariaLabelledBy = table.getAttribute('aria-labelledby');
    
    if (!caption && !ariaLabel && !ariaLabelledBy) {
      issues.push(`Table ${tableNumber} should have a caption or aria-label for accessibility`);
    }
    
    // Check for proper header structure
    const thead = table.querySelector('thead');
    const headers = table.querySelectorAll('th');
    
    if (headers.length === 0) {
      issues.push(`Table ${tableNumber} should have header cells (th elements)`);
    }
    
    // Check scope attributes
    headers.forEach((header, headerIndex) => {
      if (!header.getAttribute('scope')) {
        issues.push(`Table ${tableNumber} header ${headerIndex + 1} should have a scope attribute`);
      }
    });
    
    // Check for proper tbody structure
    const tbody = table.querySelector('tbody');
    if (!tbody && table.querySelector('tr')) {
      issues.push(`Table ${tableNumber} should use tbody element for better structure`);
    }
  });
  
  return {
    tables: Array.from(tables),
    issues
  };
}