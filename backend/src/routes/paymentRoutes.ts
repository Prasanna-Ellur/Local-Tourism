import { Router } from 'express';
import { processPayment } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { verifyPaymentSchema } from '../validators/bookingValidator';

const router = Router();

router.post('/process', authenticate, validateRequest(verifyPaymentSchema), processPayment);

export default router;
