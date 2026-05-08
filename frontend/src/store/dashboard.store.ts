import { create } from 'zustand';
import { AnalyticsSummary, Transaction, Goal, Insight } from '../types/api.types';
import { analyticsApi } from '../services/analytics.api';
import { transactionApi } from '../services/transactions.api';
import { goalApi } from '../services/goals.api';

interface DashboardState {
  summary: AnalyticsSummary | null;
  trends: any | null;
  insights: Insight[];
  recentTransactions: Transaction[];
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  activeParams: any;

  fetchDashboardData: (params?: any) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  summary: null,
  trends: null,
  insights: [],
  recentTransactions: [],
  goals: [],
  isLoading: false,
  error: null,
  activeParams: {},

  fetchDashboardData: async (params) => {
    const fetchParams = params !== undefined ? params : get().activeParams;
    if (params !== undefined) {
      set({ activeParams: params });
    }
    
    set({ isLoading: true, error: null });
    try {
      const [summaryRes, trendsRes, insightsRes, txRes, goalsRes] = await Promise.all([
        analyticsApi.getSummary(fetchParams),
        analyticsApi.getTrends(fetchParams),
        analyticsApi.getInsights(),
        transactionApi.getAll({ ...fetchParams, limit: 5 }),
        goalApi.getAll(),
      ]);

      set({
        summary: summaryRes.data.data?.summary || null,
        trends: trendsRes.data.data?.trends || null,
        insights: insightsRes.data.data?.insights || [],
        recentTransactions: txRes.data.data?.transactions || [],
        goals: goalsRes.data.data?.goals || [],
      });
    } catch (error: any) {
      set({ error: 'Failed to fetch dashboard data' });
    } finally {
      set({ isLoading: false });
    }
  },
}));