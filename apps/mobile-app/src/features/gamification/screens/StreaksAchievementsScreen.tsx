// Source: design.md screen: S012 -- Streak + achievements
import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StreakCounter } from '../components/StreakCounter';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { RestoreStreakButton } from '../components/RestoreStreakButton';
import { AchievementGrid } from '../components/AchievementGrid';
import { useStreak } from '../hooks/useStreak';
import { useAchievements } from '../hooks/useAchievements';

export function StreaksAchievementsScreen() {
  const { streak, isLoading: streakLoading, restoreStreak } = useStreak();
  const { achievements, isLoading: achievementsLoading } = useAchievements();

  const isLoading = streakLoading || achievementsLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Streak Section */}
        <StreakCounter
          currentStreak={streak?.current_streak ?? 0}
          longestStreak={streak?.longest_streak ?? 0}
        />
        <CalendarHeatmap />
        {streak?.can_restore && (
          <RestoreStreakButton onPress={restoreStreak} />
        )}

        {/* Achievement Section */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <AchievementGrid achievements={achievements} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { marginTop: 48 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 32, marginBottom: 16 },
});

export default StreaksAchievementsScreen;
