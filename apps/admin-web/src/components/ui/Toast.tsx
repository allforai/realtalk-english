'use client';

/**
 * Toast -- Toast notification system (success/error/warning/info).
 * Provenance: design.md Section 3.2
 * TODO: Implement toast queue manager (or integrate with a library like sonner).
 */

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const typeClasses: Record<string, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function Toast({
  message,
  type = 'info',
  onClose,
}: ToastProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 shadow-sm ${typeClasses[type]}`}
    >
      <p className="text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-sm font-medium opacity-70 hover:opacity-100"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
