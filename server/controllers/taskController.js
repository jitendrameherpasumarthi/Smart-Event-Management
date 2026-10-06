import Task from '../models/Task.js';
import Volunteer from '../models/Volunteer.js';
import Event from '../models/Event.js';

// @desc    Get all tasks with filter options
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { priority, status, eventId, volunteerId, search } = req.query;
    let query = {};

    // If volunteer, only view own tasks by default unless explicitly searching
    if (req.user.role === 'volunteer') {
      query.$or = [
        { assignedVolunteer: req.user._id },
        { assignedVolunteerName: req.user.name },
        { assignedVolunteerId: req.user.customId },
      ];
    } else if (volunteerId) {
      query.$or = [
        { assignedVolunteer: volunteerId },
        { assignedVolunteerId: volunteerId },
      ];
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (eventId && eventId !== 'All') {
      query.$or = [{ event: eventId }, { eventId }];
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current volunteer's assigned tasks
// @route   GET /api/tasks/my
// @access  Private (Volunteer only)
export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignedVolunteer: req.user._id },
        { assignedVolunteerName: req.user.name },
        { assignedVolunteerId: req.user.customId },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Organizer only)
export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      eventId,
      eventName,
      assignedVolunteerId,
      assignedVolunteerName,
      priority,
      deadline,
      status,
    } = req.body;

    if (!title || !eventName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title and event name.',
      });
    }

    const customId = `tsk-${Date.now().toString().slice(-4)}`;

    const task = await Task.create({
      customId,
      title,
      description: description || '',
      eventId: eventId || '',
      eventName,
      assignedVolunteerId: assignedVolunteerId || '',
      assignedVolunteerName: assignedVolunteerName || 'Unassigned',
      priority: priority || 'Medium',
      deadline: deadline || '2026-11-15 05:00 PM',
      status: status || 'Pending',
      createdBy: req.user._id,
    });

    // Increment assigned volunteer count if assigned
    if (assignedVolunteerName && assignedVolunteerName !== 'Unassigned') {
      await Volunteer.findOneAndUpdate(
        { name: assignedVolunteerName },
        { $inc: { assignedTasksCount: 1 } }
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Task created and delegated successfully.',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private (Organizer only)
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    let task = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      task = await Task.findById(id);
    }
    if (!task) {
      task = await Task.findOne({ customId: id });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID '${id}'.`,
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      task._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (Pending -> In Progress -> Completed)
// @route   PATCH /api/tasks/:id/status
// @access  Private (Volunteer & Organizer)
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Pending, In Progress, Completed',
      });
    }

    let task = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      task = await Task.findById(id);
    }
    if (!task) {
      task = await Task.findOne({ customId: id });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID '${id}'.`,
      });
    }

    const previousStatus = task.status;
    task.status = status;
    await task.save();

    // If marked Completed from non-completed, update volunteer stats
    if (status === 'Completed' && previousStatus !== 'Completed') {
      if (task.assignedVolunteerName) {
        await Volunteer.findOneAndUpdate(
          { name: task.assignedVolunteerName },
          { $inc: { completedTasksCount: 1 } }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: `Task status updated to ${status}.`,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Organizer only)
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    let task = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      task = await Task.findById(id);
    }
    if (!task) {
      task = await Task.findOne({ customId: id });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID '${id}'.`,
      });
    }

    await Task.findByIdAndDelete(task._id);

    return res.status(200).json({
      success: true,
      message: `Task '${task.title}' was deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
