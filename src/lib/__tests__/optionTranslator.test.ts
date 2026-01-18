import { getOptionLabel } from '../optionTranslator';

describe('getOptionLabel', () => {
  test('returns translated label when mapping exists', () => {
    const t = jest.fn((key: string, opts?: { defaultValue?: string }) => {
      return `t:${key}:${opts?.defaultValue ?? ''}`;
    });
    const result = getOptionLabel('foo', { foo: 'bar.key' }, t);
    expect(result).toBe('t:bar.key:foo');
    expect(t).toHaveBeenCalledWith('bar.key', { defaultValue: 'foo' });
  });

  test('falls back to option when mapping missing', () => {
    const t = jest.fn();
    const result = getOptionLabel('missing', {}, t);
    expect(result).toBe('missing');
    expect(t).not.toHaveBeenCalled();
  });
});
