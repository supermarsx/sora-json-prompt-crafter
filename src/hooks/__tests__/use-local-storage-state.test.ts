import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from '../use-local-storage-state';
import * as storage from '@/lib/storage';

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  safeGet: jest.fn(),
  safeSet: jest.fn(),
}));

describe('useLocalStorageState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes state from safeGet and persists string updates', () => {
    (storage.safeGet as jest.Mock).mockReturnValue('stored');

    const { result } = renderHook(() => useLocalStorageState('key', 'default'));

    expect(storage.safeGet).toHaveBeenCalledWith('key', 'default', false);
    expect(result.current[0]).toBe('stored');

    act(() => {
      result.current[1]('new');
    });

    expect(storage.safeSet).toHaveBeenLastCalledWith('key', 'new');
    expect(result.current[0]).toBe('new');
  });

  test('initializes and persists non-string updates', () => {
    (storage.safeGet as jest.Mock).mockReturnValue({ a: 1 });
    const def = { a: 0 };

    const { result } = renderHook(() => useLocalStorageState('obj', def));

    expect(storage.safeGet).toHaveBeenCalledWith('obj', def, true);
    expect(result.current[0]).toEqual({ a: 1 });

    act(() => {
      result.current[1]({ a: 2 });
    });

    expect(storage.safeSet).toHaveBeenLastCalledWith('obj', { a: 2 }, true);
    expect(result.current[0]).toEqual({ a: 2 });
  });
});
