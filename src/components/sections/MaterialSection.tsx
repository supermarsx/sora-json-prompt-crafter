import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';

import { materialOptions } from '@/data/materialOptions';
import { mergeCustomValues } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';
interface MaterialSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

/**
 * Section for specifying primary and secondary materials for objects.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Callback to update the options state.
 */
export const MaterialSection: React.FC<MaterialSectionProps> = ({
  options,
  updateOptions,
}) => {
  const { t } = useTranslation();
  const currentValues = {
    use_material: options.use_material,
    made_out_of: options.made_out_of,
    use_secondary_material: options.use_secondary_material,
    secondary_material: options.secondary_material,
  };
  return (
    <CollapsibleSection
      title="Material"
      isOptional={true}
      isEnabled={options.use_material}
      onToggle={(enabled) => updateOptions({ use_material: enabled })}
    >
      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="material"
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
                use_material: DEFAULT_OPTIONS.use_material,
                made_out_of: DEFAULT_OPTIONS.made_out_of,
                use_secondary_material: DEFAULT_OPTIONS.use_secondary_material,
                secondary_material: DEFAULT_OPTIONS.secondary_material,
              })
            }
            className="gap-1"
          >
            <RotateCcw className="w-4 h-4" /> {t('reset')}
          </Button>
        </div>
        <div>
          <Label>{t('madeOutOf')}</Label>
          <SearchableDropdown
            options={mergeCustomValues('material', materialOptions)}
            value={options.made_out_of}
            onValueChange={(value) => updateOptions({ made_out_of: value })}
            label="Material Options"
            optionKey="material"
          />
        </div>

        <ToggleField
          id="use_secondary_material"
          label={t('useSecondaryMaterial')}
          checked={options.use_secondary_material}
          onCheckedChange={(checked) =>
            updateOptions({ use_secondary_material: !!checked })
          }
        >
          <div>
            <Label>{t('secondaryMaterial')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('material', materialOptions)}
              value={options.secondary_material || 'default'}
              onValueChange={(value) =>
                updateOptions({ secondary_material: value })
              }
              label="Secondary Material Options"
              optionKey="material"
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
