================================================================
  TTM — Team Task Manager
  Full-Stack Web Application
================================================================

LIVE URLS
---------
Frontend : https://your-app.vercel.app
Backend  : https://your-app.up.railway.app
GitHub   : https://github.com/yourusername/your-repo


----------------------------------------------------------------
PROJECT OVERVIEW
----------------------------------------------------------------

A full-stack task management web app where users can create
projects, manage teams, assign tasks, and track progress using
role-based access control (Admin / Member).

Built as part of a coding assignment using the MERN stack.


----------------------------------------------------------------
TECH STACK
----------------------------------------------------------------

Frontend  : React (Vite), React Router, Axios
Backend   : Node.js, Express.js
Database  : MongoDB (Mongoose)
Auth      : JWT (JSON Web Tokens)
Hosting   : Railway (backend), Vercel (frontend)


----------------------------------------------------------------
FEATURES
----------------------------------------------------------------

Authentication
  - Signup with name, email, password
  - Login returns a signed JWT
  - Protected routes via middleware

Projects
  - Create a project (creator automatically becomes Admin)
  - Admin can add members by email
  - Admin can remove members
  - Members can view projects they belong to

Tasks
  - Create tasks with title, description, priority, due date
  - Assign tasks to project members
  - Status tracking: To Do → In Progress → Done
  - Admin has full control over all tasks
  - Members can only update status of their own assigned tasks

Dashboard
  - Total task count
  - Breakdown by status (To Do / In Progress / Done)
  - Tasks assigned per team member with completion percentage
  - Overdue task count

Role-Based Access Control
  - Admin: full access (create/edit/delete tasks, manage members)
  - Member: view-only + can update own assigned task status


----------------------------------------------------------------
BACKEND FOLDER STRUCTURE
----------------------------------------------------------------

backend/
  server.js               Entry point
  .env                    Environment variables (not in repo)
  .env.example            Template for required variables
  config/
    db.js                 MongoDB connection
  middleware/
    auth.js               JWT verification
    roleGuard.js          Admin/Member role enforcement
  models/
    User.js
    Project.js
    Task.js
  features/
    auth/
      auth.routes.js
      auth.controller.js
    projects/
      project.routes.js
      project.controller.js
    tasks/
      task.routes.js
      task.controller.js
  utils/
    AppError.js           Custom error class
    errorHandler.js       Global error middleware


----------------------------------------------------------------
FRONTEND FOLDER STRUCTURE
----------------------------------------------------------------

frontend/
  src/
    api/
      axiosClient.js      Axios instance with JWT interceptor
    context/
      AuthContext.jsx     Auth state and JWT storage
    hooks/
      useProjects.js
      useTasks.js
    pages/
      LoginPage.jsx
      RegisterPage.jsx
      ProjectsPage.jsx
      ProjectDetailPage.jsx
      DashboardPage.jsx
    components/
      Navbar.jsx
      ProtectedRoute.jsx
      TaskBoard.jsx       Kanban columns
      TaskCard.jsx
      CreateTaskModal.jsx
      MemberList.jsx
      StatCard.jsx
    App.jsx
    main.jsx


----------------------------------------------------------------
API ENDPOINTS
----------------------------------------------------------------

Auth
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me

Projects
  POST   /api/projects
  GET    /api/projects
  GET    /api/projects/:id
  POST   /api/projects/:id/members
  DELETE /api/projects/:id/members/:userId
  DELETE /api/projects/:id

Tasks
  POST   /api/projects/:id/tasks
  GET    /api/projects/:id/tasks
  GET    /api/projects/:id/tasks/:taskId
  PATCH  /api/projects/:id/tasks/:taskId
  DELETE /api/projects/:id/tasks/:taskId

Dashboard
  GET    /api/projects/:id/dashboard


----------------------------------------------------------------
DATABASE SCHEMAS
----------------------------------------------------------------

User
  name, email, password (bcrypt hashed)

Project
  name, description, owner (ref: User)
  members: [{ user (ref: User), role: admin|member }]

Task
  title, description, project (ref: Project)
  assignedTo (ref: User), createdBy (ref: User)
  priority: low|medium|high
  status: todo|in_progress|done
  dueDate


----------------------------------------------------------------
LOCAL SETUP
----------------------------------------------------------------

Requirements: Node.js 18+, MongoDB Atlas account

1. Clone the repository
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo

2. Backend setup
   cd backend
   npm install
   cp .env.example .env
   (fill in MONGO_URI, JWT_SECRET in .env)
   npm run dev

3. Frontend setup
   cd ../frontend
   npm install
   (create .env with VITE_API_URL=http://localhost:5000/api)
   npm run dev

4. Open http://localhost:5173


----------------------------------------------------------------
ENVIRONMENT VARIABLES
----------------------------------------------------------------

Backend (.env)
  PORT=5000
  MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ttm
  JWT_SECRET=your_long_random_secret
  JWT_EXPIRES_IN=7d
  CLIENT_ORIGIN=https://your-app.vercel.app

Frontend (.env)
  VITE_API_URL=http://localhost:5000/api
  (use Railway URL in production)


----------------------------------------------------------------
DEPLOYMENT
----------------------------------------------------------------

Backend deployed on Railway
  - Root directory set to: backend
  - Start command: node server.js
  - Environment variables set in Railway dashboard

Frontend deployed on Vercel
  - Root directory set to: frontend
  - Framework: Vite (auto-detected)
  - VITE_API_URL set in Vercel dashboard

CORS configured in server.js to allow only the Vercel origin.
MongoDB Atlas network access set to allow all IPs (0.0.0.0/0).


----------------------------------------------------------------
KNOWN LIMITATIONS
----------------------------------------------------------------

- No real-time updates (no WebSocket)
- No file attachments on tasks
- No pagination on task lists
- Refresh tokens not implemented (JWT expires in 7 days)


================================================================