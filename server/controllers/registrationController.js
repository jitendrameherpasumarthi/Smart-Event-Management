import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// Helper to generate readable ticket number
const generateTicketNumber = (eventTitle) => {
  const words = (eventTitle || 'EVT').split(' ');
  const prefix = words.length > 1 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : 'EH';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}26-${randomNum}`;
};

// @desc    Register a student for an event
// @route   POST /api/registrations
// @access  Private (Student & Volunteer only)
export const createRegistration = async (req, res, next) => {
  try {
    const { eventId, name, email, department, year, phone } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the event ID you wish to register for.',
      });
    }

    // 1. Find Event
    let event = null;
    if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(eventId);
    }
    if (!event) {
      event = await Event.findOne({ customId: eventId });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with identifier '${eventId}'.`,
      });
    }

    // 2. Prevent duplicate registration
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: event._id,
      status: { $ne: 'Cancelled' },
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: `You are already registered for '${event.title}' with Ticket #${existingRegistration.ticketNumber}.`,
        ticketNumber: existingRegistration.ticketNumber,
      });
    }

    // 3. Check event capacity limit
    if (event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `Registration Closed: Event '${event.title}' has reached maximum participant capacity (${event.maxParticipants}).`,
      });
    }

    // 4. Generate unique ticket number
    let ticketNumber = generateTicketNumber(event.title);
    // Guarantee uniqueness
    let ticketExists = await Registration.findOne({ ticketNumber });
    while (ticketExists) {
      ticketNumber = generateTicketNumber(event.title);
      ticketExists = await Registration.findOne({ ticketNumber });
    }

    // 5. Create Registration
    const registration = await Registration.create({
      customId: `part-${Date.now().toString().slice(-4)}`,
      user: req.user._id,
      name: name || req.user.name,
      email: email || req.user.email,
      department: department || req.user.department || 'Computer Science',
      year: year || req.user.year || '1st Year',
      phone: phone || req.user.phone || '',
      event: event._id,
      eventId: event.customId || event._id.toString(),
      eventName: event.title,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      ticketNumber,
    });

    // 6. Increment registeredCount on Event
    await Event.findByIdAndUpdate(event._id, {
      $inc: { registeredCount: 1 },
    });

    return res.status(201).json({
      success: true,
      message: `Registration confirmed! Your seat is reserved for ${event.title}.`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations (Organizer gets all, Student gets only theirs)
// @route   GET /api/registrations
// @access  Private
export const getRegistrations = async (req, res, next) => {
  try {
    const { eventId, status, search } = req.query;
    let query = {};

    // If student or volunteer, only view own registrations
    if (req.user.role === 'student' || req.user.role === 'volunteer') {
      query.user = req.user._id;
    } else {
      // Organizer queries
      if (eventId && eventId !== 'All') {
        if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
          query.event = eventId;
        } else {
          query.$or = [{ eventId }, { eventName: { $regex: eventId, $options: 'i' } }];
        }
      }

      if (status && status !== 'All') {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { ticketNumber: { $regex: search, $options: 'i' } },
        ];
      }
    }

    const registrations = await Registration.find(query)
      .populate('event', 'title date venue banner maxParticipants registeredCount')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single registration details
// @route   GET /api/registrations/:id
// @access  Private
export const getRegistrationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let registration = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id).populate('event');
    }
    if (!registration) {
      registration = await Registration.findOne({
        $or: [{ customId: id }, { ticketNumber: id }],
      }).populate('event');
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration pass not found with ID/Ticket '${id}'.`,
      });
    }

    // Access check: Only owner or organizer can view
    if (
      req.user.role !== 'organizer' &&
      registration.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to view another student’s pass.',
      });
    }

    return res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration / release seat
// @route   DELETE /api/registrations/:id
// @access  Private
export const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;

    let registration = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id);
    }
    if (!registration) {
      registration = await Registration.findOne({ customId: id });
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration not found with ID '${id}'.`,
      });
    }

    // Permission check
    if (
      req.user.role !== 'organizer' &&
      registration.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot cancel another student’s registration.',
      });
    }

    // Mark cancelled
    if (registration.status !== 'Cancelled') {
      registration.status = 'Cancelled';
      await registration.save();

      // Decrement event registered count
      await Event.findByIdAndUpdate(registration.event, {
        $inc: { registeredCount: -1 },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Registration pass #${registration.ticketNumber} was cancelled and the seat released.`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update registration status (Approve / Attend / Confirm)
// @route   PATCH /api/registrations/:id/status
// @access  Private (Organizer only)
export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Confirmed', 'Pending', 'Cancelled', 'Attended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Confirmed, Pending, Cancelled, Attended',
      });
    }

    let registration = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id);
    }
    if (!registration) {
      registration = await Registration.findOne({ customId: id });
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration not found with ID '${id}'.`,
      });
    }

    registration.status = status;
    await registration.save();

    return res.status(200).json({
      success: true,
      message: `Registration status updated to ${status}.`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  cancelRegistration,
  updateRegistrationStatus,
};
