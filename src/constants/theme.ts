// theme.ts — Foxglove Design System
// This is the single source of truth for all colors, spacing, and typography.
// When expanding to web (React Native Web), this file remains unchanged.

export const Colors = {
  background: '#0B0F14',      // Midnight Forest — main bg
  primary: '#7C3AED',         // Foxglove Bloom — main purple
  accent: '#A78BFA',          // Electric Violet — glows, highlights
  teal: '#14B8A6',            // Forest Mist — calm/sleep accent
  textPrimary: '#E5E7EB',
  textSecondary: '#9CA3AF',
  card: 'rgba(255,255,255,0.05)',        // Glassmorphism base
  cardBorder: 'rgba(255,255,255,0.08)', // Glassmorphism border
  success: '#10B981',
  error: '#EF4444',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
};