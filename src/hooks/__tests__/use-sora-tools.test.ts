import { renderHook, act } from '@testing-library/react';
import { useSoraTools } from '../use-sora-tools';

describe('useSoraTools', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('soraToolsEnabled', 'false');
    const { result } = renderHook(() => useSoraTools());
    expect(result.current[0]).toBe(false);
    expect(getSpy).toHaveBeenCalledWith('soraToolsEnabled');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const removeSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const { result } = renderHook(() => useSoraTools());

    setSpy.mockClear();
    removeSpy.mockClear();

    act(() => {
      result.current[1](true);
    });

    expect(localStorage.getItem('soraToolsEnabled')).toBe('true');
    expect(setSpy).toHaveBeenCalledWith('soraToolsEnabled', 'true');

    act(() => {
      result.current[1](false);
    });

    expect(localStorage.getItem('soraToolsEnabled')).toBeNull();
    expect(removeSpy).toHaveBeenCalledWith('soraToolsEnabled');
  });
});
