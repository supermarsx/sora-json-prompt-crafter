import { useEffect } from 'react';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';

/**
 * Track element resize events and dispatch an analytics event when dimensions change.
 *
 * Utilizes `ResizeObserver` to monitor the width and height of the provided element
 * and throttles tracking to once per second to avoid flooding analytics with rapid
 * resize events.
 *
 * @param ref - React ref to the HTML element being observed.
 * @param trackingEnabled - Whether analytics tracking is currently enabled.
 * @param event - The analytics event identifier to send when a resize is detected.
 */
export function useResizeTracker(
  ref: React.RefObject<HTMLElement>,
  trackingEnabled: boolean,
  event: AnalyticsEvent,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let prevWidth = el.offsetWidth;
    let prevHeight = el.offsetHeight;
    let lastTracked = 0;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width !== prevWidth || height !== prevHeight) {
          prevWidth = width;
          prevHeight = height;
          const now = Date.now();
          if (now - lastTracked > 1000) {
            lastTracked = now;
            trackEvent(trackingEnabled, event);
          }
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, trackingEnabled, event]);
}
