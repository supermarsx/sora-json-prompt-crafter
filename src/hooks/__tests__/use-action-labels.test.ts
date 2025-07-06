import { renderHook, act } from '@testing-library/react';
import { useActionLabels } from '../use-action-labels';

describe('useActionLabels', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('actionLabelsEnabled', 'false');
    const { result } = renderHook(() => useActionLabels());
    expect(result.current[0]).toBe(false);
    expect(getSpy).toHaveBeenCalledWith('actionLabelsEnabled');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useActionLabels());

    act(() => {
      result.current[1](false);
    });

    expect(localStorage.getItem('actionLabelsEnabled')).toBe('false');
    expect(setSpy).toHaveBeenCalledWith('actionLabelsEnabled', 'false');
  });
});
