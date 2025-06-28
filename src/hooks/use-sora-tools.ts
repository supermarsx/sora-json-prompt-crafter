import { useEffect, useState } from 'react';
import { safeGet, safeSet } from '@/lib/storage';

export function useSoraTools() {
  const [enabled, setEnabled] = useState(() => {
    const stored = safeGet('soraToolsEnabled');
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    safeSet('soraToolsEnabled', JSON.stringify(enabled));
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
