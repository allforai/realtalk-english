// Source: design.md screen: S007 -- Review state management
import { useState, useCallback, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { ReviewCardDTO, ReviewSummary } from '../../../types/api';

interface UseReviewReturn {
  cards: ReviewCardDTO[];
  currentIndex: number;
  isCompleted: boolean;
  isLoading: boolean;
  summary: ReviewSummary | null;
  rateCard: (rating: 1 | 2 | 3 | 4) => void;
}

export function useReview(): UseReviewReturn {
  const [cards, setCards] = useState<ReviewCardDTO[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);

  useEffect(() => {
    reviewService
      .getTodayCards()
      .then(setCards)
      .catch(() => {
        // TODO: Load from cache
      })
      .finally(() => setIsLoading(false));
  }, []);

  const rateCard = useCallback(
    async (rating: 1 | 2 | 3 | 4) => {
      const card = cards[currentIndex];
      if (!card) return;

      try {
        await reviewService.rateCard(card.id, rating);
      } catch {
        // TODO: Queue for offline sync
      }

      if (currentIndex + 1 >= cards.length) {
        // All cards reviewed -- fetch summary
        reviewService
          .getSummary()
          .then(setSummary)
          .catch(() => {});
        setIsCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [cards, currentIndex],
  );

  return { cards, currentIndex, isCompleted, isLoading, summary, rateCard };
}
