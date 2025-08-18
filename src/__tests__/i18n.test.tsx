import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

describe('i18n', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });
    Object.defineProperty(navigator, 'languages', {
      value: ['en-US'],
      configurable: true,
    });
  });

  test('renders spanish translation', async () => {
    const { default: i18n, changeLanguageAsync } = await import('../i18n');
    await changeLanguageAsync('es-ES');
    render(
      <I18nextProvider i18n={i18n}>
        <span>{i18n.t('copy')}</span>
      </I18nextProvider>,
    );
    expect(screen.getByText('Copiar')).toBeTruthy();
  });

  test('falls back to english when language unsupported', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { default: i18n, changeLanguageAsync } = await import('../i18n');
    await changeLanguageAsync('xx');
    render(
      <I18nextProvider i18n={i18n}>
        <span>{i18n.t('copy')}</span>
      </I18nextProvider>,
    );
    expect(screen.getByText('Copy')).toBeTruthy();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  test('detects language from navigator.language', async () => {
    Object.defineProperty(navigator, 'language', {
      value: 'es-ES',
      configurable: true,
    });
    Object.defineProperty(navigator, 'languages', {
      value: ['es-ES'],
      configurable: true,
    });
    const { default: i18n } = await import('../i18n');
    await new Promise((r) => setTimeout(r, 0));
    render(
      <I18nextProvider i18n={i18n}>
        <span>{i18n.t('copy')}</span>
      </I18nextProvider>,
    );
    expect(screen.getByText('Copiar')).toBeTruthy();
  });

  test('falls back to navigator.languages list', async () => {
    Object.defineProperty(navigator, 'language', {
      value: 'xx-YY',
      configurable: true,
    });
    Object.defineProperty(navigator, 'languages', {
      value: ['xx-YY', 'de-DE'],
      configurable: true,
    });
    const { default: i18n } = await import('../i18n');
    await new Promise((r) => setTimeout(r, 0));
    render(
      <I18nextProvider i18n={i18n}>
        <span>{i18n.t('copy')}</span>
      </I18nextProvider>,
    );
    expect(screen.getByText('Kopieren')).toBeTruthy();
  });
});

