import { render, act } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';
import { trackEvent } from '@/lib/analytics';
import { useTracking } from '@/hooks/use-tracking';

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true] as const),
}));

describe('ProgressBar', () => {
  let addSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    (trackEvent as jest.Mock).mockClear();
    addSpy = jest.spyOn(window, 'addEventListener');
    removeSpy = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  function setMetrics(scrollHeight: number, innerHeight: number) {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: scrollHeight,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: innerHeight,
    });
  }

  function scrollTo(y: number) {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: y,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  }

  test('updates progress and tracks once at 99%', () => {
    setMetrics(1000, 500);
    const { container } = render(<ProgressBar />);
    const getBar = () =>
      container.firstChild &&
      ((container.firstChild as HTMLElement).firstChild as HTMLDivElement);
    scrollTo(0);
    expect(getBar().getAttribute('style')).toContain('width: 0%');
    expect(trackEvent).not.toHaveBeenCalled();

    scrollTo(250);
    expect(getBar().style.width).toBe('50%');

    scrollTo(495);
    expect(getBar().style.width).toBe('99%');
    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(true, 'scroll_bottom');

    scrollTo(500);
    expect(getBar().style.width).toBe('100%');
    expect(trackEvent).toHaveBeenCalledTimes(1);
  });

  test('removes scroll listener on unmount', () => {
    const { unmount } = render(<ProgressBar />);
    const handler = addSpy.mock.calls.find(
      ([event]) => event === 'scroll',
    )?.[1];
    expect(handler).toBeInstanceOf(Function);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', handler);
  });
});
