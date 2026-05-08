import api from '../lib/axios';
import { ApiResponse, AnalyticsSummary, Insight } from '../types/api.types';

export const analyticsApi = {
  getSummary: (params?: any) => api.get<ApiResponse<{ summary: AnalyticsSummary }>>('/analytics/summary', { params }),
  getTrends: (params?: any) => api.get<ApiResponse<{ trends: any }>>('/analytics/trends', { params }),
  getCategories: (params?: any) => api.get<ApiResponse<{ categories: Array<{ name: string; value: number }> }>>('/analytics/categories', { params }),
  getInsights: () => api.get<ApiResponse<{ insights: Insight[] }>>('/analytics/insights'),
  getScore: () => api.get<ApiResponse<{ score: number; category: string }>>('/analytics/score'),
};
