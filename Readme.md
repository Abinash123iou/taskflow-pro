# TaskFlow Pro 🚀

TaskFlow Pro is an enterprise-grade, high-fidelity project management portal built with React, Express, Sequelize, and MySQL. It features a modern design following the Google Stitch style guide, dynamic statistics tracking, interactive Recharts visualizations, and full task CRUD capabilities.

---

## Key Features 🌟

- **Google Stitch Aesthetic**: Seamless light/dark mode transitions, modern typography, glassmorphism overlays, and premium layout structure.
- **Robust JWT Authentication**: Secure user login with JWT integration, automatic session persistence, and router guards.
- **Interactive Overview**: Real-time stats metric cards, recent tasks tracking, upcoming deadlines list, and user activity timelines.
- **Complete Task CRUD Module**:
  - Live search and filter capabilities (by Status and Priority).
  - Clean paginated task table.
  - Create, edit, and delete tasks dynamically using a modular modal system.
- **Analytical Insights Dashboard**:
  - **Weekly Completion Trend**: Integrated area/line chart visualizer.
  - **Monthly Productivity Trend**: Highlighted bar chart visualizer.
  - **Task Distribution**: Segmented donut chart displaying status density.
  - Smart recommendations panel and resource performance leaderboards.

---

## Tech Stack 🛠️

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios
- **Icons**: Google Material Symbols
- **Visualizations**: Recharts

### Backend
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL (local service running on port 3306)
- **Auth**: JWT & bcryptjs
- **API Docs**: Swagger UI

---

## Credentials 🔑

To test the application locally, use the following pre-seeded developer credentials:
- **Email**: `demo@taskflow.pro`
- **Password**: `welcome2024`

---

## Getting Started ⚙️

### Prerequisites
- Node.js (v18+)
- Local MySQL server running on port 3306

### Installation

1. Clone the repository and install root dependencies:
   ```bash
   npm install
   ```

2. Setup the backend:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=taskflow_db
   JWT_SECRET=your_jwt_secret_key
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. Setup the frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Access the frontend at `http://localhost:5173`.

---

## API Endpoints Summary 🔌

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Authenticate user & return JWT token | No |
| GET | `/tasks` | Get paginated list of tasks (with optional search, status, and priority query params) | Yes |
| POST | `/tasks` | Create a new task | Yes |
| PUT | `/tasks/:id` | Update an existing task | Yes |
| DELETE | `/tasks/:id` | Delete a task | Yes |
| GET | `/tasks/stats` | Fetch aggregated task statistics | Yes |

---

## License 📄
This project is proprietary and intended for internal use only.
