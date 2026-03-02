// Source: design.md screen: S003 -- Phoneme breakdown (expandable, tap-to-hear)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Phoneme {
  phoneme: string;
  score: number;
}

interface Props {
  phonemes: Phoneme[];
}

export function PhonemeDetail({ phonemes }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phoneme Breakdown</Text>
      <View style={styles.grid}>
        {phonemes.map((p, idx) => (
          <View key={idx} style={styles.item}>
            <Text style={styles.phoneme}>{p.phoneme}</Text>
            <Text
              style={[
                styles.score,
                { color: p.score >= 80 ? '#10B981' : p.score >= 60 ? '#F59E0B' : '#EF4444' },
              ]}
            >
              {p.score}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  title: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    minWidth: 48,
  },
  phoneme: { fontSize: 16, fontWeight: '600' },
  score: { fontSize: 12, marginTop: 2 },
});

export default PhonemeDetail;
