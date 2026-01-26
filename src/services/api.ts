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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'mood_tracker_tokens';

export function getStoredTokens(): AuthTokens | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    
    if (tokens?.access_token && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokens = getStoredTokens();
      
      if (!tokens?.refresh_token) {
        clearStoredTokens();
        processQueue(new Error('No refresh token'), null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await api.post<AuthTokens>('/auth/refresh', {
          refresh_token: tokens.refresh_token,
        });
        
        const newTokens = response.data;
        setStoredTokens(newTokens);
        
        processQueue(null, newTokens.access_token);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        clearStoredTokens();
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (email: string, password: string, name: string): Promise<User> => {
    const response = await api.post<User>('/auth/register', {
      email,
      password,
      name,
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

export const entriesApi = {
  getEntries: async (limit: number = 11): Promise<MoodEntry[]> => {
    const response = await api.get<MoodEntry[]>('/entries', { params: { limit } });
    return response.data;
  },

  getTodayEntry: async (): Promise<MoodEntry | null> => {
    try {
      const response = await api.get<MoodEntry>('/entries/today');
      return response.data;
    } catch (error) {
      // 404 means no entry for today - that's expected
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createEntry: async (data: MoodEntryCreate): Promise<MoodEntry> => {
    const response = await api.post<MoodEntry>('/entries', data);
    return response.data;
  },

  getAverages: async (): Promise<MoodAverages | null> => {
    try {
      const response = await api.get<MoodAverages>('/entries/averages');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

interface UploadResponse {
  url: string;
  success: boolean;
  size?: number;
  type?: string;
}

export const uploadApi = {
  /**
   * Upload an avatar image
   * @param file The image file to upload
   * @returns The URL of the uploaded image
   */
  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success || !response.data.url) {
      throw new Error('Upload failed');
    }

    return response.data.url;
  },
};

export default api;
