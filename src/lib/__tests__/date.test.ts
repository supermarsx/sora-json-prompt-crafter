import { formatDateTime, formatDisplayDate } from '../date';

describe('formatDateTime', () => {
  test('formats date to YYYYMMDD-HHMMSS', () => {
    const d = new Date('2024-02-03T04:05:06Z');
    // Use timezone offset of 0 to avoid local timezone, but JS Date may convert
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    expect(formatDateTime(d)).toBe('20240203-040506');
  });
});

describe('formatDisplayDate', () => {
  test('formats date to human readable string', () => {
    const d = new Date('2024-02-03T04:05:06Z');
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    const expected = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
    expect(formatDisplayDate(d)).toBe(expected);
  });
});
