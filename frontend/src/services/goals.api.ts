import api from '../lib/axios';
import { ApiResponse, Goal } from '../types/api.types';

export const goalApi = {
  getAll: () => api.get<ApiResponse<{ goals: Goal[] }>>('/goals'),
  create: (data: any) => api.post<ApiResponse<{ goal: Goal }>>('/goals', data),
  update: (id: string, data: any) => api.put<ApiResponse<{ goal: Goal }>>(`/goals/${id}`, data),
  addFunds: (id: string, amount: number) => api.post<ApiResponse<{ goal: Goal }>>(`/goals/${id}/add-funds`, { amount }),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/goals/${id}`),
};