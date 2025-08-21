import { renderHook, act } from '@testing-library/react';
import { useTotalTime } from '../use-total-time';
import { TOTAL_SECONDS, TIME_MILESTONES } from '@/lib/storage-keys';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';

jest.mock('../use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true, jest.fn()] as const),
}));

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

describe('useTotalTime', () => {
  beforeEach(() => {
    localStorage.clear();
    (trackEvent as jest.Mock).mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('persists total time across sessions', () => {
    const { unmount } = renderHook(() => useTotalTime());
    act(() => {
      jest.advanceTimersByTime(65000);
    });
    unmount();
    expect(JSON.parse(localStorage.getItem(TOTAL_SECONDS) || '0')).toBe(65);

    renderHook(() => useTotalTime());
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(JSON.parse(localStorage.getItem(TOTAL_SECONDS) || '0')).toBe(70);
  });

  test('emits milestone events once', () => {
    const { unmount } = renderHook(() => useTotalTime());
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.Time5Min);
    unmount();
    expect(JSON.parse(localStorage.getItem(TIME_MILESTONES) || '[]')).toEqual([
      5 * 60,
    ]);

    (trackEvent as jest.Mock).mockClear();
    renderHook(() => useTotalTime());
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.Time10Min);
    expect(JSON.parse(localStorage.getItem(TIME_MILESTONES) || '[]')).toEqual([
      5 * 60,
      10 * 60,
    ]);
  });
});

