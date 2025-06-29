import { renderHook, act } from '@testing-library/react';
import { useLocale } from '../use-locale';
import i18n from '@/i18n';
import { safeGet, safeSet } from '@/lib/storage';

jest.mock('@/i18n', () => ({
  __esModule: true,
  default: { changeLanguage: jest.fn() },
}));

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  safeGet: jest.fn(),
  safeSet: jest.fn(),
}));

describe('useLocale', () => {
  beforeEach(() => {
    (i18n.changeLanguage as jest.Mock).mockClear();
    (safeGet as jest.Mock).mockReset();
    (safeSet as jest.Mock).mockClear();
  });

  test('initializes state from localStorage', () => {
    (safeGet as jest.Mock).mockReturnValue('es');
    const { result } = renderHook(() => useLocale());
    expect(result.current[0]).toBe('es');
    expect(safeGet).toHaveBeenCalledWith('locale');
  });

  test('updates locale and persists value', () => {
    (safeGet as jest.Mock).mockReturnValue('en');
    const { result } = renderHook(() => useLocale());

    act(() => {
      result.current[1]('fr');
    });

    expect(i18n.changeLanguage).toHaveBeenLastCalledWith('fr');
    expect(safeSet).toHaveBeenLastCalledWith('locale', 'fr');
    expect(result.current[0]).toBe('fr');
  });
});
