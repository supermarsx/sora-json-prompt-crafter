import { useEffect, useState } from 'react';
import { safeGet, safeSet } from '@/lib/storage';

export function useActionLabels() {
  const [enabled, setEnabled] = useState(() => {
    const stored = safeGet('actionLabelsEnabled');
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    safeSet('actionLabelsEnabled', JSON.stringify(enabled));
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
