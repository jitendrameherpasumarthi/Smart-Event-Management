import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
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
      required: [true, 'Please provide event name'],
    },
    activity: {
      type: String,
      required: [true, 'Please provide activity title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Please provide schedule date (YYYY-MM-DD)'],
    },
    startTime: {
      type: String,
      required: [true, 'Please provide start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please provide end time'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide venue location'],
    },
    coordinator: {
      type: String,
      required: [true, 'Please provide coordinator name'],
    },
  },
  {
    timestamps: true,
  }
);

const Schedule =
  mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);

export default Schedule;
