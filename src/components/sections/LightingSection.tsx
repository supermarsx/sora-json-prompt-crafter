import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

import { lightingOptions } from '@/data/lightingOptions';
interface LightingSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

export const LightingSection: React.FC<LightingSectionProps> = ({
  options,
  updateOptions,
}) => {
  return (
    <CollapsibleSection
      title="Lighting"
      isOptional={true}
      isEnabled={options.use_lighting}
      onToggle={(enabled) => updateOptions({ use_lighting: enabled })}
    >
      <div className="space-y-4">
        <div>
          <Label>Lighting</Label>
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
