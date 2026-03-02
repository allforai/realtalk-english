// Source: design.md Section 7.2 -- expo-notifications (registerForPushNotifications)
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiClient } from './apiClient';

// Configure notification behavior for foreground display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // Show in-app banner
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications.
 *
 * Flow:
 * 1. Check existing permission
 * 2. Request permission if not granted
 * 3. Get Expo push token
 * 4. Send token to backend via PUT /api/v1/notifications/settings
 *
 * @returns The Expo push token string, or null if permission denied
 */
export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id', // TODO: Replace with actual Expo project ID
  });

  // Send token to backend
  await apiClient.put('/notifications/settings', {
    expo_push_token: tokenData.data,
    platform: Platform.OS,
  });

  return tokenData.data;
}

/**
 * Set up notification response listener for deep linking.
 * Call this once during app initialization.
 */
export function setupNotificationListeners(
  onNotificationTap: (data: Record<string, unknown>) => void,
): () => void {
  // Handle notification taps (foreground + background)
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      onNotificationTap(data as Record<string, unknown>);
    },
  );

  return () => subscription.remove();
}
