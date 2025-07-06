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

  return [state, setState];
}
