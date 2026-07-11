export const colors = {
  dark: {
    primary: '#6C63FF',
    secondary: '#FF6584',
    background: '#0B1020',
    surface: '#141B2D',
    surfaceLight: '#1E2A42',
    text: '#FFFFFF',
    textSecondary: '#8892B0',
    border: '#233554',
    success: '#64FFDA',
    warning: '#FFB347',
    error: '#FF6B6B',
    muted: '#495670',
  },
  light: {
    primary: '#6C63FF',
    secondary: '#FF6584',
    background: '#F8F9FC',
    surface: '#FFFFFF',
    surfaceLight: '#EEF1F6',
    text: '#1A1A2E',
    textSecondary: '#6B7394',
    border: '#D1D5E4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    muted: '#9CA3AF',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    hero: 40,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
