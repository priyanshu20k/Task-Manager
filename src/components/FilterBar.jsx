// toolbar for search input, status tabs, and sorting
export default function FilterBar({
  filter,
  setFilter,
  search,
  setSearch,
  sort,
  setSort,
  activeCount,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="w-full sm:w-64 px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search tasks by title"
        />

        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded">
          {['All', 'Active', 'Completed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                filter === tab
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <option value="none">Default</option>
            <option value="dueDate">Due Date (soonest first)</option>
            <option value="priority">Priority (High first)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
