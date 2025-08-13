import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { ToggleField } from '../ToggleField';
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
        <ToggleField
          id="use_dnd_character_race"
          label={t('useCharacterRace')}
          checked={options.use_dnd_character_race}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_character_race: !!checked })
          }
        >
          <div>
            <Label>{t('characterRace')}</Label>
            <SearchableDropdown
              options={characterRaceOptions}
              value={options.dnd_character_race || 'human'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_race: value })
              }
              label="Character Race Options"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dnd_character_class"
          label={t('useCharacterClass')}
          checked={options.use_dnd_character_class}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_character_class: !!checked })
          }
        >
          <div>
            <Label>{t('characterClass')}</Label>
            <SearchableDropdown
              options={characterClassOptions}
              value={options.dnd_character_class || 'fighter'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_class: value })
              }
              label="Character Class Options"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dnd_character_background"
          label={t('useCharacterBackground')}
          checked={options.use_dnd_character_background}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_character_background: !!checked })
          }
        >
          <div>
            <Label>{t('characterBackground')}</Label>
            <SearchableDropdown
              options={characterBackgroundOptions}
              value={options.dnd_character_background || 'soldier'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_background: value })
              }
              label="Character Background Options"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dnd_character_alignment"
          label={t('useCharacterAlignment')}
          checked={options.use_dnd_character_alignment}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_character_alignment: !!checked })
          }
        >
          <div>
            <Label>{t('characterAlignment')}</Label>
            <SearchableDropdown
              options={characterAlignmentOptions}
              value={options.dnd_character_alignment || 'lawful good'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_alignment: value })
              }
              label="Character Alignment Options"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dnd_monster_type"
          label={t('useMonsterType')}
          checked={options.use_dnd_monster_type}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_monster_type: !!checked })
          }
        >
          <div>
            <Label>{t('monsterType')}</Label>
            <SearchableDropdown
              options={monsterTypeOptions}
              value={options.dnd_monster_type || 'dragon'}
              onValueChange={(value) =>
                updateOptions({ dnd_monster_type: value })
              }
              label="Monster Type Options"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dnd_environment"
          label={t('useDnDEnvironment')}
          checked={options.use_dnd_environment}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_environment: !!checked })
          }
        >
          <div>
            <Label>{t('dndEnvironment')}</Label>
            <SearchableDropdown
              options={dndEnvironmentOptions}
              value={options.dnd_environment || 'dungeon'}
              onValueChange={(value) =>
                updateOptions({ dnd_environment: value })
              }
              label="D&D Environment Options"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dnd_magic_school"
          label={t('useMagicSchool')}
          checked={options.use_dnd_magic_school}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_magic_school: !!checked })
          }
        >
          <div>
            <Label>{t('magicSchool')}</Label>
            <SearchableDropdown
              options={magicSchoolOptions}
              value={options.dnd_magic_school || 'evocation'}
              onValueChange={(value) =>
                updateOptions({ dnd_magic_school: value })
              }
              label="Magic School Options"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dnd_item_type"
          label={t('useItemType')}
          checked={options.use_dnd_item_type}
          onCheckedChange={(checked) =>
            updateOptions({ use_dnd_item_type: !!checked })
          }
        >
          <div>
            <Label>{t('itemType')}</Label>
            <SearchableDropdown
              options={itemTypeOptions}
              value={options.dnd_item_type || 'magic sword'}
              onValueChange={(value) => updateOptions({ dnd_item_type: value })}
              label="Item Type Options"
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
