/**
 * KpiCard -- Metric card with value, delta, sparkline.
 * Provenance: design.md Section 3.2, REQ-005
 */

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  unit?: string;
  onSetAlert?: () => void;
}

export default function KpiCard({
  title,
  value,
  delta,
  unit,
  onSetAlert,
}: KpiCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {onSetAlert && (
          <button
            onClick={onSetAlert}
            className="text-gray-400 hover:text-gray-600"
            aria-label={`Set alert for ${title}`}
          >
            {/* TODO: replace with lucide Bell icon */}
            <span className="text-sm">bell</span>
          </button>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-gray-500">{unit}</span>}
      </p>
      {delta !== undefined && (
        <p
          className={`mt-1 text-sm font-medium ${
            delta >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)}% vs previous period
        </p>
      )}
      {/* TODO: sparkline chart placeholder */}
    </div>
  );
}
