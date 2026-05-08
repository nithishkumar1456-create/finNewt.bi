import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/api.types';
import { authApi } from '../services/auth.api';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string | null) => void;
  clearLocalAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearLocalAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false, error: null }),
      clearError: () => set({ error: null }),

      login: async (data) => {
        set({ isLoading: true, error: null });
        console.log('[AUTH STORE] Attempting login', {
          email: data.email,
          hasPassword: Boolean(data.password),
          passwordLength: data.password?.length,
        });
        try {
          const response = await authApi.login(data);
          const responseUser = response.data.user ?? response.data.data?.user;
          const accessToken = response.data.accessToken ?? null;

          console.log('[AUTH STORE] Login response received', {
            success: response.data.success,
            status: response.status,
            hasAccessToken: Boolean(accessToken),
            hasUser: Boolean(responseUser),
          });

          if (response.data.success && responseUser && accessToken) {
            set({ user: responseUser, accessToken, isAuthenticated: true, isLoading: false });
            console.log('[AUTH STORE] Auth state updated after login', {
              userId: responseUser.id,
              isAuthenticated: true,
            });
          } else {
             throw new Error('Invalid response structure from backend');
          }
        } catch (error: any) {
          console.error('[AUTH STORE] Login failed', error.response?.data || error.message);
          set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.verifyOtp({ email, otp });
          const responseUser = response.data.user ?? response.data.data?.user;
          const accessToken = response.data.accessToken ?? null;
          console.log('[AUTH STORE] Verify OTP response received', {
            success: response.data.success,
            hasAccessToken: Boolean(accessToken),
            hasUser: Boolean(responseUser),
          });
          if (response.data.success && responseUser && accessToken) {
            set({ user: responseUser, accessToken, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('Invalid response structure from backend');
          }
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'OTP verification failed', isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (e) {
          // ignore error on logout
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false, error: null });
        }
      },

      fetchProfile: async () => {
        try {
          console.log('[AUTH STORE] Fetching profile for session hydration');
          const response = await authApi.getProfile();
          if (response.data.success && response.data.data?.user) {
            console.log('[AUTH STORE] Profile hydration succeeded', { userId: response.data.data.user.id });
            set({ user: response.data.data.user, isAuthenticated: true });
          }
        } catch (error) {
          console.warn('[AUTH STORE] Profile hydration failed; clearing local auth state');
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);
