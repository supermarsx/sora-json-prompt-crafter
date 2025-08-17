import { DISABLE_ANALYTICS } from '@/lib/config';
import { useLocalStorageState } from './use-local-storage-state';
import { TRACKING_ENABLED } from '@/lib/storage-keys';

/**
 * Manage the user's analytics tracking preference.
 *
 * Persists the state in `localStorage` using the `TRACKING_ENABLED` key.
 * The default value is `true` unless analytics are globally disabled via
 * `DISABLE_ANALYTICS`, in which case it defaults to `false`.
 *
 * @returns A tuple `[enabled, setEnabled]` with the current tracking state
 * and a setter to update it.
 */
export function useTracking() {
  return useLocalStorageState(
    TRACKING_ENABLED,
    DISABLE_ANALYTICS ? false : true,
  );
}
