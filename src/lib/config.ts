type Env = Record<string, string | undefined> | undefined;

function getEnvVar(key: string): string | undefined {
  const metaEnv = (globalThis as { import?: { meta?: { env?: Env } } }).import
    ?.meta?.env as Env;
  if (metaEnv && key in metaEnv) {
    return metaEnv[key];
  }
  if (typeof process !== 'undefined') {
    return (process as { env?: Env }).env?.[key];
  }
  return undefined;
}

const measurementId = getEnvVar('VITE_MEASUREMENT_ID');
export const MEASUREMENT_ID = measurementId ?? 'G-RVR9TSBQL7';

const disableAnalytics = getEnvVar('VITE_DISABLE_ANALYTICS');
export const DISABLE_ANALYTICS =
  disableAnalytics === 'true' || disableAnalytics === '1';

const disableStats = getEnvVar('VITE_DISABLE_STATS');
export const DISABLE_STATS = disableStats === 'true' || disableStats === '1';

const gtagDebug = getEnvVar('VITE_GTAG_DEBUG');
export const GTAG_DEBUG = gtagDebug === 'true' || gtagDebug === '1';
