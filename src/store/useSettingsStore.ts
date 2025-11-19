import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';
type ViewMode = 'infinite' | 'book';
type TimeFormat = '12h' | '24h';

interface SettingsState {
  theme: Theme;
  viewMode: ViewMode;
  timeFormat: TimeFormat;

  // Actions
  setTheme: (theme: Theme) => void;
  setViewMode: (mode: ViewMode) => void;
  setTimeFormat: (format: TimeFormat) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      viewMode: 'infinite',
      timeFormat: '12h',

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document root
        document.documentElement.setAttribute('data-theme', theme);
      },

      setViewMode: (mode) => set({ viewMode: mode }),
      setTimeFormat: (format) => set({ timeFormat: format }),
    }),
    {
      name: 'thoughts-time-settings',
      onRehydrateStorage: () => (state) => {
        // Apply theme on page load
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
