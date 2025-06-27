import { render } from '@testing-library/react';
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

  test('adds dark class when safeGet returns null', () => {
    (safeGet as jest.Mock).mockReturnValueOnce(null);
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('does not add dark class when safeGet returns value', () => {
    (safeGet as jest.Mock).mockReturnValueOnce('true');
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
