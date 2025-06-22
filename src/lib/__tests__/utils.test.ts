import { cn } from '../utils'

describe('cn', () => {
  test('combines class names and merges duplicates', () => {
    const result = cn('p-2', { 'text-sm': true }, 'p-4')
    expect(result).toBe('text-sm p-4')
  })
})
