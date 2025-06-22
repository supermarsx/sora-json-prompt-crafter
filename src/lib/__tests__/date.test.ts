import { formatDateTime } from '../date'

describe('formatDateTime', () => {
  test('formats date to YYYYMMDD-HHMMSS', () => {
    const d = new Date('2024-02-03T04:05:06Z')
    // Use timezone offset of 0 to avoid local timezone, but JS Date may convert
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset())
    expect(formatDateTime(d)).toBe('20240203-040506')
  })
})
