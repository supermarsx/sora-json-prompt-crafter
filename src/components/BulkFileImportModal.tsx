import React, { useState } from 'react';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { useTracking } from '@/hooks/use-tracking';
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
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner-toast';
import { isValidOptions } from '@/lib/validateOptions';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface BulkFileImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (entries: { json: string; title?: string }[]) => void;
}

/**
 * Modal dialog for importing one or more JSON prompts from a selected file.
 *
 * @param {BulkFileImportModalProps} props - Component props.
 * @param {boolean} props.open - Whether the dialog is visible.
 * @param {(open: boolean) => void} props.onOpenChange - Change handler for dialog visibility.
 * @param {(entries: { json: string; title?: string }[]) => void} props.onImport - Invoked with validated history entries.
 *
 * @remarks
 * Shows toast notifications for success or failure and sends an analytics event
 * when imports complete.
 */
const BulkFileImportModal: React.FC<BulkFileImportModalProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [trackingEnabled] = useTracking();
  const { t } = useTranslation();

  const handleImport = async () => {
    if (!file) {
      toast.error(t('pleaseSelectFile'));
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const entries: { json: string; title?: string }[] = [];
      for (const item of arr) {
        let obj: unknown = item;
        let titleVal: string | undefined;
        if (typeof item === 'string') {
          try {
            obj = JSON.parse(item);
          } catch {
            obj = undefined;
          }
        } else if (item && typeof item === 'object') {
          if ('json' in item) {
            titleVal = (item as { title?: string }).title;
            obj = (item as { json: string }).json;
            try {
              obj = JSON.parse(String(obj));
            } catch {
              /* ignore parse errors */
            }
          }
        }
        if (obj && typeof obj === 'object' && isValidOptions(obj)) {
          entries.push({ json: JSON.stringify(obj), title: titleVal });
        }
      }
      if (!entries.length) throw new Error('invalid');
      onImport(entries);
      toast.success(t('fileImported'));
      trackEvent(trackingEnabled, AnalyticsEvent.HistoryImport, {
        type: 'bulk_file',
      });
      setFile(null);
      onOpenChange(false);
    } catch {
      toast.error(t('failedImportFile'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('bulkFileImport')}</DialogTitle>
          <DialogDescription>
            {t('bulkFileImportDescription')}
          </DialogDescription>
        </DialogHeader>
        <Input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <DialogFooter>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('cancel')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleImport}>
                {t('import')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('import')}</TooltipContent>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkFileImportModal;
