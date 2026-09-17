import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';

const GOALS = [
  { id: 'focus', emoji: '🎯', title: 'Deep Focus', subtitle: 'Work, study, build' },
  { id: 'sleep', emoji: '🌙', title: 'Better Sleep', subtitle: 'Rest and restore' },
  { id: 'relax', emoji: '🌿', title: 'Calm Mind', subtitle: 'Stress relief' },
];

export function OnboardingScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const setGoal = useAppStore((s) => s.setGoal);

  const handleContinue = () => {
    if (!selected) return;
    setGoal(selected as any);
    navigation.replace('Main');
  };

  return (
    <LinearGradient colors={['#0B0F14', '#1a0a2e', '#0B0F14']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.logo}>🦊 Foxglove</Text>
          <Text style={styles.tagline}>Focus like a predator. Rest like a forest.</Text>
          <Text style={styles.question}>What's your primary goal?</Text>
        </View>

        <View style={styles.goals}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalCard, selected === goal.id && styles.goalCardSelected]}
              onPress={() => setSelected(goal.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{goal.emoji}</Text>
              <View style={styles.goalText}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
              </View>
              {selected === goal.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={styles.ctaText}>Begin Journey →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.lg },
  header: { alignItems: 'center', marginTop: Spacing.xxl, marginBottom: Spacing.xl },
  logo: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  tagline: { fontSize: FontSize.sm, color: Colors.accent, letterSpacing: 1, marginBottom: Spacing.xl },
  question: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.textPrimary },
  goals: { gap: Spacing.md, marginBottom: Spacing.xl },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: Spacing.md,
  },
  goalCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}20`,
  },
  emoji: { fontSize: 32 },
  goalText: { flex: 1 },
  goalTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  goalSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: 'white', fontSize: 13, fontWeight: '700' },
  cta: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: 'white', fontSize: FontSize.md, fontWeight: '700', letterSpacing: 1 },
});