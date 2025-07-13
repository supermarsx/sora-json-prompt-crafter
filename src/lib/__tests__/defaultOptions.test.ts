import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { isValidOptions } from '@/lib/validateOptions';

describe('DEFAULT_OPTIONS', () => {
  test('validate as acceptable options', () => {
    expect(isValidOptions(DEFAULT_OPTIONS)).toBe(true);
  });
});
