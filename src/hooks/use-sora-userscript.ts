import { useEffect, useRef, useState } from 'react';

/**
 * Hook that manages Sora userscript detection and communication.
 *
 * @param debug - When true, verbose debug messages are logged to the console.
 * @returns A tuple with installation status and the detected version.
 */
export function useSoraUserscript(debug = true) {
  const [installed, setInstalled] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (debug) {
      console.debug('[Sora Loader] Initialization');
    }
    timeoutRef.current = window.setTimeout(() => {
      setInstalled(false);
      setVersion(null);
      if (debug) {
        console.debug('[Sora Loader] No response, resetting state');
      }
    }, 3000);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [debug]);

  useEffect(() => {
    window.soraUserscriptReady = (ver?: string) => {
      if (debug) {
        console.debug('[Sora Loader] userscriptReady callback invoked');
      }
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setInstalled(true);
      if (ver) setVersion(ver);
      window.postMessage({ type: 'SORA_USERSCRIPT_ACK' }, '*');
      if (debug) {
        console.debug('[Sora Loader] ACK sent');
      }
    };
    return () => {
      delete window.soraUserscriptReady;
    };
  }, [debug]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SORA_USERSCRIPT_READY') {
        if (debug) {
          console.debug('[Sora Loader] READY received');
        }
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        setInstalled(true);
        if (event.data.version) setVersion(event.data.version);
        (event.source as Window | null)?.postMessage(
          { type: 'SORA_USERSCRIPT_ACK' },
          '*',
        );
        if (debug) {
          console.debug('[Sora Loader] ACK sent');
          (event.source as Window | null)?.postMessage(
            { type: 'SORA_DEBUG_PING' },
            '*',
          );
        }
      } else if (event.data?.type === 'SORA_DEBUG_PING') {
        if (debug) {
          console.debug('[Sora Loader] Debug ping received');
        }
        (event.source as Window | null)?.postMessage(
          { type: 'SORA_DEBUG_PONG' },
          '*',
        );
      } else if (event.data?.type === 'SORA_DEBUG_PONG') {
        if (debug) {
          console.debug('[Sora Loader] Debug pong received');
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [debug]);

  return [installed, version] as const;
}
