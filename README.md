# CollabNex – Team Task Manager

A high-performance, full-stack sprint management and team collaboration platform built with the MERN stack. Designed with a custom high-contrast Cyber-Obsidian UI, native drag-and-drop Kanban workflow, real-time sprint telemetry, and granular role-based access control.

---

## ⚡ Core Features

- **Cyber-Obsidian Design System:** Modern dark-mode interface built with high-contrast surfaces (`#09090b`), glowing visual cues, and responsive panels.
- **Interactive Kanban Board:** Low-latency task management utilizing native HTML5 Drag-and-Drop, inline quick-add task generation, and dynamic search/priority filtering.
- **WIP (Work-In-Progress) Limits:** Built-in column capacity throttling (default `MAX: 3` for In-Progress) with visual threshold warnings to avoid team pipeline bottlenecks.
- **Live Sprint Telemetry:** Custom client-side metrics calculating live completion velocity, critical/overdue ticket alerts, and animated SVG trajectory curves without heavy charting libraries.
- **Role-Based Access Control (RBAC):** Strict permission segregation ensuring only Project Admins can mutate memberships or core project settings, while Members seamlessly collaborate on tasks.
- **Resilient State Architecture:** Defensive array sanitization and decoupled presentation components (`TaskBoard` / `TaskCard`) eliminating client-side runtime crashes during asynchronous state transitions.

---

## 📊 Performance Benchmarks (Lighthouse Audit)

Tested in production on desktop via Chrome Lighthouse:

| Metric                             | Score / Value | Target Standard         |
| :--------------------------------- | :------------ | :---------------------- |
| **Performance**                    | **91 / 100**  | Google Green Tier (90+) |
| **Best Practices**                 | **100 / 100** | Strict Web Standards    |
| **Accessibility**                  | **92 / 100**  | WCAG Compliant          |
| **First Contentful Paint (FCP)**   | **0.6 s**     | < 1.8 s (Good)          |
| **Largest Contentful Paint (LCP)** | **1.3 s**     | < 2.5 s (Good)          |
| **Cumulative Layout Shift (CLS)**  | **0.011**     | < 0.1 (Stable)          |

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, Custom SVG Visualizations
- **Backend:** Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), CORS
- **Database:** MongoDB Atlas
- **Hosting & CI/CD:** Vercel (Frontend), Render (API)

## Local Development

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

API runs at: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# .env already points to localhost:5000
npm run dev
```

App runs at: `http://localhost:5173`

---

## Environment Variables

### Server (`server/.env`)

| Variable         | Description                           |
| ---------------- | ------------------------------------- |
| `PORT`           | Server port (default: 5000)           |
| `MONGO_URI`      | MongoDB Atlas connection string       |
| `JWT_SECRET`     | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g., `7d`)           |
| `CLIENT_ORIGIN`  | Frontend URL for CORS                 |

### Client (`client/.env`)

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

---

## Deployment

### Backend → Railway

1. Push `server/` to GitHub
2. New project on railway.app → Deploy from GitHub
3. Set all env vars in Railway dashboard
4. Copy the public URL

### Frontend → Vercel

1. Push `client/` to GitHub
2. New project on vercel.com → Import repo (set root to `client/`)
3. Set `VITE_API_URL` to your Railway URL + `/api`
4. Deploy

---

## API Reference

| Method | Endpoint                         | Auth     | Description          |
| ------ | -------------------------------- | -------- | -------------------- |
| POST   | `/api/auth/register`             | —        | Sign up              |
| POST   | `/api/auth/login`                | —        | Sign in, returns JWT |
| GET    | `/api/auth/me`                   | ✓        | Get current user     |
| POST   | `/api/projects`                  | ✓        | Create project       |
| GET    | `/api/projects`                  | ✓        | List my projects     |
| GET    | `/api/projects/:id`              | ✓ Member | Project details      |
| POST   | `/api/projects/:id/members`      | ✓ Admin  | Add member           |
| DELETE | `/api/projects/:id/members/:uid` | ✓ Admin  | Remove member        |
| DELETE | `/api/projects/:id`              | ✓ Admin  | Delete project       |
| POST   | `/api/projects/:id/tasks`        | ✓ Admin  | Create task          |
| GET    | `/api/projects/:id/tasks`        | ✓ Member | List tasks           |
| PATCH  | `/api/projects/:id/tasks/:tid`   | ✓        | Update task          |
| DELETE | `/api/projects/:id/tasks/:tid`   | ✓ Admin  | Delete task          |
| GET    | `/api/projects/:id/dashboard`    | ✓ Member | Stats                |
