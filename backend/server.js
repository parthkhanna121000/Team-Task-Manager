require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { globalErrorHandler } = require("./utils/errorHandler");
const authRoutes = require("./features/auth/auth.routes");
const projectRoutes = require("./features/projects/project.routes");
const taskRoutes = require("./features/tasks/task.routes");

connectDB();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes); // ✅ changed from /api/tasks → /api/projects

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
