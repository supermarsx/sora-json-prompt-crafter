import { DEFAULT_OPTIONS } from './defaultOptions';
import type { SoraOptions } from './soraOptions';
import { OPTION_FLAG_MAP } from './optionFlagMap';
import { isValidOptions } from './validateOptions';

export function loadOptionsFromJson(json: string): SoraOptions | null {
  try {
    const obj: Record<string, unknown> = JSON.parse(json);

    ['__proto__', 'constructor', 'prototype'].forEach((key) => {
      if (key in obj) delete obj[key];
    });

    if (!isValidOptions(obj)) {
      return null;
    }

    if (Array.isArray(obj.composition_rules)) {
      obj.composition_rules = obj.composition_rules.map((r: string) =>
        r.replace(/_/g, ' '),
      );
    }

    const enableMap = OPTION_FLAG_MAP;

    const flagUpdates: Partial<SoraOptions> = {};
    Object.keys(obj).forEach((key) => {
      const flag = enableMap[key as keyof typeof enableMap];
      if (flag) flagUpdates[flag as keyof SoraOptions] = true;
      if (key.startsWith('dnd_')) flagUpdates.use_dnd_section = true;
      if (key === 'width' || key === 'height')
        flagUpdates.use_dimensions = true;
    });

    return { ...DEFAULT_OPTIONS, ...(obj as Partial<SoraOptions>), ...flagUpdates };
  } catch (e) {
    console.error('Error parsing stored options:', e);
    return null;
  }
}
