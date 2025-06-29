import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

test('renders spanish translation', () => {
  i18n.changeLanguage('es');
  render(
    <I18nextProvider i18n={i18n}>
      <span>{i18n.t('copy')}</span>
    </I18nextProvider>,
  );
  expect(screen.getByText('Copiar')).toBeTruthy();
});
