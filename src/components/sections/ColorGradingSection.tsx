import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

import { colorGradingOptions } from '@/data/colorGradingOptions';
import { Button } from '@/components/ui/button';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
interface ColorGradingSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

/**
 * Section for selecting overall color grading presets.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Callback to update the options state.
 */
export const ColorGradingSection: React.FC<ColorGradingSectionProps> = ({
  options,
  updateOptions,
}) => {
  const { t } = useTranslation();

  const handleReset = () => {
    updateOptions({
      use_color_grading: DEFAULT_OPTIONS.use_color_grading,
      color_grade: DEFAULT_OPTIONS.color_grade,
    });
  };
  return (
    <CollapsibleSection
      title="Color Grading"
      isOptional={true}
      isEnabled={options.use_color_grading}
      onToggle={(enabled) => updateOptions({ use_color_grading: enabled })}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>
            {t('reset')}
          </Button>
        </div>
        <div>
          <Label>{t('colorGrade')}</Label>
          <SearchableDropdown
            options={colorGradingOptions}
            value={options.color_grade || 'default (no specific color grading)'}
            onValueChange={(value) => updateOptions({ color_grade: value })}
            label="Color Grade Options"
            disabled={!options.use_color_grading}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
