import { Router } from 'express';
import { getGuides, getGuideById, createGuide } from '../controllers/guideController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createGuideSchema } from '../validators/guideValidator';

const router = Router();

router.get('/', getGuides);
router.get('/:id', getGuideById);
router.post(
  '/',
  authenticate,
  authorize(['SERVICE_PROVIDER', 'ADMIN']),
  validateRequest(createGuideSchema),
  createGuide
);

export default router;
