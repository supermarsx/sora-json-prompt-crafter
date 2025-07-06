import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

import { colorGradingOptions } from '@/data/colorGradingOptions';
interface ColorGradingSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

export const ColorGradingSection: React.FC<ColorGradingSectionProps> = ({
  options,
  updateOptions,
}) => {
  return (
    <CollapsibleSection
      title="Color Grading"
      isOptional={true}
      isEnabled={options.use_color_grading}
      onToggle={(enabled) => updateOptions({ use_color_grading: enabled })}
    >
      <div className="space-y-4">
        <div>
          <Label>Color Grade</Label>
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
