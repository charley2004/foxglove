// AudioService.ts — Foxglove Layered Audio Engine v2
// Updated for new folder structure and Sound Mixer support
//
// ARCHITECTURE DECISION: Singleton service pattern.
// One AudioService instance manages ALL audio across the app lifecycle.
//
// V2 UPGRADE PATH (AI Procedural Sound):
// Replace loadLayer() internals with a stream from an AI audio API.
// The public interface stays identical — components never change.
//
// LAYER SYSTEM (max 4 simultaneous for battery/performance):
// Layer 0 (Base):    Foundational drone/pad
// Layer 1 (Ambient): Mid-layer tones
// Layer 2 (Weather): Rain/wind
// Layer 3 (Voice):   Guided meditation

import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Lazy audio loader — prevents crash if file missing
// V2: Replace with Firebase Storage URLs for cloud-hosted audio
const getAudioSource = (file: string): any | null => {
  try {
    const registry: Record<string, any> = {
      // Focus
      'focus/focus_base.mp3':     require('../assets/audio/focus/focus_base.mp3'),
      'focus/focus_brown.mp3':    require('../assets/audio/focus/focus_brown.mp3'),
      'focus/focus_binaural.mp3': require('../assets/audio/focus/focus_binaural.mp3'),
      'focus/focus_white.mp3':    require('../assets/audio/focus/focus_white.mp3'),
      'focus/focus_cafe.mp3':     require('../assets/audio/focus/focus_cafe.mp3'),
      // Sleep
      'sleep/sleep_pad.mp3':      require('../assets/audio/sleep/sleep_pad.mp3'),
      'sleep/sleep_ocean.mp3':    require('../assets/audio/sleep/sleep_ocean.mp3'),
      'sleep/sleep_crickets.mp3': require('../assets/audio/sleep/sleep_crickets.mp3'),
      'sleep/sleep_delta.mp3':    require('../assets/audio/sleep/sleep_delta.mp3'),
      // Nature
      'nature/rain_light.mp3':        require('../assets/audio/nature/rain_light.mp3'),
      'nature/rain_heavy.mp3':        require('../assets/audio/nature/rain_heavy.mp3'),
      'nature/wind_layer.mp3':        require('../assets/audio/nature/wind_layer.mp3'),
      'nature/thunder_distant.mp3':   require('../assets/audio/nature/thunder_distant.mp3'),
      'nature/fireplace.mp3':         require('../assets/audio/nature/fireplace.mp3'),
      'nature/forest_birds.mp3':      require('../assets/audio/nature/forest_birds.mp3'),
      // Calm
      'calm/ambient_tone.mp3':    require('../assets/audio/calm/ambient_tone.mp3'),
      'calm/singing_bowl.mp3':    require('../assets/audio/calm/singing_bowl.mp3'),
      'calm/flute_soft.mp3':      require('../assets/audio/calm/flute_soft.mp3'),
    };
    return registry[file] ?? null;
  } catch (e) {
    console.warn(`[AudioService] File not found: ${file}`);
    return null;
  }
};

interface AudioLayer {
  player: AudioPlayer;
  volume: number;
  name: string;
}

class AudioService {
  private layers: Map<string, AudioLayer> = new Map();
  private masterVolume: number = 0.8;
  private isInitialized: boolean = false;

  async initialize() {
    if (this.isInitialized) return;
    try {
      await setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
      console.log('[AudioService] Initialized');
    } catch (e) {
      console.warn('[AudioService] Init failed:', e);
    }
  }

  async loadLayer(id: string, file: string, volume: number = 0.7): Promise<void> {
    if (this.layers.size >= 4 && !this.layers.has(id)) {
      console.warn('[AudioService] Max 4 layers reached.');
      return;
    }
    if (this.layers.has(id)) {
      await this.setLayerVolume(id, volume);
      return;
    }
    const source = getAudioSource(file);
    if (!source) return;

    try {
      const player = createAudioPlayer(source);
      player.volume = 0;
      player.loop = true;
      player.play();
      this.layers.set(id, { player, volume, name: id });
      await this.fadeLayerIn(id, volume);
      console.log(`[AudioService] Loaded: ${id}`);
    } catch (e) {
      console.error(`[AudioService] Failed to load ${id}:`, e);
    }
  }

  async fadeLayerIn(id: string, targetVolume: number, durationMs = 2000): Promise<void> {
    const layer = this.layers.get(id);
    if (!layer) return;
    const steps = 20;
    const stepTime = durationMs / steps;
    const finalVol = targetVolume * this.masterVolume;
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, stepTime));
      try { layer.player.volume = Math.min((finalVol / steps) * i, finalVol); } catch {}
    }
  }

  async fadeLayerOut(id: string, unloadAfter = true, durationMs = 2000): Promise<void> {
    const layer = this.layers.get(id);
    if (!layer) return;
    const steps = 20;
    const stepTime = durationMs / steps;
    const currentVol = layer.player.volume ?? 0;
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, stepTime));
      try { layer.player.volume = Math.max(currentVol - (currentVol / steps) * i, 0); } catch {}
    }
    if (unloadAfter) await this.unloadLayer(id);
  }

  async setLayerVolume(id: string, volume: number): Promise<void> {
    const layer = this.layers.get(id);
    if (!layer) return;
    layer.volume = volume;
    try { layer.player.volume = volume * this.masterVolume; } catch {}
  }

  async setMasterVolume(volume: number): Promise<void> {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    for (const layer of this.layers.values()) {
      try { layer.player.volume = layer.volume * this.masterVolume; } catch {}
    }
  }

  async unloadLayer(id: string): Promise<void> {
    const layer = this.layers.get(id);
    if (!layer) return;
    try { layer.player.pause(); layer.player.remove(); } catch {}
    this.layers.delete(id);
    console.log(`[AudioService] Unloaded: ${id}`);
  }

  async unloadAll(): Promise<void> {
    const ids = Array.from(this.layers.keys());
    await Promise.all(ids.map((id) => this.unloadLayer(id)));
    console.log('[AudioService] All layers unloaded');
  }

  async pauseAll(): Promise<void> {
    for (const layer of this.layers.values()) {
      try { layer.player.pause(); } catch {}
    }
  }

  async resumeAll(): Promise<void> {
    for (const layer of this.layers.values()) {
      try { layer.player.play(); } catch {}
    }
  }

  isLayerActive(id: string): boolean {
    return this.layers.has(id);
  }

  getActiveLayerCount(): number {
    return this.layers.size;
  }
}

export const audioService = new AudioService();