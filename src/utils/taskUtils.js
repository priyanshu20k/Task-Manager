/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRIORITY_WEIGHTS = {
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if an incomplete task is past its due date.
 * Completed tasks or tasks without a due date are NEVER overdue.
 */
export function isTaskOverdue(task, todayStr = getTodayDateString()) {
  if (task.completed || !task.dueDate) {
    return false;
  }
  return task.dueDate < todayStr;
}

/**
 * Formats a YYYY-MM-DD string into a human-readable date (e.g. "Jan 15, 2026")
 * without UTC timezone rollback artifacts.
 */
export function formatDueDate(dateString) {
  if (!dateString) return 'No due date';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return dateString;
}

/**
 * Validates a task title according to assignment rules:
 * - Required
 * - Blank or only spaces shows an error
 */
export function validateTaskTitle(title) {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      error: 'Task title is required and cannot be blank or only spaces.',
    };
  }
  return { isValid: true };
}

/**
 * Filters tasks based on completion status tab and search query string.
 * - Search is case-insensitive on task.title
 * - Search combines with the active filter tab
 */
export function filterTasks(tasks, filter, searchQuery) {
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();

  return tasks.filter((task) => {
    // Tab filter check
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;

    // Search query check
    if (normalizedQuery.length > 0) {
      return (task.title || '').toLowerCase().includes(normalizedQuery);
    }

    return true;
  });
}

/**
 * Sorts tasks based on the selected sort criteria:
 * - 'none': Original order preserved
 * - 'dueDate': Soonest first, tasks with no date placed last
 * - 'priority': High first (High -> Medium -> Low)
 * - 'title': Alphabetical (A to Z)
 */
export function sortTasks(tasks, sort) {
  const result = [...tasks];

  if (sort === 'none') {
    return result;
  }

  return result.sort((a, b) => {
    if (sort === 'dueDate') {
      // Both without date
      if (!a.dueDate && !b.dueDate) return a.id - b.id;
      // No date goes last
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      // Soonest first
      const dateComparison = a.dueDate.localeCompare(b.dueDate);
      if (dateComparison !== 0) return dateComparison;
      return a.id - b.id;
    }

    if (sort === 'priority') {
      // High first
      const diff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
      if (diff !== 0) return diff;
      return a.id - b.id;
    }

    if (sort === 'title') {
      const titleComparison = (a.title || '').localeCompare(b.title || '');
      if (titleComparison !== 0) return titleComparison;
      return a.id - b.id;
    }

    return 0;
  });
}

/**
 * Counts incomplete/active tasks ("X tasks left")
 */
export function countActiveTasks(tasks) {
  return tasks.filter((task) => !task.completed).length;
}

/**
 * Formats counter message with proper pluralization
 */
export function formatCounterText(count) {
  return `${count} ${count === 1 ? 'task' : 'tasks'} left`;
}
