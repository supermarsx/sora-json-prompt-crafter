import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../use-dark-mode';

function hasDarkClass() {
  return document.documentElement.classList.contains('dark');
}

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    document.documentElement.classList.remove('dark');
  });

  test('reads and writes localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    localStorage.setItem('darkMode', 'false');
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);
    expect(hasDarkClass()).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(localStorage.getItem('darkMode')).toBe('true');
    expect(setSpy).toHaveBeenCalledWith('darkMode', 'true');
    expect(hasDarkClass()).toBe(true);
  });
});
