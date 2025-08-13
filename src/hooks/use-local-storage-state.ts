import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { safeGet, safeSet, safeRemove } from '@/lib/storage';

/**
 * Sync a stateful value with `localStorage`.
 *
 * When the state matches `defaultValue`, the corresponding key is removed
 * from storage to avoid persisting default values.
 *
 * @param key - The localStorage key
 * @param defaultValue - Value to fall back to when nothing is stored
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const isString = typeof defaultValue === 'string';

  const [state, setState] = useState<T>(() => {
    const stored = safeGet<T>(key, defaultValue, !isString);
    return (stored as T) ?? defaultValue;
  });

  useEffect(() => {
    if (Object.is(state, defaultValue)) {
      safeRemove(key);
      return;
    }
    if (isString) {
      safeSet(key, state as unknown as string);
    } else {
      safeSet(key, state, true);
    }
  }, [key, state, isString, defaultValue]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage || e.key !== key) return;
      if (e.newValue === null) {
        setState(defaultValue);
        return;
      }
      try {
        const value = isString
          ? (e.newValue as unknown as T)
          : (JSON.parse(e.newValue) as T);
        setState(value);
      } catch (err) {
        console.warn('useLocalStorageState: failed to parse storage event', err);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, isString, defaultValue]);

  return [state, setState];
}
