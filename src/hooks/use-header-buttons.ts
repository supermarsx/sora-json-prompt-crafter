import { useLocalStorageState } from './use-local-storage-state';
import { HEADER_BUTTONS_ENABLED } from '@/lib/storage-keys';

/**
 * Controls display of optional header buttons.
 * Defaults to `true` and saves the preference in localStorage.
 */
export function useHeaderButtons() {
  return useLocalStorageState(HEADER_BUTTONS_ENABLED, true);
}
