// Source: design.md screen: S041 -- Notification row
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NotificationDTO } from '../../../types/api';

interface Props {
  notification: NotificationDTO;
  onPress: () => void;
}

export function NotificationItem({ notification, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, !notification.read_at && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.time}>{notification.created_at}</Text>
      </View>
      {!notification.read_at && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  unread: { backgroundColor: '#F9FAFB' },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  body: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  time: { fontSize: 12, color: '#D1D5DB' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginLeft: 12,
  },
});

export default NotificationItem;
