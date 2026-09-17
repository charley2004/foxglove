import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { CircularTimer } from '../components/CircularTimer';

const DURATIONS = [
  { label: '25', minutes: 25, emoji: '⚡' },
  { label: '50', minutes: 50, emoji: '🔥' },
  { label: '90', minutes: 90, emoji: '💎' },
];

export function FocusScreen() {
  const { adhdMode, toggleAdhdMode, startSession, endSession, addFocusTime } = useAppStore();
  const { startSession: startAudio, stopSession: stopAudio } = useAudioEngine();

  const [selectedDuration, setSelectedDuration] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = selectedDuration * 60;
  const progress = 1 - timeLeft / totalSeconds;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            handleSessionComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRunning(true);
    startSession('focus', selectedDuration);
    await startAudio('focus');
  };

  const handleStop = async () => {
    Alert.alert('End Session?', 'Your progress will be saved.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Session',
        style: 'destructive',
        onPress: async () => {
          setIsRunning(false);
          setTimeLeft(selectedDuration * 60);
          endSession();
          await stopAudio();
        },
      },
    ]);
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addFocusTime(selectedDuration);
    endSession();
    await stopAudio();
    Alert.alert('Session Complete! 🎉', `You completed a ${selectedDuration}-minute focus session.`);
  };

  const selectDuration = (minutes: number) => {
    if (isRunning) return;
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
  };

  return (
    <LinearGradient colors={['#0B0F14', '#140a2a', '#0B0F14']} style={styles.container}>
      <SafeAreaView style={styles.safe}>

        <Text style={styles.title}>Focus Mode</Text>

        {/* Duration Selector */}
        <View style={styles.durationRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d.label}
              style={[
                styles.durationBtn,
                selectedDuration === d.minutes && styles.durationBtnActive,
              ]}
              onPress={() => selectDuration(d.minutes)}
              disabled={isRunning}
            >
              <Text style={styles.durationEmoji}>{d.emoji}</Text>
              <Text
                style={[
                  styles.durationText,
                  selectedDuration === d.minutes && styles.durationTextActive,
                ]}
              >
                {d.label} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer Ring */}
        <View style={styles.timerContainer}>
          <CircularTimer
            progress={progress}
            timeLeft={timeLeft}
            color={adhdMode ? Colors.teal : Colors.primary}
          />
        </View>

        {/* ADHD Mode Toggle */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>ADHD Mode</Text>
            <Text style={styles.toggleSub}>Shorter bursts, more breaks</Text>
          </View>
          <Switch
            value={adhdMode}
            onValueChange={toggleAdhdMode}
            trackColor={{ false: Colors.cardBorder, true: Colors.teal }}
            thumbColor={adhdMode ? Colors.teal : Colors.textSecondary}
          />
        </View>

        {/* Deep Work Score */}
        {isRunning && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Deep Work Score</Text>
            <Text style={styles.scoreValue}>{Math.round(progress * 100)}%</Text>
          </View>
        )}

        {/* Main Action Button */}
        <TouchableOpacity
          style={[styles.actionBtn, isRunning && styles.actionBtnStop]}
          onPress={isRunning ? handleStop : handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>
            {isRunning ? '⏹ Stop Session' : '▶ Start Session'}
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, alignItems: 'center', padding: Spacing.lg },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  durationRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  durationBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  durationBtnActive: {
    backgroundColor: `${Colors.primary}30`,
    borderColor: Colors.primary,
  },
  durationEmoji: { fontSize: 18 },
  durationText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  durationTextActive: { color: Colors.accent, fontWeight: '600' },
  timerContainer: { marginBottom: Spacing.xxl },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.md,
  },
  toggleLabel: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '600' },
  toggleSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  scoreLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  scoreValue: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: '700' },
  actionBtn: {
    width: '100%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  actionBtnStop: { backgroundColor: Colors.error },
  actionText: { fontSize: FontSize.md, fontWeight: '700', color: 'white', letterSpacing: 1 },
});