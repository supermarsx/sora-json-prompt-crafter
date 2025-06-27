import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistoryPanel from '../HistoryPanel';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent } from '@/lib/analytics';
import { formatDateTime } from '@/lib/date';

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/lib/date', () => ({
  __esModule: true,
  formatDateTime: jest.fn(() => '20240101-000000'),
}));

jest.mock('../ClipboardImportModal', () => ({
  __esModule: true,
  default: ({
    open,
    onImport,
    onOpenChange,
  }: {
    open: boolean;
    onImport: (jsons: string[]) => void;
    onOpenChange: (o: boolean) => void;
  }) =>
    open ? (
      <button
        onClick={() => {
          onImport(['{}']);
          onOpenChange(false);
        }}
        data-testid="mock-import"
      />
    ) : null,
}));

jest.mock('../BulkFileImportModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  __esModule: true,
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild: _asChild,
    ...props
  }: React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }) => (
    <span {...props}>{children}</span>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onSelect,
  }: {
    children: React.ReactNode;
    onSelect?: () => void;
  }) => <button onClick={onSelect}>{children}</button>,
}));

beforeEach(() => {
  (toast.success as jest.Mock).mockClear();
  (toast.error as jest.Mock).mockClear();
  (trackEvent as jest.Mock).mockClear();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: jest.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
  localStorage.clear();
  window.matchMedia = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  jest.restoreAllMocks();
});

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
};

function renderPanel(props = {}) {
  return render(<HistoryPanel {...defaultProps} {...props} />);
}

describe('HistoryPanel', () => {
  test('exports history to clipboard', async () => {
    renderPanel();
    const exportBtn = screen.getByRole('button', { name: /export/i });
    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    const copy = await screen.findByText(/copy all to clipboard/i);
    fireEvent.click(copy);
    await waitFor(() =>
      expect(
        (navigator.clipboard.writeText as jest.Mock).mock.calls.length,
      ).toBe(1),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(defaultProps.history, null, 2),
    );
    expect(toast.success).toHaveBeenCalledWith(
      'Copied all history to clipboard!',
    );
  });

  test('imports prompts from clipboard', async () => {
    const onImport = jest.fn();
    renderPanel({ onImport });
    const item = screen.getAllByText(/paste from clipboard/i)[0];
    fireEvent.click(item);
    const confirmBtn = await screen.findByTestId('mock-import');
    fireEvent.click(confirmBtn);
    expect(onImport).toHaveBeenCalledWith(['{}']);
  });

  test('clears action history', async () => {
    localStorage.setItem(
      'trackingHistory',
      JSON.stringify([{ date: 'd', action: 'a' }]),
    );
    renderPanel();
    const actionsTab = screen.getByRole('tab', { name: /latest actions/i });
    fireEvent.mouseDown(actionsTab);
    fireEvent.click(actionsTab);
    fireEvent.click(
      await screen.findByRole('button', { name: /clear actions/i }),
    );
    expect(await screen.findByText(/clear latest actions\?/i)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }));
    expect(localStorage.getItem('trackingHistory')).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Actions cleared!');
  });

  test('switches between tabs', () => {
    renderPanel({ actionHistory: [] });
    expect(
      screen.queryByText(/clipboard copied prompt history/i),
    ).not.toBeNull();
    const actionsTab = screen.getByRole('tab', { name: /latest actions/i });
    fireEvent.mouseDown(actionsTab);
    fireEvent.click(actionsTab);
    expect(screen.queryByText(/no actions yet/i)).not.toBeNull();
    const promptsTab = screen.getByRole('tab', { name: /json prompts/i });
    fireEvent.mouseDown(promptsTab);
    fireEvent.click(promptsTab);
    expect(
      screen.queryByText(/clipboard copied prompt history/i),
    ).not.toBeNull();
  });

  test('downloads history file', async () => {
    const anchor: Partial<HTMLAnchorElement> & { click: jest.Mock } = {
      click: jest.fn(),
    };
    Object.assign(URL, {
      createObjectURL: jest.fn(() => 'blob:url'),
      revokeObjectURL: jest.fn(),
    });
    const origCreate = document.createElement;
    jest.spyOn(document, 'createElement').mockImplementation(function (
      tag: string,
    ) {
      if (tag === 'a') return anchor as unknown as HTMLElement;
      return origCreate.call(this, tag);
    });
    jest.spyOn(Math, 'random').mockReturnValue(0.1);

    renderPanel();
    const exportBtn = screen.getByRole('button', { name: /export/i });
    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    fireEvent.click(await screen.findByText(/download json/i));

    expect(anchor.click).toHaveBeenCalled();
    expect(anchor.download).toBe('history-20240101-000000-199999.json');
  });

  test('exports action history to file', () => {
    const anchor: Partial<HTMLAnchorElement> & { click: jest.Mock } = {
      click: jest.fn(),
    };
    Object.assign(URL, {
      createObjectURL: jest.fn(() => 'blob:url'),
      revokeObjectURL: jest.fn(),
    });
    const origCreate = document.createElement;
    jest.spyOn(document, 'createElement').mockImplementation(function (
      tag: string,
    ) {
      if (tag === 'a') return anchor as unknown as HTMLElement;
      return origCreate.call(this, tag);
    });
    jest.spyOn(Math, 'random').mockReturnValue(0.1);

    renderPanel();
    const actionsTab = screen.getByRole('tab', { name: /latest actions/i });
    fireEvent.mouseDown(actionsTab);
    fireEvent.click(actionsTab);
    fireEvent.click(screen.getByRole('button', { name: /^export$/i }));

    expect(anchor.click).toHaveBeenCalled();
    expect(anchor.download).toBe('latest-actions-20240101-000000-199999.json');
  });

  test('deleting an action confirms then removes it', () => {
    localStorage.setItem(
      'trackingHistory',
      JSON.stringify([{ date: 'd', action: 'a' }]),
    );
    renderPanel();
    const actionsTab = screen.getByRole('tab', { name: /latest actions/i });
    fireEvent.mouseDown(actionsTab);
    fireEvent.click(actionsTab);
    const btn = screen
      .getByText('a')
      .parentElement!.querySelector('button') as HTMLButtonElement;
    fireEvent.click(btn);
    expect(localStorage.getItem('trackingHistory')).toBe(
      JSON.stringify([{ date: 'd', action: 'a' }]),
    );
    fireEvent.click(btn);
    expect(localStorage.getItem('trackingHistory')).toBe('[]');
    expect(toast.success).toHaveBeenCalledWith('Action deleted!');
  });

  test('preview dialog shows json', () => {
    renderPanel();
    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    expect(screen.getByText(/json preview/i)).toBeTruthy();
    expect(screen.getByText(/"prompt"/i)).toBeTruthy();
  });

  test('clearing history asks for confirmation', () => {
    const onClear = jest.fn();
    renderPanel({ onClear });
    fireEvent.click(screen.getByRole('button', { name: /clear history/i }));
    expect(screen.getByText(/clear history\?/i)).toBeTruthy();
    expect(onClear).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }));
    expect(onClear).toHaveBeenCalled();
  });
});
