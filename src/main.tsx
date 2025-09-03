/**
 * Bootstraps the React application and tracks reload milestones.
 */

/**
 * Conditionally import analytics to avoid side effects during testing.
 */
if (process.env.NODE_ENV !== 'test') {
  import('./init-analytics');
}
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { safeGet, safeSet } from '@/lib/storage';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import {
  APP_RELOAD_COUNT,
  APP_RELOAD_MILESTONES,
  TRACKING_ENABLED,
} from '@/lib/storage-keys';
import { toast } from '@/components/ui/sonner-toast';
import i18n from '@/i18n';
import { injectCustomCode } from '@/lib/inject-custom-code';

/**
 * Maps reload count thresholds to corresponding analytics events.
 * Each tuple contains `[threshold, event]` pairs.
 */
const RELOAD_MILESTONES: [number, AnalyticsEvent][] = [
  [10, AnalyticsEvent.AppReload10],
  [30, AnalyticsEvent.AppReload30],
  [70, AnalyticsEvent.AppReload70],
  [100, AnalyticsEvent.AppReload100],
  [500, AnalyticsEvent.AppReload500],
  [1000, AnalyticsEvent.AppReload1000],
];

/**
 * Track and persist the app reload count, triggering milestone events.
 *
 * Side effects:
 * - Persists updated reload count and milestones in storage.
 * - Emits analytics events and toast notifications for new milestones.
 * - Logs an error without interrupting app startup when tracking fails.
 */
try {
  const count = (safeGet<number>(APP_RELOAD_COUNT, 0, true) as number) ?? 0;
  // Increment reload count
  const newCount = count + 1;
  safeSet(APP_RELOAD_COUNT, newCount, true);
  const milestones =
    (safeGet<number[]>(APP_RELOAD_MILESTONES, [], true) as number[]) ?? [];
  const trackingEnabled =
    (safeGet<string>(TRACKING_ENABLED, 'true') as string) !== 'false';
  // Loop through milestones and fire events when thresholds are reached
  for (const [threshold, event] of RELOAD_MILESTONES) {
    if (newCount >= threshold && !milestones.includes(threshold)) {
      trackEvent(trackingEnabled, event);
      toast.success(i18n.t('milestoneReached', { threshold }));
      milestones.push(threshold);
    }
  }
  safeSet(APP_RELOAD_MILESTONES, milestones, true);
} catch {
  // Log error without stopping the app
  console.error('Reload counter: There was an error.');
}

// Inject any user-provided CSS/JS before rendering
injectCustomCode();

createRoot(document.getElementById('root')!).render(<App />);
