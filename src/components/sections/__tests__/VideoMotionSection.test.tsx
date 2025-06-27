import { render, screen, fireEvent } from '@testing-library/react';
import { VideoMotionSection } from '../VideoMotionSection';
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

    const input = screen.getByLabelText(/duration \(seconds\)/i) as HTMLInputElement;
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
});
