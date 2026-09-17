// SoundMixerScreen.tsx — Full layered sound mixer
// Users can activate any combination of sounds and control volumes
// Max 4 simultaneous sounds enforced by AudioService
// FUTURE: Save named presets to Firestore

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { useSoundMixerStore, SoundTrack } from '../store/useSoundMixerStore';
import { audioService } from '../services/AudioService';
import { useAppStore } from '../store/useAppStore';

// Category config
const CATEGORIES = [
  { id: 'focus',  label: 'FOCUS',  emoji: '⚡', color: Colors.primary },
  { id: 'sleep',  label: 'SLEEP',  emoji: '🌙', color: '#3B82F6'      },
  { id: 'nature', label: 'NATURE', emoji: '🌿', color: Colors.teal    },
  { id: 'calm',   label: 'CALM',   emoji: '✨', color: '#8B5CF6'      },
] as const;

// Individual track row component
function TrackRow({ track, onToggle, onVolumeChange, isPremiumUser }: {
  track: SoundTrack;
  onToggle: () => void;
  onVolumeChange: (v: number) => void;
  isPremiumUser: boolean;
}) {
  const isLocked = track.isPremium && !isPremiumUser;

  return (
    <TouchableOpacity
      style={[styles.trackRow, track.isActive && styles.trackRowActive]}
      onPress={isLocked ? undefined : onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.trackLeft}>
        <Text style={styles.trackEmoji}>{track.emoji}</Text>
        <View style={styles.trackInfo}>
          <View style={styles.trackNameRow}>
            <Text style={styles.trackName}>{track.name}</Text>
            {isLocked && <Text style={styles.premiumBadge}>PRO</Text>}
          </View>
          {track.isActive && (
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={track.volume}
              onValueChange={onVolumeChange}
              minimumTrackTintColor={Colors.accent}
              maximumTrackTintColor={Colors.cardBorder}
              thumbTintColor={Colors.accent}
            />
          )}
        </View>
      </View>
      <View style={[
        styles.toggleDot,
        { backgroundColor: track.isActive ? Colors.accent : Colors.cardBorder },
      ]} />
    </TouchableOpacity>
  );
}

export function SoundMixerScreen() {
  const { tracks, toggleTrack, setTrackVolume, getActiveTracks } = useSoundMixerStore();
  const { isPremium } = useAppStore();
  const activeTracks = getActiveTracks();

  // Sync audio engine when tracks change
  const handleToggle = async (track: SoundTrack) => {
    const isCurrentlyActive = track.isActive;

    // Enforce max 4 layer limit
    if (!isCurrentlyActive && activeTracks.length >= 4) {
      return;
    }

    toggleTrack(track.id);

    if (isCurrentlyActive) {
      await audioService.fadeLayerOut(track.id);
    } else {
      await audioService.initialize();
      await audioService.loadLayer(track.id, track.file, track.volume);
    }
  };

  const handleVolumeChange = async (track: SoundTrack, volume: number) => {
    setTrackVolume(track.id, volume);
    await audioService.setLayerVolume(track.id, volume);
  };

  return (
    <LinearGradient colors={['#0B0F14', '#0f0a1e', '#0B0F14']} style={styles.container}>
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sound Mixer</Text>
          <View style={styles.activeCount}>
            <View style={[
              styles.activeDot,
              { backgroundColor: activeTracks.length > 0 ? Colors.teal : Colors.cardBorder },
            ]} />
            <Text style={styles.activeText}>
              {activeTracks.length}/4 layers active
            </Text>
          </View>
        </View>

        {/* Active mix preview */}
        {activeTracks.length > 0 && (
          <View style={styles.mixPreview}>
            <Text style={styles.mixLabel}>NOW PLAYING</Text>
            <Text style={styles.mixTracks}>
              {activeTracks.map((t) => t.emoji).join('  ')}
            </Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {CATEGORIES.map((cat) => {
            const catTracks = tracks.filter((t) => t.category === cat.id);
            return (
              <View key={cat.id} style={styles.category}>

                {/* Category header */}
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.categoryLabel, { color: cat.color }]}>
                    {cat.label}
                  </Text>
                </View>

                {/* Track rows */}
                <View style={[styles.categoryCard, { borderColor: `${cat.color}25` }]}>
                  {catTracks.map((track, index) => (
                    <View key={track.id}>
                      <TrackRow
                        track={track}
                        onToggle={() => handleToggle(track)}
                        onVolumeChange={(v) => handleVolumeChange(track, v)}
                        isPremiumUser={isPremium}
                      />
                      {index < catTracks.length - 1 && (
                        <View style={styles.divider} />
                      )}
                    </View>
                  ))}
                </View>

              </View>
            );
          })}

          {/* Premium upsell */}
          {!isPremium && (
            <TouchableOpacity style={styles.premiumCard}>
              <Text style={styles.premiumTitle}>🔓 Unlock All Sounds</Text>
              <Text style={styles.premiumSub}>
                Get binaural beats, cafe sounds, singing bowls and more
              </Text>
              <View style={styles.premiumBtn}>
                <Text style={styles.premiumBtnText}>Go Premium →</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  activeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  mixPreview: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: `${Colors.primary}20`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.primary}40`,
    alignItems: 'center',
  },
  mixLabel: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: 4,
  },
  mixTracks: {
    fontSize: 24,
    letterSpacing: 8,
  },
  category: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryEmoji: { fontSize: 16 },
  categoryLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
  },
  categoryCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  trackRowActive: {
    backgroundColor: `${Colors.primary}15`,
  },
  trackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  trackInfo: { flex: 1 },
  trackEmoji: { fontSize: 22, width: 32 },
  trackNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trackName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  premiumBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accent,
    backgroundColor: `${Colors.accent}20`,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 0.5,
  },
  slider: {
    width: 160,
    height: 30,
    marginTop: 4,
  },
  toggleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: Spacing.md,
  },
  premiumCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: `${Colors.accent}10`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: `${Colors.accent}30`,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  premiumSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  premiumBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  premiumBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
});