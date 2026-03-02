// Source: design.md Section 4.1 -- Card component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScenarioListItemDTO } from '../../../types/api';

interface Props {
  scenario: ScenarioListItemDTO;
  onPress?: () => void;
}

export function ScenarioCard({ scenario, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{scenario.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.difficulty}>{scenario.difficulty}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center' },
  difficulty: { fontSize: 12, color: '#6B7280' },
});

export default ScenarioCard;
