import api from './api';
import { Review, ApiResponse } from '../types';

export const reviewService = {
  async create(data: {
    targetType: 'HOMESTAY' | 'GUIDE' | 'EXPERIENCE' | 'BUSINESS';
    homestayId?: string;
    tourGuideId?: string;
    experienceId?: string;
    businessId?: string;
    rating: number;
    comment: string;
  }) {
    const res = await api.post<ApiResponse<Review>>('/reviews', data);
    return res.data;
  },

  async getAll(params: {
    targetType?: string;
    homestayId?: string;
    tourGuideId?: string;
    experienceId?: string;
    businessId?: string;
  }) {
    const res = await api.get<ApiResponse<Review[]>>('/reviews', { params });
    return res.data;
  },

  async respond(id: string, response: string) {
    const res = await api.patch<ApiResponse<Review>>(`/reviews/${id}/respond`, { response });
    return res.data;
  },
};
