import { toast } from '@/components/ui/sonner-toast';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook that exposes clipboard copy functionality with toast feedback.
 *
 * @returns An object containing a `copy` function for writing text to the clipboard.
 */
export function useClipboard() {
  const { t } = useTranslation();

  /**
   * Writes text to the clipboard and displays success or error toasts.
   *
   * @param text - The text to copy to the clipboard.
   * @param success - Optional success message shown if the copy succeeds.
   * @returns A promise resolving to `true` on success and `false` on failure.
   *
   * Shows a success toast with the provided message, an error toast if the
   * Clipboard API is unavailable, and another error toast if copying fails.
   */
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
