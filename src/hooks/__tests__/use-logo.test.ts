import { renderHook, act } from '@testing-library/react';
import { useLogo } from '../use-logo';

describe('useLogo', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('logoEnabled', 'false');
    const { result } = renderHook(() => useLogo());
    expect(result.current[0]).toBe(false);
    expect(getSpy).toHaveBeenCalledWith('logoEnabled');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useLogo());

    act(() => {
      result.current[1](false);
    });

    expect(localStorage.getItem('logoEnabled')).toBe('false');
    expect(setSpy).toHaveBeenCalledWith('logoEnabled', 'false');
  });
});
