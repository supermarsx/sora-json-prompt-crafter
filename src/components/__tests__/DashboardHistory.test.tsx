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
import { JSON_HISTORY } from '@/lib/storage-keys';
import type { HistoryEntry } from '../HistoryPanel';
jest.mock('@/lib/validateOptions', () => ({
  __esModule: true,
  isValidOptions: jest.fn(() => true),
}));

let importFn: ((entries: { json: string; title?: string }[]) => void) | null = null;
let copyFn: ((entry: HistoryEntry) => void) | null = null;

jest.mock('../HistoryPanel', () => ({
  __esModule: true,
    default: ({
      onImport,
      onCopy,
      onEdit,
    }: {
      onImport: (entries: { json: string; title?: string }[]) => void;
      onCopy: (entry: HistoryEntry) => void;
      onEdit: (entry: HistoryEntry) => void;
    }) => {
    importFn = onImport;
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
      date: Date.now(),
      json: '{}',
      favorite: false,
      title: `t${i}`,
      editCount: 0,
      copyCount: 0,
    }));
  }

describe('Dashboard history limit', () => {
  beforeEach(() => {
    localStorage.clear();
    importFn = null;
    copyFn = null;
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
    localStorage.setItem(JSON_HISTORY, JSON.stringify(createEntries(95)));

    render(<Dashboard />);

    const copyButton = screen.getByText('Copy');

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        fireEvent.click(copyButton);
      });
    }

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem(JSON_HISTORY) || '[]'),
      ).toHaveLength(100);
    });

    act(() => {
      importFn?.(Array(20).fill({ json: '{}' }));
    });

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem(JSON_HISTORY) || '[]'),
      ).toHaveLength(100);
    });
  });

  test('increments copy counter', async () => {
      const entry = {
        id: 1,
        date: Date.now(),
        json: '{"prompt":"hi"}',
        favorite: false,
        title: 't1',
        editCount: 0,
        copyCount: 0,
      };
    localStorage.setItem(JSON_HISTORY, JSON.stringify([entry]));

    render(<Dashboard />);

    await waitFor(() => copyFn);

    await act(async () => {
      await copyFn?.(entry);
    });
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(JSON_HISTORY) || '[]');
      expect(stored[0].copyCount).toBe(1);
    });
  });
});
