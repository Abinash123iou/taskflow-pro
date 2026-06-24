# Functional Requirements

## FR-01: View Tasks
The system shall allow users to view all available tasks.

### Acceptance Criteria
- Display title, description, status, and created date.
- Tasks should be displayed in table/card format.

---

## FR-02: Create Task
The system shall allow users to create a new task.

### Input Fields
- Title
- Description
- Status

### Acceptance Criteria
- Task is saved successfully.
- New task appears in dashboard.

---

## FR-03: Task Validation

### Rules
- Title is required.
- Description must contain at least 20 characters.
- Status must be valid.

### Acceptance Criteria
- Validation messages displayed for invalid input.

---

## FR-04: Update Task Status

The system shall allow users to update task status.

### Status Values
- Pending
- In Progress
- Completed

---

## FR-05: Delete Task

The system shall allow users to delete tasks.

### Acceptance Criteria
- Task removed from database.
- Dashboard updated automatically.

---

## FR-06: Filter Tasks

Users shall be able to filter tasks by status.

### Filters
- All
- Pending
- In Progress
- Completed

---

## FR-07: Search Tasks (Bonus)

Users shall be able to search tasks by title.

---

## FR-08: Dashboard Statistics (Bonus)

Display:
- Total Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks

---

## FR-09: Loading State

Display loading indicator during API requests.

---

## FR-10: Empty State

Display empty state when no tasks are available.

---

## FR-11: Dark Mode (Bonus)

Allow users to switch between light and dark themes.