import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { safeGet, safeSet } from '@/lib/storage';

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
    if (isString) {
      safeSet(key, state as unknown as string);
    } else {
      safeSet(key, state, true);
    }
  }, [key, state, isString]);

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
