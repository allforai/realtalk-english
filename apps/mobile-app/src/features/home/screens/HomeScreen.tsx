// Source: design.md Section 4.1 -- Recommendations + quick actions + daily progress
import React from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecommendationCarousel } from '../components/RecommendationCarousel';
import { QuickActions } from '../components/QuickActions';
import { DailyProgress } from '../components/DailyProgress';

export function HomeScreen() {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    // TODO: Refresh data from API
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.header}>RealTalk English</Text>
        <RecommendationCarousel />
        <QuickActions />
        <DailyProgress />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 16 },
});

export default HomeScreen;
