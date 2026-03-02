// Source: design.md screen: S007 -- Card stack + rating buttons
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardStack } from '../components/CardStack';
import { RatingButtons } from '../components/RatingButtons';
import { CompletionSummary } from '../components/CompletionSummary';
import { useReview } from '../hooks/useReview';

export function ReviewScreen() {
  const {
    cards,
    currentIndex,
    isCompleted,
    isLoading,
    summary,
    rateCard,
  } = useReview();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (isCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <CompletionSummary summary={summary} />
      </SafeAreaView>
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtext}>No cards due for review today.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentIndex + 1} / {cards.length}
        </Text>
      </View>
      <CardStack cards={cards} currentIndex={currentIndex} />
      <RatingButtons onRate={rateCard} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { marginTop: 48 },
  header: { padding: 16, alignItems: 'center' },
  progress: { fontSize: 14, color: '#6B7280' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#9CA3AF' },
});

export default ReviewScreen;
