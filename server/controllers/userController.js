import User from '../models/User.js';
import Volunteer from '../models/Volunteer.js';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
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
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile (without changing role)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    // Explicit allowed updates (Do not allow changing role)
    const { name, phone, bio, department, year, rollNumber, roleTitle, avatar, skills, availability } =
      req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (department) user.department = department;
    if (year) user.year = year;
    if (rollNumber) user.rollNumber = rollNumber;
    if (roleTitle) user.roleTitle = roleTitle;
    if (avatar) user.avatar = avatar;
    if (skills) user.skills = Array.isArray(skills) ? skills : [skills];
    if (availability) user.availability = availability;

    const updatedUser = await user.save();

    // If volunteer, keep volunteer profile synced
    if (user.role === 'volunteer') {
      await Volunteer.findOneAndUpdate(
        { $or: [{ user: user._id }, { email: user.email }] },
        {
          $set: {
            name: user.name,
            phone: user.phone,
            department: user.department,
            year: user.year,
            skills: user.skills,
            availability: user.availability,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        year: updatedUser.year,
        rollNumber: updatedUser.rollNumber,
        roleTitle: updatedUser.roleTitle,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        availability: updatedUser.availability,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { getUserProfile, updateUserProfile };
