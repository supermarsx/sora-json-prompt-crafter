import { render, screen, fireEvent, within } from '@testing-library/react';
import i18n from '@/i18n';
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
        section: i18n.t('characterRace'),
        flag: 'use_dnd_character_race',
      },
      {
        label: /use character class/i,
        section: i18n.t('characterClass'),
        flag: 'use_dnd_character_class',
      },
      {
        label: /use character background/i,
        section: i18n.t('characterBackground'),
        flag: 'use_dnd_character_background',
      },
      {
        label: /use character alignment/i,
        section: i18n.t('characterAlignment'),
        flag: 'use_dnd_character_alignment',
      },
      {
        label: /use monster type/i,
        section: i18n.t('monsterType'),
        flag: 'use_dnd_monster_type',
      },
      {
        label: /use d&d environment/i,
        section: i18n.t('dndEnvironment'),
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

  test('dropdown selections update monster, environment, magic school and item type', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_dnd_section: true,
      use_dnd_monster_type: true,
      dnd_monster_type: 'dragon',
      use_dnd_environment: true,
      dnd_environment: 'dungeon',
      use_dnd_magic_school: true,
      dnd_magic_school: 'evocation',
      use_dnd_item_type: true,
      dnd_item_type: 'magic sword',
    };

    render(
      <DnDSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />,
    );

    const monsterSection = screen.getByText(i18n.t('monsterType'))
      .parentElement as HTMLElement;
    const monsterDropdown = within(monsterSection).getByRole('button');
    fireEvent.click(monsterDropdown);
    fireEvent.click(screen.getByRole('button', { name: /lich/i }));
    expect(updateOptions).toHaveBeenCalledWith({ dnd_monster_type: 'lich' });

    const envSection = screen.getByText(i18n.t('dndEnvironment'))
      .parentElement as HTMLElement;
    const envDropdown = within(envSection).getByRole('button');
    fireEvent.click(envDropdown);
    fireEvent.click(screen.getByRole('button', { name: /cave/i }));
    expect(updateOptions).toHaveBeenCalledWith({ dnd_environment: 'cave' });

    const schoolSection = screen.getByText(i18n.t('magicSchool'))
      .parentElement as HTMLElement;
    const schoolDropdown = within(schoolSection).getByRole('button');
    fireEvent.click(schoolDropdown);
    fireEvent.click(screen.getByRole('button', { name: /illusion/i }));
    expect(updateOptions).toHaveBeenCalledWith({
      dnd_magic_school: 'illusion',
    });

    const itemSection = screen.getByText(i18n.t('itemType'))
      .parentElement as HTMLElement;
    const itemDropdown = within(itemSection).getByRole('button');
    fireEvent.click(itemDropdown);
    fireEvent.click(screen.getByRole('button', { name: /amulet/i }));
    expect(updateOptions).toHaveBeenCalledWith({ dnd_item_type: 'amulet' });
  });
});
