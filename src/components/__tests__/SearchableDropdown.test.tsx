import { render, screen, fireEvent } from '@testing-library/react';
import { SearchableDropdown } from '../SearchableDropdown';
import i18n from '@/i18n';
import React from 'react';

function Wrapper({ options }: { options: string[] }) {
  const [value, setValue] = React.useState('');
  return (
    <SearchableDropdown
      options={options}
      value={value}
      onValueChange={setValue}
    />
  );
}

describe('SearchableDropdown', () => {
  const options = ['apple', 'banana', 'apricot'];

  test('filters options based on search query', () => {
    render(
      <SearchableDropdown
        options={options}
        value=""
        onValueChange={() => {}}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('searchablePlaceholder') }),
    );
    const input = screen.getByPlaceholderText(
      i18n.t('searchOptionsPlaceholder'),
    );
    fireEvent.change(input, { target: { value: 'ap' } });

    expect(screen.getByRole('button', { name: 'Apple' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Apricot' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Banana' })).toBeNull();
  });

  test('selecting an option updates value and closes menu', () => {
    render(<Wrapper options={options} />);
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('searchablePlaceholder') }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Banana' }));

    expect(screen.getByRole('button', { name: 'Banana' })).toBeDefined();
    expect(
      screen.queryByPlaceholderText(i18n.t('searchOptionsPlaceholder')),
    ).toBeNull();
  });

  test('disabled state prevents opening', () => {
    render(
      <SearchableDropdown
        options={options}
        value=""
        onValueChange={() => {}}
        disabled
      />,
    );
    const trigger = screen.getByRole('button', {
      name: i18n.t('searchablePlaceholder'),
    });
    expect(trigger.hasAttribute('disabled')).toBe(true);
    fireEvent.click(trigger);
    expect(
      screen.queryByPlaceholderText(i18n.t('searchOptionsPlaceholder')),
    ).toBeNull();
  });
});
