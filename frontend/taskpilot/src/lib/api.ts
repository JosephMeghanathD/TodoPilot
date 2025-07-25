// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Use environment variable for the URL, with a local fallback
export const USER_SERVICE_URL = "https://taskpilot-user-service-516671671837.us-central1.run.app";

const apiClient = axios.create({
  baseURL: `${USER_SERVICE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token to every request if it exists
apiClient.interceptors.request.use(
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

export default apiClient;