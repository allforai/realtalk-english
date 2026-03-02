// Source: design.md screen: S012 -- Achievements state management
import { useState, useEffect } from 'react';
import { achievementService } from '../services/achievementService';
import { AchievementDTO } from '../../../types/api';

interface UseAchievementsReturn {
  achievements: AchievementDTO[];
  isLoading: boolean;
}

export function useAchievements(): UseAchievementsReturn {
  const [achievements, setAchievements] = useState<AchievementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    achievementService
      .listAchievements()
      .then(setAchievements)
      .catch(() => {
        // TODO: Load from cache
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { achievements, isLoading };
}
