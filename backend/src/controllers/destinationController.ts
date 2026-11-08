import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, state, featured, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      const searchTerm = String(search).toLowerCase();
      where.OR = [
        { name: { contains: searchTerm } },
        { state: { contains: searchTerm } },
        { region: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ];
    }

    if (state) {
      where.state = { contains: String(state) };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [total, destinations] = await Promise.all([
      prisma.destination.count({ where }),
      prisma.destination.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { isFeatured: 'desc' },
        include: {
          _count: {
            select: {
              homestays: true,
              tourGuides: true,
              culturalExperiences: true,
              localBusinesses: true,
            },
          },
        },
      }),
    ]);

    // Parse JSON fields safely
    const formatted = destinations.map((d) => ({
      ...d,
      images: JSON.parse(d.images || '[]'),
      attractions: JSON.parse(d.attractions || '[]'),
    }));

    sendSuccess(res, formatted, undefined, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    console.error('getDestinations error:', error);
    sendError(res, error.message || 'Failed to fetch destinations', 500);
  }
};

export const getDestinationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const destination = await prisma.destination.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        homestays: {
          where: { isAvailable: true },
          include: {
            images: true,
            rooms: true,
          },
        },
        tourGuides: {
          where: { isAvailable: true },
        },
        culturalExperiences: {
          where: { isAvailable: true },
        },
        localBusinesses: true,
      },
    });

    if (!destination) {
      sendError(res, 'Destination not found', 404);
      return;
    }

    const formatted = {
      ...destination,
      images: JSON.parse(destination.images || '[]'),
      attractions: JSON.parse(destination.attractions || '[]'),
      homestays: destination.homestays.map((h) => ({
        ...h,
        amenities: JSON.parse(h.amenities || '[]'),
      })),
      tourGuides: destination.tourGuides.map((g) => ({
        ...g,
        languages: JSON.parse(g.languages || '[]'),
        specializations: JSON.parse(g.specializations || '[]'),
      })),
      culturalExperiences: destination.culturalExperiences.map((e) => ({
        ...e,
        included: JSON.parse(e.included || '[]'),
        images: JSON.parse(e.images || '[]'),
      })),
      localBusinesses: destination.localBusinesses.map((b) => ({
        ...b,
        images: JSON.parse(b.images || '[]'),
      })),
    };

    sendSuccess(res, formatted);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch destination details', 500);
  }
};

export const createDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      state,
      region,
      description,
      heroImage,
      images,
      bestTimeToVisit,
      attractions,
      travelInfo,
      latitude,
      longitude,
      isFeatured,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newDest = await prisma.destination.create({
      data: {
        name,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        state,
        region,
        description,
        heroImage,
        images: JSON.stringify(images),
        bestTimeToVisit,
        attractions: JSON.stringify(attractions),
        travelInfo,
        latitude,
        longitude,
        isFeatured: !!isFeatured,
      },
    });

    sendSuccess(res, newDest, 'Destination created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create destination', 500);
  }
};

export const updateDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body;

    const data: any = { ...body };
    if (body.images) data.images = JSON.stringify(body.images);
    if (body.attractions) data.attractions = JSON.stringify(body.attractions);

    const updated = await prisma.destination.update({
      where: { id },
      data,
    });

    sendSuccess(res, updated, 'Destination updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update destination', 500);
  }
};

export const deleteDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({
      where: { id },
    });
    sendSuccess(res, null, 'Destination deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete destination', 500);
  }
};
