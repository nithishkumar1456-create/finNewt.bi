import { create } from 'zustand';
import { AnalyticsSummary, Insight } from '../types/api.types';
import { analyticsApi } from '../services/analytics.api';

const EMPTY_SUMMARY: AnalyticsSummary = {
  totalIncome: 0,
  totalExpense: 0,
  savings: 0,
  spendingRatio: 0,
};

const safeSummary = (summary: Partial<AnalyticsSummary> | null | undefined): AnalyticsSummary => ({
  totalIncome: Number.isFinite(Number(summary?.totalIncome)) ? Number(summary?.totalIncome) : 0,
  totalExpense: Number.isFinite(Number(summary?.totalExpense)) ? Number(summary?.totalExpense) : 0,
  savings: Number.isFinite(Number(summary?.savings)) ? Number(summary?.savings) : 0,
  spendingRatio: Number.isFinite(Number(summary?.spendingRatio)) ? Number(summary?.spendingRatio) : 0,
});

const safeRecord = (value: unknown): Record<string, any> => {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};
};

interface AnalyticsState {
  summary: AnalyticsSummary;
  trends: Record<string, any>;
  categories: Array<{ name: string; value: number }>;
  insights: Insight[];
  score: { score: number; category: string } | null;
  isLoading: boolean;
  error: string | null;
  activeParams: any;

  fetchSummary: (params?: any) => Promise<void>;
  fetchTrends: (params?: any) => Promise<void>;
  fetchCategories: (params?: any) => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchScore: () => Promise<void>;
  fetchAllAnalytics: (params?: any) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  summary: EMPTY_SUMMARY,
  trends: {},
  categories: [],
  insights: [],
  score: null,
  isLoading: false,
  error: null,
  activeParams: {},

  fetchSummary: async (params) => {
    try {
      const response = await analyticsApi.getSummary(params);
      if (response.data.success && response.data.data) {
        set({ summary: safeSummary(response.data.data.summary) });
      } else {
        set({ summary: EMPTY_SUMMARY });
      }
    } catch (error: any) {
      console.error('[ANALYTICS STORE] Failed to fetch summary', error.response?.data || error.message);
      set({ summary: EMPTY_SUMMARY });
    }
  },

  fetchTrends: async (params) => {
    try {
      const response = await analyticsApi.getTrends(params);
      if (response.data.success && response.data.data) {
        set({ trends: safeRecord(response.data.data.trends) });
      } else {
        set({ trends: {} });
      }
    } catch (error: any) {
      console.error('[ANALYTICS STORE] Failed to fetch trends', error.response?.data || error.message);
      set({ trends: {} });
    }
  },

  fetchInsights: async () => {
    try {
      const response = await analyticsApi.getInsights();
      if (response.data.success && response.data.data) {
        set({ insights: Array.isArray(response.data.data.insights) ? response.data.data.insights : [] });
      }
    } catch (error: any) {
      console.error('[ANALYTICS STORE] Failed to fetch insights', error.response?.data || error.message);
      set({ insights: [] });
    }
  },

  fetchCategories: async (params) => {
    try {
      const response = await analyticsApi.getCategories(params);
      if (response.data.success && response.data.data) {
        const categories = Array.isArray(response.data.data.categories) ? response.data.data.categories : [];
        set({
          categories: categories.map((category) => ({
            name: category.name || 'Uncategorized',
            value: Number.isFinite(Number(category.value)) ? Number(category.value) : 0,
          })),
        });
      } else {
        set({ categories: [] });
      }
    } catch (error: any) {
      console.error('[ANALYTICS STORE] Failed to fetch categories', error.response?.data || error.message);
      set({ categories: [] });
    }
  },

  fetchScore: async () => {
    try {
      const response = await analyticsApi.getScore();
      if (response.data.success && response.data.data) {
        const scoreData = response.data.data as any;
        set({
          score: {
            score: Number.isFinite(Number(scoreData.score)) ? Number(scoreData.score) : 0,
            category: scoreData.category || 'unknown',
          },
        });
      }
    } catch (error: any) {
      console.error('[ANALYTICS STORE] Failed to fetch score', error.response?.data || error.message);
      set({ score: { score: 0, category: 'unknown' } });
    }
  },

  fetchAllAnalytics: async (params) => {
    const fetchParams = params !== undefined ? params : get().activeParams;
    if (params !== undefined) {
      set({ activeParams: params });
    }

    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().fetchSummary(fetchParams),
        get().fetchTrends(fetchParams),
        get().fetchCategories(fetchParams),
        get().fetchInsights(),
        get().fetchScore(),
      ]);
    } catch (error: any) {
      console.error('[ANALYTICS STORE] Failed to fetch analytics bundle', error.response?.data || error.message);
      set({ error: 'Failed to fetch analytics data' });
    } finally {
      set({ isLoading: false });
    }
  }
}));
