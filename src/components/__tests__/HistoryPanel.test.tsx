import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HistoryPanel from '../HistoryPanel'
import { toast } from '@/components/ui/sonner-toast'
import { trackEvent } from '@/lib/analytics'

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}))


jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../ClipboardImportModal', () => ({
  __esModule: true,
  default: ({ open, onImport, onOpenChange }: { open: boolean; onImport: (jsons: string[]) => void; onOpenChange: (o: boolean) => void }) =>
    open ? (
      <button onClick={() => { onImport(['{}']); onOpenChange(false); }} data-testid="mock-import" />
    ) : null,
}))

jest.mock('../BulkFileImportModal', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('@/components/ui/dropdown-menu', () => ({
  __esModule: true,
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild: _asChild, ...props }: React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }) => (
    <span {...props}>{children}</span>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) => (
    <button onClick={onSelect}>{children}</button>
  ),
}))

beforeEach(() => {
  ;(toast.success as jest.Mock).mockClear()
  ;(toast.error as jest.Mock).mockClear()
  ;(trackEvent as jest.Mock).mockClear()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: jest.fn().mockResolvedValue(undefined) },
    configurable: true,
  })
  localStorage.clear()
  window.matchMedia = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }) as unknown as typeof window.matchMedia
})

const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
  history: [{ id: 1, date: 'd', json: '{}' }],
  actionHistory: [{ date: 'd', action: 'a' }],
  onDelete: jest.fn(),
  onClear: jest.fn(),
  onCopy: jest.fn(),
  onEdit: jest.fn(),
  onImport: jest.fn(),
}

function renderPanel(props = {}) {
  return render(<HistoryPanel {...defaultProps} {...props} />)
}


describe('HistoryPanel', () => {
  test('exports history to clipboard', async () => {
    renderPanel()
    const exportBtn = screen.getByRole('button', { name: /export/i })
    fireEvent.mouseDown(exportBtn)
    fireEvent.click(exportBtn)
    const copy = await screen.findByText(/copy all to clipboard/i)
    fireEvent.click(copy)
    await waitFor(() =>
      expect((navigator.clipboard.writeText as jest.Mock).mock.calls.length).toBe(1)
    )
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(defaultProps.history, null, 2)
    )
    expect(toast.success).toHaveBeenCalledWith('Copied all history to clipboard!')
  })

  test('imports prompts from clipboard', async () => {
    const onImport = jest.fn()
    renderPanel({ onImport })
    const item = screen.getAllByText(/paste from clipboard/i)[0]
    fireEvent.click(item)
    const confirmBtn = await screen.findByTestId('mock-import')
    fireEvent.click(confirmBtn)
    expect(onImport).toHaveBeenCalledWith(['{}'])
  })

  test('clears action history', async () => {
    localStorage.setItem('trackingHistory', JSON.stringify([{ date: 'd', action: 'a' }]))
    renderPanel()
    const actionsTab = screen.getByRole('tab', { name: /latest actions/i })
    fireEvent.mouseDown(actionsTab)
    fireEvent.click(actionsTab)
    fireEvent.click(await screen.findByRole('button', { name: /clear actions/i }))
    expect(await screen.findByText(/clear latest actions\?/i)).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }))
    expect(localStorage.getItem('trackingHistory')).toBeNull()
    expect(toast.success).toHaveBeenCalledWith('Actions cleared!')
  })

  test('switches between tabs', () => {
    renderPanel({ actionHistory: [] })
    expect(screen.queryByText(/clipboard copied prompt history/i)).not.toBeNull()
    const actionsTab = screen.getByRole('tab', { name: /latest actions/i })
    fireEvent.mouseDown(actionsTab)
    fireEvent.click(actionsTab)
    expect(screen.queryByText(/no actions yet/i)).not.toBeNull()
    const promptsTab = screen.getByRole('tab', { name: /json prompts/i })
    fireEvent.mouseDown(promptsTab)
    fireEvent.click(promptsTab)
    expect(screen.queryByText(/clipboard copied prompt history/i)).not.toBeNull()
  })
})

