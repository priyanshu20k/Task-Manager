import { useState } from 'react';

// form to add a new task with title, priority, and optional due date
export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    onAddTask(title.trim(), priority, dueDate || null);
    setTitle('');
    setPriority('Medium');
    setDueDate('');
    setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm space-y-3 transition-colors"
    >
      <div>
        <label htmlFor="task-title" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
          Task Title *
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="What needs to be done? (Press Enter)"
          className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label htmlFor="task-priority" className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Priority:
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="text-xs px-2 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label htmlFor="task-duedate" className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Due Date:
            </label>
            <input
              id="task-duedate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs px-2 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
