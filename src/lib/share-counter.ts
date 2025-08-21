import { safeGet, safeSet } from './storage';
import { trackEvent, AnalyticsEvent } from './analytics';
import { SHARE_COUNT, SHARE_MILESTONES } from './storage-keys';

const SHARE_MILESTONE_EVENTS: [number, AnalyticsEvent][] = [
  [5, AnalyticsEvent.Share5],
  [10, AnalyticsEvent.Share10],
  [50, AnalyticsEvent.Share50],
  [100, AnalyticsEvent.Share100],
  [1000, AnalyticsEvent.Share1000],
  [10000, AnalyticsEvent.Share10000],
];

/**
 * Track a share-related analytics event and update the persistent share counter.
 * Emits milestone events when thresholds are crossed.
 */
export function trackShare(enabled: boolean, event: AnalyticsEvent) {
  trackEvent(enabled, event);
  try {
    const count = (safeGet<number>(SHARE_COUNT, 0, true) as number) ?? 0;
    const newCount = count + 1;
    safeSet(SHARE_COUNT, newCount, true);
    const milestones =
      (safeGet<number[]>(SHARE_MILESTONES, [], true) as number[]) ?? [];
    for (const [threshold, milestoneEvent] of SHARE_MILESTONE_EVENTS) {
      if (newCount >= threshold && !milestones.includes(threshold)) {
        trackEvent(enabled, milestoneEvent);
        milestones.push(threshold);
      }
    }
    safeSet(SHARE_MILESTONES, milestones, true);
  } catch {
    console.error('Share counter: There was an error.');
  }
}
