import { useLocalStorageState } from './use-local-storage-state';
import { ACTION_LABELS_ENABLED } from '@/lib/storage-keys';

/**
 * Toggles visibility of action labels in the UI.
 * Defaults to `true` and persists the setting in localStorage.
 */
export function useActionLabels() {
  return useLocalStorageState(ACTION_LABELS_ENABLED, true);
}
