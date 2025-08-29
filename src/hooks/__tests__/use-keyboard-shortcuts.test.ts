import { renderHook, fireEvent } from '@testing-library/react';
import { useKeyboardShortcuts } from '../use-keyboard-shortcuts';

describe('useKeyboardShortcuts', () => {
  test('triggers handlers on shortcuts', () => {
    const onCopy = jest.fn();
    const onUndo = jest.fn();
    const onRedo = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onCopy, onUndo, onRedo }));

    fireEvent.keyDown(window, { key: 'c', ctrlKey: true });
    expect(onCopy).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(onUndo).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true, shiftKey: true });
    expect(onRedo).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    expect(onRedo).toHaveBeenCalledTimes(2);
  });

  test('shortcuts ignored when typing', () => {
    const onCopy = jest.fn();
    const onUndo = jest.fn();
    const onRedo = jest.fn();
    renderHook(() => useKeyboardShortcuts({ onCopy, onUndo, onRedo }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    fireEvent.keyDown(input, { key: 'c', ctrlKey: true });
    fireEvent.keyDown(input, { key: 'z', ctrlKey: true });
    expect(onCopy).not.toHaveBeenCalled();
    expect(onUndo).not.toHaveBeenCalled();
    input.remove();
  });
});
