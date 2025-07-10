import { render, screen, fireEvent, within } from '@testing-library/react';
import { MaterialSection } from '../MaterialSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('MaterialSection', () => {
  test('checkbox toggle updates option', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_material: true,
      use_secondary_material: false,
    };
    render(<MaterialSection options={options} updateOptions={updateOptions} />);
    fireEvent.click(screen.getByLabelText(/use secondary material/i));
    expect(updateOptions).toHaveBeenCalledWith({
      use_secondary_material: true,
    });
  });

  test('secondary material dropdown updates value and disabled when flag off', () => {
    const updateOptions = jest.fn();
    const enabledOptions = {
      ...DEFAULT_OPTIONS,
      use_material: true,
      use_secondary_material: true,
      secondary_material: 'default',
    };
    const { rerender } = render(
      <MaterialSection
        options={enabledOptions}
        updateOptions={updateOptions}
      />,
    );
    const section = screen.getByText('Secondary Material')
      .parentElement as HTMLElement;
    let dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^wood$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ secondary_material: 'wood' });

    const disabledOptions = {
      ...enabledOptions,
      use_secondary_material: false,
    };
    rerender(
      <MaterialSection
        options={disabledOptions}
        updateOptions={updateOptions}
      />,
    );
    dropdown = within(section).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });

  test('made out of dropdown updates value', () => {
    const updateOptions = jest.fn();
    render(
      <MaterialSection
        options={{
          ...DEFAULT_OPTIONS,
          use_material: true,
          made_out_of: 'default',
        }}
        updateOptions={updateOptions}
      />,
    );

    const section = screen.getByText('Made Out Of')
      .parentElement as HTMLElement;
    const dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^wood$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ made_out_of: 'wood' });
  });
});
