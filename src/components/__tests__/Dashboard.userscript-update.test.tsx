import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { USERSCRIPT_VERSION } from '@/version';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { useSoraUserscript } from '@/hooks/use-sora-userscript';

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
  useSoraUserscript: jest.fn(),
}));
jest.mock('@/hooks/use-github-stats', () => ({
  __esModule: true,
  useGithubStats: jest.fn(() => ({})),
}));

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseSoraUserscript = useSoraUserscript as jest.Mock;

describe('Dashboard userscript update button', () => {
  beforeEach(() => {
    localStorage.setItem('soraToolsEnabled', 'true');
    mockedUseSoraUserscript.mockReturnValue([true, '0.9']);
    (trackEvent as jest.Mock).mockClear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('shows update button when version differs', () => {
    render(<Dashboard />);
    const btn = screen.getByRole('link', { name: /update userscript/i });
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.UpdateUserscript);
  });

  test('hides update button when version matches', () => {
    mockedUseSoraUserscript.mockReturnValue([true, USERSCRIPT_VERSION]);
    render(<Dashboard />);
    expect(
      screen.queryByRole('link', { name: /update userscript/i }),
    ).toBeNull();
  });
});
