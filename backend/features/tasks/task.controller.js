const Task = require("../../models/Task");
const AppError = require("../../utils/AppError");

const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    if (!title) return next(new AppError("Task title is required", 400));

    // Validate assignee is a project member
    if (assignedTo) {
      const isMember = req.project.members.some(
        (m) => m.user.toString() === assignedTo,
      );
      if (!isMember)
        return next(new AppError("Assignee is not a project member", 400));
    }

    const task = await Task.create({
      title,
      description,
      project: req.project._id,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || "medium",
      dueDate: dueDate || null,
    });

    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const filter = { project: req.project._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.project._id,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) return next(new AppError("Task not found", 404));
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.project._id,
    });
    if (!task) return next(new AppError("Task not found", 404));

    if (req.projectRole === "member") {
      // Members can only update status of their own assigned tasks
      if (
        !task.assignedTo ||
        task.assignedTo.toString() !== req.user._id.toString()
      ) {
        return next(
          new AppError("You can only update tasks assigned to you", 403),
        );
      }
      const { status } = req.body;
      if (!status)
        return next(new AppError("Members can only update task status", 400));
      task.status = status;
    } else {
      // Admin can update anything
      const { title, description, assignedTo, priority, status, dueDate } =
        req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (assignedTo !== undefined) {
        if (assignedTo) {
          const isMember = req.project.members.some(
            (m) => m.user.toString() === assignedTo,
          );
          if (!isMember)
            return next(new AppError("Assignee is not a project member", 400));
        }
        task.assignedTo = assignedTo || null;
      }
    }

    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: req.project._id,
    });
    if (!task) return next(new AppError("Task not found", 404));
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const projectId = req.project._id;
    const now = new Date();

    const [statusCounts, userCounts, overdueCount, totalCount] =
      await Promise.all([
        // Tasks grouped by status
        Task.aggregate([
          { $match: { project: projectId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        // Tasks grouped by assignee
        Task.aggregate([
          { $match: { project: projectId, assignedTo: { $ne: null } } },
          {
            $group: {
              _id: "$assignedTo",
              count: { $sum: 1 },
              done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              name: "$user.name",
              email: "$user.email",
              count: 1,
              done: 1,
            },
          },
        ]),

        // Overdue tasks (due date passed, not done)
        Task.countDocuments({
          project: projectId,
          status: { $ne: "done" },
          dueDate: { $lt: now, $ne: null },
        }),

        Task.countDocuments({ project: projectId }),
      ]);

    // Normalize status counts into a map
    const byStatus = { todo: 0, in_progress: 0, done: 0 };
    statusCounts.forEach(({ _id, count }) => {
      byStatus[_id] = count;
    });

    res.json({
      total: totalCount,
      byStatus,
      byUser: userCounts,
      overdue: overdueCount,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getDashboardStats,
};
