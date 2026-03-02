'use client';

/**
 * ScenarioPreview -- Read-only chat-bubble preview of dialogue flow.
 * Provenance: design.md Section 3.3, REQ-001, REQ-003
 * TODO: Render dialogue nodes as alternating chat bubbles.
 */

import type { DialogueNode } from '@/types/api';

interface ScenarioPreviewProps {
  title: string;
  nodes: DialogueNode[];
}

export default function ScenarioPreview({ title, nodes }: ScenarioPreviewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">
        {nodes.map((node, i) => (
          <div
            key={i}
            className={`flex ${node.role === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                node.role === 'ai'
                  ? 'bg-white text-gray-800 border border-gray-200'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {node.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
