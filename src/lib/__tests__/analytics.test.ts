let trackEvent: typeof import('../analytics').trackEvent

describe('trackEvent', () => {
  beforeEach(async () => {
    localStorage.clear()
    jest.restoreAllMocks()
    delete (window as unknown as { gtag?: unknown }).gtag
    jest.resetModules()
    ;({ trackEvent } = await import('../analytics'))
  })

  test('does nothing when tracking disabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')
    trackEvent(false, 'test')
    expect(localStorage.getItem('trackingHistory')).toBeNull()
    expect(dispatchSpy).not.toHaveBeenCalled()
  })

  test('updates localStorage and dispatches event when enabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')
    ;(
      window as unknown as {
        gtag?: jest.Mock
      }
    ).gtag = jest.fn()
    trackEvent(true, 'scroll_bottom')
    const stored = JSON.parse(localStorage.getItem('trackingHistory') || '[]')
    expect(stored[0].action).toBe('scroll_bottom')
    expect(dispatchSpy).toHaveBeenCalled()
  })

  test('continues when localStorage.setItem throws', () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const gtagMock = jest.fn()
    ;(window as unknown as { gtag?: jest.Mock }).gtag = gtagMock
    jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('fail')
      })

    trackEvent(true, 'foo')

    expect(errorSpy).toHaveBeenCalledWith(
      'Tracking History: There was an error.'
    )
    expect(gtagMock).toHaveBeenCalled()
  })

  test('does not call gtag when missing', () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    trackEvent(true, 'foo')
    trackEvent(true, 'bar')

    expect(errorSpy).toHaveBeenCalledWith(
      'Tracking Analytics: gtag function missing.'
    )
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  test('gtag errors stop further tracking', () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const gtagMock = jest.fn(() => {
      throw new Error('gtag fail')
    })
    ;(window as unknown as { gtag?: jest.Mock }).gtag = gtagMock

    trackEvent(true, 'a1')
    trackEvent(true, 'a2')

    expect(gtagMock).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith(
      'Tracking Analytics: There was an error.'
    )
    expect(errorSpy).toHaveBeenCalledWith(
      'Tracking Analytics: Too many errors, tracking permanently failed.'
    )
    expect(errorSpy).toHaveBeenCalledTimes(2)
  })
})
