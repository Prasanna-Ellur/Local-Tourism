import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    targetType: z.enum(['HOMESTAY', 'GUIDE', 'EXPERIENCE', 'BUSINESS']),
    homestayId: z.string().uuid().optional(),
    tourGuideId: z.string().uuid().optional(),
    experienceId: z.string().uuid().optional(),
    businessId: z.string().uuid().optional(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(5, 'Review comment must be at least 5 characters'),
  }).refine((data) => {
    if (data.targetType === 'HOMESTAY') return !!data.homestayId;
    if (data.targetType === 'GUIDE') return !!data.tourGuideId;
    if (data.targetType === 'EXPERIENCE') return !!data.experienceId;
    if (data.targetType === 'BUSINESS') return !!data.businessId;
    return false;
  }, {
    message: 'The corresponding target id must be provided for the target type',
  }),
});

export const respondReviewSchema = z.object({
  body: z.object({
    response: z.string().min(2, 'Response cannot be empty'),
  }),
});
