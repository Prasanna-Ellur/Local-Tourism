import { z } from 'zod';

export const createGuideSchema = z.object({
  body: z.object({
    destinationId: z.string().uuid(),
    name: z.string().min(2),
    bio: z.string().min(10),
    photoUrl: z.string().url(),
    languages: z.array(z.string()).min(1),
    yearsOfExperience: z.number().int().nonnegative().default(1),
    specializations: z.array(z.string()).min(1),
    pricePerDay: z.number().positive(),
    pricePerHour: z.number().positive().optional(),
  }),
});
