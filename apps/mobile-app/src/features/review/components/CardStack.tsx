// Source: design.md screen: S007 -- Animated card stack
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReviewCard } from './ReviewCard';
import { ReviewCardDTO } from '../../../types/api';

interface Props {
  cards: ReviewCardDTO[];
  currentIndex: number;
}

export function CardStack({ cards, currentIndex }: Props) {
  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return null;
  }

  // TODO: Add Reanimated card swipe/flip animation
  return (
    <View style={styles.container}>
      <ReviewCard card={currentCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});

export default CardStack;
