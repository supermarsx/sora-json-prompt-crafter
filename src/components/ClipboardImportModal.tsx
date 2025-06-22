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
import { toast } from '@/components/ui/sonner-toast'
import { isValidOptions } from '@/lib/validateOptions'


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
      const arr = Array.isArray(parsed) ? parsed : [parsed]
      const strings: string[] = []
      for (const item of arr) {
        let obj: unknown = item
        if (typeof item === 'string') {
          try { obj = JSON.parse(item) } catch { obj = undefined }
        } else if (item && typeof item === 'object' && 'json' in item) {
          obj = (item as { json: string }).json
          try { obj = JSON.parse(String(obj)) } catch {}
        }
        if (obj && typeof obj === 'object' && isValidOptions(obj)) {
          strings.push(JSON.stringify(obj))
        }
      }
      if (!strings.length) throw new Error('invalid')
      onImport(strings)
    } catch {
      toast.error('Invalid JSON')
      onOpenChange(false)
      return
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
