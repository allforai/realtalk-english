// Source: design.md screen: S041 -- Notification list (modal presentation)
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationItem } from '../components/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';

interface Props {
  navigation: any;
}

export function NotificationCenterScreen({ navigation }: Props) {
  const { notifications, unreadCount, isLoading, markAsRead } = useNotifications();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => markAsRead(item.id)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  closeButton: { padding: 8 },
  closeText: { color: '#4F46E5', fontSize: 15, fontWeight: '500' },
  loader: { marginTop: 48 },
  empty: { alignItems: 'center', marginTop: 48 },
  emptyText: { fontSize: 16, color: '#9CA3AF' },
});

export default NotificationCenterScreen;
