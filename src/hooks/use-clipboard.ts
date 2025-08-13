import { toast } from '@/components/ui/sonner-toast';
import { useTranslation } from 'react-i18next';

export function useClipboard() {
  const { t } = useTranslation();

  const copy = async (text: string, success?: string) => {
    if (
      !('clipboard' in navigator) ||
      typeof navigator.clipboard !== 'object' ||
      typeof navigator.clipboard.writeText !== 'function'
    ) {
      toast.error(t('clipboardNotSupported'));
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      if (success) toast.success(success);
      return true;
    } catch {
      toast.error(t('copyFailed'));
      return false;
    }
  };

  return { copy };
}
