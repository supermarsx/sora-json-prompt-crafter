import { render, waitFor, act } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent } from '@/lib/analytics';

let copyFn: ((json: string) => void) | null = null;
jest.mock('../HistoryPanel', () => ({
  __esModule: true,
  default: ({ onCopy }: { onCopy: (json: string) => void }) => {
    copyFn = onCopy;
    return null;
  },
}));
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
jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-action-history', () => ({
  __esModule: true,
  useActionHistory: jest.fn(() => []),
}));
jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('Dashboard github stats failure', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    (toast.error as jest.Mock).mockClear();
    localStorage.clear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('shows toast when stats fetch rejects', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('fail')) as unknown as typeof fetch;
    render(<Dashboard />);
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to load GitHub stats'),
    );
  });

  test('shows toast when stats response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn(),
    } as unknown as Response);
    render(<Dashboard />);
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to load GitHub stats'),
    );
  });
});

describe('Dashboard github stats abort', () => {
  const originalFetch = global.fetch;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    warnSpy.mockRestore();
  });

  test('aborts fetch on unmount', async () => {
    let aborted = false;
    global.fetch = jest.fn().mockImplementation((_url, init) => {
      const signal = (init as RequestInit)?.signal;
      signal?.addEventListener('abort', () => {
        aborted = true;
      });
      return new Promise(() => {}) as unknown as Promise<Response>;
    }) as unknown as typeof fetch;

    const { unmount } = render(<Dashboard />);
    unmount();

    expect(aborted).toBe(true);
    await Promise.resolve();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('Dashboard github stats success', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    (toast.error as jest.Mock).mockClear();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          stargazers_count: 2,
          forks_count: 3,
          open_issues_count: 4,
        }),
    }) as unknown as typeof fetch;
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('updates state with fetched stats', async () => {
    const { findByText } = render(<Dashboard />);
    expect(await findByText('Star 2')).toBeTruthy();
    expect(await findByText('Fork 3')).toBeTruthy();
    expect(await findByText('Issues 4')).toBeTruthy();
  });
});

describe('copyHistoryEntry', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    (toast.success as jest.Mock).mockClear();
    (trackEvent as jest.Mock).mockClear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('copies entry to clipboard and tracks event', async () => {
    render(<Dashboard />);
    await waitFor(() => expect(copyFn).not.toBeNull());
    await act(async () => {
      copyFn?.('{"a":1}');
      await Promise.resolve();
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{"a":1}');
    expect(toast.success).toHaveBeenCalledWith(
      'Sora JSON copied to clipboard!',
    );
    expect(trackEvent).toHaveBeenCalledWith(true, 'history_copy');
  });
});
