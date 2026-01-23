import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type {
  AuthTokens,
  User,
  UserUpdate,
  MoodEntry,
  MoodEntryCreate,
  MoodAverages,
  ApiError,
} from '../types';

// ===========================================
// API CLIENT - Mood Tracker
// ===========================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------
// Token Management
// -----------------------------
const TOKEN_KEY = 'mood_tracker_tokens';

export const getStoredTokens = (): AuthTokens | null => {
  const stored = localStorage.getItem(TOKEN_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setStoredTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const clearStoredTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// -----------------------------
// Request Interceptor
// -----------------------------
api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    if (tokens?.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Response Interceptor (Token Refresh)
// -----------------------------
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      const tokens = getStoredTokens();

      // No refresh token available
      if (!tokens?.refresh_token) {
        clearStoredTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait for token refresh
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<AuthTokens>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refresh_token: tokens.refresh_token }
        );

        const newTokens = response.data;
        setStoredTokens(newTokens);
        onTokenRefreshed(newTokens.access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        clearStoredTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// -----------------------------
// Auth API
// -----------------------------
export const authApi = {
  register: async (email: string, password: string, name: string): Promise<User> => {
    const response = await api.post<User>('/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthTokens> => {
    // Note: Our backend expects name field too, but we only need email/password for login
    // The backend reuses UserCreate schema, so we pass a dummy name
    const response = await api.post<AuthTokens>('/auth/login', { 
      email, 
      password,
      name: 'login' // Backend ignores this for login
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};

// -----------------------------
// User API
// -----------------------------
export const userApi = {
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateMe: async (data: UserUpdate): Promise<User> => {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  },
};

// -----------------------------
// Entries API
// -----------------------------
export const entriesApi = {
  getEntries: async (limit: number = 11): Promise<MoodEntry[]> => {
    const response = await api.get<MoodEntry[]>('/entries', { params: { limit } });
    return response.data;
  },

  getTodayEntry: async (): Promise<MoodEntry | null> => {
    const response = await api.get<MoodEntry | null>('/entries/today');
    return response.data;
  },

  createEntry: async (data: MoodEntryCreate): Promise<MoodEntry> => {
    const response = await api.post<MoodEntry>('/entries', data);
    return response.data;
  },

  getAverages: async (): Promise<MoodAverages> => {
    const response = await api.get<MoodAverages>('/entries/averages');
    return response.data;
  },
};

export default api;
