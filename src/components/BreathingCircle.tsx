// BreathingCircle.tsx — Animated breathing guide for Calm mode
// Uses React Native's Animated API for the 4-7-8 breathing pattern:
// Inhale 4s → Hold 7s → Exhale 8s
// The circle expands on inhale, holds, then contracts on exhale.

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../constants/theme';

type Phase = 'inhale' | 'hold' | 'exhale';

const PHASES: { phase: Phase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4000, label: 'Breathe In' },
  { phase: 'hold', duration: 7000, label: 'Hold' },
  { phase: 'exhale', duration: 8000, label: 'Breathe Out' },
];

export function BreathingCircle() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    const { phase, duration } = currentPhase;

    const toValue = phase === 'inhale' ? 1 : phase === 'hold' ? 1 : 0.6;

    Animated.timing(scale, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [phaseIndex]);

  return (
    <View style={styles.container}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.outerGlow,
          { transform: [{ scale: Animated.multiply(scale, 1.3) }] },
        ]}
      />
      {/* Main breathing circle */}
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Text style={styles.phaseText}>{currentPhase.label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  outerGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.teal,
    opacity: 0.1,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${Colors.teal}30`,
    borderWidth: 2,
    borderColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    letterSpacing: 1,
  },
});