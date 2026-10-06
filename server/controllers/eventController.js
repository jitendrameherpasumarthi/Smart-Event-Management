import Event from '../models/Event.js';
import Schedule from '../models/Schedule.js';
import Task from '../models/Task.js';

// @desc    Get all events with search, category & status filtering
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { search, category, status, featured, sort } = req.query;
    let query = {};

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Featured flag
    if (featured !== undefined) {
      query.isFeatured = featured === 'true';
    }

    let queryBuilder = Event.find(query);

    // Sorting
    if (sort === 'date') {
      queryBuilder = queryBuilder.sort({ date: 1 });
    } else if (sort === 'popular') {
      queryBuilder = queryBuilder.sort({ registeredCount: -1 });
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const events = await queryBuilder;

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID or customId
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let event = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }

    if (!event) {
      event = await Event.findOne({ customId: id });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with ID '${id}'.`,
      });
    }

    // Optionally include event schedules
    const schedules = await Schedule.find({
      $or: [{ event: event._id }, { eventId: event.customId || id }],
    }).sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        schedules,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer only)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      endDate,
      startTime,
      endTime,
      venue,
      maxParticipants,
      organizer,
      organizerContact,
      deadline,
      status,
      banner,
      tags,
      requirements,
      rules,
    } = req.body;

    if (!title || !description || !venue || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide event title, description, venue, and date.',
      });
    }

    const customId = `evt-${Date.now().toString().slice(-4)}`;

    const event = await Event.create({
      customId,
      title,
      description,
      category: category || 'Technical',
      date,
      endDate: endDate || date,
      startTime: startTime || '09:00 AM',
      endTime: endTime || '05:00 PM',
      venue,
      maxParticipants: maxParticipants || 100,
      organizer: organizer || req.user.department || 'Department of Computer Science',
      organizerContact: organizerContact || req.user.email,
      deadline: deadline || '',
      status: status || 'Published',
      banner:
        banner ||
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      requirements: requirements || '',
      rules: Array.isArray(rules) ? rules : rules ? [rules] : [],
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Event created and published successfully.',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing event
// @route   PUT /api/events/:id
// @access  Private (Organizer only)
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    let event = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }
    if (!event) {
      event = await Event.findOne({ customId: id });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with identifier '${id}'.`,
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event and related tasks/schedules
// @route   DELETE /api/events/:id
// @access  Private (Organizer only)
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    let event = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }
    if (!event) {
      event = await Event.findOne({ customId: id });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with ID '${id}'.`,
      });
    }

    // Delete child items
    await Schedule.deleteMany({
      $or: [{ event: event._id }, { eventId: event.customId }],
    });
    await Task.deleteMany({
      $or: [{ event: event._id }, { eventId: event.customId }],
    });

    await Event.findByIdAndDelete(event._id);

    return res.status(200).json({
      success: true,
      message: `Event '${event.title}' and associated program tasks were deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export default { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
