import * as React from 'react';

export type SidebarContextValue = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContextValue | null>(
  null,
);

/**
 * Hook to access the current sidebar context.
 * Depends on {@link SidebarContext} provided by a parent `SidebarProvider`.
 * Returns an object with `state`, `open`, `setOpen`, `openMobile`, `setOpenMobile`,
 * `isMobile`, and `toggleSidebar`.
 *
 * @returns {SidebarContextValue} Sidebar state and controls.
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}
