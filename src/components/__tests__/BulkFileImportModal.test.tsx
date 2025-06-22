import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BulkFileImportModal from '../BulkFileImportModal'
import { toast } from '@/components/ui/sonner-toast'
import { trackEvent } from '@/lib/analytics'
import { useTracking } from '@/hooks/use-tracking'

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}))

jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true] as const),
}))

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('BulkFileImportModal', () => {
  beforeEach(() => {
    ;(toast.success as jest.Mock).mockClear()
    ;(toast.error as jest.Mock).mockClear()
    ;(trackEvent as jest.Mock).mockClear()
  })

  test('imports valid JSON array', async () => {
    const onImport = jest.fn()
    const onOpenChange = jest.fn()
    const fileContent = '[{"prompt":"test"}]'
    render(
      <BulkFileImportModal open={true} onOpenChange={onOpenChange} onImport={onImport} />
    )
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([fileContent], 'test.json', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: () => Promise.resolve(fileContent) })
    fireEvent.change(input, {
      target: { files: [file] },
    })
    fireEvent.click(screen.getByRole('button', { name: /import/i }))
    await waitFor(() => expect(onImport).toHaveBeenCalledWith(['{"prompt":"test"}']))
    expect(toast.success).toHaveBeenCalledWith('File imported!')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  test('shows error toast for invalid JSON', async () => {
    const onImport = jest.fn()
    const onOpenChange = jest.fn()
    const fileContent = '{bad json}'
    render(
      <BulkFileImportModal open={true} onOpenChange={onOpenChange} onImport={onImport} />
    )
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([fileContent], 'bad.json', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: () => Promise.resolve(fileContent) })
    fireEvent.change(input, {
      target: { files: [file] },
    })
    fireEvent.click(screen.getByRole('button', { name: /import/i }))
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to import file'))
    expect(onImport).not.toHaveBeenCalled()
  })
})
