import { serializeOptions, deserializeOptions, getOptionsFromUrl } from '../urlOptions';
import { DEFAULT_OPTIONS } from '../defaultOptions';

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
});
