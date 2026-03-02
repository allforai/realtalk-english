// Source: design.md screen: S012 -- Streak state management
import { useState, useCallback, useEffect } from 'react';
import { streakService } from '../services/streakService';
import { StreakDTO } from '../../../types/api';

interface UseStreakReturn {
  streak: StreakDTO | null;
  isLoading: boolean;
  restoreStreak: () => Promise<void>;
}

export function useStreak(): UseStreakReturn {
  const [streak, setStreak] = useState<StreakDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    streakService
      .getCurrentStreak()
      .then(setStreak)
      .catch(() => {
        // TODO: Load from cache
      })
      .finally(() => setIsLoading(false));
  }, []);

  const restoreStreak = useCallback(async () => {
    try {
      await streakService.restoreStreak();
      // Refresh streak data
      const updated = await streakService.getCurrentStreak();
      setStreak(updated);
    } catch {
      // TODO: Handle error
    }
  }, []);

  return { streak, isLoading, restoreStreak };
}
