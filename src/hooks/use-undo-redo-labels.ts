import { useLocalStorageState } from './use-local-storage-state';
import { UNDO_REDO_LABELS_ENABLED } from '@/lib/storage-keys';

export function useUndoRedoLabels() {
  return useLocalStorageState(UNDO_REDO_LABELS_ENABLED, true);
}
