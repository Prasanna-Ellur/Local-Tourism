import { Router } from 'express';
import {
  getHomestays,
  getHomestayById,
  checkAvailability,
  createHomestay,
  updateHomestay,
  deleteHomestay,
} from '../controllers/homestayController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createHomestaySchema, updateHomestaySchema } from '../validators/homestayValidator';

const router = Router();

router.get('/', getHomestays);
router.get('/check-availability', checkAvailability);
router.get('/:id', getHomestayById);
router.post(
  '/',
  authenticate,
  authorize(['SERVICE_PROVIDER', 'ADMIN']),
  validateRequest(createHomestaySchema),
  createHomestay
);
router.put(
  '/:id',
  authenticate,
  authorize(['SERVICE_PROVIDER', 'ADMIN']),
  validateRequest(updateHomestaySchema),
  updateHomestay
);
router.delete('/:id', authenticate, authorize(['SERVICE_PROVIDER', 'ADMIN']), deleteHomestay);

export default router;
