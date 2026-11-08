import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth';

export const getBusinesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, destinationId, search, featured, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (category) {
      where.category = { contains: String(category) };
    }

    if (destinationId) {
      where.destinationId = String(destinationId);
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      const term = String(search).toLowerCase();
      where.OR = [
        { name: { contains: term } },
        { description: { contains: term } },
        { address: { contains: term } },
      ];
    }

    const [total, businesses] = await Promise.all([
      prisma.localBusiness.count({ where }),
      prisma.localBusiness.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { rating: 'desc' },
        include: {
          destination: {
            select: { id: true, name: true, state: true, slug: true },
          },
        },
      }),
    ]);

    const formatted = businesses.map((b) => ({
      ...b,
      images: JSON.parse(b.images || '[]'),
    }));

    sendSuccess(res, formatted, undefined, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch local businesses', 500);
  }
};

export const getBusinessById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const business = await prisma.localBusiness.findUnique({
      where: { id },
      include: {
        destination: true,
        provider: {
          select: { id: true, name: true, email: true, phone: true },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!business) {
      sendError(res, 'Local business not found', 404);
      return;
    }

    const formatted = {
      ...business,
      images: JSON.parse(business.images || '[]'),
    };

    sendSuccess(res, formatted);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch business', 500);
  }
};

export const createBusiness = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const {
      destinationId,
      name,
      category,
      description,
      address,
      phone,
      email,
      website,
      openingHours,
      images,
      priceRange = '$$',
      isFeatured = false,
    } = req.body;

    const business = await prisma.localBusiness.create({
      data: {
        providerId: req.user.id,
        destinationId,
        name,
        category,
        description,
        address,
        phone,
        email,
        website,
        openingHours,
        images: JSON.stringify(images),
        priceRange,
        isFeatured,
      },
    });

    sendSuccess(res, business, 'Local business listed successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to list business', 500);
  }
};
