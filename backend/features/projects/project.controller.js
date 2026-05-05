const Project = require("../../models/Project");
const Task = require("../../models/Task");
const User = require("../../models/User");
const AppError = require("../../utils/AppError");

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return next(new AppError("Project name is required", 400));

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    await project.populate("members.user", "name email");
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ "members.user": req.user._id })
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    await req.project.populate("members.user", "name email");
    res.json({ project: req.project, role: req.projectRole });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("📩 addMember — email received:", email);
    console.log("📩 addMember — req.body:", req.body);

    if (!email) return next(new AppError("Email is required", 400));

    const userToAdd = await User.findOne({ email: email.toLowerCase() });
    console.log("📩 userToAdd found:", userToAdd ? "YES" : "NO");

    if (!userToAdd) return next(new AppError("User not found", 404));

    const alreadyMember = req.project.members.some(
      (m) => m.user.toString() === userToAdd._id.toString(),
    );
    if (alreadyMember)
      return next(new AppError("User is already a member", 400));

    req.project.members.push({ user: userToAdd._id, role: "member" });
    await req.project.save();
    await req.project.populate("members.user", "name email");

    res.json({ project: req.project });
  } catch (err) {
    next(err);
  }
};
const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.project.owner.toString()) {
      return next(new AppError("Cannot remove the project owner", 400));
    }

    req.project.members = req.project.members.filter(
      (m) => m.user.toString() !== userId,
    );
    await req.project.save();

    // Unassign tasks belonging to removed user in this project
    await Task.updateMany(
      { project: req.project._id, assignedTo: userId },
      { $set: { assignedTo: null } },
    );

    res.json({ message: "Member removed", project: req.project });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await Task.deleteMany({ project: req.project._id });
    await req.project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProject,
  addMember,
  removeMember,
  deleteProject,
};
