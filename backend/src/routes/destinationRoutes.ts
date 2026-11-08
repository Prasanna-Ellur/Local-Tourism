import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { createDestinationSchema, updateDestinationSchema } from '../validators/destinationValidator';

const router = Router();

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', authenticate, authorize(['ADMIN']), validateRequest(createDestinationSchema), createDestination);
router.put('/:id', authenticate, authorize(['ADMIN']), validateRequest(updateDestinationSchema), updateDestination);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteDestination);

export default router;
