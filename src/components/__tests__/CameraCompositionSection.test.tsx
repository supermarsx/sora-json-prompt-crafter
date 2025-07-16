import { render, screen, fireEvent, within } from '@testing-library/react';
import { CameraCompositionSection } from '../sections/CameraCompositionSection';
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

  test('handleCompositionRulesChange updates composition rules', async () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_camera_composition: true,
      composition_rules: [],
    };

    render(
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /select composition rules/i }),
    );
    const firstCheck = await screen.findByLabelText(/rule of thirds/i);
    fireEvent.click(firstCheck);
    expect(updateOptions).toHaveBeenCalledWith({
      composition_rules: ['rule of thirds'],
    });
  });

  test('toggling checkboxes enables dependent dropdowns', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_camera_composition: true,
      use_lens_type: false,
      use_camera_angle: false,
    };

    const { rerender } = render(
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    let lensDropdown = within(
      screen.getByText('Lens Type').parentElement as HTMLElement,
    ).getByRole('button');
    let angleDropdown = within(
      screen.getByText('Camera Angle').parentElement as HTMLElement,
    ).getByRole('button');

    expect(lensDropdown.hasAttribute('disabled')).toBe(true);
    expect(angleDropdown.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByLabelText(/use lens type/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_lens_type: true });

    const lensEnabled = { ...options, use_lens_type: true };
    rerender(
      <CameraCompositionSection
        options={lensEnabled}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    lensDropdown = within(
      screen.getByText('Lens Type').parentElement as HTMLElement,
    ).getByRole('button');
    expect(lensDropdown.hasAttribute('disabled')).toBe(false);

    fireEvent.click(screen.getByLabelText(/use camera angle/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_camera_angle: true });

    const bothEnabled = { ...lensEnabled, use_camera_angle: true };
    rerender(
      <CameraCompositionSection
        options={bothEnabled}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    angleDropdown = within(
      screen.getByText('Camera Angle').parentElement as HTMLElement,
    ).getByRole('button');
    expect(angleDropdown.hasAttribute('disabled')).toBe(false);
  });

  test('aperture, dof and blur-style toggles enable dropdowns and update values', () => {
    const updateOptions = jest.fn();
    let options = {
      ...DEFAULT_OPTIONS,
      use_camera_composition: true,
      use_aperture: false,
      use_dof: false,
      use_blur_style: false,
    };

    const { rerender } = render(
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const apertureSection = screen.getByText('Aperture')
      .parentElement as HTMLElement;
    let apertureDropdown = within(apertureSection).getByRole('button');
    const dofSection = screen.getByText('Depth of Field')
      .parentElement as HTMLElement;
    let dofDropdown = within(dofSection).getByRole('button');
    const blurSection = screen.getByText('Blur Style')
      .parentElement as HTMLElement;
    let blurDropdown = within(blurSection).getByRole('button');

    expect(apertureDropdown.hasAttribute('disabled')).toBe(true);
    expect(dofDropdown.hasAttribute('disabled')).toBe(true);
    expect(blurDropdown.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByLabelText(/use aperture/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_aperture: true });

    options = {
      ...options,
      use_aperture: true,
      aperture: 'default (auto aperture)',
    };
    rerender(
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    apertureDropdown = within(apertureSection).getByRole('button');
    expect(apertureDropdown.hasAttribute('disabled')).toBe(false);
    fireEvent.click(apertureDropdown);
    fireEvent.click(screen.getByRole('button', { name: /f\/1\.4/i }));
    expect(updateOptions).toHaveBeenCalledWith({
      aperture: 'f/1.4 (classic fast prime, buttery background)',
    });

    fireEvent.click(screen.getByLabelText(/use depth of field/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_dof: true });

    options = { ...options, use_dof: true, depth_of_field: 'default' };
    rerender(
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    dofDropdown = within(dofSection).getByRole('button');
    expect(dofDropdown.hasAttribute('disabled')).toBe(false);
    fireEvent.click(dofDropdown);
    fireEvent.click(
      screen.getByRole('button', { name: /^shallow depth of field$/i }),
    );
    expect(updateOptions).toHaveBeenCalledWith({
      depth_of_field: 'shallow depth of field',
    });

    fireEvent.click(screen.getByLabelText(/use blur style/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_blur_style: true });

    options = { ...options, use_blur_style: true, blur_style: 'default' };
    rerender(
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    blurDropdown = within(blurSection).getByRole('button');
    expect(blurDropdown.hasAttribute('disabled')).toBe(false);
    fireEvent.click(blurDropdown);
    fireEvent.click(screen.getByRole('button', { name: /bokeh blur/i }));
    expect(updateOptions).toHaveBeenCalledWith({ blur_style: 'bokeh blur' });
  });
});
