import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '../use-undo-redo';

describe('useUndoRedo', () => {
  test('pushes state and undoes/redoes', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => {
      result.current.setState(1);
      result.current.setState(2);
    });
    expect(result.current.state).toBe(2);
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe(1);
    act(() => {
      result.current.redo();
    });
    expect(result.current.state).toBe(2);
  });

  test('caps history size', () => {
    const { result } = renderHook(() => useUndoRedo(0, 3));
    act(() => {
      result.current.setState(1);
      result.current.setState(2);
      result.current.setState(3);
      result.current.setState(4);
    });
    expect(result.current.canUndo).toBe(true);
    act(() => {
      result.current.undo();
      result.current.undo();
      result.current.undo();
    });
    // Only last 3 states kept -> after three undos we reach state 2
    expect(result.current.state).toBe(2);
  });
});
