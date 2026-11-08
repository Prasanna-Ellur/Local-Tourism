import { Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateBookingReference } from '../utils/bookingRef';

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const {
      bookingType,
      homestayId,
      roomId,
      tourGuideId,
      experienceId,
      checkInDate,
      checkOutDate,
      startDate,
      numberOfGuests = 1,
      specialRequests,
      contactName,
      contactEmail,
      contactPhone,
    } = req.body;

    let basePrice = 0;
    let providerIdToNotify: string | null = null;
    let targetTitle = '';

    if (bookingType === 'HOMESTAY') {
      if (!homestayId || !roomId || !checkInDate || !checkOutDate) {
        sendError(res, 'Homestay, room, check-in, and check-out dates are required', 400);
        return;
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkIn >= checkOut) {
        sendError(res, 'Check-out date must be after check-in date', 400);
        return;
      }

      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: { homestay: true },
      });

      if (!room || !room.isAvailable || room.homestayId !== homestayId) {
        sendError(res, 'Selected room is not available or does not exist', 400);
        return;
      }

      if (numberOfGuests > room.capacity) {
        sendError(res, `This room supports a maximum of ${room.capacity} guests`, 400);
        return;
      }

      // 1. Prevent Overlapping Confirmed/Pending Reservations for the same room
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          roomId,
          status: { in: ['CONFIRMED', 'PENDING'] },
          OR: [
            {
              checkInDate: { lte: checkIn },
              checkOutDate: { gt: checkIn },
            },
            {
              checkInDate: { lt: checkOut },
              checkOutDate: { gte: checkOut },
            },
            {
              checkInDate: { gte: checkIn },
              checkOutDate: { lte: checkOut },
            },
          ],
        },
      });

      if (conflictingBooking) {
        sendError(res, 'Selected dates are already booked for this room. Please choose alternative dates.', 409);
        return;
      }

      // Calculate nights
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      basePrice = room.pricePerNight * nights;
      providerIdToNotify = room.homestay.providerId;
      targetTitle = `${room.homestay.name} - ${room.name} (${nights} night${nights > 1 ? 's' : ''})`;
    } else if (bookingType === 'GUIDE') {
      if (!tourGuideId || !startDate) {
        sendError(res, 'Tour guide and start date are required', 400);
        return;
      }

      const guide = await prisma.tourGuide.findUnique({ where: { id: tourGuideId } });
      if (!guide || !guide.isAvailable) {
        sendError(res, 'Selected tour guide is currently unavailable', 400);
        return;
      }

      basePrice = guide.pricePerDay;
      providerIdToNotify = guide.providerId;
      targetTitle = `Guided tour with ${guide.name}`;
    } else if (bookingType === 'EXPERIENCE') {
      if (!experienceId || !startDate) {
        sendError(res, 'Cultural experience and start date are required', 400);
        return;
      }

      const experience = await prisma.culturalExperience.findUnique({ where: { id: experienceId } });
      if (!experience || !experience.isAvailable) {
        sendError(res, 'Selected experience is currently unavailable', 400);
        return;
      }

      if (numberOfGuests > experience.maxParticipants) {
        sendError(res, `Max participants for this experience is ${experience.maxParticipants}`, 400);
        return;
      }

      basePrice = experience.price * numberOfGuests;
      providerIdToNotify = experience.providerId;
      targetTitle = `${experience.title} for ${numberOfGuests} guest${numberOfGuests > 1 ? 's' : ''}`;
    }

    // Precise calculations
    const serviceFee = Math.round(basePrice * 0.05 * 100) / 100; // 5%
    const taxes = Math.round(basePrice * 0.12 * 100) / 100; // 12% GST
    const totalPrice = Math.round((basePrice + serviceFee + taxes) * 100) / 100;

    const bookingReference = generateBookingReference(bookingType);

    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        userId: req.user.id,
        bookingType,
        homestayId: homestayId || null,
        roomId: roomId || null,
        tourGuideId: tourGuideId || null,
        experienceId: experienceId || null,
        checkInDate: checkInDate ? new Date(checkInDate) : null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        numberOfGuests,
        basePrice,
        serviceFee,
        taxes,
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests,
        contactName,
        contactEmail,
        contactPhone,
      },
      include: {
        homestay: { select: { id: true, name: true, city: true, address: true } },
        room: { select: { id: true, name: true, roomType: true } },
        tourGuide: { select: { id: true, name: true, photoUrl: true } },
        culturalExperience: { select: { id: true, title: true, location: true } },
      },
    });

    // Notify provider if different from tourist
    if (providerIdToNotify && providerIdToNotify !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: providerIdToNotify,
          title: `New Reservation Request: ${bookingReference}`,
          message: `${contactName} booked ${targetTitle}. Total: ₹${totalPrice}. Please review and confirm.`,
          type: 'BOOKING',
          link: '/provider/dashboard',
        },
      });
    }

    sendSuccess(res, booking, 'Booking created successfully! Please proceed to payment.', 201);
  } catch (error: any) {
    console.error('createBooking error:', error);
    sendError(res, error.message || 'Failed to create booking', 500);
  }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        homestay: {
          include: {
            images: { take: 1 },
          },
        },
        room: true,
        tourGuide: true,
        culturalExperience: true,
        payment: true,
      },
    });

    sendSuccess(res, bookings);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch bookings', 500);
  }
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id },
          { bookingReference: id },
        ],
      },
      include: {
        homestay: {
          include: {
            images: true,
            provider: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
        room: true,
        tourGuide: {
          include: {
            provider: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
        culturalExperience: {
          include: {
            provider: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!booking) {
      sendError(res, 'Booking not found', 404);
      return;
    }

    // Check ownership or provider or admin
    const isOwner = booking.userId === req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';
    const isHomestayProvider = booking.homestay?.providerId === req.user?.id;
    const isGuideProvider = booking.tourGuide?.providerId === req.user?.id;
    const isExpProvider = booking.culturalExperience?.providerId === req.user?.id;

    if (!isOwner && !isAdmin && !isHomestayProvider && !isGuideProvider && !isExpProvider) {
      sendError(res, 'Access denied. You do not have permission to view this reservation.', 403);
      return;
    }

    sendSuccess(res, booking);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch booking', 500);
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      sendError(res, 'Booking not found', 404);
      return;
    }

    const isOwner = booking.userId === req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      sendError(res, 'Access denied. Only the tourist or administrator can cancel this booking.', 403);
      return;
    }

    if (booking.status === 'CANCELLED') {
      sendError(res, 'Booking is already cancelled', 400);
      return;
    }

    if (booking.status === 'COMPLETED') {
      sendError(res, 'Completed trips cannot be cancelled', 400);
      return;
    }

    // Update booking and payment status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: cancellationReason || 'Cancelled by user',
        paymentStatus: booking.paymentStatus === 'SUCCESSFUL' ? 'REFUNDED' : booking.paymentStatus,
      },
    });

    // If payment exists, update payment status to REFUNDED
    await prisma.payment.updateMany({
      where: { bookingId: id },
      data: { status: 'REFUNDED' },
    });

    // Remove availability lock if any
    if (booking.roomId && booking.checkInDate && booking.checkOutDate) {
      await prisma.availability.deleteMany({
        where: {
          roomId: booking.roomId,
          date: {
            gte: booking.checkInDate,
            lt: booking.checkOutDate,
          },
        },
      });
    }

    // Notify user
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: `Booking Cancelled: ${booking.bookingReference}`,
        message: `Your booking ${booking.bookingReference} has been successfully cancelled. Refund processed if applicable.`,
        type: 'BOOKING',
      },
    });

    sendSuccess(res, updatedBooking, 'Booking cancelled successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to cancel booking', 500);
  }
};

export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        homestay: true,
        tourGuide: true,
        culturalExperience: true,
      },
    });

    if (!booking) {
      sendError(res, 'Booking not found', 404);
      return;
    }

    const isAdmin = req.user?.role === 'ADMIN';
    const isOwnerProvider =
      booking.homestay?.providerId === req.user?.id ||
      booking.tourGuide?.providerId === req.user?.id ||
      booking.culturalExperience?.providerId === req.user?.id;

    if (!isAdmin && !isOwnerProvider) {
      sendError(res, 'Access denied. Only the host service provider or administrator can update booking status.', 403);
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(rejectionReason && { cancellationReason: rejectionReason }),
      },
    });

    // Notify tourist
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: `Booking Status Update: ${booking.bookingReference}`,
        message: `Your booking for ${booking.bookingReference} is now marked as ${status}.`,
        type: 'BOOKING',
        link: `/bookings/my`,
      },
    });

    sendSuccess(res, updated, `Booking status updated to ${status}`);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update booking status', 500);
  }
};

export const getProviderBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'SERVICE_PROVIDER') {
      sendError(res, 'Unauthorized. Provider role required.', 403);
      return;
    }

    const providerId = req.user.id;

    // Fetch all bookings where homestay, tour guide, or experience belongs to this provider
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { homestay: { providerId } },
          { tourGuide: { providerId } },
          { culturalExperience: { providerId } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        homestay: { select: { id: true, name: true, city: true } },
        room: { select: { id: true, name: true, roomType: true } },
        tourGuide: { select: { id: true, name: true } },
        culturalExperience: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
        payment: true,
      },
    });

    // Calculate quick stats
    const totalEarnings = bookings
      .filter((b) => b.paymentStatus === 'SUCCESSFUL' && b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + b.basePrice, 0);

    const pendingRequests = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

    sendSuccess(res, {
      bookings,
      stats: {
        totalBookings: bookings.length,
        totalEarnings,
        pendingRequests,
        confirmedCount,
      },
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch provider bookings', 500);
  }
};
