import { Router } from 'express';
import { getBusinesses, getBusinessById, createBusiness } from '../controllers/businessController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createBusinessSchema } from '../validators/businessValidator';

const router = Router();

router.get('/', getBusinesses);
router.get('/:id', getBusinessById);
router.post(
  '/',
  authenticate,
  authorize(['SERVICE_PROVIDER', 'ADMIN']),
  validateRequest(createBusinessSchema),
  createBusiness
);

export default router;
