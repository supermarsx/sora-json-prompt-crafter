import { render } from '@testing-library/react';
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
jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

jest.mock('@/lib/config', () => ({ __esModule: true, DISABLE_STATS: true }));

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }) as unknown as typeof window.matchMedia;
});

test('does not fetch stats when disabled', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch as unknown as typeof fetch;
  render(<Dashboard />);
  expect(mockFetch).not.toHaveBeenCalled();
});
