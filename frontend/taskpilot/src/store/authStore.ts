// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../lib/api';
import { type LoginRequest } from '../api/types';

interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
}

// The 'persist' middleware will automatically save/load the token and user to/from localStorage.
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/users/login', credentials);
          const { token } = response.data;
          // Set the token first
          set({ token, isLoading: false });
          // Now fetch the user profile with the new token
          await get().fetchUserProfile();
          return true;
        } catch (err: any) {
          const errorMessage = err.response?.data || 'Login failed. Please check your credentials.';
          set({ error: errorMessage, isLoading: false, token: null, user: null });
          return false;
        }
      },

      fetchUserProfile: async () => {
         // This function now assumes a token is already set in the state/headers
         try {
            console.log("Attempting to fetch user profile...");
            const response = await apiClient.get('/users/profile');
            console.log("User profile fetched successfully:", response.data);
            set({ user: response.data });
         } catch(err: any) {
            console.error("Failed to fetch user profile. Error:", err.response?.data || err.message);
            // If we fail to get the profile, the token is likely bad. Log out.
            get().logout();
         }
      },

      logout: () => {
        console.log("Logging out.");
        set({ token: null, user: null, error: null });
      },
    }),
    {
      name: 'auth-storage', // The key in localStorage
      // We only want to persist the token. The user profile should be fetched every time.
      partialize: (state) => ({ token: state.token }),
    }
  )
);