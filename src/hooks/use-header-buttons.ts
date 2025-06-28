import { useEffect, useState } from 'react';
import { safeGet, safeSet } from '@/lib/storage';

export function useHeaderButtons() {
  const [enabled, setEnabled] = useState(() => {
    const stored = safeGet('headerButtonsEnabled');
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
    safeSet('headerButtonsEnabled', JSON.stringify(enabled));
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
