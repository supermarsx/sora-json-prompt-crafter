import { render, screen, fireEvent, within } from '@testing-library/react';
import { EnhancementsSection } from '../EnhancementsSection';
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
});
