// Source: design.md screen: S001 -- List item
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScenarioListItemDTO } from '../../../types/api';

interface Props {
  scenario: ScenarioListItemDTO;
  onPress?: () => void;
}

export function ScenarioListItem({ scenario, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{scenario.title}</Text>
        <View style={styles.row}>
          <Text style={styles.badge}>{scenario.difficulty}</Text>
          {scenario.tags?.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>
      {scenario.progress && (
        <Text style={styles.progress}>{scenario.progress}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 6 },
  badge: {
    fontSize: 12,
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tag: { fontSize: 12, color: '#6B7280' },
  progress: { fontSize: 12, color: '#10B981', alignSelf: 'center' },
});

export default ScenarioListItem;
