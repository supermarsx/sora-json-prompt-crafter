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
import { dndOptionTranslations } from '@/data/optionTranslations';
import { getOptionLabel as translateOption } from '@/lib/optionTranslator';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';
import { mergeCustomValues } from '@/lib/storage';

interface DnDSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Section for configuring Dungeons & Dragons themed options such as race,
 * class, and environment.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Callback to update the options state.
 * @param props.isEnabled - Whether the section is enabled.
 * @param props.onToggle - Handler for enabling or disabling the section.
 */
export const DnDSection: React.FC<DnDSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle,
}) => {
  const { t } = useTranslation();
  const currentValues = {
    use_dnd_character_race: options.use_dnd_character_race,
    dnd_character_race: options.dnd_character_race,
    use_dnd_character_class: options.use_dnd_character_class,
    dnd_character_class: options.dnd_character_class,
    use_dnd_character_background: options.use_dnd_character_background,
    dnd_character_background: options.dnd_character_background,
    use_dnd_character_alignment: options.use_dnd_character_alignment,
    dnd_character_alignment: options.dnd_character_alignment,
    use_dnd_monster_type: options.use_dnd_monster_type,
    dnd_monster_type: options.dnd_monster_type,
    use_dnd_environment: options.use_dnd_environment,
    dnd_environment: options.dnd_environment,
    use_dnd_magic_school: options.use_dnd_magic_school,
    dnd_magic_school: options.dnd_magic_school,
    use_dnd_item_type: options.use_dnd_item_type,
    dnd_item_type: options.dnd_item_type,
  };
  return (
    <CollapsibleSection
      title="Dungeons & Dragons"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="dnd"
            currentValues={currentValues}
            onApply={(values) =>
              updateOptions(values as Partial<SoraOptions>)
            }
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateOptions({
                use_dnd_character_race:
                  DEFAULT_OPTIONS.use_dnd_character_race,
                dnd_character_race: DEFAULT_OPTIONS.dnd_character_race,
                use_dnd_character_class:
                  DEFAULT_OPTIONS.use_dnd_character_class,
                dnd_character_class: DEFAULT_OPTIONS.dnd_character_class,
                use_dnd_character_background:
                  DEFAULT_OPTIONS.use_dnd_character_background,
                dnd_character_background: DEFAULT_OPTIONS.dnd_character_background,
                use_dnd_character_alignment:
                  DEFAULT_OPTIONS.use_dnd_character_alignment,
                dnd_character_alignment: DEFAULT_OPTIONS.dnd_character_alignment,
                use_dnd_monster_type: DEFAULT_OPTIONS.use_dnd_monster_type,
                dnd_monster_type: DEFAULT_OPTIONS.dnd_monster_type,
                use_dnd_environment: DEFAULT_OPTIONS.use_dnd_environment,
                dnd_environment: DEFAULT_OPTIONS.dnd_environment,
                use_dnd_magic_school: DEFAULT_OPTIONS.use_dnd_magic_school,
                dnd_magic_school: DEFAULT_OPTIONS.dnd_magic_school,
                use_dnd_item_type: DEFAULT_OPTIONS.use_dnd_item_type,
                dnd_item_type: DEFAULT_OPTIONS.dnd_item_type,
              })
            }
            className="gap-1"
          >
            <RotateCcw className="w-4 h-4" /> {t('reset')}
          </Button>
        </div>
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
              options={mergeCustomValues('dnd_character_race', characterRaceOptions)}
              value={options.dnd_character_race || 'human'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_race: value })
              }
              label="Character Race Options"
              getOptionLabel={(opt) =>
                translateOption(opt, dndOptionTranslations.characterRace, t)
              }
              optionKey="dnd_character_race"
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
              options={mergeCustomValues('dnd_character_class', characterClassOptions)}
              value={options.dnd_character_class || 'fighter'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_class: value })
              }
              label="Character Class Options"
              getOptionLabel={(opt) =>
                translateOption(opt, dndOptionTranslations.characterClass, t)
              }
              optionKey="dnd_character_class"
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
              options={mergeCustomValues('dnd_character_background', characterBackgroundOptions)}
              value={options.dnd_character_background || 'soldier'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_background: value })
              }
              label="Character Background Options"
              getOptionLabel={(opt) =>
                translateOption(
                  opt,
                  dndOptionTranslations.characterBackground,
                  t,
                )
              }
              optionKey="dnd_character_background"
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
              options={mergeCustomValues('dnd_character_alignment', characterAlignmentOptions)}
              value={options.dnd_character_alignment || 'lawful good'}
              onValueChange={(value) =>
                updateOptions({ dnd_character_alignment: value })
              }
              label="Character Alignment Options"
              getOptionLabel={(opt) =>
                translateOption(
                  opt,
                  dndOptionTranslations.characterAlignment,
                  t,
                )
              }
              optionKey="dnd_character_alignment"
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
              options={mergeCustomValues('dnd_monster_type', monsterTypeOptions)}
              value={options.dnd_monster_type || 'dragon'}
              onValueChange={(value) =>
                updateOptions({ dnd_monster_type: value })
              }
              label="Monster Type Options"
              getOptionLabel={(opt) =>
                translateOption(opt, dndOptionTranslations.monsterType, t)
              }
              optionKey="dnd_monster_type"
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
              options={mergeCustomValues('dnd_environment', dndEnvironmentOptions)}
              value={options.dnd_environment || 'dungeon'}
              onValueChange={(value) =>
                updateOptions({ dnd_environment: value })
              }
              label="D&D Environment Options"
              getOptionLabel={(opt) =>
                translateOption(opt, dndOptionTranslations.environment, t)
              }
              optionKey="dnd_environment"
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
              options={mergeCustomValues('dnd_magic_school', magicSchoolOptions)}
              value={options.dnd_magic_school || 'evocation'}
              onValueChange={(value) =>
                updateOptions({ dnd_magic_school: value })
              }
              label="Magic School Options"
              getOptionLabel={(opt) =>
                translateOption(opt, dndOptionTranslations.magicSchool, t)
              }
              optionKey="dnd_magic_school"
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
              options={mergeCustomValues('dnd_item_type', itemTypeOptions)}
              value={options.dnd_item_type || 'magic sword'}
              onValueChange={(value) => updateOptions({ dnd_item_type: value })}
              label="Item Type Options"
              getOptionLabel={(opt) =>
                translateOption(opt, dndOptionTranslations.itemType, t)
              }
              optionKey="dnd_item_type"
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
