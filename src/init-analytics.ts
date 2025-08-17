/**
 * Immediately invoked analytics setup that conditionally loads Google Analytics
 * and exposes a global `gtag` helper when tracking is enabled.
 */
export {};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

(() => {
  try {
    const disabled = import.meta.env.VITE_DISABLE_ANALYTICS === 'true';
    if (disabled) return;
    const enabled = localStorage.getItem('trackingEnabled');
    if (enabled === null || enabled === 'true') {
      const id = import.meta.env.VITE_MEASUREMENT_ID || 'G-RVR9TSBQL7';
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      /**
       * Pushes tracking events to the Google Analytics dataLayer.
       * @param args Event parameters forwarded to GA.
       */
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', id);
    }
  } catch (e) {
    console.error('Tracking initialization failed', e);
  }
})();
