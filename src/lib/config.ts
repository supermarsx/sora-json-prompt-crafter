let measurementId: string | undefined;
try {
  measurementId = new Function(
    'return import.meta.env.VITE_MEASUREMENT_ID',
  )() as string | undefined;
} catch {
  if (typeof process !== 'undefined') {
    measurementId = process.env.VITE_MEASUREMENT_ID;
  }
}
export const MEASUREMENT_ID = measurementId ?? 'G-RVR9TSBQL7';

let disableAnalytics: string | undefined;
try {
  disableAnalytics = new Function(
    'return import.meta.env.VITE_DISABLE_ANALYTICS',
  )() as string | undefined;
} catch {
  if (typeof process !== 'undefined') {
    disableAnalytics = process.env.VITE_DISABLE_ANALYTICS;
  }
}
export const DISABLE_ANALYTICS =
  disableAnalytics === 'true' || disableAnalytics === '1';

let disableStats: string | undefined;
try {
  disableStats = new Function('return import.meta.env.VITE_DISABLE_STATS')() as
    | string
    | undefined;
} catch {
  if (typeof process !== 'undefined') {
    disableStats = process.env.VITE_DISABLE_STATS;
  }
}
export const DISABLE_STATS = disableStats === 'true' || disableStats === '1';

let gtagDebug: string | undefined;
try {
  gtagDebug = new Function('return import.meta.env.VITE_GTAG_DEBUG')() as
    | string
    | undefined;
} catch {
  if (typeof process !== 'undefined') {
    gtagDebug = process.env.VITE_GTAG_DEBUG;
  }
}
export const GTAG_DEBUG = gtagDebug === 'true' || gtagDebug === '1';
