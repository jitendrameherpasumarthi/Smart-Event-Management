import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Volunteer from '../models/Volunteer.js';

// Helper to generate JWT Token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'eventhub_default_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn }
  );
};

// @desc    Register a new Student or Volunteer user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, department, year, role, phone, skills, availability } =
      req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // 2. Prevent public registration as organizer
    const requestedRole = (role || 'student').toLowerCase();
    if (requestedRole === 'organizer') {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: Organizer accounts cannot be created through public registration. They must be provisioned by faculty administration.',
      });
    }

    if (!['student', 'volunteer'].includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Only "student" or "volunteer" accounts can be registered.',
      });
    }

    // 3. Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `An account with email '${email}' is already registered. Please sign in instead.`,
      });
    }

    // 4. Create user
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      department: department || 'Computer Science & Engineering',
      year: year || '1st Year',
      role: requestedRole,
      phone: phone || '+91 98765 43210',
      skills: Array.isArray(skills) ? skills : skills ? [skills] : [],
      availability: availability || 'Flexible hours',
    });

    // 5. If registering as a volunteer, ensure a Volunteer profile document exists
    if (requestedRole === 'volunteer') {
      try {
        await Volunteer.create({
          user: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          year: user.year,
          phone: user.phone,
          skills: user.skills.length > 0 ? user.skills : ['Registration Desk', 'Stage Assistance'],
          availability: user.availability,
          status: 'Active',
        });
      } catch (volErr) {
        console.warn('Volunteer document creation notice:', volErr.message);
      }
    }

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate User & get JWT token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! Authentication successful.`,
      token,
      user: {
        id: user._id,
        customId: user.customId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        rollNumber: user.rollNumber,
        roleTitle: user.roleTitle,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        availability: user.availability,
        assignedEvents: user.assignedEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private (Protected)
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export default { registerUser, loginUser, getMe };
