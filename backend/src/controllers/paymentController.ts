import { Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateTransactionId } from '../utils/bookingRef';
import { ENV } from '../config/env';

export const processPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const {
      bookingId,
      paymentMethod = 'MOCK',
      mockStatus = 'SUCCESS',
      gatewayOrderId,
      gatewayPaymentId,
    } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        homestay: true,
        room: true,
      },
    });

    if (!booking) {
      sendError(res, 'Booking not found', 404);
      return;
    }

    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      sendError(res, 'Access denied. You can only pay for your own reservations.', 403);
      return;
    }

    if (booking.paymentStatus === 'SUCCESSFUL') {
      sendError(res, 'This booking has already been paid and confirmed.', 400);
      return;
    }

    const isRazorpayConfigured = !!ENV.RAZORPAY_KEY_ID && !!ENV.RAZORPAY_KEY_SECRET;
    const paymentGateway = isRazorpayConfigured && gatewayPaymentId ? 'RAZORPAY' : 'MOCK';

    if (mockStatus === 'FAILED') {
      const failedPayment = await prisma.payment.upsert({
        where: { bookingId },
        update: {
          status: 'FAILED',
          paymentMethod,
          paymentGateway,
        },
        create: {
          bookingId,
          transactionId: generateTransactionId(),
          amount: booking.totalPrice,
          currency: 'INR',
          status: 'FAILED',
          paymentMethod,
          paymentGateway,
        },
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'FAILED' },
      });

      sendSuccess(res, failedPayment, 'Payment was declined by issuing bank/mock provider.', 400);
      return;
    }

    const transactionId = gatewayPaymentId || generateTransactionId();

    // Create or update payment record
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: {
        transactionId,
        amount: booking.totalPrice,
        status: 'SUCCESSFUL',
        paymentMethod,
        paymentGateway,
        gatewayOrderId,
        gatewayPaymentId,
        paidAt: new Date(),
      },
      create: {
        bookingId,
        transactionId,
        amount: booking.totalPrice,
        currency: 'INR',
        status: 'SUCCESSFUL',
        paymentMethod,
        paymentGateway,
        gatewayOrderId,
        gatewayPaymentId,
        paidAt: new Date(),
      },
    });

    // Update booking status to CONFIRMED and paymentStatus to SUCCESSFUL
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'SUCCESSFUL',
      },
    });

    // Mark room availability dates if Homestay booking
    if (booking.roomId && booking.checkInDate && booking.checkOutDate) {
      let cur = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);

      while (cur < end) {
        await prisma.availability.upsert({
          where: {
            roomId_date: {
              roomId: booking.roomId,
              date: new Date(cur),
            },
          },
          update: { isBooked: true },
          create: {
            homestayId: booking.homestayId,
            roomId: booking.roomId,
            date: new Date(cur),
            isBooked: true,
          },
        });
        cur.setDate(cur.getDate() + 1);
      }
    }

    // Create confirmation notification
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: `Payment Received: ₹${booking.totalPrice}`,
        message: `Your payment was successfully processed (Txn: ${transactionId}). Booking ${booking.bookingReference} is confirmed!`,
        type: 'PAYMENT',
        link: `/bookings/${booking.id}`,
      },
    });

    sendSuccess(
      res,
      {
        payment,
        booking: updatedBooking,
        isMock: paymentGateway === 'MOCK',
      },
      'Payment verified and reservation confirmed successfully!'
    );
  } catch (error: any) {
    console.error('processPayment error:', error);
    sendError(res, error.message || 'Payment processing failed', 500);
  }
};
