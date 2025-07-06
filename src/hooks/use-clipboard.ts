import { toast } from '@/components/ui/sonner-toast';

export function useClipboard() {
  const copy = async (text: string, success?: string) => {
    if (!('clipboard' in navigator)) {
      toast.error('Clipboard not supported');
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      if (success) toast.success(success);
      return true;
    } catch {
      toast.error('Failed to copy to clipboard');
      return false;
    }
  };

  return { copy };
}
