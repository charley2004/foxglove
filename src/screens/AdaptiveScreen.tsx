import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { fetchWeather, WeatherData } from '../services/WeatherService';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { getTimeOfDayPhase } from '../utils/timeUtils';

// Demo coordinates — replace with expo-location for real GPS in V2
const DEMO_LAT = 51.5074;
const DEMO_LON = -0.1278;

export function AdaptiveScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { startSession, stopSession } = useAudioEngine();
  const timePhase = getTimeOfDayPhase();

  const phaseEmojis = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
  };

  useEffect(() => {
    fetchWeather(DEMO_LAT, DEMO_LON).then((w) => {
      setWeather(w);
      setLoading(false);
    });
  }, []);

  const handleToggle = async () => {
    if (isPlaying) {
      await stopSession();
      setIsPlaying(false);
    } else {
      await startSession('adaptive', weather?.condition);
      setIsPlaying(true);
    }
  };

  return (
    <LinearGradient colors={['#0B0F14', '#0a0a1e', '#0B0F14']} style={styles.container}>
      <SafeAreaView style={styles.safe}>

        <Text style={styles.title}>Adaptive Mode</Text>
        <Text style={styles.subtitle}>Sound adapts to your world</Text>

        {/* Time of Day Card */}
        <View style={styles.card}>
          <Text style={styles.cardEmoji}>{phaseEmojis[timePhase]}</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>
              {timePhase.charAt(0).toUpperCase() + timePhase.slice(1)} Mode
            </Text>
            <Text style={styles.cardSub}>
              {timePhase === 'morning' ? 'Higher clarity tones' :
               timePhase === 'night' ? 'Soft, low-frequency sounds' :
               'Balanced focus tones'}
            </Text>
          </View>
        </View>

        {/* Weather Card */}
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color={Colors.accent} />
          ) : weather ? (
            <>
              <Text style={styles.cardEmoji}>
                {weather.condition === 'Rain' ? '🌧️' :
                 weather.condition === 'Clear' ? '☀️' : '⛅'}
              </Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>
                  {weather.condition} · {weather.temp}°C
                </Text>
                <Text style={styles.cardSub}>
                  {weather.condition === 'Rain'
                    ? 'Rain layer added'
                    : 'Clear ambient tones'}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.cardSub}>Weather unavailable — using defaults</Text>
          )}
        </View>

        {/* Active Layers */}
        <View style={styles.layersCard}>
          <Text style={styles.layersTitle}>ACTIVE SOUND LAYERS</Text>
          <View style={styles.layerRow}>
            <View style={[styles.layerDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.layerText}>Base Layer — Focus drone</Text>
          </View>
          <View style={styles.layerRow}>
            <View style={[styles.layerDot, { backgroundColor: Colors.accent }]} />
            <Text style={styles.layerText}>Ambient — {timePhase} tones</Text>
          </View>
          {weather?.condition === 'Rain' && (
            <View style={styles.layerRow}>
              <View style={[styles.layerDot, { backgroundColor: Colors.teal }]} />
              <Text style={styles.layerText}>Weather — Rain layer</Text>
            </View>
          )}
        </View>

        {/* Play Button */}
        <TouchableOpacity
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.playText}>
            {isPlaying ? '⏹ Stop Adaptive Engine' : '▶ Start Adaptive Sound'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          V2: AI will generate procedural audio in real-time based on biometrics + environment
        </Text>

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
  subtitle: { fontSize: FontSize.sm, color: Colors.accent, letterSpacing: 1, marginBottom: Spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardEmoji: { fontSize: 36 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  cardSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  layersCard: {
    width: '100%',
    backgroundColor: `${Colors.primary}15`,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  layersTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: Spacing.md,
    letterSpacing: 2,
  },
  layerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  layerDot: { width: 8, height: 8, borderRadius: 4 },
  layerText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  playBtn: {
    width: '100%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  playBtnActive: { backgroundColor: Colors.error },
  playText: { fontSize: FontSize.md, fontWeight: '700', color: 'white', letterSpacing: 1 },
  note: {
    fontSize: FontSize.xs,
    color: `${Colors.textSecondary}60`,
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontStyle: 'italic',
    paddingHorizontal: Spacing.lg,
  },
});