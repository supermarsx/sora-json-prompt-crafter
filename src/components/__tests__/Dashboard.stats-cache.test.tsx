import { render, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';

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
jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-action-history', () => ({
  __esModule: true,
  useActionHistory: jest.fn(() => []),
}));

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }) as unknown as typeof window.matchMedia;
});

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('uses cached stats when fresh', async () => {
  localStorage.setItem(
    'githubStats',
    JSON.stringify({ stars: 1, forks: 2, issues: 3 }),
  );
  localStorage.setItem('githubStatsTimestamp', JSON.stringify(Date.now()));
  const mockFetch = jest.fn();
  global.fetch = mockFetch as unknown as typeof fetch;
  const { findByText } = render(<Dashboard />);
  expect(mockFetch).not.toHaveBeenCalled();
  expect(await findByText('Star 1')).toBeTruthy();
  expect(await findByText('Fork 2')).toBeTruthy();
  expect(await findByText('Issues 3')).toBeTruthy();
});

test('fetches stats when cache expired', async () => {
  localStorage.setItem(
    'githubStats',
    JSON.stringify({ stars: 1, forks: 2, issues: 3 }),
  );
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
  const { findByText } = render(<Dashboard />);
  expect(await findByText('Star 4')).toBeTruthy();
  expect(await findByText('Fork 5')).toBeTruthy();
  expect(await findByText('Issues 6')).toBeTruthy();
  await waitFor(() => {
    const cached = JSON.parse(localStorage.getItem('githubStats') || '{}');
    expect(cached).toEqual({ stars: 4, forks: 5, issues: 6 });
  });
});
