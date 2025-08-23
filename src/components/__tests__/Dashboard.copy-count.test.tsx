import { render, screen, fireEvent, act } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import {
  JSON_COPY_COUNT,
  JSON_COPY_MILESTONES,
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

describe('Dashboard copy counter', () => {
  beforeEach(() => {
    localStorage.clear();
    (trackEvent as jest.Mock).mockClear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('persists copy count across sessions', async () => {
    jest.useFakeTimers();
    localStorage.setItem(JSON_COPY_COUNT, '5');
    localStorage.setItem(JSON_COPY_MILESTONES, '[]');
    const { unmount } = render(<Dashboard />);
    const btn = screen.getByRole('button', { name: /copy/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    expect(JSON.parse(localStorage.getItem(JSON_COPY_COUNT) || '0')).toBe(6);
    unmount();
    render(<Dashboard />);
    const btn2 = screen.getByRole('button', { name: /copy/i });
    await act(async () => {
      fireEvent.click(btn2);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    expect(JSON.parse(localStorage.getItem(JSON_COPY_COUNT) || '0')).toBe(7);
  });

  test('emits milestone events once', async () => {
    jest.useFakeTimers();
    localStorage.setItem(JSON_COPY_COUNT, '9');
    localStorage.setItem(JSON_COPY_MILESTONES, '[]');
    render(<Dashboard />);
    const btn = screen.getByRole('button', { name: /copy/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    let calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.CopyJson10,
    );
    expect(calls.length).toBe(1);
    expect(
      JSON.parse(localStorage.getItem(JSON_COPY_MILESTONES) || '[]'),
    ).toEqual([10]);

    (trackEvent as jest.Mock).mockClear();
    await act(async () => {
      fireEvent.click(btn);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.CopyJson10,
    );
    expect(calls.length).toBe(0);
    expect(
      JSON.parse(localStorage.getItem(JSON_COPY_MILESTONES) || '[]'),
    ).toEqual([10]);
  });
});

