import { renderHook, act } from '@testing-library/react'
import { useTracking } from '../use-tracking'

describe('useTracking', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem')
    localStorage.setItem('trackingEnabled', 'false')
    const { result } = renderHook(() => useTracking())
    expect(result.current[0]).toBe(false)
    expect(getSpy).toHaveBeenCalledWith('trackingEnabled')
  })

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem')
    const { result } = renderHook(() => useTracking())

    act(() => {
      result.current[1](false)
    })

    expect(localStorage.getItem('trackingEnabled')).toBe('false')
    expect(setSpy).toHaveBeenCalledWith('trackingEnabled', 'false')
  })
})
