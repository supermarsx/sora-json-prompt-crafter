import { useEffect, useRef, useState } from 'react';

export function useSoraUserscript() {
  const [installed, setInstalled] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setInstalled(false);
      setVersion(null);
    }, 3000);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    window.soraUserscriptReady = (ver?: string) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setInstalled(true);
      if (ver) setVersion(ver);
      window.postMessage({ type: 'SORA_USERSCRIPT_ACK' }, '*');
    };
    return () => {
      delete window.soraUserscriptReady;
    };
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SORA_USERSCRIPT_READY') {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        setInstalled(true);
        if (event.data.version) setVersion(event.data.version);
        (event.source as Window | null)?.postMessage(
          { type: 'SORA_USERSCRIPT_ACK' },
          '*',
        );
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return [installed, version] as const;
}
