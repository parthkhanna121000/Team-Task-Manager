# Team Task Manager

A full-stack MERN application for collaborative project and task management.

## Stack
- **Frontend:** React + Vite, React Router, Axios
- **Backend:** Node.js + Express, Mongoose, JWT
- **Database:** MongoDB Atlas
- **Deploy:** Railway (API) + Vercel (Frontend)

---

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
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g., `7d`) |
| `CLIENT_ORIGIN` | Frontend URL for CORS |

### Client (`client/.env`)
| Variable | Description |
|----------|-------------|
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

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Sign up |
| POST | `/api/auth/login` | — | Sign in, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |
| POST | `/api/projects` | ✓ | Create project |
| GET | `/api/projects` | ✓ | List my projects |
| GET | `/api/projects/:id` | ✓ Member | Project details |
| POST | `/api/projects/:id/members` | ✓ Admin | Add member |
| DELETE | `/api/projects/:id/members/:uid` | ✓ Admin | Remove member |
| DELETE | `/api/projects/:id` | ✓ Admin | Delete project |
| POST | `/api/projects/:id/tasks` | ✓ Admin | Create task |
| GET | `/api/projects/:id/tasks` | ✓ Member | List tasks |
| PATCH | `/api/projects/:id/tasks/:tid` | ✓ | Update task |
| DELETE | `/api/projects/:id/tasks/:tid` | ✓ Admin | Delete task |
| GET | `/api/projects/:id/dashboard` | ✓ Member | Stats |
