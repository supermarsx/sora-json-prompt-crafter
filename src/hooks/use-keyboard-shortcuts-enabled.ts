import { useLocalStorageState } from './use-local-storage-state';
import { KEYBOARD_SHORTCUTS_ENABLED } from '@/lib/storage-keys';

/**
 * Manages the global keyboard shortcuts enabled state.
 * Defaults to `true` and persists the preference in localStorage.
 */
export function useKeyboardShortcutsEnabled() {
  return useLocalStorageState(KEYBOARD_SHORTCUTS_ENABLED, true);
}
