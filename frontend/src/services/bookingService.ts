import api from './api';
import { Booking, ApiResponse } from '../types';

export const bookingService = {
  async create(data: {
    bookingType: 'HOMESTAY' | 'GUIDE' | 'EXPERIENCE';
    homestayId?: string;
    roomId?: string;
    tourGuideId?: string;
    experienceId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    startDate?: string;
    numberOfGuests: number;
    specialRequests?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }) {
    const res = await api.post<ApiResponse<Booking>>('/bookings', data);
    return res.data;
  },

  async getMyBookings() {
    const res = await api.get<ApiResponse<Booking[]>>('/bookings/my');
    return res.data;
  },

  async getProviderBookings() {
    const res = await api.get<ApiResponse<{
      bookings: Booking[];
      stats: {
        totalBookings: number;
        totalEarnings: number;
        pendingRequests: number;
        confirmedCount: number;
      };
    }>>('/bookings/provider');
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return res.data;
  },

  async cancel(id: string, cancellationReason: string) {
    const res = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { cancellationReason });
    return res.data;
  },

  async updateStatus(id: string, status: string, rejectionReason?: string) {
    const res = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status, rejectionReason });
    return res.data;
  },
};
