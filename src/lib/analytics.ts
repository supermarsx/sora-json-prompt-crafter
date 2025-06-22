export function trackEvent(enabled: boolean, event: string, params?: Record<string, unknown>) {
  if (!enabled) return;
  const gtag = (window as unknown as { gtag?: (action: string, eventName: string, params?: Record<string, unknown>) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', event, params);
  }
}
