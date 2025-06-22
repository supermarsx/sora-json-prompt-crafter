import { renderHook, act } from '@testing-library/react'
import { SidebarProvider } from '../sidebar'
import { useSidebar } from '../use-sidebar'
import { useIsMobile } from '@/hooks/use-mobile'

jest.mock('@/hooks/use-mobile', () => ({
  __esModule: true,
  useIsMobile: jest.fn(),
}))

const mockUseIsMobile = useIsMobile as jest.Mock

function wrapper({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>
}

describe('useSidebar hook', () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false)
    Object.defineProperty(document, 'cookie', { writable: true, value: '' })
  })

  test('throws when used without provider', () => {
    expect(() => renderHook(() => useSidebar())).toThrow(
      'useSidebar must be used within a SidebarProvider.'
    )
  })

  test('toggleSidebar updates state and cookie on desktop', () => {
    const { result } = renderHook(() => useSidebar(), { wrapper })
    expect(result.current.open).toBe(true)

    act(() => {
      result.current.toggleSidebar()
    })

    expect(result.current.open).toBe(false)
    expect(document.cookie).toContain('sidebar:state=false')
  })

  test('toggleSidebar updates mobile state only when mobile', () => {
    mockUseIsMobile.mockReturnValue(true)
    const { result } = renderHook(() => useSidebar(), { wrapper })
    expect(result.current.openMobile).toBe(false)

    act(() => {
      result.current.toggleSidebar()
    })

    expect(result.current.openMobile).toBe(true)
    expect(result.current.open).toBe(true)
    expect(document.cookie).not.toContain('sidebar:state=')
  })
})
