import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../use-dark-mode';
import { DARK_MODE } from '@/lib/storage-keys';

function hasDarkClass() {
  return document.documentElement.classList.contains('dark');
}

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    document.documentElement.classList.remove('dark');
    window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
  });

  test('reads and writes localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    localStorage.setItem(DARK_MODE, 'false');
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);
    expect(hasDarkClass()).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(localStorage.getItem(DARK_MODE)).toBe('true');
    expect(setSpy).toHaveBeenCalledWith(DARK_MODE, 'true');
    expect(hasDarkClass()).toBe(true);
  });

  test('initializes from matchMedia when localStorage unset', () => {
    (window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: false });
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);
    expect(hasDarkClass()).toBe(false);
  });
});
