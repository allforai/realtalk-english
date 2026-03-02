// Source: design.md screen: S012 -- Badge grid (FlatList, numColumns=3)
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { AchievementBadge } from './AchievementBadge';
import { AchievementDTO } from '../../../types/api';

interface Props {
  achievements: AchievementDTO[];
}

export function AchievementGrid({ achievements }: Props) {
  return (
    <FlatList
      data={achievements}
      numColumns={3}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <AchievementBadge achievement={item} />
        </View>
      )}
      contentContainerStyle={styles.grid}
    />
  );
}

const styles = StyleSheet.create({
  grid: { paddingBottom: 24 },
  cell: { flex: 1, padding: 4 },
});

export default AchievementGrid;
