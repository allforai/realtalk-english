// Source: design.md Section 6.2 -- PendingAction queue with AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

const QUEUE_KEY = '@pending_actions';
const MAX_RETRIES = 3;

export interface PendingAction {
  id: string;
  type: 'rate_card' | 'mark_notification_read';
  endpoint: string;
  method: 'POST' | 'PATCH';
  body: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
}

/**
 * Add an action to the offline queue.
 * Called when a network request fails due to connectivity.
 */
export async function enqueueAction(
  action: Omit<PendingAction, 'id' | 'createdAt' | 'retryCount'>,
): Promise<void> {
  const queue = await getQueue();
  const newAction: PendingAction = {
    ...action,
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
    retryCount: 0,
  };
  queue.push(newAction);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Get all pending actions from the queue.
 */
export async function getQueue(): Promise<PendingAction[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PendingAction[];
  } catch {
    return [];
  }
}

/**
 * Drain the offline queue.
 * Called on network restore (via NetInfo listener).
 *
 * 1. Read @pending_actions from AsyncStorage
 * 2. Execute each action in order
 * 3. Remove successful actions
 * 4. Retry failed actions (max 3 retries)
 */
export async function drainQueue(): Promise<void> {
  const queue = await getQueue();
  if (queue.length === 0) return;

  const remaining: PendingAction[] = [];

  for (const action of queue) {
    try {
      if (action.method === 'POST') {
        await apiClient.post(action.endpoint, action.body);
      } else if (action.method === 'PATCH') {
        await apiClient.patch(action.endpoint, action.body);
      }
      // Success -- action removed from queue
    } catch {
      if (action.retryCount < MAX_RETRIES) {
        remaining.push({ ...action, retryCount: action.retryCount + 1 });
      }
      // Exceeded max retries -- drop the action
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}
