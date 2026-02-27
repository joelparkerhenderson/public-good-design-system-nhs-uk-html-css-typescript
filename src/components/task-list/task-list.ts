/**
 * Task List Component
 * Converted from NHS UK Design System to Public Good Design System
 * 
 * Provides a structured way to track progress through multi-step processes.
 */

/**
 * Available task statuses
 */
export type TaskStatus = 'completed' | 'incomplete' | 'cannot-start' | 'in-progress';

/**
 * Configuration options for task creation
 */
export interface TaskOptions {
  id?: string;
  title: string;
  hint?: string;
  status: TaskStatus;
  href?: string;
  classes?: string;
  attributes?: Record<string, string>;
  onClick?: (task: TaskOptions) => void;
}

/**
 * Configuration options for task list creation
 */
export interface TaskListOptions {
  tasks: TaskOptions[];
  classes?: string;
  attributes?: Record<string, string>;
  idPrefix?: string;
}

/**
 * Task list configuration for the TaskList class
 */
export interface TaskListConfig {
  allowReordering?: boolean;
  trackProgress?: boolean;
  autoSave?: boolean;
  storageKey?: string;
  onTaskClick?: (task: TaskOptions, index: number) => void;
  onStatusChange?: (task: TaskOptions, index: number, oldStatus: TaskStatus) => void;
  onProgressUpdate?: (completed: number, total: number) => void;
}

/**
 * Enhanced TaskList class for managing interactive task lists
 */
export class TaskList {
  private element: HTMLElement;
  private config: TaskListConfig;
  private tasks: TaskOptions[] = [];

  constructor(element: HTMLElement, tasks: TaskOptions[], config: TaskListConfig = {}) {
    if (!element) {
      throw new Error('TaskList component requires a container element');
    }

    this.element = element;
    this.tasks = [...tasks];
    this.config = {
      allowReordering: false,
      trackProgress: true,
      autoSave: false,
      storageKey: 'task-list-state',
      ...config
    };

    this.init();
  }

  private init(): void {
    this.element.classList.add('public-good-task-list');
    
    // Restore state if auto-save is enabled
    if (this.config.autoSave) {
      this.restoreState();
    }

    this.render();
    this.setupEventListeners();
    
    // Initial progress update
    if (this.config.trackProgress) {
      this.updateProgress();
    }
  }

  private render(): void {
    this.element.innerHTML = '';
    
    const list = document.createElement('ul');
    list.className = 'public-good-task-list__list';
    
    this.tasks.forEach((task, index) => {
      const listItem = this.createTaskItem(task, index);
      list.appendChild(listItem);
    });
    
    this.element.appendChild(list);
  }

  private createTaskItem(task: TaskOptions, index: number): HTMLElement {
    const listItem = document.createElement('li');
    listItem.className = 'public-good-task-list__item';
    
    if (task.classes) {
      listItem.className += ` ${task.classes}`;
    }
    
    // Add custom attributes
    if (task.attributes) {
      Object.entries(task.attributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });
    }
    
    const link = document.createElement(task.href ? 'a' : 'div');
    link.className = 'public-good-task-list__link';
    
    if (task.href) {
      (link as HTMLAnchorElement).href = task.href;
    }
    
    if (task.id) {
      link.id = task.id;
    }
    
    // Task content
    const nameAndHint = document.createElement('div');
    nameAndHint.className = 'public-good-task-list__name-and-hint';
    
    const name = document.createElement('div');
    name.className = 'public-good-task-list__name';
    name.textContent = task.title;
    nameAndHint.appendChild(name);
    
    if (task.hint) {
      const hint = document.createElement('div');
      hint.className = 'public-good-task-list__hint';
      hint.textContent = task.hint;
      nameAndHint.appendChild(hint);
    }
    
    link.appendChild(nameAndHint);
    
    // Status
    const status = document.createElement('div');
    status.className = 'public-good-task-list__status';
    status.setAttribute('aria-describedby', `task-${index}-status`);
    
    const statusText = this.getStatusText(task.status);
    status.innerHTML = `<span id="task-${index}-status" class="public-good-task-list__status-text">${statusText}</span>`;
    
    link.appendChild(status);
    listItem.appendChild(link);
    
    // Add click handler
    link.addEventListener('click', (event) => {
      if (task.status === 'cannot-start') {
        event.preventDefault();
        return;
      }
      
      if (task.onClick) {
        event.preventDefault();
        task.onClick(task);
      }
      
      if (this.config.onTaskClick) {
        this.config.onTaskClick(task, index);
      }
    });
    
    return listItem;
  }

  private getStatusText(status: TaskStatus): string {
    const statusTexts = {
      'completed': '<strong>Completed</strong>',
      'incomplete': '<span class="public-good-task-list__status-incomplete">Incomplete</span>',
      'cannot-start': '<span class="public-good-task-list__status-cannot-start">Cannot start yet</span>',
      'in-progress': '<span class="public-good-task-list__status-in-progress">In progress</span>'
    };
    
    return statusTexts[status] || statusTexts.incomplete;
  }

  private setupEventListeners(): void {
    if (this.config.allowReordering) {
      this.setupDragAndDrop();
    }
  }

  private setupDragAndDrop(): void {
    const list = this.element.querySelector('.public-good-task-list__list');
    if (!list) return;
    
    list.addEventListener('dragstart', ((event: DragEvent) => {
      const target = event.target as HTMLElement;
      const item = target.closest('.public-good-task-list__item') as HTMLElement;
      if (item) {
        event.dataTransfer?.setData('text/html', item.outerHTML);
        item.classList.add('public-good-task-list__item--dragging');
      }
    }) as EventListener);
    
    list.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    
    list.addEventListener('drop', (event) => {
      event.preventDefault();
      // Implementation would depend on specific reordering requirements
    });
    
    // Make items draggable
    list.querySelectorAll('.public-good-task-list__item').forEach(item => {
      item.setAttribute('draggable', 'true');
    });
  }

  private updateProgress(): void {
    const completed = this.tasks.filter(task => task.status === 'completed').length;
    const total = this.tasks.length;
    
    if (this.config.onProgressUpdate) {
      this.config.onProgressUpdate(completed, total);
    }
    
    // Emit custom event
    this.element.dispatchEvent(new CustomEvent('task-list:progress', {
      detail: { completed, total, percentage: (completed / total) * 100 }
    }));
  }

  private saveState(): void {
    if (this.config.autoSave && this.config.storageKey) {
      try {
        const state = {
          tasks: this.tasks,
          lastUpdated: Date.now()
        };
        localStorage.setItem(this.config.storageKey, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save task list state:', error);
      }
    }
  }

  private restoreState(): void {
    if (this.config.storageKey) {
      try {
        const stored = localStorage.getItem(this.config.storageKey);
        if (stored) {
          const state = JSON.parse(stored);
          if (state.tasks && Array.isArray(state.tasks)) {
            this.tasks = state.tasks;
          }
        }
      } catch (error) {
        console.warn('Failed to restore task list state:', error);
      }
    }
  }

  /**
   * Get all tasks
   */
  getTasks(): TaskOptions[] {
    return [...this.tasks];
  }

  /**
   * Get a specific task by index
   */
  getTask(index: number): TaskOptions | null {
    return this.tasks[index] || null;
  }

  /**
   * Update task status
   */
  setTaskStatus(index: number, status: TaskStatus): void {
    if (index < 0 || index >= this.tasks.length) {
      return;
    }

    const task = this.tasks[index];
    if (!task) return;
    const oldStatus = task.status;
    task.status = status;

    // Re-render the specific task item
    this.render();

    // Trigger callbacks
    if (this.config.onStatusChange) {
      this.config.onStatusChange(task, index, oldStatus);
    }

    if (this.config.trackProgress) {
      this.updateProgress();
    }

    if (this.config.autoSave) {
      this.saveState();
    }

    // Emit status change event
    this.element.dispatchEvent(new CustomEvent('task-list:status-change', {
      detail: { task, index, oldStatus, newStatus: status }
    }));
  }

  /**
   * Add a new task
   */
  addTask(task: TaskOptions, index?: number): void {
    const insertIndex = index !== undefined ? index : this.tasks.length;
    this.tasks.splice(insertIndex, 0, task);
    
    this.render();
    
    if (this.config.trackProgress) {
      this.updateProgress();
    }

    if (this.config.autoSave) {
      this.saveState();
    }

    // Emit task added event
    this.element.dispatchEvent(new CustomEvent('task-list:task-added', {
      detail: { task, index: insertIndex }
    }));
  }

  /**
   * Remove a task
   */
  removeTask(index: number): void {
    if (index < 0 || index >= this.tasks.length) {
      return;
    }

    const removedTask = this.tasks.splice(index, 1)[0];
    
    this.render();
    
    if (this.config.trackProgress) {
      this.updateProgress();
    }

    if (this.config.autoSave) {
      this.saveState();
    }

    // Emit task removed event
    this.element.dispatchEvent(new CustomEvent('task-list:task-removed', {
      detail: { task: removedTask, index }
    }));
  }

  /**
   * Get progress statistics
   */
  getProgress(): { completed: number; total: number; percentage: number } {
    const completed = this.tasks.filter(task => task.status === 'completed').length;
    const total = this.tasks.length;
    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  }

  /**
   * Get the task list element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Destroy the task list instance
   */
  destroy(): void {
    // Remove event listeners by cloning the element
    const newElement = this.element.cloneNode(true) as HTMLElement;
    this.element.parentNode?.replaceChild(newElement, this.element);
    
    // Clear state
    if (this.config.autoSave && this.config.storageKey) {
      try {
        localStorage.removeItem(this.config.storageKey);
      } catch (error) {
        console.warn('Failed to clear task list state:', error);
      }
    }
  }
}

/**
 * Create a task list element from options
 */
export function createTaskList(options: TaskListOptions): HTMLElement {
  const container = document.createElement('div');
  container.className = `public-good-task-list ${options.classes || ''}`;
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      container.setAttribute(key, value);
    });
  }
  
  const list = document.createElement('ul');
  list.className = 'public-good-task-list__list';
  
  options.tasks.forEach((task, index) => {
    const listItem = createTaskItem(task, options.idPrefix ? `${options.idPrefix}-${index}` : undefined);
    list.appendChild(listItem);
  });
  
  container.appendChild(list);
  return container;
}

/**
 * Create a single task item
 */
export function createTaskItem(task: TaskOptions, id?: string): HTMLElement {
  const listItem = document.createElement('li');
  listItem.className = `public-good-task-list__item ${task.classes || ''}`;
  
  if (task.attributes) {
    Object.entries(task.attributes).forEach(([key, value]) => {
      listItem.setAttribute(key, value);
    });
  }
  
  const link = document.createElement(task.href ? 'a' : 'div');
  link.className = 'public-good-task-list__link';
  
  if (task.href && task.status !== 'cannot-start') {
    (link as HTMLAnchorElement).href = task.href;
  }
  
  if (id || task.id) {
    link.id = id || task.id!;
  }
  
  // Task content
  const nameAndHint = document.createElement('div');
  nameAndHint.className = 'public-good-task-list__name-and-hint';
  
  const name = document.createElement('div');
  name.className = 'public-good-task-list__name';
  name.textContent = task.title;
  nameAndHint.appendChild(name);
  
  if (task.hint) {
    const hint = document.createElement('div');
    hint.className = 'public-good-task-list__hint';
    hint.textContent = task.hint;
    nameAndHint.appendChild(hint);
  }
  
  link.appendChild(nameAndHint);
  
  // Status
  const status = document.createElement('div');
  status.className = 'public-good-task-list__status';
  
  const statusTexts = {
    'completed': '<strong>Completed</strong>',
    'incomplete': '<span class="public-good-task-list__status-incomplete">Incomplete</span>',
    'cannot-start': '<span class="public-good-task-list__status-cannot-start">Cannot start yet</span>',
    'in-progress': '<span class="public-good-task-list__status-in-progress">In progress</span>'
  };
  
  status.innerHTML = statusTexts[task.status] || statusTexts.incomplete;
  link.appendChild(status);
  
  listItem.appendChild(link);
  
  // Add disabled styling for cannot-start tasks
  if (task.status === 'cannot-start') {
    link.setAttribute('aria-disabled', 'true');
    link.classList.add('public-good-task-list__link--disabled');
  }
  
  return listItem;
}

/**
 * Initialize task lists from existing markup
 */
export function initializeTaskLists(scope: Document | HTMLElement = document): TaskList[] {
  const taskListElements = scope.querySelectorAll('[data-module="public-good-task-list"]') as NodeListOf<HTMLElement>;
  const instances: TaskList[] = [];
  
  taskListElements.forEach(element => {
    try {
      // Check for minimum required structure
      if (!element.querySelector('.public-good-task-list__list') && !element.querySelector('.public-good-task-list__item')) {
        throw new Error('Invalid task list structure: missing required elements');
      }

      // Extract tasks from existing markup
      const tasks: TaskOptions[] = [];
      const items = element.querySelectorAll('.public-good-task-list__item');
      
      items.forEach((item) => {
        const link = item.querySelector('.public-good-task-list__link') as HTMLElement;
        const nameEl = item.querySelector('.public-good-task-list__name');
        const hintEl = item.querySelector('.public-good-task-list__hint');
        const statusEl = item.querySelector('.public-good-task-list__status');
        
        if (nameEl && statusEl) {
          const task: TaskOptions = {
            id: link.id || undefined,
            title: nameEl.textContent || '',
            hint: hintEl?.textContent || undefined,
            status: determineStatusFromElement(statusEl),
            href: (link as HTMLAnchorElement).href || undefined
          };
          
          tasks.push(task);
        }
      });
      
      // Parse configuration from data attributes
      const config: TaskListConfig = {};
      
      if (element.hasAttribute('data-allow-reordering')) {
        config.allowReordering = element.getAttribute('data-allow-reordering') === 'true';
      }
      
      if (element.hasAttribute('data-track-progress')) {
        config.trackProgress = element.getAttribute('data-track-progress') !== 'false';
      }
      
      if (element.hasAttribute('data-auto-save')) {
        config.autoSave = element.getAttribute('data-auto-save') === 'true';
      }
      
      if (element.hasAttribute('data-storage-key')) {
        config.storageKey = element.getAttribute('data-storage-key') || undefined;
      }
      
      const instance = new TaskList(element, tasks, config);
      instances.push(instance);
    } catch (error) {
      console.error('Failed to initialize task list:', error);
    }
  });
  
  return instances;
}

/**
 * Determine task status from DOM element
 */
function determineStatusFromElement(statusEl: Element): TaskStatus {
  const text = statusEl.textContent?.toLowerCase() || '';
  
  if (text.includes('completed') || statusEl.querySelector('strong')) {
    return 'completed';
  } else if (text.includes('cannot start')) {
    return 'cannot-start';
  } else if (text.includes('in progress')) {
    return 'in-progress';
  }
  
  return 'incomplete';
}

/**
 * Validate task list accessibility
 */
export function validateTaskListAccessibility(
  scope: Document | HTMLElement = document
): {
  taskLists: HTMLElement[];
  issues: string[];
} {
  const taskLists = scope.querySelectorAll('.public-good-task-list') as NodeListOf<HTMLElement>;
  const issues: string[] = [];
  
  taskLists.forEach((taskList, listIndex) => {
    const listNumber = listIndex + 1;
    
    // Check for proper list structure
    const list = taskList.querySelector('ul.public-good-task-list__list');
    if (!list) {
      issues.push(`Task list ${listNumber} should contain a ul element with class 'public-good-task-list__list'`);
      return;
    }
    
    const items = list.querySelectorAll('.public-good-task-list__item');
    if (items.length === 0) {
      issues.push(`Task list ${listNumber} should contain task items`);
    }
    
    // Check each task item
    items.forEach((item, itemIndex) => {
      const itemNumber = itemIndex + 1;
      
      const link = item.querySelector('.public-good-task-list__link');
      if (!link) {
        issues.push(`Task ${itemNumber} in list ${listNumber} should have a link element`);
        return;
      }
      
      const name = item.querySelector('.public-good-task-list__name');
      if (!name || !name.textContent?.trim()) {
        issues.push(`Task ${itemNumber} in list ${listNumber} should have a name`);
      }
      
      const status = item.querySelector('.public-good-task-list__status');
      if (!status) {
        issues.push(`Task ${itemNumber} in list ${listNumber} should have a status element`);
      }
      
      // Check accessibility attributes for disabled tasks
      if (link.classList.contains('public-good-task-list__link--disabled')) {
        if (!link.getAttribute('aria-disabled')) {
          issues.push(`Disabled task ${itemNumber} in list ${listNumber} should have aria-disabled attribute`);
        }
      }
    });
  });
  
  return {
    taskLists: Array.from(taskLists),
    issues
  };
}