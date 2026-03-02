// Source: design.md screen: S041 -- Notification state management
import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { NotificationDTO } from '../../../types/api';

interface UseNotificationsReturn {
  notifications: NotificationDTO[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationService
      .listNotifications({ page: 1, size: 20 })
      .then(setNotifications)
      .catch(() => {
        // TODO: Load from cache
      })
      .finally(() => setIsLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
    } catch {
      // TODO: Queue for offline sync
    }
  }, []);

  return { notifications, unreadCount, isLoading, markAsRead };
}
