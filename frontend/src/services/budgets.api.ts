import api from '../lib/axios';
import { ApiResponse, Budget } from '../types/api.types';

export const budgetApi = {
  getAll: () => api.get<ApiResponse<{ budgets: Budget[] }>>('/budgets'),
  create: (data: any) => api.post<ApiResponse<{ budget: Budget }>>('/budgets', data),
  update: (id: string, data: any) => api.put<ApiResponse<{ budget: Budget }>>(`/budgets/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/budgets/${id}`),
};