import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPanel from '../SettingsPanel';
import i18n from '@/i18n';
import {
  importCustomPresets,
  loadCustomPresetsFromUrl,
  exportCurrentPresets,
  resetPresetCollections,
} from '@/lib/presetLoader';
import { toast } from '@/components/ui/sonner-toast';

jest.mock('@/lib/presetLoader', () => ({
  importCustomPresets: jest.fn(),
  loadCustomPresetsFromUrl: jest.fn(),
  exportCurrentPresets: jest.fn(() => ({})),
  resetPresetCollections: jest.fn(),
}));

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@/hooks/use-dark-mode', () => ({
  __esModule: true,
  useDarkMode: jest.fn(() => [false, jest.fn()] as const),
}));

jest.mock('@/lib/storage', () => ({
  exportAppData: jest.fn(() => ({})),
  importAppData: jest.fn(),
  safeGet: jest.fn((key: string) => (key === 'customPresetsUrl' ? '' : [])),
  getCustomValues: jest.fn(() => ({})),
  addCustomValue: jest.fn(),
  removeCustomValue: jest.fn(),
  updateCustomValue: jest.fn(),
  exportCustomValues: jest.fn(() => ({})),
  importCustomValues: jest.fn(),
  getSectionPresets: jest.fn(() => ({})),
  removeSectionPreset: jest.fn(),
  saveSectionPreset: jest.fn(),
}));

jest.mock('@/components/ui/dialog', () => ({
  __esModule: true,
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({
    children,
    ...props
  }: { children: React.ReactNode } & React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/scroll-area', () => ({
  __esModule: true,
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/ui/alert-dialog', () => ({
  __esModule: true,
  AlertDialog: ({
    open,
    children,
  }: {
    open: boolean;
    children: React.ReactNode;
  }) => (open ? <div>{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

function renderPanel(
  overrides: Partial<React.ComponentProps<typeof SettingsPanel>> = {},
) {
  const props = {
    open: true,
    onOpenChange: jest.fn(),
    onImport: jest.fn(),
    onReset: jest.fn(),
    onRegenerate: jest.fn(),
    onRandomize: jest.fn(),
    trackingEnabled: false,
    onToggleTracking: jest.fn(),
    soraToolsEnabled: true,
    onToggleSoraTools: jest.fn(),
    headerVisible: true,
    onToggleHeaderVisible: jest.fn(),
    headerButtonsEnabled: true,
    onToggleHeaderButtons: jest.fn(),
    logoEnabled: true,
    onToggleLogo: jest.fn(),
    darkModeToggleVisible: true,
    onToggleDarkModeToggleVisible: jest.fn(),
    floatingJsonEnabled: false,
    onToggleFloatingJson: jest.fn(),
    shortcutsEnabled: true,
    onToggleShortcuts: jest.fn(),
    actionLabelsEnabled: true,
    onToggleActionLabels: jest.fn(),
    coreActionLabelsOnly: false,
    onToggleCoreActionLabels: jest.fn(),
    temporaryModeEnabled: false,
    onToggleTemporaryMode: jest.fn(),
    defaultTab: 'presets' as const,
    ...overrides,
  };
  return render(<SettingsPanel {...props} />);
}

describe('SettingsPanel presets tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('export presets to file', () => {
    (exportCurrentPresets as jest.Mock).mockReturnValue({ a: ['b'] });
    Object.assign(URL, {
      createObjectURL: jest.fn(() => 'blob:url'),
      revokeObjectURL: jest.fn(),
    });
    renderPanel();
    const exportBtn = screen.getByRole('button', { name: /export presets/i });
    fireEvent.click(exportBtn);
    expect(exportCurrentPresets).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Presets exported');
  });

  test('load presets from url and clear', async () => {
    renderPanel();
    const urlInput = screen.getByPlaceholderText(/preset pack url/i);
    fireEvent.change(urlInput, { target: { value: 'http://example.com' } });
    const loadBtn = screen.getByRole('button', { name: /load presets/i });
    fireEvent.click(loadBtn);
    expect(loadCustomPresetsFromUrl).toHaveBeenCalledWith('http://example.com');

    const clearBtn = screen.getByRole('button', { name: /clear presets/i });
    fireEvent.click(clearBtn);
    expect(resetPresetCollections).toHaveBeenCalled();
  });

  test('apply edited presets', () => {
    renderPanel();
    const boxes = screen.getAllByRole('textbox');
    const textarea = boxes[1];
    fireEvent.change(textarea, { target: { value: '{"x":["y"]}' } });
    const applyBtn = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyBtn);
    expect(importCustomPresets).toHaveBeenCalledWith({ x: ['y'] });
  });
});
