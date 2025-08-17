import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BulkFileImportModal from '../BulkFileImportModal';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { useTracking } from '@/hooks/use-tracking';
import i18n from '@/i18n';

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true] as const),
}));

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('BulkFileImportModal', () => {
  beforeEach(() => {
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
    (trackEvent as jest.Mock).mockClear();
  });

  test('imports valid JSON array', async () => {
    const onImport = jest.fn();
    const onOpenChange = jest.fn();
    const fileContent = '[{"prompt":"test"}]';
    render(
      <BulkFileImportModal
        open={true}
        onOpenChange={onOpenChange}
        onImport={onImport}
      />,
    );
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File([fileContent], 'test.json', {
      type: 'application/json',
    });
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(fileContent),
    });
    fireEvent.change(input, {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole('button', { name: /import/i }));
    await waitFor(() =>
      expect(onImport).toHaveBeenCalledWith(['{"prompt":"test"}']),
    );
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.HistoryImport, {
      type: 'bulk_file',
    });
    expect(toast.success).toHaveBeenCalledWith(i18n.t('fileImported'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('shows error toast for invalid JSON', async () => {
    const onImport = jest.fn();
    const onOpenChange = jest.fn();
    const fileContent = '{bad json}';
    render(
      <BulkFileImportModal
        open={true}
        onOpenChange={onOpenChange}
        onImport={onImport}
      />,
    );
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File([fileContent], 'bad.json', {
      type: 'application/json',
    });
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(fileContent),
    });
    fireEvent.change(input, {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole('button', { name: /import/i }));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(i18n.t('failedImportFile')),
    );
    expect(onImport).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  test('shows error toast when no file selected', () => {
    const onImport = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <BulkFileImportModal
        open={true}
        onOpenChange={onOpenChange}
        onImport={onImport}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /import/i }));

    expect(toast.error).toHaveBeenCalledWith(i18n.t('pleaseSelectFile'));
    expect(onImport).not.toHaveBeenCalled();
  });
});
