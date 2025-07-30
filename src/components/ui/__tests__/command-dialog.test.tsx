import React from 'react';
import { render } from '@testing-library/react';
import { CommandDialog, CommandInput } from '../command';

describe('CommandDialog accessibility', () => {
  test('renders without console warnings', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <CommandDialog open onOpenChange={() => {}}>
        <CommandInput placeholder="search" />
      </CommandDialog>,
    );

    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
