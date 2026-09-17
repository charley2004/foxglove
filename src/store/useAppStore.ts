// useAppStore.ts — Global state for Foxglove
// Zustand creates a hook-based store. Each slice of state lives here.
// For larger apps, split into separate stores (useAudioStore, useUserStore, etc.)

import { create } from 'zustand';

type Goal = 'focus' | 'sleep' | 'relax';
type SessionType = 'focus' | 'calm' | 'adaptive';

interface UserState {
  uid: string | null;
  email: string | null;
  isPremium: boolean;
  goal: Goal | null;
  focusStreak: number;
  totalFocusHours: number;
}

interface SessionState {
  isSessionActive: boolean;
  sessionType: SessionType | null;
  sessionDuration: number; // in minutes
  sessionStartTime: number | null; // timestamp
  adhdMode: boolean;
  deepWorkScore: number;
}

interface AudioState {
  masterVolume: number;   // 0–1
  baseVolume: number;
  ambientVolume: number;
  weatherVolume: number;
}

interface AppStore extends UserState, SessionState, AudioState {
  // User actions
  setUser: (uid: string, email: string) => void;
  setGoal: (goal: Goal) => void;
  setPremium: (val: boolean) => void;
  incrementStreak: () => void;
  addFocusTime: (minutes: number) => void;

  // Session actions
  startSession: (type: SessionType, duration: number) => void;
  endSession: () => void;
  toggleAdhdMode: () => void;
  setDeepWorkScore: (score: number) => void;

  // Audio actions
  setMasterVolume: (vol: number) => void;
  setBaseVolume: (vol: number) => void;
  setAmbientVolume: (vol: number) => void;
  setWeatherVolume: (vol: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial user state
  uid: null,
  email: null,
  isPremium: false,
  goal: null,
  focusStreak: 3, // seeded for demo
  totalFocusHours: 12.5,

  // Initial session state
  isSessionActive: false,
  sessionType: null,
  sessionDuration: 25,
  sessionStartTime: null,
  adhdMode: false,
  deepWorkScore: 0,

  // Initial audio state
  masterVolume: 0.8,
  baseVolume: 0.7,
  ambientVolume: 0.5,
  weatherVolume: 0.3,

  // --- User Actions ---
  setUser: (uid, email) => set({ uid, email }),
  setGoal: (goal) => set({ goal }),
  setPremium: (val) => set({ isPremium: val }),
  incrementStreak: () => set((s) => ({ focusStreak: s.focusStreak + 1 })),
  addFocusTime: (minutes) =>
    set((s) => ({ totalFocusHours: s.totalFocusHours + minutes / 60 })),

  // --- Session Actions ---
  startSession: (type, duration) =>
    set({
      isSessionActive: true,
      sessionType: type,
      sessionDuration: duration,
      sessionStartTime: Date.now(),
      deepWorkScore: 0,
    }),
  endSession: () =>
    set({
      isSessionActive: false,
      sessionType: null,
      sessionStartTime: null,
    }),
  toggleAdhdMode: () => set((s) => ({ adhdMode: !s.adhdMode })),
  setDeepWorkScore: (score) => set({ deepWorkScore: score }),

  // --- Audio Actions ---
  setMasterVolume: (vol) => set({ masterVolume: vol }),
  setBaseVolume: (vol) => set({ baseVolume: vol }),
  setAmbientVolume: (vol) => set({ ambientVolume: vol }),
  setWeatherVolume: (vol) => set({ weatherVolume: vol }),
}));