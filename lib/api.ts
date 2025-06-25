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
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for custom JWT token
let customToken: string | null = null;

const isUserAuthenticated = (): boolean => {
  return !!auth.currentUser;
};
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
    if (config.headers && config.headers['Content-Type'] === 'multipart/form-data') {
      delete config.headers['Content-Type']; // Let the browser set it with boundary
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
  const response = await api.post('/api/auth/login', {
    token: firebaseToken
  });
  
  if (response.data.access_token) {
    customToken = response.data.access_token;
  }
  
  return response;
};

// Helper function to ensure user is logged in with custom token
export const ensureAuthenticated = async () => {
  if (!isUserAuthenticated()) {
    throw new Error('User not authenticated. Please log in first.');
  }
  
  if (!customToken) {
    await login();
  }
};

// User endpoints




export const getMedia = async (id: string) => {
  return api.get<Media>(`/api/media/${id}`);
};

export const listMedia = async () => {
  // Check if user is authenticated before making the request
  if (!isUserAuthenticated()) {
    throw new Error('Please log in to view media');
  }
  
  await ensureAuthenticated();
  return api.get('/api/media/');
};

export const getMediaPublic = async (id: string) => {
  return api.get(`/api/media/${id}`);
};

export const getCollectionPublic = async (id: string) => {
  return api.get(`/api/collections/${id}`);
};

// Keep all other functions the same...
export const getUser = async () => {
  await ensureAuthenticated();
  return api.get('/api/users/me');
};

export const updateUser = async (data: any) => {
  await ensureAuthenticated();
  return api.put('/api/users/me', data);
};

export const uploadMedia = async (file: File) => {
  await ensureAuthenticated();
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/upload/media', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data',
     },
     timeout: 60000, // Increased timeout for file uploads
  });
};

export const createMedia = async (data: any) => {
  await ensureAuthenticated();
  return api.post('/api/media/', data);
};

export const createCollection = async (data: any) => {
  await ensureAuthenticated();
  return api.post('/api/collections/', data);
};

export const recordAnalytics = async (data: any) => {
  await ensureAuthenticated();
  return api.post('/api/analytics/', data);
};

export const logout = () => {
  customToken = null;
  return auth.signOut();
};


// Collection endpoints

export const getCollection = async (id: string) => {
  return api.get<Collection>(`/api/collections/${id}`);
};

// Analytics endpoint


export async function pingBackend() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ping`);
    const data = await res.json();
    console.log("✅ Backend Response:", data);
  } catch (error) {
    console.error("❌ Backend Ping Error:", error);
  }
}


export default api;