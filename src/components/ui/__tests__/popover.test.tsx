import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popover, PopoverTrigger, PopoverContent } from '../popover';

describe('Popover component', () => {
  test('content toggles on trigger click', () => {
    const handleChange = jest.fn();
    render(
      <Popover onOpenChange={handleChange}>
        <PopoverTrigger>Toggle</PopoverTrigger>
        <PopoverContent>Popover text</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Popover text')).toBeNull();

    fireEvent.click(screen.getByText('Toggle'));

    expect(screen.getByText('Popover text')).toBeDefined();
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
