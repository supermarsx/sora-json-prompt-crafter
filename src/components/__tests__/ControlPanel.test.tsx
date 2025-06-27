import { render, screen, fireEvent, within } from '@testing-library/react';
import { ControlPanel } from '../ControlPanel';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('ControlPanel', () => {
  test('renders all sections and handles section toggles', () => {
    const updateOptions = jest.fn();
    const updateNestedOptions = jest.fn();

    render(
      <ControlPanel
        options={DEFAULT_OPTIONS}
        updateOptions={updateOptions}
        updateNestedOptions={updateNestedOptions}
        trackingEnabled={false}
      />,
    );

    // verify each section title renders
    const titles = [
      'Prompt',
      'Core Settings',
      'Dimensions & Format',
      'Style Preset',
      'Camera & Composition',
      'Video & Motion',
      'Material',
      'Lighting',
      'Color Grading',
      'Settings & Location',
      'Face',
      'Enhancements',
      'Dungeons & Dragons',
    ];
    for (const title of titles) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }

    // toggle an optional section (Core Settings)
    const header = screen.getByText('Core Settings')
      .parentElement as HTMLElement;
    const checkbox = within(header).getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(updateOptions).toHaveBeenCalledWith({ use_core_settings: true });
  });
});
