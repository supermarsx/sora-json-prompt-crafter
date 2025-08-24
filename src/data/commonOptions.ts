/**
 * `COMMON_OPTION_PREFIXES` contains placeholder prefixes reused across select lists.
 */

/** Placeholder prefixes that can appear at the start of option lists. */
export const COMMON_OPTION_PREFIXES = [
  'default',
  'as is',
  'not defined',
  'keep original',
] as const;

/**
 * Union type representing the available common option prefixes.
 */
export type CommonOptionPrefix = (typeof COMMON_OPTION_PREFIXES)[number];
