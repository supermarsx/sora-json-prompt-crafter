import { renderHook, act } from '@testing-library/react';
import { useHeaderButtons } from '../use-header-buttons';

describe('useHeaderButtons', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('headerButtonsEnabled', 'false');
    const { result } = renderHook(() => useHeaderButtons());
    expect(result.current[0]).toBe(false);
    expect(getSpy).toHaveBeenCalledWith('headerButtonsEnabled');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useHeaderButtons());

    act(() => {
      result.current[1](false);
    });

    expect(localStorage.getItem('headerButtonsEnabled')).toBe('false');
    expect(setSpy).toHaveBeenCalledWith('headerButtonsEnabled', 'false');
  });
});
