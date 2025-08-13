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
interface FaceSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

export const FaceSection: React.FC<FaceSectionProps> = ({
  options,
  updateOptions,
}) => {
  const { t } = useTranslation();
  return (
    <CollapsibleSection
      title="Face"
      isOptional={true}
      isEnabled={options.use_face_enhancements}
      onToggle={(enabled) => updateOptions({ use_face_enhancements: enabled })}
    >
      <div className="space-y-4">
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
              options={subjectGenderOptions}
              value={
                options.subject_gender || 'default (auto/inferred gender)'
              }
              onValueChange={(value) => updateOptions({ subject_gender: value })}
              label="Subject Gender Options"
              getOptionLabel={(opt) =>
                translateOption(opt, faceOptionTranslations.subjectGender, t)
              }
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
              options={makeupStyleOptions}
              value={
                options.makeup_style || 'default (no specific makeup)'
              }
              onValueChange={(value) => updateOptions({ makeup_style: value })}
              label="Makeup Style Options"
              getOptionLabel={(opt) =>
                translateOption(opt, faceOptionTranslations.makeupStyle, t)
              }
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
              options={characterMoodOptions}
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
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
