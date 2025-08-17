import { safeGet, safeSet } from './storage';
import { MEASUREMENT_ID, GTAG_DEBUG } from './config';
import { TRACKING_HISTORY } from './storage-keys';

let trackingFailures = 0;
let trackingDead = false;
let gtagMissingLogged = false;

export function trackEvent(
  enabled: boolean,
  event: string,
  params?: Record<string, unknown>,
) {
  if (!enabled) return;

  try {
    const list = safeGet<{ date: string; action: string }[]>(
      TRACKING_HISTORY,
      [],
      { json: true },
    ) as { date: string; action: string }[];
    list.unshift({ date: new Date().toLocaleString(), action: event });
    if (list.length > 100) list.length = 100;
    if (!safeSet(TRACKING_HISTORY, list, { json: true })) throw new Error('fail');
    window.dispatchEvent(new Event('trackingHistoryUpdate'));
  } catch {
    console.error('Tracking History: There was an error.');
  }

  if (trackingDead) return;

  const gtag = (
    window as unknown as {
      gtag?: (
        action: string,
        eventName: string,
        params?: Record<string, unknown>,
      ) => void;
    }
  ).gtag;

  if (typeof gtag !== 'function') {
    if (!gtagMissingLogged) {
      console.warn('Tracking Analytics: gtag function missing.');
      gtagMissingLogged = true;
    }
    return;
  }

  try {
    const eventParams: Record<string, unknown> = {
      send_to: MEASUREMENT_ID,
      action: event,
      ...params,
    };
    if (GTAG_DEBUG) {
      eventParams.debug_mode = true;
      console.debug('gtag event', event, params);
    }
    gtag('event', event, eventParams);
  } catch (e) {
    trackingFailures++;
    if (trackingFailures <= 5) {
      console.error('Tracking Analytics: There was an error.');
    }
    if (trackingFailures > 5 && !trackingDead) {
      trackingDead = true;
      console.error(
        'Tracking Analytics: Too many errors, tracking permanently failed.',
      );
    }
  }
}
