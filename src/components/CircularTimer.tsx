// CircularTimer.tsx — Animated SVG progress ring for focus sessions
// The ring fills clockwise as the session progresses.
// Uses react-native-svg for crisp rendering at all sizes.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, FontSize } from '../constants/theme';
import { formatTime } from '../utils/timeUtils';

interface Props {
  progress: number;   // 0–1
  timeLeft: number;   // seconds
  size?: number;
  color?: string;
}

export function CircularTimer({ progress, timeLeft, size = 220, color = Colors.primary }: Props) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.card}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Time display in center */}
      <View style={[styles.center, { width: size, height: size }]}>
        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.label}>remaining</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
});