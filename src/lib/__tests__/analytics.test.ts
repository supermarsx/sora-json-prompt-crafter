let trackEvent: typeof import('../analytics').trackEvent

describe('trackEvent', () => {
  beforeEach(async () => {
    jest.resetModules()
    ;({ trackEvent } = await import('../analytics'))
    localStorage.clear()
    jest.restoreAllMocks()
    ;(window as any).gtag = jest.fn()
  })

  test('does nothing when tracking disabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')
    trackEvent(false, 'test')
    expect(localStorage.getItem('trackingHistory')).toBeNull()
    expect(dispatchSpy).not.toHaveBeenCalled()
  })

  test('updates localStorage and dispatches event when enabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')
    trackEvent(true, 'scroll_bottom')
    const stored = JSON.parse(localStorage.getItem('trackingHistory') || '[]')
    expect(stored[0].action).toBe('scroll_bottom')
    expect(dispatchSpy).toHaveBeenCalled()
  })

  test('calls gtag with correct parameters when enabled', () => {
    trackEvent(true, 'event')
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'page_action', {
      send_to: 'G-RVR9TSBQL7',
      action: 'event',
    })
  })

  test('stops calling gtag after 5 failures', () => {
    ;(window as any).gtag = jest.fn(() => {
      throw new Error('fail')
    })
    for (let i = 0; i < 6; i++) {
      trackEvent(true, 'fail')
    }
    expect((window as any).gtag).toHaveBeenCalledTimes(5)
  })
})
