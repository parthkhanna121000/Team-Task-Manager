const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { attachProjectRole, adminOnly } = require("../../middleware/roleGuard");
const {
  createProject,
  getMyProjects,
  getProject,
  addMember,
  removeMember,
  deleteProject,
} = require("./project.controller");

router.use(protect);

router.post("/", createProject);
router.get("/", getMyProjects);
router.get("/:projectId", attachProjectRole, getProject);
router.post("/:projectId/members", attachProjectRole, adminOnly, addMember);
router.delete(
  "/:projectId/members/:userId",
  attachProjectRole,
  adminOnly,
  removeMember,
);
router.delete("/:projectId", attachProjectRole, adminOnly, deleteProject);

module.exports = router;
