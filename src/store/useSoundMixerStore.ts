// useSoundMixerStore.ts — Sound Mixer State
// Tracks which sounds are active and their individual volumes
// Separate from main app store for clean separation of concerns
// FUTURE: Save presets to Firestore for cross-device sync

import { create } from 'zustand';

export interface SoundTrack {
  id: string;
  name: string;
  category: 'focus' | 'sleep' | 'nature' | 'calm';
  emoji: string;
  file: string;
  volume: number;      // 0-1
  isActive: boolean;
  isPremium: boolean;
}

interface SoundMixerStore {
  tracks: SoundTrack[];
  activeMixName: string;
  toggleTrack: (id: string) => void;
  setTrackVolume: (id: string, volume: number) => void;
  setActiveMixName: (name: string) => void;
  getActiveTracks: () => SoundTrack[];
}

const DEFAULT_TRACKS: SoundTrack[] = [
  // Focus
  { id: 'focus_base',     name: 'Deep Drone',     category: 'focus',  emoji: '🎵', file: 'focus/focus_base.mp3',     volume: 0.7, isActive: false, isPremium: false },
  { id: 'focus_brown',    name: 'Brown Noise',    category: 'focus',  emoji: '🟤', file: 'focus/focus_brown.mp3',    volume: 0.7, isActive: false, isPremium: false },
  { id: 'focus_binaural', name: 'Binaural Beats', category: 'focus',  emoji: '🧠', file: 'focus/focus_binaural.mp3', volume: 0.5, isActive: false, isPremium: true  },
  { id: 'focus_white',    name: 'White Noise',    category: 'focus',  emoji: '⬜', file: 'focus/focus_white.mp3',    volume: 0.6, isActive: false, isPremium: false },
  { id: 'focus_cafe',     name: 'Cafe Murmur',    category: 'focus',  emoji: '☕', file: 'focus/focus_cafe.mp3',     volume: 0.5, isActive: false, isPremium: true  },
  // Sleep
  { id: 'sleep_pad',      name: 'Sleep Pad',      category: 'sleep',  emoji: '🌙', file: 'sleep/sleep_pad.mp3',      volume: 0.7, isActive: false, isPremium: false },
  { id: 'sleep_ocean',    name: 'Ocean Waves',    category: 'sleep',  emoji: '🌊', file: 'sleep/sleep_ocean.mp3',    volume: 0.7, isActive: false, isPremium: false },
  { id: 'sleep_crickets', name: 'Night Crickets', category: 'sleep',  emoji: '🦗', file: 'sleep/sleep_crickets.mp3', volume: 0.5, isActive: false, isPremium: true  },
  { id: 'sleep_delta',    name: 'Delta Waves',    category: 'sleep',  emoji: '〰️', file: 'sleep/sleep_delta.mp3',    volume: 0.4, isActive: false, isPremium: true  },
  // Nature
  { id: 'rain_light',     name: 'Light Rain',     category: 'nature', emoji: '🌧️', file: 'nature/rain_light.mp3',    volume: 0.6, isActive: false, isPremium: false },
  { id: 'rain_heavy',     name: 'Heavy Rain',     category: 'nature', emoji: '⛈️', file: 'nature/rain_heavy.mp3',    volume: 0.6, isActive: false, isPremium: false },
  { id: 'wind_layer',     name: 'Wind',           category: 'nature', emoji: '💨', file: 'nature/wind_layer.mp3',    volume: 0.4, isActive: false, isPremium: false },
  { id: 'thunder',        name: 'Thunder',        category: 'nature', emoji: '⚡', file: 'nature/thunder_distant.mp3',volume: 0.3, isActive: false, isPremium: true  },
  { id: 'fireplace',      name: 'Fireplace',      category: 'nature', emoji: '🔥', file: 'nature/fireplace.mp3',     volume: 0.5, isActive: false, isPremium: true  },
  { id: 'forest_birds',   name: 'Forest Birds',   category: 'nature', emoji: '🐦', file: 'nature/forest_birds.mp3',  volume: 0.5, isActive: false, isPremium: true  },
  // Calm
  { id: 'ambient_tone',   name: 'Ambient Pad',    category: 'calm',   emoji: '✨', file: 'calm/ambient_tone.mp3',    volume: 0.6, isActive: false, isPremium: false },
  { id: 'singing_bowl',   name: 'Singing Bowl',   category: 'calm',   emoji: '🔔', file: 'calm/singing_bowl.mp3',    volume: 0.5, isActive: false, isPremium: true  },
  { id: 'flute_soft',     name: 'Soft Flute',     category: 'calm',   emoji: '🎶', file: 'calm/flute_soft.mp3',      volume: 0.5, isActive: false, isPremium: true  },
];

export const useSoundMixerStore = create<SoundMixerStore>((set, get) => ({
  tracks: DEFAULT_TRACKS,
  activeMixName: 'Custom Mix',

  toggleTrack: (id) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      ),
    })),

  setTrackVolume: (id, volume) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === id ? { ...t, volume } : t
      ),
    })),

  setActiveMixName: (name) => set({ activeMixName: name }),

  getActiveTracks: () => get().tracks.filter((t) => t.isActive),
}));