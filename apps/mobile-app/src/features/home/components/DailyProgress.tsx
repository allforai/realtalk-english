// Source: design.md Section 4.1 -- Progress stats stub
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function DailyProgress() {
  // TODO: Fetch from GET /api/v1/streaks/me and GET /api/v1/reviews/summary
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Progress</Text>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Conversations</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#4F46E5' },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },
});

export default DailyProgress;
