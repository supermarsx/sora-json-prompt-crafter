import { renderHook, act } from '@testing-library/react'
import { useToast, toast } from '../use-toast'

describe('useToast integration', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  test('toast() adds toasts and dismiss removes them after delay', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'Hi' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]?.title).toBe('Hi')

    const id = result.current.toasts[0]!.id

    act(() => {
      result.current.dismiss(id)
    })

    expect(result.current.toasts[0]?.open).toBe(false)

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  test('listener cleans up on unmount', () => {
    const { unmount } = renderHook(() => useToast())
    unmount()

    act(() => {
      toast({ title: 'Later' })
    })

    const { result } = renderHook(() => useToast())
    expect(result.current.toasts[0]?.title).toBe('Later')
  })
})
