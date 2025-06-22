import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DisclaimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ open, onOpenChange }) => {
  const [text, setText] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!open || hasFetched) {
      return;
    }

    fetch('/disclaimer.txt')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch disclaimer');
        }
        return res.text();
      })
      .then(setText)
      .catch(() => {
        setText('Failed to load disclaimer.');
      })
      .finally(() => {
        setHasFetched(true);
      });
  }, [open, hasFetched]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Intellectual Property &amp; Software Disclaimer</DialogTitle>
          <DialogDescription>The text below explains important legal information.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] px-1">
          <p className="whitespace-pre-wrap text-sm">{text}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerModal;
