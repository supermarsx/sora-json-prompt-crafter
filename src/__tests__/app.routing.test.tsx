import { render, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import App from '../App';
import '@/i18n';

let currentLocation: { pathname: string } | undefined;

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const { MemoryRouter, useLocation } = actual;
  const LocationTracker = () => {
    const loc = useLocation();
    React.useEffect(() => {
      currentLocation = loc;
    }, [loc]);
    return null;
  };
  const MockBrowserRouter = ({ children }: { children?: React.ReactNode }) => (
    <MemoryRouter initialEntries={['/unknown']}>
      <LocationTracker />
      {children}
    </MemoryRouter>
  );
  return {
    __esModule: true,
    ...actual,
    BrowserRouter: MockBrowserRouter,
  };
});

jest.mock('../components/Footer', () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock('../components/DisclaimerModal', () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});
jest.mock('@/hooks/use-github-stats', () => ({
  __esModule: true,
  useGithubStats: jest.fn(() => ({})),
}));

describe('App routing', () => {
  beforeEach(() => {
    currentLocation = undefined;
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('redirects unknown route to root and logs error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);

    await waitFor(() => {
      expect(currentLocation?.pathname).toBe('/');
    });

    expect(errorSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/unknown',
    );
    errorSpy.mockRestore();
  });
});
