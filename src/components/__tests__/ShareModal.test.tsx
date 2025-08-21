import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { ShareModal } from '../ShareModal';
import i18n from '@/i18n';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { SHARE_COUNT, SHARE_MILESTONES } from '@/lib/storage-keys';
import { useTracking } from '@/hooks/use-tracking';
import { toast } from '@/components/ui/sonner-toast';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { serializeOptions } from '@/lib/urlOptions';
import { QRCodeSVG } from 'qrcode.react';

jest.mock('qrcode.react', () => ({
  __esModule: true,
  QRCodeSVG: jest.fn((props) => <div data-testid="share-qr-code" {...props} />),
}));

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

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
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      jsonContent="myjson"
      options={DEFAULT_OPTIONS}
    />,
  );
}

describe('ShareModal', () => {
  let openSpy: jest.SpyInstance;

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
    (trackEvent as jest.Mock).mockClear();
    localStorage.clear();
    delete (navigator as { share?: unknown }).share;
    (QRCodeSVG as jest.Mock).mockClear();
  });

  afterEach(() => {
    openSpy.mockRestore();
    delete (navigator as { share?: unknown }).share;
  });

  test('does not render when closed', () => {
    render(
      <ShareModal
        isOpen={false}
        onClose={() => {}}
        jsonContent="myjson"
        options={DEFAULT_OPTIONS}
      />,
    );
    expect(screen.queryByText(/Share your JSON prompt/i)).toBeNull();
    expect(openSpy).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('shares to Facebook', () => {
    renderModal();
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('ref', 'share');
    shareUrl.hash = serializeOptions(DEFAULT_OPTIONS);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.toString())}&quote=${encodeURIComponent(i18n.t('shareCaption'))}`;
    fireEvent.click(screen.getByRole('button', { name: /facebook/i }));
    expect(openSpy).toHaveBeenCalledWith(
      url,
      '_blank',
      'noopener,width=600,height=400',
    );
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.ShareFacebook);
  });

  test('shares to Twitter', () => {
    renderModal();
    const text = encodeURIComponent(
      `${i18n.t('shareCaption')} #SoraAI #AIGeneration`,
    );
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('ref', 'share');
    shareUrl.hash = serializeOptions(DEFAULT_OPTIONS);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl.toString())}`;
    fireEvent.click(screen.getByRole('button', { name: /twitter\/x/i }));
    expect(openSpy).toHaveBeenCalledWith(
      url,
      '_blank',
      'noopener,width=600,height=400',
    );
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.ShareTwitter);
  });

  test('shares to WhatsApp', () => {
    renderModal();
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('ref', 'share');
    shareUrl.hash = serializeOptions(DEFAULT_OPTIONS);
    const text = encodeURIComponent(
      `${i18n.t('shareCaption')}\n\nmyjson\n${shareUrl.toString()}`,
    );
    const url = `https://wa.me/?text=${text}`;
    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }));
    expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener');
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.ShareWhatsapp);
  });

  test('shares to Telegram', () => {
    renderModal();
    const text = encodeURIComponent(`${i18n.t('shareCaption')}\n\nmyjson`);
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('ref', 'share');
    shareUrl.hash = serializeOptions(DEFAULT_OPTIONS);
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl.toString())}&text=${text}`;
    fireEvent.click(screen.getByRole('button', { name: /telegram/i }));
    expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener');
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.ShareTelegram);
  });

  test('increments share counter and emits milestones', () => {
    localStorage.setItem(SHARE_COUNT, '4');
    localStorage.setItem(SHARE_MILESTONES, '[]');
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /facebook/i }));
    expect(JSON.parse(localStorage.getItem(SHARE_COUNT) || '0')).toBe(5);
    let calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Share5,
    );
    expect(calls.length).toBe(1);
    expect(JSON.parse(localStorage.getItem(SHARE_MILESTONES) || '[]')).toEqual([
      5,
    ]);
    (trackEvent as jest.Mock).mockClear();
    fireEvent.click(screen.getByRole('button', { name: /facebook/i }));
    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Share5,
    );
    expect(calls.length).toBe(0);
    expect(JSON.parse(localStorage.getItem(SHARE_MILESTONES) || '[]')).toEqual([
      5,
    ]);
  });

  test('uses native share when available', async () => {
    const shareMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    });
    renderModal();
    expect(screen.queryByRole('button', { name: /facebook/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /share…/i }));
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('ref', 'share');
    shareUrl.hash = serializeOptions(DEFAULT_OPTIONS);
    await waitFor(() =>
      expect(shareMock).toHaveBeenCalledWith({
        title: i18n.t('shareTitle'),
        text: i18n.t('shareCaption'),
        url: shareUrl.toString(),
      }),
    );
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.ShareNative);
  });

  test('falls back to platform buttons when native share fails', async () => {
    const shareMock = jest.fn().mockRejectedValue(new Error('fail'));
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: shareMock,
    });
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /share…/i }));
    await waitFor(() => expect(shareMock).toHaveBeenCalled());
    await screen.findByRole('button', { name: /facebook/i });
    expect(trackEvent).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(i18n.t('somethingWentWrong'));
  });

  test('renders QR code with share URL when toggled', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /show qr code/i }));
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('ref', 'share');
    shareUrl.hash = serializeOptions(DEFAULT_OPTIONS);
    expect(QRCodeSVG).toHaveBeenCalledWith(
      expect.objectContaining({ value: shareUrl.toString() }),
      {}
    );
    expect(screen.getByTestId('share-qr-code')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /hide qr code/i }));
    expect(screen.queryByTestId('share-qr-code')).toBeNull();
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
    expect(btn.getAttribute('title')).toBe(i18n.t('copyLink'));
    fireEvent.click(btn);
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('ref', 'share');
    shareUrl.hash = serializeOptions(DEFAULT_OPTIONS);
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(shareUrl.toString()),
    );
    expect(toast.success).toHaveBeenCalledWith(i18n.t('linkCopied'));
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.CopyLink);
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
