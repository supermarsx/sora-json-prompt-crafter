import { renderHook, act } from '@testing-library/react';
import { useCopyLabels } from '../use-copy-labels';

describe('useCopyLabels', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('copyLabelsEnabled', 'false');
    const { result } = renderHook(() => useCopyLabels());
    expect(result.current[0]).toBe(false);
    expect(getSpy).toHaveBeenCalledWith('copyLabelsEnabled');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useCopyLabels());

    act(() => {
      result.current[1](false);
    });

    expect(localStorage.getItem('copyLabelsEnabled')).toBe('false');
    expect(setSpy).toHaveBeenCalledWith('copyLabelsEnabled', 'false');
  });
});
