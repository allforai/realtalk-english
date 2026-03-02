// Source: design.md Section 4.1 -- Action buttons stub
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function QuickActions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionText}>Continue Learning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionText}>Start New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionText}>Review Due</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  action: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionText: { fontSize: 13, fontWeight: '500', color: '#4F46E5', textAlign: 'center' },
});

export default QuickActions;
