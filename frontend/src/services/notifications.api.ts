import api from '../lib/axios';
import { ApiResponse, Notification } from '../types/api.types';

export const notificationApi = {
  getAll: () => api.get<ApiResponse<{ notifications: Notification[] }>>('/notifications'),
  markAsRead: (id: string) => api.put<ApiResponse<null>>(`/notifications/${id}/read`),
};