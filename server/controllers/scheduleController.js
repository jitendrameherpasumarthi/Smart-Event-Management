import Schedule from '../models/Schedule.js';
import Event from '../models/Event.js';

// @desc    Get all schedules (filter by eventId or date)
// @route   GET /api/schedules
// @access  Public
export const getSchedules = async (req, res, next) => {
  try {
    const { eventId, date } = req.query;
    let query = {};

    if (eventId && eventId !== 'All') {
      if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
        query.event = eventId;
      } else {
        query.$or = [{ eventId }, { eventName: { $regex: eventId, $options: 'i' } }];
      }
    }

    if (date) {
      query.date = date;
    }

    const schedules = await Schedule.find(query).sort({ date: 1, startTime: 1 });

    return res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single schedule item
// @route   GET /api/schedules/:id
// @access  Public
export const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let schedule = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      schedule = await Schedule.findById(id);
    }
    if (!schedule) {
      schedule = await Schedule.findOne({ customId: id });
    }

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: `Schedule slot not found with ID '${id}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new schedule slot
// @route   POST /api/schedules
// @access  Private (Organizer only)
export const createSchedule = async (req, res, next) => {
  try {
    const {
      eventId,
      eventName,
      activity,
      description,
      date,
      startTime,
      endTime,
      venue,
      coordinator,
    } = req.body;

    if (!activity || !date || !startTime || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide activity, date, start time, and venue location.',
      });
    }

    const customId = `sch-${Date.now().toString().slice(-4)}`;

    const schedule = await Schedule.create({
      customId,
      eventId: eventId || '',
      eventName: eventName || 'TechFest 2026',
      activity,
      description: description || '',
      date,
      startTime,
      endTime: endTime || startTime,
      venue,
      coordinator: coordinator || req.user.name,
    });

    return res.status(201).json({
      success: true,
      message: 'Schedule slot added successfully.',
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update schedule slot
// @route   PUT /api/schedules/:id
// @access  Private (Organizer only)
export const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    let schedule = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      schedule = await Schedule.findById(id);
    }
    if (!schedule) {
      schedule = await Schedule.findOne({ customId: id });
    }

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: `Schedule slot not found with ID '${id}'.`,
      });
    }

    const updated = await Schedule.findByIdAndUpdate(
      schedule._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Schedule slot updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete schedule slot
// @route   DELETE /api/schedules/:id
// @access  Private (Organizer only)
export const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    let schedule = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      schedule = await Schedule.findById(id);
    }
    if (!schedule) {
      schedule = await Schedule.findOne({ customId: id });
    }

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: `Schedule slot not found with ID '${id}'.`,
      });
    }

    await Schedule.findByIdAndDelete(schedule._id);

    return res.status(200).json({
      success: true,
      message: `Schedule slot '${schedule.activity}' was removed.`,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
