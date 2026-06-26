# TaskFlow Pro

A modern SaaS-style task management platform for organizing projects, tracking progress, managing priorities, and improving team productivity through a clean dashboard and secure authentication.

![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-MySQL%20%2B%20Sequelize-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Authentication](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-000000?style=for-the-badge)
![API Docs](https://img.shields.io/badge/API%20Docs-Swagger%20UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
---

# Overview

TaskFlow Pro is a full-stack task management application built using modern web technologies. It enables users to securely manage daily tasks, monitor project progress, organize work using priorities and statuses, and visualize productivity through an intuitive dashboard.

The application follows a production-style architecture by separating concerns into frontend, backend, database, authentication, and API documentation layers. It demonstrates best practices in REST API development, secure authentication, modular React architecture, and relational database management.

---

# Problem

Many traditional task management systems become difficult to scale due to poor architecture, inconsistent UI, and lack of secure authentication. Teams often struggle with tracking project progress, prioritizing work, and maintaining organized workflows.

TaskFlow Pro addresses these challenges by providing:

- Secure authentication
- Centralized task management
- Real-time task status tracking
- Responsive SaaS dashboard
- Production-ready REST APIs
- Clean modular architecture

---

# Features

## Authentication

- Secure JWT Authentication
- User Registration
- User Login
- Password Encryption using bcrypt
- Protected Routes
- Token Validation

## Task Management

- Create Tasks
- View Tasks
- Edit Tasks
- Delete Tasks
- Search Tasks
- Filter by Status
- Filter by Priority
- Sort Tasks
- Due Date Management

## Dashboard

- Total Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks
- Recent Activity
- Productivity Overview

## User Experience

- Responsive Design
- Modern SaaS UI
- Dark / Light Theme
- Mobile Friendly
- Loading States
- Empty States
- Error Handling

## Developer Features

- Swagger API Documentation
- Environment Configuration
- Sequelize ORM
- Modular Folder Structure
- Production-ready Codebase

---

# Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Database | MySQL |
| ORM | Sequelize |
| Authentication | JWT + bcrypt |
| API Documentation | Swagger UI |
| Validation | express-validator |
| Environment | dotenv |

---

# Workflow

TaskFlow Pro follows the complete application workflow:

1. User Registration
2. User Login
3. JWT Token Generation
4. Authentication Middleware Verification
5. Dashboard Loading
6. Create Task
7. Update Task
8. Delete Task
9. Search & Filter Tasks
10. Logout

---

# Architecture

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/62e99242-5545-4033-8998-2dde7301c28d"
    alt="Backend Architecture Diagram"
    width="900"
/>
</p>

---

# Project Structure

```text
taskflow-pro/

frontend/
│
├── public/
│   └── logo.png
│
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   ├── analytics.png
│   │   ├── collaboration.png
│   │   ├── completed.png
│   │   ├── in-progress.png
│   │   ├── pending.png
│   │   ├── total task.png
│   │   └── workflow.png
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── StatusFilter.jsx
│   │   │   └── TaskTable.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCards.jsx
│   │   └── TaskModal.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tasks.jsx
│   │   └── Analytics.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
└── vite.config.js

backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── notificationController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── validateAuth.js
│   │   └── validateTask.js
│   ├── models/
│   │   ├── Notification.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── taskRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── notificationService.js
│   │   └── taskService.js
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── notification.test.js
│   └── task.test.js
│
├── .env
└── package.json

README.md

```

---

# Functional Requirements

The application supports the following functionalities:

- User Registration
- User Login
- JWT Authentication
- Create Task
- View Tasks
- Update Task
- Delete Task
- Search Tasks
- Filter Tasks
- Dashboard Statistics
- API Documentation

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/taskflow-pro.git

cd taskflow-pro
```

---

## Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Database

Create the database:

```sql
CREATE DATABASE taskflow_pro;
```

Update the database credentials in:

```
backend/.env
```

---

# Environment Variables

```env
PORT=5000

NODE_ENV=development

DB_HOST=localhost

DB_PORT=3306

DB_NAME=taskflow_pro

DB_USER=root

DB_PASSWORD=your_password

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

---

# Usage

After running the application:

- Register a new account.
- Login securely.
- Create new tasks.
- Update existing tasks.
- Delete completed tasks.
- Search tasks.
- Filter tasks by status and priority.
- Monitor dashboard statistics.
- Logout securely.

---

# API Documentation

The backend provides interactive API documentation using Swagger UI.

### Development

```
http://localhost:5000/api-docs
```

### Static HTML Documentation
You can also view the exported Swagger UI documentation as an HTML file:

[Open docs.html](./docs.html)

### Note
The API documentation is currently available in local development and as a static exported HTML file. A public production documentation URL is not deployed yet.

---

# Screenshots

## Login Page

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/7daaeca8-0e90-44e3-948a-e81bb05480c0"
    alt="TaskFlow Pro Login"
    width="1100"
  />
</p>

---

## Dashboard

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/d6086dec-b819-4b03-b51f-4ecf495e236d"
    alt="TaskFlow Pro Dashboard"
    width="1100"
  />
</p>

---

## Tasks Page

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/528d5924-6e8a-43ef-b46d-974afe8fb940"
    alt="Task Page"
    width="1100"
  />
</p>

---

## Analytics Page

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/d5ba5e1d-60b9-4394-8698-944fcf27a9de"
    alt="Analytics Page"
    width="1100"
  />
</p>

---

# Edge Cases

The system handles several practical scenarios:

- Invalid Login Credentials
- Duplicate Email Registration
- Unauthorized Access
- Expired JWT Tokens
- Empty Task Lists
- Invalid Status Values
- Invalid Priority Values
- Missing Required Fields
- Database Connection Failure
- API Validation Errors

---

# Future Enhancements

- Team Collaboration
- Role-Based Access Control (RBAC)
- File Attachments
- Task Comments
- Calendar Integration
- Email Notifications
- Push Notifications
- Kanban Board
- Drag-and-Drop Task Management
- Real-Time Updates using Socket.IO
- AI Task Recommendations
- Docker Deployment
- CI/CD Pipeline
- Cloud Deployment

---

# Why This Project Stands Out

TaskFlow Pro is more than a CRUD application. It demonstrates modern full-stack software engineering practices by combining secure JWT authentication, modular React architecture, RESTful API development, MySQL database integration, Sequelize ORM, responsive SaaS UI design, and Swagger API documentation into a production-style application.

The project showcases practical skills in frontend development, backend engineering, database design, API integration, authentication, and scalable architecture, making it suitable for internships, placements, and professional portfolios.

---

# Author

**Abinash A**

Information Technology Student

Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College

**GitHub**

```
https://github.com/Abinash123iou
```

**LinkedIn**

```
https://www.linkedin.com/in/abinash-a-dev/
```

---


