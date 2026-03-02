'use client';

/**
 * FormTextarea -- Label + Textarea + error + char count.
 * Provenance: design.md Section 3.2
 */

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
  disabled,
  rows = 3,
  maxLength,
}: FormTextareaProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
      />
      <div className="flex justify-between">
        {error && <p className="text-xs text-red-600">{error}</p>}
        {maxLength && (
          <p className="ml-auto text-xs text-gray-400">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
