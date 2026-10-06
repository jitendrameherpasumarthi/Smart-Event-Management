import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Volunteer from '../models/Volunteer.js';
import Task from '../models/Task.js';
import Schedule from '../models/Schedule.js';
import Announcement from '../models/Announcement.js';
import {
  seedUsers,
  seedEvents,
  seedRegistrations,
  seedVolunteers,
  seedTasks,
  seedSchedules,
  seedAnnouncements,
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub_db';
  console.log('🔄 Connecting to MongoDB for database seeding...');
  console.log(`📍 Target URI: ${uri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);

    // 1. Wipe collections
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
      Volunteer.deleteMany({}),
      Task.deleteMany({}),
      Schedule.deleteMany({}),
      Announcement.deleteMany({}),
    ]);
    console.log('✨ All previous collections cleared.');

    // 2. Seed Users (pre('save') handles bcrypt hashing)
    console.log('👤 Seeding 3 demo users...');
    const createdUsers = await User.create(seedUsers);
    console.log(`✅ ${createdUsers.length} Demo Users seeded.`);

    const studentUser = createdUsers.find((u) => u.role === 'student');
    const organizerUser = createdUsers.find((u) => u.role === 'organizer');
    const volunteerUser = createdUsers.find((u) => u.role === 'volunteer');

    // 3. Seed Events
    console.log('🎪 Seeding 8 campus events...');
    const eventsToSeed = seedEvents.map((evt) => ({
      ...evt,
      createdBy: organizerUser?._id,
    }));
    const createdEvents = await Event.create(eventsToSeed);
    console.log(`✅ ${createdEvents.length} Events seeded.`);

    // Map customId to ObjectId for relational linking
    const eventMap = {};
    createdEvents.forEach((evt) => {
      if (evt.customId) eventMap[evt.customId] = evt;
    });

    // 4. Seed Volunteers
    console.log('🤝 Seeding 8 volunteers...');
    const volunteersToSeed = seedVolunteers.map((vol) => {
      // If matches demo volunteer, link user
      const isDemoVol = vol.email === volunteerUser?.email;
      return {
        ...vol,
        user: isDemoVol ? volunteerUser?._id : new mongoose.Types.ObjectId(),
      };
    });
    const createdVolunteers = await Volunteer.create(volunteersToSeed);
    console.log(`✅ ${createdVolunteers.length} Volunteers seeded.`);

    // 5. Seed Tasks
    console.log('📋 Seeding 15 tasks...');
    const tasksToSeed = seedTasks.map((tsk) => {
      const linkedEvent = eventMap[tsk.eventId];
      return {
        ...tsk,
        event: linkedEvent ? linkedEvent._id : undefined,
        assignedVolunteer: volunteerUser?._id,
        createdBy: organizerUser?._id,
      };
    });
    const createdTasks = await Task.create(tasksToSeed);
    console.log(`✅ ${createdTasks.length} Tasks seeded.`);

    // 6. Seed Schedules
    console.log('📅 Seeding 15 schedules...');
    const schedulesToSeed = seedSchedules.map((sch) => {
      const linkedEvent = eventMap[sch.eventId];
      return {
        ...sch,
        event: linkedEvent ? linkedEvent._id : undefined,
      };
    });
    const createdSchedules = await Schedule.create(schedulesToSeed);
    console.log(`✅ ${createdSchedules.length} Schedules seeded.`);

    // 7. Seed Announcements
    console.log('📢 Seeding 10 announcements...');
    const announcementsToSeed = seedAnnouncements.map((ann) => {
      const linkedEvent = eventMap[ann.eventId];
      return {
        ...ann,
        event: linkedEvent ? linkedEvent._id : undefined,
        createdBy: organizerUser?._id,
      };
    });
    const createdAnnouncements = await Announcement.create(announcementsToSeed);
    console.log(`✅ ${createdAnnouncements.length} Announcements seeded.`);

    // 8. Seed Registrations
    console.log('🎟️ Seeding 15 registrations...');
    const registrationsToSeed = seedRegistrations.map((reg, idx) => {
      const linkedEvent = eventMap[reg.eventId] || createdEvents[idx % createdEvents.length];
      const isAarav = reg.email === studentUser?.email;
      return {
        ...reg,
        user: isAarav ? studentUser?._id : new mongoose.Types.ObjectId(),
        event: linkedEvent?._id,
      };
    });
    const createdRegistrations = await Registration.create(registrationsToSeed);
    console.log(`✅ ${createdRegistrations.length} Registrations seeded.`);

    console.log('\n========================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================');
    console.log(`  👤 Users:          ${createdUsers.length} (Demo Student, Organizer, Volunteer)`);
    console.log(`  🎪 Events:         ${createdEvents.length}`);
    console.log(`  🎟️ Registrations:  ${createdRegistrations.length}`);
    console.log(`  🤝 Volunteers:     ${createdVolunteers.length}`);
    console.log(`  📋 Tasks:          ${createdTasks.length}`);
    console.log(`  📅 Schedules:      ${createdSchedules.length}`);
    console.log(`  📢 Announcements:  ${createdAnnouncements.length}`);
    console.log('========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ DATABASE SEEDING FAILED');
    console.error(`👉 Error Message: ${error.message}`);
    console.error(`💡 Note: If MongoDB server is offline, start mongod or update MONGO_URI in server/.env.`);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDatabase();
