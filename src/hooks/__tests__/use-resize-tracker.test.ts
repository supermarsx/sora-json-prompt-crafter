import { render } from '@testing-library/react';
import { useRef, createElement } from 'react';
import { useResizeTracker } from '../use-resize-tracker';
import { trackEvent } from '@/lib/analytics';

class MockResizeObserver {
  public callback: ResizeObserverCallback;
  public el: Element | null = null;
  public disconnected = false;
  constructor(cb: ResizeObserverCallback) {
    this.callback = cb;
    MockResizeObserver.instance = this;
  }
  observe(el: Element) {
    this.el = el;
  }
  disconnect() {
    this.disconnected = true;
  }
  trigger(width: number, height: number) {
    const entry = {
      target: this.el!,
      contentRect: { width, height },
    } as unknown as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
  static instance: MockResizeObserver | null = null;
}

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

function Test() {
  const ref = useRef<HTMLDivElement>(null);
  useResizeTracker(ref, true, 'resize');
  return createElement('div', { ref });
}

describe('useResizeTracker', () => {
  beforeEach(() => {
    (trackEvent as jest.Mock).mockClear();
    (
      global as unknown as {
        ResizeObserver: typeof ResizeObserver;
      }
    ).ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('tracks size changes with throttle', () => {
    const { unmount } = render(createElement(Test));
    const ro = MockResizeObserver.instance!;

    // first resize - no event yet
    ro.trigger(10, 10);
    expect(trackEvent).toHaveBeenCalledTimes(0);

    // same size -> still no event
    ro.trigger(10, 10);
    expect(trackEvent).toHaveBeenCalledTimes(0);

    // different size but <1s elapsed -> still throttled
    jest.advanceTimersByTime(500);
    ro.trigger(20, 20);
    expect(trackEvent).toHaveBeenCalledTimes(0);

    // after >1s -> event fired
    jest.advanceTimersByTime(600);
    ro.trigger(30, 30);
    expect(trackEvent).toHaveBeenCalledTimes(1);

    unmount();
    expect(ro.disconnected).toBe(true);
  });
});
