import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth';

export const getHomestays = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      destinationId,
      city,
      state,
      minPrice,
      maxPrice,
      guests,
      minRating,
      sort,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isAvailable: true,
    };

    if (search) {
      const term = String(search).toLowerCase();
      where.OR = [
        { name: { contains: term } },
        { city: { contains: term } },
        { state: { contains: term } },
        { description: { contains: term } },
      ];
    }

    if (destinationId) {
      where.destinationId = String(destinationId);
    }

    if (city) {
      where.city = { contains: String(city) };
    }

    if (state) {
      where.state = { contains: String(state) };
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = parseFloat(minPrice as string);
      if (maxPrice) where.pricePerNight.lte = parseFloat(maxPrice as string);
    }

    if (guests) {
      where.maxGuests = { gte: parseInt(guests as string, 10) };
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    let orderBy: any = { rating: 'desc' };
    if (sort === 'price_asc') orderBy = { pricePerNight: 'asc' };
    if (sort === 'price_desc') orderBy = { pricePerNight: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'rating_desc') orderBy = { rating: 'desc' };

    const [total, homestays] = await Promise.all([
      prisma.homestay.count({ where }),
      prisma.homestay.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          destination: {
            select: { id: true, name: true, state: true, slug: true },
          },
          images: {
            take: 3,
            orderBy: { isFeatured: 'desc' },
          },
          rooms: {
            select: { id: true, name: true, roomType: true, pricePerNight: true, capacity: true },
          },
        },
      }),
    ]);

    const formatted = homestays.map((h) => ({
      ...h,
      amenities: JSON.parse(h.amenities || '[]'),
    }));

    sendSuccess(res, formatted, undefined, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    console.error('getHomestays error:', error);
    sendError(res, error.message || 'Failed to fetch homestays', 500);
  }
};

export const getHomestayById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const homestay = await prisma.homestay.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        destination: true,
        images: true,
        rooms: {
          where: { isAvailable: true },
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            phone: true,
          },
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

    if (!homestay) {
      sendError(res, 'Homestay not found', 404);
      return;
    }

    const formatted = {
      ...homestay,
      amenities: JSON.parse(homestay.amenities || '[]'),
      destination: {
        ...homestay.destination,
        images: JSON.parse(homestay.destination.images || '[]'),
        attractions: JSON.parse(homestay.destination.attractions || '[]'),
      },
    };

    sendSuccess(res, formatted);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to fetch homestay', 500);
  }
};

export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.query;

    if (!roomId || !checkInDate || !checkOutDate) {
      sendError(res, 'roomId, checkInDate, and checkOutDate are required parameters', 400);
      return;
    }

    const checkIn = new Date(checkInDate as string);
    const checkOut = new Date(checkOutDate as string);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      sendError(res, 'Invalid date format provided', 400);
      return;
    }

    if (checkIn >= checkOut) {
      sendError(res, 'checkOutDate must be after checkInDate', 400);
      return;
    }

    // Check confirmed or pending reservations that overlap
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId: String(roomId),
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

    const isAvailable = conflictingBookings.length === 0;

    sendSuccess(res, {
      roomId,
      isAvailable,
      conflictsCount: conflictingBookings.length,
    });
  } catch (error: any) {
    sendError(res, error.message || 'Failed to check availability', 500);
  }
};

export const createHomestay = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const {
      destinationId,
      name,
      description,
      address,
      city,
      state,
      pricePerNight,
      checkInTime = '14:00',
      checkOutTime = '11:00',
      houseRules,
      amenities,
      maxGuests = 2,
      latitude,
      longitude,
      images = [],
      rooms = [],
    } = req.body;

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const homestay = await prisma.homestay.create({
      data: {
        providerId: req.user.id,
        destinationId,
        name,
        slug,
        description,
        address,
        city,
        state,
        pricePerNight,
        checkInTime,
        checkOutTime,
        houseRules,
        amenities: JSON.stringify(amenities),
        maxGuests,
        latitude,
        longitude,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            isFeatured: index === 0,
          })),
        },
        rooms: {
          create: rooms.map((r: any) => ({
            name: r.name,
            roomType: r.roomType,
            pricePerNight: r.pricePerNight,
            capacity: r.capacity || 2,
            bedType: r.bedType || 'King Bed',
            description: r.description,
          })),
        },
      },
      include: {
        images: true,
        rooms: true,
      },
    });

    sendSuccess(res, homestay, 'Homestay created successfully', 201);
  } catch (error: any) {
    console.error('createHomestay error:', error);
    sendError(res, error.message || 'Failed to create homestay', 500);
  }
};

export const updateHomestay = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const homestay = await prisma.homestay.findUnique({ where: { id } });

    if (!homestay) {
      sendError(res, 'Homestay not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && homestay.providerId !== req.user?.id) {
      sendError(res, 'Access denied. You do not own this homestay listing.', 403);
      return;
    }

    const body = req.body;
    const data: any = { ...body };
    if (body.amenities) data.amenities = JSON.stringify(body.amenities);

    const updated = await prisma.homestay.update({
      where: { id },
      data,
    });

    sendSuccess(res, updated, 'Homestay updated successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update homestay', 500);
  }
};

export const deleteHomestay = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const homestay = await prisma.homestay.findUnique({ where: { id } });

    if (!homestay) {
      sendError(res, 'Homestay not found', 404);
      return;
    }

    if (req.user?.role !== 'ADMIN' && homestay.providerId !== req.user?.id) {
      sendError(res, 'Access denied', 403);
      return;
    }

    await prisma.homestay.delete({ where: { id } });
    sendSuccess(res, null, 'Homestay deleted successfully');
  } catch (error: any) {
    sendError(res, error.message || 'Failed to delete homestay', 500);
  }
};
