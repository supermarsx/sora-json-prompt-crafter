import { render, screen, fireEvent, within } from '@testing-library/react';
import { EnhancementsSection } from '../sections/EnhancementsSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('EnhancementsSection', () => {
  test('checkbox toggle updates option', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_safety_filter: false };
    render(
      <EnhancementsSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    fireEvent.click(screen.getByLabelText(/use safety filter/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_safety_filter: true });
  });

  test('safety filter dropdown updates value and disabled when flag off', () => {
    const updateOptions = jest.fn();
    const enabledOptions = {
      ...DEFAULT_OPTIONS,
      use_safety_filter: true,
      safety_filter: 'moderate',
    };
    const { rerender } = render(
      <EnhancementsSection
        options={enabledOptions}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    let section = screen.getByText('Safety Filter')
      .parentElement as HTMLElement;
    let dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^strict/i }));
    expect(updateOptions).toHaveBeenCalledWith({ safety_filter: 'strict' });

    const disabledOptions = { ...enabledOptions, use_safety_filter: false };
    rerender(
      <EnhancementsSection
        options={disabledOptions}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    section = screen.getByText('Safety Filter').parentElement as HTMLElement;
    dropdown = within(section).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });

  test('other checkbox toggles update options', () => {
    const updateOptions = jest.fn();
    render(
      <EnhancementsSection
        options={DEFAULT_OPTIONS}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const toggles = [
      { label: /prevent deformities/i, flag: 'prevent_deformities' },
      { label: /keep key details/i, flag: 'keep_key_details' },
    ] as const;

    toggles.forEach(({ label, flag }) => {
      fireEvent.click(screen.getByLabelText(label));
      expect(updateOptions).toHaveBeenCalledWith({ [flag]: true });
    });
  });

  test('handleSafetyFilterChange maps values correctly', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_safety_filter: true,
      safety_filter: 'moderate',
    };
    render(
      <EnhancementsSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const section = screen.getByText('Safety Filter')
      .parentElement as HTMLElement;
    const dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(
      screen.getByRole('button', { name: /off \(no filtering/i }),
    );
    expect(updateOptions).toHaveBeenCalledWith({ safety_filter: 'off' });

    fireEvent.click(dropdown);
    fireEvent.click(
      screen.getByRole('button', { name: /high \(safe for work/i }),
    );
    expect(updateOptions).toHaveBeenCalledWith({ safety_filter: 'moderate' });
  });

  test('upscale slider updates value and disables when flag off', () => {
    const updateOptions = jest.fn();
    const enabled = {
      ...DEFAULT_OPTIONS,
      use_upscale_factor: true,
      upscale: 2,
    };
    const { rerender } = render(
      <EnhancementsSection
        options={enabled}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(updateOptions).toHaveBeenCalledWith({ upscale: 2.1 });

    const disabled = { ...enabled, use_upscale_factor: false };
    rerender(
      <EnhancementsSection
        options={disabled}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    const disabledSlider = screen.getByRole('slider');
    expect(disabledSlider.getAttribute('data-disabled')).toBe('');
  });

  test('quality booster toggle enables dropdown and updates value', () => {
    const updateOptions = jest.fn();
    let options = {
      ...DEFAULT_OPTIONS,
      use_quality_booster: false,
    };

    const { rerender } = render(
      <EnhancementsSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const boosterSection = screen.getByText('Quality Booster')
      .parentElement as HTMLElement;
    let dropdown = within(boosterSection).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByLabelText(/use quality booster/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_quality_booster: true });

    options = {
      ...options,
      use_quality_booster: true,
      quality_booster: 'default (standard quality)',
    };
    rerender(
      <EnhancementsSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    dropdown = within(boosterSection).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(false);
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^4k$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ quality_booster: '4K' });
  });
});
