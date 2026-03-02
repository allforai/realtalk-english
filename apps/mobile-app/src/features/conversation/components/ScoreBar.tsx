// Source: design.md screen: S003, S004 -- Score bars
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  score: number; // 0-100
}

export function ScoreBar({ label, score }: Props) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const barColor =
    clampedScore >= 80 ? '#10B981' : clampedScore >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.score}>{clampedScore}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${clampedScore}%`, backgroundColor: barColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 13, color: '#6B7280' },
  score: { fontSize: 13, fontWeight: '600', color: '#374151' },
  track: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
});

export default ScoreBar;
