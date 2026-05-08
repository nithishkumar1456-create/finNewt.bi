import api from '../lib/axios';
import { ApiResponse, User } from '../types/api.types';

export const userApi = {
  updateProfile: (data: any) => api.put<ApiResponse<{ user: User }>>('/users/profile', data),
  changePassword: (data: any) => api.put<ApiResponse<null>>('/users/change-password', data),
};