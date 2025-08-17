import { useEffect } from 'react';
import { useLocalStorageState } from './use-local-storage-state';
import { DARK_MODE } from '@/lib/storage-keys';

/**
 * Detects system dark-mode preference, persists the user's choice, and
 * provides theme state management.
 *
 * The hook reads the operating system's preferred color scheme, saves
 * overrides to `localStorage`, and returns the current dark-mode state
 * alongside a setter function.
 *
 * @returns A tuple with the dark-mode boolean and a setter to update it.
 */
export function useDarkMode() {
  const prefersDark =
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true;
  const [isDark, setIsDark] = useLocalStorageState(DARK_MODE, prefersDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
