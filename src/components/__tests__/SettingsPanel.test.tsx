import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPanel from '../SettingsPanel';
import { stylePresets } from '@/data/stylePresets';
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
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('@/lib/date', () => ({
  __esModule: true,
  formatDateTime: jest.fn(() => '20240101-000000'),
  formatDisplayDate: jest.fn(() => 'Jan 1, 2024, 12:00 AM'),
}));
jest.mock('@/hooks/use-dark-mode', () => ({
  __esModule: true,
  useDarkMode: jest.fn(() => [false, jest.fn()] as const),
}));

jest.mock('@/components/ui/dialog', () => ({
  __esModule: true,
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => (
    open ? <div>{children}</div> : null
  ),
  DialogContent: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

jest.mock('@/components/SearchableDropdown', () => ({
  __esModule: true,
  SearchableDropdown: ({
    options,
    value,
    onValueChange,
    placeholder,
  }: {
    options: string[];
    value: string;
    onValueChange: (v: string) => void;
    placeholder?: string;
  }) => (
    <select
      data-testid="custom-key-dropdown"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  ),
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
    ...overrides,
  };
  return { ...render(<SettingsPanel {...props} />), props };
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
    const createSpy = jest
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
    createSpy.mockRestore();
  });

  test('shows manage tab grouped headings', () => {
    renderPanel({ defaultTab: 'manage' });
    expect(
      screen.getByRole('heading', { name: /data management/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: /json generation/i }),
    ).toBeTruthy();
  });

  test('dialog content has responsive size classes', () => {
    renderPanel();
    const content = screen.getByTestId('dialog-content');
    const cls = content.className;
    expect(cls).toContain('w-[90vw]');
    expect(cls).toContain('max-w-lg');
    expect(cls).toContain('h-[80vh]');
    expect(cls).toContain('overflow-hidden');
  });

  test('milestones tab renders categories with descriptions and medals', () => {
    renderPanel({ defaultTab: 'milestones' });
    const title = screen.getByText(/copy/i);
    expect(title).toBeTruthy();
    const description = title.nextElementSibling as HTMLElement | null;
    expect(description).toBeTruthy();
    expect(description?.textContent).toMatch(/you did/i);
    const medalRow = description?.nextElementSibling as HTMLElement | null;
    expect(medalRow).toBeTruthy();
    expect(medalRow?.className).toContain('mt-2');
    expect(medalRow?.className).toContain('flex-wrap');
  });

  test('custom key dropdown populates input and excludes use_ keys', () => {
    renderPanel({ defaultTab: 'custom-values' });
    const select = screen.getByTestId('custom-key-dropdown') as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain('material');
    expect(options).not.toContain('use_material');
    fireEvent.change(select, { target: { value: 'material' } });
    const input = screen.getByPlaceholderText(
      i18n.t('customKeyPlaceholder'),
    ) as HTMLInputElement;
    expect(input.value).toBe('material');
  });

  test('updates custom key dropdown when style preset categories change', () => {
    const { rerender, props } = renderPanel({ defaultTab: 'custom-values' });
    let select = screen.getByTestId('custom-key-dropdown') as HTMLSelectElement;
    let options = Array.from(select.options).map((o) => o.value);
    expect(options).not.toContain('style_Extra');
    stylePresets.Extra = ['unique'];
    rerender(<SettingsPanel {...props} />);
    select = screen.getByTestId('custom-key-dropdown') as HTMLSelectElement;
    options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain('style_Extra');
    delete stylePresets.Extra;
  });

  test('allows manual entry of custom key', () => {
    renderPanel({ defaultTab: 'custom-values' });
    const input = screen.getByPlaceholderText(
      i18n.t('customKeyPlaceholder'),
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'my_custom_key' } });
    expect(input.value).toBe('my_custom_key');
  });
});
