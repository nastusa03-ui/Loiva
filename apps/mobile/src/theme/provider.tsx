import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  colors: typeof import('@loiva/ui').colors.dark;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'loiva_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    SecureStore.getItemAsync(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    SecureStore.setItemAsync(THEME_KEY, newMode);
  };

  const resolved: ResolvedTheme = mode === 'system'
    ? (systemScheme ?? 'dark') === 'dark' ? 'dark' : 'light'
    : mode;

  const colors = resolved === 'dark'
    ? require('@loiva/ui').colors.dark
    : require('@loiva/ui').colors.light;

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
