import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner-toast';
import { isValidOptions } from '@/lib/validateOptions';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (json: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [text, setText] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      const obj = JSON.parse(text)
      if (!isValidOptions(obj)) throw new Error('invalid')
      onImport(JSON.stringify(obj))
      setText('')
      onClose()
    } catch {
      toast.error('Invalid JSON')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import JSON</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste JSON here"
          />
          <Input type="file" accept=".json" onChange={handleFile} />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
