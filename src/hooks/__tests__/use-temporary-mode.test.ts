import { renderHook, act } from '@testing-library/react';
import { useTemporaryMode } from '../use-temporary-mode';

describe('useTemporaryMode', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('temporaryMode', 'true');
    const { result } = renderHook(() => useTemporaryMode());
    expect(result.current[0]).toBe(true);
    expect(getSpy).toHaveBeenCalledWith('temporaryMode');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const removeSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const { result } = renderHook(() => useTemporaryMode());

    setSpy.mockClear();
    removeSpy.mockClear();

    act(() => {
      result.current[1](true);
    });
    expect(localStorage.getItem('temporaryMode')).toBe('true');
    expect(setSpy).toHaveBeenCalledWith('temporaryMode', 'true');

    act(() => {
      result.current[1](false);
    });
    expect(localStorage.getItem('temporaryMode')).toBeNull();
    expect(removeSpy).toHaveBeenCalledWith('temporaryMode');
  });
});
