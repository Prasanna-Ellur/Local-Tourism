import { z } from 'zod';

export const createBusinessSchema = z.object({
  body: z.object({
    destinationId: z.string().uuid(),
    name: z.string().min(2),
    category: z.string().min(2),
    description: z.string().min(10),
    address: z.string().min(5),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    openingHours: z.string().optional(),
    images: z.array(z.string().url()).min(1),
    priceRange: z.enum(['$', '$$', '$$$', '$$$$']).default('$$'),
    isFeatured: z.boolean().default(false),
  }),
});
