import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import { jest } from '@jest/globals';
import i18n from '@/i18n';

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

    expect(screen.getByText(i18n.t('errorTitle'))).toBeTruthy();

    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    const button = screen.getByRole('button', { name: i18n.t('tryAgain') });
    fireEvent.click(button);

    expect(screen.queryByText(i18n.t('errorTitle'))).toBeNull();
    expect(screen.getByText('child content')).toBeTruthy();
  });

  test('renders custom fallback and recovers on rerender', () => {
    const { unmount } = render(
      <ErrorBoundary fallback={<div>Oops</div>}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Oops')).toBeTruthy();
    expect(screen.queryByText(i18n.t('errorTitle'))).toBeNull();

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
