import TaskItem from './TaskItem.jsx';

// displays the list of tasks or loading/error messages
export default function TaskList({
  tasks,
  loading,
  error,
  onRetry,
  onToggle,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return <p className="text-center py-8 text-neutral-500 dark:text-neutral-400">Loading tasks...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
        <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="text-center py-8 text-neutral-400 dark:text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg">
        No tasks found.
      </p>
    );
  }

  return (
    <ul className="space-y-2" role="list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
