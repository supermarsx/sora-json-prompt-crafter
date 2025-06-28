import { renderHook, act } from '@testing-library/react';
import { useSoraUserscript } from '../use-sora-userscript';

describe('useSoraUserscript', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(document, 'cookie', { writable: true, value: '' });
    jest.restoreAllMocks();
  });

  test('initializes from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('soraUserscriptInstalled', 'true');
    const { result } = renderHook(() => useSoraUserscript());
    expect(result.current[0]).toBe(true);
    expect(getSpy).toHaveBeenCalledWith('soraUserscriptInstalled');
  });

  test('initializes from cookie when localStorage missing', () => {
    document.cookie = 'soraUserscriptInstalled=true';
    const { result } = renderHook(() => useSoraUserscript());
    expect(result.current[0]).toBe(true);
  });

  test('updates state on message event', () => {
    const { result } = renderHook(() => useSoraUserscript());
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'SORA_USERSCRIPT_READY' },
        }),
      );
    });
    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem('soraUserscriptInstalled')).toBe('true');
  });

  test('updates state via global callback', () => {
    const { result } = renderHook(() => useSoraUserscript());
    act(() => {
      window.soraUserscriptReady!();
    });
    expect(result.current[0]).toBe(true);
  });

  test('falls back to cookie when localStorage fails', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('fail');
    });
    const { result } = renderHook(() => useSoraUserscript());
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'SORA_USERSCRIPT_READY' },
        }),
      );
    });
    expect(result.current[0]).toBe(true);
    expect(document.cookie).toContain('soraUserscriptInstalled=true');
  });

  test('updates state on storage event', () => {
    const { result } = renderHook(() => useSoraUserscript());
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'soraUserscriptInstalled',
          newValue: 'true',
        }),
      );
    });
    expect(result.current[0]).toBe(true);
  });
});
