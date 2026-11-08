export type UserRole = 'TOURIST' | 'SERVICE_PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: string;
  description: string;
  heroImage: string;
  images: string[];
  bestTimeToVisit: string;
  attractions: string[];
  travelInfo: string;
  latitude?: number | null;
  longitude?: number | null;
  isFeatured: boolean;
  _count?: {
    homestays: number;
    tourGuides: number;
    culturalExperiences: number;
    localBusinesses: number;
  };
  homestays?: Homestay[];
  tourGuides?: TourGuide[];
  culturalExperiences?: CulturalExperience[];
  localBusinesses?: LocalBusiness[];
}

export interface Room {
  id: string;
  homestayId: string;
  name: string;
  description?: string | null;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  isAvailable: boolean;
}

export interface HomestayImage {
  id: string;
  homestayId: string;
  url: string;
  caption?: string | null;
  isFeatured: boolean;
}

export interface Homestay {
  id: string;
  providerId: string;
  destinationId: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pricePerNight: number;
  checkInTime: string;
  checkOutTime: string;
  houseRules?: string | null;
  amenities: string[];
  maxGuests: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  latitude?: number | null;
  longitude?: number | null;
  images?: HomestayImage[];
  rooms?: Room[];
  destination?: Destination;
  provider?: User;
  reviews?: Review[];
}

export interface TourGuide {
  id: string;
  providerId: string;
  destinationId: string;
  name: string;
  bio: string;
  photoUrl: string;
  languages: string[];
  yearsOfExperience: number;
  specializations: string[];
  pricePerDay: number;
  pricePerHour?: number | null;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  destination?: Destination;
  provider?: User;
  reviews?: Review[];
}

export interface CulturalExperience {
  id: string;
  providerId: string;
  destinationId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  durationHours: number;
  price: number;
  maxParticipants: number;
  included: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  destination?: Destination;
  provider?: User;
  reviews?: Review[];
}

export interface LocalBusiness {
  id: string;
  providerId: string;
  destinationId: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  openingHours?: string | null;
  images: string[];
  priceRange: string;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  destination?: Destination;
  provider?: User;
  reviews?: Review[];
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
export type BookingType = 'HOMESTAY' | 'GUIDE' | 'EXPERIENCE';

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  bookingType: BookingType;
  homestayId?: string | null;
  roomId?: string | null;
  tourGuideId?: string | null;
  experienceId?: string | null;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  startDate?: string | null;
  numberOfGuests: number;
  basePrice: number;
  serviceFee: number;
  taxes: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  homestay?: Homestay;
  room?: Room;
  tourGuide?: TourGuide;
  culturalExperience?: CulturalExperience;
  payment?: Payment;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  paymentGateway: string;
  paidAt?: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  targetType: 'HOMESTAY' | 'GUIDE' | 'EXPERIENCE' | 'BUSINESS';
  homestayId?: string | null;
  tourGuideId?: string | null;
  experienceId?: string | null;
  businessId?: string | null;
  rating: number;
  comment: string;
  providerResponse?: string | null;
  respondedAt?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
