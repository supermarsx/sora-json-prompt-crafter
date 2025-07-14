import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import { jest } from '@jest/globals';

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

    expect(screen.getByText(/something went wrong/i)).toBeTruthy();

    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    const button = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(button);

    expect(screen.queryByText(/something went wrong/i)).toBeNull();
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
