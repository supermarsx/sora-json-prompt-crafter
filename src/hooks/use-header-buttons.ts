import { useLocalStorageState } from './use-local-storage-state';
import { HEADER_BUTTONS_ENABLED } from '@/lib/storage-keys';

export function useHeaderButtons() {
  return useLocalStorageState(HEADER_BUTTONS_ENABLED, true);
}
