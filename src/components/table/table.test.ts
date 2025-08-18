import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  Table,
  createTable,
  createDataTable,
  initializeTables,
  validateTableAccessibility,
  type ColumnConfig,
  type RowConfig,
  type TableOptions
} from './table';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLTableElement = dom.window.HTMLTableElement;
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
} as any;

describe('Table Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createTable', () => {
    it('should create a basic table with default options', () => {
      const table = createTable();

      expect(table.classList.contains('public-good-table')).toBe(true);
      expect(table.tagName).toBe('TABLE');
    });

    it('should create table with caption', () => {
      const table = createTable({
        caption: 'Test Table Caption'
      });

      const caption = table.querySelector('.public-good-table__caption');
      expect(caption).toBeTruthy();
      expect(caption?.textContent).toBe('Test Table Caption');
    });

    it('should add custom classes and attributes', () => {
      const table = createTable({
        classes: 'custom-class another-class',
        attributes: {
          'data-test': 'table-value',
          'id': 'test-table'
        }
      });

      expect(table.classList.contains('custom-class')).toBe(true);
      expect(table.classList.contains('another-class')).toBe(true);
      expect(table.getAttribute('data-test')).toBe('table-value');
      expect(table.getAttribute('id')).toBe('test-table');
    });
  });

  describe('createDataTable', () => {
    it('should create a complete data table', () => {
      const columns: ColumnConfig[] = [
        { key: 'name', header: 'Name' },
        { key: 'age', header: 'Age', numeric: true },
        { key: 'email', header: 'Email' }
      ];

      const rows: RowConfig[] = [
        { data: { name: 'John Doe', age: '30', email: 'john@example.com' } },
        { data: { name: 'Jane Smith', age: '25', email: 'jane@example.com' } }
      ];

      const table = createDataTable(columns, rows, {
        caption: 'User Data',
        sortable: true
      });

      // Check structure
      expect(table.querySelector('caption')?.textContent).toBe('User Data');
      expect(table.querySelectorAll('thead th')).toHaveLength(3);
      expect(table.querySelectorAll('tbody tr')).toHaveLength(2);
      expect(table.querySelectorAll('tbody td')).toHaveLength(6);

      // Check headers
      const headers = table.querySelectorAll('thead th');
      expect(headers[0].textContent).toBe('Name');
      expect(headers[1].textContent).toBe('Age');
      expect(headers[1].classList.contains('public-good-table__header--numeric')).toBe(true);
      expect(headers[2].textContent).toBe('Email');

      // Check data
      const firstRow = table.querySelector('tbody tr');
      const cells = firstRow?.querySelectorAll('td');
      expect(cells?.[0].textContent).toBe('John Doe');
      expect(cells?.[1].textContent).toBe('30');
      expect(cells?.[2].textContent).toBe('john@example.com');
    });

    it('should handle custom formatters', () => {
      const columns: ColumnConfig[] = [
        { 
          key: 'price', 
          header: 'Price', 
          numeric: true, 
          format: (value) => `$${value}` 
        }
      ];

      const rows: RowConfig[] = [
        { data: { price: '10.99' } }
      ];

      const table = createDataTable(columns, rows);
      const cell = table.querySelector('tbody td');
      
      expect(cell?.textContent).toBe('$10.99');
    });

    it('should handle sortable configuration', () => {
      const columns: ColumnConfig[] = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'id', header: 'ID', sortable: false }
      ];

      const rows: RowConfig[] = [
        { data: { name: 'Test', id: '1' } }
      ];

      const table = createDataTable(columns, rows, { sortable: true });
      
      const headers = table.querySelectorAll('thead th');
      expect(headers[0].classList.contains('public-good-table__header--sortable')).toBe(true);
      expect(headers[1].hasAttribute('data-no-sort')).toBe(true);
    });
  });

  describe('Table Class', () => {
    let tableElement: HTMLTableElement;
    let instance: Table;

    beforeEach(() => {
      const columns: ColumnConfig[] = [
        { key: 'name', header: 'Name' },
        { key: 'score', header: 'Score', numeric: true }
      ];

      const rows: RowConfig[] = [
        { data: { name: 'Alice', score: '95' } },
        { data: { name: 'Bob', score: '87' } },
        { data: { name: 'Charlie', score: '92' } }
      ];

      tableElement = createDataTable(columns, rows, { sortable: true });
      container.appendChild(tableElement);

      instance = new Table(tableElement, {
        sortable: true,
        responsive: true
      });
    });

    afterEach(() => {
      instance?.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
      expect(tableElement.classList.contains('public-good-table')).toBe(true);
      expect(tableElement.classList.contains('public-good-table--sortable')).toBe(true);
      expect(tableElement.classList.contains('public-good-table--responsive')).toBe(true);
    });

    it('should throw error for non-table element', () => {
      const divElement = document.createElement('div');
      
      expect(() => {
        new Table(divElement as any);
      }).toThrow('Table component requires a table element');
    });

    it('should setup accessibility features', () => {
      expect(tableElement.getAttribute('role')).toBe('table');
      
      const headers = tableElement.querySelectorAll('th');
      headers.forEach(header => {
        expect(header.getAttribute('scope')).toBeTruthy();
      });
    });

    it('should setup responsive data labels', () => {
      const cells = tableElement.querySelectorAll('tbody td');
      
      cells.forEach(cell => {
        expect(cell.getAttribute('data-label')).toBeTruthy();
      });
    });

    it('should setup sortable headers', () => {
      const sortableHeaders = tableElement.querySelectorAll('.public-good-table__header--sortable');
      
      expect(sortableHeaders).toHaveLength(2);
      
      sortableHeaders.forEach(header => {
        expect(header.getAttribute('role')).toBe('columnheader');
        expect(header.getAttribute('tabindex')).toBe('0');
        expect(header.getAttribute('aria-sort')).toBe('none');
        expect(header.querySelector('.public-good-table__sort-button')).toBeTruthy();
      });
    });

    it('should handle sorting by column click', () => {
      const nameHeader = tableElement.querySelector('th[data-column="name"]') as HTMLElement;
      
      // Click to sort ascending
      nameHeader.click();
      
      expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');
      expect(nameHeader.classList.contains('public-good-table__header--sorted-asc')).toBe(true);
      
      const firstCell = tableElement.querySelector('tbody tr td');
      expect(firstCell?.textContent).toBe('Alice');
      
      // Click again to sort descending
      nameHeader.click();
      
      expect(nameHeader.getAttribute('aria-sort')).toBe('descending');
      expect(nameHeader.classList.contains('public-good-table__header--sorted-desc')).toBe(true);
      
      const firstCellDesc = tableElement.querySelector('tbody tr td');
      expect(firstCellDesc?.textContent).toBe('Charlie');
    });

    it('should handle numeric sorting', () => {
      const scoreHeader = tableElement.querySelector('th[data-column="score"]') as HTMLElement;
      
      // Sort by score (numeric)
      scoreHeader.click();
      
      const cells = tableElement.querySelectorAll('tbody tr td:nth-child(2)');
      expect(cells[0]?.textContent).toBe('87');
      expect(cells[1]?.textContent).toBe('92');
      expect(cells[2]?.textContent).toBe('95');
    });

    it('should handle keyboard navigation for sorting', () => {
      const nameHeader = tableElement.querySelector('th[data-column="name"]') as HTMLElement;
      
      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const enterPreventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');
      nameHeader.dispatchEvent(enterEvent);
      
      expect(enterPreventDefaultSpy).toHaveBeenCalled();
      expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');
      
      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      const spacePreventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');
      nameHeader.dispatchEvent(spaceEvent);
      
      expect(spacePreventDefaultSpy).toHaveBeenCalled();
      expect(nameHeader.getAttribute('aria-sort')).toBe('descending');
    });

    it('should emit sort events', () => {
      const eventSpy = vi.fn();
      tableElement.addEventListener('table:sorted', eventSpy);
      
      const nameHeader = tableElement.querySelector('th[data-column="name"]') as HTMLElement;
      nameHeader.click();
      
      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.table).toBe(instance);
      expect(eventSpy.mock.calls[0][0].detail.column).toBe('name');
      expect(eventSpy.mock.calls[0][0].detail.direction).toBe('asc');
    });

    it('should get current sort state', () => {
      expect(instance.getCurrentSort()).toBeNull();
      
      instance.setSort('name', 'desc');
      
      const currentSort = instance.getCurrentSort();
      expect(currentSort?.column).toBe('name');
      expect(currentSort?.direction).toBe('desc');
    });

    it('should clear sort and restore original order', () => {
      // Sort first
      instance.setSort('name', 'asc');
      expect(instance.getCurrentSort()).toBeTruthy();
      
      // Clear sort
      instance.clearSort();
      expect(instance.getCurrentSort()).toBeNull();
      
      // Check headers are reset
      const headers = tableElement.querySelectorAll('th');
      headers.forEach(header => {
        expect(header.getAttribute('aria-sort')).toBe('none');
        expect(header.classList.contains('public-good-table__header--sorted-asc')).toBe(false);
        expect(header.classList.contains('public-good-table__header--sorted-desc')).toBe(false);
      });
    });

    it('should manage CSS classes', () => {
      instance.addClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(true);
      expect(tableElement.classList.contains('custom-class')).toBe(true);

      instance.removeClass('custom-class');
      expect(instance.hasClass('custom-class')).toBe(false);
      expect(tableElement.classList.contains('custom-class')).toBe(false);
    });

    it('should return table element', () => {
      expect(instance.getElement()).toBe(tableElement);
    });
  });

  describe('Storage and Persistence', () => {
    let tableElement: HTMLTableElement;
    let instance: Table;

    beforeEach(() => {
      const columns: ColumnConfig[] = [
        { key: 'name', header: 'Name' }
      ];

      const rows: RowConfig[] = [
        { data: { name: 'Test' } }
      ];

      tableElement = createDataTable(columns, rows, { sortable: true });
      container.appendChild(tableElement);
    });

    afterEach(() => {
      instance?.destroy();
    });

    it('should persist sort state to localStorage', () => {
      instance = new Table(tableElement, {
        sortable: true,
        persistSort: true,
        sortStorageKey: 'test-table-sort'
      });

      instance.setSort('name', 'desc');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-table-sort',
        JSON.stringify({ column: 'name', direction: 'desc' })
      );
    });

    it('should restore sort state from localStorage', () => {
      const mockSortData = JSON.stringify({ column: 'name', direction: 'asc' });
      (localStorage.getItem as any).mockReturnValue(mockSortData);

      instance = new Table(tableElement, {
        sortable: true,
        persistSort: true,
        sortStorageKey: 'test-table-sort'
      });

      expect(localStorage.getItem).toHaveBeenCalledWith('test-table-sort');
    });

    it('should handle localStorage errors gracefully', () => {
      (localStorage.getItem as any).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      instance = new Table(tableElement, {
        sortable: true,
        persistSort: true,
        sortStorageKey: 'test-table-sort'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to restore table sort:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should clear persisted sort when clearSort is called', () => {
      instance = new Table(tableElement, {
        sortable: true,
        persistSort: true,
        sortStorageKey: 'test-table-sort'
      });

      instance.clearSort();

      expect(localStorage.removeItem).toHaveBeenCalledWith('test-table-sort');
    });
  });

  describe('initializeTables', () => {
    it('should initialize tables from data attributes', () => {
      const table1 = createTable({ attributes: { 'data-module': 'public-good-table' } });
      const table2 = createTable({
        attributes: {
          'data-module': 'public-good-table',
          'data-sortable': 'true',
          'data-responsive': 'true',
          'data-persist-sort': 'true',
          'data-sort-storage-key': 'custom-key'
        }
      });

      container.appendChild(table1);
      container.appendChild(table2);

      const instances = initializeTables(container);

      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(Table);
      expect(instances[1]).toBeInstanceOf(Table);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-table');
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeTables(container);

      expect(instances).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize table:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should work with document scope', () => {
      const table = createTable({ attributes: { 'data-module': 'public-good-table' } });
      document.body.appendChild(table);

      const instances = initializeTables();

      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });
  });

  describe('validateTableAccessibility', () => {
    it('should validate properly structured tables', () => {
      const table = createDataTable(
        [{ key: 'name', header: 'Name' }],
        [{ data: { name: 'Test' } }],
        { caption: 'Test Table' }
      );
      container.appendChild(table);

      const result = validateTableAccessibility(container);

      expect(result.tables).toHaveLength(1);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect missing captions', () => {
      const table = createTable();
      container.appendChild(table);

      const result = validateTableAccessibility(container);

      expect(result.issues).toContain('Table 1 should have a caption or aria-label for accessibility');
    });

    it('should detect missing headers', () => {
      const table = createTable();
      const tbody = document.createElement('tbody');
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = 'Data';
      row.appendChild(cell);
      tbody.appendChild(row);
      table.appendChild(tbody);
      container.appendChild(table);

      const result = validateTableAccessibility(container);

      expect(result.issues).toContain('Table 1 should have header cells (th elements)');
    });

    it('should detect missing scope attributes', () => {
      const table = createTable();
      const thead = document.createElement('thead');
      const row = document.createElement('tr');
      const header = document.createElement('th');
      header.textContent = 'Header';
      // Missing scope attribute
      row.appendChild(header);
      thead.appendChild(row);
      table.appendChild(thead);
      container.appendChild(table);

      const result = validateTableAccessibility(container);

      expect(result.issues).toContain('Table 1 header 1 should have a scope attribute');
    });

    it('should detect missing tbody structure', () => {
      const table = createTable();
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = 'Data';
      row.appendChild(cell);
      table.appendChild(row); // Direct child instead of tbody
      container.appendChild(table);

      const result = validateTableAccessibility(container);

      expect(result.issues).toContain('Table 1 should use tbody element for better structure');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty table gracefully', () => {
      const table = createTable();
      container.appendChild(table);

      const instance = new Table(table);
      
      expect(instance.getCurrentSort()).toBeNull();
      expect(() => instance.clearSort()).not.toThrow();
      
      instance.destroy();
    });

    it('should handle malformed HTML gracefully', () => {
      const table = createTable();
      table.innerHTML = '<tr><td>Malformed</td></tr>'; // No thead/tbody
      container.appendChild(table);

      const instance = new Table(table, { sortable: true });
      
      expect(() => instance.setSort('0', 'asc')).not.toThrow();
      
      instance.destroy();
    });

    it('should handle missing data gracefully in sorting', () => {
      const columns: ColumnConfig[] = [
        { key: 'value', header: 'Value', numeric: true }
      ];

      const rows: RowConfig[] = [
        { data: { value: '10' } },
        { data: { value: '' } }, // Empty value
        { data: { value: '5' } }
      ];

      const table = createDataTable(columns, rows, { sortable: true });
      container.appendChild(table);

      const instance = new Table(table, { sortable: true });
      
      expect(() => instance.setSort('value', 'asc')).not.toThrow();
      
      instance.destroy();
    });
  });
});