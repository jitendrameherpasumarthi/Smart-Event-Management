import express from 'express';
import {
  getStudentDashboard,
  getOrganizerDashboard,
  getVolunteerDashboard,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/student', authorize('student', 'volunteer'), getStudentDashboard);
router.get('/organizer', authorize('organizer'), getOrganizerDashboard);
router.get('/volunteer', authorize('volunteer'), getVolunteerDashboard);

export default router;
