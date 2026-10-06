import express from 'express';
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getSchedules);
router.get('/:id', getScheduleById);

// Organizer routes
router.post('/', protect, authorize('organizer'), createSchedule);
router.put('/:id', protect, authorize('organizer'), updateSchedule);
router.delete('/:id', protect, authorize('organizer'), deleteSchedule);

export default router;
