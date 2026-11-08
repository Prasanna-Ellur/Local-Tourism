import { z } from 'zod';

export const createDestinationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    state: z.string().min(2),
    region: z.string().min(2),
    description: z.string().min(10),
    heroImage: z.string().url(),
    images: z.array(z.string().url()).min(1),
    bestTimeToVisit: z.string().min(3),
    attractions: z.array(z.string()).min(1),
    travelInfo: z.string().min(10),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isFeatured: z.boolean().default(false),
  }),
});

export const updateDestinationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    region: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    heroImage: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    bestTimeToVisit: z.string().optional(),
    attractions: z.array(z.string()).optional(),
    travelInfo: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isFeatured: z.boolean().optional(),
  }),
});
