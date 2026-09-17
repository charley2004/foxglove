import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { BreathingCircle } from '../components/BreathingCircle';
import { useAudioEngine } from '../hooks/useAudioEngine';

export function CalmScreen() {
  const [mode, setMode] = useState<'breathing' | 'sleep' | null>(null);
  const { startSession, stopSession } = useAudioEngine();

  const handleModeSelect = async (selected: 'breathing' | 'sleep') => {
    if (mode === selected) {
      setMode(null);
      await stopSession();
      return;
    }
    setMode(selected);
    await startSession('calm');
  };

  return (
    <LinearGradient colors={['#0B0F14', '#0a1a14', '#0B0F14']} style={styles.container}>
      <SafeAreaView style={styles.safe}>

        <Text style={styles.title}>Calm Mode</Text>
        <Text style={styles.subtitle}>Rest. Breathe. Restore.</Text>

        {/* Mode Buttons */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'breathing' && styles.modeBtnActive]}
            onPress={() => handleModeSelect('breathing')}
          >
            <Text style={styles.modeEmoji}>🌿</Text>
            <Text style={styles.modeText}>Breathing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'sleep' && styles.modeBtnActive]}
            onPress={() => handleModeSelect('sleep')}
          >
            <Text style={styles.modeEmoji}>🌙</Text>
            <Text style={styles.modeText}>Sleep</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.center}>
          {mode === 'breathing' && (
            <>
              <BreathingCircle />
              <Text style={styles.technique}>4 · 7 · 8 Breathing</Text>
              <Text style={styles.techniqueDesc}>Inhale 4s · Hold 7s · Exhale 8s</Text>
            </>
          )}
          {mode === 'sleep' && (
            <View style={styles.sleepContainer}>
              <Text style={styles.sleepEmoji}>🌙</Text>
              <Text style={styles.sleepText}>Sleep sounds playing</Text>
              <Text style={styles.sleepSub}>Audio will fade out in 30 minutes</Text>
            </View>
          )}
          {!mode && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderEmoji}>🌿</Text>
              <Text style={styles.placeholderText}>
                Select a mode above{'\n'}to begin your session
              </Text>
            </View>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why 4-7-8 Works</Text>
          <Text style={styles.infoText}>
            Activates the parasympathetic nervous system. Reduces cortisol.
            Clinically shown to reduce anxiety in 4 cycles.
          </Text>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.lg, alignItems: 'center' },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  subtitle: { fontSize: FontSize.sm, color: Colors.teal, letterSpacing: 1, marginBottom: Spacing.xl },
  modeRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  modeBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  modeBtnActive: {
    borderColor: Colors.teal,
    backgroundColor: `${Colors.teal}20`,
  },
  modeEmoji: { fontSize: 24 },
  modeText: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600', marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  technique: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
  },
  techniqueDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
  sleepContainer: { alignItems: 'center' },
  sleepEmoji: { fontSize: 64, marginBottom: Spacing.lg },
  sleepText: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  sleepSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  placeholder: { alignItems: 'center' },
  placeholderEmoji: { fontSize: 56, marginBottom: Spacing.md },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCard: {
    width: '100%',
    backgroundColor: `${Colors.teal}15`,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.teal}30`,
    marginBottom: Spacing.xl,
  },
  infoTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.teal, marginBottom: 4 },
  infoText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});