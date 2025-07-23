import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

afterEach(() => {
  i18n.changeLanguage('en-US');
});

test('renders spanish translation', () => {
  i18n.changeLanguage('es-ES');
  render(
    <I18nextProvider i18n={i18n}>
      <span>{i18n.t('copy')}</span>
    </I18nextProvider>,
  );
  expect(screen.getByText('Copiar')).toBeTruthy();
});

test('falls back to english when language unsupported', () => {
  i18n.changeLanguage('xx');
  render(
    <I18nextProvider i18n={i18n}>
      <span>{i18n.t('copy')}</span>
    </I18nextProvider>,
  );
  expect(screen.getByText('Copy')).toBeTruthy();
});
