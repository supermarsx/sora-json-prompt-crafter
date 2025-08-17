import { TFunction } from 'i18next';

/**
 * Returns the translated label for an option.
 *
 * @param {string} option - The option key to translate.
 * @param {Record<string, string>} mapping - Map of option values to translation keys.
 * @param {TFunction} t - i18next translation function.
 * @returns {string} Translated label or the original option if no translation key is found.
 */
export const getOptionLabel = (
  option: string,
  mapping: Record<string, string>,
  t: TFunction,
) => {
  const key = mapping[option];
  return key ? t(key, { defaultValue: option }) : option;
};
