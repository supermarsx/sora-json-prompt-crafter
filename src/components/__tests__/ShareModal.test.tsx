import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { ShareModal } from '../ShareModal';
import i18n from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { useTracking } from '@/hooks/use-tracking';
import { toast } from '@/components/ui/sonner-toast';

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true] as const),
}));

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function renderModal() {
  return render(
    <ShareModal isOpen={true} onClose={() => {}} jsonContent="myjson" />,
  );
}

describe('ShareModal', () => {
  let openSpy: jest.SpyInstance;

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
    (trackEvent as jest.Mock).mockClear();
  });

  afterEach(() => {
    openSpy.mockRestore();
  });

  test('does not render when closed', () => {
    render(
      <ShareModal isOpen={false} onClose={() => {}} jsonContent="myjson" />,
    );
    expect(screen.queryByText(/Share your JSON prompt/i)).toBeNull();
    expect(openSpy).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('shares to Facebook', () => {
    renderModal();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(i18n.t('shareQuote'))}`;
    fireEvent.click(screen.getByRole('button', { name: /facebook/i }));
    expect(openSpy).toHaveBeenCalledWith(
      url,
      '_blank',
      'noopener,width=600,height=400',
    );
    expect(trackEvent).toHaveBeenCalledWith(true, 'share_facebook');
  });

  test('shares to Twitter', () => {
    renderModal();
    const text = encodeURIComponent(i18n.t('shareQuoteTwitter'));
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`;
    fireEvent.click(screen.getByRole('button', { name: /twitter\/x/i }));
    expect(openSpy).toHaveBeenCalledWith(
      url,
      '_blank',
      'noopener,width=600,height=400',
    );
    expect(trackEvent).toHaveBeenCalledWith(true, 'share_twitter');
  });

  test('shares to WhatsApp', () => {
    renderModal();
    const text = encodeURIComponent(
      i18n.t('shareQuoteWithJson', { json: 'myjson' }),
    );
    const url = `https://wa.me/?text=${text}`;
    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }));
    expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener');
    expect(trackEvent).toHaveBeenCalledWith(true, 'share_whatsapp');
  });

  test('shares to Telegram', () => {
    renderModal();
    const text = encodeURIComponent(
      i18n.t('shareQuoteWithJson', { json: 'myjson' }),
    );
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`;
    fireEvent.click(screen.getByRole('button', { name: /telegram/i }));
    expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener');
    expect(trackEvent).toHaveBeenCalledWith(true, 'share_telegram');
  });

  test('copyLink works when clipboard supported', async () => {
    jest.useFakeTimers();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderModal();
    const btn = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(btn);
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(window.location.href),
    );
    expect(toast.success).toHaveBeenCalledWith(i18n.t('linkCopied'));
    expect(trackEvent).toHaveBeenCalledWith(true, 'copy_link');
    await waitFor(() =>
      expect(btn.querySelector('svg')?.getAttribute('class')).toContain(
        'animate-pulse',
      ),
    );
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    await waitFor(() =>
      expect(btn.querySelector('svg')?.getAttribute('class')).not.toContain(
        'animate-pulse',
      ),
    );
    jest.useRealTimers();
  });

  test('shows error when clipboard unsupported', () => {
    const nav = navigator as unknown as { clipboard?: unknown };
    const original = nav.clipboard;
    delete nav.clipboard;
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }));
    expect(toast.error).toHaveBeenCalledWith(i18n.t('clipboardUnsupported'));
    expect(trackEvent).not.toHaveBeenCalled();
    if (original !== undefined) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: original,
      });
    }
  });

  test('shows error when clipboard write fails', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('fail'));
    const original = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(i18n.t('copyFailed')),
    );
    expect(trackEvent).not.toHaveBeenCalled();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: original,
    });
  });
});
