import { useState, useEffect, useMemo } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import FilterBar from './components/FilterBar.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('none');

  // bonus: remember light / dark theme toggle
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // bonus: 5-second undo delete state
  const [deletedTask, setDeletedTask] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  // sync dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // load tasks from localStorage or fetch starter json on first visit
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
        setLoading(false);
      } catch (e) {
        loadStarterData();
      }
    } else {
      loadStarterData();
    }
  }, []);

  function loadStarterData() {
    setLoading(true);
    setError(null);
    fetch('/tasks.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load tasks');
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        localStorage.setItem('tasks', JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  // save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading && error === null) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading, error]);

  function handleAddTask(title, priority, dueDate) {
    const newTask = {
      id: Date.now(),
      title,
      priority,
      dueDate,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  }

  function handleToggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleEditTask(id, newTitle) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  }

  function handleDeleteTask(id) {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setTasks(tasks.filter((task) => task.id !== id));
    setDeletedTask(taskToDelete);

    if (undoTimer) clearTimeout(undoTimer);
    const timer = setTimeout(() => {
      setDeletedTask(null);
    }, 5000);
    setUndoTimer(timer);
  }

  function handleUndoDelete() {
    if (deletedTask) {
      setTasks((prev) => [deletedTask, ...prev]);
      setDeletedTask(null);
      if (undoTimer) clearTimeout(undoTimer);
    }
  }

  // compute filtered and sorted tasks on the fly using useMemo
  const visibleTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      if (filter === 'Active') return !task.completed;
      if (filter === 'Completed') return task.completed;
      return true;
    });

    if (search.trim() !== '') {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === 'dueDate') {
      result = [...result].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else if (sort === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      result = [...result].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    return result;
  }, [tasks, filter, search, sort]);

  // compute active tasks left counter on the fly
  const activeCount = useMemo(() => {
    return tasks.filter((task) => !task.completed).length;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-4 sm:p-8 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Effortless Focus</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('tasks');
                loadStarterData();
              }}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline focus:outline-none"
              title="Reset tasks to starter data from tasks.json"
            >
              Reset Starter Data
            </button>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="px-2.5 py-1 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>

        {/* 1. Add Task Form */}
        <TaskForm onAddTask={handleAddTask} />

        {/* 2. Filter, Search, Counter & Sort Bar */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          activeCount={activeCount}
        />

        {/* 3. Task List */}
        <TaskList
          tasks={visibleTasks}
          loading={loading}
          error={error}
          onRetry={loadStarterData}
          onToggle={handleToggleTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {/* Bonus: 5-Second Undo Toast */}
        {deletedTask && (
          <div className="fixed bottom-5 right-5 bg-neutral-900 dark:bg-neutral-800 text-white px-4 py-2.5 rounded-lg shadow-xl border border-neutral-700 flex items-center gap-3 text-sm z-50 animate-in fade-in slide-in-from-bottom-2">
            <span className="truncate max-w-[200px]">Deleted "{deletedTask.title}"</span>
            <button
              type="button"
              onClick={handleUndoDelete}
              className="text-blue-400 hover:text-blue-300 font-semibold underline text-xs shrink-0"
            >
              Undo (5s)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
