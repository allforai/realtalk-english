'use client';

import { useState, useEffect } from 'react';

/**
 * DataTableSearch -- Debounced search input for tables.
 * Provenance: design.md Section 3.2, REQ-007 (300ms debounce)
 */

interface DataTableSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function DataTableSearch({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
}: DataTableSearchProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}
