// Source: design.md screen: S003 -- Pronunciation score display
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScoreBar } from './ScoreBar';
import { PronunciationResult } from '../../../types/api';

interface Props {
  result: PronunciationResult;
}

export function PronunciationCard({ result }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pronunciation</Text>
      <ScoreBar label="Accuracy" score={result.accuracy} />
      <ScoreBar label="Fluency" score={result.fluency} />
      <ScoreBar label="Completeness" score={result.completeness} />
      {result.prosody !== undefined && (
        <ScoreBar label="Prosody" score={result.prosody} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#166534' },
});

export default PronunciationCard;
