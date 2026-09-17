// FoxgloveOrb.tsx — Using React Native Animated API
// Fixed Easing function calls

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const getBlobPath = (size: number): string => {
  const s = size / 2;
  return `
    M ${s},${s * 0.08}
    C ${s * 1.55},${s * 0.08} ${s * 1.95},${s * 0.45} ${s * 1.95},${s}
    C ${s * 1.95},${s * 1.52} ${s * 1.58},${s * 1.92} ${s},${s * 1.94}
    C ${s * 0.38},${s * 1.96} ${s * 0.05},${s * 1.55} ${s * 0.05},${s}
    C ${s * 0.05},${s * 0.42} ${s * 0.4},${s * 0.08} ${s},${s * 0.08}
    Z
  `;
};

const getFoxEarsPath = (size: number): string => {
  const s = size / 2;
  const earH = size * 0.18;
  const earW = size * 0.14;
  return `
    M ${s - earW * 1.8},${s * 0.25}
    L ${s - earW * 0.8},${s * 0.25 - earH}
    L ${s - earW * 0.1},${s * 0.3}
    M ${s + earW * 0.1},${s * 0.3}
    L ${s + earW * 0.8},${s * 0.25 - earH}
    L ${s + earW * 1.8},${s * 0.25}
  `;
};

interface Props {
  mode: 'focus' | 'sleep' | 'calm' | 'adaptive';
  isPlaying: boolean;
  size?: number;
  onPress?: () => void;
}

const MODE_COLORS = {
  focus:    { primary: '#7C3AED', secondary: '#A78BFA', glow: '#7C3AED' },
  sleep:    { primary: '#1E3A8A', secondary: '#3B82F6', glow: '#1E40AF' },
  calm:     { primary: '#0F766E', secondary: '#14B8A6', glow: '#0D9488' },
  adaptive: { primary: '#6D28D9', secondary: '#8B5CF6', glow: '#7C3AED' },
};

export function FoxgloveOrb({ mode, isPlaying, size = 280, onPress }: Props) {
  const colors = MODE_COLORS[mode];

  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const ring1Scale  = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale  = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const glowAnim    = useRef(new Animated.Value(0.3)).current;
  const rotateAnim  = useRef(new Animated.Value(0)).current;

  // Store animation refs so we can stop them on unmount
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    // Stop any previous animations
    animationsRef.current.forEach((a) => a.stop());
    animationsRef.current = [];

    const pulseDuration = isPlaying ? 1800 : 3500;

    // 1. Breathing pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: isPlaying ? 1.08 : 1.04,
          duration: pulseDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: pulseDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Particle ring 1
    const ring1 = Animated.loop(
      Animated.parallel([
        Animated.timing(ring1Scale, {
          toValue: 1.6,
          duration: 2500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(ring1Opacity, {
            toValue: 0.5,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 0,
            duration: 2100,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // 3. Particle ring 2 — starts delayed
    const ring2 = Animated.loop(
      Animated.parallel([
        Animated.timing(ring2Scale, {
          toValue: 1.9,
          duration: 3200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(ring2Opacity, {
            toValue: 0.35,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Opacity, {
            toValue: 0,
            duration: 2800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // 4. Slow rotation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 5. Glow pulse
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: isPlaying ? 0.65 : 0.35,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Start all animations
    pulse.start();
    ring1.start();
    glow.start();
    rotate.start();

    // Delay ring 2 slightly for layered effect
    setTimeout(() => ring2.start(), 1300);

    // Store refs for cleanup
    animationsRef.current = [pulse, ring1, ring2, glow, rotate];

    return () => {
      animationsRef.current.forEach((a) => a.stop());
    };
  }, [isPlaying, mode]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const blobPath = getBlobPath(size * 0.85);
  const foxEarsPath = getFoxEarsPath(size * 0.85);
  const offset = size * 0.075;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.container, { width: size, height: size }]}
    >
      {/* Particle Ring 2 — outermost */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.glow,
            opacity: ring2Opacity,
            transform: [{ scale: ring2Scale }],
          },
        ]}
      />

      {/* Particle Ring 1 */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 0.88,
            height: size * 0.88,
            borderRadius: size / 2,
            borderColor: colors.secondary,
            opacity: ring1Opacity,
            transform: [{ scale: ring1Scale }],
          },
        ]}
      />

      {/* Rotating glow layer */}
      <Animated.View
        style={[
          styles.glowLayer,
          {
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: size / 2,
            backgroundColor: colors.glow,
            opacity: glowAnim,
            transform: [{ rotate: spin }, { scale: pulseAnim }],
          },
        ]}
      />

      {/* Main orb SVG */}
      <Animated.View
        style={[
          styles.orbContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <RadialGradient id="orbGrad" cx="40%" cy="35%" r="65%">
              <Stop offset="0%"   stopColor={colors.secondary} stopOpacity="0.95" />
              <Stop offset="50%"  stopColor={colors.primary}   stopOpacity="0.88" />
              <Stop offset="100%" stopColor="#0B0F14"          stopOpacity="0.92" />
            </RadialGradient>
            <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%"   stopColor={colors.glow} stopOpacity="0.45" />
              <Stop offset="100%" stopColor={colors.glow} stopOpacity="0.0"  />
            </RadialGradient>
          </Defs>

          {/* Outer glow */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            fill="url(#glowGrad)"
          />

          {/* Blob body */}
          <Path
            d={blobPath}
            fill="url(#orbGrad)"
            transform={`translate(${offset}, ${offset})`}
          />

          {/* Fox ears */}
          <Path
            d={foxEarsPath}
            stroke={colors.secondary}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
            transform={`translate(${offset}, ${offset})`}
          />

          {/* Core highlight */}
          <Circle
            cx={size * 0.42}
            cy={size * 0.38}
            r={size * 0.09}
            fill="white"
            opacity="0.13"
          />

          {/* Secondary highlight */}
          <Circle
            cx={size * 0.55}
            cy={size * 0.44}
            r={size * 0.04}
            fill="white"
            opacity="0.07"
          />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  glowLayer: {
    position: 'absolute',
  },
  orbContainer: {
    position: 'absolute',
  },
});