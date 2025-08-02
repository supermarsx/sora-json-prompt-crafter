import { render, screen, fireEvent, within } from '@testing-library/react';
import { StyleSection } from '../sections/StyleSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('StyleSection', () => {
  test('selecting style updates options', () => {
    const updateNestedOptions = jest.fn();
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_style_preset: true };
    render(
      <StyleSection
        options={options}
        updateNestedOptions={updateNestedOptions}
        updateOptions={updateOptions}
      />,
    );
    const section = screen.getByText('Style').parentElement as HTMLElement;
    const dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    const input = screen.getByPlaceholderText('Search options...');
    fireEvent.change(input, { target: { value: 'film' } });
    fireEvent.click(screen.getByRole('button', { name: /film still/i }));
    expect(updateNestedOptions).toHaveBeenCalledWith(
      'style_preset.style',
      'film still',
    );
  });

  test('changing style category updates nested options', () => {
    const updateNestedOptions = jest.fn();
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_style_preset: true };
    render(
      <StyleSection
        options={options}
        updateNestedOptions={updateNestedOptions}
        updateOptions={updateOptions}
      />,
    );
    const categoryDropdown = screen.getAllByRole('combobox')[0];
    fireEvent.click(categoryDropdown);
    fireEvent.click(
      screen.getByRole('option', { name: /modern digital & illustration/i }),
    );
    expect(updateNestedOptions).toHaveBeenCalledWith(
      'style_preset.category',
      'Modern Digital & Illustration',
    );
  });
});
