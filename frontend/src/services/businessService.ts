import api from './api';
import { LocalBusiness, ApiResponse } from '../types';

export const businessService = {
  async getAll(params?: { category?: string; destinationId?: string; search?: string; featured?: boolean; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<LocalBusiness[]>>('/businesses', { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<ApiResponse<LocalBusiness>>(`/businesses/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await api.post<ApiResponse<LocalBusiness>>('/businesses', data);
    return res.data;
  },
};
