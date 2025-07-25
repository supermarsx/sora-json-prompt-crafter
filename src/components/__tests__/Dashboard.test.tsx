import React from 'react';
import {
  render,
  waitFor,
  act,
  screen,
  fireEvent,
} from '@testing-library/react';
import Dashboard from '../Dashboard';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent } from '@/lib/analytics';
import type { SoraOptions } from '@/lib/soraOptions';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { useSoraUserscript } from '@/hooks/use-sora-userscript';

let copyFn: ((json: string) => void) | null = null;
let updateFn: ((opts: Partial<SoraOptions>) => void) | null = null;
const mockUseDarkMode = jest.fn(() => [false, jest.fn()] as const);
let sendFn: (() => void) | null = null;
jest.mock('../HistoryPanel', () => ({
  __esModule: true,
  default: ({ onCopy }: { onCopy: (json: string) => void }) => {
    copyFn = onCopy;
    return null;
  },
}));
jest.mock('../ControlPanel', () => ({
  __esModule: true,
  ControlPanel: ({
    updateOptions,
  }: {
    updateOptions: (opts: Partial<SoraOptions>) => void;
  }) => {
    updateFn = updateOptions;
    return null;
  },
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
jest.mock('../ActionBar', () => {
  const actual = jest.requireActual('../ActionBar');
  return {
    __esModule: true,
    ...actual,
    ActionBar: (props: Record<string, unknown>) => {
      sendFn = props.onSendToSora;
      return actual.ActionBar(props);
    },
  };
});

jest.mock('@/hooks/use-single-column', () => ({
  __esModule: true,
  useIsSingleColumn: jest.fn(() => false),
}));
jest.mock('@/hooks/use-dark-mode', () => ({
  __esModule: true,
  useDarkMode: (...args: unknown[]) => mockUseDarkMode(...args),
}));
jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-action-history', () => ({
  __esModule: true,
  useActionHistory: jest.fn(() => []),
}));
jest.mock('@/hooks/use-sora-userscript', () => ({
  __esModule: true,
  useSoraUserscript: jest.fn(() => [true, '1.0'] as const),
}));
jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUseSoraUserscript = useSoraUserscript as jest.Mock;

describe('Dashboard github stats failure', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    (toast.error as jest.Mock).mockClear();
    localStorage.clear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('shows toast when stats fetch rejects', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('fail')) as unknown as typeof fetch;
    render(<Dashboard />);
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to load GitHub stats'),
    );
  });

  test('shows toast when stats response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn(),
    } as unknown as Response);
    render(<Dashboard />);
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to load GitHub stats'),
    );
  });
});

describe('Dashboard github stats abort', () => {
  const originalFetch = global.fetch;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    warnSpy.mockRestore();
  });

  test('aborts fetch on unmount', async () => {
    let aborted = false;
    global.fetch = jest.fn().mockImplementation((_url, init) => {
      const signal = (init as RequestInit)?.signal;
      signal?.addEventListener('abort', () => {
        aborted = true;
      });
      return new Promise(() => {}) as unknown as Promise<Response>;
    }) as unknown as typeof fetch;

    const { unmount } = render(<Dashboard />);
    unmount();

    expect(aborted).toBe(true);
    await Promise.resolve();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('Dashboard github stats success', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    (toast.error as jest.Mock).mockClear();
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            stargazers_count: 2,
            forks_count: 3,
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            total_count: 4,
          }),
      }) as unknown as typeof fetch;
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('updates state with fetched stats', async () => {
    const { findByText } = render(<Dashboard />);
    expect(await findByText('Star 2')).toBeTruthy();
    expect(await findByText('Fork 3')).toBeTruthy();
    expect(await findByText('Issues 4')).toBeTruthy();
  });
});

describe('copyHistoryEntry', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    (toast.success as jest.Mock).mockClear();
    (trackEvent as jest.Mock).mockClear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('copies entry to clipboard and tracks event', async () => {
    render(<Dashboard />);
    await waitFor(() => expect(copyFn).not.toBeNull());
    await act(async () => {
      copyFn?.('{"a":1}');
      await Promise.resolve();
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{"a":1}');
    expect(toast.success).toHaveBeenCalledWith(
      'Sora JSON copied to clipboard!',
    );
    expect(trackEvent).toHaveBeenCalledWith(true, 'history_copy');
  });
});

describe('Dashboard interactions', () => {
  beforeEach(() => {
    localStorage.clear();
    updateFn = null;
    sendFn = null;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    mockUseDarkMode.mockImplementation(() => [false, jest.fn()] as const);
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('option change updates json and copy stores history', async () => {
    render(<Dashboard />);
    await waitFor(() => expect(updateFn).not.toBeNull());

    act(() => {
      updateFn?.({ prompt: 'foo' });
    });

    await waitFor(() => {
      const json = JSON.parse(localStorage.getItem('currentJson') || '{}');
      expect(json.prompt).toBe('foo');
    });

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await act(async () => {
      fireEvent.click(copyButton);
      await Promise.resolve();
    });

    await waitFor(() => {
      const history = JSON.parse(localStorage.getItem('jsonHistory') || '[]');
      expect(history).toHaveLength(1);
      expect(history[0].json).toContain('foo');
    });
  });

  test('undo and redo revert option changes', async () => {
    render(<Dashboard />);
    await waitFor(() => expect(updateFn).not.toBeNull());

    act(() => {
      updateFn?.({ prompt: 'foo' });
    });

    await waitFor(() => {
      const json = JSON.parse(localStorage.getItem('currentJson') || '{}');
      expect(json.prompt).toBe('foo');
    });

    const undoButton = screen.getByRole('button', { name: /undo/i });
    act(() => {
      fireEvent.click(undoButton);
    });

    await waitFor(() => {
      const json = JSON.parse(localStorage.getItem('currentJson') || '{}');
      expect(json.prompt).toBe(DEFAULT_OPTIONS.prompt);
    });

    const redoButton = screen.getByRole('button', { name: /redo/i });
    act(() => {
      fireEvent.click(redoButton);
    });

    await waitFor(() => {
      const json = JSON.parse(localStorage.getItem('currentJson') || '{}');
      expect(json.prompt).toBe('foo');
    });
  });

  test('dark mode toggle switches icon and sendToSora ACK stops interval', () => {
    jest.useFakeTimers();
    mockUseDarkMode.mockImplementation(() => {
      const [dark, setDark] = React.useState(false);
      return [dark, setDark] as const;
    });
    localStorage.setItem('soraToolsEnabled', 'true');
    const postMessage = jest.fn();
    const win = { postMessage } as unknown as Window;
    const openSpy = jest.spyOn(window, 'open').mockReturnValue(win);
    const addListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeListenerSpy = jest.spyOn(window, 'removeEventListener');

    render(<Dashboard />);

    const toggle = screen.getByLabelText('Toggle dark mode');
    const icon = toggle.querySelector('svg') as SVGSVGElement | null;
    expect(icon?.classList.contains('lucide-moon')).toBe(true);
    act(() => {
      fireEvent.click(toggle);
    });
    const iconAfter = toggle.querySelector('svg') as SVGSVGElement | null;
    expect(iconAfter?.classList.contains('lucide-sun')).toBe(true);

    const sendButton = screen.getByRole('button', { name: /send to sora/i });
    act(() => {
      fireEvent.click(sendButton);
    });
    expect(openSpy).toHaveBeenCalledWith(
      'https://sora.chatgpt.com',
      '_blank',
      'noopener',
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    const handler = addListenerSpy.mock.calls.find(
      (c) => c[0] === 'message',
    )?.[1];

    act(() => {
      jest.advanceTimersByTime(250);
    });

    const callsBefore = postMessage.mock.calls.length;

    act(() => {
      (handler as EventListener)?.({
        source: win,
        data: { type: 'INSERT_SORA_JSON_ACK' },
      } as MessageEvent);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(postMessage.mock.calls.length).toBe(callsBefore);
    expect(removeListenerSpy).toHaveBeenCalledWith('message', handler);

    openSpy.mockRestore();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});

describe('userscript version', () => {
  beforeEach(() => {
    localStorage.setItem('soraToolsEnabled', 'true');
    mockedUseSoraUserscript.mockReturnValue([true, '0.9']);
    (trackEvent as jest.Mock).mockClear();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('shows update button when version differs', () => {
    render(<Dashboard />);
    const btn = screen.getByRole('link', { name: /update userscript/i });
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(trackEvent).toHaveBeenCalledWith(true, 'update_userscript');
  });
});
