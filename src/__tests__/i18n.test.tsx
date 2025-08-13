import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n, { changeLanguageAsync } from '../i18n';

afterEach(async () => {
  await changeLanguageAsync('en-US');
});

test('renders spanish translation', async () => {
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
