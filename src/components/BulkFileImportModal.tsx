import React, { useState } from 'react'
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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface BulkFileImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (jsons: string[]) => void;
}

const BulkFileImportModal: React.FC<BulkFileImportModalProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [trackingEnabled] = useTracking();

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const jsons = Array.isArray(parsed)
        ? parsed.map(j => (typeof j === 'string' ? j : JSON.stringify(j)))
        : [typeof parsed === 'string' ? parsed : JSON.stringify(parsed)];
      onImport(jsons);
      toast.success('File imported!');
      trackEvent(trackingEnabled, 'history_import', { type: 'bulk_file' })
      setFile(null);
      onOpenChange(false);
    } catch {
      toast.error('Failed to import file');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk File Import</DialogTitle>
        </DialogHeader>
        <Input type="file" accept=".json" onChange={e => setFile(e.target.files?.[0] || null)} />
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

export default BulkFileImportModal;
