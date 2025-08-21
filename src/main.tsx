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

const RELOAD_MILESTONES: [number, AnalyticsEvent][] = [
  [10, AnalyticsEvent.AppReload10],
  [30, AnalyticsEvent.AppReload30],
  [70, AnalyticsEvent.AppReload70],
  [100, AnalyticsEvent.AppReload100],
  [500, AnalyticsEvent.AppReload500],
  [1000, AnalyticsEvent.AppReload1000],
];

try {
  const count = (safeGet<number>(APP_RELOAD_COUNT, 0, true) as number) ?? 0;
  const newCount = count + 1;
  safeSet(APP_RELOAD_COUNT, newCount, true);
  const milestones =
    (safeGet<number[]>(APP_RELOAD_MILESTONES, [], true) as number[]) ?? [];
  const trackingEnabled =
    (safeGet<string>(TRACKING_ENABLED, 'true') as string) !== 'false';
  for (const [threshold, event] of RELOAD_MILESTONES) {
    if (newCount >= threshold && !milestones.includes(threshold)) {
      trackEvent(trackingEnabled, event);
      milestones.push(threshold);
    }
  }
  safeSet(APP_RELOAD_MILESTONES, milestones, true);
} catch {
  console.error('Reload counter: There was an error.');
}

createRoot(document.getElementById('root')!).render(<App />);
