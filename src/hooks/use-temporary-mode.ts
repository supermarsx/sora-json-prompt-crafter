import { useLocalStorageState } from './use-local-storage-state';
import { TEMPORARY_MODE } from '@/lib/storage-keys';

/**
 * Toggles temporary mode which prevents storing history entries.
 * Defaults to `false` and persists the choice in localStorage.
 *
 * @returns A tuple containing the current state and a setter.
 */
export function useTemporaryMode() {
  return useLocalStorageState(TEMPORARY_MODE, false);
}
