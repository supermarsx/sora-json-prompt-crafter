import { render, waitFor } from '@testing-library/react'
import Dashboard from '../Dashboard'
import { toast } from '@/components/ui/sonner-toast'

jest.mock('../HistoryPanel', () => ({ __esModule: true, default: () => null }))
jest.mock('../ControlPanel', () => ({ __esModule: true, ControlPanel: () => null }))
jest.mock('../ShareModal', () => ({ __esModule: true, ShareModal: () => null }))
jest.mock('../ImportModal', () => ({ __esModule: true, default: () => null }))
jest.mock('../Footer', () => ({ __esModule: true, default: () => null }))
jest.mock('../DisclaimerModal', () => ({ __esModule: true, default: () => null }))
jest.mock('../ProgressBar', () => ({ __esModule: true, ProgressBar: () => null, default: () => null }))

jest.mock('@/hooks/use-single-column', () => ({ __esModule: true, useIsSingleColumn: jest.fn(() => false) }))
jest.mock('@/hooks/use-dark-mode', () => ({ __esModule: true, useDarkMode: jest.fn(() => [false, jest.fn()] as const) }))
jest.mock('@/hooks/use-tracking', () => ({ __esModule: true, useTracking: jest.fn(() => [true, jest.fn()] as const) }))
jest.mock('@/hooks/use-action-history', () => ({ __esModule: true, useActionHistory: jest.fn(() => []) }))
jest.mock('@/lib/analytics', () => ({ __esModule: true, trackEvent: jest.fn() }))
jest.mock('@/components/ui/sonner-toast', () => ({ __esModule: true, toast: { success: jest.fn(), error: jest.fn() } }))

describe('Dashboard github stats failure', () => {
  beforeEach(() => {
    ;(toast.error as jest.Mock).mockClear()
    localStorage.clear()
    global.fetch = jest.fn().mockRejectedValue(new Error('fail')) as unknown as typeof fetch
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia
  })

  test('shows toast when stats fail to load', async () => {
    render(<Dashboard />)
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to load GitHub stats')
    )
  })
})
