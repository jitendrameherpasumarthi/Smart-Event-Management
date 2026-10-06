import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please provide volunteer name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide volunteer email'],
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
    assignedEvents: {
      type: [String],
      default: [],
    },
    assignedTasksCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedTasksCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
      type: String,
      default: 'Weekdays & Weekends (Full Day)',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Approved', 'Rejected'],
      default: 'Active',
    },
    skills: {
      type: [String],
      default: ['Registration Desk', 'Hospitality', 'Stage Assistance'],
    },
  },
  {
    timestamps: true,
  }
);

const Volunteer =
  mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
