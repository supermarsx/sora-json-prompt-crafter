import { render, screen, fireEvent } from '@testing-library/react';
import { ColorGradingSection } from '../sections/ColorGradingSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

describe('ColorGradingSection', () => {
  test('toggle checkbox calls updateOptions', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_color_grading: false };
    render(
      <ColorGradingSection options={options} updateOptions={updateOptions} />,
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(updateOptions).toHaveBeenCalledWith({ use_color_grading: true });
  });

  test('selecting option updates value', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_color_grading: true,
      color_grade: 'default (no specific color grading)',
    };
    render(
      <ColorGradingSection options={options} updateOptions={updateOptions} />,
    );
    // open dropdown
    fireEvent.click(screen.getByRole('button', { name: /default/i }));
    // choose a distinct option
    fireEvent.click(screen.getByRole('button', { name: /cinema verité/i }));
    expect(updateOptions).toHaveBeenCalledWith({
      color_grade: 'cinema verité',
    });
  });
});
