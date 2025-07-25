import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

import { materialOptions } from '@/data/materialOptions';
interface MaterialSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

export const MaterialSection: React.FC<MaterialSectionProps> = ({
  options,
  updateOptions,
}) => {
  return (
    <CollapsibleSection
      title="Material"
      isOptional={true}
      isEnabled={options.use_material}
      onToggle={(enabled) => updateOptions({ use_material: enabled })}
    >
      <div className="space-y-4">
        <div>
          <Label>Made Out Of</Label>
          <SearchableDropdown
            options={materialOptions}
            value={options.made_out_of}
            onValueChange={(value) => updateOptions({ made_out_of: value })}
            label="Material Options"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_secondary_material"
            checked={options.use_secondary_material}
            onCheckedChange={(checked) =>
              updateOptions({ use_secondary_material: !!checked })
            }
          />
          <Label htmlFor="use_secondary_material">Use Secondary Material</Label>
        </div>

        <div>
          <Label>Secondary Material</Label>
          <SearchableDropdown
            options={materialOptions}
            value={options.secondary_material || 'default'}
            onValueChange={(value) =>
              updateOptions({ secondary_material: value })
            }
            label="Secondary Material Options"
            disabled={!options.use_secondary_material}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
