import React from 'react';
import i18n from '@/i18n';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from '@testing-library/react';
import HistoryPanel from '../HistoryPanel';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { formatDateTime } from '@/lib/date';
import { safeGet, safeSet, safeRemove } from '@/lib/storage';
import { TRACKING_HISTORY } from '@/lib/storage-keys';
import { TooltipProvider } from '@/components/ui/tooltip';

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

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

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  safeGet: jest.fn(),
  safeSet: jest.fn(),
  safeRemove: jest.fn(),
  getJson: jest.fn(),
  setJson: jest.fn(),
}));

jest.mock('@/components/ui/dialog', () => ({
  __esModule: true,
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => (
    open ? <div role="dialog">{children}</div> : null
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
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../ClipboardImportModal', () => ({
  __esModule: true,
  default: () => null,
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

const sampleHistory = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  date: Date.now(),
  json: `{"prompt":"p${i}"}`,
  favorite: i % 2 === 0,
  title: `title${i}`,
  editCount: i === 0 ? 3 : 0,
  copyCount: i === 0 ? 5 : 0,
}));
const sampleActions = [{ date: 'd', action: 'a' }];

function renderPanel(
  props: Partial<React.ComponentProps<typeof HistoryPanel>> = {},
) {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    history: sampleHistory,
    actionHistory: sampleActions,
    onDelete: jest.fn(),
    onClear: jest.fn(),
    onCopy: jest.fn(),
    onEdit: jest.fn(),
    onImport: jest.fn(),
    onToggleFavorite: jest.fn(),
    onRename: jest.fn(),
  };
  return render(
    <TooltipProvider>
      <HistoryPanel {...defaultProps} {...props} />
    </TooltipProvider>,
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: jest.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
  Object.assign(URL, {
    createObjectURL: jest.fn(() => 'blob:url'),
    revokeObjectURL: jest.fn(),
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('HistoryPanel basic actions', () => {
  test('displays copy and edit counters', () => {
    renderPanel();
    const editBtn = screen.getByRole('button', { name: /edit \(3\)/i });
    const copyBtn = screen.getByRole('button', { name: /copy \(5\)/i });
    expect(editBtn).toBeTruthy();
    expect(copyBtn).toBeTruthy();
  });
  test('exports to clipboard and file', async () => {
    renderPanel();
    const exportBtn = screen.getByRole('button', { name: /^export$/i });
    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    fireEvent.click(screen.getByText(/copy all to clipboard/i));
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalled(),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(sampleHistory, null, 2),
    );

    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    fireEvent.click(screen.getByText(/download json/i));
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  test('shows error when clipboard unsupported', () => {
    const nav = navigator as unknown as { clipboard?: unknown };
    const original = nav.clipboard;
    delete nav.clipboard;

    renderPanel();
    (trackEvent as jest.Mock).mockClear();

    const exportBtn = screen.getByRole('button', { name: /^export$/i });
    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    fireEvent.click(screen.getByText(/copy all to clipboard/i));

    expect(toast.error).toHaveBeenCalledWith(i18n.t('clipboardUnsupported'));
    expect(trackEvent).not.toHaveBeenCalledWith(
      expect.anything(),
      AnalyticsEvent.HistoryExport,
      expect.anything(),
    );

    if (original !== undefined) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: original,
      });
    }
  });

  test('no success toast when clipboard write fails', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('fail'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const onOpenChange = jest.fn();

    renderPanel({ onOpenChange });
    (trackEvent as jest.Mock).mockClear();

    const exportBtn = screen.getByRole('button', { name: /^export$/i });
    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    fireEvent.click(screen.getByText(/copy all to clipboard/i));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(toast.success).not.toHaveBeenCalledWith(i18n.t('copiedAllHistory'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('delete and clear callbacks fire and timers reset', async () => {
    const onDelete = jest.fn();
    const onClear = jest.fn();
    renderPanel({ onDelete, onClear });

    const list = screen.getByTestId('history-list');
    act(() => {
      Object.defineProperty(list, 'scrollTop', {
        configurable: true,
        value: 0,
        writable: true,
      });
      fireEvent.scroll(list);
    });

    const delBtn = screen.getAllByRole('button', { name: /delete/i })[0];
    expect(delBtn.textContent).toMatch(/delete/i);
    fireEvent.click(delBtn);
    expect(delBtn.textContent).toMatch(/confirm/i);
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    expect(delBtn.textContent).toMatch(/delete/i);

    fireEvent.click(delBtn);
    fireEvent.click(delBtn);
    expect(onDelete).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /clear history/i }));
    expect(screen.getByText(/clear history\?/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }));
    expect(onClear).toHaveBeenCalled();
    expect(screen.queryByText(/clear history\?/i)).toBeNull();
  });

  test('does not render data import/export buttons', () => {
    renderPanel();
    expect(
      screen.queryByRole('button', { name: /import data/i }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', { name: /export data/i }),
    ).toBeNull();
  });

  test('filters history based on search input', () => {
    renderPanel();
    expect(screen.getByText('p2')).toBeTruthy();

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'p1' } });

    expect(screen.queryByText('p2')).toBeNull();
    expect(screen.getByText('p1')).toBeTruthy();

    fireEvent.change(input, { target: { value: 'title2' } });
    expect(screen.queryByText('p1')).toBeNull();
    expect(screen.getByText('title2')).toBeTruthy();
  });

  test('renames history entry', () => {
    const onRename = jest.fn();
    renderPanel({ onRename });
    const renameBtn = screen.getAllByRole('button', { name: /rename/i })[0];
    fireEvent.click(renameBtn);
    const dialog = screen.getAllByRole('dialog')[1];
    const input = within(dialog).getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new title' } });
    const saveBtn = within(dialog).getByRole('button', { name: /save/i });
    fireEvent.click(saveBtn);
    expect(onRename).toHaveBeenCalledWith(1, 'new title');
  });

  test('toggles favorites and filters favorites', () => {
    const onToggleFavorite = jest.fn();
    renderPanel({ onToggleFavorite });

    const starBtn = screen.getAllByRole('button', { name: /unfavorite/i })[0];
    fireEvent.click(starBtn);
    expect(onToggleFavorite).toHaveBeenCalledWith(1);

    const filterBtn = screen.getByLabelText(/favorites filter/i);
    fireEvent.click(filterBtn);
    expect(screen.queryByText('p1')).toBeNull();
    expect(screen.getByText('p0')).toBeTruthy();
    fireEvent.click(filterBtn);
    expect(screen.getByText('p1')).toBeTruthy();
  });

  test('sorts history based on sort mode', () => {
      const history = [
        {
          id: 1,
          date: new Date('2024-01-01').getTime(),
          json: '{"prompt":"b"}',
          favorite: false,
          title: 'Bravo',
          editCount: 2,
          copyCount: 1,
        },
        {
          id: 2,
          date: new Date('2024-01-03').getTime(),
          json: '{"prompt":"a"}',
          favorite: false,
          title: 'Alpha',
          editCount: 1,
          copyCount: 3,
        },
        {
          id: 3,
          date: new Date('2024-01-02').getTime(),
          json: '{"prompt":"c"}',
          favorite: false,
          title: 'Charlie',
          editCount: 5,
          copyCount: 2,
        },
      ];
    renderPanel({ history });
    const getTitles = () =>
      screen
        .getAllByText(/Alpha|Bravo|Charlie/)
        .filter((el) => ['Alpha', 'Bravo', 'Charlie'].includes(el.textContent || ''))
        .map((el) => el.textContent);

    // default sort by date
    expect(getTitles()).toEqual(['Alpha', 'Charlie', 'Bravo']);

    const select = screen.getByRole('combobox', { name: /sort by/i });

    fireEvent.mouseDown(select);
    fireEvent.click(select);
    fireEvent.click(screen.getByRole('option', { name: /name/i }));
    expect(getTitles()).toEqual(['Alpha', 'Bravo', 'Charlie']);

    fireEvent.mouseDown(select);
    fireEvent.click(select);
    fireEvent.click(screen.getByRole('option', { name: /edited/i }));
    expect(getTitles()).toEqual(['Charlie', 'Bravo', 'Alpha']);

    fireEvent.mouseDown(select);
    fireEvent.click(select);
    fireEvent.click(screen.getByRole('option', { name: /copied/i }));
    expect(getTitles()).toEqual(['Alpha', 'Charlie', 'Bravo']);
  });
});

describe('HistoryPanel action history', () => {
  test('exports and clears actions', () => {
    renderPanel();

    const tab = screen.getByRole('tab', { name: /latest actions/i });
    fireEvent.mouseDown(tab);
    fireEvent.click(tab);

    const panel = screen.getByRole('tabpanel', { name: /latest actions/i });
    const exportBtn = within(panel).getByRole('button', { name: /^export$/i });
    fireEvent.click(exportBtn);

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(i18n.t('actionsDownloaded'));

    const events: Event[] = [];
    window.addEventListener('trackingHistoryUpdate', (e) => events.push(e));

    const clearBtn = screen.getByRole('button', { name: /clear actions/i });
    fireEvent.click(clearBtn);
    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }));

    expect(safeRemove).toHaveBeenCalledWith(TRACKING_HISTORY);
    expect(events).toHaveLength(1);
  });

  test('deletes an action entry', () => {
    (safeGet as jest.Mock).mockReturnValue([...sampleActions]);

    const events: Event[] = [];
    window.addEventListener('trackingHistoryUpdate', (e) => events.push(e));

    renderPanel();

    const tab = screen.getByRole('tab', { name: /latest actions/i });
    fireEvent.mouseDown(tab);
    fireEvent.click(tab);

    const panel = screen.getByRole('tabpanel', { name: /latest actions/i });
    const entryText = within(panel).getByText('a');
    const entry = entryText.parentElement!.parentElement!;
    const deleteBtn = within(entry).getByRole('button', {
      name: i18n.t('delete'),
    });
    fireEvent.click(deleteBtn);
    fireEvent.click(deleteBtn);

    expect(safeSet).toHaveBeenCalledWith(TRACKING_HISTORY, [], true);
    expect(events).toHaveLength(1);
  });

  test('dialog content has responsive size classes', () => {
    renderPanel();
    const content = screen.getByTestId('dialog-content');
    const cls = content.className;
    expect(cls).toContain('w-[90vw]');
    expect(cls).toContain('max-w-2xl');
    expect(cls).toContain('h-[80vh]');
    expect(cls).toContain('overflow-hidden');
  });
});
