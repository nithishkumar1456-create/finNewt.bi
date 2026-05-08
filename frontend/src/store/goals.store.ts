import { create } from 'zustand';
import { Goal } from '../types/api.types';
import { goalApi } from '../services/goals.api';

const safeGoalList = (goals: unknown): Goal[] => Array.isArray(goals) ? goals : [];

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;

  fetchGoals: () => Promise<void>;
  addGoal: (data: any) => Promise<void>;
  updateGoal: (id: string, data: any) => Promise<void>;
  addFunds: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await goalApi.getAll();
      if (response.data.success && response.data.data) {
        set({ goals: safeGoalList(response.data.data.goals) });
      } else {
        set({ goals: [] });
      }
    } catch (error: any) {
      console.error('[GOALS STORE] Failed to fetch goals', error.response?.data || error.message);
      set({ goals: [], error: error.response?.data?.message || 'Failed to fetch goals' });
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await goalApi.create(data);
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add goal' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await goalApi.update(id, data);
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update goal' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addFunds: async (id, amount) => {
    set({ isLoading: true, error: null });
    try {
      await goalApi.addFunds(id, amount);
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add funds' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await goalApi.delete(id);
      await get().fetchGoals();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete goal' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
