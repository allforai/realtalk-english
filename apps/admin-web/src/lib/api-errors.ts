/**
 * ERROR_MESSAGES -- Maps backend error codes to user-friendly messages.
 * Provenance: design.md Section 5.2
 */

export const ERROR_MESSAGES: Record<string, string> = {
  AUTH_001: 'Invalid email or password.',
  AUTH_002: 'Your session has expired. Please log in again.',
  AUTH_003: 'Your account has been suspended.',
  AUTH_004: 'You do not have permission to perform this action.',
  SCEN_002: 'Scenario must have at least 3 dialogue nodes.',
  SCEN_003: 'Scenario title is required.',
  SCEN_004: 'Difficulty level is required.',
  SCEN_005: 'Please provide a reason for rejection.',
  SCEN_006: 'Invalid status transition. The scenario may have already been reviewed.',
  USER_001: 'Ban confirmation is required.',
  USER_002: 'User not found.',
  CONFIG_001: 'Threshold value must be between 0.0 and 1.0.',
  GENERAL_001: 'An unexpected error occurred. Please try again.',
  GENERAL_002: 'Please fix the highlighted fields.',
};

/**
 * Get a user-friendly error message for a given error code.
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES['GENERAL_001'];
}
