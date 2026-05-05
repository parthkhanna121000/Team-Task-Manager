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

console.log("CLIENT_ORIGIN:", process.env.CLIENT_ORIGIN);

const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [process.env.CLIENT_ORIGIN, "http://localhost:5173"];
    console.log("Request origin:", origin);
    console.log("Allowed origins:", allowed);
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));

app.use(express.json());

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
