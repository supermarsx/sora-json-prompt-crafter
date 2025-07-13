import { renderHook, act } from '@testing-library/react';
import { useSoraUserscript } from '../use-sora-userscript';

describe('useSoraUserscript', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initial state is not installed', () => {
    const { result } = renderHook(() => useSoraUserscript());
    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBeNull();
  });

  test('updates state on message event', () => {
    const postSpy = jest.spyOn(window, 'postMessage');
    const { result } = renderHook(() => useSoraUserscript());
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'SORA_USERSCRIPT_READY', version: '1.0' },
          source: window,
        }),
      );
    });
    expect(result.current[0]).toBe(true);
    expect(result.current[1]).toBe('1.0');
    expect(postSpy).toHaveBeenCalledWith({ type: 'SORA_USERSCRIPT_ACK' }, '*');
    expect(postSpy).toHaveBeenCalledWith({ type: 'SORA_DEBUG_PING' }, '*');
  });

  test('updates state via global callback', () => {
    const postSpy = jest.spyOn(window, 'postMessage');
    const { result } = renderHook(() => useSoraUserscript());
    act(() => {
      window.soraUserscriptReady!('1.0');
    });
    expect(result.current[0]).toBe(true);
    expect(result.current[1]).toBe('1.0');
    expect(postSpy).toHaveBeenCalledWith({ type: 'SORA_USERSCRIPT_ACK' }, '*');
  });

  test('responds to debug ping with pong', () => {
    const postSpy = jest.spyOn(window, 'postMessage');
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    renderHook(() => useSoraUserscript());

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'SORA_DEBUG_PING' },
          source: window,
        }),
      );
    });

    expect(postSpy).toHaveBeenCalledWith({ type: 'SORA_DEBUG_PONG' }, '*');
    expect(debugSpy).toHaveBeenCalledWith('[Sora Loader] Debug ping received');
  });

  test('logs when debug pong received', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    renderHook(() => useSoraUserscript());

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'SORA_DEBUG_PONG' },
          source: window,
        }),
      );
    });

    expect(debugSpy).toHaveBeenCalledWith('[Sora Loader] Debug pong received');
  });

  test('clears timeout once ready processed', () => {
    jest.useFakeTimers();
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    renderHook(() => useSoraUserscript(true));

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'SORA_USERSCRIPT_READY', version: '1.0' },
          source: window,
        }),
      );
      jest.advanceTimersByTime(3000);
    });

    expect(debugSpy).not.toHaveBeenCalledWith(
      '[Sora Loader] No response, resetting state',
    );

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('resets when READY never arrives', () => {
    jest.useFakeTimers();
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const { result } = renderHook(() => useSoraUserscript(true));

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBeNull();
    expect(debugSpy).toHaveBeenCalledWith(
      '[Sora Loader] No response, resetting state',
    );

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
