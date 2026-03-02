// Source: design.md screen: S012 -- Restore streak CTA
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onPress: () => void;
}

export function RestoreStreakButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Restore Streak</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  text: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

export default RestoreStreakButton;
