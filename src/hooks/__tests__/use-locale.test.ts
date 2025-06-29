import { renderHook, act } from '@testing-library/react';
import { useLocale } from '../use-locale';
import i18n from '@/i18n';
import * as storage from '@/lib/storage';

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
    jest.clearAllMocks();
  });

  test('initializes state from localStorage', () => {
    (storage.safeGet as jest.Mock).mockReturnValue('es');
    const { result } = renderHook(() => useLocale());
    expect(result.current[0]).toBe('es');
    expect(storage.safeGet).toHaveBeenCalledWith('locale');
  });

  test('updates locale and persists value', () => {
    (storage.safeGet as jest.Mock).mockReturnValue('en');
    const { result } = renderHook(() => useLocale());

    act(() => {
      result.current[1]('fr');
    });

    expect(i18n.changeLanguage).toHaveBeenLastCalledWith('fr');
    expect(storage.safeSet).toHaveBeenLastCalledWith('locale', 'fr');
    expect(result.current[0]).toBe('fr');
  });
});
