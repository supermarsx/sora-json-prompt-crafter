import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';
import {
  characterRaceOptions,
  characterClassOptions,
  characterBackgroundOptions,
  characterAlignmentOptions,
  monsterTypeOptions,
  dndEnvironmentOptions,
  magicSchoolOptions,
  itemTypeOptions,
} from '@/data/dndPresets';

interface DnDSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const DnDSection: React.FC<DnDSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle,
}) => {
  const { t } = useTranslation();
  return (
    <CollapsibleSection
      title="Dungeons & Dragons"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_character_race"
            checked={options.use_dnd_character_race}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_character_race: !!checked })
            }
          />
          <Label htmlFor="use_dnd_character_race">
            {t('useCharacterRace')}
          </Label>
        </div>

        <div>
          <Label>{t('characterRace')}</Label>
          <SearchableDropdown
            options={characterRaceOptions}
            value={options.dnd_character_race || 'human'}
            onValueChange={(value) =>
              updateOptions({ dnd_character_race: value })
            }
            label="Character Race Options"
            disabled={!options.use_dnd_character_race}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_character_class"
            checked={options.use_dnd_character_class}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_character_class: !!checked })
            }
          />
          <Label htmlFor="use_dnd_character_class">
            {t('useCharacterClass')}
          </Label>
        </div>

        <div>
          <Label>{t('characterClass')}</Label>
          <SearchableDropdown
            options={characterClassOptions}
            value={options.dnd_character_class || 'fighter'}
            onValueChange={(value) =>
              updateOptions({ dnd_character_class: value })
            }
            label="Character Class Options"
            disabled={!options.use_dnd_character_class}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_character_background"
            checked={options.use_dnd_character_background}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_character_background: !!checked })
            }
          />
          <Label htmlFor="use_dnd_character_background">
            {t('useCharacterBackground')}
          </Label>
        </div>

        <div>
          <Label>{t('characterBackground')}</Label>
          <SearchableDropdown
            options={characterBackgroundOptions}
            value={options.dnd_character_background || 'soldier'}
            onValueChange={(value) =>
              updateOptions({ dnd_character_background: value })
            }
            label="Character Background Options"
            disabled={!options.use_dnd_character_background}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_character_alignment"
            checked={options.use_dnd_character_alignment}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_character_alignment: !!checked })
            }
          />
          <Label htmlFor="use_dnd_character_alignment">
            {t('useCharacterAlignment')}
          </Label>
        </div>

        <div>
          <Label>{t('characterAlignment')}</Label>
          <SearchableDropdown
            options={characterAlignmentOptions}
            value={options.dnd_character_alignment || 'lawful good'}
            onValueChange={(value) =>
              updateOptions({ dnd_character_alignment: value })
            }
            label="Character Alignment Options"
            disabled={!options.use_dnd_character_alignment}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_monster_type"
            checked={options.use_dnd_monster_type}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_monster_type: !!checked })
            }
          />
          <Label htmlFor="use_dnd_monster_type">{t('useMonsterType')}</Label>
        </div>

        <div>
          <Label>{t('monsterType')}</Label>
          <SearchableDropdown
            options={monsterTypeOptions}
            value={options.dnd_monster_type || 'dragon'}
            onValueChange={(value) =>
              updateOptions({ dnd_monster_type: value })
            }
            label="Monster Type Options"
            disabled={!options.use_dnd_monster_type}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_environment"
            checked={options.use_dnd_environment}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_environment: !!checked })
            }
          />
          <Label htmlFor="use_dnd_environment">{t('useDnDEnvironment')}</Label>
        </div>

        <div>
          <Label>{t('dndEnvironment')}</Label>
          <SearchableDropdown
            options={dndEnvironmentOptions}
            value={options.dnd_environment || 'dungeon'}
            onValueChange={(value) => updateOptions({ dnd_environment: value })}
            label="D&D Environment Options"
            disabled={!options.use_dnd_environment}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_magic_school"
            checked={options.use_dnd_magic_school}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_magic_school: !!checked })
            }
          />
          <Label htmlFor="use_dnd_magic_school">{t('useMagicSchool')}</Label>
        </div>

        <div>
          <Label>{t('magicSchool')}</Label>
          <SearchableDropdown
            options={magicSchoolOptions}
            value={options.dnd_magic_school || 'evocation'}
            onValueChange={(value) =>
              updateOptions({ dnd_magic_school: value })
            }
            label="Magic School Options"
            disabled={!options.use_dnd_magic_school}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_dnd_item_type"
            checked={options.use_dnd_item_type}
            onCheckedChange={(checked) =>
              updateOptions({ use_dnd_item_type: !!checked })
            }
          />
          <Label htmlFor="use_dnd_item_type">{t('useItemType')}</Label>
        </div>

        <div>
          <Label>{t('itemType')}</Label>
          <SearchableDropdown
            options={itemTypeOptions}
            value={options.dnd_item_type || 'magic sword'}
            onValueChange={(value) => updateOptions({ dnd_item_type: value })}
            label="Item Type Options"
            disabled={!options.use_dnd_item_type}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
