import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

interface LightingSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

const lightingOptions = [
  "default (auto lighting)",
  "not defined",
  "natural light",
  "direct sunlight",
  "diffused sunlight",
  "soft natural",
  "hard natural",
  "window light",
  "overcast",
  "golden hour",
  "blue hour",
  "sunrise",
  "sunset",
  "dappled sunlight",
  "moonlight",
  "twilight",
  "dawn",
  "backlight",
  "rim light",
  "edge light",
  "side light",
  "split light",
  "top light",
  "bottom light",
  "underlight",
  "uplighting",
  "downlighting",
  "ambient light",
  "soft ambient",
  "studio light",
  "three-point lighting",
  "butterfly lighting",
  "Rembrandt lighting",
  "loop lighting",
  "broad lighting",
  "short lighting",
  "clamshell lighting",
  "ring light",
  "beauty dish",
  "softbox",
  "octabox",
  "hard light",
  "soft light",
  "spotlight",
  "key light",
  "fill light",
  "hair light",
  "catchlight",
  "practical lighting",
  "motivated lighting",
  "cinematic lighting",
  "dramatic lighting",
  "moody lighting",
  "high-key lighting",
  "low-key lighting",
  "harsh lighting",
  "diffused lighting",
  "glowing",
  "glare",
  "lens flare",
  "bokeh lights",
  "colored light",
  "RGB lighting",
  "neon lighting",
  "fluorescent lighting",
  "incandescent lighting",
  "tungsten lighting",
  "LED lighting",
  "candlelight",
  "torchlight",
  "firelight",
  "lantern light",
  "streetlight",
  "headlights",
  "car lights",
  "spotlights",
  "searchlights",
  "stage lighting",
  "concert lighting",
  "strobe lighting",
  "light painting",
  "chiaroscuro",
  "silhouette",
  "shadow play",
  "patterned light",
  "projected light",
  "reflected light",
  "bounce lighting",
  "underwater lighting",
  "volumetric lighting",
  "god rays",
  "crepuscular rays",
  "foggy light",
  "hazy light",
  "misty light",
  "storm lighting",
  "lightning",
  "bioluminescence",
  "glow in the dark",
  "magic light",
  "fairy lights",
  "crystal lighting",
  "laser lighting",
  "fiber optic lighting",
  "psychedelic lighting"
];

export const LightingSection: React.FC<LightingSectionProps> = ({ options, updateOptions }) => {
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
