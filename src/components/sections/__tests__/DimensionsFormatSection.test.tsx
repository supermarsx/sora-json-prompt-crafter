import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '@/i18n';
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
    fireEvent.click(
      screen.getByRole('option', { name: i18n.t('aspectRatioLabels.4:3') }),
    );
    expect(updateOptions).toHaveBeenCalledWith({ aspect_ratio: '4:3' });

    fireEvent.click(comboboxes[1]);
    fireEvent.click(
      screen.getByRole('option', { name: i18n.t('qualityOptions.ultra') }),
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
