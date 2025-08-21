import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImportModal from '../ImportModal';
import { toast } from '@/components/ui/sonner-toast';
import i18n from '@/i18n';
import { trackEvent } from '@/lib/analytics';

jest.mock('@/hooks/use-tracking', () => ({
  useTracking: () => [true],
}));

jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
  AnalyticsEvent: { ImportFromUrl: 'ImportFromUrl' },
}));

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    error: jest.fn(),
  },
}));

describe('ImportModal', () => {
  beforeEach(() => {
    (toast.error as jest.Mock).mockClear();
    (trackEvent as jest.Mock).mockClear();
    // @ts-expect-error fetch reset
    global.fetch = undefined;
  });

  test('imports valid JSON from textarea and closes', () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const textarea = screen.getByPlaceholderText(/paste json/i);
    fireEvent.change(textarea, { target: { value: '{"prompt":"test"}' } });
    const button = screen.getByRole('button', { name: /import/i });
    expect(button.getAttribute('title')).toBe(i18n.t('import'));
    fireEvent.click(button);

    expect(onImport).toHaveBeenCalledWith('{"prompt":"test"}');
    expect(onClose).toHaveBeenCalled();
  });

  test('file input populates textarea and imports valid JSON', async () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    const fileContent = '{"prompt":"test"}';
    class MockFileReader {
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null;
      readAsText(_file: Blob) {
        this.onload?.({
          target: { result: fileContent },
        } as unknown as ProgressEvent<FileReader>);
      }
    }
    (global as unknown as { FileReader: jest.Mock }).FileReader = jest.fn(
      () => new MockFileReader(),
    );

    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const textarea = screen.getByPlaceholderText(
      /paste json/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(input, {
      target: {
        files: [new File(['dummy'], 'test.json', { type: 'application/json' })],
      },
    });

    await waitFor(() => expect(textarea.value).toBe(fileContent));

    const button = screen.getByRole('button', { name: /import/i });
    expect(button.getAttribute('title')).toBe(i18n.t('import'));
    fireEvent.click(button);

    expect(onImport).toHaveBeenCalledWith(fileContent);
    expect(onClose).toHaveBeenCalled();
  });

  test('invalid JSON shows error toast', () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const textarea = screen.getByPlaceholderText(/paste json/i);
    fireEvent.change(textarea, { target: { value: '{bad json' } });
    const button = screen.getByRole('button', { name: /import/i });
    expect(button.getAttribute('title')).toBe(i18n.t('import'));
    fireEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith(i18n.t('invalidJson'));
    expect(onImport).not.toHaveBeenCalled();
  });

  test('fetches and imports valid JSON from URL', async () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    const json = '{"prompt":"test"}';
    // @ts-expect-error mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      type: 'cors',
      text: () => Promise.resolve(json),
    });

    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const urlInput = screen.getByPlaceholderText(/enter url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test.json' } });
    const fetchButton = screen.getByRole('button', { name: /fetch/i });
    fireEvent.click(fetchButton);

    await waitFor(() => expect(onImport).toHaveBeenCalledWith(json));
    expect(trackEvent).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  test('blocked request shows error toast', async () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    // @ts-expect-error mock fetch
    global.fetch = jest.fn().mockRejectedValue(new Error('blocked'));

    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const urlInput = screen.getByPlaceholderText(/enter url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test.json' } });
    const fetchButton = screen.getByRole('button', { name: /fetch/i });
    fireEvent.click(fetchButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(i18n.t('requestBlocked')));
    expect(onImport).not.toHaveBeenCalled();
  });

  test('invalid JSON from URL shows error toast', async () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    // @ts-expect-error mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      type: 'cors',
      text: () => Promise.resolve('bad json'),
    });

    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const urlInput = screen.getByPlaceholderText(/enter url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test.json' } });
    const fetchButton = screen.getByRole('button', { name: /fetch/i });
    fireEvent.click(fetchButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(i18n.t('invalidJson')));
    expect(onImport).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
