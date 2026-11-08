import { Router } from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/:id/read', authenticate, markNotificationRead);
router.patch('/notifications/read-all', authenticate, markAllNotificationsRead);

export default router;
