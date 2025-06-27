import { render, screen, fireEvent, within } from '@testing-library/react';
import { SettingsLocationSection } from '../SettingsLocationSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('SettingsLocationSection', () => {
  test('checkbox toggle updates option', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_settings_location: true, use_environment: false };
    render(<SettingsLocationSection options={options} updateOptions={updateOptions} />);
    fireEvent.click(screen.getByLabelText(/use environment/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_environment: true });
  });

  test('environment dropdown disabled when flag false and updates when enabled', () => {
    const updateOptions = jest.fn();
    const enabledOptions = { ...DEFAULT_OPTIONS, use_settings_location: true, use_environment: true, environment: 'default' };
    const { rerender } = render(
      <SettingsLocationSection options={enabledOptions} updateOptions={updateOptions} />,
    );
    let envSection = screen.getByText('Environment').parentElement as HTMLElement;
    let dropdown = within(envSection).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^forest$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ environment: 'forest' });

    const disabledOptions = { ...enabledOptions, use_environment: false };
    rerender(<SettingsLocationSection options={disabledOptions} updateOptions={updateOptions} />);
    envSection = screen.getByText('Environment').parentElement as HTMLElement;
    dropdown = within(envSection).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });
});
