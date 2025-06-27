import { render, screen, fireEvent } from '@testing-library/react';
import { DimensionsFormatSection } from '../DimensionsFormatSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

describe('DimensionsFormatSection', () => {
  test('checkbox toggle updates option', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_dimensions_format: true,
      use_dimensions: false,
    };
    render(
      <DimensionsFormatSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    fireEvent.click(screen.getByLabelText(/use custom dimensions/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_dimensions: true });
  });

  test('dropdown selection calls updateOptions', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_dimensions_format: true,
      aspect_ratio: '16:9',
      quality: 'high',
    };
    render(
      <DimensionsFormatSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.click(comboboxes[0]);
    fireEvent.click(screen.getByRole('option', { name: /4:3/i }));
    expect(updateOptions).toHaveBeenCalledWith({ aspect_ratio: '4:3' });

    fireEvent.click(comboboxes[1]);
    fireEvent.click(screen.getByRole('option', { name: /ultra/i }));
    expect(updateOptions).toHaveBeenCalledWith({ quality: 'ultra' });
  });
});
