// Source: design.md Section 4.1 -- Horizontal FlatList stub
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export function RecommendationCarousel() {
  // TODO: Fetch recommendations from GET /api/v1/recommendations
  const data: any[] = [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended for You</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.scenario?.title ?? 'Scenario'}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No recommendations yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  title: { fontSize: 18, fontWeight: '600', paddingHorizontal: 16, marginBottom: 12 },
  card: {
    width: 200,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
    justifyContent: 'center',
  },
  empty: { paddingHorizontal: 16, color: '#9CA3AF' },
});

export default RecommendationCarousel;
