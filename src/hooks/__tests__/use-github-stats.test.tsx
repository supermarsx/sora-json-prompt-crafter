import { renderHook, waitFor } from '@testing-library/react';
import { useGithubStats } from '../use-github-stats';
import { toast } from '@/components/ui/sonner-toast';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { error: jest.fn() },
}));

describe('useGithubStats', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    localStorage.clear();
    (toast.error as jest.Mock).mockClear();
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  );

  test('uses cache when fresh', () => {
    localStorage.setItem(
      'githubStats',
      JSON.stringify({ stars: 1, forks: 2, issues: 3 }),
    );
    localStorage.setItem('githubStatsTimestamp', JSON.stringify(Date.now()));
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const { result } = renderHook(() => useGithubStats(), { wrapper });
    expect(result.current).toEqual({ stars: 1, forks: 2, issues: 3 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('fetches stats when cache expired', async () => {
    localStorage.setItem(
      'githubStatsTimestamp',
      JSON.stringify(Date.now() - 7200000),
    );
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ stargazers_count: 4, forks_count: 5 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ total_count: 6 }),
      }) as unknown as typeof fetch;
    const { result } = renderHook(() => useGithubStats(), { wrapper });
    await waitFor(() =>
      expect(result.current).toEqual({ stars: 4, forks: 5, issues: 6 }),
    );
  });

  test('shows toast on fetch error', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('fail')) as unknown as typeof fetch;
    renderHook(() => useGithubStats(), { wrapper });
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(i18n.t('githubStatsError')),
    );
  });

  test('aborts fetch on unmount', () => {
    let signal: AbortSignal | undefined;
    const fetchMock = jest.fn((_: RequestInfo, init?: RequestInit) => {
      signal = init?.signal;
      return new Promise(() => {});
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const { unmount } = renderHook(() => useGithubStats(), { wrapper });
    expect(fetchMock).toHaveBeenCalled();
    unmount();
    expect(signal?.aborted).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
