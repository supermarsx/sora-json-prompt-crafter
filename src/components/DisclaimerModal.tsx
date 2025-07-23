import React, { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/use-locale';
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

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [locale] = useLocale();
  const storageKey = `disclaimerText_${locale}`;
  const [text, setText] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!open || hasFetched) {
      return;
    }

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        setText(cached);
        setHasFetched(true);
        return;
      }
    } catch {
      // ignore localStorage errors
    }

    const controller = new AbortController();
    const { signal } = controller;

    let disclaimerUrl: string | undefined;
    try {
      disclaimerUrl = new Function(
        'return import.meta.env.VITE_DISCLAIMER_URL',
      )() as string | undefined;
    } catch {
      if (typeof process !== 'undefined') {
        disclaimerUrl = (process as { env?: { VITE_DISCLAIMER_URL?: string } })
          .env?.VITE_DISCLAIMER_URL;
      }
    }
    const pattern = disclaimerUrl ?? '/disclaimers/disclaimer.{locale}.txt';
    const url = pattern.replace('{locale}', locale);
    const fallbackUrl = pattern.replace('{locale}', 'en');

    const fetchDisclaimer = async (u: string) => {
      try {
        if (typeof window !== 'undefined' && window.caches) {
          const cachedResponse = await window.caches.match(u);
          if (cachedResponse) {
            return await cachedResponse.text();
          }
        }
      } catch {
        // ignore cache errors
      }

      const res = await fetch(u, { signal });
      if (!res.ok) {
        throw new Error('Failed to fetch disclaimer');
      }
      return res.text();
    };

    (async () => {
      try {
        const txt = await fetchDisclaimer(url);
        if (!signal.aborted) {
          setText(txt);
          try {
            localStorage.setItem(storageKey, txt);
          } catch {
            // ignore localStorage errors
          }
          setHasFetched(true);
        }
      } catch {
        try {
          const txt = await fetchDisclaimer(fallbackUrl);
          if (!signal.aborted) {
            setText(txt);
            try {
              localStorage.setItem(storageKey, txt);
            } catch {
              // ignore localStorage errors
            }
            setHasFetched(true);
          }
        } catch (err) {
          if ((err as { name?: string }).name !== 'AbortError') {
            setText('Failed to load disclaimer.');
          }
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [open, hasFetched, locale, storageKey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Intellectual Property &amp; Software Disclaimer
          </DialogTitle>
          <DialogDescription>
            The text below explains important legal information.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] px-1">
          <p className="whitespace-pre-wrap text-sm">{text}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerModal;
