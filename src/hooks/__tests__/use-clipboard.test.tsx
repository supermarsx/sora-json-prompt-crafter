import { renderHook } from '@testing-library/react';
import { useClipboard } from '../use-clipboard';
import { toast } from '@/components/ui/sonner-toast';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useClipboard', () => {
  const original: Clipboard | undefined = (
    navigator as unknown as { clipboard?: Clipboard }
  ).clipboard;

  afterEach(() => {
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
    if (original !== undefined) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: original,
      });
    } else {
      delete (navigator as unknown as { clipboard?: Clipboard }).clipboard;
    }
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  );

  test('copies text when API available', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const { result } = renderHook(() => useClipboard(), { wrapper });
    await expect(result.current.copy('foo', i18n.t('copied'))).resolves.toBe(
      true,
    );
    expect(writeText).toHaveBeenCalledWith('foo');
    expect(toast.success).toHaveBeenCalledWith(i18n.t('copied'));
  });

  test('shows error when API missing', async () => {
    delete (navigator as unknown as { clipboard?: Clipboard }).clipboard;
    const { result } = renderHook(() => useClipboard(), { wrapper });
    await expect(result.current.copy('foo')).resolves.toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      i18n.t('clipboardNotSupported'),
    );
  });

  test('shows error when writeText fails', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('fail'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const { result } = renderHook(() => useClipboard(), { wrapper });
    await expect(result.current.copy('bar')).resolves.toBe(false);
    expect(writeText).toHaveBeenCalledWith('bar');
    expect(toast.error).toHaveBeenCalledWith(i18n.t('copyFailed'));
  });
});

