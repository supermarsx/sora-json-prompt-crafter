import { DISABLE_ANALYTICS } from '@/lib/config';
import { useLocalStorageState } from './use-local-storage-state';
import { TRACKING_ENABLED } from '@/lib/storage-keys';

export function useTracking() {
  return useLocalStorageState(
    TRACKING_ENABLED,
    DISABLE_ANALYTICS ? false : true,
  );
}
