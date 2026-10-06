import express from 'express';
import {
  getVolunteers,
  getMyVolunteerProfile,
  createVolunteer,
  updateVolunteerStatus,
  assignEventToVolunteer,
} from '../controllers/volunteerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/me', authorize('volunteer'), getMyVolunteerProfile);

router
  .route('/')
  .get(getVolunteers)
  .post(createVolunteer);

router.patch('/:id/status', authorize('organizer'), updateVolunteerStatus);
router.post('/:id/assign-event', authorize('organizer'), assignEventToVolunteer);

export default router;
