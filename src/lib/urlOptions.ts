import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { SoraOptions } from './soraOptions';
import { isValidOptions } from './validateOptions';

export function serializeOptions(options: SoraOptions): string {
  try {
    return compressToEncodedURIComponent(JSON.stringify(options));
  } catch (e) {
    console.error('serializeOptions failed', e);
    return '';
  }
}

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
