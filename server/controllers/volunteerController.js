import Volunteer from '../models/Volunteer.js';
import User from '../models/User.js';

// @desc    Get all volunteers with search and filter
// @route   GET /api/volunteers
// @access  Private (Organizer & Authenticated)
export const getVolunteers = async (req, res, next) => {
  try {
    const { search, status, department } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current volunteer's own duty profile
// @route   GET /api/volunteers/me
// @access  Private (Volunteer only)
export const getMyVolunteerProfile = async (req, res, next) => {
  try {
    let volunteer = await Volunteer.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    });

    if (!volunteer) {
      // Auto-create volunteer document for volunteer user if missing
      volunteer = await Volunteer.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        department: req.user.department,
        year: req.user.year,
        phone: req.user.phone,
        skills: req.user.skills || ['Stage Coordination', 'Registration Desk'],
        assignedEvents: req.user.assignedEvents || [],
        status: 'Active',
      });
    }

    return res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register / Apply as Volunteer
// @route   POST /api/volunteers
// @access  Private
export const createVolunteer = async (req, res, next) => {
  try {
    const { name, email, department, year, phone, skills, availability, assignedEvents } =
      req.body;

    const volunteerEmail = (email || req.user.email).toLowerCase().trim();

    const existing = await Volunteer.findOne({ email: volunteerEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A volunteer profile with this email address already exists.',
      });
    }

    const volunteer = await Volunteer.create({
      customId: `vol-${Date.now().toString().slice(-4)}`,
      user: req.user._id,
      name: name || req.user.name,
      email: volunteerEmail,
      department: department || req.user.department,
      year: year || req.user.year,
      phone: phone || req.user.phone,
      skills: Array.isArray(skills) ? skills : skills ? [skills] : [],
      availability: availability || 'Full Day',
      assignedEvents: Array.isArray(assignedEvents) ? assignedEvents : [],
      status: req.user.role === 'organizer' ? 'Approved' : 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Volunteer profile submitted successfully.',
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer application status (Approve / Reject / Activate)
// @route   PATCH /api/volunteers/:id/status
// @access  Private (Organizer only)
export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Approved', 'Pending', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Active, Approved, Pending, Rejected',
      });
    }

    let volunteer = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      volunteer = await Volunteer.findById(id);
    }
    if (!volunteer) {
      volunteer = await Volunteer.findOne({ customId: id });
    }

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: `Volunteer not found with ID '${id}'.`,
      });
    }

    volunteer.status = status;
    await volunteer.save();

    return res.status(200).json({
      success: true,
      message: `Volunteer application for ${volunteer.name} updated to ${status}.`,
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign event responsibility to volunteer
// @route   POST /api/volunteers/:id/assign-event
// @access  Private (Organizer only)
export const assignEventToVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { eventName } = req.body;

    if (!eventName) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the event name to assign.',
      });
    }

    let volunteer = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      volunteer = await Volunteer.findById(id);
    }
    if (!volunteer) {
      volunteer = await Volunteer.findOne({ customId: id });
    }

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: `Volunteer not found with ID '${id}'.`,
      });
    }

    if (!volunteer.assignedEvents.includes(eventName)) {
      volunteer.assignedEvents.push(eventName);
      volunteer.assignedTasksCount += 1;
      await volunteer.save();
    }

    return res.status(200).json({
      success: true,
      message: `Assigned event '${eventName}' to volunteer ${volunteer.name}.`,
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getVolunteers,
  getMyVolunteerProfile,
  createVolunteer,
  updateVolunteerStatus,
  assignEventToVolunteer,
};
