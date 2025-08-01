import { renderHook, act } from '@testing-library/react';
import { useUndoRedoLabels } from '../use-undo-redo-labels';

describe('useUndoRedoLabels', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes state from localStorage', () => {
    const getSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.setItem('undoRedoLabelsEnabled', 'false');
    const { result } = renderHook(() => useUndoRedoLabels());
    expect(result.current[0]).toBe(false);
    expect(getSpy).toHaveBeenCalledWith('undoRedoLabelsEnabled');
  });

  test('persists state changes to localStorage', () => {
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useUndoRedoLabels());

    act(() => {
      result.current[1](false);
    });

    expect(localStorage.getItem('undoRedoLabelsEnabled')).toBe('false');
    expect(setSpy).toHaveBeenCalledWith('undoRedoLabelsEnabled', 'false');
  });
});
