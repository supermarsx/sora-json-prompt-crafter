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
  CUSTOM_VALUES,
  PRESETS,
} from './storage-keys';
import {
  exportCurrentPresets,
  importCustomPresets,
  type CustomPresetData,
} from './presetLoader';
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

export type CustomValuesMap = Record<string, string[]>;

/**
 * Retrieves all custom option values grouped by their option key.
 */
export function getCustomValues(): CustomValuesMap {
  return getJson<CustomValuesMap>(CUSTOM_VALUES, {}) ?? {};
}

/**
 * Adds a custom value for the specified option key and persists it.
 *
 * @param optionKey - Identifier for the option type.
 * @param value - Custom value to store.
 * @returns Updated map of custom values.
 */
export function addCustomValue(
  optionKey: string,
  value: string,
): CustomValuesMap {
  const map = getCustomValues();
  const values = new Set(map[optionKey] ?? []);
  values.add(value);
  const updated = { ...map, [optionKey]: Array.from(values) };
  setJson(CUSTOM_VALUES, updated);
  return updated;
}

/**
 * Merges stored custom values for the given option key with a base list.
 *
 * @param optionKey - Identifier for the option type.
 * @param base - Base list of option strings.
 * @returns Combined array including any saved custom values.
 */
export function mergeCustomValues(
  optionKey: string,
  base: readonly string[],
): string[] {
  const map = getCustomValues();
  const custom = map[optionKey] ?? [];
  return [...base, ...custom];
}

/**
 * Replaces the entire custom values map in storage.
 *
 * @param map - Complete map of option keys to custom values.
 */
export function setCustomValues(map: CustomValuesMap): void {
  setJson(CUSTOM_VALUES, map);
}

/**
 * Removes a specific custom value for the given option key.
 *
 * @param optionKey - Identifier for the option type.
 * @param value - The custom value to remove.
 * @returns Updated map of custom values.
 */
export function removeCustomValue(
  optionKey: string,
  value: string,
): CustomValuesMap {
  const map = getCustomValues();
  const values = (map[optionKey] ?? []).filter((v) => v !== value);
  const updated = { ...map };
  if (values.length) {
    updated[optionKey] = values;
  } else {
    delete updated[optionKey];
  }
  setJson(CUSTOM_VALUES, updated);
  return updated;
}

/**
 * Updates an existing custom value for the given option key.
 *
 * @param optionKey - Identifier for the option type.
 * @param oldValue - The current value to replace.
 * @param newValue - New value to store.
 * @returns Updated map of custom values.
 */
export function updateCustomValue(
  optionKey: string,
  oldValue: string,
  newValue: string,
): CustomValuesMap {
  const map = getCustomValues();
  const values = map[optionKey] ?? [];
  const index = values.indexOf(oldValue);
  if (index !== -1) {
    values[index] = newValue;
  }
  const updated = { ...map, [optionKey]: Array.from(new Set(values)) };
  setJson(CUSTOM_VALUES, updated);
  return updated;
}

/**
 * Exports the current custom values map.
 */
export function exportCustomValues(): CustomValuesMap {
  return getCustomValues();
}

/**
 * Imports and stores a custom values map.
 *
 * @param map - Map of option keys to custom values.
 * @returns The stored custom values map.
 */
export function importCustomValues(map: CustomValuesMap): CustomValuesMap {
  setCustomValues(map);
  return map;
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
  presets: CustomPresetData;
  customValues: CustomValuesMap;
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
  const presets =
    getJson<CustomPresetData>(PRESETS, exportCurrentPresets()) ??
    exportCurrentPresets();
  return {
    currentJson: safeGet<string>(CURRENT_JSON, null) as string | null,
    jsonHistory: getJson<unknown[]>(JSON_HISTORY, []) ?? [],
    preferences,
    sectionPresets: getSectionPresets(),
    presets,
    customValues: getCustomValues(),
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
  if (data.presets && typeof data.presets === 'object') {
    setJson(PRESETS, data.presets);
    importCustomPresets(data.presets);
  }
  if (data.customValues && typeof data.customValues === 'object') {
    setCustomValues(data.customValues);
  }
}

/**
 * POST the current {@link AppData} to a remote endpoint.
 *
 * @param url - Destination URL expected to accept a JSON body.
 * @throws {Error} If the request fails or returns a non-OK status.
 */
export async function syncConfigToUrl(url: string): Promise<void> {
  const body = JSON.stringify(exportAppData());
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch (err) {
    throw new Error('Failed to sync config: ' + err);
  }

  if (!res.ok) {
    throw new Error(
      `Failed to sync config: HTTP ${res.status} ${res.statusText || ''}`.trim(),
    );
  }
}

/**
 * Fetch an {@link AppData} JSON bundle from a URL and import it.
 *
 * @param url - Endpoint returning {@link AppData} JSON.
 * @throws {Error} If the request fails, returns non-OK status, or invalid JSON.
 */
export async function loadConfigFromUrl(url: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error('Failed to load config: ' + err);
  }

  if (!res.ok) {
    throw new Error(
      `Failed to load config: HTTP ${res.status} ${res.statusText || ''}`.trim(),
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error('Failed to load config: invalid JSON: ' + err);
  }

  importAppData(json as AppData);
}
