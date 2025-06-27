import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelectDropdown } from '../MultiSelectDropdown';

describe('MultiSelectDropdown', () => {
  const options = ['foo', 'bar', 'baz'];

  test('opens and closes the dialog', () => {
    render(
      <MultiSelectDropdown
        options={options}
        value={[]}
        onValueChange={() => {}}
      />,
    );

    expect(screen.queryByPlaceholderText(/search options/i)).toBeNull();

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByPlaceholderText(/search options/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByPlaceholderText(/search options/i)).toBeNull();
  });

  test('filters options based on search query', () => {
    render(
      <MultiSelectDropdown
        options={options}
        value={[]}
        onValueChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByPlaceholderText(/search options/i);
    fireEvent.change(input, { target: { value: 'ba' } });

    expect(screen.queryByText('Foo')).toBeNull();
    expect(screen.getByText('Bar')).toBeTruthy();
    expect(screen.getByText('Baz')).toBeTruthy();
  });

  test('selects and deselects options', async () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <MultiSelectDropdown
        options={options}
        value={[]}
        onValueChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    const firstCheck = await screen.findByLabelText('Foo');
    fireEvent.click(firstCheck);
    expect(handleChange).toHaveBeenLastCalledWith(['foo']);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    handleChange.mockClear();
    rerender(
      <MultiSelectDropdown
        options={options}
        value={['foo']}
        onValueChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    const secondCheck = await screen.findByLabelText('Foo');
    fireEvent.click(secondCheck);
    expect(handleChange).toHaveBeenLastCalledWith([]);
  });

  test('selected options appear first in the list', () => {
    render(
      <MultiSelectDropdown
        options={options}
        value={['bar']}
        onValueChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    const checkboxes = screen.getAllByRole('checkbox');
    expect((checkboxes[0] as HTMLElement).id).toBe('bar');
  });
});
