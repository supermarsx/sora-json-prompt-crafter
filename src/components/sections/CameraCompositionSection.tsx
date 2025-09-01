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
import { SearchableDropdown } from '../SearchableDropdown';
import { MultiSelectDropdown } from '../MultiSelectDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { ToggleField } from '../ToggleField';
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
import { Button } from '@/components/ui/button';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';

interface CameraCompositionSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Section for configuring camera positioning and composition rules.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options object.
 * @param props.updateOptions - Callback to update the options state.
 * @param props.isEnabled - Whether this section is active.
 * @param props.onToggle - Handler invoked when the section is toggled.
 */
export const CameraCompositionSection: React.FC<
  CameraCompositionSectionProps
> = ({ options, updateOptions, isEnabled, onToggle }) => {
  const { t } = useTranslation();
  /**
   * Updates the set of composition rules selected by the user.
   *
   * @param selectedRules - The chosen composition rule identifiers.
   */
  const handleCompositionRulesChange = (selectedRules: string[]) => {
    updateOptions({ composition_rules: selectedRules });
  };

  /**
   * Resets all camera and composition-related options to their defaults.
   */
  const handleReset = () => {
    updateOptions({
      camera_type: DEFAULT_OPTIONS.camera_type,
      use_lens_type: DEFAULT_OPTIONS.use_lens_type,
      lens_type: DEFAULT_OPTIONS.lens_type,
      use_shot_type: DEFAULT_OPTIONS.use_shot_type,
      shot_type: DEFAULT_OPTIONS.shot_type,
      use_camera_angle: DEFAULT_OPTIONS.use_camera_angle,
      camera_angle: DEFAULT_OPTIONS.camera_angle,
      use_subject_focus: DEFAULT_OPTIONS.use_subject_focus,
      subject_focus: DEFAULT_OPTIONS.subject_focus,
      composition_rules: DEFAULT_OPTIONS.composition_rules,
      use_aperture: DEFAULT_OPTIONS.use_aperture,
      aperture: DEFAULT_OPTIONS.aperture,
      use_dof: DEFAULT_OPTIONS.use_dof,
      depth_of_field: DEFAULT_OPTIONS.depth_of_field,
      use_blur_style: DEFAULT_OPTIONS.use_blur_style,
      blur_style: DEFAULT_OPTIONS.blur_style,
    });
  };
  const currentValues = {
    camera_type: options.camera_type,
    use_lens_type: options.use_lens_type,
    lens_type: options.lens_type,
    use_shot_type: options.use_shot_type,
    shot_type: options.shot_type,
    use_camera_angle: options.use_camera_angle,
    camera_angle: options.camera_angle,
    use_subject_focus: options.use_subject_focus,
    subject_focus: options.subject_focus,
    composition_rules: options.composition_rules,
    use_aperture: options.use_aperture,
    aperture: options.aperture,
    use_dof: options.use_dof,
    depth_of_field: options.depth_of_field,
    use_blur_style: options.use_blur_style,
    blur_style: options.blur_style,
  };

  return (
    <CollapsibleSection
      title="Camera & Composition"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="camera"
            currentValues={currentValues}
            onApply={(values) =>
              updateOptions(values as Partial<SoraOptions>)
            }
          />
          <Button variant="outline" size="sm" onClick={handleReset}>
            {t('reset')}
          </Button>
        </div>
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

        <ToggleField
          id="use_lens_type"
          label={t('useLensType')}
          checked={options.use_lens_type}
          onCheckedChange={(checked) =>
            updateOptions({ use_lens_type: !!checked })
          }
        >
          <div>
            <Label>{t('lensType')}</Label>
            <SearchableDropdown
              options={lensTypeOptions}
              value={options.lens_type}
              onValueChange={(value) => updateOptions({ lens_type: value })}
              label="Lens Type"
              getOptionLabel={(opt) =>
                translateOption(opt, cameraOptionTranslations.lensType, t)
              }
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_shot_type"
          label={t('useShotType')}
          checked={options.use_shot_type}
          onCheckedChange={(checked) =>
            updateOptions({ use_shot_type: !!checked })
          }
        >
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
        </ToggleField>

        <ToggleField
          id="use_camera_angle"
          label={t('useCameraAngle')}
          checked={options.use_camera_angle}
          onCheckedChange={(checked) =>
            updateOptions({ use_camera_angle: !!checked })
          }
        >
          <div>
            <Label>{t('cameraAngle')}</Label>
            <SearchableDropdown
              options={cameraAngleOptions}
              value={options.camera_angle}
              onValueChange={(value) =>
                updateOptions({ camera_angle: value })
              }
              label="Camera Angle"
              getOptionLabel={(opt) =>
                translateOption(opt, cameraOptionTranslations.cameraAngle, t)
              }
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_subject_focus"
          label={t('useSubjectFocus')}
          checked={options.use_subject_focus}
          onCheckedChange={(checked) =>
            updateOptions({ use_subject_focus: !!checked })
          }
        >
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
        </ToggleField>

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

        <ToggleField
          id="use_aperture"
          label={t('useAperture')}
          checked={options.use_aperture}
          onCheckedChange={(checked) =>
            updateOptions({ use_aperture: !!checked })
          }
        >
          <div>
            <Label>{t('aperture')}</Label>
            <SearchableDropdown
              options={apertureOptions}
              value={options.aperture}
              onValueChange={(value) =>
                updateOptions({ aperture: value })
              }
              label="Aperture"
              getOptionLabel={(opt) =>
                translateOption(opt, cameraOptionTranslations.aperture, t)
              }
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_dof"
          label={t('useDepthOfField')}
          checked={options.use_dof}
          onCheckedChange={(checked) =>
            updateOptions({ use_dof: !!checked })
          }
        >
          <div>
            <Label>{t('depthOfField')}</Label>
            <SearchableDropdown
              options={depthOfFieldOptions}
              value={options.depth_of_field || 'default'}
              onValueChange={(value) =>
                updateOptions({ depth_of_field: value })
              }
              label="Depth of Field Options"
              getOptionLabel={(opt) =>
                translateOption(
                  opt,
                  cameraOptionTranslations.depthOfField,
                  t,
                )
              }
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_blur_style"
          label={t('useBlurStyle')}
          checked={options.use_blur_style}
          onCheckedChange={(checked) =>
            updateOptions({ use_blur_style: !!checked })
          }
        >
          <div>
            <Label>{t('blurStyle')}</Label>
            <SearchableDropdown
              options={blurStyleOptions}
              value={options.blur_style || 'default'}
              onValueChange={(value) =>
                updateOptions({ blur_style: value })
              }
              label="Blur Style Options"
              getOptionLabel={(opt) =>
                translateOption(opt, cameraOptionTranslations.blurStyle, t)
              }
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
