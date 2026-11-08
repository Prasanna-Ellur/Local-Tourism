import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getProviderBookings,
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  createBookingSchema,
  cancelBookingSchema,
  updateBookingStatusSchema,
} from '../validators/bookingValidator';

const router = Router();

router.post('/', authenticate, validateRequest(createBookingSchema), createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/provider', authenticate, authorize(['SERVICE_PROVIDER', 'ADMIN']), getProviderBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/cancel', authenticate, validateRequest(cancelBookingSchema), cancelBooking);
router.patch(
  '/:id/status',
  authenticate,
  authorize(['SERVICE_PROVIDER', 'ADMIN']),
  validateRequest(updateBookingStatusSchema),
  updateBookingStatus
);

export default router;
