let trackEvent: typeof import('../analytics').trackEvent;

describe('trackEvent', () => {
  beforeEach(async () => {
    localStorage.clear();
    jest.restoreAllMocks();
    delete (window as unknown as { gtag?: unknown }).gtag;
    jest.resetModules();
    ({ trackEvent } = await import('../analytics'));
  });

  test('does nothing when tracking disabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    trackEvent(false, 'test');
    expect(localStorage.getItem('trackingHistory')).toBeNull();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  test('updates localStorage and dispatches event when enabled', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    (
      window as unknown as {
        gtag?: jest.Mock;
      }
    ).gtag = jest.fn();
    trackEvent(true, 'scroll_bottom');
    const stored = JSON.parse(localStorage.getItem('trackingHistory') || '[]');
    expect(stored[0].action).toBe('scroll_bottom');
    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('continues when localStorage.setItem throws', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const gtagMock = jest.fn();
    (window as unknown as { gtag?: jest.Mock }).gtag = gtagMock;
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('fail');
    });

    trackEvent(true, 'foo');

    expect(errorSpy).toHaveBeenCalledWith(
      'Tracking History: There was an error.',
    );
    expect(gtagMock).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
  });

  test('does not call gtag when missing', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    trackEvent(true, 'foo');
    trackEvent(true, 'bar');

    expect(errorSpy).toHaveBeenCalledWith(
      'Tracking Analytics: gtag function missing.',
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  test('gtag errors stop further tracking', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const gtagMock = jest.fn(() => {
      throw new Error('gtag fail');
    });
    (window as unknown as { gtag?: jest.Mock }).gtag = gtagMock;

    for (let i = 0; i < 7; i++) {
      trackEvent(true, `a${i}`);
    }

    expect(gtagMock).toHaveBeenCalledTimes(6);
    expect(
      errorSpy.mock.calls.filter(
        (c) => c[0] === 'Tracking Analytics: There was an error.',
      ).length,
    ).toBe(5);
    expect(errorSpy).toHaveBeenCalledWith(
      'Tracking Analytics: Too many errors, tracking permanently failed.',
    );
  });

  test('passes debug_mode when GTAG_DEBUG enabled', async () => {
    process.env.VITE_GTAG_DEBUG = 'true';
    jest.resetModules();
    ({ trackEvent } = await import('../analytics'));

    const gtagMock = jest.fn();
    (window as unknown as { gtag?: jest.Mock }).gtag = gtagMock;
    trackEvent(true, 'foo');

    expect(gtagMock).toHaveBeenCalledWith(
      'event',
      'foo',
      expect.objectContaining({ debug_mode: true }),
    );
    delete process.env.VITE_GTAG_DEBUG;
  });

  test('truncates history at 100 items', () => {
    const items = Array.from({ length: 110 }, (_, i) => ({
      date: new Date(i).toISOString(),
      action: `a${i}`,
    }));
    localStorage.setItem('trackingHistory', JSON.stringify(items));
    (
      window as unknown as {
        gtag?: jest.Mock;
      }
    ).gtag = jest.fn();

    trackEvent(true, 'event');

    const stored = JSON.parse(localStorage.getItem('trackingHistory') || '[]');
    expect(stored.length).toBe(100);
    expect(stored[0].action).toBe('event');
  });

  test('logs only five errors then disables gtag', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const gtagMock = jest.fn(() => {
      throw new Error('fail');
    });
    (window as unknown as { gtag?: jest.Mock }).gtag = gtagMock;

    for (let i = 0; i < 10; i++) {
      trackEvent(true, `a${i}`);
    }

    const errCount = errorSpy.mock.calls.filter(
      (c) => c[0] === 'Tracking Analytics: There was an error.',
    ).length;
    expect(errCount).toBe(5);
    expect(gtagMock.mock.calls.length).toBe(6);
  });
});
