import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  setAuthenticated: (value: boolean) => void;
  setOnboardingCompleted: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  onboardingCompleted: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setOnboardingCompleted: (value) => set({ onboardingCompleted: value }),
  logout: () => set({ isAuthenticated: false, onboardingCompleted: false }),
}));
