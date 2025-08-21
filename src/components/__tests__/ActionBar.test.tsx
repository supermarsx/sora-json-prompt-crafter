import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActionBar } from '../ActionBar';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import {
  UNDO_COUNT,
  UNDO_MILESTONES,
  REDO_COUNT,
  REDO_MILESTONES,
} from '@/lib/storage-keys';
import i18n from '@/i18n';

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

jest.mock('@/components/ui/dropdown-menu', () => ({
  __esModule: true,
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
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
  AlertDialogCancel: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

const toastFn = jest.fn();
const mockCheckForUpdate = jest.fn();
let mockUpdateAvailable = false;

jest.mock('@/hooks/use-update-check', () => ({
  __esModule: true,
  useUpdateCheck: () => ({
    checkForUpdate: mockCheckForUpdate,
    updateAvailable: mockUpdateAvailable,
  }),
}));

jest.mock('@/components/ui/use-toast', () => ({
  __esModule: true,
  useToast: () => ({ toast: toastFn, dismiss: jest.fn(), toasts: [] }),
}));

function createProps(
  overrides: Partial<React.ComponentProps<typeof ActionBar>> = {},
) {
  return {
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    canUndo: true,
    canRedo: true,
    onCopy: jest.fn(),
    onClear: jest.fn(),
    onShare: jest.fn(),
    onSendToSora: jest.fn(),
    userscriptInstalled: true,
    onImport: jest.fn(),
    onHistory: jest.fn(),
    onReset: jest.fn(),
    onRegenerate: jest.fn(),
    onRandomize: jest.fn(),
    soraToolsEnabled: true,
    onToggleSoraTools: jest.fn(),
    onToggleTracking: jest.fn(),
    headerButtonsEnabled: true,
    onToggleHeaderButtons: jest.fn(),
    logoEnabled: true,
    onToggleLogo: jest.fn(),
    actionLabelsEnabled: true,
    onToggleActionLabels: jest.fn(),
    copied: false,
    trackingEnabled: true,
    ...overrides,
  } as const;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockUpdateAvailable = false;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('ActionBar', () => {
  test('Copy calls onCopy', () => {
    const props = createProps();
    const { unmount } = render(<ActionBar {...props} />);
    const copyBtn = screen.getByRole('button', { name: /copy/i });
    expect(copyBtn.getAttribute('title')).toBe(i18n.t('copy'));
    fireEvent.click(copyBtn);
    expect(props.onCopy).toHaveBeenCalled();
  });

  test('Undo and redo buttons call handlers', () => {
    const props = createProps();
    render(<ActionBar {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(props.onUndo).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /redo/i }));
    expect(props.onRedo).toHaveBeenCalled();
  });

  test('undo/redo disabled states', () => {
    const props = createProps({ canUndo: false, canRedo: false });
    render(<ActionBar {...props} />);
    const undoBtn = screen.getByRole('button', { name: /undo/i });
    const redoBtn = screen.getByRole('button', { name: /redo/i });
    expect(undoBtn.getAttribute('disabled')).not.toBeNull();
    expect(redoBtn.getAttribute('disabled')).not.toBeNull();
  });

  test('Clear spins then resets', () => {
    const props = createProps();
    const { container } = render(<ActionBar {...props} />);
    const btn = screen.getByRole('button', { name: /clear/i });
    const getIconClass = () =>
      btn.querySelector('svg')?.getAttribute('class') ?? '';

    expect(getIconClass()).not.toContain('animate-spin');
    fireEvent.click(btn);
    expect(props.onClear).toHaveBeenCalled();
    expect(getIconClass()).toContain('animate-spin');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(getIconClass()).not.toContain('animate-spin');
  });

  test('Settings disable/enable tracking confirms and toggles', () => {
    const props = createProps();
    const { unmount } = render(<ActionBar {...props} />);
    fireEvent.click(screen.getByText(/settings/i));
    fireEvent.click(screen.getByText(/disable tracking/i));
    expect(screen.getByText(/disable tracking\?/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/^disable$/i));
    expect(props.onToggleTracking).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Tracking disabled');

    unmount();

    const props2 = createProps({ trackingEnabled: false });
    render(<ActionBar {...props2} />);
    fireEvent.click(screen.getByText(/settings/i));
    fireEvent.click(screen.getByText(/enable tracking/i));
    expect(screen.getByText(/enable tracking\?/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/^enable$/i));
    expect(props2.onToggleTracking).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith('Tracking enabled');
  });

  test('Jump to JSON appears and triggers event', () => {
    const onJumpToJson = jest.fn();
    const props = createProps({ showJumpToJson: true, onJumpToJson });
    render(<ActionBar {...props} />);
    const btn = screen.getByRole('button', { name: /jump to json/i });
    fireEvent.click(btn);
    expect(onJumpToJson).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.JumpToJson);
  });

  test('Send to Sora button appears and calls handler', () => {
    const onSend = jest.fn();
    const props = createProps({
      onSendToSora: onSend,
      soraToolsEnabled: true,
      userscriptInstalled: true,
    });
    render(<ActionBar {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /send to sora/i }));
    expect(onSend).toHaveBeenCalled();
  });

  test('Send to Sora button hidden when script missing', () => {
    const props = createProps({ userscriptInstalled: false });
    render(<ActionBar {...props} />);
    expect(screen.queryByRole('button', { name: /send to sora/i })).toBeNull();
  });

  test('prompts to refresh when update is available and reloads on confirm', () => {
    mockUpdateAvailable = true;
    const props = createProps();
    render(<ActionBar {...props} />);
    expect(toastFn).toHaveBeenCalled();
    const action = toastFn.mock.calls[0][0].action;
    expect(typeof action.props.onClick).toBe('function');
  });

  test('Minimize hides and restore shows bar again', () => {
    const props = createProps();
    const { container } = render(<ActionBar {...props} />);
    const minimize = container.querySelector(
      'button.ml-auto',
    ) as HTMLButtonElement;
    fireEvent.click(minimize);
    expect(screen.queryByRole('button', { name: /copy/i })).toBeNull();
    const restore = screen.getByRole('button', { name: /actions/i });
    fireEvent.click(restore);
    expect(screen.getByRole('button', { name: /copy/i })).toBeTruthy();
  });

  test('undo counter persists and milestone triggers once', () => {
    localStorage.setItem(UNDO_COUNT, '99');
    localStorage.setItem(UNDO_MILESTONES, '[]');
    (trackEvent as jest.Mock).mockClear();
    const props = createProps();
    const { unmount } = render(<ActionBar {...props} />);
    const undoBtn = screen.getByRole('button', { name: /undo/i });
    fireEvent.click(undoBtn);
    expect(JSON.parse(localStorage.getItem(UNDO_COUNT) || '0')).toBe(100);
    let calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Undo100,
    );
    expect(calls.length).toBe(1);
    expect(JSON.parse(localStorage.getItem(UNDO_MILESTONES) || '[]')).toEqual([
      100,
    ]);
    unmount();
    render(<ActionBar {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(JSON.parse(localStorage.getItem(UNDO_COUNT) || '0')).toBe(101);
    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Undo100,
    );
    expect(calls.length).toBe(1);
    expect(JSON.parse(localStorage.getItem(UNDO_MILESTONES) || '[]')).toEqual([
      100,
    ]);
  });

  test('redo counter persists and milestone triggers once', () => {
    localStorage.setItem(REDO_COUNT, '99');
    localStorage.setItem(REDO_MILESTONES, '[]');
    (trackEvent as jest.Mock).mockClear();
    const props = createProps();
    const { unmount } = render(<ActionBar {...props} />);
    const redoBtn = screen.getByRole('button', { name: /redo/i });
    fireEvent.click(redoBtn);
    expect(JSON.parse(localStorage.getItem(REDO_COUNT) || '0')).toBe(100);
    let calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Redo100,
    );
    expect(calls.length).toBe(1);
    expect(JSON.parse(localStorage.getItem(REDO_MILESTONES) || '[]')).toEqual([
      100,
    ]);
    unmount();
    render(<ActionBar {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /redo/i }));
    expect(JSON.parse(localStorage.getItem(REDO_COUNT) || '0')).toBe(101);
    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.Redo100,
    );
    expect(calls.length).toBe(1);
    expect(JSON.parse(localStorage.getItem(REDO_MILESTONES) || '[]')).toEqual([
      100,
    ]);
  });
});
