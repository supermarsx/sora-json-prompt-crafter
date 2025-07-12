import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../dropdown-menu';

function Example({
  onSelect,
  onSubSelect,
}: {
  onSelect: () => void;
  onSubSelect: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onSelect}>Item One</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={onSubSelect}>Sub Item</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu component', () => {
  test('opens menu and handles item selection', async () => {
    const onSelect = jest.fn();
    const onSubSelect = jest.fn();
    render(<Example onSelect={onSelect} onSubSelect={onSubSelect} />);

    // menu closed by default
    expect(screen.queryByText('Item One')).toBeNull();

    fireEvent.keyDown(screen.getByTestId('trigger'), { key: 'Enter' });
    expect(await screen.findByText('Item One')).toBeDefined();

    fireEvent.click(screen.getByText('Item One'));

    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByText('Item One')).toBeNull();
  });

  test('handles nested sub menu selection and focus', async () => {
    const onSelect = jest.fn();
    const onSubSelect = jest.fn();
    render(<Example onSelect={onSelect} onSubSelect={onSubSelect} />);

    fireEvent.keyDown(screen.getByTestId('trigger'), { key: 'Enter' });
    fireEvent.pointerMove(await screen.findByText('More'));
    fireEvent.keyDown(screen.getByText('More'), { key: 'Enter' });
    fireEvent.click(await screen.findByText('Sub Item'));

    expect(onSubSelect).toHaveBeenCalled();
    expect(screen.queryByText('Sub Item')).toBeNull();
  });
});
