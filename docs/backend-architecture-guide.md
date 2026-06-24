# TaskFlow Pro: Backend Architectural Guide

This guide provides a comprehensive overview of the design patterns, layer roles, request lifecycle, authentication mechanisms, test environment configurations, and production readiness of the TaskFlow Pro backend.

---

## 1. Visual Architecture Diagram

Below is the end-to-end request-response lifecycle of the application:

```
               +-------------------------------------------------------+
               |                      Client / UI                      |
               +---------------------------+---------------------------+
                                           | HTTP Request (e.g., GET /api/tasks?page=1&limit=10)
                                           v
               +-------------------------------------------------------+
               |             Express Router (app.js / *Routes.js)      |
               +---------------------------+---------------------------+
                                           | Routes to: /api/auth/* OR /api/tasks/*
                                           v
               +-------------------------------------------------------+
               |   [FEATURE] JWT Auth Middleware (authMiddleware.js)   |
               +---------------------------+---------------------------+
                                           | Decodes JWT & verifies user identity (401 if invalid)
                                           v
               +-------------------------------------------------------+
               |    [FEATURE] Validation Middleware (validateTask.js)  |
               +---------------------------+---------------------------+
                                           | Guards constraints (e.g. description length >= 20)
                                           v
               +-------------------------------------------------------+
               |          Controller Layer (taskController.js)         |
               +---------------------------+---------------------------+
                                           | Parses filters, page/limit, & passes req.user.id
                                           v
               +-------------------------------------------------------+
               |          [FEATURE] Service Layer (taskService.js)     |
               |  - Multi-tenant Scoping (where: { userId })           |
               |  - Offset Pagination (limit & offset)                 |
               |  - Sorting (created_at DESC)                          |
               |  - Substring Search & Status Filter                   |
               |  - Dashboard Stats (total, pending, completed)        |
               +---------------------------+---------------------------+
                                           | Queries via Sequelize ORM
                                           v
               +-----------------------------+-----------------------------+
               |      User ORM Model         |       Task ORM Model        |
               |         (User.js)           |         (Task.js)           |
               +--------------+--------------+--------------+--------------+
                              |                             |
                              +--------------+--------------+
                                             | Executes SQL
                                             v
               +-------------------------------------------------------+
               |                   Database Layer                      |
               |   [MySQL] (Dev/Prod Database)                         |
               |   [SQLite] (In-Memory Database for [FEATURE] Tests)   |
               +-------------------------------------------------------+
                                             | Persists information
                                             v
 [Response Flow] Database -> Models -> Services -> Controllers -> Client (HTTP Response)
```

---

## 2. Deep Dive: Module Explanations

---

### Module 1: `config/db.js`
* **Purpose:** Sets up and manages the Sequelize connection instance.
* **Responsibilities:** Establishes connection settings based on the run environment (`NODE_ENV`).
* **Why it exists:** Isolates database infrastructure and connection drivers from the rest of the application.
* **How it interacts with other modules:** Provides the initialized `sequelize` instance utilized by all Sequelize Models.
* **Real-world industry usage:** Dynamically switches databases based on environment targets. Utilizes connection pools (`max`, `min`, `acquire`, `idle`) to prevent database resource exhaustion.
* **Interview explanation:** *"This file is the bridge to our database. In development/production, it reads credentials from env files to connect to MySQL. In testing, it automatically boots up a fast, isolated SQLite in-memory database to keep tests decoupled and independent."*
* **Best practices followed:** Used environment variables for credentials, configured connection pools, and decoupled the testing environment database.
* **Future scalability considerations:** Can be scaled to support read/write database separation (replica pools) to balance query loads.

---

### Module 2: `models/User.js`
* **Purpose:** Defines the data schema mapping and constraints for the `users` table.
* **Responsibilities:** Declares database properties (username, email, password), column format validations, and model configurations.
* **Why it exists:** Handles authorization accounts mapping and enforces unique indexes for emails.
* **How it interacts with other modules:** Referenced by `models/Task.js` to build foreign key constraints (`user_id`). Imported by `services/authService.js` to create or retrieve accounts.
* **Real-world industry usage:** Models user accounts and profile boundaries in relational databases.
* **Interview explanation:** *"This model maps to the 'users' table in our database. It handles credentials storage and validates incoming formats, ensuring username lengths and email formats are valid before saving."*
* **Best practices followed:** Declared unique indexes on emails and excluded passwords from JSON outputs.
* **Future scalability considerations:** Can easily accommodate details like authorization roles (admin, manager, user) or soft-deletes.

---

### Module 3: `models/Task.js`
* **Purpose:** Defines the data schema mapping and database-level constraints for the `tasks` table.
* **Responsibilities:** Declares task attributes (title, description, status, user_id) and declares relations with the `User` model.
* **Why it exists:** Maps task schemas and links tasks to specific users.
* **How it interacts with other modules:** Declares associations: `User.hasMany(Task)` and `Task.belongsTo(User)`. Imported by `services/taskService.js` to execute queries.
* **Real-world industry usage:** Defines entity columns, indexes, and database relations cleanly.
* **Interview explanation:** *"This file represents what a 'Task' looks like. It defines fields like title, description, and status, and establishes a foreign key mapping user_id to the users table."*
* **Best practices followed:** Defined explicit foreign key constraints, table mappings (`tableName: 'tasks'`), and mapping helper configurations (`underscored: true`).
* **Future scalability considerations:** Indexes can be added to the `user_id` and `status` columns to optimize query speeds.

---

### Module 4: `services/authService.js`
* **Purpose:** Houses accounts management business logic.
* **Responsibilities:** Handles business logic for user registration (salting and hashing passwords) and user login (verifying passwords, creating JWTs).
* **Why it exists:** Keeps authentication logic separated from transport protocols, making registration/login reusable across HTTP, WebSockets, or CLI layers.
* **How it interacts with other modules:** Queries `models/User.js` and is imported by `controllers/authController.js`.
* **Real-world industry usage:** Integrates cryptography tools (like `bcryptjs`) and secure session signing (like `jsonwebtoken`).
* **Interview explanation:** *"This service handles registration and logins. For registration, it hashes the password using bcrypt. For logins, it validates credentials and signs a JWT containing user details."*
* **Best practices followed:** Strictly hashed passwords (never saved as plain text) and used configurable expiration times for signed JWTs.
* **Future scalability considerations:** Can be extended to support OAuth2 (Google, GitHub) or multi-factor authentication.

---

### Module 5: `services/taskService.js`
* **Purpose:** Houses task management business logic.
* **Responsibilities:** Creates tasks, fetches tasks with search/status filters/pagination, updates status, deletes tasks, and calculates stats.
* **Why it exists:** Decouples core business rules from request handlers.
* **How it interacts with other modules:** Queries `models/Task.js` and is imported and called by `controllers/taskController.js`.
* **Real-world industry usage:** Handles multi-tenant filters, transactions, and pagination offsets.
* **Interview explanation:** *"This handles task operations. Every query is filtered by the user's ID to keep data secure. It also supports offset-based pagination to return page size and page metadata."*
* **Best practices followed:** Used `Task.findAndCountAll` for database pagination, concurrency handlers (`Promise.all`) for parallel database queries, and enforced tenant isolation boundaries.
* **Future scalability considerations:** Caching systems (like Redis) can be integrated to cache paginated task arrays or dashboard statistics.

---

### Module 6: `controllers/authController.js`
* **Purpose:** Maps accounts transport requests to auth services.
* **Responsibilities:** Extracts body values, calls auth services, and returns JWT tokens and registration details.
* **Why it exists:** Separates HTTP request parsers from password encryption and token signing logic.
* **How it interacts with other modules:** Linked to routes (`routes/authRoutes.js`) and calls services (`services/authService.js`).
* **Real-world industry usage:** Handles user sessions and maps standard success/error responses.
* **Interview explanation:** *"This controller handles logins and registration HTTP requests. It extracts inputs, calls the AuthService to verify or register, and returns the signed token in a standard JSON response."*
* **Best practices followed:** Sanitized responses by deleting passwords from payloads.
* **Future scalability considerations:** Can set cookies containing HTTP-only JWTs to protect against Cross-Site Scripting (XSS) attacks.

---

### Module 7: `controllers/taskController.js`
* **Purpose:** Maps task transport requests to task services.
* **Responsibilities:** Unpacks HTTP requests (body, query, route parameters), passes parameters along with the user's ID to services, and returns formatted JSON.
* **Why it exists:** Separates Express concepts (`req`, `res`) from business operations.
* **How it interacts with other modules:** Positioned between routes and services, extracting `req.user.id` to enforce authorization.
* **Real-world industry usage:** Handles HTTP status codes, extracts headers, and handles response mapping.
* **Interview explanation:** *"This layer receives the HTTP request, pulls filters and pagination from query params, extracts the user ID from the request context, and passes everything to the task service."*
* **Best practices followed:** Standardized pagination payloads and mapped correct HTTP codes (e.g. `201 Created`).
* **Future scalability considerations:** Can integrate schema compression to reduce payload transit sizes.

---

### Module 8: `middleware/authMiddleware.js`
* **Purpose:** Guards routes by verifying JSON Web Tokens.
* **Responsibilities:** Extracts the Bearer token from authorization headers, validates it, and attaches decoded contents to `req.user`.
* **Why it exists:** Secures routes, rejecting requests from unauthenticated clients.
* **How it interacts with other modules:** Positioned in the routing chain before controllers to protect endpoints.
* **Real-world industry usage:** Enforces API access control and maps session payloads.
* **Interview explanation:** *"This middleware checks the 'Authorization' header for a Bearer token. It decrypts the token using our secret key. If valid, it attaches the user details to the request and calls next(); otherwise, it returns a 401 response."*
* **Best practices followed:** Fail-fast strategy on missing/malformed auth headers.
* **Future scalability considerations:** Can support role-based permission arrays.

---

### Module 9: `middleware/validateAuth.js`
* **Purpose:** Validates registration and login payloads.
* **Responsibilities:** Ensures username length constraints and email formats are valid before hitting service logic.
* **Why it exists:** Rejects bad requests before they consume database connections or hashing resources.
* **How it interacts with other modules:** Positioned between auth routes and controllers.
* **Real-world industry usage:** Input sanitization and format validation.
* **Interview explanation:** *"This acts as a guard. If a user tries to register with a 3-character password, it blocks the request immediately with a 400 response, avoiding unnecessary database lookups."*
* **Best practices followed:** Returns comprehensive validation arrays.
* **Future scalability considerations:** Can transition to schema-based libraries like Zod.

---

### Module 10: `middleware/validateTask.js`
* **Purpose:** Validates task creation and update payloads.
* **Responsibilities:** Validates mandatory fields and validation constraints (like minimum lengths) and returns errors immediately if validation fails.
* **Why it exists:** Rejects bad requests before they consume database resources or service execution time.
* **How it interacts with other modules:** Positioned between the router and the controller in the Express pipeline.
* **Real-world industry usage:** Sanitizes inputs and protects the system from malformed payloads.
* **Interview explanation:** *"This acts as a guard. If a user tries to create a task without a description, this middleware intercepts the request, blocks it, and returns an error response before the server does any database queries."*
* **Best practices followed:** Created separate validators for creation (`validateTaskCreation`) and status updates (`validateTaskStatusUpdate`) to match the API contract.
* **Future scalability considerations:** Can easily transition to declarative validation schemas (using libraries like Joi or Zod) as schemas grow in complexity.

---

### Module 11: `middleware/errorHandler.js`
* **Purpose:** Catches and standardizes all errors occurring across the request lifecycle.
* **Responsibilities:** Catches errors, formats them into a consistent structure, maps database validation errors to `400 Bad Request`, and logs stacks.
* **Why it exists:** Prevents application crashes and keeps error responses consistent, while hiding sensitive database stacks from users in production.
* **How it interacts with other modules:** Registers at the end of the Express middleware pipeline, intercepting errors passed via `next(error)`.
* **Real-world industry usage:** Logs errors to external telemetry systems (like Sentry or Datadog) and returns user-friendly, sanitised error responses.
* **Interview explanation:** *"This is the safety net. If any part of our app throws an error, it is caught here, formatted consistently, and returned as a JSON message. It also makes sure we don't leak code stack traces to the public."*
* **Best practices followed:** Checked `process.env.NODE_ENV` to hide/expose system stacks and mapped ORM errors to appropriate HTTP codes.
* **Future scalability considerations:** Can easily route errors to log management dashboards (like Elasticsearch or Winston loggers).

---

### Module 12: `routes/authRoutes.js`
* **Purpose:** Maps registration and login URLs.
* **Responsibilities:** Links `/register` and `/login` to validation middlewares and controllers.
* **Why it exists:** Centralizes authorization route registrations.
* **How it interacts with other modules:** Mounted by `app.js` under `/api/auth`.
* **Real-world industry usage:** Entry points for login and registration portals.
* **Interview explanation:** *"This file defines our authentication routes. It points POST requests for registration and logins to their respective validation middlewares and controllers."*
* **Best practices followed:** Kept authorization distinct from task management paths.
* **Future scalability considerations:** Can add routes for password-resets or logout invalidation.

---

### Module 13: `routes/taskRoutes.js`
* **Purpose:** Maps specific HTTP endpoints to their validation middlewares and controllers.
* **Responsibilities:** Declares endpoints (`GET`, `POST`, `PUT`, `DELETE`) and handles the routing execution path.
* **Why it exists:** Centralizes API endpoint mapping, making the API surface easy to review and modify.
* **How it interacts with other modules:** Imported in `app.js` and uses middlewares and controllers.
* **Real-world industry usage:** Manages routing structures, versioning (e.g., `/api/v1/tasks`), and endpoint-specific middleware chains.
* **Interview explanation:** *"This file maps URL paths to controllers. It tells Express: 'If a user sends a POST request to /tasks, run validation first, and then execute the createTask controller.'"*
* **Best practices followed:** Prioritized paths (like `/tasks/stats`) before parameterized paths (like `/tasks/:id`) to prevent wildcard matching conflicts.
* **Future scalability considerations:** Can scale to mount versioned routing systems (e.g., separating `/api/v1/` and `/api/v2/`).

---

### Module 14: `docs/swagger.js`
* **Purpose:** Configures and hosts the Swagger/OpenAPI documentation.
* **Responsibilities:** Declares API contracts, schemas, parameters, and responses, and exposes the interactive `/api-docs` interface.
* **Why it exists:** Standardizes API specs, allowing frontend developers and external teams to test endpoints interactively.
* **How it interacts with other modules:** Integrates as a UI middleware route inside `app.js`.
* **Real-world industry usage:** Exposes self-documenting developer portals to speed up frontend-backend integration.
* **Interview explanation:** *"This provides an interactive website at /api-docs where developers can see what endpoints are available, what inputs they require, what responses to expect, and even test them directly."*
* **Best practices followed:** Configured reusable schemas (`components/schemas`) for responses and payloads.
* **Future scalability considerations:** Can be set up to compile spec files dynamically or load them from raw YAML files.

---

### Module 15: `app.js`
* **Purpose:** Initializes and configures the Express application framework.
* **Responsibilities:** Configures global settings, mounts body parsers, registers CORS rules, mounts API routers, and handles 404 paths.
* **Why it exists:** Separates web framework configuration from network socket binding, making it easier to run tests without occupying local ports.
* **How it interacts with other modules:** Imports routers and error handlers, and is imported by `server.js` to start listening on a port.
* **Real-world industry usage:** Configures general security headers, parses incoming payloads, and handles logging middlewares.
* **Interview explanation:** *"This file sets up our Express application. It loads global tools like body-parsers, handles CORS, mounts our routes, and sets up our fallback 404 and global error handlers."*
* **Best practices followed:** Kept server lifecycle hooks separate from general configuration files.
* **Future scalability considerations:** Can mount sub-routers, rate-limiters, or security response headers (such as `helmet`) as needed.

---

### Module 16: `server.js`
* **Purpose:** Serves as the entry point that runs the application process.
* **Responsibilities:** Loads environment variables, connects to the database, syncs database schemas, and starts the Express server.
* **Why it exists:** Serves as the bootstrapping script that starts up all backend dependencies and handles startup failures.
* **How it interacts with other modules:** Imports `app.js` and the connection instance from `config/db.js`.
* **Real-world industry usage:** Boots up the server process in containerized environments (like Docker or Kubernetes).
* **Interview explanation:** *"This is the starting file. When we run the app, it loads the config, makes sure the database is online, syncs our schemas, and starts listening for requests on a port."*
* **Best practices followed:** Wrapped initialization steps in a `try...catch` block to abort startup if the database is offline.
* **Future scalability considerations:** Can integrate clustering mechanisms (like PM2 or Node's cluster module) to run on multiple CPU cores.

---

## 3. Folder Structure Explanation

```
backend/
├── src/
│   ├── config/         # Connection initialization & environment filters (db.js)
│   ├── controllers/    # Request parameters extractor & response mapper (authController.js, taskController.js)
│   ├── docs/           # OpenAPI documentation configurations & Swagger UI endpoints (swagger.js)
│   ├── middleware/     # Validation, authentication, and error boundaries (authMiddleware.js, validateAuth.js, validateTask.js, errorHandler.js)
│   ├── models/         # Database relationships and table schemas definitions (User.js, Task.js)
│   ├── routes/         # Endpoint paths mapping (authRoutes.js, taskRoutes.js)
│   ├── services/       # Multi-tenant business logic and hashing handlers (authService.js, taskService.js)
│   └── app.js          # Middleware registries and path bootstrappers
├── tests/              # Automated unit/integration test suites
│   ├── auth.test.js    # Tests for registration, login, and validation errors
│   └── task.test.js    # Tests for pagination, searching, stats, and tenant isolation boundaries
├── .env                # App environment configurations
├── package.json        # Dependencies configurations and test runner scripts
└── server.js           # Server process entry point
```

---

## 4. Why this Architecture is Production-Ready

1. **Separation of Concerns:** Each module has a single responsibility. Business logic does not know about Express routing or HTTP structures.
2. **Secure Passwords & Session Tokens:** Uses `bcryptjs` for secure password hashing and `jsonwebtoken` for secure session management.
3. **Multi-tenant Data Isolation:** Database queries in `taskService.js` are strictly scoped by the user's ID, preventing data leaks between accounts.
4. **Isolated Test Environments:** Automatically switches to an in-memory SQLite database when tests are run (`NODE_ENV=test`), making tests fast and portable.
5. **Robust Validation:** Implements a "fail-fast" strategy, rejecting invalid payloads at the middleware level before executing query operations.
6. **Consistent Error Payload:** All errors are caught and returned in a standard schema, shielding internal database structures from clients.

---

## 5. Common Interview Questions & Answers

### Q1: How does password hashing via bcrypt work and why is it used?
**Answer:** Bcrypt is a password-hashing function designed specifically to secure passwords. It incorporates a "salt" (a random value added to the password) to protect against rainbow table attacks. It also uses a configurable work factor (rounds of hashing) to slow down brute-force attacks, keeping hashed values secure even if the database is compromised.

### Q2: What are JWTs and how do we use them to secure routes?
**Answer:** JSON Web Tokens (JWTs) are compact, URL-safe tokens used to securely transfer information between a client and a server. In our app, when a user logs in, we sign a token containing their user ID, username, and email. The client sends this token in the `Authorization` header of subsequent requests. Our auth middleware verifies the signature, and if valid, attaches the decoded user data to the request context.

### Q3: Why use an in-memory SQLite database for running integration tests?
**Answer:** Running integration tests against a live development MySQL database can lead to data contamination, slow test executions, and dependencies on external database engines. An in-memory SQLite database runs entirely in-memory, boots up instantly, and is completely wiped out after tests finish, providing a clean slate for every test run without affecting local development data.

### Q4: How does pagination work at the database query level?
**Answer:** Pagination limits the number of rows returned by a query. In SQL, it utilizes the `LIMIT` (maximum rows to return) and `OFFSET` (number of rows to skip) clauses. In Sequelize, we compute the offset as `(page - 1) * limit` and pass `limit` and `offset` to `Task.findAndCountAll()`. This returns the matching subset of rows along with the total count, allowing us to calculate the total pages.

---

## 6. Scaling Improvements for Enterprise Systems

* **Refresh Tokens:** Transition from a single access token to a dual-token system (short-lived access tokens and longer-lived refresh tokens stored securely in HTTP-only cookies).
* **API Rate Limiting:** Implement rate-limiting middleware (like `express-rate-limit`) to protect auth endpoints against brute-force attacks.
* **Database Migrations:** Replace model sync operations with version-controlled migrations (like `sequelize-cli`) to handle production database schemas safely.
* **Structured Logging:** Replace console logging with a structured logging library (like Winston or Pino) to export JSON logs to aggregation servers.
