import { render, screen, fireEvent } from '@testing-library/react';
import { StyleSection } from '../StyleSection';
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
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.click(comboboxes[1]);
    fireEvent.click(screen.getByRole('option', { name: /film still/i }));
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
