import { safeSet, safeRemove } from '../storage'

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  test('safeSet logs warning when setItem fails', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('fail')
    })
    expect(safeSet('k', 'v')).toBe(false)
    expect(warnSpy).toHaveBeenCalled()
  })

  test('safeSet logs warning when value is not string and stringify is false', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    expect(safeSet('k', { a: 1 })).toBe(false)
    expect(warnSpy).toHaveBeenCalled()
  })

  test('safeRemove logs warning when removeItem fails', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('fail')
    })
    expect(safeRemove('k')).toBe(false)
    expect(warnSpy).toHaveBeenCalled()
  })
})
