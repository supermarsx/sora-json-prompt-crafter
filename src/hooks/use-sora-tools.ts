import { useLocalStorageState } from './use-local-storage-state';
import { SORA_TOOLS_ENABLED } from '@/lib/storage-keys';

/**
 * Enables access to experimental Sora tools.
 * Defaults to `false` and persists the choice in localStorage.
 */
export function useSoraTools() {
  return useLocalStorageState(SORA_TOOLS_ENABLED, false);
}
