import api from '../lib/axios';
import { AuthResponse, ApiResponse, User } from '../types/api.types';

export const authApi = {
  register: (data: any) => api.post<ApiResponse<any>>('/auth/register', data),
  verifyOtp: (data: { email: string; otp: string }) => api.post<AuthResponse>('/auth/verify-otp', data),
  login: (data: any) => api.post<AuthResponse>('/auth/login', data),
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  getProfile: () => api.get<ApiResponse<{ user: User }>>('/users/profile'),
};