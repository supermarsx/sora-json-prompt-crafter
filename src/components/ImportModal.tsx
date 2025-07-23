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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      const obj = JSON.parse(text);
      if (!isValidOptions(obj)) throw new Error('invalid');
      onImport(JSON.stringify(obj));
      setText('');
      onClose();
    } catch {
      toast.error(t('invalidJson'));
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
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('pasteJsonPlaceholder')}
          />
          <Input type="file" accept=".json" onChange={handleFile} />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleImport}>{t('import')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
