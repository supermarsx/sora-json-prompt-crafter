import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from '../slider';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Slider component', () => {
  test('renders with role slider', () => {
    render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole('slider')).toBeDefined();
  });

  test('calls onValueChange when value changes', () => {
    const handleChange = jest.fn();
    render(<Slider defaultValue={[0]} onValueChange={handleChange} step={1} />);

    const thumb = screen.getByRole('slider');
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });

    expect(handleChange).toHaveBeenCalled();
  });
});
