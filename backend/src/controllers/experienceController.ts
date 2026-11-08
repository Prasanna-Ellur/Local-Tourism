import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth';

export const getExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, destinationId, search, maxPrice, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isAvailable: true };

    if (category) {
      where.category = { contains: String(category) };
    }

    if (destinationId) {
      where.destinationId = String(destinationId);
    }

    if (search) {
      const term = String(search).toLowerCase();
      where.OR = [
        { title: { contains: term } },
        { description: { contains: term } },
        { category: { contains: term } },
      ];
    }

    if (maxPrice) {
      where.price = { lte: parseFloat(maxPrice as string) };
    }

    const [total, experiences] = await Promise.all([
      prisma.culturalExperience.count({ where }),
      prisma.culturalExperience.findMany({
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

    const formatted = experiences.map((e) => ({
      ...e,
      included: JSON.parse(e.included || '[]'),
      images: JSON.parse(e.images || '[]'),
    }));

    sendSuccess(res, formatted, undefined, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch cultural experiences', 500);
  }
};

export const getExperienceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const experience = await prisma.culturalExperience.findUnique({
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

    if (!experience) {
      sendError(res, 'Cultural experience not found', 404);
      return;
    }

    const formatted = {
      ...experience,
      included: JSON.parse(experience.included || '[]'),
      images: JSON.parse(experience.images || '[]'),
    };

    sendSuccess(res, formatted);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch experience details', 500);
  }
};

export const createExperience = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const {
      destinationId,
      title,
      description,
      category,
      location,
      durationHours,
      price,
      maxParticipants = 10,
      included,
      images,
    } = req.body;

    const experience = await prisma.culturalExperience.create({
      data: {
        providerId: req.user.id,
        destinationId,
        title,
        description,
        category,
        location,
        durationHours,
        price,
        maxParticipants,
        included: JSON.stringify(included),
        images: JSON.stringify(images),
      },
    });

    sendSuccess(res, experience, 'Cultural experience created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create experience', 500);
  }
};
