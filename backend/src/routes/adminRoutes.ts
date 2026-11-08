import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  approveProvider,
  getAllBookings,
  deleteInappropriateReview,
  toggleFeaturedDestination,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize(['ADMIN']));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/bookings', getAllBookings);
router.patch('/providers/:id/approve', approveProvider);
router.delete('/reviews/:id', deleteInappropriateReview);
router.patch('/destinations/:id/feature', toggleFeaturedDestination);

export default router;
