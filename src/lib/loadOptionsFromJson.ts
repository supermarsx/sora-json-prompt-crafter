import { DEFAULT_OPTIONS } from './defaultOptions';
import type { SoraOptions } from './soraOptions';
import { OPTION_FLAG_MAP } from './optionFlagMap';
import { isValidOptions } from './validateOptions';

/**
 * Parses a JSON string of saved Sora options into a typed object.
 *
 * The raw JSON is parsed, then sanitized by removing prototype-related keys
 * (`__proto__`, `constructor`, `prototype`) to guard against prototype
 * pollution. The resulting plain object is validated with `isValidOptions` and
 * normalized: composition rule identifiers have underscores replaced with
 * spaces and option flags are inferred from present keys. The sanitized input
 * is merged with `DEFAULT_OPTIONS` and the derived flags to produce the final
 * options.
 *
 * @param json - JSON string previously produced by the application.
 * @returns A complete `SoraOptions` object when valid, otherwise `null`.
 */
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
