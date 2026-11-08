import { Router } from 'express';
import authRoutes from './authRoutes';
import destinationRoutes from './destinationRoutes';
import homestayRoutes from './homestayRoutes';
import guideRoutes from './guideRoutes';
import experienceRoutes from './experienceRoutes';
import businessRoutes from './businessRoutes';
import bookingRoutes from './bookingRoutes';
import paymentRoutes from './paymentRoutes';
import reviewRoutes from './reviewRoutes';
import adminRoutes from './adminRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', destinationRoutes);
router.use('/homestays', homestayRoutes);
router.use('/guides', guideRoutes);
router.use('/experiences', experienceRoutes);
router.use('/businesses', businessRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

export default router;
