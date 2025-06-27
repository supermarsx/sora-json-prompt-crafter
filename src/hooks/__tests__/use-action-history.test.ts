import { renderHook, act } from '@testing-library/react';
import { useActionHistory } from '../use-action-history';

function setHistory(list: unknown) {
  localStorage.setItem('trackingHistory', JSON.stringify(list));
}

describe('useActionHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('initializes from localStorage and responds to events', () => {
    const first = [{ date: 'd1', action: 'a1' }];
    setHistory(first);
    const { result } = renderHook(() => useActionHistory());
    expect(result.current).toEqual(first);

    const next = [...first, { date: 'd2', action: 'a2' }];
    setHistory(next);
    act(() => {
      window.dispatchEvent(new Event('trackingHistoryUpdate'));
    });
    expect(result.current).toEqual(next);
  });
});
