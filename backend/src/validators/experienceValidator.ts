import { z } from 'zod';

export const createExperienceSchema = z.object({
  body: z.object({
    destinationId: z.string().uuid(),
    title: z.string().min(5),
    description: z.string().min(15),
    category: z.string().min(2),
    location: z.string().min(3),
    durationHours: z.number().positive(),
    price: z.number().positive(),
    maxParticipants: z.number().int().positive().default(10),
    included: z.array(z.string()).min(1),
    images: z.array(z.string().url()).min(1),
  }),
});
