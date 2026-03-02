// Source: design.md screen: S012 -- Activity grid (last 30 days)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function CalendarHeatmap() {
  // TODO: Render last 30 days activity grid
  // Each day colored by activity intensity (light -> dark green)
  const days = Array.from({ length: 30 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity</Text>
      <View style={styles.grid}>
        {days.map((day) => (
          <View key={day} style={[styles.cell, styles.inactive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: { width: 20, height: 20, borderRadius: 4 },
  inactive: { backgroundColor: '#F3F4F6' },
  // TODO: Add active intensity levels
  // light: { backgroundColor: '#D1FAE5' },
  // medium: { backgroundColor: '#6EE7B7' },
  // high: { backgroundColor: '#10B981' },
});

export default CalendarHeatmap;
