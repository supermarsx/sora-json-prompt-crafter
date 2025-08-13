import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { getJson, setJson, safeRemove } from '@/lib/storage';

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
  const [state, setState] = useState<T>(() => {
    const stored = getJson<T>(key, defaultValue);
    return stored ?? defaultValue;
  });

  useEffect(() => {
    if (Object.is(state, defaultValue)) {
      safeRemove(key);
      return;
    }
    setJson(key, state);
  }, [key, state, defaultValue]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage || e.key !== key) return;
      if (e.newValue === null) {
        setState(defaultValue);
        return;
      }
      try {
        setState(JSON.parse(e.newValue) as T);
      } catch (err) {
        console.warn('useLocalStorageState: failed to parse storage event', err);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, defaultValue]);

  return [state, setState];
}
