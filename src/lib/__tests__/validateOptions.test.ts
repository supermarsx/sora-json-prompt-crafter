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

  test('accepts composition_rules arrays and style_preset objects', () => {
    expect(isValidOptions({ composition_rules: ['rule of thirds'] })).toBe(
      true,
    );
    expect(
      isValidOptions({ style_preset: { category: 'foo', style: 'bar' } }),
    ).toBe(true);
  });

  test('accepts null for optional fields', () => {
    expect(isValidOptions({ seed: null })).toBe(true);
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

  test('rejects invalid types for specific fields', () => {
    expect(
      isValidOptions({ composition_rules: {} as unknown as string[] }),
    ).toBe(false);
    expect(isValidOptions({ seed: '123' as unknown as number })).toBe(false);
  });

  test('rejects arrays for string fields', () => {
    expect(isValidOptions({ prompt: ['foo'] as unknown as string })).toBe(
      false,
    );
  });

  test('rejects objects for string fields', () => {
    expect(
      isValidOptions({ prompt: { text: 'foo' } as unknown as string }),
    ).toBe(false);
  });

  test('rejects null for non-nullable fields', () => {
    expect(isValidOptions({ prompt: null as unknown as string })).toBe(false);
  });

  test('rejects unknown value types', () => {
    // Symbol is not supported by the schema and should fail validation
    expect(isValidOptions({ prompt: Symbol('foo') as unknown as string })).toBe(
      false,
    );
  });
});
