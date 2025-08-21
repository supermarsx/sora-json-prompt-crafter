import { useEffect } from 'react';
import { safeGet, safeSet } from '@/lib/storage';
import { TOTAL_SECONDS, TIME_MILESTONES } from '@/lib/storage-keys';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { useTracking } from './use-tracking';

const THRESHOLDS: [number, AnalyticsEvent][] = [
  [5 * 60, AnalyticsEvent.Time5Min],
  [10 * 60, AnalyticsEvent.Time10Min],
  [30 * 60, AnalyticsEvent.Time30Min],
  [60 * 60, AnalyticsEvent.Time1Hour],
  [3 * 60 * 60, AnalyticsEvent.Time3Hour],
  [8 * 60 * 60, AnalyticsEvent.Time8Hour],
  [12 * 60 * 60, AnalyticsEvent.Time12Hour],
  [2 * 24 * 60 * 60, AnalyticsEvent.Time2Day],
  [4 * 24 * 60 * 60, AnalyticsEvent.Time4Day],
  [7 * 24 * 60 * 60, AnalyticsEvent.Time7Day],
  [14 * 24 * 60 * 60, AnalyticsEvent.Time2Week],
  [28 * 24 * 60 * 60, AnalyticsEvent.Time4Week],
  [60 * 24 * 60 * 60, AnalyticsEvent.Time2Month],
  [120 * 24 * 60 * 60, AnalyticsEvent.Time4Month],
  [240 * 24 * 60 * 60, AnalyticsEvent.Time8Month],
];

/**
 * Tracks the total time the app has been used across sessions.
 *
 * Persists the accumulated seconds in localStorage and emits analytics
 * events when predefined thresholds are crossed.
 */
export function useTotalTime() {
  const [trackingEnabled] = useTracking();

  useEffect(() => {
    let total = (safeGet<number>(TOTAL_SECONDS, 0, true) as number) ?? 0;
    const milestones = (safeGet<number[]>(TIME_MILESTONES, [], true) as number[]) ?? [];
    let last = Date.now();

    const tick = () => {
      const now = Date.now();
      const diff = Math.floor((now - last) / 1000);
      if (diff > 0) {
        total += diff;
        last = now;
        safeSet(TOTAL_SECONDS, total, true);
        for (const [threshold, event] of THRESHOLDS) {
          if (total >= threshold && !milestones.includes(threshold)) {
            trackEvent(trackingEnabled, event);
            milestones.push(threshold);
          }
        }
        safeSet(TIME_MILESTONES, milestones, true);
      }
    };

    const interval = window.setInterval(tick, 1000);
    const handleUnload = () => {
      tick();
      clearInterval(interval);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [trackingEnabled]);
}

