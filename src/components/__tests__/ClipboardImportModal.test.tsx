import { render, screen, fireEvent } from '@testing-library/react';
import ClipboardImportModal from '../ClipboardImportModal';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import i18n from '@/i18n';
import { useTracking } from '@/hooks/use-tracking';
import { toast } from '@/components/ui/sonner-toast';
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

describe('ClipboardImportModal', () => {
  beforeEach(() => {
    (trackEvent as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  test('imports valid JSON and tracks event', () => {
    const onImport = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <ClipboardImportModal
        open={true}
        onOpenChange={onOpenChange}
        onImport={onImport}
        title="Import"
      />,
    );
    const textarea = screen.getByPlaceholderText(/paste json/i);
    fireEvent.change(textarea, { target: { value: '{"prompt":"test"}' } });
    const button = screen.getByRole('button', { name: /import/i });
    fireEvent.click(button);

    expect(onImport).toHaveBeenCalledWith(['{"prompt":"test"}']);
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.HistoryImport, {
      type: 'clipboard',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('imports array of JSON strings', () => {
    const onImport = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <ClipboardImportModal
        open={true}
        onOpenChange={onOpenChange}
        onImport={onImport}
        title="Import"
      />,
    );
    const textarea = screen.getByPlaceholderText(/paste json/i);
    const arrayText = JSON.stringify(['{"prompt":"one"}', '{"prompt":"two"}']);
    fireEvent.change(textarea, {
      target: { value: arrayText },
    });
    const button = screen.getByRole('button', { name: /import/i });
    fireEvent.click(button);

    expect(onImport).toHaveBeenCalledWith([
      '{"prompt":"one"}',
      '{"prompt":"two"}',
    ]);
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.HistoryImport, {
      type: 'clipboard',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('imports array of objects with json property', () => {
    const onImport = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <ClipboardImportModal
        open={true}
        onOpenChange={onOpenChange}
        onImport={onImport}
        title="Import"
      />,
    );
    const textarea = screen.getByPlaceholderText(/paste json/i);
    const objectArrayText = JSON.stringify([
      { json: '{"prompt":"one"}' },
      { json: '{"prompt":"two"}' },
    ]);
    fireEvent.change(textarea, {
      target: { value: objectArrayText },
    });
    const button = screen.getByRole('button', { name: /import/i });
    fireEvent.click(button);

    expect(onImport).toHaveBeenCalledWith([
      '{"prompt":"one"}',
      '{"prompt":"two"}',
    ]);
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.HistoryImport, {
      type: 'clipboard',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('shows error and closes on invalid JSON', () => {
    const onImport = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <ClipboardImportModal
        open={true}
        onOpenChange={onOpenChange}
        onImport={onImport}
        title="Import"
      />,
    );
    const textarea = screen.getByPlaceholderText(/paste json/i);
    fireEvent.change(textarea, { target: { value: '{bad json' } });
    const button = screen.getByRole('button', { name: /import/i });
    fireEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith(i18n.t('invalidJson'));
    expect(onImport).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
