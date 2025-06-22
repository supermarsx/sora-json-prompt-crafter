import { trackEvent } from '../analytics'

describe('trackEvent', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  test('does nothing when tracking disabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')
    trackEvent(false, 'test')
    expect(localStorage.getItem('trackingHistory')).toBeNull()
    expect(dispatchSpy).not.toHaveBeenCalled()
  })

  test('updates localStorage and dispatches event when enabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')
    ;(window as any).gtag = jest.fn()
    trackEvent(true, 'scroll_bottom')
    const stored = JSON.parse(localStorage.getItem('trackingHistory') || '[]')
    expect(stored[0].action).toBe('scroll_bottom')
    expect(dispatchSpy).toHaveBeenCalled()
  })
})
