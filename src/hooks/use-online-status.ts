import * as React from 'react';

/**
 * Tracks the browser's online status.
 *
 * Listens to the global `online` and `offline` events and returns the current
 * `navigator.onLine` value, defaulting to `true` when the navigator is
 * undefined.
 *
 * @returns {boolean} `true` if the browser reports being online, otherwise `false`.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  React.useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return isOnline;
}
