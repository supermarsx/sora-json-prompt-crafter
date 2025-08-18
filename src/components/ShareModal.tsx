import React, { useState, useMemo } from 'react';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { useTracking } from '@/hooks/use-tracking';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Facebook,
  Twitter,
  MessageCircle,
  Send,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { toast } from '@/components/ui/sonner-toast';
import type { SoraOptions } from '@/lib/soraOptions';
import { serializeOptions } from '@/lib/urlOptions';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonContent: string;
  options: SoraOptions;
}

/**
 * Modal that exposes multiple sharing options for a generated prompt.
 * Users can copy a link to their configuration or open prefilled shares for
 * social platforms.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the open state of the dialog.
 * @param {() => void} props.onClose - Callback invoked when the modal closes.
 * @param {string} props.jsonContent - JSON representation included in shares.
 * @param {SoraOptions} props.options - Options serialized into the share URL.
 */
export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  jsonContent,
  options,
}) => {
  const [copied, setCopied] = useState(false);
  const [trackingEnabled] = useTracking();
  const { t } = useTranslation();
  const shareCaption = t('shareCaption');
  const shareTitle = t('shareTitle');
  const [nativeShareAvailable, setNativeShareAvailable] = useState(
    typeof navigator !== 'undefined' && typeof navigator.share === 'function',
  );
  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('ref', 'share');
    url.hash = serializeOptions(options);
    return url.toString();
  }, [options]);
  /**
   * Opens a new Facebook share dialog containing the caption and URL.
   * Displays a success toast and records the action for analytics.
   */
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareCaption)}`;
    window.open(url, '_blank', 'noopener,width=600,height=400');
    toast.success(t('sharedToFacebook'));
    trackEvent(trackingEnabled, AnalyticsEvent.ShareFacebook);
  };

  /**
   * Shares the caption and URL on Twitter/X in a new window.
   * Provides user feedback via toast and tracks the event.
   */
  const shareToTwitter = () => {
    const text = encodeURIComponent(`${shareCaption} #SoraAI #AIGeneration`);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,width=600,height=400');
    toast.success(t('sharedToTwitter'));
    trackEvent(trackingEnabled, AnalyticsEvent.ShareTwitter);
  };

  /**
   * Launches WhatsApp with a message containing caption, JSON, and link.
   * Opens in a new tab and logs the share for analytics purposes.
   */
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${shareCaption}\n\n${jsonContent}\n${shareUrl}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank', 'noopener');
    toast.success(t('sharedToWhatsApp'));
    trackEvent(trackingEnabled, AnalyticsEvent.ShareWhatsapp);
  };

  /**
   * Opens a Telegram share window prefilled with caption and JSON content.
   * Shows a toast confirmation and records analytics for the share.
   */
  const shareToTelegram = () => {
    const text = encodeURIComponent(`${shareCaption}\n\n${jsonContent}`);
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    window.open(url, '_blank', 'noopener');
    toast.success(t('sharedToTelegram'));
    trackEvent(trackingEnabled, AnalyticsEvent.ShareTelegram);
  };

  /**
   * Copies the share URL to the user's clipboard, updates UI state, and
   * triggers analytics tracking. Displays error toasts on failure or if the
   * Clipboard API is unsupported.
   */
  const copyLink = async () => {
    if (!('clipboard' in navigator)) {
      toast.error(t('clipboardUnsupported'));
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success(t('linkCopied'));
      trackEvent(trackingEnabled, AnalyticsEvent.CopyLink);
    } catch (err) {
      toast.error(t('copyFailed'));
    }
  };

  const shareNative = async () => {
    try {
      await navigator.share({ title: shareTitle, text: shareCaption, url: shareUrl });
      trackEvent(trackingEnabled, AnalyticsEvent.ShareNative);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error(t('somethingWentWrong'));
        setNativeShareAvailable(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('shareTitle')}</DialogTitle>
          <DialogDescription>{t('shareDescription')}</DialogDescription>
        </DialogHeader>
        {nativeShareAvailable ? (
          <div className="py-4">
            <Button
              onClick={shareNative}
              variant="outline"
              className="w-full gap-2"
            >
              <Share2 className="w-4 h-4" />
              {t('share')}…
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={shareToFacebook} variant="outline" className="gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              {t('shareFacebook')}
            </Button>
            <Button onClick={shareToTwitter} variant="outline" className="gap-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              {t('shareTwitter')}
            </Button>
            <Button onClick={shareToWhatsApp} variant="outline" className="gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              {t('shareWhatsApp')}
            </Button>
            <Button onClick={shareToTelegram} variant="outline" className="gap-2">
              <Send className="w-4 h-4 text-blue-500" />
              {t('shareTelegram')}
            </Button>
          </div>
        )}
        <div className="flex justify-center pt-4 border-t">
          <Button onClick={copyLink} variant="default" className="w-full gap-2">
            {copied ? (
              <Check className="w-4 h-4 animate-pulse" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {t('copyLink')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
