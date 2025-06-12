import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
const user = auth.currentUser;
if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

export const signup = (data) => api.post('/api/auth/signup', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getUser = () => api.get('/api/users/me');
export const uploadMedia = (data) => api.post('/api/upload/media', data);
export const getMedia = (id) => api.get(`/api/media/${id}`);
export const listMedia = () => api.get('/api/media');
export const createCollection = (data) => api.post('/api/collections', data);

export default api;