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


const STORAGE_KEY = 'disclaimerText'

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ open, onOpenChange }) => {
  const [text, setText] = useState('')
  const [hasFetched, setHasFetched] = useState(false)


  useEffect(() => {
    if (!open || hasFetched) {
      return
    }

    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        setText(cached)
        setHasFetched(true)
        return
      }
    } catch {
      // ignore localStorage errors
    }

    const controller = new AbortController();
    const { signal } = controller;

    let disclaimerUrl: string | undefined
    try {
      disclaimerUrl = new Function(
        'return import.meta.env.VITE_DISCLAIMER_URL'
      )() as string | undefined
    } catch {
      if (typeof process !== 'undefined') {
        disclaimerUrl = (process as any).env?.VITE_DISCLAIMER_URL
      }
    }
    const url = disclaimerUrl ?? '/disclaimer.txt'
    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch disclaimer');
        }
        return res.text();
      })
      .then((txt) => {
        if (!signal.aborted) {
          setText(txt)
          try {
            localStorage.setItem(STORAGE_KEY, txt)
          } catch {
            // ignore localStorage errors
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setText('Failed to load disclaimer.');
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          setHasFetched(true);
        }
      });

    return () => {
      controller.abort();
    };
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
