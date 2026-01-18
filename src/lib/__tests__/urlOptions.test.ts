import {
  serializeOptions,
  deserializeOptions,
  getOptionsFromUrl,
} from '../urlOptions';
import { DEFAULT_OPTIONS } from '../defaultOptions';
import { compressToEncodedURIComponent } from 'lz-string';

describe('urlOptions', () => {
  test('round trips via serialization', () => {
    const opts = { ...DEFAULT_OPTIONS, prompt: 'hello world' };
    const encoded = serializeOptions(opts);
    const decoded = deserializeOptions(encoded);
    expect(decoded).toEqual(opts);
  });

  test('parses options from URL hash', () => {
    const opts = { ...DEFAULT_OPTIONS, prompt: 'hash test' };
    const encoded = serializeOptions(opts);
    const url = `https://example.com/#${encoded}`;
    const parsed = getOptionsFromUrl(url);
    expect(parsed).toEqual(opts);
  });

  test('parses options from query param', () => {
    const opts = { ...DEFAULT_OPTIONS, prompt: 'query test' };
    const encoded = serializeOptions(opts);
    const url = `https://example.com/?o=${encoded}`;
    const parsed = getOptionsFromUrl(url);
    expect(parsed).toEqual(opts);
  });

  test('returns null for invalid compressed strings', () => {
    expect(deserializeOptions('not-valid')).toBeNull();
    const badJson = compressToEncodedURIComponent('not json');
    expect(deserializeOptions(badJson)).toBeNull();
  });

  test('strips prototype pollution keys', () => {
    const maliciousJson =
      '{"__proto__":{"polluted":"yes"},"constructor":{"evil":true},"prototype":{"bad":1},"prompt":"safe"}';
    const encoded = compressToEncodedURIComponent(maliciousJson);
    const decoded = deserializeOptions(encoded);
    expect(decoded).toEqual({ prompt: 'safe' });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  test('getOptionsFromUrl handles malformed URLs', () => {
    expect(getOptionsFromUrl('notaurl')).toBeNull();
    expect(getOptionsFromUrl('https://example.com/#invalid')).toBeNull();
    expect(getOptionsFromUrl('https://example.com/?o=invalid')).toBeNull();
  });
});
