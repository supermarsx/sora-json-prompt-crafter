import { useEffect, useState } from 'react';
import { safeGet } from '@/lib/storage';
import { TRACKING_HISTORY } from '@/lib/storage-keys';

/**
 * Represents a single tracked action entry retrieved from storage.
 * `date` is an ISO string of when the action occurred and `action`
 * is a brief description of the event.
 */
export interface ActionEntry {
  date: string;
  action: string;
}

/**
 * React hook that returns the user's tracked action history.
 *
 * It reads the initial list from `localStorage` and listens for
 * `trackingHistoryUpdate` events to refresh when another part of the
 * application updates the stored history.
 *
 * @returns Array of {@link ActionEntry} items describing past actions.
 */
export function useActionHistory() {
  const [history, setHistory] = useState<ActionEntry[]>(() => {
    return safeGet<ActionEntry[]>(TRACKING_HISTORY, [], true);
  });

  useEffect(() => {
    const handler = () => {
      setHistory(safeGet<ActionEntry[]>(TRACKING_HISTORY, [], true));
    };
    // Refresh the state whenever another part of the app dispatches the
    // custom `trackingHistoryUpdate` event after writing to storage.
    window.addEventListener('trackingHistoryUpdate', handler);
    return () => window.removeEventListener('trackingHistoryUpdate', handler);
  }, []);

  return history;
}
