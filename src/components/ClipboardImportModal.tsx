import React, { useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'
import { useTracking } from '@/hooks/use-tracking'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner-toast';

interface ClipboardImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (jsons: string[]) => void;
  title: string;
}

const ClipboardImportModal: React.FC<ClipboardImportModalProps> = ({
  open,
  onOpenChange,
  onImport,
  title,
}) => {
  const [text, setText] = useState('');
  const [trackingEnabled] = useTracking();

  useEffect(() => {
    if (open) {
      if ('clipboard' in navigator) {
        navigator.clipboard.readText().then(setText).catch(() => {});
      } else {
        toast.error('Clipboard not supported');
      }
    }
  }, [open]);

  const handleImport = () => {
    if (!text.trim()) {
      onOpenChange(false)
      return
    }
    const type = title.toLowerCase().includes('bulk') ? 'bulk_clipboard' : 'clipboard'
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) {
        const strings = parsed.map(j => {
          if (typeof j === 'string') return j
          if (j && typeof j === 'object' && 'json' in j) return j.json as string
          return JSON.stringify(j)
        })
        onImport(strings)
      } else {
        onImport([
          typeof parsed === 'string'
            ? parsed
            : parsed && typeof parsed === 'object' && 'json' in parsed
              ? (parsed as { json: string }).json
              : JSON.stringify(parsed)
        ])
      }
    } catch {
      onImport([text])
    }
    trackEvent(trackingEnabled, 'history_import', { type })
    setText('')
    onOpenChange(false)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste JSON here"
          className="my-4"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClipboardImportModal;
