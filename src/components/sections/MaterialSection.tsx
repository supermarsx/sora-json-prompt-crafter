import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';

import { materialOptions } from '@/data/materialOptions';
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
  return (
    <CollapsibleSection
      title="Material"
      isOptional={true}
      isEnabled={options.use_material}
      onToggle={(enabled) => updateOptions({ use_material: enabled })}
    >
      <div className="space-y-4">
        <div>
          <Label>{t('madeOutOf')}</Label>
          <SearchableDropdown
            options={materialOptions}
            value={options.made_out_of}
            onValueChange={(value) => updateOptions({ made_out_of: value })}
            label="Material Options"
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
              options={materialOptions}
              value={options.secondary_material || 'default'}
              onValueChange={(value) =>
                updateOptions({ secondary_material: value })
              }
              label="Secondary Material Options"
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
