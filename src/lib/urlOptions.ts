import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { SoraOptions } from './soraOptions';
import { isValidOptions } from './validateOptions';

/**
 * Serializes a {@link SoraOptions} object to a URL-safe encoded string.
 *
 * @param options - The options object to serialize.
 * @returns The compressed and encoded string. Returns an empty string if
 *   serialization fails. Errors are logged to the console.
 */
export function serializeOptions(options: SoraOptions): string {
  try {
    return compressToEncodedURIComponent(JSON.stringify(options));
  } catch (e) {
    console.error('serializeOptions failed', e);
    return '';
  }
}

/**
 * Deserializes an encoded string produced by {@link serializeOptions}.
 *
 * @param encoded - The encoded options string to decode.
 * @returns The decoded {@link SoraOptions} object, or `null` if decoding or
 *   validation fails. Errors are logged to the console.
 */
export function deserializeOptions(encoded: string): SoraOptions | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const obj = JSON.parse(json);
    ['__proto__', 'constructor', 'prototype'].forEach((k) => {
      if (k in obj) delete obj[k as keyof typeof obj];
    });
    if (!isValidOptions(obj)) return null;
    return obj as SoraOptions;
  } catch (e) {
    console.error('deserializeOptions failed', e);
    return null;
  }
}

/**
 * Extracts serialized options from a URL and returns the decoded result.
 *
 * @param url - The URL to parse. Defaults to `window.location.href`.
 * @returns The decoded {@link SoraOptions} object, or `null` if the URL does
 *   not contain valid serialized options or parsing fails. Errors are logged
 *   to the console.
 */
export function getOptionsFromUrl(url: string = window.location.href): SoraOptions | null {
  try {
    const u = new URL(url);
    if (u.hash) {
      const hash = u.hash.slice(1);
      const parsed = deserializeOptions(hash);
      if (parsed) return parsed;
    }
    const param = u.searchParams.get('o');
    if (param) return deserializeOptions(param);
    return null;
  } catch (e) {
    console.error('getOptionsFromUrl failed', e);
    return null;
  }
}
