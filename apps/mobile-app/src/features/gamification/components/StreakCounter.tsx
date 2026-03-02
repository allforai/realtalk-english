// Source: design.md screen: S012 -- Large animated streak number
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.count}>{currentStreak}</Text>
      <Text style={styles.label}>Day Streak</Text>
      <Text style={styles.record}>Longest: {longestStreak} days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 24 },
  count: { fontSize: 64, fontWeight: 'bold', color: '#F59E0B' },
  label: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 4 },
  record: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
});

export default StreakCounter;
