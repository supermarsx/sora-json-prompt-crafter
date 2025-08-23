import { renderHook, act } from '@testing-library/react';
import { useDarkModeToggleVisibility } from '../use-dark-mode-toggle-visibility';
import { DARK_MODE_TOGGLE_VISIBLE } from '@/lib/storage-keys';

describe('useDarkModeToggleVisibility', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem(DARK_MODE_TOGGLE_VISIBLE, 'false');
    const { result } = renderHook(() => useDarkModeToggleVisibility());
    expect(result.current[0]).toBe(false);
    expect(getSpy).toHaveBeenCalledWith(DARK_MODE_TOGGLE_VISIBLE);
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useDarkModeToggleVisibility());

    act(() => {
      result.current[1](false);
    });

    expect(localStorage.getItem(DARK_MODE_TOGGLE_VISIBLE)).toBe('false');
    expect(setSpy).toHaveBeenCalledWith(DARK_MODE_TOGGLE_VISIBLE, 'false');
  });
});
