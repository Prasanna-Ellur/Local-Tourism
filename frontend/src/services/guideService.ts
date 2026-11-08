import api from './api';
import { TourGuide, ApiResponse } from '../types';

export const guideService = {
  async getAll(params?: { destinationId?: string; search?: string; maxPrice?: number; language?: string; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<TourGuide[]>>('/guides', { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiResponse<TourGuide>>(`/guides/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await api.post<ApiResponse<TourGuide>>('/guides', data);
    return res.data;
  },
};
