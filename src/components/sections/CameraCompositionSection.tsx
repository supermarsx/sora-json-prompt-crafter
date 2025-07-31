import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { MultiSelectDropdown } from '../MultiSelectDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';
import { cameraOptionTranslations } from '@/data/optionTranslations';
import { getOptionLabel as translateOption } from '@/lib/optionTranslator';
import {
  shotTypeOptions,
  cameraAngleOptions,
  compositionRulesOptions,
  cameraTypeOptions,
  lensTypeOptions,
  apertureOptions,
  blurStyleOptions,
  depthOfFieldOptions,
  subjectFocusOptions,
  type SubjectFocusOption,
} from '@/data/cameraPresets';

interface CameraCompositionSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const CameraCompositionSection: React.FC<
  CameraCompositionSectionProps
> = ({ options, updateOptions, isEnabled, onToggle }) => {
  const { t } = useTranslation();
  const handleCompositionRulesChange = (selectedRules: string[]) => {
    updateOptions({ composition_rules: selectedRules });
  };

  return (
    <CollapsibleSection
      title="Camera & Composition"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>{t('cameraType')}</Label>
          <SearchableDropdown
            options={cameraTypeOptions}
            value={options.camera_type}
            onValueChange={(value) => updateOptions({ camera_type: value })}
            label="Camera Type"
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.cameraType, t)
            }
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_lens_type"
            checked={options.use_lens_type}
            onCheckedChange={(checked) =>
              updateOptions({ use_lens_type: !!checked })
            }
          />
          <Label htmlFor="use_lens_type">{t('useLensType')}</Label>
        </div>

        <div>
          <Label>{t('lensType')}</Label>
          <SearchableDropdown
            options={lensTypeOptions}
            value={options.lens_type}
            onValueChange={(value) => updateOptions({ lens_type: value })}
            label="Lens Type"
            disabled={!options.use_lens_type}
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.lensType, t)
            }
          />
        </div>

        <div>
          <Label>{t('shotType')}</Label>
          <SearchableDropdown
            options={shotTypeOptions}
            value={options.shot_type}
            onValueChange={(value) => updateOptions({ shot_type: value })}
            label="Shot Type"
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.shotType, t)
            }
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_camera_angle"
            checked={options.use_camera_angle}
            onCheckedChange={(checked) =>
              updateOptions({ use_camera_angle: !!checked })
            }
          />
          <Label htmlFor="use_camera_angle">{t('useCameraAngle')}</Label>
        </div>

        <div>
          <Label>{t('cameraAngle')}</Label>
          <SearchableDropdown
            options={cameraAngleOptions}
            value={options.camera_angle}
            onValueChange={(value) => updateOptions({ camera_angle: value })}
            label="Camera Angle"
            disabled={!options.use_camera_angle}
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.cameraAngle, t)
            }
          />
        </div>

        <div>
          <Label htmlFor="subject_focus">{t('subjectFocus')}</Label>
          <Select
            value={options.subject_focus}
            onValueChange={(value: SubjectFocusOption) =>
              updateOptions({ subject_focus: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subjectFocusOptions.map((focus) => (
                <SelectItem key={focus} value={focus}>
                  {translateOption(
                    focus,
                    cameraOptionTranslations.subjectFocus,
                    t,
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('compositionRules')}</Label>
          <MultiSelectDropdown
            options={compositionRulesOptions}
            value={options.composition_rules}
            onValueChange={handleCompositionRulesChange}
            label="Composition Rules"
            placeholder="Select composition rules..."
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.compositionRules, t)
            }
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_aperture"
            checked={options.use_aperture}
            onCheckedChange={(checked) =>
              updateOptions({ use_aperture: !!checked })
            }
          />
          <Label htmlFor="use_aperture">{t('useAperture')}</Label>
        </div>

        <div>
          <Label>{t('aperture')}</Label>
          <SearchableDropdown
            options={apertureOptions}
            value={options.aperture}
            onValueChange={(value) => updateOptions({ aperture: value })}
            label="Aperture"
            disabled={!options.use_aperture}
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.aperture, t)
            }
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_dof"
            checked={options.use_dof}
            onCheckedChange={(checked) => updateOptions({ use_dof: !!checked })}
          />
          <Label htmlFor="use_dof">{t('useDepthOfField')}</Label>
        </div>

        <div>
          <Label>{t('depthOfField')}</Label>
          <SearchableDropdown
            options={depthOfFieldOptions}
            value={options.depth_of_field || 'default'}
            onValueChange={(value) => updateOptions({ depth_of_field: value })}
            label="Depth of Field Options"
            disabled={!options.use_dof}
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.depthOfField, t)
            }
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_blur_style"
            checked={options.use_blur_style}
            onCheckedChange={(checked) =>
              updateOptions({ use_blur_style: !!checked })
            }
          />
          <Label htmlFor="use_blur_style">{t('useBlurStyle')}</Label>
        </div>

        <div>
          <Label>{t('blurStyle')}</Label>
          <SearchableDropdown
            options={blurStyleOptions}
            value={options.blur_style || 'default'}
            onValueChange={(value) => updateOptions({ blur_style: value })}
            label="Blur Style Options"
            disabled={!options.use_blur_style}
            getOptionLabel={(opt) =>
              translateOption(opt, cameraOptionTranslations.blurStyle, t)
            }
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
