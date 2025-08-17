import { useLocalStorageState } from './use-local-storage-state';
import { LOGO_ENABLED } from '@/lib/storage-keys';

/**
 * Manages whether the app logo is displayed.
 * Defaults to `true` and persists the preference in localStorage.
 */
export function useLogo() {
  return useLocalStorageState(LOGO_ENABLED, true);
}
