import { MOBILE_BREAKPOINT, SINGLE_COLUMN_BREAKPOINT } from '../breakpoints';
import {
  DARK_MODE,
  SORA_TOOLS_ENABLED,
  HEADER_BUTTONS_ENABLED,
  LOGO_ENABLED,
  ACTION_LABELS_ENABLED,
  TRACKING_ENABLED,
  LOCALE,
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
    expect(TRACKING_ENABLED).toBe('trackingEnabled');
    expect(LOCALE).toBe('locale');
  });
});
