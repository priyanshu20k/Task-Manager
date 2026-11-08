/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Counts the number of tasks that are not yet completed.
 * @param {Array} tasks 
 * @returns {number}
 */
export function countActiveTasks(tasks) {
  return tasks.filter(task => !task.completed).length;
}

/**
 * Formats the count of active tasks into standard text display.
 * @param {number} count 
 * @returns {string}
 */
export function formatCounterText(count) {
  return `${count} ${count === 1 ? 'task' : 'tasks'} left`;
}

/**
 * Determines if an incomplete task is overdue compared to a reference date string.
 * @param {Object} task 
 * @param {string} referenceDateStr - 'YYYY-MM-DD' formatting baseline
 * @returns {boolean}
 */
export function isTaskOverdue(task, referenceDateStr) {
  if (task.completed || !task.dueDate) return false;
  return task.dueDate < referenceDateStr;
}

/**
 * Filters tasks by status tab and a case-insensitive search phrase.
 * @param {Array} tasks 
 * @param {string} filter - 'all', 'active', or 'completed'
 * @param {string} query - Search phrase
 * @returns {Array}
 */
export function filterTasks(tasks, filter, query) {
  const lowercaseFilter = filter.toLowerCase();
  
  return tasks.filter(task => {
    // 1. Apply status tab criteria
    if (lowercaseFilter === 'active' && task.completed) return false;
    if (lowercaseFilter === 'completed' && !task.completed) return false;
    
    // 2. Apply text search query match
    if (query && query.trim() !== '') {
      return task.title.toLowerCase().includes(query.toLowerCase());
    }
    
    return true;
  });
}

/**
 * Sorts tasks based on the chosen strategy metric.
 * @param {Array} tasks 
 * @param {string} sortBy - 'dueDate' or 'priority'
 * @returns {Array}
 */
export function sortTasks(tasks, sortBy) {
  const result = [...tasks];
  
  if (sortBy === 'dueDate') {
    return result.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1; // Tasks without due date are pushed to the end
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  
  if (sortBy === 'priority') {
    const priorityWeight = { High: 1, Medium: 2, Low: 3 };
    return result.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
  }
  
  return result;
}

/**
 * Confirms if a prospective task title is blank or only whitespace.
 * @param {string} title 
 * @returns {Object} { isValid: boolean }
 */
export function validateTaskTitle(title) {
  return {
    isValid: title !== undefined && title !== null && title.trim().length > 0
  };
}

/**
 * Converts a standard YYYY-MM-DD date string into a local human-readable string.
 * Prevents timezone offset shifts by processing strings directly.
 * @param {string|null} dateStr 
 * @returns {string}
 */
export function formatDueDate(dateStr) {
  if (!dateStr) return 'No due date';
  
  const [year, month, day] = dateStr.split('-');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const parsedMonth = months[parseInt(month, 10) - 1];
  const parsedDay = parseInt(day, 10);
  
  return `${parsedMonth} ${parsedDay}, ${year}`;
}
