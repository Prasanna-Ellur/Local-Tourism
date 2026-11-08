import api from './api';
import { CulturalExperience, ApiResponse } from '../types';

export const experienceService = {
  async getAll(params?: { category?: string; destinationId?: string; search?: string; maxPrice?: number; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<CulturalExperience[]>>('/experiences', { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiResponse<CulturalExperience>>(`/experiences/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await api.post<ApiResponse<CulturalExperience>>('/experiences', data);
    return res.data;
  },
};
