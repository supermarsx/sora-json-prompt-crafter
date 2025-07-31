import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImportModal from '../ImportModal';
import { toast } from '@/components/ui/sonner-toast';
import i18n from '@/i18n';

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    error: jest.fn(),
  },
}));

describe('ImportModal', () => {
  beforeEach(() => {
    (toast.error as jest.Mock).mockClear();
  });

  test('imports valid JSON from textarea and closes', () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const textarea = screen.getByPlaceholderText(
      i18n.t('pasteJsonPlaceholder'),
    );
    fireEvent.change(textarea, { target: { value: '{"prompt":"test"}' } });
    const button = screen.getByRole('button', { name: i18n.t('import') });
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
      i18n.t('pasteJsonPlaceholder'),
    ) as HTMLTextAreaElement;
    fireEvent.change(input, {
      target: {
        files: [new File(['dummy'], 'test.json', { type: 'application/json' })],
      },
    });

    await waitFor(() => expect(textarea.value).toBe(fileContent));

    const button = screen.getByRole('button', { name: i18n.t('import') });
    fireEvent.click(button);

    expect(onImport).toHaveBeenCalledWith(fileContent);
    expect(onClose).toHaveBeenCalled();
  });

  test('invalid JSON shows error toast', () => {
    const onImport = jest.fn();
    const onClose = jest.fn();
    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />);
    const textarea = screen.getByPlaceholderText(
      i18n.t('pasteJsonPlaceholder'),
    );
    fireEvent.change(textarea, { target: { value: '{bad json' } });
    const button = screen.getByRole('button', { name: i18n.t('import') });
    fireEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith(i18n.t('invalidJson'));
    expect(onImport).not.toHaveBeenCalled();
  });
});
