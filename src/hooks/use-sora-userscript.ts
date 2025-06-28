import { useEffect, useState } from 'react';
import { safeGet, safeSet } from '@/lib/storage';

const USERSCRIPT_COOKIE_NAME = 'soraUserscriptInstalled';
const USERSCRIPT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookie(name: string) {
  const match = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)',
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function useSoraUserscript() {
  const [installed, setInstalled] = useState(() => {
    const stored = safeGet(USERSCRIPT_COOKIE_NAME);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch {
        return false;
      }
    }
    const cookie = getCookie(USERSCRIPT_COOKIE_NAME);
    return cookie === 'true';
  });

  useEffect(() => {
    const ok = safeSet(USERSCRIPT_COOKIE_NAME, JSON.stringify(installed));
    if (!ok) {
      document.cookie = `${USERSCRIPT_COOKIE_NAME}=${installed}; path=/; max-age=${USERSCRIPT_COOKIE_MAX_AGE}`;
    }
  }, [installed]);

  useEffect(() => {
    window.soraUserscriptReady = () => setInstalled(true);
    return () => {
      delete window.soraUserscriptReady;
    };
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SORA_USERSCRIPT_READY') {
        setInstalled(true);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === USERSCRIPT_COOKIE_NAME && event.newValue === 'true') {
        setInstalled(true);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return [installed, setInstalled] as const;
}
