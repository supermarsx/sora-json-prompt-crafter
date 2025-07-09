import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../select';

describe('Select component', () => {
  test('renders trigger', () => {
    render(
      <Select>
        <SelectTrigger>Open</SelectTrigger>
        <SelectContent />
      </Select>,
    );
    expect(screen.getByText('Open')).toBeDefined();
  });

  test('calls onValueChange when item selected', () => {
    const handleChange = jest.fn();
    render(
      <Select onValueChange={handleChange}>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByText('Two'));

    expect(handleChange).toHaveBeenCalledWith('two');
  });
});
