import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import i18n from '@/i18n';
import Dashboard from '../Dashboard';
jest.mock('../Footer', () => ({ __esModule: true, default: () => null }));
import { ShareModal } from '../ShareModal';
import ClipboardImportModal from '../ClipboardImportModal';
import { HistoryPanel } from '../HistoryPanel';
import { toast } from '@/components/ui/sonner-toast';

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [false] as const),
}));

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const restoreClipboard = () => {
  const nav = navigator as unknown as { clipboard?: unknown };
  const original = nav.clipboard;
  delete nav.clipboard;
  return () => {
    if (original !== undefined) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: original,
      });
    }
  };
};

describe('clipboard fallback', () => {
  const originalMatchMedia = window.matchMedia;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (toast.error as jest.Mock).mockClear();
    (toast.success as jest.Mock).mockClear();
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            stargazers_count: 0,
            forks_count: 0,
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            total_count: 0,
          }),
      }) as unknown as typeof fetch;
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    warnSpy.mockRestore();
  });

  test('ShareModal copy shows error', () => {
    const restore = restoreClipboard();
    render(<ShareModal isOpen={true} onClose={() => {}} jsonContent="{}" />);
    const btn = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(btn);
    expect(toast.error).toHaveBeenCalledWith(i18n.t('clipboardUnsupported'));
    restore();
  });

  test('ClipboardImportModal reads clipboard failure', async () => {
    const restore = restoreClipboard();
    render(
      <ClipboardImportModal
        open={true}
        onOpenChange={() => {}}
        onImport={() => {}}
        title="Import"
      />,
    );
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(i18n.t('clipboardUnsupported')),
    );
    restore();
  });
});
