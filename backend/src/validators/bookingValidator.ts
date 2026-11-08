import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    bookingType: z.enum(['HOMESTAY', 'GUIDE', 'EXPERIENCE']),
    homestayId: z.string().uuid().optional(),
    roomId: z.string().uuid().optional(),
    tourGuideId: z.string().uuid().optional(),
    experienceId: z.string().uuid().optional(),
    checkInDate: z.string().optional(), // ISO date string
    checkOutDate: z.string().optional(),
    startDate: z.string().optional(),
    numberOfGuests: z.number().int().positive().default(1),
    specialRequests: z.string().optional(),
    contactName: z.string().min(2, 'Contact name required'),
    contactEmail: z.string().email('Valid contact email required'),
    contactPhone: z.string().min(8, 'Valid phone number required'),
  }).refine((data) => {
    if (data.bookingType === 'HOMESTAY') {
      return !!data.homestayId && !!data.roomId && !!data.checkInDate && !!data.checkOutDate;
    }
    if (data.bookingType === 'GUIDE') {
      return !!data.tourGuideId && !!data.startDate;
    }
    if (data.bookingType === 'EXPERIENCE') {
      return !!data.experienceId && !!data.startDate;
    }
    return false;
  }, {
    message: 'Required booking target identifiers and dates must be supplied for the selected booking type',
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED']),
    rejectionReason: z.string().optional(),
  }),
});

export const cancelBookingSchema = z.object({
  body: z.object({
    cancellationReason: z.string().min(3, 'Please provide a reason for cancellation'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    paymentMethod: z.enum(['CARD', 'UPI', 'NETBANKING', 'MOCK']).default('MOCK'),
    gatewayOrderId: z.string().optional(),
    gatewayPaymentId: z.string().optional(),
    mockStatus: z.enum(['SUCCESS', 'FAILED']).default('SUCCESS'),
  }),
});
