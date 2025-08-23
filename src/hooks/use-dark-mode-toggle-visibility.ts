import { useLocalStorageState } from './use-local-storage-state';
import { DARK_MODE_TOGGLE_VISIBLE } from '@/lib/storage-keys';

/**
 * Controls visibility of the dark mode toggle.
 * Defaults to `true` and persists the preference in localStorage.
 */
export function useDarkModeToggleVisibility() {
  return useLocalStorageState(DARK_MODE_TOGGLE_VISIBLE, true);
}
