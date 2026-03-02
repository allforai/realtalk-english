'use client';

/**
 * UserLearningStats -- Conversations count, avg score, streak info.
 * Provenance: design.md Section 3.3, REQ-007
 * TODO: Display learning summary cards.
 */

interface LearingSummary {
  total_conversations: number;
  avg_score: number | null;
  current_streak: number;
  total_vocabulary: number;
}

interface UserLearningStatsProps {
  summary: LearingSummary;
}

export default function UserLearningStats({ summary }: UserLearningStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{summary.total_conversations}</p>
        <p className="text-xs text-gray-500">Conversations</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">
          {summary.avg_score?.toFixed(1) ?? '--'}
        </p>
        <p className="text-xs text-gray-500">Avg Score</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{summary.current_streak}</p>
        <p className="text-xs text-gray-500">Day Streak</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{summary.total_vocabulary}</p>
        <p className="text-xs text-gray-500">Vocabulary</p>
      </div>
    </div>
  );
}
