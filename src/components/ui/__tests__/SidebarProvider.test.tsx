import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarProvider, SidebarTrigger } from '../sidebar';
import { useSidebar } from '../use-sidebar';
import { SIDEBAR_KEYBOARD_SHORTCUT } from '../sidebar-constants';
import { useIsMobile } from '@/hooks/use-mobile';

jest.mock('@/hooks/use-mobile', () => ({
  __esModule: true,
  useIsMobile: jest.fn(),
}));

const mockUseIsMobile = useIsMobile as jest.Mock;

function SidebarState() {
  const { open } = useSidebar();
  return <div data-testid="sidebar-state">{String(open)}</div>;
}

describe('SidebarProvider with SidebarTrigger', () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
    Object.defineProperty(document, 'cookie', { writable: true, value: '' });
  });

  test('toggle via trigger and keyboard updates state and cookie', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <SidebarState />
      </SidebarProvider>,
    );

    // initial open is true
    expect(screen.getByTestId('sidebar-state').textContent).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));

    expect(screen.getByTestId('sidebar-state').textContent).toBe('false');
    expect(document.cookie).toContain('sidebar:state=false');

    fireEvent.keyDown(window, {
      key: SIDEBAR_KEYBOARD_SHORTCUT,
      ctrlKey: true,
    });

    expect(screen.getByTestId('sidebar-state').textContent).toBe('true');
    expect(document.cookie).toContain('sidebar:state=true');
  });
});
