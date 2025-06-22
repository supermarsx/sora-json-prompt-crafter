import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ImportModal from '../ImportModal'
import { toast } from '@/components/ui/sonner-toast'

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    error: jest.fn(),
  },
}))

describe('ImportModal', () => {
  beforeEach(() => {
    ;(toast.error as jest.Mock).mockClear()
  })

  test('imports valid JSON from textarea and closes', () => {
    const onImport = jest.fn()
    const onClose = jest.fn()
    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />)
    const textarea = screen.getByPlaceholderText(/paste json/i)
    fireEvent.change(textarea, { target: { value: '{"prompt":"test"}' } })
    const button = screen.getByRole('button', { name: /import/i })
    fireEvent.click(button)

    expect(onImport).toHaveBeenCalledWith('{"prompt":"test"}')
    expect(onClose).toHaveBeenCalled()
  })

  test('file input populates textarea and imports valid JSON', async () => {
    const onImport = jest.fn()
    const onClose = jest.fn()
    const fileContent = '{"prompt":"test"}'
    class MockFileReader {
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null
      readAsText(_file: Blob) {
        this.onload?.({ target: { result: fileContent } } as any)
      }
    }
    ;(global as any).FileReader = jest.fn(() => new MockFileReader())

    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const textarea = screen.getByPlaceholderText(/paste json/i) as HTMLTextAreaElement
    fireEvent.change(input, {
      target: { files: [new File(['dummy'], 'test.json', { type: 'application/json' })] },
    })

    await waitFor(() => expect(textarea.value).toBe(fileContent))

    const button = screen.getByRole('button', { name: /import/i })
    fireEvent.click(button)

    expect(onImport).toHaveBeenCalledWith(fileContent)
    expect(onClose).toHaveBeenCalled()
  })

  test('invalid JSON shows error toast', () => {
    const onImport = jest.fn()
    const onClose = jest.fn()
    render(<ImportModal isOpen={true} onClose={onClose} onImport={onImport} />)
    const textarea = screen.getByPlaceholderText(/paste json/i)
    fireEvent.change(textarea, { target: { value: '{bad json' } })
    const button = screen.getByRole('button', { name: /import/i })
    fireEvent.click(button)

    expect(toast.error).toHaveBeenCalledWith('Invalid JSON')
    expect(onImport).not.toHaveBeenCalled()
  })
})
