// Source: design.md screen: S001 -- Difficulty/tag filters
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

interface FilterBarProps {
  filters: { difficulty?: string; tag_id?: string };
  onFilterChange: (filters: { difficulty?: string; tag_id?: string }) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.chip, !filters.difficulty && styles.chipActive]}
          onPress={() => onFilterChange({ ...filters, difficulty: undefined })}
        >
          <Text style={[styles.chipText, !filters.difficulty && styles.chipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, filters.difficulty === d && styles.chipActive]}
            onPress={() => onFilterChange({ ...filters, difficulty: d })}
          >
            <Text
              style={[
                styles.chipText,
                filters.difficulty === d && styles.chipTextActive,
              ]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginLeft: 12,
  },
  chipActive: { backgroundColor: '#4F46E5' },
  chipText: { fontSize: 14, color: '#374151' },
  chipTextActive: { color: '#fff' },
});

export default FilterBar;
