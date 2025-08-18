import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  TaskList,
  createTaskList,
  createTaskItem,
  initializeTaskLists,
  validateTaskListAccessibility,
  type TaskStatus,
  type TaskOptions,
  type TaskListOptions,
  type TaskListConfig
} from './task-list';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
} as any;

describe('Task List Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createTaskList', () => {
    it('should create a basic task list with tasks', () => {
      const options: TaskListOptions = {
        tasks: [
          { title: 'Task 1', status: 'completed' },
          { title: 'Task 2', status: 'incomplete' },
          { title: 'Task 3', status: 'cannot-start' }
        ]
      };

      const taskList = createTaskList(options);

      expect(taskList.classList.contains('public-good-task-list')).toBe(true);
      
      const list = taskList.querySelector('.public-good-task-list__list');
      expect(list).toBeTruthy();
      expect(list?.children).toHaveLength(3);
    });

    it('should add custom classes and attributes', () => {
      const options: TaskListOptions = {
        tasks: [{ title: 'Test Task', status: 'incomplete' }],
        classes: 'custom-class',
        attributes: { 'data-test': 'task-list' }
      };

      const taskList = createTaskList(options);

      expect(taskList.classList.contains('custom-class')).toBe(true);
      expect(taskList.getAttribute('data-test')).toBe('task-list');
    });

    it('should generate IDs with prefix', () => {
      const options: TaskListOptions = {
        tasks: [{ title: 'Test Task', status: 'incomplete' }],
        idPrefix: 'custom'
      };

      const taskList = createTaskList(options);
      const link = taskList.querySelector('.public-good-task-list__link');
      
      expect(link?.id).toBe('custom-0');
    });
  });

  describe('createTaskItem', () => {
    it('should create a task item with all properties', () => {
      const task: TaskOptions = {
        id: 'test-task',
        title: 'Test Task',
        hint: 'This is a hint',
        status: 'completed',
        href: '/test',
        classes: 'custom-task',
        attributes: { 'data-task': 'test' }
      };

      const item = createTaskItem(task);

      expect(item.classList.contains('public-good-task-list__item')).toBe(true);
      expect(item.classList.contains('custom-task')).toBe(true);
      expect(item.getAttribute('data-task')).toBe('test');

      const link = item.querySelector('.public-good-task-list__link') as HTMLAnchorElement;
      expect(link.href).toContain('/test');
      expect(link.id).toBe('test-task');

      const name = item.querySelector('.public-good-task-list__name');
      expect(name?.textContent).toBe('Test Task');

      const hint = item.querySelector('.public-good-task-list__hint');
      expect(hint?.textContent).toBe('This is a hint');

      const status = item.querySelector('.public-good-task-list__status');
      expect(status?.innerHTML).toContain('Completed');
    });

    it('should handle different task statuses', () => {
      const statuses: TaskStatus[] = ['completed', 'incomplete', 'cannot-start', 'in-progress'];
      
      statuses.forEach(status => {
        const task: TaskOptions = {
          title: `${status} task`,
          status
        };

        const item = createTaskItem(task);
        const statusEl = item.querySelector('.public-good-task-list__status');
        
        expect(statusEl).toBeTruthy();
        
        if (status === 'completed') {
          expect(statusEl?.innerHTML).toContain('Completed');
          expect(statusEl?.querySelector('strong')).toBeTruthy();
        } else if (status === 'cannot-start') {
          expect(statusEl?.innerHTML).toContain('Cannot start yet');
        } else if (status === 'in-progress') {
          expect(statusEl?.innerHTML).toContain('In progress');
        }
      });
    });

    it('should create div instead of link when no href', () => {
      const task: TaskOptions = {
        title: 'No Link Task',
        status: 'incomplete'
      };

      const item = createTaskItem(task);
      const link = item.querySelector('.public-good-task-list__link');
      
      expect(link?.tagName).toBe('DIV');
    });

    it('should disable cannot-start tasks', () => {
      const task: TaskOptions = {
        title: 'Disabled Task',
        status: 'cannot-start',
        href: '/test'
      };

      const item = createTaskItem(task);
      const link = item.querySelector('.public-good-task-list__link');
      
      expect(link?.getAttribute('aria-disabled')).toBe('true');
      expect(link?.classList.contains('public-good-task-list__link--disabled')).toBe(true);
    });
  });

  describe('TaskList Class', () => {
    let taskListElement: HTMLElement;
    let tasks: TaskOptions[];
    let instance: TaskList;

    beforeEach(() => {
      tasks = [
        { title: 'Task 1', status: 'completed' },
        { title: 'Task 2', status: 'in-progress' },
        { title: 'Task 3', status: 'incomplete' }
      ];

      taskListElement = document.createElement('div');
      container.appendChild(taskListElement);

      instance = new TaskList(taskListElement, tasks);
    });

    afterEach(() => {
      instance?.destroy();
    });

    it('should initialize correctly', () => {
      expect(instance).toBeDefined();
      expect(taskListElement.classList.contains('public-good-task-list')).toBe(true);
      expect(instance.getTasks()).toHaveLength(3);
      expect(instance.getTask(0)?.title).toBe('Task 1');
    });

    it('should throw error for invalid element', () => {
      expect(() => {
        new TaskList(null as any, []);
      }).toThrow('TaskList component requires a container element');
    });

    it('should handle task status changes', () => {
      instance.setTaskStatus(1, 'completed');
      
      expect(instance.getTask(1)?.status).toBe('completed');
    });

    it('should emit status change events', () => {
      const eventSpy = vi.fn();
      taskListElement.addEventListener('task-list:status-change', eventSpy);

      instance.setTaskStatus(1, 'completed');

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.newStatus).toBe('completed');
      expect(eventSpy.mock.calls[0][0].detail.oldStatus).toBe('in-progress');
    });

    it('should add new tasks', () => {
      const newTask: TaskOptions = {
        title: 'New Task',
        status: 'incomplete'
      };

      instance.addTask(newTask);

      expect(instance.getTasks()).toHaveLength(4);
      expect(instance.getTask(3)?.title).toBe('New Task');
    });

    it('should add task at specific position', () => {
      const newTask: TaskOptions = {
        title: 'Inserted Task',
        status: 'incomplete'
      };

      instance.addTask(newTask, 1);

      expect(instance.getTasks()).toHaveLength(4);
      expect(instance.getTask(1)?.title).toBe('Inserted Task');
    });

    it('should emit task added events', () => {
      const eventSpy = vi.fn();
      taskListElement.addEventListener('task-list:task-added', eventSpy);

      const newTask: TaskOptions = {
        title: 'New Task',
        status: 'incomplete'
      };

      instance.addTask(newTask);

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.task.title).toBe('New Task');
    });

    it('should remove tasks', () => {
      instance.removeTask(1);

      expect(instance.getTasks()).toHaveLength(2);
      expect(instance.getTask(1)?.title).toBe('Task 3');
    });

    it('should emit task removed events', () => {
      const eventSpy = vi.fn();
      taskListElement.addEventListener('task-list:task-removed', eventSpy);

      instance.removeTask(1);

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.task.title).toBe('Task 2');
      expect(eventSpy.mock.calls[0][0].detail.index).toBe(1);
    });

    it('should handle invalid task indices', () => {
      expect(() => instance.setTaskStatus(-1, 'completed')).not.toThrow();
      expect(() => instance.setTaskStatus(10, 'completed')).not.toThrow();
      expect(() => instance.removeTask(-1)).not.toThrow();
      expect(() => instance.removeTask(10)).not.toThrow();
    });

    it('should calculate progress correctly', () => {
      const progress = instance.getProgress();

      expect(progress.completed).toBe(1);
      expect(progress.total).toBe(3);
      expect(progress.percentage).toBeCloseTo(33.33, 2);
    });

    it('should emit progress events', () => {
      const eventSpy = vi.fn();
      taskListElement.addEventListener('task-list:progress', eventSpy);

      instance.setTaskStatus(1, 'completed');

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.completed).toBe(2);
      expect(eventSpy.mock.calls[0][0].detail.total).toBe(3);
    });

    it('should trigger onStatusChange callback', () => {
      const callbackSpy = vi.fn();
      const configuredInstance = new TaskList(
        taskListElement,
        tasks,
        { onStatusChange: callbackSpy }
      );

      configuredInstance.setTaskStatus(1, 'completed');

      expect(callbackSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Task 2' }),
        1,
        'in-progress'
      );

      configuredInstance.destroy();
    });

    it('should trigger onProgressUpdate callback', () => {
      const callbackSpy = vi.fn();
      const configuredInstance = new TaskList(
        taskListElement,
        tasks,
        { onProgressUpdate: callbackSpy }
      );

      configuredInstance.setTaskStatus(1, 'completed');

      expect(callbackSpy).toHaveBeenCalledWith(2, 3);

      configuredInstance.destroy();
    });

    it('should handle task clicks', () => {
      const clickSpy = vi.fn();
      const callbackSpy = vi.fn();
      
      const tasksWithClick = [
        { title: 'Clickable Task', status: 'incomplete' as TaskStatus, onClick: clickSpy }
      ];

      const clickableInstance = new TaskList(
        taskListElement,
        tasksWithClick,
        { onTaskClick: callbackSpy }
      );

      const link = taskListElement.querySelector('.public-good-task-list__link') as HTMLElement;
      link.click();

      expect(clickSpy).toHaveBeenCalled();
      expect(callbackSpy).toHaveBeenCalled();

      clickableInstance.destroy();
    });

    it('should return correct element', () => {
      expect(instance.getElement()).toBe(taskListElement);
    });
  });

  describe('Storage and State Management', () => {
    let taskListElement: HTMLElement;
    let tasks: TaskOptions[];

    beforeEach(() => {
      tasks = [
        { title: 'Task 1', status: 'completed' },
        { title: 'Task 2', status: 'incomplete' }
      ];

      taskListElement = document.createElement('div');
      container.appendChild(taskListElement);
    });

    it('should save state when autoSave is enabled', () => {
      const instance = new TaskList(taskListElement, tasks, {
        autoSave: true,
        storageKey: 'test-task-list'
      });

      instance.setTaskStatus(1, 'completed');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-task-list',
        expect.stringContaining('"status":"completed"')
      );

      instance.destroy();
    });

    it('should restore state from localStorage', () => {
      const mockStateData = JSON.stringify({
        tasks: [
          { title: 'Task 1', status: 'completed' },
          { title: 'Task 2', status: 'completed' }
        ],
        lastUpdated: Date.now()
      });
      (localStorage.getItem as any).mockReturnValue(mockStateData);

      const instance = new TaskList(taskListElement, tasks, {
        autoSave: true,
        storageKey: 'test-task-list'
      });

      expect(localStorage.getItem).toHaveBeenCalledWith('test-task-list');
      expect(instance.getTask(1)?.status).toBe('completed');

      instance.destroy();
    });

    it('should handle localStorage errors gracefully', () => {
      (localStorage.getItem as any).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const instance = new TaskList(taskListElement, tasks, {
        autoSave: true,
        storageKey: 'test-task-list'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to restore task list state:', expect.any(Error));

      consoleSpy.mockRestore();
      instance.destroy();
    });

    it('should clear state when destroyed', () => {
      const instance = new TaskList(taskListElement, tasks, {
        autoSave: true,
        storageKey: 'test-task-list'
      });

      instance.destroy();

      expect(localStorage.removeItem).toHaveBeenCalledWith('test-task-list');
    });
  });

  describe('initializeTaskLists', () => {
    it('should initialize task lists from data attributes', () => {
      const taskList1 = createTaskList({
        tasks: [{ title: 'Task 1', status: 'completed' }],
        attributes: { 'data-module': 'public-good-task-list' }
      });
      const taskList2 = createTaskList({
        tasks: [{ title: 'Task 2', status: 'incomplete' }],
        attributes: {
          'data-module': 'public-good-task-list',
          'data-auto-save': 'true',
          'data-storage-key': 'custom-key'
        }
      });

      container.appendChild(taskList1);
      container.appendChild(taskList2);

      const instances = initializeTaskLists(container);

      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(TaskList);
      expect(instances[1]).toBeInstanceOf(TaskList);

      // Clean up
      instances.forEach(instance => instance.destroy());
    });

    it('should handle initialization errors gracefully', () => {
      const invalidElement = document.createElement('div');
      invalidElement.setAttribute('data-module', 'public-good-task-list');
      // Create invalid structure without proper task items
      container.appendChild(invalidElement);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const instances = initializeTaskLists(container);

      expect(instances).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize task list:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should work with document scope', () => {
      const taskList = createTaskList({
        tasks: [{ title: 'Global Task', status: 'incomplete' }],
        attributes: { 'data-module': 'public-good-task-list' }
      });
      document.body.appendChild(taskList);

      const instances = initializeTaskLists();

      expect(instances.length).toBeGreaterThan(0);

      // Clean up
      instances.forEach(instance => instance.destroy());
      taskList.remove();
    });
  });

  describe('validateTaskListAccessibility', () => {
    beforeEach(() => {
      container.innerHTML = '';
    });

    it('should validate properly structured task lists', () => {
      const taskList = createTaskList({
        tasks: [
          { title: 'Task 1', status: 'completed' },
          { title: 'Task 2', status: 'incomplete' }
        ]
      });
      container.appendChild(taskList);

      const result = validateTaskListAccessibility(container);

      expect(result.taskLists).toHaveLength(1);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect missing list structure', () => {
      const badTaskList = document.createElement('div');
      badTaskList.className = 'public-good-task-list';
      badTaskList.innerHTML = '<div>Not a proper list</div>';
      container.appendChild(badTaskList);

      const result = validateTaskListAccessibility(container);

      expect(result.issues).toContain("Task list 1 should contain a ul element with class 'public-good-task-list__list'");
    });

    it('should detect empty task lists', () => {
      const emptyTaskList = document.createElement('div');
      emptyTaskList.className = 'public-good-task-list';
      emptyTaskList.innerHTML = '<ul class="public-good-task-list__list"></ul>';
      container.appendChild(emptyTaskList);

      const result = validateTaskListAccessibility(container);

      expect(result.issues).toContain('Task list 1 should contain task items');
    });

    it('should detect missing task names', () => {
      const taskList = document.createElement('div');
      taskList.className = 'public-good-task-list';
      taskList.innerHTML = `
        <ul class="public-good-task-list__list">
          <li class="public-good-task-list__item">
            <div class="public-good-task-list__link">
              <div class="public-good-task-list__name-and-hint"></div>
              <div class="public-good-task-list__status">Incomplete</div>
            </div>
          </li>
        </ul>
      `;
      container.appendChild(taskList);

      const result = validateTaskListAccessibility(container);

      expect(result.issues).toContain('Task 1 in list 1 should have a name');
    });

    it('should detect missing status elements', () => {
      const taskList = document.createElement('div');
      taskList.className = 'public-good-task-list';
      taskList.innerHTML = `
        <ul class="public-good-task-list__list">
          <li class="public-good-task-list__item">
            <div class="public-good-task-list__link">
              <div class="public-good-task-list__name-and-hint">
                <div class="public-good-task-list__name">Task Name</div>
              </div>
            </div>
          </li>
        </ul>
      `;
      container.appendChild(taskList);

      const result = validateTaskListAccessibility(container);

      expect(result.issues).toContain('Task 1 in list 1 should have a status element');
    });

    it('should detect missing aria-disabled for disabled tasks', () => {
      const taskList = document.createElement('div');
      taskList.className = 'public-good-task-list';
      taskList.innerHTML = `
        <ul class="public-good-task-list__list">
          <li class="public-good-task-list__item">
            <div class="public-good-task-list__link public-good-task-list__link--disabled">
              <div class="public-good-task-list__name-and-hint">
                <div class="public-good-task-list__name">Disabled Task</div>
              </div>
              <div class="public-good-task-list__status">Cannot start yet</div>
            </div>
          </li>
        </ul>
      `;
      container.appendChild(taskList);

      const result = validateTaskListAccessibility(container);

      expect(result.issues).toContain('Disabled task 1 in list 1 should have aria-disabled attribute');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty task arrays', () => {
      const taskList = createTaskList({ tasks: [] });
      
      expect(taskList.querySelector('.public-good-task-list__list')).toBeTruthy();
      expect(taskList.querySelectorAll('.public-good-task-list__item')).toHaveLength(0);
    });

    it('should handle tasks without hints', () => {
      const task: TaskOptions = {
        title: 'Task without hint',
        status: 'incomplete'
      };

      const item = createTaskItem(task);
      const hint = item.querySelector('.public-good-task-list__hint');
      
      expect(hint).toBeNull();
    });

    it('should handle tasks without custom properties', () => {
      const task: TaskOptions = {
        title: 'Minimal task',
        status: 'incomplete'
      };

      const item = createTaskItem(task);
      
      expect(item.classList.contains('public-good-task-list__item')).toBe(true);
      expect(item.querySelector('.public-good-task-list__name')?.textContent).toBe('Minimal task');
    });

    it('should handle progress calculation with no tasks', () => {
      const emptyInstance = new TaskList(container, []);
      const progress = emptyInstance.getProgress();
      
      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(0);
      expect(progress.percentage).toBe(0);

      emptyInstance.destroy();
    });
  });

  describe('Performance', () => {
    it('should handle large numbers of tasks efficiently', () => {
      const start = performance.now();
      
      const manyTasks: TaskOptions[] = Array.from({ length: 1000 }, (_, i) => ({
        title: `Task ${i}`,
        status: ['completed', 'incomplete', 'in-progress', 'cannot-start'][i % 4] as TaskStatus
      }));
      
      const taskList = createTaskList({ tasks: manyTasks });
      
      const end = performance.now();
      
      expect(taskList.querySelectorAll('.public-good-task-list__item')).toHaveLength(1000);
      expect(end - start).toBeLessThan(200); // Should complete in under 200ms
    });
  });
});