// Source: design.md screen: S007 -- Again/Hard/Good/Easy (rating 1-4)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RATINGS = [
  { value: 1, label: 'Again', color: '#EF4444' },
  { value: 2, label: 'Hard', color: '#F59E0B' },
  { value: 3, label: 'Good', color: '#10B981' },
  { value: 4, label: 'Easy', color: '#3B82F6' },
] as const;

interface Props {
  onRate: (rating: 1 | 2 | 3 | 4) => void;
}

export function RatingButtons({ onRate }: Props) {
  return (
    <View style={styles.container}>
      {RATINGS.map((r) => (
        <TouchableOpacity
          key={r.value}
          style={[styles.button, { backgroundColor: r.color }]}
          onPress={() => onRate(r.value)}
        >
          <Text style={styles.label}>{r.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 72,
    alignItems: 'center',
  },
  label: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

export default RatingButtons;
