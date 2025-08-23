import { useLocalStorageState } from './use-local-storage-state';
import { CORE_ACTION_LABELS_ONLY } from '@/lib/storage-keys';

/**
 * Toggles whether action labels are limited to core actions only.
 * Defaults to `false` and persists the setting in localStorage.
 */
export function useCoreActionLabels() {
  return useLocalStorageState(CORE_ACTION_LABELS_ONLY, false);
}

