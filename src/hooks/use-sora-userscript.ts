import { useEffect, useState } from 'react';
import { safeGet, safeSet } from '@/lib/storage';

export function useSoraUserscript() {
  const [installed, setInstalled] = useState(() => {
    const stored = safeGet('soraUserscriptInstalled');
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
    safeSet('soraUserscriptInstalled', JSON.stringify(installed));
  }, [installed]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SORA_USERSCRIPT_READY') {
        setInstalled(true);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return [installed, setInstalled] as const;
}
