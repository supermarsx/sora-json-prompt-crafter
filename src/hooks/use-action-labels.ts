import { useLocalStorageState } from './use-local-storage-state';
import { ACTION_LABELS_ENABLED } from '@/lib/storage-keys';

export function useActionLabels() {
  return useLocalStorageState(ACTION_LABELS_ENABLED, true);
}
