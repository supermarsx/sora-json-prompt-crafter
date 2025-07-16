import { render, screen, fireEvent, within } from '@testing-library/react';
import { VideoMotionSection } from '../sections/VideoMotionSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('VideoMotionSection', () => {
  test('checkbox toggle updates option and input disabled when flag false', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_duration: false };
    const { rerender } = render(
      <VideoMotionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    const checkbox = screen.getByLabelText(/use duration/i);
    fireEvent.click(checkbox);
    expect(updateOptions).toHaveBeenCalledWith({ use_duration: true });

    const input = screen.getByLabelText(
      /duration \(seconds\)/i,
    ) as HTMLInputElement;
    expect(input.hasAttribute('disabled')).toBe(true);

    const enabledOptions = { ...options, use_duration: true };
    rerender(
      <VideoMotionSection
        options={enabledOptions}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    const enabledInput = screen.getByLabelText(/duration \(seconds\)/i);
    expect(enabledInput.hasAttribute('disabled')).toBe(false);
  });

  test('extended fps toggle adjusts max value', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, extended_fps: false };
    const { rerender } = render(
      <VideoMotionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    let fpsInput = screen.getByLabelText(/^fps$/i) as HTMLInputElement;
    expect(fpsInput.getAttribute('max')).toBe('60');

    fireEvent.click(screen.getByLabelText(/extended fps/i));
    expect(updateOptions).toHaveBeenCalledWith({ extended_fps: true });

    const enabledOptions = { ...options, extended_fps: true };
    rerender(
      <VideoMotionSection
        options={enabledOptions}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    fpsInput = screen.getByLabelText(/^fps$/i) as HTMLInputElement;
    expect(fpsInput.getAttribute('max')).toBe('240');
  });

  test('extended motion strength toggle adjusts slider max', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, extended_motion_strength: false };
    const { rerender } = render(
      <VideoMotionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    let slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuemax')).toBe('1');

    fireEvent.click(screen.getByLabelText(/extended motion strength/i));
    expect(updateOptions).toHaveBeenCalledWith({
      extended_motion_strength: true,
    });

    const enabledOptions = { ...options, extended_motion_strength: true };
    rerender(
      <VideoMotionSection
        options={enabledOptions}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuemax')).toBe('10');
  });

  test('dropdown selections trigger updateOptions', () => {
    const updateOptions = jest.fn();
    render(
      <VideoMotionSection
        options={DEFAULT_OPTIONS}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const cameraMotionSection = screen.getByText('Camera Motion')
      .parentElement as HTMLElement;
    const cameraDropdown = within(cameraMotionSection).getByRole('combobox');
    fireEvent.click(cameraDropdown);
    fireEvent.click(screen.getByRole('option', { name: /pan left/i }));
    expect(updateOptions).toHaveBeenCalledWith({ camera_motion: 'pan_left' });

    const directionSection = screen.getByText('Motion Direction')
      .parentElement as HTMLElement;
    const directionDropdown = within(directionSection).getByRole('combobox');
    fireEvent.click(directionDropdown);
    fireEvent.click(screen.getByRole('option', { name: /backward/i }));
    expect(updateOptions).toHaveBeenCalledWith({
      motion_direction: 'backward',
    });

    const interpolationSection = screen.getByText('Frame Interpolation')
      .parentElement as HTMLElement;
    const interpolationDropdown =
      within(interpolationSection).getByRole('combobox');
    fireEvent.click(interpolationDropdown);
    fireEvent.click(screen.getByRole('option', { name: /realistic/i }));
    expect(updateOptions).toHaveBeenCalledWith({
      frame_interpolation: 'realistic',
    });
  });
});
