import { isValidOptions } from '../validateOptions';

describe('isValidOptions', () => {
  test('accepts partial valid options', () => {
    expect(isValidOptions({ prompt: 'hi', steps: 10 })).toBe(true);
  });

  test('rejects unknown keys', () => {
    expect(isValidOptions({ foo: 'bar' })).toBe(false);
  });

  test('rejects wrong types', () => {
    expect(isValidOptions({ steps: 'ten' })).toBe(false);
  });

  test('accepts arrays, null, and nested objects', () => {
    const result = isValidOptions({
      special_effects: ['glow'],
      seed: null,
      style_preset: { category: 'foo', style: 'bar' },
    });
    expect(result).toBe(true);
  });

  test('rejects invalid keys or incorrect value types', () => {
    expect(isValidOptions({ unknown: 1 })).toBe(false);
    expect(isValidOptions({ special_effects: 'glow' })).toBe(false);
    expect(
      isValidOptions({
        style_preset: { category: 1 as unknown as string, style: 'bar' },
      }),
    ).toBe(false);
  });
});
