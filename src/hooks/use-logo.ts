import { useLocalStorageState } from './use-local-storage-state';
import { LOGO_ENABLED } from '@/lib/storage-keys';

export function useLogo() {
  return useLocalStorageState(LOGO_ENABLED, true);
}
