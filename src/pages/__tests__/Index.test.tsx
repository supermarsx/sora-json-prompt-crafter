import { render, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import Index from '@/pages/Index';

const errorBoundarySpy = jest.fn();

jest.mock('@/components/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => {
    errorBoundarySpy();
    return <div data-testid="error-boundary">{children}</div>;
  },
}));

jest.mock('@/components/Dashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-dashboard">Dashboard</div>,
}));

describe('Index page', () => {
  test('renders Dashboard inside ErrorBoundary', async () => {
    render(<Index />);
    await waitFor(() => screen.getByTestId('mock-dashboard'));
    expect(screen.getByTestId('mock-dashboard')).toBeTruthy();
    expect(screen.getByTestId('error-boundary')).toBeTruthy();
    expect(errorBoundarySpy).toHaveBeenCalled();
  });
});
