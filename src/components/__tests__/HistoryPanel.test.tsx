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
import { trackEvent } from '@/lib/analytics';
import { formatDateTime } from '@/lib/date';
import { safeGet, safeSet, safeRemove } from '@/lib/storage';
import { TRACKING_HISTORY } from '@/lib/storage-keys';

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

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  safeGet: jest.fn(),
  safeSet: jest.fn(),
  safeRemove: jest.fn(),
  getJson: jest.fn(),
  setJson: jest.fn(),
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

const sampleHistory = [{ id: 1, date: 'd', json: '{"prompt":"a"}' }];
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
  };
  return render(<HistoryPanel {...defaultProps} {...props} />);
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
  test('exports to clipboard and file', async () => {
    renderPanel();
    const exportBtn = screen.getByRole('button', { name: /export/i });
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

    const exportBtn = screen.getByRole('button', { name: /export/i });
    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    fireEvent.click(screen.getByText(/copy all to clipboard/i));

    expect(toast.error).toHaveBeenCalledWith(i18n.t('clipboardUnsupported'));
    expect(trackEvent).not.toHaveBeenCalledWith(
      expect.anything(),
      'history_export',
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

    const exportBtn = screen.getByRole('button', { name: /export/i });
    fireEvent.mouseDown(exportBtn);
    fireEvent.click(exportBtn);
    fireEvent.click(screen.getByText(/copy all to clipboard/i));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(toast.success).not.toHaveBeenCalledWith(i18n.t('copiedAllHistory'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('delete and clear callbacks fire and timers reset', () => {
    const onDelete = jest.fn();
    const onClear = jest.fn();
    renderPanel({ onDelete, onClear });

    const delBtn = screen.getByRole('button', { name: /delete/i });
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
    expect(deleteBtn.getAttribute('aria-label')).toBe(i18n.t('delete'));
    fireEvent.click(deleteBtn);
    expect(deleteBtn.getAttribute('aria-label')).toBe(i18n.t('confirm'));
    fireEvent.click(deleteBtn);

    expect(safeSet).toHaveBeenCalledWith(TRACKING_HISTORY, [], true);
    expect(events).toHaveLength(1);
  });
});
