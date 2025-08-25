import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import i18n from '@/i18n';
import { jest } from '@jest/globals';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return <div>child content</div>;
}

describe('ErrorBoundary', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (trackEvent as jest.Mock).mockClear();
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });
  test('shows fallback and resets on Try Again', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(i18n.t('somethingWentWrong'))).toBeTruthy();
    expect(trackEvent).toHaveBeenCalledWith(
      true,
      AnalyticsEvent.RuntimeError,
      { message: 'boom' },
    );

    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    const button = screen.getByRole('button', { name: i18n.t('tryAgain') });
    fireEvent.click(button);

    expect(screen.queryByText(i18n.t('somethingWentWrong'))).toBeNull();
    expect(screen.getByText('child content')).toBeTruthy();
  });

  test('renders custom fallback and recovers on rerender', () => {
    const { unmount } = render(
      <ErrorBoundary fallback={<div>Oops</div>}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Oops')).toBeTruthy();
    expect(screen.queryByText(/something went wrong/i)).toBeNull();

    unmount();

    render(
      <ErrorBoundary fallback={<div>Oops</div>}>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('Oops')).toBeNull();
    expect(screen.getByText('child content')).toBeTruthy();
  });
});
