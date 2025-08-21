import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner-toast';
import { isValidOptions } from '@/lib/validateOptions';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { useTracking } from '@/hooks/use-tracking';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (json: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [trackingEnabled] = useTracking();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const importData = (data: string) => {
    try {
      const obj = JSON.parse(data);
      if (!isValidOptions(obj)) throw new Error('invalid');
      onImport(JSON.stringify(obj));
      setText('');
      setUrl('');
      onClose();
      return true;
    } catch {
      toast.error(t('invalidJson'));
      return false;
    }
  };

  const handleImport = () => {
    importData(text);
  };

  const handleFetch = async () => {
    if (!url) return;
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok || res.type === 'opaque') throw new Error('blocked');
      const fetched = await res.text();
      if (importData(fetched)) {
        trackEvent(trackingEnabled, AnalyticsEvent.ImportFromUrl);
      }
    } catch {
      toast.error(t('requestBlocked'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('importJsonTitle')}</DialogTitle>
          <DialogDescription>{t('importJsonDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <div className="flex gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('urlPlaceholder')}
              className="flex-1"
            />
            <Button onClick={handleFetch} title={t('fetch')}>
              {t('fetch')}
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('pasteJsonPlaceholder')}
          />
          <Input type="file" accept=".json" onChange={handleFile} />
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={onClose}
            title={t('cancel')}
          >
            {t('cancel')}
          </Button>
          <Button onClick={handleImport} title={t('import')}>
            {t('import')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
