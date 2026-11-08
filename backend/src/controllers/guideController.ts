import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth';

export const getGuides = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId, search, maxPrice, language, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isAvailable: true };

    if (destinationId) {
      where.destinationId = String(destinationId);
    }

    if (search) {
      const term = String(search).toLowerCase();
      where.OR = [
        { name: { contains: term } },
        { bio: { contains: term } },
      ];
    }

    if (language) {
      where.languages = { contains: String(language) };
    }

    if (maxPrice) {
      where.pricePerDay = { lte: parseFloat(maxPrice as string) };
    }

    const [total, guides] = await Promise.all([
      prisma.tourGuide.count({ where }),
      prisma.tourGuide.findMany({
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

    const formatted = guides.map((g) => ({
      ...g,
      languages: JSON.parse(g.languages || '[]'),
      specializations: JSON.parse(g.specializations || '[]'),
    }));

    sendSuccess(res, formatted, undefined, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch guides', 500);
  }
};

export const getGuideById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const guide = await prisma.tourGuide.findUnique({
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

    if (!guide) {
      sendError(res, 'Guide not found', 404);
      return;
    }

    const formatted = {
      ...guide,
      languages: JSON.parse(guide.languages || '[]'),
      specializations: JSON.parse(guide.specializations || '[]'),
    };

    sendSuccess(res, formatted);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch guide', 500);
  }
};

export const createGuide = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const {
      destinationId,
      name,
      bio,
      photoUrl,
      languages,
      yearsOfExperience = 1,
      specializations,
      pricePerDay,
      pricePerHour,
    } = req.body;

    const guide = await prisma.tourGuide.create({
      data: {
        providerId: req.user.id,
        destinationId,
        name,
        bio,
        photoUrl,
        languages: JSON.stringify(languages),
        yearsOfExperience,
        specializations: JSON.stringify(specializations),
        pricePerDay,
        pricePerHour,
      },
    });

    sendSuccess(res, guide, 'Tour guide profile created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create guide', 500);
  }
};
