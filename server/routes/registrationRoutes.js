import express from 'express';
import {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  cancelRegistration,
  updateRegistrationStatus,
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(createRegistration)
  .get(getRegistrations);

router
  .route('/:id')
  .get(getRegistrationById)
  .delete(cancelRegistration);

router.patch('/:id/status', authorize('organizer'), updateRegistrationStatus);

export default router;
