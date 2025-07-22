import { useEffect, useState } from 'react';
import { safeGet } from '@/lib/storage';
import { TRACKING_HISTORY } from '@/lib/storage-keys';

export interface ActionEntry {
  date: string;
  action: string;
}

export function useActionHistory() {
  const [history, setHistory] = useState<ActionEntry[]>(() => {
    return safeGet<ActionEntry[]>(TRACKING_HISTORY, [], true);
  });

  useEffect(() => {
    const handler = () => {
      setHistory(safeGet<ActionEntry[]>(TRACKING_HISTORY, [], true));
    };
    window.addEventListener('trackingHistoryUpdate', handler);
    return () => window.removeEventListener('trackingHistoryUpdate', handler);
  }, []);

  return history;
}
