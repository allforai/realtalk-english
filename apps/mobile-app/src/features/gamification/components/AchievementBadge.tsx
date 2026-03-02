// Source: design.md screen: S012 -- Single badge (icon, name, earned/locked state)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AchievementDTO } from '../../../types/api';

interface Props {
  achievement: AchievementDTO;
}

export function AchievementBadge({ achievement }: Props) {
  const isEarned = !!achievement.earned_at;

  return (
    <View style={[styles.container, !isEarned && styles.locked]}>
      {/* TODO: Replace with actual icon from icon_url */}
      <View style={[styles.icon, !isEarned && styles.iconLocked]}>
        <Text style={styles.iconText}>{achievement.name.charAt(0)}</Text>
      </View>
      <Text style={[styles.name, !isEarned && styles.nameLocked]} numberOfLines={2}>
        {achievement.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 8 },
  locked: { opacity: 0.5 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconLocked: { backgroundColor: '#F3F4F6' },
  iconText: { fontSize: 20, fontWeight: 'bold', color: '#4F46E5' },
  name: { fontSize: 12, textAlign: 'center', color: '#374151' },
  nameLocked: { color: '#9CA3AF' },
});

export default AchievementBadge;
