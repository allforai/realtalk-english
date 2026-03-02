// Source: design.md screen: S003 -- Dots animation stub
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TypingIndicator() {
  // TODO: Animate dots using Reanimated
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.dots}>...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'flex-start', marginVertical: 4 },
  bubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dots: { fontSize: 20, color: '#9CA3AF', letterSpacing: 4 },
});

export default TypingIndicator;
