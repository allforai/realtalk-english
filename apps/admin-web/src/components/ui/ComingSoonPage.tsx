/**
 * ComingSoonPage -- Full-page "Coming Soon" placeholder for deferred features.
 * Provenance: design.md Section 3.2, Section 3 (DEFERRED requirements)
 */

interface ComingSoonPageProps {
  title: string;
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="mb-4 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
        Coming Soon
      </span>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        This feature is planned for a future release. Stay tuned for updates.
      </p>
    </div>
  );
}
