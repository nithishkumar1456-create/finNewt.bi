import { create } from 'zustand';
import { Budget } from '../types/api.types';
import { budgetApi } from '../services/budgets.api';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;

  fetchBudgets: () => Promise<void>;
  addBudget: (data: any) => Promise<void>;
  updateBudget: (id: string, data: any) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,
  error: null,

  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await budgetApi.getAll();
      if (response.data.success && response.data.data) {
        set({ budgets: response.data.data.budgets });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch budgets' });
    } finally {
      set({ isLoading: false });
    }
  },

  addBudget: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await budgetApi.create(data);
      await get().fetchBudgets();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add budget' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBudget: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await budgetApi.update(id, data);
      await get().fetchBudgets();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update budget' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await budgetApi.delete(id);
      await get().fetchBudgets();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete budget' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));