import { render, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import {
  UNDO_COUNT,
  UNDO_MILESTONES,
  REDO_COUNT,
  REDO_MILESTONES,
} from '@/lib/storage-keys';

jest.mock('../HistoryPanel', () => ({ __esModule: true, default: () => null }));
jest.mock('../ControlPanel', () => ({
  __esModule: true,
  ControlPanel: () => null,
}));
jest.mock('../ShareModal', () => ({
  __esModule: true,
  ShareModal: () => null,
}));
jest.mock('../ImportModal', () => ({ __esModule: true, default: () => null }));
jest.mock('../Footer', () => ({ __esModule: true, default: () => null }));
jest.mock('../DisclaimerModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../ProgressBar', () => ({
  __esModule: true,
  ProgressBar: () => null,
  default: () => null,
}));
jest.mock('@/hooks/use-single-column', () => ({
  __esModule: true,
  useIsSingleColumn: jest.fn(() => false),
}));
jest.mock('@/hooks/use-dark-mode', () => ({
  __esModule: true,
  useDarkMode: jest.fn(() => [false, jest.fn()] as const),
}));
jest.mock('@/hooks/use-dark-mode-toggle-visibility', () => ({
  __esModule: true,
  useDarkModeToggleVisibility: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-action-history', () => ({
  __esModule: true,
  useActionHistory: jest.fn(() => []),
}));
jest.mock('@/hooks/use-sora-userscript', () => ({
  __esModule: true,
  useSoraUserscript: jest.fn(() => [true, '1.0'] as const),
}));
jest.mock('@/hooks/use-github-stats', () => ({
  __esModule: true,
  useGithubStats: jest.fn(() => ({})),
}));
jest.mock('@/hooks/use-clipboard', () => ({
  __esModule: true,
  useClipboard: () => ({ copy: jest.fn(() => Promise.resolve(true)) }),
}));
jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('Dashboard keyboard undo/redo counters', () => {
  beforeEach(() => {
    localStorage.clear();
    (trackEvent as jest.Mock).mockClear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('keyboard shortcuts increment counters and emit milestones once', () => {
    localStorage.setItem(UNDO_COUNT, '99');
    localStorage.setItem(UNDO_MILESTONES, '[]');
    localStorage.setItem(REDO_COUNT, '99');
    localStorage.setItem(REDO_MILESTONES, '[]');
    render(<Dashboard />);

    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    let calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Undo100,
    );
    expect(JSON.parse(localStorage.getItem(UNDO_COUNT) || '0')).toBe(100);
    expect(calls.length).toBe(1);
    expect(JSON.parse(localStorage.getItem(UNDO_MILESTONES) || '[]')).toEqual([100]);

    (trackEvent as jest.Mock).mockClear();
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Undo100,
    );
    expect(JSON.parse(localStorage.getItem(UNDO_COUNT) || '0')).toBe(101);
    expect(calls.length).toBe(0);
    expect(JSON.parse(localStorage.getItem(UNDO_MILESTONES) || '[]')).toEqual([100]);

    (trackEvent as jest.Mock).mockClear();
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Redo100,
    );
    expect(JSON.parse(localStorage.getItem(REDO_COUNT) || '0')).toBe(100);
    expect(calls.length).toBe(1);
    expect(JSON.parse(localStorage.getItem(REDO_MILESTONES) || '[]')).toEqual([100]);

    (trackEvent as jest.Mock).mockClear();
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Redo100,
    );
    expect(JSON.parse(localStorage.getItem(REDO_COUNT) || '0')).toBe(101);
    expect(calls.length).toBe(0);
    expect(JSON.parse(localStorage.getItem(REDO_MILESTONES) || '[]')).toEqual([100]);
  });
});

