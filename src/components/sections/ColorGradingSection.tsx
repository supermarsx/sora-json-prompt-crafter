import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

interface ColorGradingSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

const colorGradingOptions = [
  "default (no specific color grading)",
  "not defined",
  "cinematic",
  "cinematic teal-orange",
  "cinematic blue",
  "cinematic green",
  "blockbuster",
  "vintage film",
  "old Hollywood",
  "technicolor",
  "sepia",
  "classic sepia",
  "monochrome",
  "black and white",
  "high contrast black and white",
  "low contrast black and white",
  "bleach bypass",
  "cross-processed",
  "retro",
  "pastel",
  "pastel neon",
  "muted",
  "muted vintage",
  "faded",
  "washed out",
  "matte",
  "ultra-vivid",
  "vivid",
  "vivid pop",
  "desaturated",
  "de-saturated blues",
  "cool tones",
  "warm tones",
  "cool shadows, warm highlights",
  "warm highlights, cool shadows",
  "teal and orange",
  "orange and teal",
  "golden hour",
  "blue hour",
  "sunset glow",
  "night blue",
  "autumn tones",
  "spring bloom",
  "earthy",
  "rustic",
  "icy blue",
  "emerald green",
  "magenta dream",
  "purple haze",
  "cyan tint",
  "neon",
  "neon glow",
  "duotone",
  "tritone",
  "yellow and blue",
  "red and cyan",
  "split toning",
  "film noir",
  "giallo",
  "moody",
  "dramatic",
  "dreamy",
  "ethereal",
  "infrared",
  "ultraviolet",
  "infrared false color",
  "xpro",
  "cinema verité",
  "HDR",
  "SDR",
  "washed film",
  "cool matte",
  "warm matte",
  "lush greens",
  "icy whites",
  "day for night",
  "Lomo",
  "Kodachrome",
  "Fuji Velvia",
  "Fuji Provia",
  "Fuji Classic Chrome",
  "Portra 400",
  "Portra 800",
  "Ektar 100",
  "Kodak 2383",
  "Fujifilm Eterna",
  "Agfa Ultra",
  "Rec709",
  "Rec2020",
  "Polaroid",
  "Instax",
  "film grain"
];

export const ColorGradingSection: React.FC<ColorGradingSectionProps> = ({
  options,
  updateOptions
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
