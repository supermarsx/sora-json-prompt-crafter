import { render, screen, fireEvent, within } from '@testing-library/react';
import { SettingsLocationSection } from '../sections/SettingsLocationSection';
import i18n from '@/i18n';
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
    const options = {
      ...DEFAULT_OPTIONS,
      use_settings_location: true,
      use_environment: false,
    };
    render(
      <SettingsLocationSection
        options={options}
        updateOptions={updateOptions}
      />,
    );
    fireEvent.click(screen.getByLabelText(i18n.t('useEnvironment')));
    expect(updateOptions).toHaveBeenCalledWith({ use_environment: true });
  });

  test('environment dropdown disabled when flag false and updates when enabled', () => {
    const updateOptions = jest.fn();
    const enabledOptions = {
      ...DEFAULT_OPTIONS,
      use_settings_location: true,
      use_environment: true,
      environment: 'default',
    };
    const { rerender } = render(
      <SettingsLocationSection
        options={enabledOptions}
        updateOptions={updateOptions}
      />,
    );
    let envSection = screen.getByText(i18n.t('environment'))
      .parentElement as HTMLElement;
    let dropdown = within(envSection).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^forest$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ environment: 'forest' });

    const disabledOptions = { ...enabledOptions, use_environment: false };
    rerender(
      <SettingsLocationSection
        options={disabledOptions}
        updateOptions={updateOptions}
      />,
    );
    envSection = screen.getByText(i18n.t('environment'))
      .parentElement as HTMLElement;
    dropdown = within(envSection).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });

  test('time_of_year input updates and disables correctly', () => {
    const updateOptions = jest.fn();
    const enabled = {
      ...DEFAULT_OPTIONS,
      use_settings_location: true,
      use_time_of_year: true,
      time_of_year: 'spring',
    };
    const { rerender } = render(
      <SettingsLocationSection
        options={enabled}
        updateOptions={updateOptions}
      />,
    );
    const input = screen.getByLabelText(i18n.t('timeOfYear'));
    fireEvent.change(input, { target: { value: 'winter' } });
    expect(updateOptions).toHaveBeenCalledWith({ time_of_year: 'winter' });

    const disabled = { ...enabled, use_time_of_year: false };
    rerender(
      <SettingsLocationSection
        options={disabled}
        updateOptions={updateOptions}
      />,
    );
    const disabledInput = screen.getByLabelText(i18n.t('timeOfYear'));
    expect(disabledInput.hasAttribute('disabled')).toBe(true);
  });

  test('location, season and atmosphere mood fields behave correctly', () => {
    const updateOptions = jest.fn();
    let options = {
      ...DEFAULT_OPTIONS,
      use_settings_location: true,
      use_location: false,
      use_season: false,
      use_atmosphere_mood: false,
    };

    const { rerender } = render(
      <SettingsLocationSection
        options={options}
        updateOptions={updateOptions}
      />,
    );

    const locationSection = screen.getByText(i18n.t('location'))
      .parentElement as HTMLElement;
    let locationDropdown = within(locationSection).getByRole('button');
    const seasonSection = screen.getByText(i18n.t('season'))
      .parentElement as HTMLElement;
    let seasonDropdown = within(seasonSection).getByRole('button');
    const moodSection = screen.getByText(i18n.t('atmosphereMood'))
      .parentElement as HTMLElement;
    let moodDropdown = within(moodSection).getByRole('button');

    expect(locationDropdown.hasAttribute('disabled')).toBe(true);
    expect(seasonDropdown.hasAttribute('disabled')).toBe(true);
    expect(moodDropdown.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByLabelText(i18n.t('useLocation')));
    expect(updateOptions).toHaveBeenCalledWith({ use_location: true });
    options = { ...options, use_location: true, location: 'Berlin, Germany' };
    rerender(
      <SettingsLocationSection
        options={options}
        updateOptions={updateOptions}
      />,
    );
    locationDropdown = within(locationSection).getByRole('button');
    expect(locationDropdown.hasAttribute('disabled')).toBe(false);
    fireEvent.click(locationDropdown);
    fireEvent.click(screen.getByRole('button', { name: /^tokyo, japan$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ location: 'Tokyo, Japan' });

    fireEvent.click(screen.getByLabelText(i18n.t('useSeason')));
    expect(updateOptions).toHaveBeenCalledWith({ use_season: true });
    options = { ...options, use_season: true, season: 'default (any season)' };
    rerender(
      <SettingsLocationSection
        options={options}
        updateOptions={updateOptions}
      />,
    );
    seasonDropdown = within(seasonSection).getByRole('button');
    expect(seasonDropdown.hasAttribute('disabled')).toBe(false);
    fireEvent.click(seasonDropdown);
    fireEvent.click(screen.getByRole('button', { name: /^winter$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ season: 'winter' });

    fireEvent.click(screen.getByLabelText(i18n.t('useAtmosphereMood')));
    expect(updateOptions).toHaveBeenCalledWith({ use_atmosphere_mood: true });
    options = {
      ...options,
      use_atmosphere_mood: true,
      atmosphere_mood: 'default (neutral mood)',
    };
    rerender(
      <SettingsLocationSection
        options={options}
        updateOptions={updateOptions}
      />,
    );
    moodDropdown = within(moodSection).getByRole('button');
    expect(moodDropdown.hasAttribute('disabled')).toBe(false);
    fireEvent.click(moodDropdown);
    fireEvent.click(screen.getByRole('button', { name: /mysterious/i }));
    expect(updateOptions).toHaveBeenCalledWith({
      atmosphere_mood: 'mysterious',
    });
  });
});
