import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from './firebase';

// Define interfaces for request/response data
interface SignupData {
  email: string;
  name: string;
  firebaseUid: string;
}

interface LoginData {
  email: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  firebaseUid: string;
  followers: number;
}

interface Media {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  type: 'photo' | 'video' | 'audio';
  creator: {
    name: string;
    avatar?: string;
  };
  views: number;
  downloads: number;
  likes: number;
  category: string;
  status: string;
  earnings: number;
  created_at: string;
  duration?: string;
}

interface CollectionData {
  title: string;
  thumbnail: string;
  themes: string[];
  category: string;
}

interface Collection {
  id: string;
  title: string;
  thumbnail: string;
  themes: string[];
  itemCount: number;
  views: number;
  likes: number;
  downloads: number;
  creator: {
    name: string;
    avatar?: string;
  };
  category: string;
  isPremium: boolean;
}

interface Analytics {
  totalViews: number;
  totalDownloads: number;
  earnings: number;
  followers: number;
  viewsChange: number;
  downloadsChange: number;
  earningsChange: number;
  followersChange: number;
}

interface LeaderboardItem {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  challengesWon: number;
  photosLiked: number;
  followers: number;
}

interface ApiError {
  detail: string;
}

// Validate environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL;
if (!baseURL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding Firebase ID token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const apiError: ApiError = {
      detail: error.response?.data?.detail || error.message || 'An unexpected error occurred',
    };
    if (error.response?.status === 401) {
      apiError.detail = 'Unauthorized: Please log in again';
    } else if (error.response?.status === 403) {
      apiError.detail = 'Forbidden: You do not have permission to perform this action';
    }
    return Promise.reject(apiError);
  }
);

// Auth endpoints
export const signup = (data: SignupData) =>
  api.post<{ token: string }>('/api/auth/signup', data);

export const login = (data: LoginData) =>
  api.post<{ token: string }>('/api/auth/login', data);

// User endpoints
export const getUser = () => api.get<User>('/api/users/me');

// Media endpoints
export const uploadMedia = (data: FormData) =>
  api.post<Media>('/api/upload/media', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getMedia = (id: string) => api.get<Media>(`/api/media/${id}`);

export const listMedia = (params?: { type?: string; userId?: string; category?: string; excludeId?: string }) =>
  api.get<{ items: Media[] }>(`/api/media`, { params });

export const likeMedia = (id: string) => api.post(`/api/media/${id}/like`, {});
export const unlikeMedia = (id: string) => api.post(`/api/media/${id}/unlike`, {});
export const downloadMedia = (id: string) => api.post(`/api/media/${id}/download`, {});

// Collection endpoints
export const createCollection = (data: CollectionData) =>
  api.post<Collection>('/api/collections', data);

export const listCollections = () => api.get<{ items: Collection[] }>('/api/collections');
export const likeCollection = (id: string) => api.post(`/api/collections/${id}/like`, {});
export const unlikeCollection = (id: string) => api.post(`/api/collections/${id}/unlike`, {});

// Analytics endpoint
export const getAnalytics = () => api.get<Analytics>('/api/analytics');

// Leaderboard endpoint
export const getLeaderboard = () => api.get<{ items: LeaderboardItem[] }>('/api/leaderboard');

export default api;