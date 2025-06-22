
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { Slider } from '@/components/ui/slider';
import type { SoraOptions } from '@/lib/soraOptions';

interface EnhancementsSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const safetyFilterOptions = [
  "default (auto safety level)", "not defined", "strict (max filtering, safest)",
  "high (safe for work, minimal risk)", "moderate (balanced, most non-explicit allowed)",
  "low (mild filter, mild suggestive OK)", "off (no filtering, everything allowed)"
];

const qualityBoosterOptions = [
  "default (standard quality)", "not defined", "high resolution", "2K", "4K", "8K",
  "ultra HD", "super-resolution", "clear", "good lighting", "excellent lighting",
  "perfect lighting", "detailed", "very detailed", "extremely detailed",
  "hyper-detailed", "high definition", "sharp focus", "razor sharp focus",
  "intricate", "finely textured", "complex details", "beautiful", "stunning",
  "gorgeous", "masterpiece", "art station quality", "deviantart quality",
  "best quality", "highest quality", "realistic", "ultra-realistic",
  "photo-realistic", "realistic+++", "CGI-quality", "studio lighting",
  "professional photography", "award-winning", "flawless", "immaculate",
  "pristine", "complementary colors", "color harmony", "cinematic quality",
  "dynamic composition", "exquisite rendering"
];

export const EnhancementsSection: React.FC<EnhancementsSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle
}) => {
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

  return (
    <CollapsibleSection
      title="Enhancements"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="prevent_deformities"
            checked={options.prevent_deformities}
            onCheckedChange={(checked) => updateOptions({ prevent_deformities: !!checked })}
          />
          <Label htmlFor="prevent_deformities">Prevent Deformities</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_upscale_factor"
            checked={options.use_upscale_factor}
            onCheckedChange={(checked) => updateOptions({ use_upscale_factor: !!checked })}
          />
          <Label htmlFor="use_upscale_factor">Use Upscale Factor</Label>
        </div>

        <div>
          <Label htmlFor="upscale">Upscale Factor: {options.upscale}</Label>
          <Slider
            value={[options.upscale]}
            onValueChange={(value) => updateOptions({ upscale: value[0] })}
            min={1}
            max={4}
            step={0.1}
            className="mt-2"
            disabled={!options.use_upscale_factor}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_safety_filter"
            checked={options.use_safety_filter}
            onCheckedChange={(checked) => updateOptions({ use_safety_filter: !!checked })}
          />
          <Label htmlFor="use_safety_filter">Use Safety Filter</Label>
        </div>

        <div>
          <Label>Safety Filter</Label>
          <SearchableDropdown
            options={safetyFilterOptions}
            value={options.safety_filter || 'default (auto safety level)'}
            onValueChange={handleSafetyFilterChange}
            label="Safety Filter Options"
            disabled={!options.use_safety_filter}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="keep_typography_details"
            checked={options.keep_typography_details}
            onChec kedChange={(checked) => updateOptions({ keep_typography_details: !!checked })}
          />
          <Label htmlFor="keep_typography_details">Keep Typography Details</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_quality_booster"
            checked={options.use_quality_booster}
            onCheckedChange={(checked) => updateOptions({ use_quality_booster: !!checked })}
          />
          <Label htmlFor="use_quality_booster">Use Quality Booster</Label>
        </div>

        <div>
          <Label>Quality Booster</Label>
          <SearchableDropdown
            options={qualityBoosterOptions}
            value={options.quality_booster || 'default (standard quality)'}
            onValueChange={(value) => updateOptions({ quality_booster: value })}
            label="Quality Booster Options"
            disabled={!options.use_quality_booster}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="enhance_object_reflections"
            checked={options.enhance_object_reflections}
            onCheckedChange={(checked) => updateOptions({ enhance_object_reflections: !!checked })}
          />
          <Label htmlFor="enhance_object_reflections">Enhance Object Reflections</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="keep_key_details"
            checked={options.keep_key_details}
            onCheckedChange={(checked) => updateOptions({ keep_key_details: !!checked })}
          />
          <Label htmlFor="keep_key_details">Keep Key Details</Label>
        </div>
      </div>
    </CollapsibleSection>
  );
};
