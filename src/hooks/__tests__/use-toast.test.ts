import { renderHook, act } from '@testing-library/react';
import { reducer, useToast, toast } from '../use-toast';
import type { State } from '../use-toast';

const baseToast = {
  id: '1',
  title: 'Hello',
  description: 'World',
  open: true,
};

describe('use-toast reducer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  test('ADD_TOAST adds a toast', () => {
    const state = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: baseToast },
    );
    expect(state.toasts).toEqual([baseToast]);
  });

  test('UPDATE_TOAST updates an existing toast', () => {
    const state = reducer(
      { toasts: [baseToast] },
      { type: 'UPDATE_TOAST', toast: { id: '1', title: 'Updated' } },
    );
    expect(state.toasts[0]?.title).toBe('Updated');
  });

  test('DISMISS_TOAST closes toast and REMOVE_TOAST removes it', () => {
    let state: State = { toasts: [baseToast] };
    state = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' });
    expect(state.toasts[0]?.open).toBe(false);
    state = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' });
    expect(state.toasts).toHaveLength(0);
  });
});

describe('useToast dismiss', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('dismiss() with no id closes all toasts and removes them', async () => {
    const { result } = renderHook(() => useToast());
    const spy = jest.spyOn(global, 'setTimeout');

    act(() => {
      toast({ title: 'One' });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.toasts[0]?.open).toBe(false);

    await act(async () => {
      jest.runAllTimers();
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.current.toasts).toHaveLength(0);
    spy.mockRestore();
  });

  test('calling dismiss twice only schedules one removal', () => {
    const { result } = renderHook(() => useToast());
    const spy = jest.spyOn(global, 'setTimeout');

    act(() => {
      toast({ title: 'Once' });
    });

    const id = result.current.toasts[0]!.id;

    act(() => {
      result.current.dismiss(id);
      result.current.dismiss(id);
    });

    expect(spy).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(0);

    spy.mockRestore();
  });
});
