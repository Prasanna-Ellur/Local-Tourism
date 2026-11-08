import api from './api';
import { Homestay, ApiResponse } from '../types';

export const homestayService = {
  async getAll(params?: {
    search?: string;
    destinationId?: string;
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    minRating?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const res = await api.get<ApiResponse<Homestay[]>>('/homestays', { params });
    return res.data;
  },

  async getById(idOrSlug: string) {
    const res = await api.get<ApiResponse<Homestay>>(`/homestays/${idOrSlug}`);
    return res.data;
  },

  async checkAvailability(roomId: string, checkInDate: string, checkOutDate: string) {
    const res = await api.get<ApiResponse<{ isAvailable: boolean; conflictsCount: number }>>(
      '/homestays/check-availability',
      {
        params: { roomId, checkInDate, checkOutDate },
      }
    );
    return res.data;
  },

  async create(data: any) {
    const res = await api.post<ApiResponse<Homestay>>('/homestays', data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await api.put<ApiResponse<Homestay>>(`/homestays/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/homestays/${id}`);
    return res.data;
  },
};
