import { MOBILE_BREAKPOINT, SINGLE_COLUMN_BREAKPOINT } from '../breakpoints';
import {
  DARK_MODE,
  SORA_TOOLS_ENABLED,
  HEADER_BUTTONS_ENABLED,
  LOGO_ENABLED,
  ACTION_LABELS_ENABLED,
  CORE_ACTION_LABELS_ONLY,
  TRACKING_ENABLED,
  TRACKING_HISTORY,
  LOCALE,
  CURRENT_JSON,
  JSON_HISTORY,
  GITHUB_STATS,
  GITHUB_STATS_TIMESTAMP,
} from '../storage-keys';

describe('constants', () => {
  test('breakpoints', () => {
    expect(MOBILE_BREAKPOINT).toBe(768);
    expect(SINGLE_COLUMN_BREAKPOINT).toBe(1024);
  });

  test('storage keys', () => {
    expect(DARK_MODE).toBe('darkMode');
    expect(SORA_TOOLS_ENABLED).toBe('soraToolsEnabled');
    expect(HEADER_BUTTONS_ENABLED).toBe('headerButtonsEnabled');
    expect(LOGO_ENABLED).toBe('logoEnabled');
    expect(ACTION_LABELS_ENABLED).toBe('actionLabelsEnabled');
    expect(CORE_ACTION_LABELS_ONLY).toBe('coreActionLabelsOnly');
    expect(TRACKING_ENABLED).toBe('trackingEnabled');
    expect(TRACKING_HISTORY).toBe('trackingHistory');
    expect(LOCALE).toBe('locale');
    expect(CURRENT_JSON).toBe('currentJson');
    expect(JSON_HISTORY).toBe('jsonHistory');
    expect(GITHUB_STATS).toBe('githubStats');
    expect(GITHUB_STATS_TIMESTAMP).toBe('githubStatsTimestamp');
  });
});
