import { isValidOptions } from '../validateOptions'

describe('isValidOptions', () => {
  test('accepts partial valid options', () => {
    expect(isValidOptions({ prompt: 'hi', steps: 10 })).toBe(true)
  })

  test('rejects unknown keys', () => {
    expect(isValidOptions({ foo: 'bar' })).toBe(false)
  })

  test('rejects wrong types', () => {
    expect(isValidOptions({ steps: 'ten' })).toBe(false)
  })
})
