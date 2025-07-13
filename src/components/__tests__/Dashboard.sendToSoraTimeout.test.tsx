import { render, act } from '@testing-library/react';
import Dashboard from '../Dashboard';

let sendFn: (() => void) | null = null;

jest.mock('../ActionBar', () => ({
  __esModule: true,
  ActionBar: ({ onSendToSora }: { onSendToSora: () => void }) => {
    sendFn = onSendToSora;
    return null;
  },
}));
jest.mock('../HistoryPanel', () => ({ __esModule: true, default: () => null }));
jest.mock('../ControlPanel', () => ({
  __esModule: true,
  ControlPanel: () => null,
}));
jest.mock('../ShareModal', () => ({
  __esModule: true,
  ShareModal: () => null,
}));
jest.mock('../ImportModal', () => ({ __esModule: true, default: () => null }));
jest.mock('../Footer', () => ({ __esModule: true, default: () => null }));
jest.mock('../DisclaimerModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../ProgressBar', () => ({
  __esModule: true,
  ProgressBar: () => null,
  default: () => null,
}));

jest.mock('@/hooks/use-single-column', () => ({
  __esModule: true,
  useIsSingleColumn: jest.fn(() => false),
}));
jest.mock('@/hooks/use-dark-mode', () => ({
  __esModule: true,
  useDarkMode: jest.fn(() => [false, jest.fn()] as const),
}));
jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-sora-tools', () => ({
  __esModule: true,
  useSoraTools: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-header-buttons', () => ({
  __esModule: true,
  useHeaderButtons: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-logo', () => ({
  __esModule: true,
  useLogo: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-action-labels', () => ({
  __esModule: true,
  useActionLabels: jest.fn(() => [false, jest.fn()] as const),
}));
jest.mock('@/hooks/use-sora-userscript', () => ({
  __esModule: true,
  useSoraUserscript: jest.fn(() => [true, '1.0'] as const),
}));
jest.mock('@/hooks/use-action-history', () => ({
  __esModule: true,
  useActionHistory: jest.fn(() => []),
}));
jest.mock('@/hooks/use-github-stats', () => ({
  __esModule: true,
  useGithubStats: jest.fn(() => ({})),
}));

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('sendToSora timeout', () => {
  let openSpy: jest.SpyInstance;
  let addListenerSpy: jest.SpyInstance;
  let removeListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    openSpy = jest.spyOn(window, 'open');
    addListenerSpy = jest.spyOn(window, 'addEventListener');
    removeListenerSpy = jest.spyOn(window, 'removeEventListener');
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    openSpy.mockRestore();
    addListenerSpy.mockRestore();
    removeListenerSpy.mockRestore();
  });

  test('interval stops after timeout when no ACK received', () => {
    const postMessage = jest.fn();
    const win = { postMessage } as unknown as Window;
    openSpy.mockReturnValue(win);

    render(<Dashboard />);
    expect(sendFn).not.toBeNull();

    act(() => {
      sendFn!();
    });
    expect(openSpy).toHaveBeenCalledWith(
      'https://sora.chatgpt.com',
      '_blank',
      'noopener',
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(postMessage.mock.calls.length).toBeGreaterThan(0);
    const callsBefore = postMessage.mock.calls.length;

    act(() => {
      jest.advanceTimersByTime(9000);
    });

    const callsAfterTimeout = postMessage.mock.calls.length;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(postMessage.mock.calls.length).toBe(callsAfterTimeout);
    expect(callsBefore).toBeLessThanOrEqual(callsAfterTimeout);
    expect(removeListenerSpy).toHaveBeenCalledWith(
      'message',
      expect.any(Function),
    );
  });
});
