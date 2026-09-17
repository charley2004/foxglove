// HomeScreen.tsx — Redesigned around the Foxglove Orb
// Minimal UI — the orb is the hero element
// Stats and details live below in a swipeable bottom area

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { getDynamicGreeting } from '../utils/timeUtils';
import { FoxgloveOrb } from '../components/FoxgloveOrb';
import { useAudioEngine } from '../hooks/useAudioEngine';

const { width, height } = Dimensions.get('window');

export function HomeScreen({ navigation }: any) {
  const { focusStreak, totalFocusHours, goal, isSessionActive, startSession, endSession } = useAppStore();
  const { startSession: startAudio, stopSession: stopAudio } = useAudioEngine();
  const [isPlaying, setIsPlaying] = useState(false);
  const greeting = getDynamicGreeting();

  // Map goal to orb mode
  const orbMode = goal === 'sleep' ? 'sleep' : goal === 'relax' ? 'calm' : 'focus';

  const handleOrbPress = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      endSession();
      await stopAudio();
    } else {
      setIsPlaying(true);
      startSession('focus', 25);
      await startAudio(orbMode);
    }
  };

  return (
    <LinearGradient
      colors={['#06080C', '#0B0F14', '#0d0a1a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>

        {/* Top bar — minimal */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.appName}>🦊 Foxglove</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Focus')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Streak pill */}
        <View style={styles.streakRow}>
          <View style={styles.streakPill}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakText}>{focusStreak} day streak</Text>
          </View>
        </View>

        {/* THE ORB — hero element */}
        <View style={styles.orbContainer}>
          <FoxgloveOrb
            mode={orbMode}
            isPlaying={isPlaying}
            size={width * 0.72}
            onPress={handleOrbPress}
          />
          {/* Tap instruction */}
          <Text style={styles.orbHint}>
            {isPlaying ? 'tap to stop' : 'tap to begin'}
          </Text>
        </View>

        {/* Mode label */}
        <View style={styles.modeLabelRow}>
          <Text style={styles.modeLabel}>
            {orbMode === 'focus' ? '⚡ DEEP FOCUS' :
             orbMode === 'sleep' ? '🌙 SLEEP MODE' : '🌿 CALM MODE'}
          </Text>
          {isPlaying && (
            <View style={styles.liveDot}>
              <View style={styles.liveDotInner} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>

        {/* Bottom stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalFocusHours.toFixed(1)}</Text>
            <Text style={styles.statLabel}>hours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{focusStreak}</Text>
            <Text style={styles.statLabel}>streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>focus</Text>
          </View>
        </View>

        {/* Quick mode switcher */}
        <View style={styles.quickModes}>
          {[
            { label: 'Focus', screen: 'Focus', emoji: '⚡' },
            { label: 'Calm', screen: 'Calm', emoji: '🌿' },
            { label: 'Mix', screen: 'Mixer', emoji: '🎚️' },
          ].map((m) => (
            <TouchableOpacity
              key={m.label}
              style={styles.quickModeBtn}
              onPress={() => navigation.navigate(m.screen)}
            >
              <Text style={styles.quickModeEmoji}>{m.emoji}</Text>
              <Text style={styles.quickModeLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  greeting: { fontSize: FontSize.xs, color: Colors.textSecondary, letterSpacing: 1 },
  appName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  settingsBtn: { padding: Spacing.sm },
  settingsIcon: { fontSize: 20 },
  streakRow: { alignItems: 'center', marginTop: Spacing.sm },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}25`,
    borderRadius: BorderRadius.full,
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.primary}40`,
    gap: 5,
  },
  streakFire: { fontSize: 13 },
  streakText: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: '600', letterSpacing: 0.5 },
  orbContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  orbHint: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  modeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modeLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.teal,
  },
  liveText: {
    fontSize: FontSize.xs,
    color: Colors.teal,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, letterSpacing: 1, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.cardBorder },
  quickModes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  quickModeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 4,
  },
  quickModeEmoji: { fontSize: 20 },
  quickModeLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
});