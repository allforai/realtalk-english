/**
 * Scenario form validation schema.
 * Provenance: design.md Section 6.2, REQ-001, SCEN_002/003/004
 */

import { z } from 'zod';

export const dialogueNodeSchema = z.object({
  sequence: z.number().int().min(1),
  role: z.enum(['user', 'ai']),
  content: z.string().min(1, 'Dialogue content is required'),
  hints: z.string().optional(),
});

export const scenarioSchema = z.object({
  title: z.string().min(1, 'Scenario title is required'),                  // SCEN_003
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Difficulty level is required',                        // SCEN_004
  }),
  target_roles: z.array(z.string()).min(1, 'Select at least one target role'),
  dialogue_nodes: z.array(dialogueNodeSchema).min(3, 'At least 3 dialogue nodes are required'), // SCEN_002
  tag_ids: z.array(z.string().uuid()).optional(),
  prompt_template_id: z.string().uuid().optional().nullable(),
});

export type ScenarioFormData = z.infer<typeof scenarioSchema>;
export type DialogueNodeFormData = z.infer<typeof dialogueNodeSchema>;
