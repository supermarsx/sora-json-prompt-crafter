import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import App from '../App';
import '@/i18n';

jest.mock('../components/Footer', () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock('../components/DisclaimerModal', () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

jest.mock('@/hooks/use-github-stats', () => ({
  __esModule: true,
  useGithubStats: jest.fn(() => ({})),
}));

beforeAll(() => {
  // simple ResizeObserver mock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: jest.fn().mockResolvedValue(undefined) },
  });
  window.matchMedia = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }) as unknown as typeof window.matchMedia;
});

function openStylePreset() {
  const header = screen.getByText('Style Preset').parentElement as HTMLElement;
  const checkbox = within(header).getByRole('checkbox');
  fireEvent.click(checkbox);
}

describe('App integration flow', () => {
  test('updates JSON and history after user actions', async () => {
    render(<App />);

    const promptInput = await screen.findByLabelText(
      /^prompt$/i,
      {},
      {
        // Loading the lazily imported Dashboard component can
        // take a bit longer on slower CI machines. Allow extra
        // time for the input to appear to avoid flaky failures.
        timeout: 5000,
      },
    );
    fireEvent.change(promptInput, {
      target: { value: 'Integration test prompt' },
    });

    openStylePreset();

    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem('jsonHistory') || '[]'),
      ).toHaveLength(1);
    });

    const current = JSON.parse(localStorage.getItem('currentJson') || '{}');
    expect(current.prompt).toBe('Integration test prompt');
    expect(current).toHaveProperty('style_preset');

    const historyButton = screen.getByText('History');
    fireEvent.click(historyButton);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Integration test prompt')).toBeTruthy();
  }, 10000);
});
