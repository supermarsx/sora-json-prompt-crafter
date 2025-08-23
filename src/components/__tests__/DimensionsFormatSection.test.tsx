import { render, screen, fireEvent } from '@testing-library/react';
import { DimensionsFormatSection } from '../sections/DimensionsFormatSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import i18n from '@/i18n';

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
    const ratioLabels =
      (i18n.getResource(
        i18n.language,
        'translation',
        'aspectRatioLabels',
      ) as Record<string, string>) || {};
    fireEvent.click(comboboxes[0]);
    fireEvent.click(
      screen.getByRole('option', { name: ratioLabels['4:3'] })
    );
    expect(updateOptions).toHaveBeenCalledWith({ aspect_ratio: '4:3' });

    fireEvent.click(comboboxes[1]);
    fireEvent.click(
      screen.getByRole('option', { name: i18n.t('qualityOptions.ultra') })
    );
    expect(updateOptions).toHaveBeenCalledWith({ quality: 'ultra' });
  });

  test('output format and dynamic range selections update', () => {
    const updateOptions = jest.fn();
    render(
      <DimensionsFormatSection
        options={{
          ...DEFAULT_OPTIONS,
          use_dimensions_format: true,
          output_format: 'png',
          dynamic_range: 'SDR',
          use_output_format: true,
          use_dynamic_range: true,
        }}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.click(comboboxes[2]);
    fireEvent.click(screen.getByRole('option', { name: /jpg/i }));
    expect(updateOptions).toHaveBeenCalledWith({ output_format: 'jpg' });

    fireEvent.click(comboboxes[3]);
    fireEvent.click(screen.getByRole('option', { name: /hdr/i }));
    expect(updateOptions).toHaveBeenCalledWith({ dynamic_range: 'HDR' });
  });
});
