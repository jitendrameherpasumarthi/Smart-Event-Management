import express from 'express';
import {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my', authorize('volunteer'), getMyTasks);

router
  .route('/')
  .get(getTasks)
  .post(authorize('organizer'), createTask);

router
  .route('/:id')
  .put(authorize('organizer'), updateTask)
  .delete(authorize('organizer'), deleteTask);

router.patch('/:id/status', updateTaskStatus);

export default router;
