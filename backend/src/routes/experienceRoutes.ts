import { Router } from 'express';
import { getExperiences, getExperienceById, createExperience } from '../controllers/experienceController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createExperienceSchema } from '../validators/experienceValidator';

const router = Router();

router.get('/', getExperiences);
router.get('/:id', getExperienceById);
router.post(
  '/',
  authenticate,
  authorize(['SERVICE_PROVIDER', 'ADMIN']),
  validateRequest(createExperienceSchema),
  createExperience
);

export default router;
