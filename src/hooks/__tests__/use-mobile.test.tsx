import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'
import { useIsSingleColumn } from '../use-single-column'

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia
  let add: jest.Mock
  let remove: jest.Mock

  beforeEach(() => {
    add = jest.fn()
    remove = jest.fn()
    window.matchMedia = jest
      .fn()
      .mockReturnValue({
        addEventListener: add,
        removeEventListener: remove,
      } as unknown as MediaQueryList)
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  test('updates state on change and cleans up', () => {
    window.innerWidth = 500
    const { result, unmount } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)

    window.innerWidth = 800
    act(() => {
      const handler = add.mock.calls[0][1]
      handler()
    })
    expect(result.current).toBe(false)

    const handler = add.mock.calls[0][1]
    unmount()
    expect(remove).toHaveBeenCalledWith('change', handler)
  })
})

describe('useIsSingleColumn', () => {
  const originalMatchMedia = window.matchMedia
  let add: jest.Mock
  let remove: jest.Mock

  beforeEach(() => {
    add = jest.fn()
    remove = jest.fn()
    window.matchMedia = jest
      .fn()
      .mockReturnValue({
        addEventListener: add,
        removeEventListener: remove,
      } as unknown as MediaQueryList)
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  test('updates state on change and cleans up', () => {
    window.innerWidth = 900
    const { result, unmount } = renderHook(() => useIsSingleColumn())
    expect(result.current).toBe(true)

    window.innerWidth = 1100
    act(() => {
      const handler = add.mock.calls[0][1]
      handler()
    })
    expect(result.current).toBe(false)

    const handler = add.mock.calls[0][1]
    unmount()
    expect(remove).toHaveBeenCalledWith('change', handler)
  })
})
