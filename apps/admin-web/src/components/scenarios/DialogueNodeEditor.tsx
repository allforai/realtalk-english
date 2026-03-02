'use client';

/**
 * DialogueNodeEditor -- List of dialogue nodes with add/remove/reorder (dnd-kit).
 * Provenance: design.md Section 3.3, REQ-001
 * TODO: Integrate @dnd-kit/core + @dnd-kit/sortable for drag-and-drop reorder.
 */

import type { DialogueNode } from '@/types/api';

interface DialogueNodeEditorProps {
  nodes: DialogueNode[];
  onChange: (nodes: DialogueNode[]) => void;
  disabled?: boolean;
}

export default function DialogueNodeEditor({
  nodes,
  onChange,
  disabled,
}: DialogueNodeEditorProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      TODO: Drag-and-drop dialogue node editor ({nodes.length} nodes).
      {onChange && disabled !== undefined && null}
    </div>
  );
}
