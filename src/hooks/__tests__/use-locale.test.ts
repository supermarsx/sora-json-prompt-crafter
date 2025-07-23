import { renderHook, act } from '@testing-library/react';
import { useLocale } from '../use-locale';
import i18n from '@/i18n';
import * as storage from '@/lib/storage';
import { LOCALE } from '@/lib/storage-keys';

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
    (storage.safeGet as jest.Mock).mockReturnValue('es-ES');
    const { result } = renderHook(() => useLocale());
    expect(result.current[0]).toBe('es-ES');
    expect(storage.safeGet).toHaveBeenCalledWith(LOCALE, 'en-US', false);
  });

  test('updates locale and persists value', () => {
    (storage.safeGet as jest.Mock).mockReturnValue('en-US');
    const { result } = renderHook(() => useLocale());

    act(() => {
      result.current[1]('fr-FR');
    });

    expect(i18n.changeLanguage).toHaveBeenLastCalledWith('fr-FR');
    expect(storage.safeSet).toHaveBeenLastCalledWith(LOCALE, 'fr-FR');
    expect(result.current[0]).toBe('fr-FR');
  });
});
