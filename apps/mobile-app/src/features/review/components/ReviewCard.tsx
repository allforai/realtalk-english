// Source: design.md screen: S007 -- Flip card (front: word, back: definition + example)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ReviewCardDTO } from '../../../types/api';

interface Props {
  card: ReviewCardDTO;
}

export function ReviewCard({ card }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setIsFlipped(!isFlipped)}
      activeOpacity={0.9}
    >
      {isFlipped ? (
        <View style={styles.back}>
          <Text style={styles.definition}>{card.vocabulary.definition}</Text>
          <Text style={styles.example}>{card.vocabulary.example}</Text>
          <Text style={styles.hint}>Tap to flip back</Text>
        </View>
      ) : (
        <View style={styles.front}>
          <Text style={styles.word}>{card.vocabulary.word}</Text>
          <Text style={styles.hint}>Tap to reveal</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  front: { alignItems: 'center' },
  back: { alignItems: 'center' },
  word: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
  definition: { fontSize: 18, color: '#374151', textAlign: 'center', marginBottom: 16 },
  example: { fontSize: 15, color: '#6B7280', fontStyle: 'italic', textAlign: 'center' },
  hint: { fontSize: 12, color: '#D1D5DB', marginTop: 24 },
});

export default ReviewCard;
