import { DEFAULT_OPTIONS } from '../defaultOptions';
import { isValidOptions } from '../validateOptions';

describe('DEFAULT_OPTIONS', () => {
  test('validate as acceptable options', () => {
    expect(isValidOptions(DEFAULT_OPTIONS)).toBe(true);
  });
});
