const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../../middleware/auth");
const { attachProjectRole, adminOnly } = require("../../middleware/roleGuard");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require("./task.controller");

router.use("/:projectId/tasks", protect, attachProjectRole);
router.use("/:projectId/dashboard", protect, attachProjectRole);

router.get("/:projectId/dashboard", getDashboardStats);

router.post("/:projectId/tasks", adminOnly, createTask);
router.get("/:projectId/tasks", getTasks);
router.get("/:projectId/tasks/:taskId", getTask);
router.patch("/:projectId/tasks/:taskId", updateTask);
router.delete("/:projectId/tasks/:taskId", adminOnly, deleteTask);

module.exports = router;
