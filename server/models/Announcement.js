import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide announcement title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide announcement message'],
      trim: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    eventId: {
      type: String,
    },
    eventName: {
      type: String,
      default: 'General Campus',
    },
    postedBy: {
      type: String,
      required: [true, 'Please provide author / convener name'],
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal',
    },
    audience: {
      type: String,
      enum: [
        'All Participants',
        'Volunteers',
        'Students',
        'Specific Event',
      ],
      default: 'All Participants',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Announcement =
  mongoose.models.Announcement ||
  mongoose.model('Announcement', announcementSchema);

export default Announcement;
