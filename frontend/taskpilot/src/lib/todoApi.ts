// src/lib/todoApi.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Points to your todolist-service (running on port 8082)
const todoApiClient = axios.create({
  baseURL: 'http://localhost:8082/api/v1',
});

// Use the same interceptor to automatically add the JWT token
todoApiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default todoApiClient;