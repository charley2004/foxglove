// GlassCard.tsx — Glassmorphism card component
// Used everywhere in the UI. The blur + semi-transparent background
// creates the "frosted glass" effect that defines Foxglove's aesthetic.

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 20 }: Props) {
  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
      <View style={styles.inner}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  inner: {
    padding: Spacing.lg,
  },
});