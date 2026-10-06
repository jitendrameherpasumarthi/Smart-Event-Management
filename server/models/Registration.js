import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide participant name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide participant email'],
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Please provide academic year'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    eventId: {
      type: String,
    },
    eventName: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Attended'],
      default: 'Confirmed',
    },
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee 1 registration per user per event at database level
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration =
  mongoose.models.Registration ||
  mongoose.model('Registration', registrationSchema);

export default Registration;
