import Announcement from '../models/Announcement.js';

// @desc    Get all announcements with audience / priority filtering
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req, res, next) => {
  try {
    const { priority, audience, eventId, search } = req.query;
    let query = {};

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (audience && audience !== 'All') {
      query.$or = [{ audience }, { audience: 'All Participants' }];
    }

    if (eventId && eventId !== 'All') {
      query.$or = [{ event: eventId }, { eventId }];
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const announcements = await Announcement.find(query).sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single announcement by ID
// @route   GET /api/announcements/:id
// @access  Public
export const getAnnouncementById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let announcement = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      announcement = await Announcement.findById(id);
    }
    if (!announcement) {
      announcement = await Announcement.findOne({ customId: id });
    }

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: `Announcement not found with ID '${id}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish new announcement
// @route   POST /api/announcements
// @access  Private (Organizer only)
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, eventId, eventName, priority, audience, postedBy } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide announcement title and message body.',
      });
    }

    const customId = `ann-${Date.now().toString().slice(-4)}`;

    const announcement = await Announcement.create({
      customId,
      title,
      message,
      eventId: eventId || '',
      eventName: eventName || 'General Campus',
      postedBy: postedBy || req.user.name,
      priority: priority || 'Normal',
      audience: audience || 'All Participants',
      date: new Date().toISOString().split('T')[0],
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement broadcasted successfully.',
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Organizer only)
export const updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    let announcement = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      announcement = await Announcement.findById(id);
    }
    if (!announcement) {
      announcement = await Announcement.findOne({ customId: id });
    }

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: `Announcement not found with ID '${id}'.`,
      });
    }

    const updated = await Announcement.findByIdAndUpdate(
      announcement._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / Retract announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Organizer only)
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    let announcement = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      announcement = await Announcement.findById(id);
    }
    if (!announcement) {
      announcement = await Announcement.findOne({ customId: id });
    }

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: `Announcement not found with ID '${id}'.`,
      });
    }

    await Announcement.findByIdAndDelete(announcement._id);

    return res.status(200).json({
      success: true,
      message: `Announcement '${announcement.title}' was retracted.`,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
