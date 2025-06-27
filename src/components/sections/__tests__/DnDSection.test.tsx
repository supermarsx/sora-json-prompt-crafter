import { render, screen, fireEvent } from '@testing-library/react';
import { DnDSection } from '../DnDSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

describe('DnDSection', () => {
  test('checkbox toggle updates option', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_dnd_section: true,
      use_dnd_character_race: false,
    };
    render(
      <DnDSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    const checkbox = screen.getByLabelText(/use character race/i);
    fireEvent.click(checkbox);
    expect(updateOptions).toHaveBeenCalledWith({
      use_dnd_character_race: true,
    });
  });

  test('dropdown selection calls updateOptions', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_dnd_section: true,
      use_dnd_character_race: true,
      dnd_character_race: 'human',
    };
    render(
      <DnDSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /human/i }));
    fireEvent.click(screen.getByRole('button', { name: /tortle/i }));
    expect(updateOptions).toHaveBeenCalledWith({
      dnd_character_race: 'tortle',
    });
  });
});
