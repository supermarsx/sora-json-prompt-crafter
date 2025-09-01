import {
  ACTION_LABELS_ENABLED,
  CURRENT_JSON,
  DARK_MODE,
  DARK_MODE_TOGGLE_VISIBLE,
  HEADER_BUTTONS_ENABLED,
  JSON_HISTORY,
  LOCALE,
  LOGO_ENABLED,
  SORA_TOOLS_ENABLED,
  TRACKING_ENABLED,
  SECTION_PRESETS,
} from './storage-keys';
/**
 * Safely retrieves a value from `localStorage`.
 *
 * @template T
 * @param {string} key - Storage key to read.
 * @param {T | null} [defaultValue=null] - Value returned when the key is missing or the read fails.
 * @param {boolean} [parse=false] - When true, parse the stored JSON into type `T`.
 * @returns {T | string | null} The stored value, the parsed object, or `defaultValue` on failure.
 */
export function safeGet<T = string>(
  key: string,
  defaultValue: T | null = null,
  parse = false,
): T | string | null {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    if (parse) return JSON.parse(value) as T;
    return value;
  } catch (err) {
    console.warn('safeGet failed', key, err);
    return defaultValue;
  }
}

/**
 * Safely stores a value in `localStorage`.
 *
 * @param {string} key - Storage key to set.
 * @param {unknown} value - The value to store.
 * @param {boolean} [stringify=false] - Whether to JSON stringify `value` before storing.
 * @returns {boolean} `true` if the value was stored, otherwise `false`.
 */
export function safeSet(
  key: string,
  value: unknown,
  stringify = false,
): boolean {
  if (!stringify && typeof value !== 'string') {
    console.warn(
      `safeSet: value for key "${key}" must be a string when stringify is false`,
    );
    return false;
  }
  try {
    const data = stringify ? JSON.stringify(value) : (value as string);
    localStorage.setItem(key, data);
    return true;
  } catch (e) {
    console.warn(`safeSet: failed for key "${key}"`, e);
    return false;
  }
}

/**
 * Safely removes a value from `localStorage`.
 *
 * @param {string} key - Storage key to remove.
 * @returns {boolean} `true` if the removal succeeded, otherwise `false`.
 */
export function safeRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`safeRemove: failed for key "${key}"`, e);
    return false;
  }
}

/**
 * Retrieves a JSON-parsed value from `localStorage`.
 *
 * @template T
 * @param {string} key - Storage key to read.
 * @param {T | null} [defaultValue=null] - Value returned when the key is missing or parsing fails.
 * @returns {T | null} Parsed value or `defaultValue` on failure.
 */
export function getJson<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return JSON.parse(value) as T;
  } catch (err) {
    console.warn('getJson failed', key, err);
    return defaultValue;
  }
}

/**
 * Stores a value in `localStorage` after JSON stringifying it.
 *
 * @template T
 * @param {string} key - Storage key to set.
 * @param {T} value - Value to stringify and store.
 * @returns {boolean} `true` if the value was stored, otherwise `false`.
 */
export function setJson<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`setJson: failed for key "${key}"`, err);
    return false;
  }
}

export interface SectionPreset<T = Record<string, unknown>> {
  name: string;
  values: T;
}

export type SectionPresets = Record<string, SectionPreset[]>;

/**
 * Retrieves all saved presets grouped by section from local storage.
 *
 * @returns A mapping of section keys to their associated presets.
 */
export function getSectionPresets(): SectionPresets {
  return getJson<SectionPresets>(SECTION_PRESETS, {}) ?? {};
}

/**
 * Saves or updates a preset for the specified section.
 *
 * @param section - Section key under which the preset should be stored.
 * @param preset - Preset details including name and values.
 * @returns The updated map of section presets.
 */
export function saveSectionPreset(
  section: string,
  preset: SectionPreset,
): SectionPresets {
  const presets = getSectionPresets();
  const sectionPresets = presets[section] ?? [];
  const filtered = sectionPresets.filter((p) => p.name !== preset.name);
  const updated = { ...presets, [section]: [...filtered, preset] };
  setJson(SECTION_PRESETS, updated);
  return updated;
}

/**
 * Removes a preset by name from the specified section.
 *
 * @param section - Section key containing the preset.
 * @param name - Name of the preset to remove.
 * @returns The updated map of section presets.
 */
export function removeSectionPreset(
  section: string,
  name: string,
): SectionPresets {
  const presets = getSectionPresets();
  const sectionPresets = presets[section] ?? [];
  const updated = {
    ...presets,
    [section]: sectionPresets.filter((p) => p.name !== name),
  };
  setJson(SECTION_PRESETS, updated);
  return updated;
}

const PREFERENCE_KEYS = [
  DARK_MODE,
  DARK_MODE_TOGGLE_VISIBLE,
  SORA_TOOLS_ENABLED,
  HEADER_BUTTONS_ENABLED,
  LOGO_ENABLED,
  ACTION_LABELS_ENABLED,
  TRACKING_ENABLED,
  LOCALE,
];

export interface AppData {
  currentJson: string | null;
  jsonHistory: unknown[];
  preferences: Record<string, unknown>;
  sectionPresets: SectionPresets;
}

/**
 * Exports all application data needed for backup or sharing.
 *
 * @returns An object containing the current JSON, history, preferences, and section presets.
 */
export function exportAppData(): AppData {
  const preferences: Record<string, unknown> = {};
  for (const key of PREFERENCE_KEYS) {
    const value = getJson<unknown>(key);
    if (value !== null) preferences[key] = value;
  }
  return {
    currentJson: safeGet<string>(CURRENT_JSON, null) as string | null,
    jsonHistory: getJson<unknown[]>(JSON_HISTORY, []) ?? [],
    preferences,
    sectionPresets: getSectionPresets(),
  };
}

/**
 * Imports application data previously exported via {@link exportAppData}.
 *
 * @param data - The exported data object to restore.
 */
export function importAppData(data: AppData) {
  if (!data || typeof data !== 'object') return;
  if (typeof data.currentJson === 'string') {
    safeSet(CURRENT_JSON, data.currentJson);
  }
  if (Array.isArray(data.jsonHistory)) {
    setJson(JSON_HISTORY, data.jsonHistory);
  }
  if (data.preferences && typeof data.preferences === 'object') {
    for (const [key, value] of Object.entries(data.preferences)) {
      setJson(key, value);
    }
  }
  if (data.sectionPresets && typeof data.sectionPresets === 'object') {
    setJson(SECTION_PRESETS, data.sectionPresets);
  }
}
