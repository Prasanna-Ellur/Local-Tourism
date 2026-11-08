import api from './api';
import { User, ApiResponse } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; role?: string; phone?: string; bio?: string }) {
    const res = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data);
    return res.data;
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  async updateProfile(data: Partial<User>) {
    const res = await api.put<ApiResponse<User>>('/auth/profile', data);
    return res.data;
  },
};
