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
import { safeGet } from '@/lib/storage';

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  safeGet: jest.fn(),
}));

describe('App dark mode handling', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    (safeGet as jest.Mock).mockReset();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as typeof window.matchMedia;
  });

  test('adds dark class when safeGet returns null', async () => {
    (safeGet as jest.Mock).mockReturnValueOnce(null);
    await act(async () => {
      render(<App />);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('does not add dark class when safeGet returns value', async () => {
    (safeGet as jest.Mock).mockReturnValueOnce('true');
    await act(async () => {
      render(<App />);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
