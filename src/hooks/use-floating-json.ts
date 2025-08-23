import { useLocalStorageState } from './use-local-storage-state';
import { FLOATING_JSON_ENABLED } from '@/lib/storage-keys';

/**
 * Persists user's preference for displaying the generated JSON as a floating
 * panel on small screens.
 *
 * @returns A tuple containing the current enabled state and a setter.
 */
export function useFloatingJson() {
  return useLocalStorageState(FLOATING_JSON_ENABLED, false);
}
