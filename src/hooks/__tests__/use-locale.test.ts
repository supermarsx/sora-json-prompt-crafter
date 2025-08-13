import { renderHook, act } from '@testing-library/react';
import { useLocale } from '../use-locale';
import { changeLanguageAsync } from '@/i18n';
import * as storage from '@/lib/storage';
import { LOCALE } from '@/lib/storage-keys';

jest.mock('@/i18n', () => ({
  __esModule: true,
  changeLanguageAsync: jest.fn(),
}));

jest.mock('@/lib/storage', () => ({
  __esModule: true,
  safeGet: jest.fn(),
  safeSet: jest.fn(),
  safeRemove: jest.fn(),
}));

describe('useLocale', () => {
  const originalLanguage = navigator.language;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window.navigator, 'language', {
      value: originalLanguage,
      configurable: true,
    });
  });

  test('initializes state from localStorage', () => {
    (storage.safeGet as jest.Mock).mockReturnValue('es-ES');
    const { result } = renderHook(() => useLocale());
    expect(result.current[0]).toBe('es-ES');
    expect(storage.safeGet).toHaveBeenCalledWith(LOCALE, 'en-US', false);
  });

  test('auto-detects locale from navigator.language', () => {
    (storage.safeGet as jest.Mock).mockReturnValue(undefined);
    Object.defineProperty(window.navigator, 'language', {
      value: 'fr-CA',
      configurable: true,
    });
    const { result } = renderHook(() => useLocale());
    expect(result.current[0]).toBe('fr-FR');
    expect(storage.safeGet).toHaveBeenCalledWith(LOCALE, 'fr-FR', false);
    expect(changeLanguageAsync).toHaveBeenLastCalledWith('fr-FR');
  });

  test('updates locale and persists value', () => {
    (storage.safeGet as jest.Mock).mockReturnValue('en-US');
    const { result } = renderHook(() => useLocale());

    act(() => {
      result.current[1]('fr');
    });

    expect(changeLanguageAsync).toHaveBeenLastCalledWith('fr-FR');
    expect(storage.safeSet).toHaveBeenLastCalledWith(LOCALE, 'fr-FR');
    expect(result.current[0]).toBe('fr-FR');
  });
});

describe('changeLanguageAsync offline', () => {
  test('loads translations from cache when offline', async () => {
    jest.resetModules();
    jest.unmock('@/i18n');
    const translations: Record<string, unknown> = {
      '/locales/en-US.json': { greeting: 'Hello' },
      '/locales/es-ES.json': { greeting: 'Hola' },
    };
    const match = jest.fn().mockImplementation((req: RequestInfo) => {
      const key = typeof req === 'string' ? req : req.url;
      const data = translations[key];
      return Promise.resolve(
        data ? ({ json: async () => data } as Response) : undefined,
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).caches = {
      match,
      open: jest.fn().mockResolvedValue({ put: jest.fn() }),
    };
    const fetchMock = jest.fn().mockRejectedValue(new Error('network'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch = fetchMock;

    const i18nModule = await import('@/i18n');
    await i18nModule.changeLanguageAsync('es-ES');

    expect(fetchMock).not.toHaveBeenCalled();
    expect(match).toHaveBeenCalledWith('/locales/es-ES.json');
    expect(i18nModule.default.t('greeting', { lng: 'es-ES' })).toBe('Hola');
  });
});
