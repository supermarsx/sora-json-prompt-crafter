import { render, screen, fireEvent, within } from '@testing-library/react';
import { CameraCompositionSection } from '../CameraCompositionSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('CameraCompositionSection', () => {
  test('checkbox toggle updates option', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_camera_composition: true,
      use_lens_type: false,
    };
    render(
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    fireEvent.click(screen.getByLabelText(/use lens type/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_lens_type: true });
  });

  test('lens type dropdown updates value and respects disabled flag', () => {
    const updateOptions = jest.fn();
    const enabledOptions = {
      ...DEFAULT_OPTIONS,
      use_camera_composition: true,
      use_lens_type: true,
      lens_type: 'default',
    };
    const { rerender } = render(
      <CameraCompositionSection
        options={enabledOptions}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    let lensSection = screen.getByText('Lens Type')
      .parentElement as HTMLElement;
    let dropdown = within(lensSection).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /wide 24mm/i }));
    expect(updateOptions).toHaveBeenCalledWith({ lens_type: 'wide 24mm' });

    const disabledOptions = { ...enabledOptions, use_lens_type: false };
    rerender(
      <CameraCompositionSection
        options={disabledOptions}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    lensSection = screen.getByText('Lens Type').parentElement as HTMLElement;
    dropdown = within(lensSection).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });
});
