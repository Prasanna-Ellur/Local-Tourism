import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth';

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const {
      targetType,
      homestayId,
      tourGuideId,
      experienceId,
      businessId,
      rating,
      comment,
    } = req.body;

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        targetType,
        homestayId: homestayId || null,
        tourGuideId: tourGuideId || null,
        experienceId: experienceId || null,
        businessId: businessId || null,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        comment,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Recalculate target rating and review count
    if (homestayId) {
      const stats = await prisma.review.aggregate({
        where: { homestayId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.homestay.update({
        where: { id: homestayId },
        data: {
          rating: Math.round((stats._avg.rating || 5) * 10) / 10,
          reviewCount: stats._count.rating,
        },
      });
    } else if (tourGuideId) {
      const stats = await prisma.review.aggregate({
        where: { tourGuideId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.tourGuide.update({
        where: { id: tourGuideId },
        data: {
          rating: Math.round((stats._avg.rating || 5) * 10) / 10,
          reviewCount: stats._count.rating,
        },
      });
    } else if (experienceId) {
      const stats = await prisma.review.aggregate({
        where: { experienceId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.culturalExperience.update({
        where: { id: experienceId },
        data: {
          rating: Math.round((stats._avg.rating || 5) * 10) / 10,
          reviewCount: stats._count.rating,
        },
      });
    } else if (businessId) {
      const stats = await prisma.review.aggregate({
        where: { businessId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.localBusiness.update({
        where: { id: businessId },
        data: {
          rating: Math.round((stats._avg.rating || 5) * 10) / 10,
          reviewCount: stats._count.rating,
        },
      });
    }

    sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to submit review', 500);
  }
};

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetType, homestayId, tourGuideId, experienceId, businessId } = req.query;

    const where: any = {};
    if (targetType) where.targetType = String(targetType);
    if (homestayId) where.homestayId = String(homestayId);
    if (tourGuideId) where.tourGuideId = String(tourGuideId);
    if (experienceId) where.experienceId = String(experienceId);
    if (businessId) where.businessId = String(businessId);

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    sendSuccess(res, reviews);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch reviews', 500);
  }
};

export const respondToReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        homestay: true,
        tourGuide: true,
        culturalExperience: true,
        business: true,
      },
    });

    if (!review) {
      sendError(res, 'Review not found', 404);
      return;
    }

    // Verify ownership of the target or admin
    const isAdmin = req.user?.role === 'ADMIN';
    const isOwner =
      review.homestay?.providerId === req.user?.id ||
      review.tourGuide?.providerId === req.user?.id ||
      review.culturalExperience?.providerId === req.user?.id ||
      review.business?.providerId === req.user?.id;

    if (!isAdmin && !isOwner) {
      sendError(res, 'Access denied. You do not own this listing.', 403);
      return;
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        providerResponse: response,
        respondedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    sendSuccess(res, updatedReview, 'Response posted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to post review response', 500);
  }
};
