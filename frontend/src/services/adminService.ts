import api from './api';
import { ApiResponse, Booking, User, Destination } from '../types';

export const adminService = {
  async getDashboardStats() {
    const res = await api.get<ApiResponse<{
      counts: {
        users: number;
        tourists: number;
        providers: number;
        pendingProviders: number;
        destinations: number;
        homestays: number;
        guides: number;
        experiences: number;
        businesses: number;
        bookings: number;
        confirmedBookings: number;
        reviews: number;
      };
      revenue: {
        totalRevenue: number;
        platformFee: number;
      };
      recentBookings: any[];
      recentUsers: any[];
    }>>('/admin/dashboard');
    return res.data;
  },

  async getUsers(params?: { role?: string; isApproved?: boolean; search?: string; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<User[]>>('/admin/users', { params });
    return res.data;
  },

  async approveProvider(id: string, approved: boolean) {
    const res = await api.patch<ApiResponse<User>>(`/admin/providers/${id}/approve`, { approved });
    return res.data;
  },

  async getAllBookings(params?: { status?: string; bookingType?: string; search?: string; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<Booking[]>>('/admin/bookings', { params });
    return res.data;
  },

  async deleteReview(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/admin/reviews/${id}`);
    return res.data;
  },

  async toggleFeatured(id: string) {
    const res = await api.patch<ApiResponse<Destination>>(`/admin/destinations/${id}/feature`);
    return res.data;
  },
};
