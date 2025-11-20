/**
 * Animation and interaction constants
 */
export const ANIMATION = {
  /** Wheel delta threshold for page flip trigger */
  WHEEL_DELTA_THRESHOLD: 150,
  /** Duration of page flip animation in ms */
  PAGE_FLIP_DURATION: 600,
  /** Delay before scroll reset after page flip */
  SCROLL_RESET_DELAY: 50,
  /** Toast notification duration in ms */
  TOAST_DURATION: 3000,
  /** Debounce delay for search in ms */
  SEARCH_DEBOUNCE: 300,
} as const;

/**
 * Date range constants
 */
export const DATE_RANGE = {
  /** Number of past days to show */
  PAST_DAYS: 30,
  /** Number of future days to show */
  FUTURE_DAYS: 30,
} as const;

/**
 * Item depth limits
 */
export const LIMITS = {
  /** Maximum nesting depth for todos */
  MAX_TODO_DEPTH: 1,
  /** Maximum nesting depth for notes */
  MAX_NOTE_DEPTH: 2,
  /** Maximum number of undo/redo actions to keep */
  MAX_HISTORY_ACTIONS: 20,
} as const;

/**
 * Scroll detection thresholds
 */
export const SCROLL = {
  /** Pixel threshold for detecting bottom of scroll */
  BOTTOM_THRESHOLD: 50,
  /** Pixel threshold for boundary detection */
  BOUNDARY_THRESHOLD: 5,
} as const;
