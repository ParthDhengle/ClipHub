import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from './firebase';

// Define interfaces for request/response data
interface SignupData {
  email: string;
  name: string;
  password: string; // Added password for signup
}

interface LoginData {
  token: string; // Firebase ID token
}

interface User {
  user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  specialty?: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

interface Media {
  media_id: string;
  title: string;
  url: string;
  thumbnail_url?: string;
  type: 'photo' | 'video' | 'music' | 'collection';
  category_id?: string;
  is_premium: boolean;
  tags: string[];
  likes: number;
  views: number;
  downloads: number;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string;
  created_at: string;
  updated_at?: string;
}

interface MediaCreate {
  title: string;
  url: string;
  thumbnail_url?: string;
  type: 'photo' | 'video' | 'music' | 'collection';
  category_id?: string;
  is_premium?: boolean;
  tags?: string[];
}

interface CollectionData {
  title: string;
  media_ids: string[];
}

interface Collection {
  collection_id: string;
  title: string;
  item_count: number;
  media_ids: string[];
  user_id: string;
  created_at: string;
  updated_at?: string;
}

interface Analytics {
  analytics_id: string;
  user_id: string;
  media_id?: string;
  views: number;
  downloads: number;
  likes: number;
  engagement_rate?: number;
  approval_rate?: number;
  quality_score?: number;
  created_at: string;
}

interface ApiError {
  error: boolean;
  message: string;
  status_code: number;
  details?: any;
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

// Store for custom JWT token
let customToken: string | null = null;

// Request interceptor for adding authentication tokens
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const user = auth.currentUser;
    
    // For auth endpoints, send Firebase ID token
    if (config.url?.includes('/api/auth/login') && user) {
      const firebaseToken = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${firebaseToken}`;
    }
    // For other endpoints, use custom JWT if available, otherwise Firebase token
    else if (user) {
      if (customToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${customToken}`;
      } else {
        const firebaseToken = await user.getIdToken();
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${firebaseToken}`;
      }
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
      error: true,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status_code: error.response?.status || 500,
      details: error.response?.data?.details
    };
    
    if (error.response?.status === 401) {
      apiError.message = 'Unauthorized: Please log in again';
      // Clear custom token on 401
      customToken = null;
    } else if (error.response?.status === 403) {
      apiError.message = 'Forbidden: You do not have permission to perform this action';
    }
    
    return Promise.reject(apiError);
  }
);

// Auth endpoints
export const signup = async (data: SignupData) => {
  const response = await api.post<{ user: User; access_token: string; token_type: string }>('/api/auth/signup', data);
  if (response.data.access_token) {
    customToken = response.data.access_token;
  }
  return response;
};

export const login = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found');
  }
  
  const firebaseToken = await user.getIdToken();
  const response = await api.post<{ access_token: string; token_type: string }>('/api/auth/login', {
    token: firebaseToken
  });
  
  if (response.data.access_token) {
    customToken = response.data.access_token;
  }
  
  return response;
};

// Helper function to ensure user is logged in with custom token
export const ensureAuthenticated = async () => {
  if (!customToken) {
    await login();
  }
};

// User endpoints
export const getUser = async () => {
  await ensureAuthenticated();
  return api.get<User>('/api/users/me');
};

export const updateUser = async (data: Partial<User>) => {
  await ensureAuthenticated();
  return api.put<User>('/api/users/me', data);
};

// Media endpoints
export const uploadMedia = async (file: File) => {
  await ensureAuthenticated();
  const formData = new FormData();
  formData.append('file', file);
  return api.post<{ url: string }>('/api/upload/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createMedia = async (data: MediaCreate) => {
  await ensureAuthenticated();
  return api.post<Media>('/api/media/', data);
};

export const getMedia = async (id: string) => {
  return api.get<Media>(`/api/media/${id}`);
};

export const listMedia = async () => {
  await ensureAuthenticated();
  return api.get<Media[]>('/api/media/');
};

// Collection endpoints
export const createCollection = async (data: CollectionData) => {
  await ensureAuthenticated();
  return api.post<Collection>('/api/collections/', data);
};

export const getCollection = async (id: string) => {
  return api.get<Collection>(`/api/collections/${id}`);
};

// Analytics endpoint
export const recordAnalytics = async (data: Partial<Analytics>) => {
  await ensureAuthenticated();
  return api.post<Analytics>('/api/analytics/', data);
};

// Clear tokens on logout
export const logout = () => {
  customToken = null;
  return auth.signOut();
};

export default api;