import { render, screen, fireEvent, within } from '@testing-library/react';
import { LightingSection } from '../LightingSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('LightingSection', () => {
  test('lighting dropdown updates value', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_lighting: true, lighting: '' };
    render(<LightingSection options={options} updateOptions={updateOptions} />);
    const dropdown = screen.getByRole('button', { name: /select lighting/i });
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /natural light/i }));
    expect(updateOptions).toHaveBeenCalledWith({ lighting: 'natural light' });
  });

  test('dropdown disabled when use_lighting is false', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_lighting: false };
    render(<LightingSection options={options} updateOptions={updateOptions} />);
    const dropdown = screen.getByRole('button', { name: /select lighting/i });
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });
});
