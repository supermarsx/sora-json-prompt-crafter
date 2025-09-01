import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { Slider } from '@/components/ui/slider';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';

import {
  safetyFilterOptions,
  qualityBoosterOptions,
} from '@/data/enhancementOptions';
import { Button } from '@/components/ui/button';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';
interface EnhancementsSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Section for optional output enhancements and safety filters.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Function to update the options state.
 * @param props.isEnabled - Whether the section is active.
 * @param props.onToggle - Handler to enable or disable the section.
 */
export const EnhancementsSection: React.FC<EnhancementsSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle,
}) => {
  const { t } = useTranslation();
  /**
   * Maps the dropdown value to a valid safety filter option.
   *
   * @param value - Selected safety filter option text.
   */
  const handleSafetyFilterChange = (value: string) => {
    // Map string values to the expected type
    let safetyFilter: SoraOptions['safety_filter'];
    if (value.includes('strict')) {
      safetyFilter = 'strict';
    } else if (value.includes('moderate')) {
      safetyFilter = 'moderate';
    } else if (value.includes('off')) {
      safetyFilter = 'off';
    } else {
      safetyFilter = 'moderate'; // default fallback
    }
    updateOptions({ safety_filter: safetyFilter });
  };
  const currentValues = {
    prevent_deformities: options.prevent_deformities,
    use_upscale_factor: options.use_upscale_factor,
    upscale: options.upscale,
    use_safety_filter: options.use_safety_filter,
    safety_filter: options.safety_filter,
    keep_typography_details: options.keep_typography_details,
    use_quality_booster: options.use_quality_booster,
    quality_booster: options.quality_booster,
    enhance_object_reflections: options.enhance_object_reflections,
    keep_key_details: options.keep_key_details,
  };

  return (
    <CollapsibleSection
      title="Enhancements"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="enhancements"
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
                prevent_deformities: DEFAULT_OPTIONS.prevent_deformities,
                use_upscale_factor: DEFAULT_OPTIONS.use_upscale_factor,
                upscale: DEFAULT_OPTIONS.upscale,
                use_safety_filter: DEFAULT_OPTIONS.use_safety_filter,
                safety_filter: DEFAULT_OPTIONS.safety_filter,
                keep_typography_details: DEFAULT_OPTIONS.keep_typography_details,
                use_quality_booster: DEFAULT_OPTIONS.use_quality_booster,
                quality_booster: DEFAULT_OPTIONS.quality_booster,
                enhance_object_reflections:
                  DEFAULT_OPTIONS.enhance_object_reflections,
                keep_key_details: DEFAULT_OPTIONS.keep_key_details,
              })
            }
          >
            {t('reset')}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="prevent_deformities"
            checked={options.prevent_deformities}
            onCheckedChange={(checked) =>
              updateOptions({ prevent_deformities: !!checked })
            }
          />
          <Label htmlFor="prevent_deformities">{t('preventDeformities')}</Label>
        </div>

        <ToggleField
          id="use_upscale_factor"
          label={t('useUpscaleFactor')}
          checked={options.use_upscale_factor}
          onCheckedChange={(checked) =>
            updateOptions({ use_upscale_factor: !!checked })
          }
        >
          <div>
            <Label htmlFor="upscale">
              {t('upscaleFactorLabel', { value: options.upscale })}
            </Label>
            <Slider
              value={[options.upscale]}
              onValueChange={(value) => updateOptions({ upscale: value[0] })}
              min={1}
              max={4}
              step={0.1}
              className="mt-2"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_safety_filter"
          label={t('useSafetyFilter')}
          checked={options.use_safety_filter}
          onCheckedChange={(checked) =>
            updateOptions({ use_safety_filter: !!checked })
          }
        >
          <div>
            <Label>{t('safetyFilter')}</Label>
            <SearchableDropdown
              options={safetyFilterOptions}
              value={
                options.safety_filter || 'default (auto safety level)'
              }
              onValueChange={handleSafetyFilterChange}
              label="Safety Filter Options"
            />
          </div>
        </ToggleField>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="keep_typography_details"
            checked={options.keep_typography_details}
            onCheckedChange={(checked) =>
              updateOptions({ keep_typography_details: !!checked })
            }
          />
          <Label htmlFor="keep_typography_details">
            {t('keepTypographyDetails')}
          </Label>
        </div>

        <ToggleField
          id="use_quality_booster"
          label={t('useQualityBooster')}
          checked={options.use_quality_booster}
          onCheckedChange={(checked) =>
            updateOptions({ use_quality_booster: !!checked })
          }
        >
          <div>
            <Label>{t('qualityBooster')}</Label>
            <SearchableDropdown
              options={qualityBoosterOptions}
              value={
                options.quality_booster || 'default (standard quality)'
              }
              onValueChange={(value) =>
                updateOptions({ quality_booster: value })
              }
              label="Quality Booster Options"
            />
          </div>
        </ToggleField>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="enhance_object_reflections"
            checked={options.enhance_object_reflections}
            onCheckedChange={(checked) =>
              updateOptions({ enhance_object_reflections: !!checked })
            }
          />
          <Label htmlFor="enhance_object_reflections">
            {t('enhanceObjectReflections')}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="keep_key_details"
            checked={options.keep_key_details}
            onCheckedChange={(checked) =>
              updateOptions({ keep_key_details: !!checked })
            }
          />
          <Label htmlFor="keep_key_details">{t('keepKeyDetails')}</Label>
        </div>
      </div>
    </CollapsibleSection>
  );
};
