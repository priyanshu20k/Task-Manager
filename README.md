Task Manager App
Build a one-page task manager where a user can add, complete, edit, filter, and delete tasks.

1. How to Run It
The project runs using standard Node.js, React, and Vite with no extra setup required:

Bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
Visit http://localhost:3000 in your browser.

Run Unit Tests
Bash
npm test
Executes the Vitest unit test suite verifying filter, sort, overdue, and validation logic.

Production Build
Bash
npm run build
2. What Works
All 9 must-have (graded) requirements and bonus features are fully implemented and verified:

Must-Have Features (Graded)
First Load: Fetches initial tasks from public/tasks.json with a loading indicator and an error message with a working Retry button if the fetch fails.

Saving: Saves every change (add, toggle, in-place edit, delete, restore) to localStorage. On later visits, loads directly from localStorage.

Add a Task: Required title (blank or whitespace-only strings show a clear validation error), priority dropdown (Low, Medium, High; default Medium), and optional due date. Submits on Enter.

Task List: Each task displays its title, color-coded priority badge, formatted due date, and checkbox. Completed tasks are struck through.

In-Place Edit: Double-click a title or click the edit icon to edit in place. Enter saves, Escape cancels, and blank titles are strictly disallowed.

Delete with Confirmation: Deleting a task opens an accessible confirmation modal.

Filter & Counter: Tabs for All, Active, and Completed, alongside a counter displaying "3 tasks left".

Search & Sort: Case-insensitive title search working simultaneously with filter tabs. Sort dropdown supporting:

Due Date (soonest first, tasks with no date placed last)

Priority (High first: High > Medium > Low)

Overdue & Layout: Incomplete tasks past their due date display a red "Overdue" badge. The layout is fully responsive and tested from 375px mobile screens to wide desktop viewports.

Starter-Data Verification Check
Active Counter: Displays 3 tasks left (tasks #2, #3, #4).

Overdue Task: Only "Fix checkout bug" (2026-01-15) shows Overdue. Task #1 (2026-01-10) is completed, so it is not overdue. Task #5 has no due date.

Due Date Sort (All Tab):

Set up project repo (2026-01-10)

Fix checkout bug (2026-01-15)

Design login screen (2027-03-12)

Write API docs (2027-04-20)

Plan team outing (null — placed last)

Bonus Features Implemented
Undo for 5 Seconds: Deleting a task triggers an animated 5-second countdown toast with an Undo button that restores the task to its previous list index.

Remembered Light / Dark Theme: Toggle in the header that persists user preference in localStorage and respects system prefers-color-scheme.

Keyboard & Screen-Reader Accessible: Semantic <button> elements, <label> associations, visible focus outlines (focus-visible:ring-2), ARIA dialogs, and live status regions.

Unit Tests: 9 unit tests with Vitest verifying all core logic.

Reset to Starter Data Button: Allows resetting localStorage to test first-load behavior idempotently.

3. What is Missing or Broken
None. All 9 required must-have features work as specified, with zero broken flows, no console errors, and 100% test pass rate.

4. Any Assumptions Made
Current Date for Overdue Logic: Overdue checks compare incomplete tasks' dueDate (YYYY-MM-DD) against the current local date (2026-11-07).

Completed Tasks and Overdue: As stated in the PDF ("incomplete tasks past their due date show a red 'Overdue' label"), completed tasks are never marked as Overdue even if their due date is in the past.

No Due Date Sorting: When sorting by due date, tasks with no due date (dueDate: null) are placed last, after all dated tasks.

Priority Ranking: Priority order for sorting is High > Medium > Low.

No State Mutation: Task state is kept in a single source of truth in useTasks. Filtered lists, sorted lists, and active counts are computed derivations (useMemo), never stored separately.
