import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { getJson, setJson, safeGet, safeSet, safeRemove } from '@/lib/storage';

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
  {
    serialize,
    deserialize,
  }: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {},
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (deserialize) {
      const raw = safeGet<string>(key, null) as string | null;
      if (raw === null) return defaultValue;
      try {
        return deserialize(raw);
      } catch (err) {
        console.warn('useLocalStorageState: failed to deserialize', err);
        return defaultValue;
      }
    }
    const stored = getJson<T>(key, defaultValue);
    return stored ?? defaultValue;
  });

  useEffect(() => {
    if (Object.is(state, defaultValue)) {
      safeRemove(key);
      return;
    }
    if (serialize) {
      safeSet(key, serialize(state));
      return;
    }
    setJson(key, state);
  }, [key, state, defaultValue, serialize]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage || e.key !== key) return;
      if (e.newValue === null) {
        setState(defaultValue);
        return;
      }
      try {
        const parsed = deserialize
          ? deserialize(e.newValue)
          : (JSON.parse(e.newValue) as T);
        setState(parsed);
      } catch (err) {
        console.warn(
          'useLocalStorageState: failed to parse storage event',
          err,
        );
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, defaultValue, deserialize]);

  return [state, setState];
}
