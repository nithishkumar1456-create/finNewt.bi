import { create } from 'zustand';
import { Notification } from '../types/api.types';
import { notificationApi } from '../services/notifications.api';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationApi.getAll();
      if (response.data.success && response.data.data) {
        set({ notifications: response.data.data.notifications });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch notifications' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) => 
          n.id === id ? { ...n, isRead: true } : n
        )
      }));
    } catch (error: any) {
      console.error('Failed to mark notification as read', error);
    }
  },
}));