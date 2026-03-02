// Source: design.md screen: S001 -- FlatList + FilterBar
import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterBar } from '../components/FilterBar';
import { ScenarioListItem } from '../components/ScenarioListItem';
import { useScenarios } from '../hooks/useScenarios';

export function ScenarioListScreen() {
  const { scenarios, isLoading, isRefreshing, hasMore, refresh, loadMore } =
    useScenarios();
  const [filters, setFilters] = useState({ difficulty: undefined, tag_id: undefined });

  return (
    <SafeAreaView style={styles.container}>
      <FilterBar filters={filters} onFilterChange={setFilters} />
      <FlatList
        data={scenarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ScenarioListItem scenario={item} />}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No scenarios found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { marginTop: 48 },
  empty: { alignItems: 'center', marginTop: 48 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#374151' },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
});

export default ScenarioListScreen;
