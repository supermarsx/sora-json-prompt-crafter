import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';
import { faceOptionTranslations } from '@/data/optionTranslations';
import { getOptionLabel as translateOption } from '@/lib/optionTranslator';

import {
  subjectGenderOptions,
  makeupStyleOptions,
  characterMoodOptions,
} from '@/data/faceOptions';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';
import { mergeCustomValues } from '@/lib/storage';
interface FaceSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

/**
 * Section for managing facial features, gender, makeup, and mood.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Function to update the options state.
 */
export const FaceSection: React.FC<FaceSectionProps> = ({
  options,
  updateOptions,
}) => {
  const { t } = useTranslation();
  const currentValues = {
    use_face_enhancements: options.use_face_enhancements,
    add_same_face: options.add_same_face,
    dont_change_face: options.dont_change_face,
    use_subject_gender: options.use_subject_gender,
    subject_gender: options.subject_gender,
    use_makeup_style: options.use_makeup_style,
    makeup_style: options.makeup_style,
    use_character_mood: options.use_character_mood,
    character_mood: options.character_mood,
  };
  return (
    <CollapsibleSection
      title="Face"
      isOptional={true}
      isEnabled={options.use_face_enhancements}
      onToggle={(enabled) => updateOptions({ use_face_enhancements: enabled })}
    >
      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="face"
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
                use_face_enhancements: DEFAULT_OPTIONS.use_face_enhancements,
                add_same_face: DEFAULT_OPTIONS.add_same_face,
                dont_change_face: DEFAULT_OPTIONS.dont_change_face,
                use_subject_gender: DEFAULT_OPTIONS.use_subject_gender,
                subject_gender: DEFAULT_OPTIONS.subject_gender,
                use_makeup_style: DEFAULT_OPTIONS.use_makeup_style,
                makeup_style: DEFAULT_OPTIONS.makeup_style,
                use_character_mood: DEFAULT_OPTIONS.use_character_mood,
                character_mood: DEFAULT_OPTIONS.character_mood,
              })
            }
            className="gap-1"
          >
            <RotateCcw className="w-4 h-4" /> {t('reset')}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="add_same_face"
            checked={options.add_same_face}
            onCheckedChange={(checked) =>
              updateOptions({ add_same_face: !!checked })
            }
          />
          <Label htmlFor="add_same_face">{t('addSameFace')}</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="dont_change_face"
            checked={options.dont_change_face}
            onCheckedChange={(checked) =>
              updateOptions({ dont_change_face: !!checked })
            }
          />
          <Label htmlFor="dont_change_face">{t('dontChangeFace')}</Label>
        </div>

        <ToggleField
          id="use_subject_gender"
          label={t('useSubjectGender')}
          checked={options.use_subject_gender}
          onCheckedChange={(checked) =>
            updateOptions({ use_subject_gender: !!checked })
          }
        >
          <div>
            <Label>{t('subjectGender')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('subject_gender', subjectGenderOptions)}
              value={
                options.subject_gender || 'default (auto/inferred gender)'
              }
              onValueChange={(value) => updateOptions({ subject_gender: value })}
              label="Subject Gender Options"
              getOptionLabel={(opt) =>
                translateOption(opt, faceOptionTranslations.subjectGender, t)
              }
              optionKey="subject_gender"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_makeup_style"
          label={t('useMakeupStyle')}
          checked={options.use_makeup_style}
          onCheckedChange={(checked) =>
            updateOptions({ use_makeup_style: !!checked })
          }
        >
          <div>
            <Label>{t('makeupStyle')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('makeup_style', makeupStyleOptions)}
              value={
                options.makeup_style || 'default (no specific makeup)'
              }
              onValueChange={(value) => updateOptions({ makeup_style: value })}
              label="Makeup Style Options"
              getOptionLabel={(opt) =>
                translateOption(opt, faceOptionTranslations.makeupStyle, t)
              }
              optionKey="makeup_style"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_character_mood"
          label={t('useCharacterMood')}
          checked={options.use_character_mood}
          onCheckedChange={(checked) =>
            updateOptions({ use_character_mood: !!checked })
          }
        >
          <div>
            <Label>{t('characterMood')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('character_mood', characterMoodOptions)}
              value={
                options.character_mood || 'default (neutral mood)'
              }
              onValueChange={(value) =>
                updateOptions({ character_mood: value })
              }
              label="Character Mood Options"
              getOptionLabel={(opt) =>
                translateOption(opt, faceOptionTranslations.characterMood, t)
              }
              optionKey="character_mood"
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
