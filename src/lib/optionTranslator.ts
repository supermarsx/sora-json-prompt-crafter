import { TFunction } from 'i18next';

export const getOptionLabel = (
  option: string,
  mapping: Record<string, string>,
  t: TFunction,
) => {
  const key = mapping[option];
  return key ? t(key, { defaultValue: option }) : option;
};
