import { renderHook, act } from '@testing-library/react';
import { useCoreActionLabels } from '../use-core-action-labels';

describe('useCoreActionLabels', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('coreActionLabelsOnly', 'true');
    const { result } = renderHook(() => useCoreActionLabels());
    expect(result.current[0]).toBe(true);
    expect(getSpy).toHaveBeenCalledWith('coreActionLabelsOnly');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useCoreActionLabels());

    act(() => {
      result.current[1](true);
    });

    expect(localStorage.getItem('coreActionLabelsOnly')).toBe('true');
    expect(setSpy).toHaveBeenCalledWith('coreActionLabelsOnly', 'true');
  });
});

