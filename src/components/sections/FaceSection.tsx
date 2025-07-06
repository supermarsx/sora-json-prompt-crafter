import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

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
          <Label htmlFor="add_same_face">Add the Same Face</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="dont_change_face"
            checked={options.dont_change_face}
            onCheckedChange={(checked) =>
              updateOptions({ dont_change_face: !!checked })
            }
          />
          <Label htmlFor="dont_change_face">Don't Change the Face</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_subject_gender"
            checked={options.use_subject_gender}
            onCheckedChange={(checked) =>
              updateOptions({ use_subject_gender: !!checked })
            }
          />
          <Label htmlFor="use_subject_gender">Use Subject Gender</Label>
        </div>

        <div>
          <Label>Subject Gender</Label>
          <SearchableDropdown
            options={subjectGenderOptions}
            value={options.subject_gender || 'default (auto/inferred gender)'}
            onValueChange={(value) => updateOptions({ subject_gender: value })}
            label="Subject Gender Options"
            disabled={!options.use_subject_gender}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_makeup_style"
            checked={options.use_makeup_style}
            onCheckedChange={(checked) =>
              updateOptions({ use_makeup_style: !!checked })
            }
          />
          <Label htmlFor="use_makeup_style">Use Makeup Style</Label>
        </div>

        <div>
          <Label>Makeup Style</Label>
          <SearchableDropdown
            options={makeupStyleOptions}
            value={options.makeup_style || 'default (no specific makeup)'}
            onValueChange={(value) => updateOptions({ makeup_style: value })}
            label="Makeup Style Options"
            disabled={!options.use_makeup_style}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_character_mood"
            checked={options.use_character_mood}
            onCheckedChange={(checked) =>
              updateOptions({ use_character_mood: !!checked })
            }
          />
          <Label htmlFor="use_character_mood">Use Character Mood</Label>
        </div>

        <div>
          <Label>Character Mood</Label>
          <SearchableDropdown
            options={characterMoodOptions}
            value={options.character_mood || 'default (neutral mood)'}
            onValueChange={(value) => updateOptions({ character_mood: value })}
            label="Character Mood Options"
            disabled={!options.use_character_mood}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
