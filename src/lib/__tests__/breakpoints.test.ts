import { MOBILE_BREAKPOINT, SINGLE_COLUMN_BREAKPOINT } from '../breakpoints';

describe('breakpoints', () => {
  test('values match expected', () => {
    expect(MOBILE_BREAKPOINT).toBe(768);
    expect(SINGLE_COLUMN_BREAKPOINT).toBe(1024);
  });
});
