# TaskFlow Pro: Frontend Architectural Guide

This guide provides a comprehensive overview of the design patterns, component layer roles, state management, theme architecture, client-side routing, request delegation, and design system configuration of the TaskFlow Pro frontend.

---

## 1. Visual Architecture Diagram

Below is the end-to-end user-action and request flow of the frontend React application:

```
               +-------------------------------------------------------+
               |                     User Interface                    |
               +---------------------------+---------------------------+
                                           | Clicks / Inputs / Navigation
                                           v
               +-------------------------------------------------------+
               |              React Router DOM (App.jsx)               |
               +---------------------------+---------------------------+
                                           | Resolves paths & guards routes
                                           v
               +-------------------------------------------------------+
               |         ProtectedRoute (ProtectedRoute.jsx)           |
               +---------------------------+---------------------------+
                                           | Inspects token (redirects to /login if unauthenticated)
                                           v
               +-------------------------------------------------------+
               |    Context Providers (AuthContext / ThemeContext)     |
               +---------------------------+---------------------------+
                                           | Manages global session, user profile, & UI theme state
                                           v
               +-------------------------------------------------------+
               |   Page Views (Dashboard, Tasks, Analytics, Login)     |
               +---------------------------+---------------------------+
                                           | Maintains local states, filters, charts, and modal toggles
                                           v
               +-------------------------------------------------------+
               |              Subcomponents / Layout                   |
               |  - Sidebar / Navbar (Polling for notifications)       |
               |  - TaskTable (Paginated lists)                        |
               |  - TaskModal (Creation & Editing forms)               |
               +---------------------------+---------------------------+
                                           | Resolves layout composition & delegates queries
                                           v
               +-------------------------------------------------------+
               |          HTTP Client (Axios) & Dev Proxy              |
               +---------------------------+---------------------------+
                                           | Intercepts request -> attaches JWT header -> passes to proxy
                                           v
               +-------------------------------------------------------+
               |                     Backend API                       |
               +-------------------------------------------------------+
```

---

## 2. Deep Dive: Module Explanations

---

### Module 1: `main.jsx`
* **Purpose:** Entry point for the React client application.
* **Responsibilities:** Mounts the React virtual DOM container node (`root`) and wraps the main application in `React.StrictMode`.
* **Why it exists:** Boots up the React environment and links the HTML viewport container to the application scripts.
* **How it interacts with other modules:** Imports and renders the `<App />` component, and imports the global stylesheet `index.css`.
* **Real-world industry usage:** Acts as the bootstrapper that configures global wrappers, telemetry engines, or error boundaries.
* **Interview explanation:** *"This is the entry file that loads React. It locates the root element in index.html, injects the App component, and applies the global CSS stylesheet."*
* **Best practices followed:** Utilized modern React 18 `createRoot` API and strict mode highlighting for double-rendering check.

---

### Module 2: `App.jsx`
* **Purpose:** Configures global client-side routing, route guarding, and state provider structures.
* **Responsibilities:** Implements routes (`/login`, `/dashboard`, `/tasks`, `/analytics`) and wraps routes in context providers.
* **Why it exists:** Coordinates page states, controls authorization guard layers, and configures fallback routes.
* **How it interacts with other modules:** Renders page components (Login, Dashboard, Tasks, Analytics) and guards them with `<ProtectedRoute />`.
* **Real-world industry usage:** Orchestrates layout routing grids, dynamic modules loading, and core global state hooks.
* **Interview explanation:** *"App.jsx is the router of our frontend. It sets up routes using react-router-dom, wraps them with context providers for theme and authentication, and routes unauthenticated pages using a ProtectedRoute helper."*
* **Best practices followed:** Decoupled layout frameworks from standalone page routes, and established a clean fallback redirect to the dashboard.

---

### Module 3: `index.css`
* **Purpose:** Defines global CSS variables, resets, utility classes, and design system tokens.
* **Responsibilities:** Configures light and dark theme design tokens (colors, borders, fonts, container grids) based on Tailwind CSS custom specifications.
* **Why it exists:** Centralizes the design variables to ensure design consistency across screens.
* **How it interacts with other modules:** Imported by `main.jsx` to style all pages and subcomponents.
* **Real-world industry usage:** Establishes color modes, typography baselines, transitions, and component primitives to guarantee visual coherence.
* **Interview explanation:** *"This CSS stylesheet declares variables for things like primary backgrounds, card surfaces, and border colors. It has specific setups for light mode and dark mode classes so that theme switches are applied instantly."*
* **Best practices followed:** Used semantic variables (e.g. `--background`, `--surface`, `--on-surface`) and restricted hardcoded hex color values to root rules.

---

### Module 4: `context/AuthContext.jsx`
* **Purpose:** Manages user authentication sessions, tokens, and registration operations.
* **Responsibilities:** Keeps track of the authenticated user's profile and active JSON Web Token, handles login/logout queries, and stores credentials in `localStorage` for persistence.
* **Why it exists:** Prevents "prop drilling" by making user profile states accessible to any child component in the DOM tree.
* **How it interacts with other modules:** Provides credentials context to `ProtectedRoute`, page components (Login, Dashboard), and navigation layout elements.
* **Real-world industry usage:** Decouples session logic from components, securely handles local auth storage, and intercepts token errors.
* **Interview explanation:** *"This file manages the user session. It exposes login, registration, and logout operations, and saves the JWT in localStorage so the user doesn't have to re-login after reloading the tab."*
* **Best practices followed:** Added clean loading flags to prevent flashing UI when inspecting stored credentials during initialization.

---

### Module 5: `context/ThemeContext.jsx`
* **Purpose:** Manages the user's active theme preference (Light or Dark mode).
* **Responsibilities:** Toggles theme state classes on the HTML root element and persists user choice in `localStorage`.
* **Why it exists:** Standardizes theme toggling interface across all components.
* **How it interacts with other modules:** Hooked to the Navbar theme switcher and determines standard styling variables.
* **Real-world industry usage:** Customizes components themes dynamically and checks system preferences (`matchMedia`) for defaults.
* **Interview explanation:** *"This context controls whether the website is rendered in light or dark mode. It adds or removes the '.dark' class from the document root element, persisting the choice in storage."*
* **Best practices followed:** Used HTML data-attributes/classes to trigger style recalculations smoothly without layout shifts.

---

### Module 6: `components/ProtectedRoute.jsx`
* **Purpose:** Guards secure paths from unauthorized users.
* **Responsibilities:** Inspects the AuthContext session state and redirects unauthorized clients to the `/login` route.
* **Why it exists:** Restricts access to sensitive pages (like dashboard, tasks, analytics) to logged-in users.
* **How it interacts with other modules:** Intercepts route rendering inside `App.jsx` based on context data.
* **Real-world industry usage:** Secures client-side routing, performs session checks, and holds redirect parameters.
* **Interview explanation:** *"It is a wrapper. If a user is not logged in, it redirects them to the login screen. If they are authenticated, it renders the child pages."*
* **Best practices followed:** Handled checking states cleanly to avoid misrouting users while sessions are loading.

---

### Module 7: `components/Navbar.jsx`
* **Purpose:** Renders the navigation header, search bar, theme toggler, and notification bell.
* **Responsibilities:** Displays branding, active navigation links, custom profile menus, and polls notification messages from the backend.
* **Why it exists:** Coordinates general search filters, manages notifications lists, and hosts account operations.
* **How it interacts with other modules:** Triggers logout in `AuthContext`, flips settings in `ThemeContext`, and displays notifications counts.
* **Real-world industry usage:** Acts as the primary portal header containing search bars and session configurations.
* **Interview explanation:** *"The Navbar displays branding, links, and profile settings. It also regularly polls the notification API so users see live updates when tasks get overdue or modified."*
* **Best practices followed:** Applied clean polling timers that automatically clear when the component is unmounted to prevent memory leaks.

---

### Module 8: `components/Sidebar.jsx`
* **Purpose:** Renders the sidebar navigation panel.
* **Responsibilities:** Displays links to Overview, Tasks, and Analytics pages with active styling indicators.
* **Why it exists:** Coordinates primary desktop dashboard layout navigation.
* **How it interacts with other modules:** Composed into layout frames alongside the Navbar and page components.
* **Real-world industry usage:** Controls layout navigation systems across complex dashboard architectures.
* **Interview explanation:** *"This component renders the side menu. It uses React Router links and changes visual states to highlight which page is active."*
* **Best practices followed:** Implemented responsive breakpoints to collapse the sidebar on smaller viewports.

---

### Module 9: `components/StatsCards.jsx`
* **Purpose:** Renders the dashboard statistics cards grid.
* **Responsibilities:** Receives task metric counts and computes percentages to display progress indicators.
* **Why it exists:** Visualizes task progress statistics (Total, Pending, In Progress, Completed).
* **How it interacts with other modules:** Imported and rendered inside the Dashboard page.
* **Real-world industry usage:** Creates metrics grids with dynamic bars and tooltips.
* **Interview explanation:** *"This component renders the metrics cards at the top of the dashboard, showing task totals and completion rates using progress bars."*
* **Best practices followed:** Handled edge cases like zero total tasks to prevent division-by-zero errors.

---

### Module 10: `components/TaskModal.jsx`
* **Purpose:** Reusable form modal to create or edit tasks.
* **Responsibilities:** Captures input details, performs local form validations, and submits task data to the backend APIs.
* **Why it exists:** Centralizes task mutations in a unified modal viewport.
* **How it interacts with other modules:** Called by Dashboard and Tasks pages, passing submission callbacks.
* **Real-world industry usage:** Implements multi-field forms, date pickers, and dynamic selection fields.
* **Interview explanation:** *"This modal handles both creating new tasks and editing existing ones. It populates inputs based on active task details and triggers callback updates after submission."*
* **Best practices followed:** Reset form state variables on close to prevent data leakage between operations.

---

### Module 11: `components/dashboard/TaskTable.jsx`
* **Purpose:** Renders the list of tasks.
* **Responsibilities:** Renders task tables, formats dates, dynamically maps priority colors, and displays update buttons.
* **Why it exists:** Displays the user's tasks in a readable, interactive table format.
* **How it interacts with other modules:** Passes selected task items to parent editing modals and triggers delete calls.
* **Real-world industry usage:** Visualizes tabular data with custom status chips and rows selectors.
* **Interview explanation:** *"The TaskTable displays the list of tasks, applying custom color tags based on priority levels and providing action buttons to edit or delete."*
* **Best practices followed:** Isolated table subcomponents from API querying logic, ensuring the table remains clean and reusable.

---

### Module 12: `pages/Login.jsx`
* **Purpose:** Handles registration and login user flows.
* **Responsibilities:** Manages form inputs, displays error banners, and triggers authentication actions.
* **Why it exists:** Acts as the gateway page for accounts onboarding.
* **How it interacts with other modules:** Calls authentication methods inside `AuthContext` and redirects users to `/dashboard` upon success.
* **Real-world industry usage:** Implements authentication forms, handles session tokens, and displays login illustrations.
* **Interview explanation:** *"This page handles logins and account creations. It styles the submit button differently per theme (black for light mode, blue for dark mode) to create a premium visual experience."*
* **Best practices followed:** Split primary button styles based on active CSS classes, and set disabled states during form submissions.

---

### Module 13: `pages/Dashboard.jsx`
* **Purpose:** Main portal home view.
* **Responsibilities:** Fetches dashboard statistics, triggers creation modals, and displays summary statistics.
* **Why it exists:** Provides users with a unified starting panel summary.
* **How it interacts with other modules:** Gathers data from task statistics API, and renders `StatsCards` and `TaskModal`.
* **Real-world industry usage:** Consolidates analytics widgets and tasks panels in a unified view.
* **Interview explanation:** *"The Dashboard page is the home panel. It fetches statistics from the backend, renders metrics progress bars, and lists the user's tasks."*
* **Best practices followed:** Configured unified API endpoints and decoupled state management.

---

### Module 14: `pages/Tasks.jsx`
* **Purpose:** Comprehensive page view to list and filter tasks.
* **Responsibilities:** Handles status filters, text searches, pagination offsets, page changes, task creations, status updates, and task deletions.
* **Why it exists:** Serves as the primary workspace page for editing and managing tasks.
* **How it interacts with other modules:** Integrates `TaskTable`, `SearchBar`, `StatusFilter`, and `TaskModal`.
* **Real-world industry usage:** Provides standard list interfaces with search, filtering, sorting, and pagination.
* **Interview explanation:** *"The Tasks page coordinates task management. It updates local states for page numbers, search strings, and filter chips, and triggers API updates when changes occur."*
* **Best practices followed:** Bound pagination controls and page filters to prevent invalid state requests.

---

### Module 15: `pages/Analytics.jsx`
* **Purpose:** Renders graphs and performance statistics.
* **Responsibilities:** Fetches statistics, computes completion trends, and displays interactive charts (Area, Bar, Pie) using Recharts.
* **Why it exists:** Visualizes user productivity metrics.
* **How it interacts with other modules:** Integrates assets icons (e.g. checkmarks) for stats cards and pulls live trend counts.
* **Real-world industry usage:** Integrates charting libraries to build analytics dashboards.
* **Interview explanation:** *"The Analytics page fetches historical task statistics and maps them to Recharts widgets, showing weekly completion trends, task distributions, and monthly productivity."*
* **Best practices followed:** Bound data points dynamically, styled SVG charts to match the color themes, and replaced generic icons with high-fidelity assets.
