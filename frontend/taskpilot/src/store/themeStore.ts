// src/store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// This function applies the theme to the <html> element
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
};


export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default theme
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        set({ theme: newTheme });
      },
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'taskpilot-theme-storage', // localStorage key
      // This function runs when the store is loaded from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

// Apply theme on initial load
const initialTheme = useThemeStore.getState().theme;
applyTheme(initialTheme);