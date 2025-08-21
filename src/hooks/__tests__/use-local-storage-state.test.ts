import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from '../use-local-storage-state';
import * as storage from '@/lib/storage';

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  getJson: jest.fn(),
  setJson: jest.fn(),
  safeRemove: jest.fn(),
  safeGet: jest.fn(),
  safeSet: jest.fn(),
}));

describe('useLocalStorageState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes state from getJson and persists updates', () => {
    (storage.getJson as jest.Mock).mockReturnValue('stored');

    const { result } = renderHook(() => useLocalStorageState('key', 'default'));

    expect(storage.getJson).toHaveBeenCalledWith('key', 'default');
    expect(result.current[0]).toBe('stored');

    act(() => {
      result.current[1]('new');
    });

    expect(storage.setJson).toHaveBeenLastCalledWith('key', 'new');
    expect(result.current[0]).toBe('new');
  });

  test('initializes and persists non-string updates', () => {
    (storage.getJson as jest.Mock).mockReturnValue({ a: 1 });
    const def = { a: 0 };

    const { result } = renderHook(() => useLocalStorageState('obj', def));

    expect(storage.getJson).toHaveBeenCalledWith('obj', def);
    expect(result.current[0]).toEqual({ a: 1 });

    act(() => {
      result.current[1]({ a: 2 });
    });

    expect(storage.setJson).toHaveBeenLastCalledWith('obj', { a: 2 });
    expect(result.current[0]).toEqual({ a: 2 });
  });

  test('removes key instead of persisting default value', () => {
    (storage.getJson as jest.Mock).mockReturnValue('default');

    const { result } = renderHook(() => useLocalStorageState('key', 'default'));

    expect(storage.safeRemove).toHaveBeenCalledWith('key');
    expect(storage.setJson).not.toHaveBeenCalled();

    act(() => {
      result.current[1]('default');
    });

    expect(storage.safeRemove).toHaveBeenCalledWith('key');
    expect(storage.setJson).not.toHaveBeenCalled();
  });

  test('updates state when storage event fires for same key', () => {
    (storage.getJson as jest.Mock).mockReturnValue('one');
    const { result } = renderHook(() => useLocalStorageState('key', 'default'));

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'key',
          newValue: JSON.stringify('two'),
          storageArea: window.localStorage,
        }),
      );
    });

    expect(result.current[0]).toBe('two');
  });

  test('uses custom serialize and deserialize callbacks', () => {
    (storage.safeGet as jest.Mock).mockReturnValue('ser:hello');

    const serialize = jest.fn((v: string) => `ser:${v}`);
    const deserialize = jest.fn((v: string) => v.replace('ser:', ''));

    const { result } = renderHook(() =>
      useLocalStorageState('key', 'default', { serialize, deserialize }),
    );

    expect(storage.getJson).not.toHaveBeenCalled();
    expect(storage.setJson).not.toHaveBeenCalled();
    expect(storage.safeGet).toHaveBeenCalledWith('key', null);
    expect(deserialize).toHaveBeenCalledWith('ser:hello');
    expect(result.current[0]).toBe('hello');

    act(() => {
      result.current[1]('world');
    });

    expect(serialize).toHaveBeenCalledWith('world');
    expect(storage.safeSet).toHaveBeenLastCalledWith('key', 'ser:world');
    expect(result.current[0]).toBe('world');

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'key',
          newValue: 'ser:event',
          storageArea: window.localStorage,
        }),
      );
    });

    expect(deserialize).toHaveBeenLastCalledWith('ser:event');
    expect(result.current[0]).toBe('event');
  });

  test('cleans up storage listener on unmount', () => {
    (storage.getJson as jest.Mock).mockReturnValue('init');
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useLocalStorageState('key', 'default'));

    const handler = addSpy.mock.calls.find((c) => c[0] === 'storage')?.[1];
    expect(addSpy).toHaveBeenCalledWith('storage', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('storage', handler);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
