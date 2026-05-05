const Project = require("../models/Project");
const AppError = require("../utils/AppError");

// Attaches req.project and req.projectRole
const attachProjectRole = async (req, res, next) => {
  try {
    console.log("🔍 attachProjectRole — projectId:", req.params.projectId);
    console.log("🔍 attachProjectRole — userId:", req.user?._id);

    const project = await Project.findById(req.params.projectId);
    console.log("🔍 Project found:", project ? "YES" : "NO");

    if (!project) return next(new AppError("Project not found", 404));

    const membership = project.members.find(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    console.log("🔍 Membership found:", membership ? membership.role : "NO");

    if (!membership) {
      return next(new AppError("You are not a member of this project", 403));
    }

    req.project = project;
    req.projectRole = membership.role;
    next();
  } catch (err) {
    console.error("🔍 attachProjectRole ERROR:", err.message);
    next(err);
  }
};
// Use after attachProjectRole
const adminOnly = (req, res, next) => {
  if (req.projectRole !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};

module.exports = { attachProjectRole, adminOnly };
