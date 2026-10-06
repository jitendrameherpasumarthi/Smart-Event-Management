import express from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncementById);

// Organizer routes
router.post('/', protect, authorize('organizer'), createAnnouncement);
router.put('/:id', protect, authorize('organizer'), updateAnnouncement);
router.delete('/:id', protect, authorize('organizer'), deleteAnnouncement);

export default router;
