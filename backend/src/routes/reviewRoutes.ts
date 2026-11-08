import { Router } from 'express';
import { createReview, getReviews, respondToReview } from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createReviewSchema, respondReviewSchema } from '../validators/reviewValidator';

const router = Router();

router.get('/', getReviews);
router.post('/', authenticate, validateRequest(createReviewSchema), createReview);
router.patch(
  '/:id/respond',
  authenticate,
  authorize(['SERVICE_PROVIDER', 'ADMIN']),
  validateRequest(respondReviewSchema),
  respondToReview
);

export default router;
