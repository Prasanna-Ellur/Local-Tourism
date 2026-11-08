import { z } from 'zod';

export const createHomestaySchema = z.object({
  body: z.object({
    destinationId: z.string().uuid(),
    name: z.string().min(3),
    description: z.string().min(10),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pricePerNight: z.number().positive(),
    checkInTime: z.string().default('14:00'),
    checkOutTime: z.string().default('11:00'),
    houseRules: z.string().optional(),
    amenities: z.array(z.string()).min(1),
    maxGuests: z.number().int().positive().default(2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    images: z.array(z.string().url()).min(1, 'At least one photo URL is required'),
    rooms: z.array(
      z.object({
        name: z.string().min(2),
        roomType: z.string(),
        pricePerNight: z.number().positive(),
        capacity: z.number().int().positive(),
        bedType: z.string(),
        description: z.string().optional(),
      })
    ).optional(),
  }),
});

export const updateHomestaySchema = z.object({
  body: z.object({
    destinationId: z.string().uuid().optional(),
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    pricePerNight: z.number().positive().optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
    houseRules: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    maxGuests: z.number().int().positive().optional(),
    isAvailable: z.boolean().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
});
