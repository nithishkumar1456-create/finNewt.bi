import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('[AXIOS REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      hasAuthorization: Boolean(config.headers.Authorization),
      data: config.data,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('[AXIOS REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('[AXIOS RESPONSE]', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error('[AXIOS RESPONSE ERROR]', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data || error.message,
    });
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/logout')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[AXIOS REFRESH] Attempting token refresh');
        const refreshResponse = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken = refreshResponse.data?.accessToken ?? null;
        if (newAccessToken) {
          useAuthStore.getState().setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        if (refreshResponse.data?.user) {
          useAuthStore.getState().setUser(refreshResponse.data.user);
        }
        
        processQueue(null);
        console.log('[AXIOS REFRESH] Token refresh succeeded', { hasAccessToken: Boolean(newAccessToken) });
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('[AXIOS REFRESH] Token refresh failed; clearing local auth state', refreshError);
        useAuthStore.getState().clearLocalAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
