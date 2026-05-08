import api from '../lib/axios';
import { ApiResponse, Transaction, PaginatedTransactions } from '../types/api.types';

export const transactionApi = {
  getAll: (params?: any) => api.get<ApiResponse<PaginatedTransactions>>('/transactions', { params }),
  create: (data: any) => api.post<ApiResponse<{ transaction: Transaction }>>('/transactions', data),
  update: (id: string, data: any) => api.put<ApiResponse<{ transaction: Transaction }>>(`/transactions/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/transactions/${id}`),
};