import { toast } from '@/components/ui/sonner-toast';

export function useClipboard() {
  const copy = async (text: string, success?: string) => {
    if (
      !('clipboard' in navigator) ||
      typeof navigator.clipboard !== 'object' ||
      typeof navigator.clipboard.writeText !== 'function'
    ) {
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
