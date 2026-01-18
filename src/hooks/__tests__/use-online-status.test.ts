import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '../use-online-status';

describe('useOnlineStatus', () => {
  const originalOnLine = Object.getOwnPropertyDescriptor(
    Navigator.prototype,
    'onLine',
  );

  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(Navigator.prototype, 'onLine', originalOnLine);
    }
    jest.restoreAllMocks();
  });

  test('returns the initial online state', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      writable: true,
      value: false,
    });
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);
  });

  test('updates on offline/online events', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        writable: true,
        value: false,
      });
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        writable: true,
        value: true,
      });
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(true);
  });

  test('cleans up event listeners on unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useOnlineStatus());

    const onlineHandler = addSpy.mock.calls.find(
      ([event]) => event === 'online',
    )?.[1] as EventListener;
    const offlineHandler = addSpy.mock.calls.find(
      ([event]) => event === 'offline',
    )?.[1] as EventListener;

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('online', onlineHandler);
    expect(removeSpy).toHaveBeenCalledWith('offline', offlineHandler);
  });
});
