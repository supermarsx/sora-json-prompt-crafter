import { useLocalStorageState } from './use-local-storage-state';
import { COPY_LABELS_ENABLED } from '@/lib/storage-keys';

export function useCopyLabels() {
  return useLocalStorageState(COPY_LABELS_ENABLED, true);
}
