import React, { useState, useMemo } from 'react';
import { trackEvent } from '@/lib/analytics';
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
  Instagram,
  MessageCircle,
  Send,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from '@/components/ui/sonner-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonContent: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  jsonContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [trackingEnabled] = useTracking();
  const { t } = useTranslation();
  const shareCaption = t('shareCaption');
  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('ref', 'share');
    return url.toString();
  }, []);
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareCaption)}`;
    window.open(url, '_blank', 'noopener,width=600,height=400');
    toast.success(t('sharedToFacebook'));
    trackEvent(trackingEnabled, 'share_facebook');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${shareCaption} #SoraAI #AIGeneration`);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,width=600,height=400');
    toast.success(t('sharedToTwitter'));
    trackEvent(trackingEnabled, 'share_twitter');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${shareCaption}\n\n${jsonContent}\n${shareUrl}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank', 'noopener');
    toast.success(t('sharedToWhatsApp'));
    trackEvent(trackingEnabled, 'share_whatsapp');
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(`${shareCaption}\n\n${jsonContent}`);
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    window.open(url, '_blank', 'noopener');
    toast.success(t('sharedToTelegram'));
    trackEvent(trackingEnabled, 'share_telegram');
  };

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
      trackEvent(trackingEnabled, 'copy_link');
    } catch (err) {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('shareTitle')}</DialogTitle>
          <DialogDescription>{t('shareDescription')}</DialogDescription>
        </DialogHeader>
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
