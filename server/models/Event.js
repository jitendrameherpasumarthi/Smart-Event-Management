import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide an event category'],
      enum: {
        values: [
          'Technical',
          'Cultural',
          'Sports',
          'Workshop',
          'Hackathon',
          'Seminar',
          'General',
        ],
        message: '{VALUE} is not a valid event category',
      },
      default: 'Technical',
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
    },
    about: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    },
    date: {
      type: String,
      required: [true, 'Please provide an event date (YYYY-MM-DD)'],
    },
    endDate: {
      type: String,
    },
    startTime: {
      type: String,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '05:00 PM',
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue location'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Please provide host department/organizer'],
      trim: true,
    },
    organizerContact: {
      type: String,
      default: '',
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please provide maximum participant limit'],
      min: [1, 'Capacity must be at least 1'],
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Completed', 'Cancelled'],
      default: 'Published',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    requirements: {
      type: String,
      default: '',
    },
    rules: {
      type: [String],
      default: [],
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

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
