import { useLocalStorageState } from './use-local-storage-state';
import { SORA_TOOLS_ENABLED } from '@/lib/storage-keys';

export function useSoraTools() {
  return useLocalStorageState(SORA_TOOLS_ENABLED, false);
}
