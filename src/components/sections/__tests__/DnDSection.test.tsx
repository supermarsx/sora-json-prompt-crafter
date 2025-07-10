import { render, screen, fireEvent, within } from '@testing-library/react';
import { DnDSection } from '../DnDSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('DnDSection', () => {
  test('checkbox toggles update options and enable dropdowns', () => {
    const updateOptions = jest.fn();
    let options = {
      ...DEFAULT_OPTIONS,
      use_dnd_section: true,
    };

    const { rerender } = render(
      <DnDSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const toggles = [
      {
        label: /use character race/i,
        section: 'Character Race',
        flag: 'use_dnd_character_race',
      },
      {
        label: /use character class/i,
        section: 'Character Class',
        flag: 'use_dnd_character_class',
      },
      {
        label: /use character background/i,
        section: 'Character Background',
        flag: 'use_dnd_character_background',
      },
      {
        label: /use character alignment/i,
        section: 'Character Alignment',
        flag: 'use_dnd_character_alignment',
      },
      {
        label: /use monster type/i,
        section: 'Monster Type',
        flag: 'use_dnd_monster_type',
      },
      {
        label: /use d&d environment/i,
        section: 'D&D Environment',
        flag: 'use_dnd_environment',
      },
      {
        label: /use magic school/i,
        section: 'Magic School',
        flag: 'use_dnd_magic_school',
      },
      {
        label: /use item type/i,
        section: 'Item Type',
        flag: 'use_dnd_item_type',
      },
    ] as const;

    toggles.forEach(({ label, section, flag }) => {
      const dropdown = within(
        screen.getByText(section).parentElement as HTMLElement,
      ).getByRole('button');
      expect(dropdown.hasAttribute('disabled')).toBe(true);

      fireEvent.click(screen.getByLabelText(label));
      expect(updateOptions).toHaveBeenCalledWith({ [flag]: true });

      options = { ...options, [flag]: true };
      rerender(
        <DnDSection
          options={options}
          updateOptions={updateOptions}
          isEnabled={true}
          onToggle={() => {}}
        />,
      );

      const enabledDropdown = within(
        screen.getByText(section).parentElement as HTMLElement,
      ).getByRole('button');
      expect(enabledDropdown.hasAttribute('disabled')).toBe(false);
    });
  });
});
