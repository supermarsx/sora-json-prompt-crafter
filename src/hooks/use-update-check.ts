import { useCallback } from 'react';

export function useUpdateCheck() {
  return useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return;
      await registration.update();
      if (registration.waiting) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Service worker update check failed', error);
    }
  }, []);
}

export default useUpdateCheck;
