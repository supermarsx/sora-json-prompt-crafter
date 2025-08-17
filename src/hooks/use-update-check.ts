import { useCallback, useState } from 'react';

/**
 * Checks the service worker for updates and tracks availability.
 * `updateAvailable` starts as `false` and becomes `true` when a waiting worker exists.
 */
export function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdate = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) return;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration || !registration.active) return;
      await registration.update();
      if (registration.waiting) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error('Service worker update check failed', error);
    }
  }, []);

  return { checkForUpdate, updateAvailable };
}

export default useUpdateCheck;
