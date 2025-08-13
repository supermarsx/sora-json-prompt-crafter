export const COMMON_OPTION_PREFIXES = [
  'default',
  'as is',
  'not defined',
  'keep original',
] as const;

export type CommonOptionPrefix = (typeof COMMON_OPTION_PREFIXES)[number];
