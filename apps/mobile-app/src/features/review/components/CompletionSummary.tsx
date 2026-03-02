// Source: design.md screen: S007 -- Done screen (stats + confetti + next review)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReviewSummary } from '../../../types/api';

interface Props {
  summary: ReviewSummary | null;
}

export function CompletionSummary({ summary }: Props) {
  return (
    <View style={styles.container}>
      {/* TODO: Add confetti animation via Lottie */}
      <Text style={styles.title}>All Done!</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{summary?.reviewed ?? 0}</Text>
          <Text style={styles.statLabel}>Reviewed</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {summary?.retention_rate ? `${Math.round(summary.retention_rate * 100)}%` : '--'}
          </Text>
          <Text style={styles.statLabel}>Retention</Text>
        </View>
      </View>
      {summary?.next_due_at && (
        <Text style={styles.nextReview}>
          Next review: {summary.next_due_at}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#10B981', marginBottom: 32 },
  stats: { flexDirection: 'row', gap: 48 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 36, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  nextReview: { fontSize: 14, color: '#9CA3AF', marginTop: 32 },
});

export default CompletionSummary;
