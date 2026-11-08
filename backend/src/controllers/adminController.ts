import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalTourists,
      totalProviders,
      pendingProviders,
      totalDestinations,
      totalHomestays,
      totalGuides,
      totalExperiences,
      totalBusinesses,
      totalBookings,
      confirmedBookings,
      totalReviews,
      revenueResult,
      recentBookings,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TOURIST' } }),
      prisma.user.count({ where: { role: 'SERVICE_PROVIDER' } }),
      prisma.user.count({ where: { role: 'SERVICE_PROVIDER', isApproved: false } }),
      prisma.destination.count(),
      prisma.homestay.count(),
      prisma.tourGuide.count(),
      prisma.culturalExperience.count(),
      prisma.localBusiness.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.review.count(),
      prisma.booking.aggregate({
        where: { paymentStatus: 'SUCCESSFUL', status: { not: 'CANCELLED' } },
        _sum: { totalPrice: true },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          homestay: { select: { id: true, name: true } },
          tourGuide: { select: { id: true, name: true } },
          culturalExperience: { select: { id: true, title: true } },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, isApproved: true, createdAt: true },
      }),
    ]);

    const stats = {
      counts: {
        users: totalUsers,
        tourists: totalTourists,
        providers: totalProviders,
        pendingProviders,
        destinations: totalDestinations,
        homestays: totalHomestays,
        guides: totalGuides,
        experiences: totalExperiences,
        businesses: totalBusinesses,
        bookings: totalBookings,
        confirmedBookings,
        reviews: totalReviews,
      },
      revenue: {
        totalRevenue: revenueResult._sum.totalPrice || 0,
        platformFee: Math.round(((revenueResult._sum.totalPrice || 0) * 0.05) * 100) / 100,
      },
      recentBookings,
      recentUsers,
    };

    sendSuccess(res, stats);
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    sendError(res, error.message || 'Failed to fetch admin stats', 500);
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, isApproved, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (role) where.role = String(role);
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';

    if (search) {
      const term = String(search).toLowerCase();
      where.OR = [
        { name: { contains: term } },
        { email: { contains: term } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          isApproved: true,
          createdAt: true,
          _count: {
            select: {
              homestays: true,
              tourGuides: true,
              culturalExperiences: true,
              localBusinesses: true,
              bookings: true,
            },
          },
        },
      }),
    ]);

    sendSuccess(res, users, undefined, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch users', 500);
  }
};

export const approveProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      sendError(res, 'Provider not found', 404);
      return;
    }

    const isApprovedVal = approved !== undefined ? Boolean(approved) : true;

    const updated = await prisma.user.update({
      where: { id },
      data: { isApproved: isApprovedVal },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: id,
        title: isApprovedVal ? 'Provider Account Approved! 🎉' : 'Provider Account Status Updated',
        message: isApprovedVal
          ? 'Congratulations! Your service provider profile has been verified and approved by the ExploreLocal team. You can now publish listings.'
          : 'Your provider profile status has been suspended or rejected.',
        type: 'SYSTEM',
        link: '/provider/dashboard',
      },
    });

    sendSuccess(res, updated, `Provider status updated to ${isApprovedVal ? 'Approved' : 'Unapproved'}`);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update provider approval', 500);
  }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, bookingType, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = String(status);
    if (bookingType) where.bookingType = String(bookingType);
    if (search) {
      const term = String(search).toLowerCase();
      where.OR = [
        { bookingReference: { contains: term } },
        { contactName: { contains: term } },
        { contactEmail: { contains: term } },
      ];
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          homestay: { select: { id: true, name: true } },
          tourGuide: { select: { id: true, name: true } },
          culturalExperience: { select: { id: true, title: true } },
          payment: true,
        },
      }),
    ]);

    sendSuccess(res, bookings, undefined, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch all bookings', 500);
  }
};

export const deleteInappropriateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    sendSuccess(res, null, 'Review removed by administrator');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to remove review', 500);
  }
};

export const toggleFeaturedDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dest = await prisma.destination.findUnique({ where: { id } });
    if (!dest) {
      sendError(res, 'Destination not found', 404);
      return;
    }

    const updated = await prisma.destination.update({
      where: { id },
      data: { isFeatured: !dest.isFeatured },
    });

    sendSuccess(res, updated, `Destination ${updated.isFeatured ? 'featured' : 'unfeatured'} successfully`);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to toggle destination', 500);
  }
};
