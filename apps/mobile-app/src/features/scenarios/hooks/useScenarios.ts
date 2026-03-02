// Source: design.md screen: S001 -- API hooks for scenario list
import { useState, useCallback, useEffect } from 'react';
import { scenarioService } from '../services/scenarioService';
import { ScenarioListItemDTO } from '../../../types/api';

interface UseScenariosReturn {
  scenarios: ScenarioListItemDTO[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
}

export function useScenarios(): UseScenariosReturn {
  const [scenarios, setScenarios] = useState<ScenarioListItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchScenarios = useCallback(async (pageNum: number, reset: boolean) => {
    try {
      const result = await scenarioService.listScenarios({ page: pageNum, size: 20 });
      setScenarios((prev) => (reset ? result.items : [...prev, ...result.items]));
      setHasMore(result.items.length === 20);
    } catch {
      // TODO: Handle error, show from cache if available
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchScenarios(1, true);
  }, [fetchScenarios]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    fetchScenarios(1, true);
  }, [fetchScenarios]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchScenarios(nextPage, false);
  }, [page, fetchScenarios]);

  return { scenarios, isLoading, isRefreshing, hasMore, refresh, loadMore };
}
