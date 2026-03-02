'use client';

/**
 * DialogueNodeItem -- Single node: role selector, content textarea, hints.
 * Provenance: design.md Section 3.3, REQ-001
 * TODO: Role toggle (user/ai), content textarea, optional hints field, drag handle.
 */

import type { DialogueNode } from '@/types/api';

interface DialogueNodeItemProps {
  node: DialogueNode;
  index: number;
  onChange: (index: number, node: DialogueNode) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export default function DialogueNodeItem({
  node,
  index,
  onChange,
  onRemove,
  disabled,
}: DialogueNodeItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
        {index + 1}
      </span>
      <div className="flex-1 text-sm text-gray-500">
        TODO: [{node.role}] {node.content.slice(0, 50)}...
        {onChange && onRemove && disabled !== undefined && null}
      </div>
    </div>
  );
}
