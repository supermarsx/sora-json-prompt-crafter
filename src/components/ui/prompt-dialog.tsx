import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PromptDialogProps {
  open: boolean;
  title: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onOpenChange: (open: boolean) => void;
}

const PromptDialog: React.FC<PromptDialogProps> = ({
  open,
  title,
  defaultValue = '',
  placeholder,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
    }
  }, [open, defaultValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {placeholder}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel ?? t('cancel')}
          </Button>
          <Button
            onClick={() => {
              onConfirm(value);
              onOpenChange(false);
            }}
            disabled={!value.trim()}
          >
            {confirmLabel ?? t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDialog;
