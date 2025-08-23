import { useLocalStorageState } from './use-local-storage-state';
import { HEADER_VISIBLE } from '@/lib/storage-keys';

/**
 * Controls display of the main header.
 * Defaults to `true` and persists the preference in localStorage.
 */
export function useHeaderVisibility() {
  return useLocalStorageState(HEADER_VISIBLE, true);
}
