import { useState } from 'react';

// single task item with in-place edit, overdue check, and inline delete confirm
export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // check if incomplete task is past its due date (reference: today in local time)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const isOverdue = !task.completed && task.dueDate && task.dueDate < today;

  function handleSave() {
    if (!editTitle.trim()) {
      setEditError('Title cannot be blank');
      return;
    }
    onEdit(task.id, editTitle.trim());
    setIsEditing(false);
    setEditError('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
      setEditError('');
    }
  }

  const priorityColors = {
    High: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    Low: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  };

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-4 w-4 text-blue-600 rounded border-neutral-300 dark:border-neutral-600 focus:ring-blue-500 cursor-pointer"
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'completed'}`}
        />

        {isEditing ? (
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                autoFocus
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  setEditError('');
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-2.5 py-1 text-sm bg-white dark:bg-neutral-800 border border-blue-500 rounded focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSave}
                className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 shrink-0"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditTitle(task.title);
                  setIsEditing(false);
                  setEditError('');
                }}
                className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 shrink-0"
              >
                Cancel
              </button>
            </div>
            {editError && <p className="text-xs text-red-600 dark:text-red-400">{editError}</p>}
          </div>
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`text-sm cursor-pointer select-none break-words ${
              task.completed
                ? 'line-through text-neutral-400 dark:text-neutral-500'
                : 'text-neutral-800 dark:text-neutral-200'
            }`}
            title="Double-click to edit"
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {isOverdue && (
          <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900 font-semibold px-2 py-0.5 rounded">
            Overdue
          </span>
        )}

        <span
          className={`text-xs px-2 py-0.5 font-medium rounded border ${
            priorityColors[task.priority] || priorityColors.Medium
          }`}
        >
          {task.priority}
        </span>

        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {task.dueDate ? task.dueDate : 'No date'}
        </span>

        {!isEditing && !confirmDelete && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 px-1.5 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Edit
          </button>
        )}

        {confirmDelete ? (
          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 p-1 rounded border border-red-200 dark:border-red-900">
            <span className="text-xs text-red-700 dark:text-red-400 font-medium">Delete?</span>
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
                setConfirmDelete(false);
              }}
              className="text-xs bg-red-600 text-white font-medium px-2 py-0.5 rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 px-1 py-0.5 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 px-1.5 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}
