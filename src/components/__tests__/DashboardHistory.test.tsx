import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useIsSingleColumn } from '@/hooks/use-single-column';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useTracking } from '@/hooks/use-tracking';
import { useActionHistory } from '@/hooks/use-action-history';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';

let importFn: ((jsons: string[]) => void) | null = null;

jest.mock('../HistoryPanel', () => ({
  __esModule: true,
  default: ({ onImport }: { onImport: (jsons: string[]) => void }) => {
    importFn = onImport;
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
jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

function createEntries(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    date: 'd',
    json: '{}',
  }));
}

describe('Dashboard history limit', () => {
  beforeEach(() => {
    localStorage.clear();
    importFn = null;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    global.fetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({}) });
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('caps history at 100 entries', async () => {
    localStorage.setItem('jsonHistory', JSON.stringify(createEntries(95)));

    render(<Dashboard />);

    const copyButton = screen.getByText('Copy');

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        fireEvent.click(copyButton);
      });
    }

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem('jsonHistory') || '[]'),
      ).toHaveLength(100);
    });

    act(() => {
      importFn?.(Array(20).fill('{}'));
    });

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem('jsonHistory') || '[]'),
      ).toHaveLength(100);
    });
  });
});
