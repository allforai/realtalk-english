/**
 * LoadingSkeleton -- Shimmer placeholder.
 * Provenance: design.md Section 3.2, Section 8 (UI States)
 */

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export default function LoadingSkeleton({
  className = 'h-4 w-full',
  count = 1,
}: LoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded bg-gray-200 ${className}`} />
      ))}
    </div>
  );
}
