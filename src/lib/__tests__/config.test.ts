import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { USERSCRIPT_VERSION as VERSION_FROM_VERSION } from '../../version';
import { USERSCRIPT_VERSION as VERSION_FROM_CONFIG } from '../config';

const metaEnv = (
  globalThis as unknown as {
    import: { meta: { env: Record<string, string | undefined> } };
  }
).import.meta.env;

function clearEnv() {
  delete metaEnv.VITE_MEASUREMENT_ID;
  delete metaEnv.VITE_DISABLE_ANALYTICS;
  delete metaEnv.VITE_DISABLE_STATS;
  delete metaEnv.VITE_GTAG_DEBUG;
  delete process.env.VITE_MEASUREMENT_ID;
  delete process.env.VITE_DISABLE_ANALYTICS;
  delete process.env.VITE_DISABLE_STATS;
  delete process.env.VITE_GTAG_DEBUG;
}

describe('config', () => {
  beforeEach(() => {
    clearEnv();
    jest.resetModules();
  });

  afterEach(() => {
    clearEnv();
    jest.resetModules();
  });

  test('reads values from import.meta.env', async () => {
    metaEnv.VITE_MEASUREMENT_ID = 'AAA';
    metaEnv.VITE_DISABLE_ANALYTICS = 'true';
    metaEnv.VITE_DISABLE_STATS = '1';
    metaEnv.VITE_GTAG_DEBUG = 'true';

    const config = await import('../config');
    expect(config.MEASUREMENT_ID).toBe('AAA');
    expect(config.DISABLE_ANALYTICS).toBe(true);
    expect(config.DISABLE_STATS).toBe(true);
    expect(config.GTAG_DEBUG).toBe(true);
  });

  test('falls back to process.env when import.meta.env undefined', async () => {
    process.env.VITE_MEASUREMENT_ID = 'BBB';
    process.env.VITE_DISABLE_ANALYTICS = '1';
    process.env.VITE_DISABLE_STATS = 'true';
    process.env.VITE_GTAG_DEBUG = '1';
    const config = await import('../config');
    expect(config.MEASUREMENT_ID).toBe('BBB');
    expect(config.DISABLE_ANALYTICS).toBe(true);
    expect(config.DISABLE_STATS).toBe(true);
    expect(config.GTAG_DEBUG).toBe(true);
  });

  test('uses defaults when env variables are missing', async () => {
    const config = await import('../config');
    expect(config.MEASUREMENT_ID).toBe('G-RVR9TSBQL7');
    expect(config.DISABLE_ANALYTICS).toBe(false);
    expect(config.DISABLE_STATS).toBe(false);
    expect(config.GTAG_DEBUG).toBe(false);
  });

  test('re-exports USERSCRIPT_VERSION correctly', () => {
    expect(VERSION_FROM_CONFIG).toBe(VERSION_FROM_VERSION);
  });
});
