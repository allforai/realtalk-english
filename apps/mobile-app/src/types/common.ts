// Shared utility types

/**
 * Make all properties of T optional except for K.
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Extract the resolved value type from a Promise.
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Generic loading state wrapper.
 */
export interface LoadingState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Pagination params.
 */
export interface PaginationParams {
  page: number;
  size: number;
}

/**
 * Generic paginated list.
 */
export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}

/**
 * ID type alias.
 */
export type ID = string;
