import api from './api';
import { Destination, ApiResponse } from '../types';

export const destinationService = {
  async getAll(params?: { search?: string; state?: string; featured?: boolean; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<Destination[]>>('/destinations', { params });
    return res.data;
  },

  async getById(idOrSlug: string) {
    const res = await api.get<ApiResponse<Destination>>(`/destinations/${idOrSlug}`);
    return res.data;
  },

  async create(data: any) {
    const res = await api.post<ApiResponse<Destination>>('/destinations', data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await api.put<ApiResponse<Destination>>(`/destinations/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/destinations/${id}`);
    return res.data;
  },
};
