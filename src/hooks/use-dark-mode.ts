import { useEffect } from 'react';
import { useLocalStorageState } from './use-local-storage-state';
import { DARK_MODE } from '@/lib/storage-keys';

export function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorageState(DARK_MODE, true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
