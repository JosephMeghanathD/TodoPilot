// src/lib/todoApi.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Use environment variable for the URL, with a local fallback
export const TODO_SERVICE_URL = "https://taskpilot-todolist-service-516671671837.us-central1.run.app";

const todoApiClient = axios.create({
  baseURL: `${TODO_SERVICE_URL}/api/v1`,
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