import { render, act } from '@testing-library/react';

// Mock components that rely on import.meta to avoid syntax errors in Jest
jest.mock('../components/Footer', () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock('../components/Dashboard', () => ({
  __esModule: true,
  default: () => <div />,
}));

import App from '../App';
import '../i18n';
import { DARK_MODE } from '@/lib/storage-keys';

describe('App dark mode handling', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('adds dark class when matchMedia prefers dark', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('respects localStorage value over matchMedia', async () => {
    localStorage.setItem(DARK_MODE, 'false');
    await act(async () => {
      render(<App />);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
