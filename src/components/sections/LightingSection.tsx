import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

import { lightingOptions } from '@/data/lightingOptions';
import { Button } from '@/components/ui/button';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';
interface LightingSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

/**
 * Section for selecting lighting presets to influence scene illumination.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Callback to update the options state.
 */
export const LightingSection: React.FC<LightingSectionProps> = ({
  options,
  updateOptions,
}) => {
  const { t } = useTranslation();
  const currentValues = {
    use_lighting: options.use_lighting,
    lighting: options.lighting,
  };
  return (
    <CollapsibleSection
      title="Lighting"
      isOptional={true}
      isEnabled={options.use_lighting}
      onToggle={(enabled) => updateOptions({ use_lighting: enabled })}
    >
      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="lighting"
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
                use_lighting: DEFAULT_OPTIONS.use_lighting,
                lighting: DEFAULT_OPTIONS.lighting,
              })
            }
          >
            {t('reset')}
          </Button>
        </div>
        <div>
          <Label>{t('lighting')}</Label>
          <SearchableDropdown
            options={lightingOptions}
            value={options.lighting || ''}
            onValueChange={(value) => updateOptions({ lighting: value })}
            label="Lighting Options"
            placeholder="Select lighting..."
            disabled={!options.use_lighting}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
