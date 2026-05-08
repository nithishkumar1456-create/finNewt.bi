import { create } from 'zustand';
import { Transaction, PaginatedTransactions } from '../types/api.types';
import { transactionApi } from '../services/transactions.api';

interface TransactionState {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  activeParams: any;

  fetchTransactions: (params?: any) => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  updateTransaction: (id: string, data: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  activeParams: {},

  fetchTransactions: async (params) => {
    const fetchParams = params !== undefined ? params : get().activeParams;
    if (params !== undefined) {
      set({ activeParams: params });
    }

    set({ isLoading: true, error: null });
    try {
      const response = await transactionApi.getAll(fetchParams);
      if (response.data.success && response.data.data) {
        const transactions = Array.isArray(response.data.data.transactions) ? response.data.data.transactions : [];
        const pagination = response.data.data.pagination;
        set({
          transactions,
          total: Number.isFinite(Number(pagination?.total)) ? Number(pagination.total) : transactions.length,
          page: Number.isFinite(Number(pagination?.page)) ? Number(pagination.page) : 1,
          limit: Number.isFinite(Number(pagination?.limit)) ? Number(pagination.limit) : 10,
        });
      } else {
        set({ transactions: [], total: 0, page: 1, limit: 10 });
      }
    } catch (error: any) {
      console.error('[TRANSACTION STORE] Failed to fetch transactions', error.response?.data || error.message);
      set({ transactions: [], error: error.response?.data?.message || 'Failed to fetch transactions' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await transactionApi.create(data);
      // Optimistically fetch again or just refresh
      await get().fetchTransactions({ ...get().activeParams, page: get().page, limit: get().limit });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await transactionApi.update(id, data);
      await get().fetchTransactions({ ...get().activeParams, page: get().page, limit: get().limit });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await transactionApi.delete(id);
      await get().fetchTransactions({ ...get().activeParams, page: get().page, limit: get().limit });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
