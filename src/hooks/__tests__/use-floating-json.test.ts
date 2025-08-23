import { renderHook, act } from '@testing-library/react';
import { useFloatingJson } from '../use-floating-json';

describe('useFloatingJson', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('floatingJsonEnabled', 'true');
    const { result } = renderHook(() => useFloatingJson());
    expect(result.current[0]).toBe(true);
    expect(getSpy).toHaveBeenCalledWith('floatingJsonEnabled');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useFloatingJson());

    act(() => {
      result.current[1](true);
    });

    expect(localStorage.getItem('floatingJsonEnabled')).toBe('true');
    expect(setSpy).toHaveBeenCalledWith('floatingJsonEnabled', 'true');
  });
});
