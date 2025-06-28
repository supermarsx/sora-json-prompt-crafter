import { useEffect, useState } from 'react';
import { safeGet, safeSet } from '@/lib/storage';

export function useLogo() {
  const [enabled, setEnabled] = useState(() => {
    const stored = safeGet('logoEnabled');
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
    safeSet('logoEnabled', JSON.stringify(enabled));
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
