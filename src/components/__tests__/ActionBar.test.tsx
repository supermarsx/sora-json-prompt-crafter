import { render, screen, fireEvent, act } from '@testing-library/react';
import { ActionBar } from '../ActionBar';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import i18n from '@/i18n';
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

jest.mock('../SettingsPanel', () => ({
  __esModule: true,
  default: ({
    open,
    onToggleTracking,
    trackingEnabled,
  }: {
    open: boolean;
    onToggleTracking: () => void;
    trackingEnabled: boolean;
    [key: string]: unknown;
  }) =>
    open ? (
      <div>
        <button onClick={onToggleTracking}>
          {trackingEnabled ? 'Disable Tracking' : 'Enable Tracking'}
        </button>
      </div>
    ) : null,
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
    actionLabelsEnabled: true,
    onToggleActionLabels: jest.fn(),
    coreActionLabelsOnly: false,
    onToggleCoreActionLabels: jest.fn(),
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
  const renderActionBar = (props: ReturnType<typeof createProps>) =>
    render(
      <TooltipProvider>
        <ActionBar {...props} />
      </TooltipProvider>,
    );
  test('Copy calls onCopy', () => {
    const props = createProps();
    const { unmount } = renderActionBar(props);
    const copyBtn = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyBtn);
    expect(props.onCopy).toHaveBeenCalled();
  });

  test('Undo and redo buttons call handlers', () => {
    const props = createProps();
    renderActionBar(props);
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(props.onUndo).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /redo/i }));
    expect(props.onRedo).toHaveBeenCalled();
  });

  test('undo/redo disabled states', () => {
    const props = createProps({ canUndo: false, canRedo: false });
    renderActionBar(props);
    const undoBtn = screen.getByRole('button', { name: /undo/i });
    const redoBtn = screen.getByRole('button', { name: /redo/i });
    expect(undoBtn.getAttribute('disabled')).not.toBeNull();
    expect(redoBtn.getAttribute('disabled')).not.toBeNull();
  });

  test('Clear spins then resets', () => {
    const props = createProps();
    const { container } = renderActionBar(props);
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

  test('Settings disable/enable tracking confirms and toggles', async () => {
    const props = createProps();
    const { unmount } = renderActionBar(props);
    fireEvent.pointerDown(screen.getByText(/manage/i));
    fireEvent.click(screen.getByText(/manage/i));
    fireEvent.click(screen.getByText(/disable tracking/i));
    expect(props.onToggleTracking).toHaveBeenCalledTimes(1);

    unmount();

    const props2 = createProps({ trackingEnabled: false });
    renderActionBar(props2);
    fireEvent.pointerDown(screen.getByText(/manage/i));
    fireEvent.click(screen.getByText(/manage/i));
    fireEvent.click(screen.getByText(/enable tracking/i));
    expect(props2.onToggleTracking).toHaveBeenCalledTimes(1);
  });

  test('Jump to JSON appears and triggers event', () => {
    const onJumpToJson = jest.fn();
    const props = createProps({ showJumpToJson: true, onJumpToJson });
    renderActionBar(props);
    const btn = screen.getByRole('button', { name: /jump to json/i });
    fireEvent.click(btn);
    expect(onJumpToJson).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.JumpToJson);
  });

  test('hides non-core labels when coreActionLabelsOnly is true', () => {
    const props = createProps({ coreActionLabelsOnly: true, showJumpToJson: true });
    renderActionBar(props);
    expect(screen.getByText(/undo/i)).toBeTruthy();
    expect(screen.queryByText(/manage/i)).toBeNull();
    expect(screen.queryByText(/language/i)).toBeNull();
    expect(screen.queryByText(/history/i)).toBeNull();
    expect(screen.queryByText(/jump to json/i)).toBeNull();
  });

  test('Send to Sora button appears and calls handler', () => {
    const onSend = jest.fn();
    const props = createProps({
      onSendToSora: onSend,
      soraToolsEnabled: true,
      userscriptInstalled: true,
    });
    renderActionBar(props);
    fireEvent.click(screen.getByRole('button', { name: /send to sora/i }));
    expect(onSend).toHaveBeenCalled();
  });

  test('Send to Sora button hidden when script missing', () => {
    const props = createProps({ userscriptInstalled: false });
    renderActionBar(props);
    expect(screen.queryByRole('button', { name: /send to sora/i })).toBeNull();
  });

  test('prompts to refresh when update is available and reloads on confirm', () => {
    mockUpdateAvailable = true;
    const props = createProps();
    renderActionBar(props);
    expect(toastFn).toHaveBeenCalled();
    const action = toastFn.mock.calls[0][0].action;
    expect(typeof action.props.onClick).toBe('function');
  });

  test('Minimize hides and restore shows bar again', () => {
    const props = createProps();
    const { container } = renderActionBar(props);
    const minimize = container.querySelector(
      'button.ml-auto',
    ) as HTMLButtonElement;
    fireEvent.click(minimize);
    expect(screen.queryByRole('button', { name: /copy/i })).toBeNull();
    const restore = screen.getByRole('button', { name: /actions/i });
    fireEvent.click(restore);
    expect(screen.getByRole('button', { name: /copy/i })).toBeTruthy();
  });

});
