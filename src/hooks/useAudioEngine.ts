// useAudioEngine.ts — React hook wrapping AudioService
//
// WHY A HOOK? Components should not call services directly.
// This hook translates service calls into React lifecycle events.
// On unmount, it auto-cleans up audio to prevent memory leaks.

import { useEffect, useCallback } from 'react';
import { audioService } from '../services/AudioService';
import { useAppStore } from '../store/useAppStore';

type SessionMode = 'focus' | 'sleep' | 'calm' | 'adaptive';

export function useAudioEngine() {
  const { masterVolume, baseVolume, ambientVolume, weatherVolume } = useAppStore();

  // Start a layered session based on mode
  const startSession = useCallback(async (mode: SessionMode, weatherCondition?: string) => {
    await audioService.initialize();
    await audioService.unloadAll(); // Clean slate

    if (mode === 'focus') {
      await audioService.loadLayer('focus_base', baseVolume);
      await audioService.loadLayer('ambient_tone', ambientVolume);
      // Adaptive weather layer
      if (weatherCondition === 'Rain') {
        await audioService.loadLayer('rain_layer', weatherVolume);
      }
    }

    if (mode === 'sleep' || mode === 'calm') {
      await audioService.loadLayer('sleep_pad', baseVolume);
      if (weatherCondition === 'Rain') {
        await audioService.loadLayer('rain_layer', weatherVolume * 0.6);
      }
    }

    if (mode === 'adaptive') {
      // Adaptive mode selects layers based on time + weather
      const hour = new Date().getHours();
      const isMorning = hour >= 6 && hour < 12;
      const isNight = hour >= 21 || hour < 6;

      await audioService.loadLayer('focus_base', isMorning ? baseVolume * 1.2 : baseVolume * 0.7);
      await audioService.loadLayer('ambient_tone', isNight ? ambientVolume * 0.5 : ambientVolume);

      if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') {
        await audioService.loadLayer('rain_layer', weatherVolume);
      } else if (weatherCondition === 'Wind' || weatherCondition === 'Clouds') {
        await audioService.loadLayer('wind_layer', weatherVolume * 0.5);
      }
    }

    await audioService.setMasterVolume(masterVolume);
  }, [masterVolume, baseVolume, ambientVolume, weatherVolume]);

  const stopSession = useCallback(async () => {
    await audioService.unloadAll();
  }, []);

  const updateMasterVolume = useCallback(async (vol: number) => {
    await audioService.setMasterVolume(vol);
  }, []);

  // Auto-cleanup when component using this hook unmounts
  useEffect(() => {
    return () => {
      audioService.unloadAll();
    };
  }, []);

  return { startSession, stopSession, updateMasterVolume };
}