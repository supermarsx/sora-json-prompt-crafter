import { renderHook, act } from '@testing-library/react';
import { useSoraUserscript } from '../use-sora-userscript';

describe('useSoraUserscript', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('soraUserscriptInstalled', 'true');
    const { result } = renderHook(() => useSoraUserscript());
    expect(result.current[0]).toBe(true);
    expect(getSpy).toHaveBeenCalledWith('soraUserscriptInstalled');
  });

  test('updates state on message event', () => {
    const { result } = renderHook(() => useSoraUserscript());
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', { data: { type: 'SORA_USERSCRIPT_READY' } })
      );
    });
    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem('soraUserscriptInstalled')).toBe('true');
  });
});
