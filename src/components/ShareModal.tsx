
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonContent: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, jsonContent }) => {
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent('Check out my Sora prompt configuration!')}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success('Shared to Facebook!');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent('Check out my Sora prompt configuration! #SoraAI #AIGeneration');
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success('Shared to Twitter!');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out my Sora prompt configuration!\n\n${jsonContent}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
    toast.success('Shared to WhatsApp!');
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(`Check out my Sora prompt configuration!\n\n${jsonContent}`);
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`;
    window.open(url, '_blank');
    toast.success('Shared to Telegram!');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your JSON prompt</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button onClick={shareToFacebook} variant="outline" className="gap-2">
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </Button>
          <Button onClick={shareToTwitter} variant="outline" className="gap-2">
            <Twitter className="w-4 h-4 text-blue-400" />
            Twitter/X
          </Button>
          <Button onClick={shareToWhatsApp} variant="outline" className="gap-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            WhatsApp
          </Button>
          <Button onClick={shareToTelegram} variant="outline" className="gap-2">
            <Send className="w-4 h-4 text-blue-500" />
            Telegram
          </Button>
        </div>
        <div className="flex justify-center pt-4 border-t">
          <Button onClick={copyLink} variant="default" className="w-full">
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
