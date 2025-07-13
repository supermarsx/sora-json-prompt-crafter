import {
  renderHook,
  act,
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { SidebarProvider, Sidebar, SidebarTrigger } from '../sidebar';
import { useSidebar } from '../use-sidebar';
import { SIDEBAR_KEYBOARD_SHORTCUT } from '../sidebar-constants';
import { useIsMobile } from '@/hooks/use-mobile';

jest.mock('@/hooks/use-mobile', () => ({
  __esModule: true,
  useIsMobile: jest.fn(),
}));

const mockUseIsMobile = useIsMobile as jest.Mock;

function wrapper({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

function SidebarState() {
  const { open, openMobile } = useSidebar();
  return (
    <>
      <div data-testid="open-state">{String(open)}</div>
      <div data-testid="open-mobile">{String(openMobile)}</div>
    </>
  );
}

describe('useSidebar hook', () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
    Object.defineProperty(document, 'cookie', { writable: true, value: '' });
  });

  test('throws when used without provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useSidebar())).toThrow(
      'useSidebar must be used within a SidebarProvider.',
    );
    spy.mockRestore();
  });

  test('toggleSidebar updates state and cookie on desktop', () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });
    expect(result.current.open).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.open).toBe(false);
    expect(document.cookie).toContain('sidebar:state=false');
  });

  test('toggleSidebar updates mobile state only when mobile', () => {
    mockUseIsMobile.mockReturnValue(true);
    const { result } = renderHook(() => useSidebar(), { wrapper });
    expect(result.current.openMobile).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.openMobile).toBe(true);
    expect(result.current.open).toBe(true);
    expect(document.cookie).not.toContain('sidebar:state=');
  });

  test('sidebar toggles on keyboard shortcut', () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });
    expect(result.current.open).toBe(true);

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: SIDEBAR_KEYBOARD_SHORTCUT,
          ctrlKey: true,
        }),
      );
    });

    expect(result.current.open).toBe(false);
  });
});

describe('SidebarProvider with components', () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
    Object.defineProperty(document, 'cookie', { writable: true, value: '' });
  });

  function setup() {
    render(
      <SidebarProvider>
        <Sidebar>
          <div />
        </Sidebar>
        <SidebarTrigger />
        <SidebarState />
      </SidebarProvider>,
    );
  }

  test('trigger and keyboard toggle desktop sidebar', () => {
    setup();

    expect(screen.getByTestId('open-state').textContent).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));

    expect(screen.getByTestId('open-state').textContent).toBe('false');
    expect(document.cookie).toContain('sidebar:state=false');

    fireEvent.keyDown(window, {
      key: SIDEBAR_KEYBOARD_SHORTCUT,
      ctrlKey: true,
    });

    expect(screen.getByTestId('open-state').textContent).toBe('true');
    expect(document.cookie).toContain('sidebar:state=true');
  });

  test('mobile mode toggles openMobile only', () => {
    mockUseIsMobile.mockReturnValue(true);
    setup();

    expect(screen.getByTestId('open-state').textContent).toBe('true');
    expect(screen.getByTestId('open-mobile').textContent).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));

    expect(screen.getByTestId('open-mobile').textContent).toBe('true');
    expect(screen.getByTestId('open-state').textContent).toBe('true');
    expect(document.cookie).not.toContain('sidebar:state=');

    fireEvent.keyDown(window, {
      key: SIDEBAR_KEYBOARD_SHORTCUT,
      ctrlKey: true,
    });

    expect(screen.getByTestId('open-mobile').textContent).toBe('false');
    expect(screen.getByTestId('open-state').textContent).toBe('true');
    expect(document.cookie).not.toContain('sidebar:state=');
  });
});
