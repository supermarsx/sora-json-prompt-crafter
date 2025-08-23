import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPanel from '../SettingsPanel';
import { purgeCache } from '@/lib/purgeCache';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import i18n from '@/i18n';
import { toast } from '@/components/ui/sonner-toast';
import { exportAppData, importAppData } from '@/lib/storage';

jest.mock('@/lib/purgeCache', () => ({ purgeCache: jest.fn() }));
jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { ...actual, trackEvent: jest.fn() };
});
jest.mock('@/lib/storage', () => ({
  exportAppData: jest.fn(() => ({})),
  importAppData: jest.fn(),
  safeGet: jest.fn(() => []),
}));
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('@/lib/date', () => ({
  __esModule: true,
  formatDateTime: jest.fn(() => '20240101-000000'),
}));

jest.mock('@/components/ui/dialog', () => ({
  __esModule: true,
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => (
    open ? <div>{children}</div> : null
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/scroll-area', () => ({
  __esModule: true,
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/alert-dialog', () => ({
  __esModule: true,
  AlertDialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => (
    open ? <div>{children}</div> : null
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogAction: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

function renderPanel(overrides: Partial<React.ComponentProps<typeof SettingsPanel>> = {}) {
  const props = {
    open: true,
    onOpenChange: jest.fn(),
    onImport: jest.fn(),
    onReset: jest.fn(),
    onRegenerate: jest.fn(),
    onRandomize: jest.fn(),
    trackingEnabled: true,
    onToggleTracking: jest.fn(),
    soraToolsEnabled: true,
    onToggleSoraTools: jest.fn(),
    headerButtonsEnabled: true,
    onToggleHeaderButtons: jest.fn(),
    logoEnabled: true,
    onToggleLogo: jest.fn(),
    actionLabelsEnabled: true,
    onToggleActionLabels: jest.fn(),
    coreActionLabelsOnly: false,
    onToggleCoreActionLabels: jest.fn(),
    ...overrides,
  };
  return render(<SettingsPanel {...props} />);
}

describe('SettingsPanel', () => {
  test('purge cache requires confirmation', async () => {
    renderPanel({ defaultTab: 'general' });
    const purgeBtn = screen.getByRole('button', { name: /purge cache/i });
    fireEvent.click(purgeBtn);
    const confirmBtn = screen.getByRole('button', {
      name: i18n.t('purgeCacheConfirm'),
    });
    fireEvent.click(confirmBtn);
    expect(purgeCache).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith(
      true,
      AnalyticsEvent.PurgeCache,
    );
  });

  test('export and import data buttons work', async () => {
    (exportAppData as jest.Mock).mockReturnValue({ a: 1 });
    Object.assign(URL, {
      createObjectURL: jest.fn(() => 'blob:url'),
      revokeObjectURL: jest.fn(),
    });
    const file = { text: jest.fn().mockResolvedValue('{"b":2}') };
    const input = {
      type: '',
      accept: '',
      files: [file],
      click: jest.fn(),
      onchange: null as null | (() => void),
    } as unknown as HTMLInputElement;
    const originalCreate = document.createElement.bind(document);
    jest
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string, opts?: ElementCreationOptions) =>
        tag === 'input' ? (input as HTMLElement) : originalCreate(tag, opts),
      );
    renderPanel({ defaultTab: 'general' });

    const exportBtn = screen.getByRole('button', { name: /export data/i });
    fireEvent.click(exportBtn);
    expect(exportAppData).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(i18n.t('dataExported'));
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.DataExport);

    (input.click as jest.Mock).mockImplementation(() => {
      if (input.onchange) {
        input.onchange(new Event('change'));
      }
    });
    const importBtn = screen.getByRole('button', { name: /import data/i });
    fireEvent.click(importBtn);
    await waitFor(() => expect(importAppData).toHaveBeenCalledWith({ b: 2 }));
    expect(toast.success).toHaveBeenCalledWith(i18n.t('dataImported'));
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.DataImport);
  });
});
