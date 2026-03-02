'use client';

/**
 * DataTable -- Generic sortable, paginated table.
 * Provenance: design.md Section 3.2 (U1 -- same scenario, same pattern)
 * TODO: Implement column definitions, sorting, row rendering.
 */

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
}: DataTableProps<T>) {
  if (isLoading) {
    return <div className="animate-pulse rounded-lg bg-gray-100 p-8" />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
